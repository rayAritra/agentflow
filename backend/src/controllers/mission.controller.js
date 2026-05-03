import Mission from '../models/Mission.model.js';
import { queueMission } from '../services/queue.service.js';

export const createMission = async (req, res) => {
  try {
    const { prompt, urls } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Please provide a prompt' });
    }

    // Create mission record
    const mission = await Mission.create({
      user: req.user.id,
      prompt,
      urls: urls || [],
      status: 'pending',
    });

    // Add to BullMQ queue
    const job = await queueMission({
      missionId: mission._id.toString(),
      prompt,
      urls: urls || [],
    });

    mission.jobId = job.id;
    await mission.save();

    res.status(201).json({
      success: true,
      data: mission,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMissions = async (req, res) => {
  try {
    const missions = await Mission.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: missions.length,
      data: missions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ success: false, message: 'Mission not found' });
    }

    // Make sure user owns mission
    if (mission.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: mission,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

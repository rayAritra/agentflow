import Exercise from '../models/Exercise.model.js';

export const getExercises = async (req, res) => {
  try {
    const { search, muscleGroup } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (muscleGroup && muscleGroup !== 'All') {
      query.muscleGroup = muscleGroup;
    }

    const exercises = await Exercise.find(query).sort({ name: 1 });
    res.status(200).json({ success: true, count: exercises.length, data: exercises });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

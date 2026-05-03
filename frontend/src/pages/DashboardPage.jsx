import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { missionAPI } from '../services/api.service';
import MissionCard from '../components/dashboard/MissionCard';
import { Loader2, PlusCircle, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const [missions, setMissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const { data } = await missionAPI.getAll();
        setMissions(data.data);
      } catch (error) {
        toast.error('Failed to load missions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMissions();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Missions</h1>
          <p className="text-gray-400">View and manage your AI research tasks.</p>
        </div>
        <Link to="/new-mission" className="btn-primary flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          New Mission
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : missions.length === 0 ? (
        <div className="card text-center py-16">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <Inbox className="w-8 h-8 text-gray-500" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No missions yet</h3>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto">
            Create your first mission to let the AI agents do the research for you.
          </p>
          <Link to="/new-mission" className="btn-primary inline-flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Start Research
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => (
            <MissionCard key={mission._id} mission={mission} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

import { format } from 'date-fns';
import { Trophy } from 'lucide-react';

const PRTable = ({ prs }) => {
  if (!prs || prs.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 text-sm">
        No personal records found yet. Log some workouts!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-zinc-500 uppercase bg-zinc-900 border-b border-zinc-800">
          <tr>
            <th className="px-4 py-3 font-medium rounded-tl-lg">Exercise</th>
            <th className="px-4 py-3 font-medium text-right">Max Weight</th>
            <th className="px-4 py-3 font-medium rounded-tr-lg">Date Achieved</th>
          </tr>
        </thead>
        <tbody>
          {prs.map((pr, index) => (
            <tr key={index} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
              <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                {index < 3 && <Trophy className={`w-4 h-4 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-zinc-300' : 'text-amber-600'}`} />}
                {pr.name}
              </td>
              <td className="px-4 py-3 text-right font-bold text-lime-400">
                {pr.maxWeight} kg
              </td>
              <td className="px-4 py-3 text-zinc-400">
                {format(new Date(pr.date), 'MMM d, yyyy')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PRTable;

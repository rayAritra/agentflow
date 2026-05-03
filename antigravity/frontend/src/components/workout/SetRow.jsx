import { Check } from 'lucide-react';

const SetRow = ({ setIndex, set, onUpdate, onRemove }) => {
  return (
    <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${set.completed ? 'bg-lime-400/5' : 'hover:bg-zinc-800/50'}`}>
      <div className="w-12 text-center text-sm font-medium text-zinc-500">
        {setIndex + 1}
      </div>
      
      <div className="flex-1">
        <input 
          type="number" 
          value={set.weight || ''}
          onChange={(e) => onUpdate('weight', Number(e.target.value))}
          placeholder="0"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-1.5 text-center text-white focus:ring-1 focus:ring-lime-400 outline-none text-sm font-medium transition-all"
          disabled={set.completed}
        />
      </div>
      
      <div className="flex-1">
        <input 
          type="number" 
          value={set.reps || ''}
          onChange={(e) => onUpdate('reps', Number(e.target.value))}
          placeholder="0"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-1.5 text-center text-white focus:ring-1 focus:ring-lime-400 outline-none text-sm font-medium transition-all"
          disabled={set.completed}
        />
      </div>
      
      <div className="w-12 flex justify-center">
        <button
          onClick={() => onUpdate('completed', !set.completed)}
          className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
            set.completed 
              ? 'bg-lime-400 text-zinc-950 shadow-[0_0_10px_rgba(163,230,53,0.3)]' 
              : 'bg-zinc-800 text-zinc-600 hover:bg-zinc-700'
          }`}
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};

export default SetRow;

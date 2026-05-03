const StatCard = ({ title, value, subtitle, icon: Icon, color = 'lime' }) => {
  return (
    <div className="card flex items-start gap-4">
      <div className={`p-3 rounded-xl ${
        color === 'lime' ? 'bg-lime-400/10 text-lime-400 border border-lime-400/20' :
        color === 'blue' ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20' :
        color === 'purple' ? 'bg-purple-400/10 text-purple-400 border border-purple-400/20' :
        color === 'orange' ? 'bg-orange-400/10 text-orange-400 border border-orange-400/20' :
        'bg-zinc-800 text-zinc-400 border border-zinc-700'
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-zinc-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        {subtitle && (
          <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;

import { Link } from 'react-router-dom';

const EmptyState = ({ icon: Icon, title, description, actionText, actionLink }) => {
  return (
    <div className="card flex flex-col items-center justify-center p-12 text-center border-dashed border-zinc-800 bg-zinc-900/50">
      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-zinc-500" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 mb-6 max-w-md">{description}</p>
      
      {actionText && actionLink && (
        <Link to={actionLink} className="btn-primary">
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;

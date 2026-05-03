const Badge = ({ children, type }) => {
  const getBadgeClass = () => {
    switch (type?.toLowerCase()) {
      case 'chest': return 'badge-chest';
      case 'back': return 'badge-back';
      case 'legs': return 'badge-legs';
      case 'shoulders': return 'badge-shoulders';
      case 'arms': return 'badge-arms';
      case 'core': return 'badge-core';
      default: return 'badge-other';
    }
  };

  return (
    <span className={getBadgeClass()}>
      {children}
    </span>
  );
};

export default Badge;

import AgentCard from './AgentCard';

const AgentOrchestrator = ({ agentStatuses, agentStreams }) => {
  const agents = [
    { id: 'scraper', title: 'Data Scraper', emoji: '🕷️' },
    { id: 'analyzer', title: 'Data Analyzer', emoji: '🧠' },
    { id: 'factChecker', title: 'Fact Checker', emoji: '⚖️' },
    { id: 'writer', title: 'Report Writer', emoji: '✍️' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          title={agent.title}
          emoji={agent.emoji}
          status={agentStatuses[agent.id]}
          stream={agentStreams[agent.id]}
          isActive={agentStatuses[agent.id] === 'running'}
        />
      ))}
    </div>
  );
};

export default AgentOrchestrator;

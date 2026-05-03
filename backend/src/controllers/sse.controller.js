import { sseClients } from '../config/redis.js';

export const subscribeToMission = (req, res) => {
  const { missionId } = req.params;

  // Set necessary headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  // Add this client to the clients map
  if (!sseClients.has(missionId)) {
    sseClients.set(missionId, new Set());
  }
  sseClients.get(missionId).add(res);

  // Send initial connection event
  res.write(`data: ${JSON.stringify({ type: 'connected', missionId })}\n\n`);

  // Setup heartbeat every 30s to keep connection alive
  const heartbeatId = setInterval(() => {
    if (res.writableEnded) {
      clearInterval(heartbeatId);
      return;
    }
    res.write(':\n\n'); // SSE comment to keep connection alive
  }, 30000);

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(heartbeatId);
    const clients = sseClients.get(missionId);
    if (clients) {
      clients.delete(res);
      if (clients.size === 0) {
        sseClients.delete(missionId);
      }
    }
  });
};

export const broadcastToMission = (missionId, eventType, data) => {
  const clients = sseClients.get(missionId);
  if (clients) {
    const payload = `data: ${JSON.stringify({ type: eventType, ...data })}\n\n`;
    for (const client of clients) {
      if (!client.writableEnded) {
        client.write(payload);
      }
    }
  }
};

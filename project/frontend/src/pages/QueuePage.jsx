import React, { useEffect, useState } from 'react';
import API from '../services/api';
import TokenCard from '../components/TokenCard';
import { connectSocket, getSocket } from '../services/socket';

const QueuePage = () => {
  const [venueId, setVenueId] = useState(localStorage.getItem('selectedVenue') || 'v1');
  const [queue, setQueue] = useState({ tokens: [], lastNumber: 0 });
  useEffect(() => {
    const base = async () => {
      try {
        // We use server's queue if exists; else fallback to empty
        const resp = await fetch(`${import.meta.env.VITE_API || 'http://localhost:5000'}/api/queues/${venueId}`);
        const data = await resp.json();
        setQueue(data);
      } catch (err) { console.log(err); }
    };
    base();

    const socket = connectSocket();
    socket.emit('joinVenue', venueId);
    socket.on('queueUpdated', q => setQueue(q));

    return () => {
      const s = getSocket();
      if (s) s.off('queueUpdated');
    };
  }, [venueId]);

  const issueToken = async () => {
    try {
      await API(`/api/queues/${venueId}/issue`, { method: 'POST' });
      // response will be broadcast via socket; no need to update manually
    } catch (err) {
      alert('Please sign in to get a token. ' + err.message);
    }
  };

  return (
    <div>
      <div className="card">
        <h3>Queue for {venueId}</h3>
        <p className="small">Last issued: {queue.lastNumber || 0}</p>
        <button className="primary" onClick={issueToken}>Get Token</button>
      </div>

      <div className="card">
        <h4>Tokens</h4>
        {queue.tokens && queue.tokens.length ? queue.tokens.map(t => <TokenCard key={t.number} token={t} />) : <div className="small">No tokens yet</div>}
      </div>
    </div>
  );
};

export default QueuePage;

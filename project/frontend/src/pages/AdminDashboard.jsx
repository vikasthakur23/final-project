import React, { useEffect, useState } from 'react';
import API from '../services/api';
import AdminQueueControl from '../components/AdminQueueControl';

const AdminDashboard = () => {
  const [venueId, setVenueId] = useState(localStorage.getItem('selectedVenue') || 'v1');
  const [queue, setQueue] = useState({ tokens: [] });

  const fetchQueue = async () => {
    const q = await API(`/api/queues/${venueId}`);
    setQueue(q);
  };

  useEffect(() => { fetchQueue(); }, [venueId]);

  const callNext = async () => {
    try {
      await API(`/api/queues/${venueId}/call-next`, { method: 'POST' });
      fetchQueue();
    } catch (err) {
      alert('Call next failed: ' + err.message);
    }
  };

  return (
    <div>
      <div className="card">
        <h3>Admin Dashboard</h3>
        <div className="small">Venue: {venueId}</div>
        <AdminQueueControl onCallNext={callNext} />
      </div>

      <div className="card">
        <h4>Tokens</h4>
        {queue.tokens && queue.tokens.length ? queue.tokens.map(t => (
          <div key={t.number} className="token">
            <div>
              <strong>#{t.number}</strong> <div className="small">{t.user?.name}</div>
            </div>
            <div className="small">{t.status}</div>
          </div>
        )) : <div className="small">No tokens</div>}
      </div>
    </div>
    
  );
};

export default AdminDashboard;

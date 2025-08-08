import React, { useEffect, useState } from 'react';
import API from '../services/api';

const VenuePage = () => {
  const [venues, setVenues] = useState([]);
  useEffect(() => {
    // For brevity: static demo venues (you can add an endpoint to manage)
    setVenues([
      { _id: 'v1', name: 'Main Office', location: 'Lobby' },
      { _id: 'v2', name: 'Service Counter', location: 'First Floor' }
    ]);
  }, []);

  return (
    <div>
      <div className="card">
        <h3>Venues</h3>
        {venues.map(v => (
          <div key={v._id} className="token">
            <div>
              <strong>{v.name}</strong>
              <div className="small">{v.location}</div>
            </div>
            <div>
              <button className="primary" onClick={() => window.localStorage.setItem('selectedVenue', v._id)}>Select</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenuePage;

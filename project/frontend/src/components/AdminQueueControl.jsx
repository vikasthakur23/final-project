import React from 'react';

const AdminQueueControl = ({ onCallNext }) => {
  return (
    <div style={{ display:'flex', gap:8 }}>
      <button className="primary" onClick={onCallNext}>Call Next</button>
    </div>
  );
};

export default AdminQueueControl;

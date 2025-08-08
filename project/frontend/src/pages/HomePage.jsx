import React from 'react';

const HomePage = () => {
  return (
    <div>
      <div className="card">
        <h2>Welcome to QueueIt</h2>
        <p className="small">Create and manage virtual queues for venues. Sign in with Google to get started.</p>
      </div>
      <div className="card">
        <h3>How it works</h3>
        <ol className="small">
          <li>Users sign in and request a token for a venue.</li>
          <li>Admins call the next token; everyone sees updates in real-time.</li>
          <li>Notifications can be sent via email/SMS (configurable).</li>
        </ol>
      </div>
    </div>
  );
};

export default HomePage;

import React from 'react';

const TokenCard = ({ token }) => {
  return (
    <div className="token">
      <div>
        <div><strong>#{token.number}</strong> <span className="small">({token.status})</span></div>
        <div className="small">{token.user ? token.user.name : 'Guest'}</div>
      </div>
      <div className="small">{new Date(token.createdAt).toLocaleTimeString()}</div>
    </div>
  );
};

export default TokenCard;

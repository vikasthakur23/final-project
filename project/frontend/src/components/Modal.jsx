import React from 'react';

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center'
    }}>
      <div style={{ background:'#fff', borderRadius:10, padding:20, minWidth:320 }}>
        <button style={{ float:'right' }} onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

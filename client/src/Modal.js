import React from 'react';
import './Modal.css';

export function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
        <button className="btn secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

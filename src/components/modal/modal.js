"use client";

import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap styles are loaded

export default function Modal({ title, content = "", className = "", src = "" }) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleModal = () => {
    setIsVisible(!isVisible);
  };

  // Escape function to close modal on pressing 'Escape'
  const handleEscape = (e) => {
    if (e.key === 'Escape' && isVisible) {
      toggleModal();
    }
  };

  useEffect(() => {
    // Attach keydown event listener when the modal is open
    window.addEventListener('keydown', handleEscape);
    
    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible]); // Add `isVisible` as dependency to ensure proper behavior

  return (
    <>
      {/* Button to trigger the modal */}
      <button type="button" className="btn btn-primary" onClick={toggleModal}>
        Open Modal
      </button>

      {/* Modal */}
      {isVisible && (
        <div className={`modal fade show ${className}`} style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                <button type="button" className="btn-close" onClick={toggleModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {content && <p>{content}</p>}
                {src && <img src={src} alt={title} />}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={toggleModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal backdrop */}
      {isVisible && <div className="modal-backdrop fade show" onClick={toggleModal}></div>}
    </>
  );
}
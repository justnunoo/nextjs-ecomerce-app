import React, { useState, useEffect } from 'react';

import "./flashmessage.css"

const FlashMessage = ({ message, type, onClose }) => {
    useEffect(() => {
        // Automatically hide the message after 3 seconds
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null; // Don't render if there's no message

    return (
        <div className={`flash-message ${type}`}>
            {message}
        </div>
    );
};

export default FlashMessage;

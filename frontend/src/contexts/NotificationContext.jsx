import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const playSound = () => {
        try {
            // Simple notification sound using Web Audio API
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const audioCtx = new AudioContext();
            
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            // Chime sound: D6 then A6
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1174.66, audioCtx.currentTime); // D6
            
            // Fade first note quickly
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.15);
            
            // Second note A6
            oscillator.frequency.setValueAtTime(1760.00, audioCtx.currentTime + 0.15); // A6
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 0.15);
            gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.20);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
            
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.5);
        } catch (error) {
            console.error("Audio playback error:", error);
        }
    };

    const addNotification = useCallback((title, message, type = 'info') => {
        const newNotif = {
            id: Date.now(),
            title,
            message,
            type,
            timestamp: new Date().toISOString()
        };
        
        setNotifications((prev) => [newNotif, ...prev]);
        playSound();
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

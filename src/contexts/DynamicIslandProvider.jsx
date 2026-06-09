import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DynamicIslandContext, LAYOUT_PRESETS } from './DynamicIslandContext';
import { registerToastBridge } from '../lib/react-hot-toast-mock';

export const DynamicIslandProvider = ({ children }) => {
  const [activeNotification, setActiveNotification] = useState(LAYOUT_PRESETS.idle);
  const [queue, setQueue] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  
  const collapseDelayRef = useRef(null);
  const transitionTimeoutRef = useRef(null);

  // Collapse back to idle camera notch look
  const collapse = useCallback(() => {
    if (collapseDelayRef.current) clearTimeout(collapseDelayRef.current);
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    
    setContentVisible(false);
    setIsTransitioning(true);
    
    transitionTimeoutRef.current = setTimeout(() => {
      setActiveNotification(LAYOUT_PRESETS.idle);
      setContentVisible(true);
      setIsTransitioning(false);
    }, 150);
  }, []);

  // Show a notification immediately or push to queue
  const showNotification = useCallback((type, contentData, options = {}) => {
    const preset = LAYOUT_PRESETS[type] || LAYOUT_PRESETS.info;
    const duration = options.duration !== undefined ? options.duration : 4000;
    
    const notificationItem = {
      id: Math.random().toString(36).substr(2, 9),
      preset: {
        ...preset,
        width: options.width || preset.width,
        height: options.height || preset.height,
      },
      contentData,
      duration,
    };

    setQueue((prevQueue) => [...prevQueue, notificationItem]);
  }, []);

  // Process the queue
  useEffect(() => {
    if (queue.length === 0 || activeNotification.type !== 'idle' || isTransitioning) return;

    const nextNotification = queue[0];
    
    // Dequeue
    setQueue((prev) => prev.slice(1));
    setIsTransitioning(true);
    setContentVisible(false);

    // Smooth transition
    transitionTimeoutRef.current = setTimeout(() => {
      setActiveNotification({
        ...nextNotification.preset,
        contentData: nextNotification.contentData,
        id: nextNotification.id,
      });
      setContentVisible(true);
      setIsTransitioning(false);

      if (nextNotification.duration) {
        collapseDelayRef.current = setTimeout(() => {
          collapse();
        }, nextNotification.duration);
      }
    }, 150);
  }, [queue, activeNotification.type, isTransitioning, collapse]);

  // Clean timeouts on unmount
  useEffect(() => {
    return () => {
      if (collapseDelayRef.current) clearTimeout(collapseDelayRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  // Direct morph function
  const morph = useCallback((type, contentData, options = {}) => {
    if (collapseDelayRef.current) clearTimeout(collapseDelayRef.current);
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    
    const preset = LAYOUT_PRESETS[type] || LAYOUT_PRESETS.info;
    
    setContentVisible(false);
    setIsTransitioning(true);

    transitionTimeoutRef.current = setTimeout(() => {
      setActiveNotification({
        ...preset,
        width: options.width || preset.width,
        height: options.height || preset.height,
        contentData,
      });
      setContentVisible(true);
      setIsTransitioning(false);

      if (options.duration) {
        collapseDelayRef.current = setTimeout(() => {
          collapse();
        }, options.duration);
      }
    }, 150);
  }, [collapse]);

  // Register legacy toast bridging
  useEffect(() => {
    registerToastBridge({
      success: (msg, opts) => showNotification('success', { title: 'Success', message: msg }, opts),
      error: (msg, opts) => showNotification('error', { title: 'Error', message: msg }, opts),
      warning: (msg, opts) => showNotification('warning', { title: 'Warning', message: msg }, opts),
      info: (msg, opts) => showNotification('info', { title: 'Notification', message: msg }, opts),
      loading: (msg, opts) => morph('process', { title: msg, percentage: 0 }, opts),
      dismiss: () => collapse(),
    });
    return () => registerToastBridge(null);
  }, [showNotification, morph, collapse]);

  return (
    <DynamicIslandContext.Provider
      value={{
        activeNotification,
        contentVisible,
        showNotification,
        morph,
        collapse,
        queueCount: queue.length
      }}
    >
      {children}
    </DynamicIslandContext.Provider>
  );
};

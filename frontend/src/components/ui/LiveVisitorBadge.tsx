'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveVisitorBadge() {
  const [count, setCount]   = useState<number | null>(null);
  const [pulse, setPulse]   = useState(false);

  useEffect(() => {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

    // Lazy-load socket.io-client only in browser
    import('socket.io-client').then(({ io }) => {
      const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });

      socket.on('visitor_count', (n: number) => {
        setCount(n);
        setPulse(true);
        setTimeout(() => setPulse(false), 800);
      });

      return () => { socket.disconnect(); };
    }).catch(() => {
      // Socket not available — degrade gracefully
    });
  }, []);

  if (count === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3 py-2 rounded-full font-mono text-xs"
      style={{
        background: 'rgba(13,26,42,0.92)',
        border: '1px solid var(--border2)',
        backdropFilter: 'blur(12px)',
        boxShadow: pulse ? '0 0 16px rgba(0,212,255,0.25)' : 'none',
        transition: 'box-shadow 0.4s',
      }}
    >
      <motion.span
        animate={{ scale: pulse ? [1, 1.4, 1] : 1 }}
        transition={{ duration: 0.5 }}
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: 'var(--green)', boxShadow: '0 0 6px var(--green)' }}
      />
      <AnimatePresence mode="popLayout">
        <motion.span
          key={count}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          style={{ color: 'var(--accent)' }}
        >
          {count}
        </motion.span>
      </AnimatePresence>
      <span style={{ color: 'var(--text3)' }}>live {count === 1 ? 'visitor' : 'visitors'}</span>
    </motion.div>
  );
}

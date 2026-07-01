'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrismLoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100000] bg-black flex flex-col items-center justify-center overflow-hidden pointer-events-none"
        >
          {/* Incoming White Beam */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '50vw', opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute top-1/2 left-0 h-[2px] bg-white shadow-[0_0_20px_#fff] -translate-y-1/2 origin-left"
          />

          {/* Prism Crystal Center */}
          <motion.div
            initial={{ scale: 0, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 45, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="relative z-10 w-16 h-16 border-2 border-white/40 bg-white/5 backdrop-blur-md flex items-center justify-center"
            style={{
              boxShadow: '0 0 40px rgba(255,255,255,0.2), inset 0 0 20px rgba(255,255,255,0.1)'
            }}
          />

          {/* Outgoing Spectrum Beams */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 w-[50vw] h-[200px] origin-left -translate-y-1/2 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,0,85,0.8) 20%, rgba(255,170,0,0.8) 40%, rgba(0,255,170,0.8) 60%, rgba(0,85,255,0.8) 80%, rgba(170,0,255,0.8) 100%)',
              clipPath: 'polygon(0 48%, 100% 0%, 100% 100%, 0 52%)',
              filter: 'blur(12px)',
              mixBlendMode: 'screen'
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="absolute bottom-12 font-sans text-xs tracking-[0.4em] uppercase text-white/50"
          >
            Entering Prism
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

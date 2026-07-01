'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, X } from 'lucide-react';

type ConnectionStatus = 'checking' | 'online' | 'offline' | 'restored';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const POLL_INTERVAL_MS = 30_000; // 30 seconds
const HEALTH_TIMEOUT_MS = 12_000; // 12 seconds to accommodate cold starts

export default function OfflineBanner() {
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  const [dismissed, setDismissed] = useState(false);

  const checkHealth = useCallback(async () => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`, {
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(id);
      if (res.ok) {
        setStatus(prev => {
          if (prev === 'offline') {
            setDismissed(false); // Only show restored notification if we were offline
            return 'restored';
          }
          return 'online';
        });
        // Auto-dismiss the "restored" banner after 4 seconds
        setTimeout(() => {
          setStatus(prev => prev === 'restored' ? 'online' : prev);
        }, 4000);
      } else {
        setStatus(prev => {
          if (prev !== 'offline') {
            setDismissed(false); // Reset dismiss only on transitions
            return 'offline';
          }
          return prev;
        });
      }
    } catch {
      clearTimeout(id);
      setStatus(prev => {
        if (prev !== 'offline') {
          setDismissed(false); // Reset dismiss only on transitions
          return 'offline';
        }
        return prev;
      });
    }
  }, []);

  useEffect(() => {
    // Initial check (slight delay so it doesn't block first paint)
    const initTimer = setTimeout(checkHealth, 2500);
    const interval = setInterval(checkHealth, POLL_INTERVAL_MS);
    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, [checkHealth]);

  const isOffline = status === 'offline';
  const isVisible = !dismissed && (status === 'offline' || status === 'restored');

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            left: 0,
            right: 0,
            zIndex: 9999,
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'center',
            padding: '0 16px',
          }}
        >
          <motion.div
            role="alert"
            aria-live="assertive"
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              padding: '10px 20px',
              fontSize: '13px',
              fontFamily: 'var(--font-sans), sans-serif',
              fontWeight: 500,
              borderRadius: '9999px',
              background: isOffline
                ? 'rgba(102, 13, 13, 0.95)' // Editorial Red #660D0D
                : 'rgba(11, 90, 71, 0.95)',  // Growth Teal #0B5A47
              color: '#fff',
              border: isOffline
                ? '1px solid rgba(255, 233, 161, 0.25)' // Prism Gold border
                : '1px solid rgba(189, 231, 217, 0.35)', // Teal Light border
              boxShadow: '0 12px 32px -4px rgba(0,0,0,0.5), 0 0 0 1px rgba(250,247,240,0.05)',
              backdropFilter: 'blur(12px)',
              maxWidth: '100%',
              width: 'max-content',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              {/* Icon */}
              <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {isOffline ? (
                  <WifiOff className="w-4 h-4" style={{ color: '#FFE9A1' }} />
                ) : (
                  <Wifi className="w-4 h-4" style={{ color: '#BDE7D9' }} />
                )}
              </div>

              {/* Message */}
              <span style={{ lineHeight: '1.4', letterSpacing: '0.01em' }}>
                {isOffline ? (
                  <>
                    <strong style={{ color: '#FFE9A1', fontWeight: 600 }}>Read-only mode:</strong> The content server is currently unreachable. You are browsing cached articles.
                  </>
                ) : (
                  <>
                    <strong style={{ color: '#BDE7D9', fontWeight: 600 }}>Connection restored!</strong> Live content is now available.
                  </>
                )}
              </span>
            </div>

            {/* Dismiss button */}
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss notification"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '9999px',
                color: '#fff',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

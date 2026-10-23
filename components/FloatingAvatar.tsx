/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useLiveAPIContext } from '../contexts/LiveAPIContext';
import { useAgent, useUI } from '../lib/state';
import BasicFace from './demo/basic-face/BasicFace';
import cn from 'classnames';
import { Sparkles, Ear, BrainCircuit, MessageCircle, Heart } from 'lucide-react';

const AUDIO_OUTPUT_DETECTION_THRESHOLD = 0.05;
const TALKING_STATE_COOLDOWN_MS = 2000;

/**
 * FloatingAvatar with enhanced, distinct visual cues for 'listening' vs 'thinking',
 * utilizing CSS transitions for ultra-smooth state interpolation.
 */
export default function FloatingAvatar() {
  const { agentState, speechBubbleText, setSpeechBubbleText } = useUI();
  const { current } = useAgent();
  const { volumeRef, connected } = useLiveAPIContext();

  const [isTalking, setIsTalking] = useState(false);
  const [visibleText, setVisibleText] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const talkingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bubbleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine current active substate with precedence
  const activeMode = useMemo<'talking' | 'thinking' | 'listening' | 'idle' | 'disconnected'>(() => {
    if (!connected) return 'disconnected';
    if (isTalking) return 'talking';
    const stateStr = (agentState || '').toLowerCase();
    if (stateStr.includes('think')) return 'thinking';
    if (stateStr.includes('listen')) return 'listening';
    return 'idle';
  }, [connected, isTalking, agentState]);

  useEffect(() => {
    if (speechBubbleText) {
      setVisibleText(speechBubbleText);
      if (bubbleTimeoutRef.current) {
        clearTimeout(bubbleTimeoutRef.current);
      }
      bubbleTimeoutRef.current = setTimeout(() => {
        setVisibleText(null);
        setSpeechBubbleText(null);
      }, 5000);
    }
  }, [speechBubbleText, setSpeechBubbleText]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setPosition({ 
      x: isMobile ? window.innerWidth / 2 - 45 : window.innerWidth / 2 - 45, 
      y: 8 
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        if (prev.x === -1000) return prev;
        const avatarWidth = 90;
        const avatarHeight = 90;

        return {
          x: Math.min(Math.max(10, prev.x), window.innerWidth - avatarWidth - 10),
          y: Math.min(Math.max(0, prev.y), window.innerHeight - avatarHeight - 10),
        };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Detect if the agent is talking based on audio output volume
  useEffect(() => {
    let frameId: number;
    const checkTalking = () => {
      if (volumeRef.current > AUDIO_OUTPUT_DETECTION_THRESHOLD) {
        setIsTalking(true);
        if (talkingTimeoutRef.current) {
          clearTimeout(talkingTimeoutRef.current);
        }
        talkingTimeoutRef.current = setTimeout(() => {
          setIsTalking(false);
        }, TALKING_STATE_COOLDOWN_MS);
      }
      frameId = requestAnimationFrame(checkTalking);
    };
    frameId = requestAnimationFrame(checkTalking);
    return () => cancelAnimationFrame(frameId);
  }, [volumeRef]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }, [position]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    dragOffset.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
  }, [position]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        const touch = e.touches[0];
        setPosition({
          x: touch.clientX - dragOffset.current.x,
          y: touch.clientY - dragOffset.current.y,
        });
      }
    };

    const handleMouseUp = () => setIsDragging(false);
    const handleTouchEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const renderStatusDetails = () => {
    switch (activeMode) {
      case 'listening':
        return (
          <>
            <span className="listening-indicator-icon">
              <span className="audio-wave-bar bar-1" />
              <span className="audio-wave-bar bar-2" />
              <span className="audio-wave-bar bar-3" />
            </span>
            <span>กำลังตั้งใจฟัง... 👂</span>
          </>
        );
      case 'thinking':
        return (
          <>
            <Sparkles size={13} className="text-amber-300 animate-spin-slow" />
            <span>กำลังคิดประมวลผล... 💭</span>
          </>
        );
      case 'talking':
        return (
          <>
            <MessageCircle size={13} className="text-pink-300 animate-pulse" />
            <span>กำลังพูดคุย 💬</span>
          </>
        );
      case 'idle':
        return (
          <>
            <Heart size={12} className="text-rose-400" />
            <span>พร้อมสนทนาค่ะ 🌸</span>
          </>
        );
      case 'disconnected':
      default:
        return (
          <>
            <span className="offline-dot" />
            <span>พร้อมคุยค่ะ 🌸</span>
          </>
        );
    }
  };

  return (
    <div
      className={cn('basic-face-container-top arty-floating-avatar', {
        dragging: isDragging,
        connected: connected,
        'state-listening': activeMode === 'listening',
        'state-thinking': activeMode === 'thinking',
        'state-talking': activeMode === 'talking',
        'state-idle': activeMode === 'idle',
        'state-disconnected': activeMode === 'disconnected',
      })}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="region"
      aria-label={`อวาตาร์ผู้ช่วย ${current.name} สถานะปัจจุบัน: ${activeMode}`}
    >
      {/* Dynamic Listening Aura Wave */}
      <div className="listening-aura-waves" aria-hidden="true">
        <div className="wave wave-1" />
        <div className="wave wave-2" />
      </div>

      {/* Dynamic Thinking Constellation Ring */}
      <div className="thinking-halo-ring" aria-hidden="true">
        <div className="halo-particle particle-1" />
        <div className="halo-particle particle-2" />
        <div className="halo-particle particle-3" />
      </div>

      {/* Base Reactive Face Ring */}
      <div 
        className="face-glow-ring" 
        style={{ borderColor: current.bodyColor }} 
        aria-hidden="true" 
      />

      {/* Canvas Face with smooth transforms */}
      <div className="avatar-canvas-wrapper">
        <BasicFace
          canvasRef={canvasRef}
          radius={44}
          color={current.bodyColor}
          isTalking={isTalking}
        />
      </div>
      
      {/* Distinct Visual Status Badge with CSS Transitions */}
      <div 
        className={cn('face-status-label status-badge-animated', `badge-${activeMode}`)}
      >
        {renderStatusDetails()}
      </div>

      {/* Speech Bubble with Smooth Fade/Scale */}
      {visibleText && (
        <div className="agent-speech-bubble glass-bubble animate-bounce-soft">
          <div className="bubble-content">{visibleText}</div>
          <div className="bubble-arrow" />
        </div>
      )}
    </div>
  );
}

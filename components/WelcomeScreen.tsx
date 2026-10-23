/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useUI } from '../lib/state';
import { ArrowRight, Sparkles, Volume2, ShieldCheck, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const FLOATING_THAI_WORDS = [
  'เสียงผู้หญิงไทยน่ารัก',
  'อบอุ่น & สุภาพ',
  'WCAG 2.1 AAA',
  'ชัดถ้อยชัดคำ',
  'Touch Target 48dp',
  'Mobile First',
  'น้องอาร์ตี้',
  'น้องพิมพ์ใจ',
  'น้องมีนา',
  'ความคมชัดสูง 7:1',
  'Real-Time Canvas',
  'Dynamic Type Scaling',
  'พูดจาไพเราะ คะ/ค่ะ',
  'ผู้ช่วยผู้สูงอายุ',
];

/**
 * Modern fluid welcome screen with bold/thin typography and fluid gradients powered by framer-motion.
 */
export default function WelcomeScreen() {
  const { setShowWelcomeScreen, setShowDisclaimer } = useUI();
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const floatingElements = useMemo(() => {
    return FLOATING_THAI_WORDS.map((text, i) => ({
      text,
      id: i,
      top: `${(i * 6.5) % 85 + 8}%`,
      left: `${(i * 19) % 86 + 7}%`,
      fontSize: `${Math.random() * 0.4 + 0.85}rem`,
      delay: `${(i * 0.7) % 5}s`,
      duration: `${14 + (i % 6)}s`,
      opacity: 0.28,
    }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  function handleClose() {
    setIsExiting(true);
    setTimeout(() => {
      setShowWelcomeScreen(false);
      setShowDisclaimer(true);
    }, 600);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`welcome-screen-shroud ${isVisible ? 'visible' : ''} ${
        isExiting ? 'exiting' : ''
      }`}
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(3, 7, 18, 0.70), rgba(3, 7, 18, 0.95)), url('/assets/aistudio/A79839F3-13D2-47E3-BAE5-F01A0E2E9C2A_231df14c.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Ambient Fluid Glow Orbs */}
      <div className="ambient-orb orb-primary" />
      <div className="ambient-orb orb-secondary" />
      <div className="ambient-orb orb-tertiary" />

      {/* Floating Thai Terms */}
      <div className="floating-container" aria-hidden="true">
        {floatingElements.map((el) => (
          <div
            key={el.id}
            className="floating-text"
            style={{
              top: el.top,
              left: el.left,
              fontSize: el.fontSize,
              animationDelay: el.delay,
              animationDuration: el.duration,
              opacity: el.opacity,
            } as React.CSSProperties}
          >
            {el.text}
          </div>
        ))}
      </div>

      <div className="welcome-screen">
        <motion.div 
          initial={{ scale: 0.92, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="welcome-content"
        >
          {/* Badge */}
          <div className="welcome-tag-badge">
            <span className="badge-dot" />
            <Sparkles size={14} className="text-cyan-400" />
            <span>THARUN GS x ARTYVERSE COSMIC COMMAND</span>
          </div>

          {/* Bold vs Thin Typography */}
          <div className="welcome-header">
            <div className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-black mb-2">Cinematic Space AI Assistant</div>
            <h1 className="welcome-title">
              <span className="title-bold">ARTY</span>
              <span className="title-thin">VERSE</span>
            </h1>
            <p className="welcome-thai-headline">
              ระบบผู้ช่วยเสียงผู้หญิงไทยสุดน่ารัก พร้อมพื้นที่ทำงานสตูดิโอ 🌸
            </p>
            <p className="welcome-subtitle">
              สัมผัสประสบการณ์สนทนาด้วยน้ำเสียงผู้หญิงไทยที่น่ารัก อบอุ่น สุภาพ และชัดถ้อยชัดคำ
              ออกแบบมาเพื่อการพัฒนา Mobile App และรองรับการเข้าถึงสำหรับผู้สูงอายุ (WCAG 2.1 AAA)
            </p>
          </div>

          {/* 3 Pillars Feature Grid */}
          <div className="welcome-pillars">
            <div className="pillar-item">
              <div className="pillar-icon-box">
                <Volume2 size={20} />
              </div>
              <div className="pillar-text">
                <h4>TTS เสียงไทยน่ารัก</h4>
                <p>เสียงหวานนุ่มนวล เป็นมิตร มีหางเสียง คะ/ค่ะ สื่อสารอย่างใส่ใจ</p>
              </div>
            </div>

            <div className="pillar-item">
              <div className="pillar-icon-box">
                <Smartphone size={20} />
              </div>
              <div className="pillar-text">
                <h4>Mobile-First Workspace</h4>
                <p>Real-time Canvas จำลองหน้าจออุปกรณ์พร้อม Safe Area Insets</p>
              </div>
            </div>

            <div className="pillar-item">
              <div className="pillar-icon-box">
                <ShieldCheck size={20} />
              </div>
              <div className="pillar-text">
                <h4>Senior Accessibility</h4>
                <p>ปุ่มกดขั้นต่ำ 48×48dp, คอนทราสต์ ≥ 7:1, ปรับขนาดตัวอักษรได้</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClose} 
            className="start-button glass-button"
            aria-label="เริ่มต้นการสนทนากับน้องอาร์ตี้"
          >
            <span className="start-btn-text">เริ่มต้นสนทนากับน้องอาร์ตี้</span>
            <ArrowRight size={22} className="arrow-icon" />
          </motion.button>

          {/* Footer */}
          <div className="powered-by-gemini welcome-footer">
            <svg
              className="gemini-star"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
                fill="currentColor"
              />
            </svg>
            <span>ขับเคลื่อนด้วย Google Gemini Multimodal Live API</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

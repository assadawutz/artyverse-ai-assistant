/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useLiveAPIContext } from '../contexts/LiveAPIContext';
import { Agent } from '../lib/presets/agents';
import { useAgent, useUI, useUser } from '../lib/state';
import { themes } from '../lib/themes';
import c from 'classnames';
import { useEffect, useState, useRef } from 'react';
import { 
  Eye, 
  Edit3, 
  MessageSquare, 
  ClipboardList, 
  Volume2,
  ChevronDown,
  Sparkles,
  Smartphone,
  Sliders,
  SunMoon,
  Accessibility,
  Menu,
  X,
} from 'lucide-react';

/**
 * Modern Header with bold/thin typography, fluid gradient aesthetics,
 * cute Thai female agent switcher, and Senior Accessibility controls.
 */
export default function Header() {
  const {
    showUserConfig,
    setShowUserConfig,
    setShowDebugModal,
    setShowAgentEdit,
    changeCount,
    theme,
    setTheme,
    mainTab,
    setMainTab,
    documentTab,
    setDocumentTab,
    outputModality,
    setOutputModality,
    activeWorkspace,
    setActiveWorkspace,
  } = useUI();
  const { name } = useUser();
  const { current, setCurrent, availablePresets } = useAgent();
  const { disconnect, connected } = useLiveAPIContext();

  const [showRoomList, setShowRoomList] = useState(false);
  const [showOutputMenu, setShowOutputMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [fontScale, setFontScale] = useState<number>(100);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const outputMenuRef = useRef<HTMLDivElement>(null);
  const viewMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeDropdowns = (e: MouseEvent) => {
      setShowRoomList(false);
      if (outputMenuRef.current && !outputMenuRef.current.contains(e.target as Node)) {
        setShowOutputMenu(false);
      }
      if (viewMenuRef.current && !viewMenuRef.current.contains(e.target as Node)) {
        setShowViewMenu(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setShowThemeMenu(false);
      }
    };
    addEventListener('click', closeDropdowns);
    return () => removeEventListener('click', closeDropdowns);
  }, []);

  // Update Dynamic Type scale for elderly accessibility
  const cycleFontScale = () => {
    const nextScale = fontScale === 100 ? 125 : fontScale === 125 ? 150 : 100;
    setFontScale(nextScale);
    document.documentElement.style.setProperty('--dynamic-type-scale', `${nextScale}%`);
  };

  function changeAgent(agent: Agent | string) {
    disconnect();
    setCurrent(agent);
    setShowRoomList(false);
  }

  const getOutputLabel = () => {
    switch (outputModality) {
      case 'audio': return 'เสียง (TTS)';
      case 'text': return 'ข้อความ';
      case 'both': return 'ทั้งสองอย่าง';
      default: return 'Output';
    }
  };

  const getViewLabel = () => {
    if (mainTab === 'document') {
      return documentTab === 'rendered' ? 'มุมมองเอกสาร' : 'แก้ไข Markdown';
    }
    switch (mainTab) {
      case 'transcript': return 'บทสนทนาสด';
      case 'minutes': return 'สรุปรายงาน';
      case 'audio-log': return 'บันทึกเสียง';
      default: return 'มุมมอง';
    }
  };

  const isSuperUser = name === 'Root' || name === 'root';

  return (
    <header className="arty-header glass-panel">
      <div className="header-left-section">
        {/* Brand Logo with THARUN GS x ARTYVERSE Cosmic Command Identity */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] tracking-[0.25em] text-cyan-400 font-black uppercase">THARUN GS x COMMAND</span>
          <div className="flex items-center gap-2">
            <div className="arty-logo-badge flex items-center">
              <span className="logo-bold text-lg font-black tracking-wider text-white">ARTY</span>
              <span className="logo-thin text-lg font-light tracking-wider text-cyan-300">VERSE</span>
            </div>
            <span className="thai-voice-chip hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-[11px] font-semibold" title="ระบบเสียงผู้หญิงไทยน่ารักเท่านั้น">
              <Sparkles size={11} className="animate-pulse text-pink-400" />
              <span>Thai Cute Voice</span>
            </span>
          </div>
        </div>

        {/* Two Main Menus: Chat & Studio (Desktop visible, mobile responsive) */}
        <div className="flex items-center gap-2">
          <nav aria-label="Main Navigation" className="main-workspace-nav hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-[var(--theme-surface)]/80 border border-white/15 shadow-sm">
            <button
              onClick={() => setActiveWorkspace('chat')}
              className={c('px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all min-h-[44px] min-w-[44px]', {
                'bg-[var(--theme-accent)] text-white shadow-md': activeWorkspace === 'chat',
                'text-[var(--theme-text)] opacity-70 hover:opacity-100': activeWorkspace !== 'chat'
              })}
              aria-current={activeWorkspace === 'chat' ? 'page' : undefined}
            >
              <MessageSquare size={16} />
              <span className="inline">Chat</span>
            </button>
            <button
              onClick={() => setActiveWorkspace('studio')}
              className={c('px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all min-h-[44px] min-w-[44px]', {
                'bg-[var(--theme-accent)] text-white shadow-md': activeWorkspace === 'studio',
                'text-[var(--theme-text)] opacity-70 hover:opacity-100': activeWorkspace !== 'studio'
              })}
              aria-current={activeWorkspace === 'studio' ? 'page' : undefined}
            >
              <Edit3 size={16} />
              <span className="inline">Studio</span>
            </button>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-[var(--theme-surface)] border border-white/15 text-[var(--theme-text)] flex items-center justify-center min-h-[44px] min-w-[44px]"
            aria-label="เปิดเมนูมือถือ"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Sheet Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col p-6 md:hidden animate-fade-in">
            <div className="flex items-center justify-between pb-6 border-b border-white/15">
              <div className="arty-logo-badge">
                <span className="logo-bold text-lg">ARTY</span>
                <span className="logo-thin text-lg">VERSE</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full bg-white/10 text-white"
                aria-label="ปิดเมนู"
              >
                <X size={22} />
              </button>
            </div>
            <div className="flex flex-col gap-4 py-8">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold px-2">เมนูหลัก (Main Navigation)</div>
              <button
                onClick={() => {
                  setActiveWorkspace('chat');
                  setMobileMenuOpen(false);
                }}
                className={c('w-full px-5 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all', {
                  'bg-[var(--theme-accent)] text-white shadow-lg': activeWorkspace === 'chat',
                  'bg-white/5 text-slate-200 hover:bg-white/10': activeWorkspace !== 'chat'
                })}
              >
                <MessageSquare size={22} />
                <span>Chat Workspace</span>
              </button>
              <button
                onClick={() => {
                  setActiveWorkspace('studio');
                  setMobileMenuOpen(false);
                }}
                className={c('w-full px-5 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all', {
                  'bg-[var(--theme-accent)] text-white shadow-lg': activeWorkspace === 'studio',
                  'bg-white/5 text-slate-200 hover:bg-white/10': activeWorkspace !== 'studio'
                })}
              >
                <Edit3 size={22} />
                <span>Studio Workspace</span>
              </button>
            </div>
            <div className="mt-auto pt-6 border-t border-white/15 text-xs text-slate-400 text-center">
              ARTYVERSE X WORKSPACE • Thai Cute Voice Assistant
            </div>
          </div>
        )}

        {/* Cute Thai Agent Selector Dropdown */}
        <div className="agent-selector-wrapper">
          <button
            className={c('agent-selector-btn', { active: showRoomList })}
            onClick={e => {
              e.stopPropagation();
              setShowRoomList(!showRoomList);
            }}
            aria-label={`เปลี่ยนผู้ช่วย ปัจจุบันคือ ${current.name}`}
          >
            <span className="agent-avatar-circle" style={{ backgroundColor: current.bodyColor }}>
              {current.avatarEmoji || '🌸'}
            </span>
            <div className="agent-name-col">
              <span className="agent-display-name">{current.name}</span>
              <span className="agent-voice-sub">เสียง {current.voice} (ไทย)</span>
            </div>
            <ChevronDown size={16} className={c('chevron', { open: showRoomList })} />
          </button>

          {showRoomList && (
            <div className="agent-dropdown-panel glass-dropdown animate-fade-in">
              <div className="dropdown-section-title">เลือกผู้ช่วยเสียงผู้หญิงไทย:</div>
              <ul>
                {availablePresets.map(agent => (
                  <li key={agent.id}>
                    <button
                      className={c('agent-option-item', { active: agent.id === current.id })}
                      onClick={() => changeAgent(agent)}
                    >
                      <span className="option-avatar" style={{ backgroundColor: agent.bodyColor }}>
                        {agent.avatarEmoji || '🌸'}
                      </span>
                      <div className="option-info">
                        <div className="option-name-row">
                          <span className="font-bold">{agent.name}</span>
                          <span className="voice-tag">{agent.voice}</span>
                        </div>
                        <span className="option-role">{agent.role}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Output Menu Dropdown */}
        <div className="header-menu-container" ref={outputMenuRef}>
          <button 
            className={c('header-pill-trigger', { active: showOutputMenu })}
            onClick={(e) => {
              e.stopPropagation();
              setShowOutputMenu(!showOutputMenu);
            }}
            aria-label="เลือกรูปแบบการตอบกลับ"
          >
            <Volume2 size={17} className="text-pink-400" />
            <span className="menu-label font-medium">{getOutputLabel()}</span>
            <ChevronDown size={14} className={c('chevron', { open: showOutputMenu })} />
          </button>
          
          {showOutputMenu && (
            <div className="header-dropdown-menu glass-dropdown">
              <button 
                className={c('menu-item', { active: outputModality === 'audio' })}
                onClick={() => {
                  setOutputModality('audio');
                  setShowOutputMenu(false);
                }}
              >
                <Volume2 size={16} />
                <span>เสียงภาษาไทย (Thai Audio TTS)</span>
              </button>
              <button 
                className={c('menu-item', { active: outputModality === 'text' })}
                onClick={() => {
                  setOutputModality('text');
                  setShowOutputMenu(false);
                }}
              >
                <MessageSquare size={16} />
                <span>ข้อความอย่างเดียว (Text Only)</span>
              </button>
              <button 
                className={c('menu-item', { active: outputModality === 'both' })}
                onClick={() => {
                  setOutputModality('both');
                  setShowOutputMenu(false);
                }}
              >
                <Sparkles size={16} />
                <span>ทั้งเสียงและข้อความ (Both)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Header Right Section: Accessibility, Theme, Edits Counter & Settings */}
      <div className="header-right-section">
        {/* Senior Accessibility Quick Font Scaler */}
        <button
          className="header-icon-action-btn accessibility-btn"
          onClick={cycleFontScale}
          title={`ปรับขนาดตัวอักษรเพื่อผู้สูงอายุ (ปัจจุบัน: ${fontScale}%)`}
          aria-label={`ปรับขนาดตัวอักษรเพื่อผู้สูงอายุ ${fontScale}%`}
        >
          <Accessibility size={18} />
          <span className="scale-pill">{fontScale}%</span>
        </button>

        {/* Theme Switcher Quick Menu */}
        <div className="header-menu-container" ref={themeMenuRef}>
          <button
            className="header-icon-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowThemeMenu(!showThemeMenu);
            }}
            title="เปลี่ยนธีมสี & โหมดความคมชัดสูง"
            aria-label="เปลี่ยนธีมสีและโหมดความคมชัดสูง"
          >
            <SunMoon size={18} />
          </button>

          {showThemeMenu && (
            <div className="header-dropdown-menu glass-dropdown right-aligned">
              <div className="dropdown-section-title">ธีมการแสดงผล:</div>
              {themes.map(t => (
                <button
                  key={t.name}
                  className={c('menu-item', { active: theme === t.name })}
                  onClick={() => {
                    setTheme(t.name);
                    setShowThemeMenu(false);
                  }}
                >
                  <span 
                    className="theme-color-dot" 
                    style={{ backgroundColor: t.colors[2] }} 
                  />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Document Change Counter */}
        <div className="change-counter-badge" title="จำนวนครั้งที่น้องอาร์ตี้ช่วยอัปเดตเอกสาร">
          <span className="counter-icon">✏️</span>
          <span className="counter-number">{changeCount}</span>
        </div>

        {/* Configuration Button */}
        <button
          className="header-icon-action-btn settings-btn"
          onClick={() => setShowUserConfig(!showUserConfig)}
          title="ตั้งค่าเซสชัน & บริบท"
          aria-label="ตั้งค่าเซสชันและบริบท"
        >
          <Sliders size={18} />
        </button>

        {/* Debug Log for Superuser */}
        {isSuperUser && (
          <button
            className="header-icon-action-btn"
            onClick={() => setShowDebugModal(true)}
            title="Debug Log"
          >
            <span className="icon">bug_report</span>
          </button>
        )}
      </div>
    </header>
  );
}
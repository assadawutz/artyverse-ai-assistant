/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import AgentEdit from './components/AgentEdit';
import ControlTray from './components/console/control-tray/ControlTray';
import DebugModal from './components/DebugModal';
import ErrorScreen from './components/demo/ErrorScreen';
import KeynoteCompanion from './components/demo/keynote-companion/KeynoteCompanion';
import Header from './components/Header';
import StudioWorkspace from './components/StudioWorkspace';
import UserSettings from './components/UserSettings';
import WelcomeScreen from './components/WelcomeScreen';
import { LiveAPIProvider } from './contexts/LiveAPIContext';
import { useUI } from './lib/state';
import React, { useEffect } from 'react';
import { themes } from './lib/themes';
import FloatingAvatar from './components/FloatingAvatar';
import HelpModal from './components/HelpModal';
import LegalDisclaimer from './components/LegalDisclaimer';

const API_KEY =
  typeof process !== 'undefined' && process.env
    ? (process.env.API_KEY || process.env.GEMINI_API_KEY) as string
    : undefined;

/**
 * Main application content area with Split-View Mobile-Centric Workspace support,
 * cute Thai floating avatar, and accessibility overlays.
 */
function AppContent() {
  const { 
    showUserConfig, 
    showAgentEdit, 
    showDebugModal, 
    showHelpModal, 
    showDisclaimer,
    activeWorkspace,
    setActiveWorkspace
  } = useUI();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault();
        setActiveWorkspace('chat');
      } else if ((e.ctrlKey || e.metaKey) && e.key === '2') {
        e.preventDefault();
        setActiveWorkspace('studio');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveWorkspace]);

  return (
    <>
      <ErrorScreen />
      
      {/* Ambient Fluid Background Mesh Glow with Cinematic Cosmic Panorama */}
      <div 
        className="app-ambient-glow" 
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(3, 7, 18, 0.75), rgba(3, 7, 18, 0.95)), url('/assets/aistudio/A79839F3-13D2-47E3-BAE5-F01A0E2E9C2A_231df14c.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="glow-sphere sphere-pink" />
        <div className="glow-sphere sphere-indigo" />
        <div className="glow-sphere sphere-cyan" />
      </div>

      <Header />

      <FloatingAvatar />

      {/* Modals */}
      {showUserConfig && <UserSettings />}
      {showAgentEdit && <AgentEdit />}
      {showDebugModal && <DebugModal />}
      {showHelpModal && <HelpModal />}
      {showDisclaimer && <LegalDisclaimer />}

      <div className="streaming-console">
        <main className="flex flex-col h-full w-full">
          {activeWorkspace === 'chat' ? (
            <>
              <div className="main-app-area flex-1">
                <KeynoteCompanion />
              </div>
              <ControlTray />
            </>
          ) : (
            <StudioWorkspace />
          )}
        </main>
      </div>
    </>
  );
}

/**
 * Main application component. Checks API key, applies themes, fonts, and
 * dynamic type scaling variables for Senior Accessibility (WCAG 2.1 AAA).
 */
function App() {
  if (!API_KEY) {
    return (
      <div className="fullscreen-error">
        <h1>Configuration Error</h1>
        <p>
          Missing required environment variable: <code>API_KEY</code>.
        </p>
        <p>Please ensure it is configured in your environment to run the app.</p>
      </div>
    );
  }

  const { showWelcomeScreen, theme, font } = useUI();

  useEffect(() => {
    const selectedTheme = themes.find(t => t.name === theme) || themes[0];
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', selectedTheme.colors[0]);
    root.style.setProperty('--theme-surface', selectedTheme.colors[1]);
    root.style.setProperty('--theme-accent', selectedTheme.colors[2]);
    root.style.setProperty('--theme-text', selectedTheme.colors[3]);
    root.style.setProperty('--theme-document-bg', selectedTheme.colors[4]);
    if (selectedTheme.gradient) {
      root.style.setProperty('--theme-gradient', selectedTheme.gradient);
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-document', font);
  }, [font]);

  return (
    <div className="App">
      {showWelcomeScreen && <WelcomeScreen />}
      <LiveAPIProvider apiKey={API_KEY}>
        <AppContent />
      </LiveAPIProvider>
    </div>
  );
}

export default App;
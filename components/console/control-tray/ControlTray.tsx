/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import cn from 'classnames';
import { memo, ReactNode, useEffect, useRef, useState } from 'react';
import { AudioRecorder } from '../../../lib/audio-recorder';
import { useLiveAPIContext } from '../../../contexts/LiveAPIContext';
import { useAgent, usePerfLogStore, useUI } from '../../../lib/state';
import { 
  Play, 
  Square, 
  Mic, 
  MicOff, 
  Keyboard, 
  Send, 
  Sparkles, 
  HelpCircle,
  Volume2,
  X,
} from 'lucide-react';

export type ControlTrayProps = {
  children?: ReactNode;
};

const USER_AUDIO_INPUT_DETECTION_THRESHOLD = 0.01;
const USER_TALKING_STATE_COOLDOWN_MS = 1500;

const QUICK_THAI_PROMPTS = [
  '🌸 ช่วยวางโครงสร้าง Mobile App ให้หน่อยค่ะ',
  '👵 ตรวจสอบความพร้อมสำหรับผู้สูงอายุ (WCAG AAA)',
  '📊 วาดกราฟฟังก์ชันเปรียบเทียบสถิติ',
  '📝 ช่วยสรุปใจความสำคัญเป็นประเด็นชัดเจน',
];

/**
 * Redesigned ControlTray with tactile mobile-first touch targets,
 * fluid gradients, reactive audio visualizer rings, and cute Thai status cues.
 */
function ControlTray({ children }: ControlTrayProps) {
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [micVolume, setMicVolume] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const userSpeakingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstAudioChunkSentRef = useRef(false);
  const bufferedAudioRef = useRef<string[]>([]);

  const { showAgentEdit, showUserConfig, setShowHelpModal, agentState } = useUI();
  const { current: agent } = useAgent();
  const { addLog: addPerfLog, startNewSession } = usePerfLogStore();
  const { client, connected, connect, disconnect, isConnecting, volumeRef } = useLiveAPIContext();

  useEffect(() => {
    if (!connected && !isConnecting) {
      firstAudioChunkSentRef.current = false;
      setIsUserSpeaking(false);
      setMicVolume(0);
    }
  }, [connected, isConnecting]);

  useEffect(() => {
    const onVolume = (volume: number) => {
      setMicVolume(Math.min(volume * 10, 1));
      if (volume > USER_AUDIO_INPUT_DETECTION_THRESHOLD) {
        setIsUserSpeaking(true);
        if (userSpeakingTimeoutRef.current) {
          clearTimeout(userSpeakingTimeoutRef.current);
        }
        userSpeakingTimeoutRef.current = setTimeout(
          () => setIsUserSpeaking(false),
          USER_TALKING_STATE_COOLDOWN_MS,
        );
      }
    };

    audioRecorder.on('volume', onVolume);
    return () => {
      audioRecorder.off('volume', onVolume);
    };
  }, [audioRecorder]);

  useEffect(() => {
    if (showAgentEdit || showUserConfig) {
      if (connected) disconnect();
    }
  }, [showAgentEdit, showUserConfig, connected, disconnect]);

  useEffect(() => {
    if (showTextInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showTextInput]);

  useEffect(() => {
    const onData = (base64: string) => {
      if (!connected) {
        bufferedAudioRef.current.push(base64);
        return;
      }

      if (bufferedAudioRef.current.length > 0) {
        bufferedAudioRef.current.forEach(chunk => {
          client.sendRealtimeInput({
            media: { mimeType: 'audio/pcm;rate=16000', data: chunk },
          });
        });
        bufferedAudioRef.current = [];
      }

      if (!firstAudioChunkSentRef.current) {
        addPerfLog({ turn: 0, event: 'Audio: First chunk sent to agent' });
        firstAudioChunkSentRef.current = true;
      }

      client.sendRealtimeInput({
        media: { mimeType: 'audio/pcm;rate=16000', data: base64 },
      });
    };

    if (connected && !muted) {
      audioRecorder.on('data', onData);
      audioRecorder.start();
    } else {
      audioRecorder.stop();
    }
    return () => {
      audioRecorder.off('data', onData);
    };
  }, [connected, client, muted, audioRecorder, addPerfLog]);

  const handleConnectToggle = () => {
    if (connected) {
      disconnect();
    } else {
      startNewSession();
      connect();
    }
  };

  const handleSendText = (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : textInput).trim();
    if (!query) return;

    if (connected) {
      client.send([{ text: query }]);
    } else {
      // Auto connect then send
      startNewSession();
      connect().then(() => {
        setTimeout(() => {
          client.send([{ text: query }]);
        }, 800);
      });
    }

    setTextInput('');
    setShowTextInput(false);
  };

  // Status message
  const getStatusText = () => {
    if (isConnecting) return 'กำลังเชื่อมต่อกับน้องอาร์ตี้...';
    if (!connected) return 'กดปุ่มเพื่อเริ่มสนทนาภาษาไทยกับน้องอาร์ตี้ค่ะ';
    if (isUserSpeaking) return 'กำลังรับฟังเสียงของคุณอย่างตั้งใจค่ะ... 🎙️';
    return `${agent.name} กำลังฟังอยู่ค่ะ สามารถพูดคุยได้ทันที 🌸`;
  };

  return (
    <nav className="arty-control-dock-container" aria-label="แถบควบคุมการสนทนา">
      {/* Quick Suggestion Chips (when connected or typing) */}
      <div className="quick-suggestions-scroller" role="toolbar" aria-label="คำสั่งด่วน">
        {QUICK_THAI_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            className="suggestion-chip"
            onClick={() => handleSendText(prompt)}
            title={prompt}
          >
            <Sparkles size={12} className="text-pink-400 flex-shrink-0" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Main Dock */}
      <div className="arty-control-dock glass-dock">
        {/* Status Indicator Bar */}
        <div className="dock-status-row">
          <span className={cn('status-dot', { active: connected, connecting: isConnecting })} />
          <span className="status-label">{getStatusText()}</span>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="dock-actions-row">
          {/* Help Button */}
          <button
            className="dock-secondary-btn"
            onClick={() => setShowHelpModal(true)}
            title="วิธีใช้งานระบบ"
            aria-label="วิธีใช้งานระบบ"
          >
            <HelpCircle size={22} />
          </button>

          {/* Text Input Toggle Button */}
          <button
            className={cn('dock-secondary-btn', { active: showTextInput })}
            onClick={() => setShowTextInput(!showTextInput)}
            title="พิมพ์ข้อความคุยกับน้องอาร์ตี้"
            aria-label="พิมพ์ข้อความคุยกับน้องอาร์ตี้"
          >
            <Keyboard size={22} />
          </button>

          {/* Main Hero Play/Pause Live Audio Connection Button */}
          <div className="hero-connect-wrapper">
            {connected && (
              <div 
                className="pulse-halo" 
                style={{ 
                  transform: `scale(${1 + micVolume * 0.4})`,
                  opacity: 0.6 + micVolume * 0.4 
                }} 
              />
            )}
            <button
              className={cn('hero-connect-btn', { connected, connecting: isConnecting })}
              onClick={handleConnectToggle}
              disabled={isConnecting}
              aria-label={connected ? 'หยุดการสนทนา' : 'เริ่มการสนทนาด้วยเสียง'}
            >
              {isConnecting ? (
                <div className="spinner" />
              ) : connected ? (
                <Square size={26} className="fill-current text-white" />
              ) : (
                <Play size={30} className="fill-current text-white ml-1" />
              )}
            </button>
          </div>

          {/* Microphone Mute/Unmute Button */}
          <button
            className={cn('dock-secondary-btn mic-btn', { muted, active: connected && !muted })}
            disabled={!connected}
            onClick={() => setMuted(!muted)}
            title={muted ? 'เปิดไมโครโฟน' : 'ปิดเสียงไมค์'}
            aria-label={muted ? 'เปิดไมโครโฟน' : 'ปิดเสียงไมค์'}
          >
            {muted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
        </div>

        {/* Text Input Drawer Overlay */}
        {showTextInput && (
          <form
            className="dock-text-drawer animate-slide-up"
            onSubmit={e => {
              e.preventDefault();
              handleSendText();
            }}
          >
            <div className="drawer-input-box">
              <input
                ref={inputRef}
                type="text"
                placeholder="พิมพ์ข้อความสั่งให้น้องอาร์ตี้ช่วยเขียนหรือค้นหา..."
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                className="drawer-input"
              />
              <button 
                type="submit" 
                className="drawer-send-btn" 
                disabled={!textInput.trim()}
                aria-label="ส่งข้อความ"
              >
                <Send size={18} />
              </button>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setShowTextInput(false)}
                aria-label="ปิดกล่องข้อความ"
              >
                <X size={18} />
              </button>
            </div>
          </form>
        )}
      </div>
    </nav>
  );
}

export default memo(ControlTray);

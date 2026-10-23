/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { useUI, useUser } from '../lib/state';
import { 
  Edit3, 
  BookOpen, 
  LayoutTemplate, 
  Sliders, 
  Sparkles, 
  Play, 
  Save, 
  RotateCcw, 
  RotateCw, 
  Download, 
  Eye, 
  FileText, 
  Layers, 
  CheckCircle2,
  HelpCircle,
  Copy,
  FolderOpen
} from 'lucide-react';
import c from 'classnames';

export default function StudioWorkspace() {
  const { 
    documentContent, 
    setDocumentContent, 
    studioSubTab, 
    setStudioSubTab,
    theme,
    font,
    setFont,
    incrementChangeCount 
  } = useUI();
  const { name, topic } = useUser();

  const [selectedTool, setSelectedTool] = useState<'editor' | 'library' | 'templates' | 'tokens' | 'motion'>('editor');
  const [isSaved, setIsSaved] = useState(true);
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [assistantOutput, setAssistantOutput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDocumentContent(e.target.value);
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    incrementChangeCount();
  };

  const handleAssistantAction = (actionType: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      if (actionType === 'summarize') {
        setAssistantOutput('สรุปประเด็นสำคัญ:\n• มุ่งเน้นการใช้งานที่ง่ายและเข้าถึงได้ทุกคน (Mobile-First)\n• รองรับเสียงภาษาไทยและระบบผู้ช่วยอัจฉริยะ\n• ออกแบบตามมาตรฐาน WCAG 2.1 AAA สำหรับผู้สูงอายุ');
      } else if (actionType === 'speech') {
        setAssistantOutput('บทพูดนำเสนอ:\n"สวัสดีค่ะทุกท่าน วันนี้เราภูมิใจนำเสนอ ARTYVERSE X WORKSPACE ระบบที่เชื่อมโยง Chat และ Studio เข้าด้วยกันอย่างไร้รอยต่อค่ะ"');
      } else if (actionType === 'simplify') {
        setAssistantOutput('ปรับข้อความให้กระชับและเข้าใจง่ายขึ้น:\n- ใช้งานง่าย\n- รองรับเสียงไทย\n- ระบบ Studio ครบวงจร');
      } else {
        setAssistantOutput('วิเคราะห์เรียบร้อยแล้วค่ะ เนื้อหามีความสมบูรณ์และพร้อมนำเสนอ');
      }
    }, 800);
  };

  return (
    <div className="studio-workspace-container flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Studio Top Bar */}
      <div className="studio-topbar flex items-center justify-between px-6 py-3 bg-slate-900/90 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold text-lg">ARTY STUDIO</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {isSaved ? 'บันทึกแล้ว' : 'มีการแก้ไข (ยังไม่บันทึก)'}
            </span>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <div className="text-sm font-medium text-slate-300 truncate max-w-xs">
            ชิ้นงาน: {topic || 'เอกสารการประชุมและบทพูด'}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-white/10">
            <button className="p-1.5 hover:bg-white/10 rounded text-slate-300" title="Undo">
              <RotateCcw size={16} />
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded text-slate-300" title="Redo">
              <RotateCw size={16} />
            </button>
          </div>

          <button 
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium border border-white/10 transition-colors"
          >
            <Save size={16} className="text-emerald-400" />
            <span>บันทึก</span>
          </button>

          <button 
            onClick={() => alert('เปิดโหมดพรีวิวและนำเสนอ (Presentation Mode)')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg text-sm font-bold shadow-lg transition-all"
          >
            <Play size={16} />
            <span>นำเสนอ / Present</span>
          </button>

          <button 
            onClick={() => {
              const blob = new Blob([documentContent], { type: 'text/markdown;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'artyverse-export.md';
              a.click();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium border border-white/10 transition-colors"
            title="Export ชิ้นงาน"
          >
            <Download size={16} className="text-pink-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Studio Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Tools & Assets */}
        <div className="w-64 bg-slate-900/60 border-r border-white/10 flex flex-col shrink-0">
          <div className="p-3 border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider">
            เครื่องมือ & แหล่งข้อมูล (Studio Tools)
          </div>
          <div className="flex flex-col p-2 gap-1.5">
            <button
              onClick={() => setSelectedTool('editor')}
              className={c('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left', {
                'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40': selectedTool === 'editor',
                'text-slate-400 hover:bg-white/5 hover:text-white': selectedTool !== 'editor'
              })}
            >
              <Edit3 size={18} />
              <span>ตัวแก้ไขเอกสาร (Editor)</span>
            </button>

            <button
              onClick={() => setSelectedTool('library')}
              className={c('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left', {
                'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40': selectedTool === 'library',
                'text-slate-400 hover:bg-white/5 hover:text-white': selectedTool !== 'library'
              })}
            >
              <FolderOpen size={18} />
              <span>คลังข้อมูลร่วม (Library)</span>
            </button>

            <button
              onClick={() => setSelectedTool('templates')}
              className={c('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left', {
                'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40': selectedTool === 'templates',
                'text-slate-400 hover:bg-white/5 hover:text-white': selectedTool !== 'templates'
              })}
            >
              <LayoutTemplate size={18} />
              <span>เทมเพลต (Templates)</span>
            </button>

            <button
              onClick={() => setSelectedTool('tokens')}
              className={c('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left', {
                'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40': selectedTool === 'tokens',
                'text-slate-400 hover:bg-white/5 hover:text-white': selectedTool !== 'tokens'
              })}
            >
              <Sliders size={18} />
              <span>ดีไซน์โทเค็น & ฟอนต์</span>
            </button>

            <button
              onClick={() => setSelectedTool('motion')}
              className={c('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left', {
                'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40': selectedTool === 'motion',
                'text-slate-400 hover:bg-white/5 hover:text-white': selectedTool !== 'motion'
              })}
            >
              <Sparkles size={18} />
              <span>Motion Lab (แอนิเมชัน)</span>
            </button>
          </div>

          <div className="mt-auto p-4 border-t border-white/10 bg-slate-950/40 text-xs text-slate-400">
            <div className="font-bold text-slate-300 mb-1">ระบบออกแบบเชื่อมโยง</div>
            <div>ใช้ tokens, typography และ library ร่วมกับ Chat โดยไม่มีข้อมูลสูญหาย</div>
          </div>
        </div>

        {/* Center Canvas / Workspace Area */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden p-6">
          {selectedTool === 'editor' && (
            <div className="flex flex-col h-full gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="text-cyan-400" size={20} />
                  <span>พื้นที่แก้ไขเอกสารและบทพูด (Studio Editor)</span>
                </h2>
                <div className="text-xs text-slate-400">รองรับภาษาไทยและอังกฤษ • Markdown & HTML</div>
              </div>
              <textarea
                value={documentContent}
                onChange={handleContentChange}
                className="flex-1 w-full bg-slate-900/80 border border-white/15 rounded-2xl p-5 text-slate-100 font-mono text-sm resize-none focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
                placeholder="พิมพ์หรือแก้ไขเนื้อหาเอกสาร รายงาน หรือบทพูด..."
              />
            </div>
          )}

          {selectedTool === 'library' && (
            <div className="flex flex-col h-full gap-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderOpen className="text-cyan-400" size={20} />
                <span>คลังข้อมูลร่วม (Shared Library & Assets)</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/80 border border-white/10 rounded-xl">
                  <div className="font-bold text-cyan-300 mb-1">เอกสารการประชุม (Meeting Notes)</div>
                  <p className="text-xs text-slate-400">สรุปการประชุมและบันทึกเสียงอัตโนมัติจาก Chat</p>
                </div>
                <div className="p-4 bg-slate-900/80 border border-white/10 rounded-xl">
                  <div className="font-bold text-pink-300 mb-1">บทพูดนำเสนอ (Presentation Script)</div>
                  <p className="text-xs text-slate-400">บทพูดและสคริปต์แนะนำตัวสำหรับน้องอาร์ตี้</p>
                </div>
                <div className="p-4 bg-slate-900/80 border border-white/10 rounded-xl">
                  <div className="font-bold text-emerald-300 mb-1">ภาพประกอบและกราฟ</div>
                  <p className="text-xs text-slate-400">กราฟคณิตศาสตร์และไดอะแกรมที่สร้างโดย AI</p>
                </div>
                <div className="p-4 bg-slate-900/80 border border-white/10 rounded-xl">
                  <div className="font-bold text-violet-300 mb-1">ไฟล์ผู้ใช้และเอกสาร PDF</div>
                  <p className="text-xs text-slate-400">เอกสารอ้างอิงที่อัปโหลดไว้ในเซสชัน</p>
                </div>
              </div>
            </div>
          )}

          {selectedTool === 'templates' && (
            <div className="flex flex-col h-full gap-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <LayoutTemplate className="text-cyan-400" size={20} />
                <span>เทมเพลตชิ้นงาน (Templates)</span>
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {['รายงานสรุปผู้บริหาร', 'สคริปต์บทพูดงานอีเวนต์', 'แผนพัฒนาแอปพลิเคชัน', 'สรุปรายงานการประชุม'].map((tpl, i) => (
                  <div key={i} className="p-4 bg-slate-900/80 border border-white/10 rounded-xl hover:border-cyan-500/50 cursor-pointer transition-all flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-white mb-1">{tpl}</div>
                      <p className="text-xs text-slate-400">เทมเพลตมาตรฐานพร้อมใช้งานและจัดหน้าอัตโนมัติ</p>
                    </div>
                    <button 
                      onClick={() => alert(`นำเข้าเทมเพลต ${tpl} สู่ Editor เรียบร้อยแล้ว`)}
                      className="mt-4 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold rounded-lg border border-cyan-500/30 transition-all"
                    >
                      เลือกใช้เทมเพลตนี้
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTool === 'tokens' && (
            <div className="flex flex-col h-full gap-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="text-cyan-400" size={20} />
                <span>ดีไซน์โทเค็น & ฟอนต์ (Design Tokens & Typography)</span>
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 bg-slate-900/80 border border-white/10 rounded-xl">
                  <div className="font-bold text-white mb-3">รูปแบบตัวอักษร (Typography)</div>
                  <select 
                    value={font}
                    onChange={(e) => setFont(e.target.value)}
                    className="w-full bg-slate-800 border border-white/20 rounded-lg p-2.5 text-white text-sm"
                  >
                    <option value="Arial">Arial (มาตรฐาน)</option>
                    <option value="Prompt">Prompt (โมเดิร์น สวยงาม)</option>
                    <option value="Kanit">Kanit (ตัวหนา ชัดเจน)</option>
                    <option value="Sarabun">Sarabun (ทางการ อ่านง่าย)</option>
                  </select>
                </div>
                <div className="p-5 bg-slate-900/80 border border-white/10 rounded-xl">
                  <div className="font-bold text-white mb-3">ธีมสีหลัก (Color Palette)</div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-500 ring-2 ring-white/50" />
                    <div className="w-8 h-8 rounded-full bg-cyan-500" />
                    <div className="w-8 h-8 rounded-full bg-violet-600" />
                    <div className="w-8 h-8 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTool === 'motion' && (
            <div className="flex flex-col h-full gap-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="text-cyan-400" size={20} />
                <span>Motion Lab (แอนิเมชันและการนำเสนอ)</span>
              </h2>
              <div className="p-6 bg-slate-900/80 border border-white/10 rounded-xl flex flex-col gap-4">
                <div className="font-bold text-white">เลือก Motion Preset สำหรับชิ้นงาน:</div>
                <div className="grid grid-cols-3 gap-3">
                  {['Text Reveal (นุ่มนวล)', 'Kinetic Typography', 'Cinematic Fade', 'Card Hover Scale', 'Smooth Slide', 'Reduced Motion'].map((m, i) => (
                    <button key={i} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-left border border-white/10 transition-colors">
                      <div className="font-bold text-cyan-300 text-sm">{m}</div>
                      <div className="text-xs text-slate-400 mt-1">แอนิเมชันคุณภาพสูงสำหรับ Studio</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Contextual Assistant Inspector */}
        <div className="w-80 bg-slate-900/70 border-l border-white/10 flex flex-col shrink-0 p-4 gap-4 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-bold text-sm text-cyan-300 flex items-center gap-2">
              <Sparkles size={16} />
              <span>ผู้ช่วยอัจฉริยะ (Contextual Assistant)</span>
            </span>
          </div>

          <p className="text-xs text-slate-400">
            เลือกคำสั่งด่วนเพื่อช่วยปรับแต่งเนื้อหาใน Studio โดยอิงจากบริบทปัจจุบัน:
          </p>

          <div className="flex flex-col gap-2">
            <button 
              onClick={() => handleAssistantAction('summarize')}
              className="w-full text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 border border-white/10 transition-colors"
            >
              ✨ สรุปเนื้อหานี้ให้กระชับ
            </button>
            <button 
              onClick={() => handleAssistantAction('speech')}
              className="w-full text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 border border-white/10 transition-colors"
            >
              🎙️ เปลี่ยนเป็นบทพูดสำหรับนำเสนอ
            </button>
            <button 
              onClick={() => handleAssistantAction('simplify')}
              className="w-full text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 border border-white/10 transition-colors"
            >
              📝 จัดหัวข้อให้อ่านง่ายขึ้น
            </button>
          </div>

          {isAnalyzing && (
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs text-cyan-300 animate-pulse text-center">
              น้องอาร์ตี้กำลังประมวลผลข้อความ...
            </div>
          )}

          {assistantOutput && !isAnalyzing && (
            <div className="mt-2 p-3 bg-slate-950 border border-white/15 rounded-xl text-xs text-slate-200 leading-relaxed">
              <div className="font-bold text-emerald-400 mb-1">ผลลัพธ์จากผู้ช่วย:</div>
              <div className="whitespace-pre-wrap">{assistantOutput}</div>
              <button 
                onClick={() => {
                  setDocumentContent(prev => prev + '\n\n' + assistantOutput);
                  setAssistantOutput('');
                }}
                className="mt-3 w-full py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded font-bold text-xs border border-emerald-500/30 transition-all"
              >
                แทรกลงในเอกสาร
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

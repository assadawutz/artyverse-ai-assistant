/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Agent } from './presets/agents';
import { User } from './state';

/**
 * Dynamically constructs the system instructions prompt that is sent to the
 * Live API upon connection.
 *
 * @param agent The currently selected agent object, containing its personality.
 * @param user The current user settings object.
 * @param currentDocument Current content of the document.
 * @param promptVersion An optional version number for debugging purposes.
 * @param useSearch Flag indicating if Google Search grounding tool is enabled.
 * @returns A formatted string containing the complete system instructions.
 */
export const createSystemInstructions = (
  agent: Agent,
  user: User,
  currentDocument?: string,
  promptVersion?: number,
  useSearch?: boolean
) => {
  const formatPrompt = `\n\nรูปแบบเอกสารที่ต้องการ: ${
    user.format || 'Markdown'
  } รูปแบบนี้ต้องถูกใช้อย่างเคร่งครัดในการอัปเดตเอกสารทุกครั้ง`;

  const searchPrompt = useSearch 
    ? '\n\n**GOOGLE SEARCH:** คุณสามารถใช้เครื่องมือ `googleSearch` เพื่อค้นหาข้อมูลล่าสุด สถิติ หรือข้อเท็จจริงภายนอกได้ทุกเมื่อหากจำเป็น'
    : '';

  const documentPrompt = currentDocument && currentDocument.trim().length > 0 && !currentDocument.includes('As you talk, your scribe will write')
    ? `\n\n**สถานะเอกสารปัจจุบัน (Current Document):**\n---\n${currentDocument}\n---\nโปรดรับรู้เนื้อหาที่มีอยู่นี้ และดำเนินการเขียนต่อจากจุดนี้อย่างต่อเนื่อง`
    : '\n\n**เริ่มต้นเซสชันใหม่:** ขณะนี้เอกสารยังว่างอยู่ พร้อมรับคำสั่งจากผู้ใช้';

  const versionPrompt =
    promptVersion !== undefined ? `\n\nเวอร์ชันพร้อมท์: ${promptVersion}` : '';

  const now = new Date();
  const date = now.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
  const time = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateTimePrompt = `\n\nวันเวลาปัจจุบัน: ${date} เวลา ${time}`;

  const pdfPrompt = user.pdfFiles && user.pdfFiles.length > 0
    ? `\n\n**เอกสารอ้างอิง PDF ที่ผู้ใช้อัปโหลด:**\n${user.pdfFiles.map(f => `--- เริ่มต้น PDF: ${f.name} ---\n${f.text}\n--- สิ้นสุด PDF: ${f.name} ---`).join('\n\n')}`
    : '';

  return `คุณคือ "${agent.name}" ในบทบาท "${agent.role}"
บุคลิกและตัวตนของคุณคือ:
${agent.personality}

คุณกำลังพูดคุยและทำงานร่วมกับ "${user.name || 'คุณผู้ใช้'}"
ข้อมูลบริบทที่ผู้ใช้ระบุ: "${user.info || 'ผู้พัฒนา Mobile-First และระบบที่เข้าถึงง่าย'}"
หัวข้อการเขียน/การทำงานในเซสชันนี้: "${user.topic || 'การพัฒนา Mobile Application & การเข้าถึงของผู้สูงอายุ'}"
${pdfPrompt}

**กฎการโต้ตอบหลัก (CORE INTERACTION RULES - STRICT):**
1. **ภาษาไทยเท่านั้น (THAI LANGUAGE ONLY):** ทุกคำตอบเสียง (Spoken Audio) และการเขียนเอกสารต้องเป็นภาษาไทยล้วน ยกเว้นศัพท์เทคนิคและโค้ดคอมพิวเตอร์ ใช้คำลงท้าย "คะ/ค่ะ" เสมอด้วยน้ำเสียงที่น่ารัก อบอุ่น สุภาพ และอ่อนหวาน
2. **เป็นคู่คิดที่สร้างสรรค์และกระตือรือร้น:** เสนอไอเดีย 2-3 ข้อที่เป็นประโยชน์ทุกครั้งหลังอัปเดตเอกสาร เช่น การแนะนำฟีเจอร์สำหรับผู้สูงอายุ (Touch Targets 48x48dp, High-Contrast 7:1, VoiceOver Support)
3. **ข้อเสนอแนะให้พูดตอบด้วยเสียงเท่านั้น:** ข้อเสนอแนะแนวทางขยายต่อ ให้พูดแนะนำด้วยเสียงเท่านั้น อย่าพิมพ์ข้อเสนอแนะที่ไม่ได้รับคำสั่งลงไปในเอกสาร เอกสารจะมีเฉพาะเนื้อหาจริงที่ผู้ใช้ต้องการ
4. **ลำดับการทำงาน:**
   - เมื่อผู้ใช้พูดจบ ให้เรียก \`getContext()\` เสมอเป็นอันดับแรก
   - หากต้องเขียนหรือแก้เอกสาร ให้เรียก \`updateDocument({ content: ... })\`
   - จากนั้นจึงพูดตอบกลับด้วยเสียงอันน่ารักและกระชับ
5. **การแทรกภาพประกอบ (Illustration):** แทรกแท็ก [illustration id="unique_id" prompt="detailed english prompt" width="80%"] ในเนื้อหา Markdown
6. **การวาดกราฟคณิตศาสตร์ (Graph):** แทรกแท็ก [graph title="หัวข้อ" functions="['f(x)']" labels="['label']" xDomain="[min, max]" yDomain="[min, max]"]

${formatPrompt}
${documentPrompt}
${searchPrompt}
${dateTimePrompt}
${versionPrompt}
`;
};
# ⚡ FlashDr. — นวัตกรรมระบบ Flashcard & Active Recall เพื่อการเรียนรู้อัจฉริยะ

> **โครงงานนวัตกรรมทางการศึกษาเพื่อช่วยเหลือผู้เรียนและลดภาระงานของครูผู้สอน**  
> 🔗 **GitHub Repository (Public):** [https://github.com/Totsakan888/ForDr.Somkid](https://github.com/Totsakan888/ForDr.Somkid)  
> 🌐 **Production Web บน Vercel:** [https://fordrsomkid.vercel.app](https://fordrsomkid.vercel.app) *(หรือ URL บน Vercel ของคุณ)*

---

## 💡 แนวคิดและนวัตกรรมทางการศึกษา (Educational Innovation Concept)

### 1. ปัญหาทางการศึกษา (Problem Statement)
ในการเรียนการสอนหมวดวิชาวิศวกรรมคอมพิวเตอร์และระบบเครือข่าย ผู้เรียนมักประสบปัญหา **"การลืมคำสั่งคอนฟิกและทฤษฎีเฉพาะทางอย่างรวดเร็ว"** (เช่น คำสั่ง Cisco IOS, โครงสร้างสถาปัตยกรรมคอมพิวเตอร์ เช่น *Locality of Reference*) ขณะเดียวกัน **ครูผู้สอนต้องแบกรับภาระงาน** ในการจัดทำแบบทดสอบย่อยซ้ำๆ และตรวจวัดความเข้าใจของผู้เรียน

### 2. นวัตกรรมที่ช่วยตอบโจทย์ (Innovation Solution)
ระบบ **FlashDr.** ถูกออกแบบขึ้นเพื่อแก้ปัญหาทั้งสองฝั่งอย่างเป็นรูปธรรม:
* **สำหรับผู้เรียน (Learner-Centric):**
  * **Active Recall Technique:** การฝึกดึงข้อมูลจากความจำด้วยการ์ดพลิก 3 มิติ (3D Perspective Flip) แทนการอ่านผ่านๆ ซึ่งพิสูจน์แล้วว่าช่วยสร้างความจำระยะยาวได้ดีที่สุด
  * **Gamified Micro-Learning:** ระบบไฟลุก **🔥 Streak Counter**, อัตราความแม่นยำ (Mastery Rate), เสียงตอบรับ (Web Audio Synthesizer) และพลุเฉลิมฉลอง (Confetti) สร้าง Dopamine ช่วยให้วัยรุ่นสนุกกับการทบทวนและไม่รู้สึกเบื่อ
  * **Self-Assessment Feedback:** ผู้เรียนสามารถประเมินตนเองได้ทันทีว่าข้อใด *"จำได้แล้ว"* หรือ *"ยังต้องทบทวน"* เพื่อให้โฟกัสเฉพาะจุดที่ยังไม่แม่นยำ
* **สำหรับครูผู้สอน (Teacher Workload Reduction):**
  * **To-Do Style Management:** หน้าจัดการการ์ดที่ใช้งานง่ายคล้าย To-Do List สามารถเพิ่ม แก้ไข หรือลบเนื้อหาคำถามได้อย่างสะดวกรวดเร็ว
  * **Data Export / Import (JSON):** ครูสามารถสร้างชุดคำศัพท์หรือโจทย์ข้อสอบ แล้ว Export เป็นไฟล์เดียว เพื่อแจกจ่ายให้นักเรียนทั้งห้องนำไปเปิดทบทวนได้ทันที โดยไม่ต้องตั้งค่าระบบใหม่

---

## 🌟 ฟีเจอร์หลักของระบบ (Core Features)

1. **🎴 โหมดทบทวนการ์ด 3D (Interactive 3D Flashcards)**
   * คลิกการ์ด หรือกดปุ่ม <kbd>Spacebar</kbd> เพื่อพลิกดูคำตอบ
   * ปุ่มลัด <kbd>→</kbd> (จำได้แม่นยำ) และ <kbd>←</kbd> (ยังจำไม่ได้)
   * ระบบ **"💡 ขอคำใบ้"** ช่วยกระตุ้นความจำก่อนดูเฉลย
   * ระบบสุ่มการ์ด (Shuffle Deck) เพื่อทดสอบความจำแบบไม่เรียงลำดับ
2. **📋 โหมดจัดการคลังความรู้สไตล์ To-Do (CRUD System)**
   * เพิ่ม/แก้ไข/ลบ Flashcard ได้แบบ Real-time
   * คลิกไอคอนดาว ⭐/⚪ เพื่อติ๊กสถานะการจำได้
   * ค้นหาด่วน (Live Search) คำถาม คำตอบ และคำใบ้
   * กรองตามหมวดหมู่ (Category Filter)
3. **🎨 ดีไซน์ Cyber Dark Theme โดนใจวัยรุ่น**
   * โทนสีมืด Cyber Obsidian พร้อมแสงนีออน Violet & Cyan
   * แสดงผลสวยงามทั้งบนสมาร์ตโฟน แท็บเล็ต และคอมพิวเตอร์ (Responsive)
4. **📚 ข้อมูลตัวอย่างที่ติดตั้งไว้ในระบบ (Pre-seeded Cards)**
   * ทฤษฎี **Locality of Reference** (Temporal & Spatial Locality)
   * คำสั่ง **Cisco IOS**: `show ip interface brief`, `copy running-config startup-config`, `ip route`, `vlan`
   * ทฤษฎีระบบ: **RESTful API Idempotency**, **Process vs Thread**

---

## 🛠️ เทคโนโลยีที่ใช้พัฒนา (Tech Stack)

* **Backend & API:** Python 3 (Flask Framework)
* **Database:** SQLite (รองรับทั้ง Local Environment และ Serverless `/tmp` สำหรับ Vercel)
* **Frontend:** HTML5, CSS3 (3D Transform, Flexbox/Grid, Glassmorphism), Modern Vanilla JavaScript
* **Sound & Animation:** Web Audio API (Synthesizer โดยไม่ต้องพึ่งพาไฟล์ภายนอก), Canvas Confetti Particles
* **Version Control:** Git & GitHub (Public Repository)
* **Cloud Platform:** Vercel (Production Web Hosting)

---

## 🚀 วิธีเปิดใช้งานและเผยแพร่ (Deployment & Run Guide)

### 1. การรันในเครื่อง (Local Development)
```bash
# 1. ติดตั้ง Dependencies
pip install -r requirements.txt

# 2. เริ่มต้นรันเซิร์ฟเวอร์
python app.py
```
เปิดใช้งานที่: [http://127.0.0.1:5000](http://127.0.0.1:5000)

### 2. การเผยแพร่ขึ้น Vercel (Production Web Deployment)
โปรเจกต์นี้ตั้งค่า `vercel.json` และ `api/index.py` สำหรับ Serverless ไว้อย่างสมบูรณ์:

1. เข้าไปที่ [vercel.com](https://vercel.com) แล้วล็อกอินด้วยบัญชี **GitHub** ของคุณ
2. กดปุ่ม **"Add New..."** > **"Project"**
3. เลือก Repository: **`Totsakan888/ForDr.Somkid`**
4. กดปุ่ม **"Deploy"**
5. รอระบบประมวลผลประมาณ 30 วินาที จะได้รับ URL สำหรับส่งงานทันที เช่น:
   👉 `https://fordrsomkid.vercel.app` (หรือชื่อโปรเจกต์ของคุณบน Vercel)

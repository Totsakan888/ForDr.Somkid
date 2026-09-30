# ⚡ FlashDr. — Mini Flashcard & Quiz App

เว็บแอปพลิเคชันทบทวนความรู้ คำศัพท์ และคำสั่งคอนฟิกอุปกรณ์เครือข่าย/ทฤษฎีคอมพิวเตอร์ สไตล์ **Dark Theme** สุดทันสมัย พร้อมอนิเมชันพลิกการ์ด 3 มิติ และระบบบันทึกข้อมูลคล้าย To-Do List

พัฒนาด้วย **Python (Flask)** ร่วมกับฐานข้อมูล **SQLite** ออกแบบโครงสร้างให้รองรับทั้งการรันในเครื่อง (Local) และการโฮสต์บน **Vercel** พร้อมเก็บซอร์สโค้ดบน **GitHub** ได้อย่างสมบูรณ์แบบ

---

## 🌟 ฟีเจอร์เด่น (Key Features)

1. **โหมดทบทวนการ์ด 3D (Interactive 3D Flashcard)**
   - การ์ดหมุนพลิกสลับหน้า-หลังแบบ 3D (`transform-style: preserve-3d`)
   - รองรับปุ่มลัดคีย์บอร์ด:
     - `Spacebar`: พลิกดูคำตอบ / กลับมาหน้าคำถาม
     - `ลูกศรซ้าย [←]`: การ์ดก่อนหน้า / ประเมินว่า "ยังจำไม่ได้"
     - `ลูกศรขวา [→]`: การ์ดถัดไป / ประเมินว่า "จำได้แม่นยำ!"
   - ระบบคำใบ้ (Hint) ซ่อนอยู่ เพื่อช่วยฟื้นความจำก่อนดูเฉลย
   - ระบบสุ่มการ์ด (Shuffle Deck) เพื่อทดสอบความจำแบบไม่เรียงลำดับ

2. **ระบบจัดเก็บและจัดการข้อมูลแบบ To-Do List (Full CRUD)**
   - เพิ่ม (Add), แก้ไข (Edit), และลบ (Delete) Flashcard ได้ทันทีผ่าน Modal สวยงาม
   - สลับสถานะ **"จำได้แล้ว" (Mastered ⭐)** หรือ **"ยังต้องทบทวน" (⚪)** ได้ในคลิกเดียวเหมือนการติ๊ก To-Do
   - ช่องค้นหาด่วน (Live Search) ค้นหาทั้งคำถาม, คำตอบ และคำใบ้แบบเรียลไทม์
   - ตัวกรองแยกตามหมวดหมู่ (Category Filter) และระดับความยาก (Difficulty)

3. **ดีไซน์ดึงดูดใจวัยรุ่น (Gen-Z Gamified Dark Theme)**
   - โทนสีมืด Cyber Obsidian พร้อมแสงเรืองรอง Neon Violet (`#8B5CF6`) & Cyber Cyan (`#06B6D4`)
   - ระบบไฟลุก **🔥 Streak Counter** นับสถิติการทบทวนต่อเนื่อง (บันทึกไว้ใน Browser ไม่หายแม้รีเฟรช)
   - เสียงเอฟเฟกต์สังเคราะห์ผ่าน **Web Audio API** (เสียงพลิกการ์ด, เสียงทายถูก, เสียงเฉลิมฉลอง) ทำงานได้ทันทีโดยไม่ต้องโหลดไฟล์เสียงภายนอก
   - พลุเฉลิมฉลอง (**Confetti**) เมื่อทบทวนการ์ดครบเซ็ต

4. **ข้อมูลเริ่มต้นที่เตรียมไว้ให้ (Pre-seeded Cards)**
   - ทฤษฎี **Locality of Reference** (Spatial & Temporal Locality, CPU Cache)
   - คำสั่งคอนฟิก **Cisco IOS**:
     - `show ip interface brief` (ตรวจสอบสถานะพอร์ตและ IP)
     - `copy running-config startup-config` (บันทึกค่าลง NVRAM)
     - `ip route 192.168.2.0 255.255.255.0 10.0.0.1` (Static Route)
     - `vlan 20` และการตั้งชื่อ VLAN
   - ระบบและสถาปัตยกรรม: **RESTful API Idempotency**, **Process vs Thread**

---

## 🛠️ โครงสร้างโปรเจกต์ (Project Structure)

```text
FlashCardForDr.Somkid/
├── .agents/
│   └── skills/
│       └── edutech-web-crafter/
│           └── SKILL.md         # Custom Antigravity Skill สำหรับแอปการศึกษา
├── api/
│   └── index.py                 # Vercel Serverless Entrypoint
├── static/
│   ├── css/
│   │   └── style.css            # Dark Theme & 3D CSS Animation
│   └── js/
│       ├── app.js               # จัดการ State, 3D Flip, คีย์บอร์ด, และ REST API
│       └── sound.js             # Web Audio API Sound Synthesizer
├── templates/
│   └── index.html               # หน้า Single Page Application
├── app.py                       # Flask Web Server & RESTful APIs
├── database.py                  # SQLite CRUD Engine & Auto-seed
├── requirements.txt             # รายการ Dependency (Flask)
├── vercel.json                  # คอนฟิกสำหรับ Deploy บน Vercel
├── .gitignore                   # กรองไฟล์ที่ไม่ต้องการขึ้น GitHub
└── README.md                    # เอกสารคู่มือโปรเจกต์
```

---

## 🚀 วิธีเปิดใช้งานในเครื่อง (Local Setup)

### 1. ติดตั้ง Dependencies
```bash
pip install -r requirements.txt
```

### 2. รันแอปพลิเคชัน
```bash
python app.py
```

### 3. เปิดเว็บเบราว์เซอร์
เข้าใช้งานได้ที่: [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 📦 วิธีนำขึ้น GitHub (Version Control)

เมื่อต้องการนำโค้ดขึ้นไปเก็บบน GitHub:

```bash
# 1. สร้าง Git Repository
git init

# 2. เพิ่มไฟล์ทั้งหมด
git add .

# 3. Commit ตามมาตรฐาน Conventional Commits
git commit -m "feat: initial flashcard and quiz app with dark theme"

# 4. เชื่อมต่อกับ GitHub Repository ของคุณ (สร้าง repo เปล่าไว้บน github.com)
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## ☁️ วิธี Deploy ขึ้น Vercel (Hosting)

โปรเจกต์นี้ตั้งค่า `vercel.json` และ `api/index.py` ไว้เรียบร้อยแล้ว:

### วิธีที่ 1: Deploy ผ่าน GitHub (แนะนำที่สุด)
1. ไปที่ [vercel.com](https://vercel.com) แล้วล็อกอินด้วย GitHub
2. กดปุ่ม **"Add New..."** > **"Project"**
3. เลือก Repository ที่คุณเพิ่ง Push ขึ้นไป
4. Vercel จะตรวจพบการตั้งค่าใน `vercel.json` โดยอัตโนมัติ ให้กด **"Deploy"**
5. รอประมาณ 30 วินาที จะได้โดเมน URL เช่น `https://your-project.vercel.app` ใช้งานได้ทันที!

### วิธีที่ 2: Deploy ผ่าน Vercel CLI
```bash
npm install -g vercel
vercel
```

*(หมายเหตุ: บน Vercel Serverless ระบบได้เขียน fallback ไว้ให้ใช้ `/tmp/flashcards.db` โดยอัตโนมัติ ทำให้สามารถเปิดอ่านและทดลองเล่นข้อมูลเริ่มต้นได้โดยไม่เกิดข้อผิดพลาดด้าน Read-only Filesystem)*

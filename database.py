"""
database.py - SQLite Database Management for Mini Flashcard & Quiz App
Handles connection, initialization, seed data, and CRUD operations.
Thorough design: supports both local execution and Vercel Serverless environment (/tmp fallback).
"""

import os
import sqlite3
from typing import List, Dict, Any, Optional

# Vercel serverless has a read-only filesystem except /tmp
if os.environ.get("VERCEL"):
    DB_PATH = os.path.join("/tmp", "flashcards.db")
else:
    DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "flashcards.db")


def get_db_connection() -> sqlite3.Connection:
    """Creates a database connection with dict-like row access."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(force_reseed: bool = False) -> None:
    """Initializes tables and seeds default educational cards if empty."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS flashcards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT NOT NULL DEFAULT 'General',
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                hint TEXT DEFAULT '',
                difficulty TEXT DEFAULT 'Medium',
                mastered INTEGER DEFAULT 0,
                review_count INTEGER DEFAULT 0,
                correct_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.commit()

        # Check if table is empty or forced reseed
        cursor.execute("SELECT COUNT(*) AS count FROM flashcards")
        count = cursor.fetchone()["count"]

        if count == 0 or force_reseed:
            if force_reseed:
                cursor.execute("DELETE FROM flashcards")
            seed_initial_data(cursor)
            conn.commit()


def seed_initial_data(cursor: sqlite3.Cursor) -> None:
    """Seeds high-value Computer Science, Network, and Architecture flashcards."""
    sample_cards = [
        (
            "Computer Architecture",
            "Locality of Reference คืออะไร? มีกี่ประเภทหลัก?",
            """หลักการที่โปรแกรมคอมพิวเตอร์มักจะเข้าถึงชุดข้อมูลหรือคำสั่งเดิมซ้ำๆ ในช่วงเวลาสั้นๆ โดยแบ่งเป็น 2 ประเภทหลัก:
1. Temporal Locality (การอ้างอิงเชิงเวลา): ข้อมูลหรือคำสั่งที่ถูกเรียกใช้ในตอนนี้ มีแนวโน้มสูงที่จะถูกเรียกซ้ำอีกครั้งในอนาคตอันใกล้ (เช่น ตัวแปรใน Loop)
2. Spatial Locality (การอ้างอิงเชิงพื้นที่): หากข้อมูลตำแหน่งหน่วยความจำใดถูกเข้าถึง ข้อมูลในตำแหน่งติดกันมักจะถูกเข้าถึงตามไปด้วย (เช่น Array traversal)

ความสำคัญ: เป็นหัวใจในการออกแบบระบบ Memory Hierarchy และ CPU Cache (L1, L2, L3) เพื่อเร่งความเร็วการทำงาน""",
            "นึกถึงแนวคิดเรื่องเวลา (Temporal) และตำแหน่งติดกัน (Spatial) ใน CPU Cache",
            "Medium",
        ),
        (
            "Network Engineering",
            "คำสั่ง Cisco IOS: ตรวจสอบสถานะและ IP Address ของทุก Interface อย่างย่อ",
            """# show ip interface brief
(หรือ sh ip int br)

ผลลัพธ์: จะแสดงรายการพอร์ต เช่น GigabitEthernet0/0/0, IP Address, สถานะ Layer 1 (Status: up/down) และ Layer 2 (Protocol: up/down)
ถือเป็นคำสั่ง First-line ในการตรวจสอบ Network Troubleshooting""",
            "ขึ้นต้นด้วยคำว่า 'show ip ...'",
            "Easy",
        ),
        (
            "Network Engineering",
            "คำสั่ง Cisco IOS: บันทึกการตั้งค่า (Running Config) ลงหน่วยความจำถาวร (NVRAM)",
            """# copy running-config startup-config
(หรือใช้คำสั่งย่อ: wr หรือ write memory)

ความหมาย: คัดลอกการตั้งค่าที่กำลังทำงานอยู่ใน RAM ลงใน NVRAM เพื่อให้การตั้งค่าไม่หายไปเมื่อ Router/Switch ถูก Reboot หรือดับไฟ""",
            "copy running... ไปยัง startup...",
            "Easy",
        ),
        (
            "Network Engineering",
            "คำสั่ง Cisco IOS: ตั้งค่า Static Route ไปยัง Network 192.168.2.0/24 ผ่าน Next-hop IP 10.0.0.1",
            """(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.1

โครงสร้างคำสั่ง:
ip route <destination-network> <subnet-mask> <next-hop-ip หรือ exit-interface>""",
            "ip route [ปลายทาง] [Subnet Mask] [IP ขาถัดไป]",
            "Medium",
        ),
        (
            "Network Engineering",
            "คำสั่ง Cisco IOS: สร้าง VLAN หมายเลข 20 และตั้งชื่อว่า 'Student-Lab'",
            """(config)# vlan 20
(config-vlan)# name Student-Lab
(config-vlan)# exit

หลังจากสร้างแล้วสามารถนำพอร์ตไปผูกเข้ากับ VLAN นี้ได้ด้วยคำสั่ง:
(config-if)# switchport mode access
(config-if)# switchport access vlan 20""",
            "เข้าโหมด config แล้วสั่ง 'vlan 20' ตามด้วย 'name ...'",
            "Easy",
        ),
        (
            "System & Theory",
            "RESTful API: Idempotency (ไอเดมโพเทนซ์) คืออะไร และ HTTP Methods ใดบ้างที่มีคุณสมบัตินี้?",
            """Idempotency คือ คุณสมบัติของการส่ง Request เดิมซ้ำหลายๆ ครั้ง แล้วได้ผลลัพธ์ต่อสถานะของระบบ (Server State) เหมือนกับการส่งเพียงครั้งเดียว ไม่ก่อให้เกิด Side Effect ซ้ำซ้อน

HTTP Methods ที่เป็น Idempotent:
- GET (อ่านข้อมูลเดิม ผลไม่เปลี่ยน)
- PUT (อัปเดตแทนที่ข้อมูลเดิมด้วย Payload เดิม)
- DELETE (ลบข้อมูลเดิม แม้ลบซ้ำข้อมูลก็ยังคงถูกลบอยู่)
- HEAD, OPTIONS

หมายเหตุ: POST ไม่เป็น Idempotent เพราะการส่งซ้ำจะสร้าง Resource ใหม่ขึ้นมาหลายตัว""",
            "ทำซ้ำกี่ครั้ง ผลต่อ Server ก็ยังเท่ากับทำครั้งเดียว (GET, PUT, DELETE)",
            "Hard",
        ),
        (
            "System & Theory",
            "Process vs Thread แตกต่างกันอย่างไรในแง่ Memory Space และ Context Switching?",
            """1. Memory Space:
- Process: มี Address Space, Stack, Heap และทรัพยากรแยกจากกันโดยอิสระ มีความปลอดภัยสูงหากตัวใดตัวหนึ่งล่ม
- Thread: อยู่ภายใต้ Process เดียวกัน โดยแชร์ Code, Data และ Heap ร่วมกัน แต่ละ Thread จะมีเฉพาะ Stack และ Program Counter ของตัวเอง

2. Overhead & Context Switching:
- การสลับ Thread (Thread Context Switch) ใช้พลังประมวลผลน้อยกว่าและเร็วกว่ามาก เพราะไม่ต้องสลับ Page Table ใน Memory Management Unit (MMU)""",
            "Process แยก Memory ชัดเจน ส่วน Thread แชร์พื้นที่ความจำร่วมกัน",
            "Hard",
        ),
    ]

    cursor.executemany(
        """
        INSERT INTO flashcards (category, question, answer, hint, difficulty, mastered, review_count)
        VALUES (?, ?, ?, ?, ?, 0, 0)
        """,
        sample_cards,
    )


def get_all_cards(
    category: Optional[str] = None,
    search: Optional[str] = None,
    mastered: Optional[int] = None,
) -> List[Dict[str, Any]]:
    """Retrieves cards with optional filtering."""
    init_db()
    with get_db_connection() as conn:
        query = "SELECT * FROM flashcards WHERE 1=1"
        params: List[Any] = []

        if category and category.lower() != "all":
            query += " AND category = ?"
            params.append(category)

        if search:
            query += " AND (question LIKE ? OR answer LIKE ? OR hint LIKE ?)"
            wildcard = f"%{search}%"
            params.extend([wildcard, wildcard, wildcard])

        if mastered is not None:
            query += " AND mastered = ?"
            params.append(mastered)

        query += " ORDER BY id DESC"
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]


def get_card_by_id(card_id: int) -> Optional[Dict[str, Any]]:
    """Fetches a single card by its ID."""
    init_db()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM flashcards WHERE id = ?", (card_id,))
        row = cursor.fetchone()
        return dict(row) if row else None


def add_card(
    category: str,
    question: str,
    answer: str,
    hint: str = "",
    difficulty: str = "Medium",
) -> int:
    """Inserts a new flashcard into the database."""
    init_db()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO flashcards (category, question, answer, hint, difficulty)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                category.strip() or "General",
                question.strip(),
                answer.strip(),
                hint.strip(),
                difficulty,
            ),
        )
        conn.commit()
        return cursor.lastrowid or 0


def update_card(
    card_id: int,
    category: str,
    question: str,
    answer: str,
    hint: str = "",
    difficulty: str = "Medium",
) -> bool:
    """Updates an existing flashcard."""
    init_db()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            UPDATE flashcards
            SET category = ?, question = ?, answer = ?, hint = ?, difficulty = ?
            WHERE id = ?
            """,
            (
                category.strip() or "General",
                question.strip(),
                answer.strip(),
                hint.strip(),
                difficulty,
                card_id,
            ),
        )
        conn.commit()
        return cursor.rowcount > 0


def delete_card(card_id: int) -> bool:
    """Deletes a flashcard by ID."""
    init_db()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM flashcards WHERE id = ?", (card_id,))
        conn.commit()
        return cursor.rowcount > 0


def toggle_mastered(card_id: int) -> Optional[Dict[str, Any]]:
    """Toggles the mastered status of a card."""
    init_db()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT mastered FROM flashcards WHERE id = ?", (card_id,))
        row = cursor.fetchone()
        if not row:
            return None
        new_status = 1 if row["mastered"] == 0 else 0
        cursor.execute(
            "UPDATE flashcards SET mastered = ? WHERE id = ?",
            (new_status, card_id),
        )
        conn.commit()
        return get_card_by_id(card_id)


def record_review(card_id: int, remembered: bool) -> Optional[Dict[str, Any]]:
    """Records a review session for spaced repetition feedback."""
    init_db()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT review_count, correct_count FROM flashcards WHERE id = ?", (card_id,))
        row = cursor.fetchone()
        if not row:
            return None
        rev_count = row["review_count"] + 1
        correct_count = row["correct_count"] + (1 if remembered else 0)
        # If remembered consecutively or correctly, mark mastered if correct_count >= 2
        mastered = 1 if remembered else 0

        cursor.execute(
            """
            UPDATE flashcards
            SET review_count = ?, correct_count = ?, mastered = ?
            WHERE id = ?
            """,
            (rev_count, correct_count, mastered, card_id),
        )
        conn.commit()
        return get_card_by_id(card_id)


def get_categories() -> List[str]:
    """Returns a list of distinct categories."""
    init_db()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT category FROM flashcards ORDER BY category ASC")
        rows = cursor.fetchall()
        return [row["category"] for row in rows]


def get_stats() -> Dict[str, Any]:
    """Calculates overall progress, mastery rate, and deck counts."""
    init_db()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) AS total FROM flashcards")
        total = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS mastered FROM flashcards WHERE mastered = 1")
        mastered = cursor.fetchone()["mastered"]

        cursor.execute("SELECT SUM(review_count) AS total_reviews FROM flashcards")
        reviews_row = cursor.fetchone()["total_reviews"]
        total_reviews = reviews_row if reviews_row is not None else 0

        percentage = round((mastered / total * 100), 1) if total > 0 else 0

        return {
            "total_cards": total,
            "mastered_cards": mastered,
            "learning_cards": total - mastered,
            "mastery_rate": percentage,
            "total_reviews": total_reviews,
        }

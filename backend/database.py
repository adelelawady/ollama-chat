import sqlite3
from typing import List, Dict
import json
from datetime import datetime

class Database:
    def __init__(self, db_path: str = "chat_history.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS chat_sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    model_name TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id INTEGER,
                    role TEXT NOT NULL,
                    content TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (session_id) REFERENCES chat_sessions (id)
                )
            """)
            conn.commit()

    def create_chat_session(self, model_name: str) -> int:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO chat_sessions (model_name) VALUES (?)",
                (model_name,)
            )
            conn.commit()
            return cursor.lastrowid

    def add_message(self, session_id: int, role: str, content: str):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)",
                (session_id, role, content)
            )
            conn.commit()

    def get_chat_history(self, session_id: int = None) -> List[Dict]:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            if session_id:
                cursor.execute("""
                    SELECT m.role, m.content, m.created_at, s.model_name
                    FROM messages m
                    JOIN chat_sessions s ON m.session_id = s.id
                    WHERE s.id = ?
                    ORDER BY m.created_at ASC
                """, (session_id,))
            else:
                cursor.execute("""
                    SELECT m.role, m.content, m.created_at, s.model_name
                    FROM messages m
                    JOIN chat_sessions s ON m.session_id = s.id
                    ORDER BY m.created_at DESC
                    LIMIT 100
                """)
            
            messages = []
            for row in cursor.fetchall():
                messages.append({
                    "role": row[0],
                    "content": row[1],
                    "created_at": row[2],
                    "model_name": row[3]
                })
            return messages

    def get_chat_sessions(self) -> List[Dict]:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, model_name, created_at
                FROM chat_sessions
                ORDER BY created_at DESC
            """)
            sessions = []
            for row in cursor.fetchall():
                sessions.append({
                    "id": row[0],
                    "model_name": row[1],
                    "created_at": row[2]
                })
            return sessions 
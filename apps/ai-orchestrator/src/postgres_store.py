"""
HoloKai AI Orchestrator - PostgreSQL (Supabase) Store

Handles persistent relational data (chat history, user contexts) via psycopg.
"""

import logging
import os
import psycopg
from psycopg.rows import dict_row
from typing import Any, Dict, List, Optional

logger = logging.getLogger("holokai.postgres_store")

DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("POSTGRES_DSN")

class PostgresStore:
    def __init__(self, dsn: Optional[str] = None):
        self.dsn = dsn or DATABASE_URL
        if not self.dsn:
            logger.warning("DATABASE_URL not set. PostgresStore will run in offline/mock mode.")

    def _connect(self):
        if not self.dsn:
            raise RuntimeError("Database connection string not configured.")
        return psycopg.connect(self.dsn, row_factory=dict_row)

    def health(self) -> Dict[str, Any]:
        if not self.dsn:
            return {"ok": False, "dsn_set": False}
            
        try:
            with self._connect() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT 1 AS ok")
                    one = cur.fetchone() or {}
            return {"ok": bool(one.get("ok") == 1), "dsn_set": True}
        except Exception as exc:
            logger.error(f"Postgres health check failed: {exc}")
            return {"ok": False, "dsn_set": True, "error": str(exc)}
            
    # Add other needed relational methods here (e.g. logging chat histories)
    def log_chat(self, session_id: str, role: str, content: str):
        if not self.dsn:
            return
            
        # Example implementation for chat logging
        try:
            with self._connect() as conn:
                with conn.cursor() as cur:
                    # Create table if not exists (simplified for local testing)
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS chat_history (
                            id SERIAL PRIMARY KEY,
                            session_id TEXT NOT NULL,
                            role TEXT NOT NULL,
                            content TEXT NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        )
                    """)
                    cur.execute("""
                        INSERT INTO chat_history (session_id, role, content)
                        VALUES (%s, %s, %s)
                    """, (session_id, role, content))
                conn.commit()
        except Exception as exc:
            logger.error(f"Failed to log chat: {exc}")

_store_singleton: Optional[PostgresStore] = None

def get_postgres_store() -> PostgresStore:
    global _store_singleton
    if _store_singleton is None:
        _store_singleton = PostgresStore()
    return _store_singleton

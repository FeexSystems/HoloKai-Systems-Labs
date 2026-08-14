"""
Conversation Memory Module for HoloKai Python Engine
Implements context aggregation across turns and conversation summarization
"""

import logging
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
from datetime import datetime
import json

logger = logging.getLogger("holokai.memory")


@dataclass
class ConversationTurn:
    """Represents a single turn in a conversation"""
    turn_id: str
    timestamp: datetime
    user_query: str
    agent_response: str
    active_agents: List[str]
    confidence: float
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ConversationSummary:
    """Represents a summarized state of a conversation"""
    session_id: str
    start_time: datetime
    last_activity: datetime
    total_turns: int
    key_topics: List[str]
    user_intent_summary: str
    context_fragments: List[str] = field(default_factory=list)
    sentiment_profile: Dict[str, float] = field(default_factory=dict)


class ConversationMemory:
    """
    Manages conversation context across multiple turns
    Provides memory aggregation, summarization, and context retrieval
    """
    
    def __init__(self, max_turns: int = 20, max_context_length: int = 5000):
        self.max_turns = max_turns
        self.max_context_length = max_context_length
        self.sessions: Dict[str, List[ConversationTurn]] = {}
        self.summaries: Dict[str, ConversationSummary] = {}
        
    def add_turn(
        self,
        session_id: str,
        user_query: str,
        agent_response: str,
        active_agents: List[str],
        confidence: float,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """Add a conversation turn to memory"""
        import uuid
        
        turn = ConversationTurn(
            turn_id=str(uuid.uuid4()),
            timestamp=datetime.now(),
            user_query=user_query,
            agent_response=agent_response,
            active_agents=active_agents,
            confidence=confidence,
            metadata=metadata or {}
        )
        
        if session_id not in self.sessions:
            self.sessions[session_id] = []
            self.summaries[session_id] = ConversationSummary(
                session_id=session_id,
                start_time=datetime.now(),
                last_activity=datetime.now(),
                total_turns=0,
                key_topics=[],
                user_intent_summary=""
            )
        
        # Maintain max turns - remove oldest if exceeded
        self.sessions[session_id].append(turn)
        if len(self.sessions[session_id]) > self.max_turns:
            self.sessions[session_id].pop(0)
        
        # Update summary
        self._update_summary(session_id, turn)
        
        logger.info(f"Added turn to session {session_id}: {len(self.sessions[session_id])} total turns")
    
    def _update_summary(self, session_id: str, turn: ConversationTurn) -> None:
        """Update conversation summary based on new turn"""
        summary = self.summaries[session_id]
        summary.last_activity = datetime.now()
        summary.total_turns += 1
        
        # Extract key topics from query and response
        topics = self._extract_topics(turn.user_query + " " + turn.agent_response)
        for topic in topics:
            if topic not in summary.key_topics:
                summary.key_topics.append(topic)
        
        # Update intent summary periodically
        if summary.total_turns % 3 == 0:
            summary.user_intent_summary = self._generate_intent_summary(session_id)
        
        # Update sentiment profile
        sentiment = self._analyze_sentiment(turn.user_query)
        for emotion, score in sentiment.items():
            summary.sentiment_profile[emotion] = summary.sentiment_profile.get(emotion, 0) + score
            # Normalize by total turns
            summary.sentiment_profile[emotion] = summary.sentiment_profile[emotion] / summary.total_turns
    
    def get_context(self, session_id: str, max_context_length: Optional[int] = None) -> str:
        """Retrieve formatted context for a session"""
        if session_id not in self.sessions:
            return ""
        
        max_len = max_context_length or self.max_context_length
        turns = self.sessions[session_id]
        
        # Build context from recent turns
        context_parts = []
        current_length = 0
        
        for turn in reversed(turns):
            turn_text = f"User: {turn.user_query}\nAssistant: {turn.agent_response}\n"
            if current_length + len(turn_text) > max_len:
                break
            context_parts.insert(0, turn_text)
            current_length += len(turn_text)
        
        return "\n".join(context_parts)
    
    def get_summary(self, session_id: str) -> Optional[ConversationSummary]:
        """Get conversation summary for a session"""
        return self.summaries.get(session_id)
    
    def extract_entities(self, session_id: str) -> List[str]:
        """Extract entities mentioned in conversation"""
        if session_id not in self.sessions:
            return []
        
        entities = set()
        entity_keywords = [
            "mansa musa", "mali", "sungbo", "eredo", "ijebu", "timbuktu",
            "kemet", "egypt", "nubia", "kush", "aksum", "ethiopia",
            "songhai", "zimbabwe", "benin", "yoruba", "swahili", "nok"
        ]
        
        for turn in self.sessions[session_id]:
            text = (turn.user_query + " " + turn.agent_response).lower()
            for entity in entity_keywords:
                if entity in text:
                    entities.add(entity)
        
        return list(entities)
    
    def _extract_topics(self, text: str) -> List[str]:
        """Extract key topics from text"""
        # Simple keyword-based topic extraction
        topics = []
        topic_keywords = {
            "politics": ["empire", "kingdom", "ruler", "government", "power"],
            "economy": ["trade", "wealth", "gold", "currency", "commerce"],
            "culture": ["art", "music", "religion", "tradition", "language"],
            "architecture": ["building", "monument", "structure", "design", "construction"],
            "geography": ["location", "region", "landscape", "river", "mountain"]
        }
        
        text_lower = text.lower()
        for topic, keywords in topic_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                if topic not in topics:
                    topics.append(topic)
        
        return topics
    
    def _generate_intent_summary(self, session_id: str) -> str:
        """Generate a summary of user's intent across conversation"""
        if session_id not in self.sessions:
            return ""
        
        queries = [turn.user_query for turn in self.sessions[session_id]]
        if not queries:
            return ""
        
        # Simple intent classification
        intent_counts = {
            "learning": 0,
            "comparison": 0,
            "exploration": 0,
            "verification": 0
        }
        
        intent_keywords = {
            "learning": ["tell me", "explain", "what is", "how", "describe"],
            "comparison": ["compare", "difference", "versus", "better", "worse"],
            "exploration": ["explore", "discover", "find", "search", "look for"],
            "verification": ["is it true", "verify", "confirm", "prove", "evidence"]
        }
        
        for query in queries:
            query_lower = query.lower()
            for intent, keywords in intent_keywords.items():
                if any(keyword in query_lower for keyword in keywords):
                    intent_counts[intent] += 1
        
        # Determine dominant intent
        dominant_intent = max(intent_counts, key=intent_counts.get)
        if intent_counts[dominant_intent] == 0:
            return "General inquiry"
        
        return f"User primarily interested in {dominant_intent}"
    
    def _analyze_sentiment(self, text: str) -> Dict[str, float]:
        """Analyze sentiment of text"""
        sentiment = {
            "positive": 0.0,
            "negative": 0.0,
            "neutral": 0.0,
            "curiosity": 0.0
        }
        
        positive_words = ["good", "great", "excellent", "amazing", "wonderful", "thank"]
        negative_words = ["bad", "terrible", "awful", "wrong", "error", "fail"]
        question_words = ["what", "how", "why", "when", "where", "who", "which"]
        
        text_lower = text.lower()
        words = text_lower.split()
        
        for word in words:
            if word in positive_words:
                sentiment["positive"] += 1
            elif word in negative_words:
                sentiment["negative"] += 1
            elif word in question_words:
                sentiment["curiosity"] += 1
        
        # Normalize
        total = sum(sentiment.values()) or 1
        for key in sentiment:
            sentiment[key] /= total
        
        return sentiment
    
    def clear_session(self, session_id: str) -> None:
        """Clear conversation memory for a session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
        if session_id in self.summaries:
            del self.summaries[session_id]
        
        logger.info(f"Cleared conversation memory for session {session_id}")
    
    def get_session_stats(self, session_id: str) -> Dict[str, Any]:
        """Get statistics for a session"""
        if session_id not in self.sessions:
            return {}
        
        turns = self.sessions[session_id]
        summary = self.summaries.get(session_id)
        
        return {
            "total_turns": len(turns),
            "duration_minutes": (datetime.now() - summary.start_time).total_seconds() / 60 if summary else 0,
            "key_topics": summary.key_topics if summary else [],
            "active_agents": list(set(agent for turn in turns for agent in turn.active_agents)),
            "average_confidence": sum(turn.confidence for turn in turns) / len(turns) if turns else 0
        }


# Global conversation memory instance
_conversation_memory: Optional[ConversationMemory] = None


def get_conversation_memory() -> ConversationMemory:
    """Get or create global conversation memory instance"""
    global _conversation_memory
    if _conversation_memory is None:
        _conversation_memory = ConversationMemory()
    return _conversation_memory


def reset_conversation_memory() -> None:
    """Reset global conversation memory instance"""
    global _conversation_memory
    _conversation_memory = None

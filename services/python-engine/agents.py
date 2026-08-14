"""
Wave 6: Intelligent Agent Classes for HoloKai
Implements specialized agents for knowledge, voice, vision, and archive management
"""

import logging
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import re

logger = logging.getLogger("holokai.agents")


@dataclass
class AgentResponse:
    """Standard response structure for all agents"""
    content: str
    confidence: float
    metadata: Dict[str, Any]
    agent_type: str
    requires_followup: bool = False
    suggested_followup: Optional[str] = None


class BaseHoloKaiAgent(ABC):
    """Base class for all HoloKai intelligent agents"""
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.confidence_threshold = 0.7
    
    @abstractmethod
    async def process(self, query: str, context: Optional[Dict[str, Any]] = None) -> AgentResponse:
        """Process a query and return an agent response"""
        pass
    
    def detect_greeting(self, query: str) -> bool:
        """Detect if query is a greeting"""
        greetings = ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"]
        query_lower = query.lower().strip()
        return any(greeting in query_lower for greeting in greetings)
    
    def detect_pleasantry(self, query: str) -> bool:
        """Detect if query contains pleasantries"""
        pleasantries = ["thank", "thanks", "please", "appreciate", "grateful"]
        query_lower = query.lower()
        return any(pleasantry in query_lower for pleasantry in pleasantries)
    
    def extract_entities(self, query: str) -> List[str]:
        """Extract named entities from query"""
        entities = []
        
        # Historical figures
        historical_figures = [
            "mansa musa", "sundiata keita", "askia muhammad", "sonni ali",
            "ramesses ii", "cleopatra", "hatshepsut", "akhenaten", "tutankhamun"
        ]
        
        # Civilizations and kingdoms
        civilizations = [
            "mali empire", "songhai empire", "ghana empire", "benin empire",
            "kingdom of kush", "aksum", "great zimbabwe", "kingdom of kongo"
        ]
        
        # Locations
        locations = [
            "timbuktu", "gao", "djenné", "sokoto", "kano", "ife", "benin city",
            "memphis", "thebes", "luxor", "alexandria", "carthage"
        ]
        
        query_lower = query.lower()
        
        for entity_list in [historical_figures, civilizations, locations]:
            for entity in entity_list:
                if entity in query_lower:
                    entities.append(entity)
        
        return entities
    
    def classify_intent(self, query: str) -> str:
        """Classify the user's intent"""
        query_lower = query.lower()
        
        intent_patterns = {
            "learning": ["tell me", "explain", "what is", "how did", "describe", "history of"],
            "comparison": ["compare", "difference", "versus", "better than", "worse than", "similar"],
            "exploration": ["explore", "discover", "find", "search", "look for", "information about"],
            "verification": ["is it true", "verify", "confirm", "prove", "evidence for", "accurate"],
            "analysis": ["analyze", "examine", "study", "investigate", "assess"]
        }
        
        for intent, patterns in intent_patterns.items():
            if any(pattern in query_lower for pattern in patterns):
                return intent
        
        return "general"
    
    def format_naturally(self, content: str, confidence: float) -> str:
        """Format response naturally based on confidence level"""
        if confidence >= 0.9:
            return content
        elif confidence >= 0.7:
            return f"Based on available evidence, {content.lower()}"
        else:
            return f"While there's limited information, it appears that {content.lower()}. Further research would be beneficial."


class KnowledgeAgent(BaseHoloKaiAgent):
    """Agent specialized in answering questions about history and HoloKai"""
    
    def __init__(self):
        super().__init__(
            "Knowledge Agent",
            "Specializes in historical knowledge, African civilizations, and HoloKai platform information"
        )
    
    async def process(self, query: str, context: Optional[Dict[str, Any]] = None) -> AgentResponse:
        if self.detect_greeting(query):
            return AgentResponse(
                content="Welcome! I'm here to help you explore African civilizations and HoloKai's capabilities. What would you like to learn about today?",
                confidence=0.95,
                metadata={"intent": "greeting"},
                agent_type="knowledge",
                requires_followup=True
            )
        
        if self.detect_pleasantry(query):
            return AgentResponse(
                content="You're welcome! I'm glad I could help. Is there anything else you'd like to know about?",
                confidence=0.95,
                metadata={"intent": "pleasantry"},
                agent_type="knowledge",
                requires_followup=True
            )
        
        # Extract entities and classify intent
        entities = self.extract_entities(query)
        intent = self.classify_intent(query)
        
        # Generate knowledge response based on intent and entities
        if entities:
            content = f"I found information about {', '.join(entities)}. "
        else:
            content = "I can help you explore various aspects of African civilizations. "
        
        if intent == "learning":
            content += "I'd be happy to explain this topic in detail."
        elif intent == "comparison":
            content += "I can help you compare different aspects of these civilizations."
        elif intent == "exploration":
            content += "Let's explore this fascinating topic together."
        else:
            content += "How can I assist you with this inquiry?"
        
        # Determine confidence based on entity matches
        confidence = 0.85 if entities else 0.65
        
        return AgentResponse(
            content=self.format_naturally(content, confidence),
            confidence=confidence,
            metadata={"entities": entities, "intent": intent},
            agent_type="knowledge",
            requires_followup=True,
            suggested_followup="Would you like me to elaborate on any specific aspect?"
        )


class VoiceAgent(BaseHoloKaiAgent):
    """Agent managing text-to-speech and voice selection"""
    
    def __init__(self):
        super().__init__(
            "Voice Agent",
            "Manages voice synthesis, voice selection, and audio output for HoloKai"
        )
    
    async def process(self, query: str, context: Optional[Dict[str, Any]] = None) -> AgentResponse:
        query_lower = query.lower()
        
        # Detect voice-related requests
        if any(keyword in query_lower for keyword in ["voice", "speak", "audio", "sound", "pronounce"]):
            if "ancient" in query_lower or "historical" in query_lower:
                return AgentResponse(
                    content="I can help you select from our ancient voice personas, including Egyptian Scholar, Roman Historian, Greek Philosopher, African Griot, and Medieval Scribe. Each voice is designed to bring historical narratives to life.",
                    confidence=0.92,
                    metadata={"voice_presets": ["egyptian-scholar", "roman-historian", "greek-philosopher", "african-griot", "medieval-scribe"]},
                    agent_type="voice",
                    requires_followup=True,
                    suggested_followup="Which voice persona would you like to use for your content?"
                )
            else:
                return AgentResponse(
                    content="I can convert text to speech using various voice options. Would you like me to synthesize a specific text or help you choose a voice?",
                    confidence=0.88,
                    metadata={"capabilities": ["text-to-speech", "voice-selection"]},
                    agent_type="voice",
                    requires_followup=True
                )
        
        return AgentResponse(
            content="I'm the Voice Agent, specialized in audio synthesis. How can I help you with voice-related tasks?",
            confidence=0.75,
            metadata={},
            agent_type="voice",
            requires_followup=True
        )


class VisionAgent(BaseHoloKaiAgent):
    """Agent for artifact/content generation and visual content"""
    
    def __init__(self):
        super().__init__(
            "Vision Agent",
            "Specializes in generating visual content, artifacts, and multimedia for HoloKai"
        )
    
    async def process(self, query: str, context: Optional[Dict[str, Any]] = None) -> AgentResponse:
        query_lower = query.lower()
        
        # Detect vision-related requests
        if any(keyword in query_lower for keyword in ["image", "visual", "artifact", "generate", "create", "design"]):
            if "map" in query_lower:
                return AgentResponse(
                    content="I can help generate historical maps showing trade routes, kingdom boundaries, and archaeological sites. Would you like a map of a specific region or time period?",
                    confidence=0.87,
                    metadata={"capabilities": ["map-generation", "historical-visualization"]},
                    agent_type="vision",
                    requires_followup=True,
                    suggested_followup="Which region or civilization would you like to visualize?"
                )
            elif "artifact" in query_lower:
                return AgentResponse(
                    content="I can help visualize historical artifacts including pottery, tools, jewelry, and architectural elements. What type of artifact interests you?",
                    confidence=0.85,
                    metadata={"capabilities": ["artifact-visualization", "3d-modeling"]},
                    agent_type="vision",
                    requires_followup=True
                )
            else:
                return AgentResponse(
                    content="I can generate various visual content including maps, artifacts, and historical visualizations. What type of content would you like me to create?",
                    confidence=0.82,
                    metadata={"capabilities": ["image-generation", "visualization"]},
                    agent_type="vision",
                    requires_followup=True
                )
        
        return AgentResponse(
            content="I'm the Vision Agent, specialized in visual content generation. How can I help you create visual content?",
            confidence=0.75,
            metadata={},
            agent_type="vision",
            requires_followup=True
        )


class ArchiveAgent(BaseHoloKaiAgent):
    """Agent for document search and management"""
    
    def __init__(self):
        super().__init__(
            "Archive Agent",
            "Specializes in document search, management, and archival operations for HoloKai"
        )
    
    async def process(self, query: str, context: Optional[Dict[str, Any]] = None) -> AgentResponse:
        query_lower = query.lower()
        
        # Detect archive-related requests
        if any(keyword in query_lower for keyword in ["document", "archive", "search", "find", "retrieve", "paper"]):
            if "search" in query_lower:
                return AgentResponse(
                    content="I can search through our document archive using semantic search, keyword matching, or metadata filters. What would you like to find?",
                    confidence=0.90,
                    metadata={"capabilities": ["semantic-search", "keyword-search", "metadata-filter"]},
                    agent_type="archive",
                    requires_followup=True,
                    suggested_followup="Please provide your search terms or specific criteria."
                )
            elif "upload" in query_lower:
                return AgentResponse(
                    content="I can help you upload documents to the archive. I support various formats including PDF, text files, and images. What would you like to upload?",
                    confidence=0.88,
                    metadata={"capabilities": ["document-upload", "format-support"]},
                    agent_type="archive",
                    requires_followup=True
                )
            else:
                return AgentResponse(
                    content="I can help you manage documents in our archive, including searching, uploading, and organizing content. How can I assist with your archival needs?",
                    confidence=0.85,
                    metadata={"capabilities": ["document-management", "search", "organization"]},
                    agent_type="archive",
                    requires_followup=True
                )
        
        return AgentResponse(
            content="I'm the Archive Agent, specialized in document management and search. How can I help you with archival operations?",
            confidence=0.75,
            metadata={},
            agent_type="archive",
            requires_followup=True
        )


class AgentRouter:
    """Routes queries to appropriate agents based on query analysis"""
    
    def __init__(self):
        self.agents = {
            "knowledge": KnowledgeAgent(),
            "voice": VoiceAgent(),
            "vision": VisionAgent(),
            "archive": ArchiveAgent()
        }
        self.fallback_agent = KnowledgeAgent()  # Default fallback
    
    async def route(self, query: str, context: Optional[Dict[str, Any]] = None) -> AgentResponse:
        """Route query to appropriate agent"""
        query_lower = query.lower()
        
        # Simple routing logic based on keywords
        agent_routing = {
            "knowledge": ["history", "civilization", "kingdom", "empire", "ancient", "historical", "learn", "explain", "tell me"],
            "voice": ["voice", "speak", "audio", "sound", "pronounce", "text-to-speech"],
            "vision": ["image", "visual", "artifact", "generate", "create", "design", "map", "visualization"],
            "archive": ["document", "archive", "search", "find", "retrieve", "paper", "upload"]
        }
        
        # Score each agent based on keyword matches
        agent_scores = {}
        for agent_type, keywords in agent_routing.items():
            score = sum(1 for keyword in keywords if keyword in query_lower)
            if score > 0:
                agent_scores[agent_type] = score
        
        # Select highest-scoring agent
        if agent_scores:
            best_agent = max(agent_scores, key=agent_scores.get)
            logger.info(f"Routed query to {best_agent} agent (score: {agent_scores[best_agent]})")
            return await self.agents[best_agent].process(query, context)
        
        # Default to knowledge agent for general queries
        logger.info("No specific agent matched, routing to knowledge agent")
        return await self.fallback_agent.process(query, context)
    
    async def route_with_fallback(self, query: str, context: Optional[Dict[str, Any]] = None) -> AgentResponse:
        """Route with fallback logic if primary agent fails"""
        try:
            return await self.route(query, context)
        except Exception as e:
            logger.error(f"Agent routing failed: {e}, using fallback")
            return await self.fallback_agent.process(query, context)


# Global agent router instance
_agent_router: Optional[AgentRouter] = None


def get_agent_router() -> AgentRouter:
    """Get or create global agent router instance"""
    global _agent_router
    if _agent_router is None:
        _agent_router = AgentRouter()
    return _agent_router


def reset_agent_router() -> None:
    """Reset global agent router instance"""
    global _agent_router
    _agent_router = None

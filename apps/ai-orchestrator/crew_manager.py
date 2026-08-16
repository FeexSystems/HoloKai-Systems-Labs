import os
import logging
import re
from src.vector_store import VectorStore
from src.postgres_store import get_postgres_store

try:
    from crewai import Agent, Task, Crew, Process
    from langchain_google_genai import ChatGoogleGenerativeAI
    CREWAI_AVAILABLE = True
except ImportError:
    CREWAI_AVAILABLE = False

logger = logging.getLogger("holokai.crew_manager")

vector_store = VectorStore()
postgres_store = get_postgres_store()

from src.model_gateway import gateway

# Load default LLM from gateway
if CREWAI_AVAILABLE and os.getenv("GEMINI_API_KEY"):
    default_llm = gateway.get_model(temperature=0.7)
else:
    default_llm = None

def load_agent_from_md(plugin: str, agent_name: str) -> 'Agent':
    if not CREWAI_AVAILABLE:
        return None
        
    path = os.path.join(os.getcwd(), "..", "..", ".agents", "plugins", plugin, "agents", f"{agent_name}.md")
    
    role = agent_name.replace("-", " ").title()
    goal = f"Provide expert {role} guidance and implementation."
    backstory = "You are an expert AI agent in the HoloKai collective."
    
    try:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                
            # Naive extraction of identity
            match = re.search(r'<identity>(.*?)</identity>', content, re.DOTALL)
            if match:
                backstory = match.group(1).strip()
    except Exception as e:
        logger.warning(f"Could not parse agent {agent_name}: {e}")
        
    return Agent(
        role=role,
        goal=goal,
        backstory=backstory,
        verbose=True,
        allow_delegation=False,
        llm=default_llm
    )

async def run_agentic_workflow(message: str, context: dict):
    session_id = context.get("session_id", "default_session")
    department = context.get("department", "engineering")
    
    postgres_store.log_chat(session_id, "user", message)
    
    # RAG Retrieval
    try:
        rag_results = vector_store.retrieve(message)
        rag_context = "\n".join([r["text"] for r in rag_results]) if rag_results else "No relevant knowledge found."
    except Exception as exc:
        logger.error(f"Failed to query Pinecone: {exc}")
        rag_context = "Error querying knowledge base."

    # Determine default agent based on department
    if department == "engineering":
        agent_name = "frontend-developer"
    elif department == "product":
        agent_name = "sprint-prioritizer"
    elif department == "marketing":
        agent_name = "content-creator"
    else:
        agent_name = "ai-engineer"
        department = "engineering"

    if CREWAI_AVAILABLE and default_llm:
        try:
            agent = load_agent_from_md(department, agent_name)
            
            task = Task(
                description=f"User request: {message}\n\nRelevant context from Pinecone RAG:\n{rag_context}\n\nAnalyze the request and provide a comprehensive, expert response.",
                expected_output="A clear, professional markdown-formatted response addressing the user's request.",
                agent=agent
            )
            
            crew = Crew(
                agents=[agent],
                tasks=[task],
                process=Process.sequential
            )
            
            # CrewAI execution is synchronous, we run it in a thread if this is async, but for now blocking is fine for testing
            result = crew.kickoff()
            response_text = str(result)
        except Exception as e:
            logger.error(f"CrewAI execution failed: {e}")
            response_text = f"Agent execution failed: {str(e)}"
    else:
        # Fallback if CrewAI isn't installed
        response_text = f"[Fallback Agent: {agent_name}]\n\nCrewAI not loaded. Received: {message}\nContext: {rag_context}"

    postgres_store.log_chat(session_id, "agent", response_text)
    return response_text, f"{department}/{agent_name}"

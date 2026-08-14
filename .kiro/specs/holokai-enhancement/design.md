# HoloKai Platform Enhancement — Design Document

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐          │
│  │ Shell (App) │  │ Web-Home     │  │ Web-Oracle     │          │
│  │ SSR + MFE   │  │ (Products)   │  │ (Query)        │          │
│  └─────────────┘  └──────────────┘  └────────────────┘          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐          │
│  │ Web-Cart     │  │ Web-Research │  │ Web-Archive    │          │
│  │ (Checkout)   │  │ (Knowledge)  │  │ (Documents)    │          │
│  └──────────────┘  └──────────────┘  └────────────────┘          │
│                                                                   │
│  UI Layer:                                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ @holokai/ui (Components, Cards, Visualizations)           │ │
│  │ @holokai/design-tokens (Semantic colors: Obsidian/etc)    │ │
│  │ @holokai/design-system (Motion choreography, patterns)    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  3D & Animation Layer:                                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ React Three Fiber (3D components)                         │ │
│  │ Framer Motion (Staggered reveals, transitions)            │ │
│  │ Canvas (Particle systems, backgrounds)                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Network Layer (gRPC/HTTP)                    │
├─────────────────────────────────────────────────────────────────┤
│                  BFF (Backend for Frontend)                     │
│              (apps/bff/src/routes/*.ts)                         │
│  - /api/oracle/query (Gemini queries)                          │
│  - /api/voice/synthesize (ElevenLabs TTS)                      │
│  - /api/voice/transcribe (Deepgram STT)                        │
│  - /api/products (Product catalog)                             │
│  - /api/archive (Document management)                          │
│  - /api/agents/* (Agent routing)                               │
│  - /api/health (Health checks)                                 │
│                                                                   │
│  Features:                                                        │
│  ✓ Rate limiting (10 req/min per user)                         │
│  ✓ Streaming responses                                          │
│  ✓ Error handling with fallbacks                               │
│  ✓ Request validation (Zod schemas)                            │
│  ✓ Structured logging (Pino)                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Backend Services Layer                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Python Engine (services/python-engine/)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ LLM Orchestration Layer                                 │  │
│  │ - Multi-step reasoning workflows                        │  │
│  │ - Context aggregation                                   │  │
│  │ - Semantic understanding                                │  │
│  │ - Prompt engineering                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Knowledge Base Layer                                    │  │
│  │ - Ancient history facts                                 │  │
│  │ - HoloKai features and use cases                         │  │
│  │ - Research articles and case studies                    │  │
│  │ - Vector embeddings for semantic search                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Memory & Context Layer                                  │  │
│  │ - Conversation history                                  │  │
│  │ - User preferences                                      │  │
│  │ - Context aggregation across turns                      │  │
│  │ - Relevance scoring                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ RAG Pipeline (Retrieval-Augmented Generation)           │  │
│  │ - Document indexing                                     │  │
│  │ - Semantic search                                       │  │
│  │ - Result ranking and filtering                          │  │
│  │ - Citation generation                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    External AI APIs                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐        │
│  │ Gemini API   │  │ ElevenLabs   │  │ Deepgram API   │        │
│  │              │  │              │  │                │        │
│  │ • Reasoning  │  │ • TTS        │  │ • STT          │        │
│  │ • Generation │  │ • Voice      │  │ • Language ID  │        │
│  │ • Analysis   │  │   selection  │  │ • Real-time    │        │
│  └──────────────┘  └──────────────┘  └────────────────┘        │
│                                                                   │
│  Config: Environment variables                                   │
│  GEMINI_API_KEY                                                  │
│  ELEVENLABS_API_KEY                                              │
│  DEEPGRAM_API_KEY                                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Data & Storage Layer                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  PostgreSQL (app data, users, documents)                        │
│  - Schema: users, products, subscriptions                       │
│  - Schema: documents, versions                                  │
│  - Schema: conversation_history                                 │
│                                                                   │
│  Vector Store (embeddings, semantic search)                     │
│  - Document embeddings                                          │
│  - Cached Gemini responses                                      │
│  - Conversation summaries                                       │
│                                                                   │
│  Cache Layer (Redis)                                            │
│  - Frequently accessed products                                 │
│  - User preferences                                             │
│  - API rate limit counters                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

#### 1. Shell App (`apps/shell`)
- **FullPageScrollWrapper**: Refined scroll orchestration with motion library
- **HeroSection**: CivilizationGlobe + semantic color gradients
- **NavigationHeader**: HoloKai branding, navigation, user menu
- **FooterComponent**: Links, branding, legal
- **3D Components**:
  - CivilizationGlobe (already built in cinematic-upgrade)
  - KnowledgeParticleField (background particles)
  - Interactive artifact viewers

#### 2. Web-Home App (`apps/web-home`)
- **ProductShowcase**: 3D product cards with hover effects
- **PricingTiers**: Free/Pro/Enterprise comparison
- **ValuePropositions**: Hero copy, benefits sections
- **CTAButtons**: Clear calls-to-action
- **Testimonials**: Real user feedback

#### 3. Web-Oracle App (`apps/web-oracle`)
- **QueryInput**: Text input + voice transcription (Deepgram)
- **ResponseStreamer**: Real-time response display
- **VoiceOutputWidget**: ElevenLabs playback with voice selection
- **ConversationHistory**: Scrollable chat-like interface
- **AgentIndicator**: Shows which agent is responding

#### 4. Web-Cart App (`apps/web-cart`)
- **ProductSummary**: Selected items with prices
- **TierSelector**: Radio buttons for subscription tiers
- **CheckoutForm**: Email, payment (mock)
- **SuccessScreen**: Confirmation + onboarding

#### 5. Web-Research App (`apps/web-research`)
- **ArticleIndex**: Searchable list of research
- **ArticleDetail**: Full article with metadata
- **CaseStudies**: Real HoloKai use cases
- **DocumentUpload**: Drag-and-drop for research files
- **SearchInterface**: Semantic search across content

#### 6. Web-Archive App (`apps/web-archive`)
- **DocumentManager**: Upload, organize, delete documents
- **VersionHistory**: Browse and restore document versions
- **MetadataTagger**: Add tags, descriptions
- **AccessControl**: View tier-based access levels

### Backend Services

#### 1. BFF (Backend for Frontend)
Location: `apps/bff/src/routes/`

**Key Endpoints**:

```typescript
// Oracle queries
POST /api/oracle/query
  body: { prompt: string, voice?: boolean }
  response: { response: string, citations?: string[] }
  (streaming: text/event-stream)

POST /api/oracle/speak
  body: { text: string, voiceId: string, language: string }
  response: { audioUrl: string, duration: number }
  (rate limited: 10/min)

// Voice services
POST /api/voice/synthesize
  body: { text: string, voiceId: string, engine: 'elevenlabs'|'deepgram' }
  response: { audioBuffer, metadata }

POST /api/voice/transcribe
  body: { audio: Blob, language?: string }
  response: { text: string, confidence: number }
  (streaming: real-time results)

// Products & Pricing
GET /api/products
  response: { products: Product[] }

GET /api/products/:id
  response: Product

POST /api/subscriptions
  body: { userId: string, tier: 'free'|'pro'|'enterprise' }
  response: { subscription: Subscription, status: string }

// Documents
GET /api/archive/documents
  response: { documents: Document[] }

POST /api/archive/upload
  body: FormData (multipart)
  response: { documentId: string, url: string }

GET /api/archive/:documentId/versions
  response: { versions: Version[] }

// Health & Monitoring
GET /api/health
  response: { status: 'ok'|'degraded', services: Record<string, 'ok'|'error'> }
```

#### 2. Python Engine (`services/python-engine/`)

**Core Modules**:

- `holokai_backend.py`: Main orchestrator
- `knowledge_base_comprehensive.py`: Fact repository
- `model_gateway.py`: Gemini client wrapper
- `rag_full.py`: RAG pipeline
- `memory_consolidator.py`: Conversation context

**Key Classes**:

```python
class HoloKaiOrchestrator:
    """Main coordinator for multi-step reasoning"""
    def query(prompt: str, context: dict) -> str
    def extract_entities(text: str) -> list[Entity]
    def rank_results(results: list[Result], query: str) -> list[Result]

class KnowledgeBase:
    """Repository of HoloKai facts and research"""
    def search(query: str, limit: int = 5) -> list[Fact]
    def get_by_topic(topic: str) -> list[Fact]

class RagPipeline:
    """Retrieval-Augmented Generation"""
    def retrieve(query: str, k: int = 5) -> list[Document]
    def generate_response(query: str, retrieved_docs: list) -> str

class ConversationMemory:
    """Maintains conversation context"""
    def add_turn(role: str, text: str) -> None
    def get_context(window: int = 5) -> list[Turn]
    def summarize() -> str
```

### AI Agents Architecture

```typescript
// Base agent interface
interface HoloKaiAgent {
  name: string
  capabilities: string[]
  systemPrompt: string
  handleQuery(query: string, context: ConversationContext): Promise<string>
  canHandle(query: string): boolean
}

// Knowledge Agent: Answers questions about history, HoloKai, research
class KnowledgeAgent implements HoloKaiAgent {
  systemPrompt = "You are a knowledgeable assistant about ancient history and HoloKai..."
  async handleQuery(query, context) {
    // 1. Extract entities (ancient civilization, time period, etc.)
    // 2. Search knowledge base
    // 3. Use Gemini for synthesis and reasoning
    // 4. Generate response with citations
  }
}

// Voice Agent: Manages text-to-speech
class VoiceAgent implements HoloKaiAgent {
  async handleQuery(query, context) {
    // Parse query for voice synthesis request
    // Call ElevenLabs API
    // Return audio URL + metadata
  }
}

// Vision Agent: Generates and analyzes images
class VisionAgent implements HoloKaiAgent {
  async handleQuery(query, context) {
    // Use Gemini for image generation prompt engineering
    // Call image generation API
    // Return artifact + metadata
  }
}

// Archive Agent: Manages documents
class ArchiveAgent implements HoloKaiAgent {
  async handleQuery(query, context) {
    // Search documents by metadata + semantic similarity
    // Return document info + access control
  }
}

// Agent Router: Routes queries to appropriate agent
class AgentRouter {
  async route(query: string, context: ConversationContext): Promise<{
    agent: HoloKaiAgent
    response: string
  }> {
    // 1. Classify query intent
    // 2. Select best agent
    // 3. Execute agent
    // 4. Cache result
  }
}
```

## Data Models

### Product Model
```typescript
interface Product {
  id: string
  name: string  // e.g., "HoloKai Research Tier"
  description: string
  tier: 'free' | 'pro' | 'enterprise'
  price: number  // Monthly price in USD
  features: string[]
  limits: {
    queriesPerDay: number
    documentsPerUser: number
    voiceSynthesisMinutes: number
  }
  useCases: string[]
}
```

### Document Model
```typescript
interface Document {
  id: string
  userId: string
  title: string
  content: string
  mimeType: string
  uploadedAt: Date
  versions: Version[]
  metadata: {
    tags: string[]
    topic: string
    summary: string
  }
  accessLevel: 'free' | 'pro' | 'enterprise'
}
```

### Conversation Turn Model
```typescript
interface ConversationTurn {
  id: string
  userId: string
  role: 'user' | 'assistant'
  content: string
  agent: string  // Which agent responded
  citations?: string[]
  metadata: {
    intent: string
    entities: Entity[]
    timestamp: Date
  }
}
```

## Integration Flows

### Flow 1: User Asks Oracle a Question

```
User: "Tell me about ancient Egyptian hieroglyphics"
  ↓
[Client] Send query via /api/oracle/query
  ↓
[BFF] Validate request, apply rate limiting
  ↓
[Agent Router] Classify intent → Knowledge Agent
  ↓
[Knowledge Agent] 
  1. Extract entity: "ancient Egyptian hieroglyphics"
  2. Search knowledge base
  3. Call Python engine for synthesis
  4. Use Gemini for enriched response
  ↓
[Gemini API] Generate comprehensive response
  ↓
[BFF] Stream response back to client (text/event-stream)
  ↓
[Client] Display streaming response + VoiceAgent button
  ↓
User clicks "Read Aloud"
  ↓
[Client] Send text to /api/voice/synthesize
  ↓
[ElevenLabs] Generate audio
  ↓
[Client] Play audio stream
```

### Flow 2: User Uploads Research Document

```
User: Drag PDF to web-archive
  ↓
[Client] POST /api/archive/upload with FormData
  ↓
[BFF] Validate file, check quota
  ↓
[Storage] Save file + generate preview
  ↓
[Python Engine] Extract text, generate embeddings
  ↓
[Vector Store] Index embeddings for semantic search
  ↓
[BFF] Return document URL + metadata
  ↓
[Client] Display document in archive
  ↓
User can now search across this document
```

### Flow 3: Agent Multi-Turn Conversation

```
Turn 1: User: "What was the Library of Alexandria?"
  ↓ [Knowledge Agent provides answer]

Turn 2: User: "Create a narrative about it"
  ↓ [Vision Agent processes request]
  ↓ [Gemini generates narrative]
  ↓ [Agent recalls Turn 1 context for coherence]

Turn 3: User: "Read that to me"
  ↓ [Voice Agent takes Turn 2 narrative]
  ↓ [ElevenLabs generates speech]
  ↓ [Client plays audio]

Memory consolidation: Turn 1-3 summarized for future context
```

## Streaming Architecture

### Server-Sent Events (SSE) for Oracle Responses

```typescript
// Client
const response = await fetch('/api/oracle/query', {
  method: 'POST',
  body: JSON.stringify({ prompt: "..." })
})
const reader = response.body.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  
  const text = decoder.decode(value)
  // Parse SSE format
  // Update UI with streaming chunks
}

// Server
const encoder = new TextEncoder()
const stream = new ReadableStream({
  async start(controller) {
    const response = await geminiStreamingRequest(prompt)
    for await (const chunk of response) {
      controller.enqueue(encoder.encode(`data: ${chunk}\n\n`))
    }
    controller.close()
  }
})
```

### WebSocket for Real-Time Agent Interactions

```typescript
// Optional: Real-time updates, notifications
const ws = new WebSocket('wss://holokai.api/ws')

ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data)
  
  switch (type) {
    case 'agent_response':
      displayAgentMessage(data.text)
      break
    case 'document_ready':
      notifyDocumentProcessed(data.documentId)
      break
    case 'subscription_updated':
      updateUserTier(data.tier)
      break
  }
}
```

## Error Handling Strategy

```typescript
// Graceful degradation hierarchy
class ApiGateway {
  async queryGemini(prompt: string) {
    try {
      // Try primary endpoint
      return await geminiClient.query(prompt)
    } catch (error) {
      if (error.code === 'QUOTA_EXCEEDED') {
        // Fallback: Use cached responses or simpler model
        logger.warn('Gemini quota exceeded, using fallback')
        return getFallbackResponse(prompt)
      } else if (error.code === 'AUTH_ERROR') {
        // Fallback: Return error message
        throw new Error('Service temporarily unavailable')
      } else {
        // Retry with exponential backoff
        return retryWithBackoff(() => geminiClient.query(prompt))
      }
    }
  }
}

// User-facing errors
interface ApiError {
  code: string  // 'RATE_LIMIT' | 'INVALID_INPUT' | 'SERVICE_UNAVAILABLE'
  message: string
  retryAfter?: number  // Seconds
  fallback?: string    // Suggested fallback action
}
```

## Performance Optimizations

1. **Code Splitting**: Load agent code lazily
2. **Image Optimization**: Compress product photos, use WebP
3. **Caching Strategy**:
   - Browser cache: Products (1 week), Articles (1 day)
   - Server cache: Gemini responses (1 hour), User profiles (5 min)
   - CDN: Static assets, public documents
4. **Database Indexing**: On query, documentId, userId for fast lookups
5. **API Response Compression**: gzip on all JSON responses
6. **3D Optimization**: LOD (Level of Detail) for particle systems, disable shadows on mobile

## Security Measures

1. **API Authentication**: JWT tokens with 1-hour expiry
2. **Rate Limiting**: 100 requests/min per user IP
3. **Input Validation**: Zod schemas on all endpoints
4. **CORS**: Whitelist only trusted origins
5. **Secrets Management**: Environment variables, no hardcoded keys
6. **HTTPS Everywhere**: TLS 1.3 minimum
7. **CSRF Protection**: Token-based
8. **SQL Injection Prevention**: Parameterized queries (Prisma ORM)

## Monitoring & Observability

```typescript
// Structured logging with Pino
logger.info({
  event: 'oracle_query',
  userId: user.id,
  prompt: sanitize(prompt),
  responseTime: 1250,  // ms
  agent: 'knowledge',
  tokenCount: 450,
  status: 'success'
})

// Key metrics
- API response times (p50, p95, p99)
- Error rates by endpoint
- Agent response quality (user feedback)
- API quota usage (Gemini, ElevenLabs, Deepgram)
- Document processing times
- User retention & engagement
```


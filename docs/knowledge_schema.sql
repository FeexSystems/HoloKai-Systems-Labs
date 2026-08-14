CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS source (
 id UUID PRIMARY KEY, source_type TEXT NOT NULL, title TEXT NOT NULL,
 authors JSONB DEFAULT '[]', publication_year INT, publisher TEXT,
 doi TEXT, isbn TEXT, url TEXT, repository TEXT, language TEXT,
 community TEXT, rights TEXT, cultural_protocol TEXT,
 reliability JSONB DEFAULT '{}', bias_notes TEXT, created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS document (
 id UUID PRIMARY KEY, source_id UUID REFERENCES source(id),
 corpus_volume INT, domain_ids JSONB DEFAULT '[]', title TEXT,
 version TEXT, checksum TEXT, page_count INT, language TEXT,
 created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS evidence_chunk (
 id UUID PRIMARY KEY, document_id UUID REFERENCES document(id),
 text TEXT NOT NULL, page INT, section TEXT, char_start INT, char_end INT,
 embedding vector(768), search_text TSVECTOR, metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS evidence_embedding_hnsw ON evidence_chunk USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS evidence_search_gin ON evidence_chunk USING gin (search_text);

CREATE TABLE IF NOT EXISTS entity (
 id UUID PRIMARY KEY, entity_type TEXT NOT NULL, canonical_name TEXT NOT NULL,
 aliases JSONB DEFAULT '[]', properties JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS relation (
 id UUID PRIMARY KEY, subject_id UUID REFERENCES entity(id), predicate TEXT NOT NULL,
 object_id UUID REFERENCES entity(id), valid_from TEXT, valid_to TEXT,
 evidence_ids JSONB DEFAULT '[]', confidence DOUBLE PRECISION DEFAULT 0.5,
 metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS claim (
 id UUID PRIMARY KEY, text TEXT NOT NULL, claim_type TEXT,
 status TEXT DEFAULT 'unverified', confidence DOUBLE PRECISION,
 evidence_ids JSONB DEFAULT '[]', created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_session (
 id UUID PRIMARY KEY, user_id UUID, title TEXT,
 goals JSONB DEFAULT '[]', state JSONB DEFAULT '{}',
 created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_memory (
 id UUID PRIMARY KEY, session_id UUID REFERENCES research_session(id),
 memory_type TEXT NOT NULL, content JSONB NOT NULL,
 provenance JSONB DEFAULT '{}', importance DOUBLE PRECISION DEFAULT 0.5,
 created_at TIMESTAMPTZ DEFAULT now()
);

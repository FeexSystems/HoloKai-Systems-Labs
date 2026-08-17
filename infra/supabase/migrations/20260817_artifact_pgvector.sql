-- HoloKai Artifact Intelligence v2.1
-- Default embedding dimension matches the repository's nomic-embed-text path.
-- If a different embedding model is selected, create a parallel table with its dimension.
create extension if not exists vector;

create table if not exists public.holokai_embeddings (
  id bigint generated always as identity primary key,
  entity_id text not null,
  content text not null,
  embedding vector(768) not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists holokai_embeddings_entity_id_idx
  on public.holokai_embeddings(entity_id);

create index if not exists holokai_embeddings_metadata_gin_idx
  on public.holokai_embeddings using gin(metadata);

create index if not exists holokai_embeddings_embedding_hnsw_idx
  on public.holokai_embeddings using hnsw (embedding vector_cosine_ops);

create or replace function public.match_holokai_embeddings(
  query_embedding vector(768),
  match_count integer default 8,
  filter jsonb default '{}'::jsonb
)
returns table (
  entity_id text,
  content text,
  metadata jsonb,
  score real
)
language sql stable
as $$
  select
    e.entity_id,
    e.content,
    e.metadata,
    (1 - (e.embedding <=> query_embedding))::real as score
  from public.holokai_embeddings e
  where e.metadata @> filter
  order by e.embedding <=> query_embedding
  limit greatest(match_count, 1);
$$;

create extension if not exists vector;

create table if not exists public.artifact_world_entities (
  id text primary key,
  entity_type text not null default 'cultural_artifact',
  canonical_name text,
  civilization text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artifact_observations (
  observation_id text primary key,
  entity_id text references public.artifact_world_entities(id),
  observed_at timestamptz not null default now(),
  frame_id text,
  pose6d jsonb not null default '{}'::jsonb,
  perception jsonb not null default '{}'::jsonb,
  identity jsonb not null default '{}'::jsonb,
  epistemic jsonb not null default '{}'::jsonb,
  provenance jsonb not null default '{}'::jsonb,
  raw_observation jsonb not null default '{}'::jsonb
);

create table if not exists public.artifact_evidence (
  id bigint generated always as identity primary key,
  observation_id text not null references public.artifact_observations(observation_id) on delete cascade,
  candidate_id text not null,
  source text not null,
  score double precision not null check (score >= 0 and score <= 1),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.artifact_world_entities enable row level security;
alter table public.artifact_observations enable row level security;
alter table public.artifact_evidence enable row level security;

create index if not exists artifact_observations_entity_idx on public.artifact_observations(entity_id, observed_at desc);
create index if not exists artifact_evidence_observation_idx on public.artifact_evidence(observation_id);

comment on table public.artifact_observations is 'Persistent provenance-aware physical observations produced by HoloKai Artifact Intelligence v2.2';
comment on table public.artifact_evidence is 'Independent retrieval evidence used to resolve physical observations to HoloKai entities';

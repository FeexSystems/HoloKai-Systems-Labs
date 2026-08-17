-- HoloKai World Model v1 + Artifact Intelligence Persistent Schema
create extension if not exists vector;

create table if not exists public.artifact_world_entities (
  id text primary key,
  entity_type text not null default 'cultural_artifact',
  canonical_name text not null,
  civilization text,
  historical_period text,
  epistemic_status text not null default 'ESTABLISHED',
  metadata jsonb not null default '{}'::jsonb,
  provenance jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artifact_observations (
  observation_id text primary key,
  entity_id text references public.artifact_world_entities(id),
  observed_at timestamptz not null default now(),
  frame_id text not null default 'map',
  spatial_status text not null default 'GROUNDED', -- GROUNDED or UNGROUNDED
  pose6d jsonb not null default '{}'::jsonb,
  perception jsonb not null default '{}'::jsonb,
  identity jsonb not null default '{}'::jsonb,
  epistemic jsonb not null default '{}'::jsonb,
  provenance jsonb not null default '{}'::jsonb,
  raw_observation jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.artifact_resolutions (
  id bigint generated always as identity primary key,
  observation_id text not null references public.artifact_observations(observation_id) on delete cascade,
  entity_id text references public.artifact_world_entities(id),
  status text not null check (status in ('RESOLVED', 'AMBIGUOUS', 'UNRESOLVED')),
  match_score double precision not null check (match_score >= 0 and match_score <= 1),
  channel_scores jsonb not null default '{}'::jsonb,
  conflict_penalty double precision not null default 0.0,
  policy_version text not null default 'v2.2',
  created_at timestamptz not null default now()
);

create table if not exists public.artifact_evidence (
  id bigint generated always as identity primary key,
  observation_id text not null references public.artifact_observations(observation_id) on delete cascade,
  candidate_id text not null,
  source_type text not null, -- vector, graph, metadata, provenance
  score double precision not null check (score >= 0 and score <= 1),
  source_reference text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.world_state_events (
  id bigint generated always as identity primary key,
  event_type text not null,
  source text not null default 'holokai-world-model',
  entity_id text references public.artifact_world_entities(id),
  observation_id text references public.artifact_observations(observation_id),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.artifact_world_entities enable row level security;
alter table public.artifact_observations enable row level security;
alter table public.artifact_resolutions enable row level security;
alter table public.artifact_evidence enable row level security;
alter table public.world_state_events enable row level security;

create index if not exists artifact_observations_entity_idx on public.artifact_observations(entity_id, observed_at desc);
create index if not exists artifact_resolutions_observation_idx on public.artifact_resolutions(observation_id);
create index if not exists artifact_evidence_observation_idx on public.artifact_evidence(observation_id);
create index if not exists artifact_evidence_candidate_idx on public.artifact_evidence(candidate_id);
create index if not exists world_state_events_entity_idx on public.world_state_events(entity_id, created_at desc);

comment on table public.artifact_world_entities is 'Persistent canonical cultural artifact entities recognized by HoloKai World Model v1';
comment on table public.artifact_observations is 'Persistent provenance-aware physical observations produced by HoloKai Artifact Intelligence v2.2';
comment on table public.artifact_resolutions is 'Multimodal evidence fusion resolution audit trail for physical observations';
comment on table public.artifact_evidence is 'Independent multi-channel evidence records supporting artifact identity resolutions';
comment on table public.world_state_events is 'Temporal state event stream for HoloKai physical-AI world model transitions';

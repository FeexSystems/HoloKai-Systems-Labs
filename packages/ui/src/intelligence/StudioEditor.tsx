import React from 'react';
import {
  CheckCircle2,
  Clock3,
  Database,
  Loader2,
  PlayCircle,
  RefreshCcw,
  Upload,
  XCircle,
} from 'lucide-react';

export interface StorageStatus {
  backend?: string;
  error?: string;
}

export interface StudioJob {
  id: string;
  job_type: string;
  status: string;
  backend?: string;
  updated_at?: string;
  result?: {
    output?: any;
    error?: string;
  };
}

export interface StudioQueueItem {
  slug: string;
  title: string;
  editorial_status?: string;
  rights_status?: string;
}

export interface StudioEditorProps {
  items: StudioQueueItem[];
  jobs: StudioJob[];
  storage: StorageStatus | null;
  error: string;
  loadingQueue: boolean;
  loadingJobs: boolean;
  loadingStorage: boolean;
  submittingImport: boolean;
  importPath: string;
  verifyDoi: boolean;
  lastJobId: string;
  autoPoll: boolean;
  runningJobsCount: number;

  onRefreshAll: () => void;
  onRefreshJobs: () => void;
  onReview: (slug: string, decision: string) => void;
  onSubmitImport: (e: React.FormEvent) => void;
  onImportPathChange: (path: string) => void;
  onVerifyDoiChange: (verify: boolean) => void;
  onAutoPollChange: (autoPoll: boolean) => void;
}

function JobStatusBadge({ status }: { status: string }) {
  const base = 'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]';
  const s = (status || '').toLowerCase();
  
  if (s === 'succeeded') {
    return <span className={`${base} border-emerald-500/30 bg-emerald-500/10 text-emerald-200`}>succeeded</span>;
  }
  if (s === 'failed') {
    return <span className={`${base} border-red-500/30 bg-red-500/10 text-red-200`}>failed</span>;
  }
  if (s === 'running') {
    return <span className={`${base} border-sky-500/30 bg-sky-500/10 text-sky-200`}>running</span>;
  }
  return <span className={`${base} border-brand/30 bg-brand/10 text-brand`}>{s || 'queued'}</span>;
}

function summarizeJob(job: StudioJob) {
  const output = job?.result?.output;
  if (!output) return null;

  if (job.job_type === 'ris_import') {
    const up = output.upsert || {};
    return `RIS ${output.records_deduped ?? '?'} records · inserted ${up.inserted ?? 0} · updated ${up.updated ?? 0}`;
  }

  if (job.job_type === 'grounded_synthesis') {
    const count = output?.grounded?.supported_claim_count;
    return `Grounded synthesis · supported claims ${count ?? 0}`;
  }

  return 'Completed';
}

export function StudioEditor({
  items,
  jobs,
  storage,
  error,
  loadingQueue,
  loadingJobs,
  loadingStorage,
  submittingImport,
  importPath,
  verifyDoi,
  lastJobId,
  autoPoll,
  runningJobsCount,
  onRefreshAll,
  onRefreshJobs,
  onReview,
  onSubmitImport,
  onImportPathChange,
  onVerifyDoiChange,
  onAutoPollChange,
}: StudioEditorProps) {
  return (
    <div className="h-full overflow-y-auto px-4 py-6 text-zinc-100 font-sans">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Editorial Studio</h1>
            <p className="mt-1 text-sm text-muted">Review staged records and run tracked background ingestion jobs</p>
          </div>
          <button
            type="button"
            onClick={onRefreshAll}
            className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-white/5 px-3 py-2 text-xs text-zinc-200 hover:border-white/20 transition"
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>

        {error && (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-300">
            {error}
          </p>
        )}

        {/* STORAGE STATUS */}
        <section className="rounded-lg border border-border-subtle bg-white/5 p-3">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Database className="h-4 w-4" />
            Storage backend: <span className="font-medium text-zinc-100">{storage?.backend || 'unknown'}</span>
            {loadingStorage && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" />}
          </div>
          {storage?.error && <p className="mt-1 text-[11px] text-muted">{storage.error}</p>}
        </section>

        {/* IMPORT JOB SECTION */}
        <section className="rounded-lg border border-border-subtle bg-white/5 p-4">
          <h2 className="text-sm font-semibold text-zinc-100">Queue RIS import job</h2>
          <p className="mt-1 text-xs text-muted">Imports bibliography into candidate-source staging (not public canon text).</p>

          <form onSubmit={onSubmitImport} className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <label className="block">
              <span className="mb-1 block text-[11px] text-muted">RIS file path</span>
              <input
                id="ris_import_path"
                name="ris_import_path"
                value={importPath}
                onChange={(e) => onImportPathChange(e.target.value)}
                placeholder="C:/path/to/file.ris"
                className="h-10 w-full rounded-md border border-border-subtle bg-black/30 px-3 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </label>

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-xs text-muted cursor-pointer">
                <input
                  type="checkbox"
                  id="ris_verify_doi"
                  name="ris_verify_doi"
                  checked={verifyDoi}
                  onChange={(e) => onVerifyDoiChange(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-black/40 accent-amber-500"
                />
                Verify DOI
              </label>
              <button
                type="submit"
                disabled={submittingImport || !importPath.trim()}
                className="inline-flex items-center gap-2 rounded-md bg-brand px-3 py-2 text-sm font-medium text-black disabled:opacity-60 hover:bg-[var(--color-brand)] transition"
              >
                {submittingImport ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Queue import
              </button>
            </div>
          </form>

          {lastJobId && (
            <p className="mt-2 text-xs text-muted">
              Last queued job: <span className="font-mono text-zinc-200">{lastJobId}</span>
            </p>
          )}
        </section>

        {/* BACKGROUND JOBS */}
        <section className="rounded-lg border border-border-subtle bg-white/5 p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-zinc-100">Background jobs</h2>
            <div className="flex items-center gap-3 text-xs text-muted">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPoll}
                  onChange={(e) => onAutoPollChange(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-black/40 accent-amber-500"
                />
                Auto-poll
              </label>
              <span>Running: {runningJobsCount}</span>
              <button
                type="button"
                onClick={onRefreshJobs}
                className="inline-flex items-center gap-1 rounded-md border border-border-subtle px-2 py-1 hover:border-white/20 transition"
              >
                {loadingJobs ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PlayCircle className="h-3.5 w-3.5" />}
                Refresh jobs
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {jobs.length === 0 && !loadingJobs && (
              <p className="text-sm text-muted">No jobs found.</p>
            )}
            {jobs.map((job) => {
              const summary = summarizeJob(job);
              return (
                <article key={`${job.backend || 'x'}-${job.id}`} className="rounded-md border border-border-subtle bg-black/30 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-zinc-100">
                        {job.job_type || 'job'} · <span className="font-mono">{job.id}</span>
                      </p>
                      <p className="mt-1 text-[11px] text-muted">
                        backend: {job.backend || 'unknown'} · updated: {job.updated_at || '—'}
                      </p>
                    </div>
                    <JobStatusBadge status={job.status} />
                  </div>

                  {summary && <p className="mt-2 text-xs text-muted">{summary}</p>}
                  {job.result?.error && (
                    <p className="mt-2 rounded border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-200">
                      {job.result.error}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* EDITORIAL QUEUE */}
        <section>
          <h2 className="mb-2 text-sm font-semibold text-zinc-100">Editorial queue</h2>
          <div className="space-y-2">
            {loadingQueue && <p className="text-sm text-muted">Loading queue…</p>}

            {!loadingQueue && items.length === 0 && (
              <p className="text-sm text-muted">No records in queue.</p>
            )}

            {items.map((item) => (
              <article key={item.slug} className="rounded-lg border border-border-subtle bg-white/5 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-100">{item.title}</h3>
                    <p className="text-xs text-muted">
                      {item.slug} · {item.editorial_status || 'staged'} · rights: {item.rights_status || 'unknown'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onReview(item.slug, 'approved')}
                      className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-200 hover:bg-emerald-500/20 transition"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => onReview(item.slug, 'needs_changes')}
                      className="inline-flex items-center gap-1 rounded-md border border-brand/30 bg-brand/10 px-2 py-1 text-[11px] text-brand hover:bg-brand/20 transition"
                    >
                      <Clock3 className="h-3.5 w-3.5" /> Needs changes
                    </button>
                    <button
                      type="button"
                      onClick={() => onReview(item.slug, 'rejected')}
                      className="inline-flex items-center gap-1 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] text-red-200 hover:bg-red-500/20 transition"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

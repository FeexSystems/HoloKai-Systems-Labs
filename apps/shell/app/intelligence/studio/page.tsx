"use client";

import React, { useState, useEffect } from 'react';
import { StudioEditor, StudioJob, StudioQueueItem, StorageStatus } from '@holokai/ui';
import { 
  studioQueue, 
  listJobs, 
  storageStatus, 
  studioReview, 
  createImportRisJob 
} from '../../../lib/holokaiApi';

export default function StudioEditorPage() {
  const [items, setItems] = useState<StudioQueueItem[]>([]);
  const [jobs, setJobs] = useState<StudioJob[]>([]);
  const [storage, setStorage] = useState<StorageStatus | null>(null);
  const [error, setError] = useState('');
  
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingStorage, setLoadingStorage] = useState(false);
  const [submittingImport, setSubmittingImport] = useState(false);
  
  const [importPath, setImportPath] = useState('');
  const [verifyDoi, setVerifyDoi] = useState(true);
  const [lastJobId, setLastJobId] = useState('');
  const [autoPoll, setAutoPoll] = useState(true);

  const fetchStorage = async () => {
    setLoadingStorage(true);
    try {
      const data = await storageStatus();
      setStorage(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch storage status');
    } finally {
      setLoadingStorage(false);
    }
  };

  const fetchQueue = async () => {
    setLoadingQueue(true);
    try {
      const data = await studioQueue();
      setItems(data.items);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch queue');
    } finally {
      setLoadingQueue(false);
    }
  };

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const data = await listJobs();
      setJobs(data.items);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch jobs');
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchStorage();
    fetchQueue();
    fetchJobs();
  }, []);

  // Auto-polling for jobs
  useEffect(() => {
    if (!autoPoll) return;
    const interval = setInterval(() => {
      fetchJobs();
    }, 3000);
    return () => clearInterval(interval);
  }, [autoPoll]);

  const handleRefreshAll = () => {
    fetchStorage();
    fetchQueue();
    fetchJobs();
  };

  const handleReview = async (slug: string, decision: string) => {
    try {
      await studioReview({ slug, decision });
      await fetchQueue();
    } catch (err: any) {
      setError(err.message || 'Failed to review item');
    }
  };

  const handleSubmitImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importPath.trim()) return;
    
    setSubmittingImport(true);
    setError('');
    
    try {
      const job = await createImportRisJob(importPath, { verifyDoi });
      setLastJobId(job.id);
      setImportPath('');
      await fetchJobs();
    } catch (err: any) {
      setError(err.message || 'Failed to create import job');
    } finally {
      setSubmittingImport(false);
    }
  };

  const runningJobsCount = jobs.filter(j => j.status === 'running').length;

  return (
    <div className="min-h-screen bg-zinc-950">
      <StudioEditor
        items={items}
        jobs={jobs}
        storage={storage}
        error={error}
        loadingQueue={loadingQueue}
        loadingJobs={loadingJobs}
        loadingStorage={loadingStorage}
        submittingImport={submittingImport}
        importPath={importPath}
        verifyDoi={verifyDoi}
        lastJobId={lastJobId}
        autoPoll={autoPoll}
        runningJobsCount={runningJobsCount}
        onRefreshAll={handleRefreshAll}
        onRefreshJobs={fetchJobs}
        onReview={handleReview}
        onSubmitImport={handleSubmitImport}
        onImportPathChange={setImportPath}
        onVerifyDoiChange={setVerifyDoi}
        onAutoPollChange={setAutoPoll}
      />
    </div>
  );
}

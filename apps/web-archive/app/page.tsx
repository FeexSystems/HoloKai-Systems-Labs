'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MFEErrorBoundary, MFELoadingSkeleton, DataTable, Column } from '@holokai/ui';
import { Database, Search, Filter } from 'lucide-react';

interface ArchiveRecord {
  id: string;
  civilizationId: string;
  title: string;
  category: string;
  description: string;
  era: string;
  region: string;
}

function ArchiveContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data, isLoading, error } = useQuery<{ records: ArchiveRecord[] }>({
    queryKey: ['archives', searchTerm, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('query', searchTerm);
      if (categoryFilter) params.append('category', categoryFilter);
      
      // In production this would be the absolute URL to the BFF
      const res = await fetch(`/api/bff/archive?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch archives');
      return res.json();
    },
  });

  if (error) {
    throw error;
  }

  const columns: Column<ArchiveRecord>[] = [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: (item) => (
        <div className="font-semibold text-indigo-300">{item.title}</div>
      )
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: (item) => (
        <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-md text-xs uppercase tracking-wider border border-indigo-500/20">
          {item.category}
        </span>
      )
    },
    { header: 'Era', accessorKey: 'era' },
    { header: 'Region', accessorKey: 'region' },
    { header: 'Description', accessorKey: 'description' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-indigo-500/50" />
          </div>
          <input
            id="archive-search-input"
            name="archiveSearch"
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-indigo-500/20 rounded-xl leading-5 bg-black/40 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
            placeholder="Search the archives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-indigo-500/50" />
          </div>
          <select
            className="block w-full pl-10 pr-10 py-2 border border-indigo-500/20 rounded-xl leading-5 bg-black/40 text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none cursor-pointer transition-all"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="civilization">Civilization</option>
            <option value="person">Person</option>
            <option value="place">Place</option>
            <option value="event">Event</option>
            <option value="concept">Concept</option>
            <option value="artifact">Artifact</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <MFELoadingSkeleton />
      ) : (
        <DataTable data={data?.records || []} columns={columns} pageSize={10} />
      )}
    </div>
  );
}

export default function ArchiveMFEPage() {
  return (
    <main className="max-w-6xl mx-auto space-y-8 p-6 md:p-12">
      <header className="border-b border-indigo-500/20 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-indigo-500 uppercase flex items-center gap-2">
            <Database className="w-4 h-4" />
            Micro-Frontend Remote · Port 3004
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1 flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-indigo-400 animate-ping" />
            Civilization Archive
          </h1>
          <p className="text-zinc-400 mt-2 max-w-2xl">
            Explore the historical telemetry and preserved records of ancient empires. Query by era, region, or concept to uncover hidden connections.
          </p>
        </div>
      </header>
      
      <MFEErrorBoundary zoneName="web-archive">
        <ArchiveContent />
      </MFEErrorBoundary>
    </main>
  );
}

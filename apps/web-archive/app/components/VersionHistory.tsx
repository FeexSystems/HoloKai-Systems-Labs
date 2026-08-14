'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, GitBranch, FileText, Eye, ChevronRight, ChevronLeft } from 'lucide-react';

interface Version {
  id: string;
  version: number;
  date: string;
  author: string;
  changes: string;
  size: string;
}

interface VersionHistoryProps {
  documentId: string;
  versions: Version[];
  currentVersion: number;
  onVersionChange: (version: number) => void;
}

export function VersionHistory({ documentId, versions, currentVersion, onVersionChange }: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<number | null>(currentVersion);

  const currentVersionData = versions.find((v) => v.version === currentVersion);

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-[#12121a]">
      <h2 className="text-xl font-bold mb-6">Version History</h2>

      {/* Current Version Info */}
      {currentVersionData && (
        <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-sm text-zinc-400">Current Version</div>
                <div className="text-2xl font-bold text-white">v{currentVersionData.version}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Clock className="w-4 h-4" />
              <span>{currentVersionData.date}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Author: {currentVersionData.author}</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-500">{currentVersionData.size}</span>
          </div>
        </div>
      )}

      {/* Version Timeline */}
      <div className="relative pl-6">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500/30" />

        <div className="space-y-4">
          {versions.map((version, index) => (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-6"
            >
              {/* Timeline Line */}
              {index !== versions.length - 1 && (
                <div className="absolute left-0 top-8 bottom-0 w-0.5 bg-white/20" />
              )}

              {/* Version Node */}
              <div
                className={`relative p-4 rounded-xl border ${
                  selectedVersion === version.version
                    ? 'border-amber-500/50 bg-amber-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      selectedVersion === version.version
                        'bg-amber-500 text-white'
                        : 'bg-white/10 text-zinc-400'
                    }`}
                  >
                    {version.version}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-zinc-400 mb-1">{version.date}</div>
                    <div className="text-xs text-zinc-500">{version.author}</div>
                  </div>
                </div>

                <p className="text-sm text-zinc-300 mb-2">{version.changes}</p>

                {/* View Button */}
                {selectedVersion !== version.version && (
                  <button
                    onClick={() => onVersionChange(version.version)}
                    className="absolute right-0 top-4 text-xs text-amber-400 hover:text-amber-300"
                  >
                    View
                  </button>
                )}

                {/* Checkmark for selected */}
                {selectedVersion === version.version && (
                  <div className="absolute right-0 top-4 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Rollback Button */}
      {selectedVersion !== currentVersion && (
        <button
          onClick={() => onVersionChange(currentVersion)}
          className="mt-4 text-sm text-amber-400 hover:text-amber-300 flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Current (v{currentVersion})
        </button>
      )}
    </div>
  );
}

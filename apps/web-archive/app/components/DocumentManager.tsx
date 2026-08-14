'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Lock, Eye, MoreVertical, Download, Trash2, Tag, Search, Filter } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
  accessLevel: 'free' | 'pro' | 'enterprise';
  tags: string[];
  version: number;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Alexandrian_Research_Paper.pdf',
    uploadDate: '2024-01-15',
    size: '2.4 MB',
    accessLevel: 'pro',
    tags: ['Alexandria', 'Research', 'Academic'],
    version: 3,
  },
  {
    id: '2',
    name: 'Rosetta_Stone_Analysis.docx',
    uploadDate: '2024-01-10',
    size: '1.8 MB',
    accessLevel: 'free',
    tags: ['Egyptology', 'Linguistics', 'Decipherment'],
    version: 1,
  },
  {
    id: '3',
    name: 'Latin_Pronunciation_Study.pdf',
    uploadDate: '2024-01-08',
    size: '3.2 MB',
    accessLevel: 'pro',
    tags: ['Latin', 'Phonetics', 'Roman'],
    version: 2,
  },
  {
    id: '4',
    name: 'Babylonian_Math_Tablets.pdf',
    uploadDate: '2024-01-05',
    size: '4.1 MB',
    accessLevel: 'enterprise',
    tags: ['Babylon', 'Mathematics', 'Clay Tablets'],
    version: 5,
  },
  },
];

const accessLevelColors: Record<string, string> = {
  free: 'bg-zinc-500/20 text-zinc-300',
  pro: 'bg-amber-500/20 text-amber-400',
  enterprise: 'bg-blue-500/20 text-blue-400',
};

export function DocumentManager() {
  const [documents] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAccess = selectedAccessLevel === 'all' || doc.accessLevel === selectedAccessLevel;
    return matchesSearch && matchesAccess;
  });

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    setSelectedDocument(null);
  };

  return (
    <div className="px-6 py-24 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Document Archive</h1>
        <p className="text-zinc-400 max-w-2xl">
          Manage your research documents with version control, semantic search, and tier-based access
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-zinc-500" />
          <select
            value={selectedAccessLevel}
            onChange={(e) => setSelectedAccessLevel(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            <option value="all">All Access Levels</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Document Table */}
      <div className="rounded-2xl border border-white/10 bg-[#12121a] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Document</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Upload Date</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Size</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Access</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Version</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc, index) => (
              <motion.tr
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                  selectedDocument?.id === doc.id ? 'bg-amber-500/10' : ''
                }`}
                onClick={() => setSelectedDocument(doc)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-white font-medium">{doc.name}</div>
                      <div className="flex gap-1 mt-1">
                        {doc.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-400 text-sm">{doc.uploadDate}</td>
                <td className="px-6 py-4 text-zinc-400 text-sm">{doc.size}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${accessLevelColors[doc.accessLevel]}`}
                  >
                    {doc.accessLevel.charAt(0).toUpperCase() + doc.accessLevel.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-400 text-sm">v{doc.version}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle download
                      }}
                      className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc.id);
                      }}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12 text-zinc-400">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No documents found</p>
          </div>
        )}
      </div>

      {/* Document Details Panel */}
      <AnimatePresence>
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="mt-6 p-6 rounded-2xl border border-white/10 bg-[#12121a]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Document Details</h3>
              <button
                onClick={() => setSelectedDocument(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-white font-medium">{selectedDocument.name}</div>
                  <div className="text-sm text-zinc-400">{selectedDocument.size}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-zinc-400" />
                <span className="text-sm text-zinc-400">Uploaded: {selectedDocument.uploadDate}</span>
              </div>

              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-zinc-400" />
                <span className="text-sm text-zinc-400">
                  Access: {selectedDocument.accessLevel.charAt(0).toUpperCase() + selectedDocument.accessLevel.slice(1)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-zinc-400" />
                <div className="flex gap-1">
                  {selectedDocument.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-white/10 text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-zinc-400" />
                <span className="text-sm text-zinc-400">Version {selectedDocument.version}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="py-3 px-4 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                <Tag className="w-4 h-4" />
                Edit Tags
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

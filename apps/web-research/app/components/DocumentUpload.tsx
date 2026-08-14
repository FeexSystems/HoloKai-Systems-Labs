'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Check, AlertCircle, Loader2 } from 'lucide-react';

interface DocumentUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

export function DocumentUpload({
  onUpload,
  maxFiles = 10,
  maxSize = 10,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.txt'],
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const maxSizeBytes = maxSize * 1024 * 1024;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    },
    []
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      processFiles(selectedFiles);
    },
    []
  );

  const processFiles = (newFiles: File[]) => {
    setError(null);

    // Filter by file type
    const validFiles = newFiles.filter((file) => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return acceptedTypes.includes(extension);
    });

    // Filter by size
    const sizedFiles = validFiles.filter((file) => file.size <= maxSizeBytes);

    // Check if adding would exceed max files
    if (files.length + sizedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    if (validFiles.length !== sizedFiles.length) {
      setError('Some files were too large or invalid type');
    }

    setFiles((prev) => [...prev, ...sizedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setUploadProgress(i);
      }

      onUpload(files);
      setFiles([]);
      setUploadProgress(0);
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-[#12121a]">
      <h2 className="text-xl font-bold mb-6">Upload Documents</h2>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
          isDragging
            ? 'border-amber-500 bg-amber-500/10'
            : 'border-white/20 hover:border-white/30 bg-white/5'
        }`}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        <div className="flex flex-col items-center gap-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isDragging ? 'bg-amber-500/20' : 'bg-white/10'
            }`}
          >
            <Upload className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <p className="text-white font-medium">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-zinc-400">
              or click to browse
            </p>
          </div>
          <p className="text-xs text-zinc-500">
            Max {maxFiles} files, {maxSize}MB each
          </p>
          <p className="text-xs text-zinc-500">
            Accepted: {acceptedTypes.join(', ')}
          </p>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          <div className="text-sm text-zinc-400 mb-2">
            {files.length} file{files.length !== 1 ? 's' : ''} selected
          </div>
          {files.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity:1, x: 0 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <FileText className="w-8 h-8 text-amber-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{file.name}</p>
                <p className="text-xs text-zinc-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-2 rounded-lg hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      <AnimatePresence>
        {uploading && (
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
              <span className="text-sm text-white">Uploading...</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Button */}
      {files.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleUpload}
          disabled={uploading}
          className="mt-6 w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Upload {files.length} File{files.length !== 1 ? 's' : ''}
            </>
          )}
        </motion.button>
      )}
    </div>
  );
}

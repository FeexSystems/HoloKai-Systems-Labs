'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, AlertCircle, FileText, Check, Loader2, FileText as FileTextIcon } from 'lucide-react';

interface DocumentUploaderProps {
  onUpload: (files: File[]) => void;
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: () => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

export function DocumentUploader({
  onUpload,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
  maxFiles = 10,
  maxSize = 10,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.txt'],
}: DocumentUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const maxSizeBytes = maxSize * 1024 * 1024;

  const validateFile = (file: File): { valid: boolean; error: string } => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!acceptedTypes.includes(extension)) {
      return { valid: false, error: `Invalid file type. Accepted: ${acceptedTypes.join(', ')}` };
    }

    if (file.size > maxSizeBytes) {
      return { valid: false, error: `File too large. Max size: ${maxSize}MB` };
    }

    return { valid: true, error: '' };
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(validateFile);

    if (validFiles.length === 0) {
      setError('Some files were invalid. Please check file requirements.');
      return;
    }

    setFiles((prev) => [...prev, ...validFiles]);
    setError(null);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploadStatus('uploading');
    setError(null);
    onUploadProgress?.(0);

    try {
      // Simulate upload with progress
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      let uploaded = 0;

      const interval = setInterval(() => {
        const chunkSize = totalSize / 20;
        uploaded = Math.min(uploaded + chunkSize, totalSize);
        const progress = Math.round((uploaded / totalSize) * 100);
        setUploadProgress(progress);
        onUploadProgress?.(progress);

        if (uploaded >= totalSize) {
          clearInterval(interval);
          setUploadProgress(100);
          onUploadComplete?.();
          setUploadStatus('success');
          setFiles([]);
        }
      }, 100);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      onUpload(files);
    } catch (err) {
      setUploadStatus('error');
      setError('Upload failed. Please try again.');
      onUploadError?.('Upload failed. Please try again.');
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-[#12121a]">
      <h2 className="text-xl font-bold mb-6">Upload Documents</h2>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          uploadStatus === 'uploading'
            ? 'border-amber-500/50 bg-amber-500/10'
            : 'border-white/20 hover:border-white/30 bg-white/5'
        }`}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploadStatus === 'uploading'}
        />

        <div className="flex flex-col items-center gap-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
              uploadStatus === 'uploading'
                ? 'bg-amber-500/20'
                : 'bg-white/10'
            }`}
          >
            {uploadStatus === 'uploading' ? (
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-amber-400" />
          )}
          </div>

          <div>
            <p className="text-white font-medium">
              {uploadStatus === 'uploading' ? 'Uploading...' : 'Drag & drop files'}
            </p>
            <p className="text-sm text-zinc-400">
              {uploadStatus === 'uploading'
                ? `${files.length} file${files.length !== 1 ? 's' : ''} remaining`
                : `Max ${maxFiles} files, ${maxSize}MB each`}
            </p>
            <p className="text-xs text-zinc-500">
              Accepted: {acceptedTypes.join(', ')}
            </p>
          </div>
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
          {files.map((file, index) => (
            <motion.div
              key={file.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5"
            >
              <FileTextIcon className="w-8 h-8 text-amber-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{file.name}</p>
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

      {/* Upload Button */}
      {files.length > 0 && uploadStatus !== 'uploading' && (
        <motion.button
          onClick={handleUpload}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload {files.length} File{files.length !== 1 ? 's' : ''}
        </motion.button>
      )}

      {/* Success Message */}
      <AnimatePresence>
        {uploadStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span className="font-medium">Upload complete!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

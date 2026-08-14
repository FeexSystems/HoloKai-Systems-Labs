"use client";

import React, { useState } from 'react';

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
}

export function DataTable<T>({ data, columns, pageSize = 10 }: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);

  return (
    <div className="w-full">
      <div className="overflow-x-auto border border-white/10 rounded-xl bg-black/40">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="text-xs uppercase bg-white/5 text-zinc-400 border-b border-white/10">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} scope="col" className="px-6 py-4 font-medium tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-zinc-500">
                  No records found.
                </td>
              </tr>
            ) : (
              currentData.map((item, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                      {col.cell ? col.cell(item) : (item as any)[col.accessorKey as keyof T]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-zinc-400">
            Showing <span className="text-white">{startIndex + 1}</span> to <span className="text-white">{Math.min(startIndex + pageSize, data.length)}</span> of <span className="text-white">{data.length}</span> records
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-white/5 text-zinc-300 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded text-sm flex items-center justify-center transition-colors ${currentPage === idx + 1 ? 'bg-[var(--color-surface-hover)] text-[var(--color-brand)] border border-[var(--color-border)]' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-white/5 text-zinc-300 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

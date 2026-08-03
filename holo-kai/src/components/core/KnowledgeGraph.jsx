import React from 'react';
import OracleKnowledgeGraph from '@/components/oracle/OracleKnowledgeGraph';

export default function KnowledgeGraph({ onSelectNode }) {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-6 bg-zinc-950">
      <OracleKnowledgeGraph onSelectNode={onSelectNode} />
    </div>
  );
}

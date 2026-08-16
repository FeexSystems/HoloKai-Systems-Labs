"use client";

import React, { useState, useEffect } from 'react';
import { KnowledgeNavigator, HistoricalRecord } from '@holokai/ui';

export default function KnowledgeNavigatorPage() {
  const [records, setRecords] = useState<HistoricalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Load mock records on mount
  useEffect(() => {
    const loadMockData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // Setup initial mock data
        const initialRecords: HistoricalRecord[] = [
          {
            id: 'rec_1',
            title: 'The Edwin Smith Surgical Papyrus',
            era: 'Kemet & Nubia',
            region: 'North Africa',
            category: 'Sacred Science & Medicine',
            timeframe: 'c. 1600 BCE',
            summary: 'An ancient Egyptian medical text on trauma surgery. It describes 48 cases of injuries, fractures, wounds, dislocations and tumors.',
            keyInsights: ['Earliest known treatise on trauma surgery', 'Demonstrates an objective, scientific approach to medicine'],
            status: 'Verified Record',
            isBookmarked: true,
            tags: ['Medicine', 'Surgery', 'Kemet'],
            authorName: 'Unknown (Attributed to Imhotep lineage)',
          },
          {
            id: 'rec_2',
            title: 'Kano Chronicle',
            era: 'West Africa',
            region: 'West Africa',
            category: 'Oral Epics & Acoustic History',
            timeframe: '10th-19th Century',
            summary: 'An account of the history of the Hausa people of Kano, from the 10th century to the early 20th century.',
            keyInsights: ['Details the reigns of 38 kings of Kano', 'Chronicles the introduction of Islam to the region'],
            status: 'Verified Record',
            isBookmarked: false,
            tags: ['Hausa', 'Kano', 'Chronicle'],
            authorName: 'Various oral historians',
          }
        ];
        
        setRecords(initialRecords);
      } catch (err) {
        setError('Failed to load records from the database.');
      } finally {
        setLoading(false);
      }
    };
    
    loadMockData();
  }, []);

  const handleClearError = () => {
    setError(null);
  };

  const handleSeedRecords = async () => {
    setIsSeeding(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRecords([
      ...records,
      {
        id: `rec_${Date.now()}`,
        title: 'New Seeded Record',
        era: 'Sahel & Timbuktu',
        region: 'West Africa',
        category: 'Literature & Scholarship',
        timeframe: '15th Century',
        summary: 'A newly seeded manuscript from the Sankore University archives.',
        keyInsights: ['Mathematics and astronomy observations'],
        status: 'Active Field Notes',
        isBookmarked: false,
        tags: ['Sankore', 'Astronomy'],
        authorName: 'Timbuktu Scholar',
      }
    ]);
    setIsSeeding(false);
  };

  const handleToggleBookmark = (e: React.MouseEvent, record: HistoricalRecord) => {
    e.stopPropagation();
    setRecords(prev => prev.map(r => r.id === record.id ? { ...r, isBookmarked: !r.isBookmarked } : r));
  };

  const handleSaveRecord = async (payload: any, editingId: string | null) => {
    // Simulate API save
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    if (editingId) {
      setRecords(prev => prev.map(r => r.id === editingId ? { ...r, ...payload } : r));
    } else {
      const newRecord: HistoricalRecord = {
        ...payload,
        id: `rec_${Date.now()}`,
        isBookmarked: false,
      };
      setRecords(prev => [newRecord, ...prev]);
    }
  };

  const handleDeleteRecord = (e: React.MouseEvent, recordId: string) => {
    e.stopPropagation();
    setRecords(prev => prev.filter(r => r.id !== recordId));
  };

  const handleAddAnnotation = async (record: HistoricalRecord, note: string) => {
    // Simulate API save
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRecords(prev => prev.map(r => {
      if (r.id === record.id) {
        return {
          ...r,
          keyInsights: [...(r.keyInsights || []), `User Research Note: ${note}`]
        };
      }
      return r;
    }));
  };

  return (
    <div className="min-h-screen bg-black">
      <KnowledgeNavigator
        records={records}
        loading={loading}
        firestoreError={error}
        onClearError={handleClearError}
        isSeeding={isSeeding}
        onSeedRecords={handleSeedRecords}
        onToggleBookmark={handleToggleBookmark}
        onSaveRecord={handleSaveRecord}
        onDeleteRecord={handleDeleteRecord}
        onAddAnnotation={handleAddAnnotation}
      />
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import { ManuscriptViewer, Manuscript } from '@holokai/ui';

const MOCK_MANUSCRIPTS: Manuscript[] = [
  {
    id: 'm1',
    title: 'Kano Chronicle (Tarikh Kano)',
    civilization: 'Hausa Kingdom',
    pages: 142,
    date: 'c. 1890 (Original oral tradition 10th C)',
    language: 'Arabic / Hausa Ajami',
    hasTranslation: true,
    hasTranscription: true,
  },
  {
    id: 'm2',
    title: 'Kebra Nagast (Glory of the Kings)',
    civilization: 'Aksumite Empire',
    pages: 350,
    date: '14th Century CE',
    language: 'Ge\'ez',
    hasTranslation: true,
    hasTranscription: true,
  },
  {
    id: 'm3',
    title: 'Edwin Smith Papyrus',
    civilization: 'Kemet',
    pages: 17,
    date: 'c. 1600 BCE',
    language: 'Hieratic',
    hasTranslation: true,
    hasTranscription: false,
  }
];

export default function ManuscriptViewerPage() {
  const [manuscripts] = useState<Manuscript[]>(MOCK_MANUSCRIPTS);
  const [selected, setSelected] = useState<Manuscript>(MOCK_MANUSCRIPTS[0]);
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState<'transcription' | 'translation'>('transcription');

  const handleSelectManuscript = (manuscript: Manuscript) => {
    setSelected(manuscript);
    setZoom(1); // Reset zoom on new manuscript
    
    // Switch to translation if transcription isn't available
    if (!manuscript.hasTranscription && manuscript.hasTranslation) {
      setActiveTab('translation');
    }
  };

  const handleSendToChat = (manuscript: Manuscript) => {
    console.log(`Sending ${manuscript.title} to Research Chat for analysis...`);
    // Future integration with HoloKai Chat AI
  };

  return (
    <div className="h-screen bg-black">
      <ManuscriptViewer
        manuscripts={manuscripts}
        selected={selected}
        zoom={zoom}
        activeTab={activeTab}
        accentColor="#f59e0b"
        onSelectManuscript={handleSelectManuscript}
        onZoomChange={setZoom}
        onTabChange={setActiveTab}
        onSendToChat={handleSendToChat}
      />
    </div>
  );
}

import React from 'react';
import type { Metadata } from 'next';
import { VoiceOracleChamber } from '@holokai/ui';

export const metadata: Metadata = {
  title: 'HoloKai · Voice Oracle Chamber',
  description: 'Speak directly to 8 AI Guardian personas through the HoloKai Voice Oracle — ElevenLabs, Deepgram, and Web Speech synthesis with 3D visualization.',
};

export default function VoiceOraclePage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-zinc-100 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        <VoiceOracleChamber motionProfile="visibleHumanoid" />
      </div>
    </main>
  );
}

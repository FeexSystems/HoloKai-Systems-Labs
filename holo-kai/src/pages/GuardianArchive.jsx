import React from 'react';
import PageShell from '@/components/PageShell';
import CivilizationArchive from '@/components/core/CivilizationArchive';
import { useNavigate } from 'react-router-dom';

export default function GuardianArchive() {
  const navigate = useNavigate();

  const handleNavigateToOracle = (query) => {
    navigate('/oracle');
  };

  const handleCompareCivilization = () => {
    navigate('/core');
  };

  return (
    <PageShell
      title="Civilization Archive"
      subtitle="Interactive historical repository of African civilizations & empires"
      badge="Archive"
      backTo="/core"
      backLabel="Civilization Core"
      wide
    >
      <div className="rounded-2xl border border-amber-500/20 bg-zinc-950 overflow-hidden shadow-2xl min-h-[80vh]">
        <CivilizationArchive
          onNavigateToOracle={handleNavigateToOracle}
          onCompareCivilization={handleCompareCivilization}
        />
      </div>
    </PageShell>
  );
}

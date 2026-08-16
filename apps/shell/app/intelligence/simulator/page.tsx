"use client";

import React, { useState, useEffect } from 'react';
import { 
  QuantumTimeSimulator, 
  HistoricalScenario, 
  ScenarioParams, 
  SimulationResult, 
  SavedSimulation,
  HISTORICAL_SCENARIOS 
} from '@holokai/ui';

export default function QuantumTimeSimulatorPage() {
  const [selectedScenario, setSelectedScenario] = useState<HistoricalScenario>(HISTORICAL_SCENARIOS[0]);
  const [params, setParams] = useState<ScenarioParams>(HISTORICAL_SCENARIOS[0].defaultParams);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load mock saved simulations
    const loadSimulations = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setSavedSimulations([
        {
          id: 'sim_1',
          civilization: 'Mali Empire & Kemet',
          scenarioTitle: 'Trans-Saharan & Nile Trade Convergence',
          authorName: 'HoloKai System',
          result: {
            gdpGrowth: '45.2',
            literacyIndex: '82.1',
            stabilityIndex: '91.5',
            summary: 'The simulated canal infrastructure drastically accelerated trade flow across the Sahel, boosting cumulative economic output by 45.2% over a century. However, heightened regional stability required significant standing guard commitments.'
          }
        }
      ]);
      setLoading(false);
    };
    loadSimulations();
  }, []);

  const handleSelectScenario = (scenario: HistoricalScenario) => {
    setSelectedScenario(scenario);
    setParams(scenario.defaultParams);
    setSimulationResult(null);
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    
    // Simulate complex background calculations
    setTimeout(() => {
      const baseGDP = params.tradeVolume * 0.4 + params.metallurgyDiffusion * 0.2;
      const baseLit = params.scholarlyExchange * 0.6 + params.tradeVolume * 0.1;
      const baseStab = params.maritimeDefense * 0.5 + params.metallurgyDiffusion * 0.2;
      
      setSimulationResult({
        gdpGrowth: baseGDP.toFixed(1),
        literacyIndex: baseLit.toFixed(1),
        stabilityIndex: baseStab.toFixed(1),
        summary: `Computed vectors based on ${params.tradeVolume}% trade volume and ${params.scholarlyExchange}% scholarly exchange. The resulting geopolitical balance indicates a sustained golden age trajectory.`
      });
      setIsSimulating(false);
    }, 2500);
  };

  const handleSaveSimulation = async () => {
    if (!simulationResult) return;
    
    const newSim: SavedSimulation = {
      id: `sim_${Date.now()}`,
      civilization: selectedScenario.civilization,
      scenarioTitle: selectedScenario.title,
      result: simulationResult,
      authorName: 'Current User',
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    setSavedSimulations(prev => [newSim, ...prev]);
  };

  const handleDeleteSimulation = (id: string) => {
    setSavedSimulations(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-black">
      <QuantumTimeSimulator
        scenarios={HISTORICAL_SCENARIOS}
        selectedScenario={selectedScenario}
        params={params}
        isSimulating={isSimulating}
        simulationResult={simulationResult}
        savedSimulations={savedSimulations}
        loading={loading}
        onSelectScenario={handleSelectScenario}
        onParamsChange={setParams}
        onRunSimulation={handleRunSimulation}
        onSaveSimulation={handleSaveSimulation}
        onDeleteSimulation={handleDeleteSimulation}
      />
    </div>
  );
}

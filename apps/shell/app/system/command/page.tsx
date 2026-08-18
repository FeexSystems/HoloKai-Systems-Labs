import { TelemetryDashboard } from './TelemetryDashboard';

export const metadata = {
  title: 'HoloKai Command Center',
  description: 'Live artifact intelligence and robotics telemetry',
};

export default function CommandCenterPage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="border-b border-zinc-800 bg-zinc-900/50 p-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          HoloKai Command Center
        </h1>
        <p className="text-zinc-400 mt-2">
          Live Artifact Intelligence Pipeline (V2.2)
        </p>
      </div>
      
      <TelemetryDashboard />
    </main>
  );
}

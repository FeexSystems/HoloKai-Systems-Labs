'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@holokai/ui'; // Assuming this exists based on the project phase
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface TelemetryData {
  timestamp: number;
  joints: Record<string, number>;
  objects: { id: string; label: string; confidence: number; bbox: number[] }[];
  status: string;
}

export function TelemetryDashboard() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In local dev, BFF runs on port 3001 typically, or via Next.js proxy
    const eventSource = new EventSource('http://localhost:4000/api/robotics/stream');

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.error) {
          setError(parsed.error);
        } else {
          setData(parsed);
          setError(null);
          
          setHistory((prev) => {
            const newHistory = [...prev, { time: new Date(parsed.timestamp * 1000).toLocaleTimeString(), ...parsed.joints }];
            return newHistory.slice(-20); // Keep last 20 ticks
          });
        }
      } catch (e) {
        console.error('Error parsing SSE data', e);
      }
    };

    eventSource.onerror = (e) => {
      setError('Connection to perception stream lost.');
      console.error('SSE Error:', e);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 w-full text-zinc-100 bg-zinc-950 min-h-screen">
      <div className="lg:col-span-2 space-y-6">
        {/* Live Vision Stream Mock */}
        <Card className="p-4 bg-zinc-900 border-zinc-800">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">Live Vision Stream (Isaac Sim WebRTC)</h2>
          <div className="relative w-full aspect-video bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center border border-zinc-700">
            {error ? (
              <span className="text-red-400">Stream Offline: {error}</span>
            ) : (
              <video 
                src="/gr00t-stream.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover opacity-80"
              />
            )}
            
            {/* Overlay bounding boxes */}
            {data?.objects.map((obj) => (
              <div
                key={obj.id}
                className="absolute border-2 border-green-500 bg-green-500/10 pointer-events-none"
                style={{
                  left: `${obj.bbox[0]}px`,
                  top: `${obj.bbox[1]}px`,
                  width: `${obj.bbox[2]}px`,
                  height: `${obj.bbox[3]}px`
                }}
              >
                <span className="absolute -top-6 left-0 bg-green-500 text-black text-xs font-bold px-1 rounded">
                  {obj.label} ({(obj.confidence * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Joint Telemetry Chart */}
        <Card className="p-4 bg-zinc-900 border-zinc-800">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">Joint State Telemetry (SONIC)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                {Object.keys(data?.joints || {}).map((joint, idx) => (
                  <Line 
                    key={joint} 
                    type="monotone" 
                    dataKey={joint} 
                    stroke={`hsl(${idx * 60}, 70%, 50%)`} 
                    dot={false}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Status Panel */}
        <Card className="p-4 bg-zinc-900 border-zinc-800">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">System Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Perception Engine</span>
              <span className={error ? "text-red-400" : "text-green-400 font-medium"}>
                {error ? "DISCONNECTED" : "ONLINE"}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Robot Status</span>
              <span className="text-zinc-200">{data?.status || 'UNKNOWN'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Detected Objects</span>
              <span className="text-zinc-200 font-mono text-lg">{data?.objects.length || 0}</span>
            </div>
          </div>
        </Card>

        {/* Knowledge Fabric Mock */}
        <Card className="p-4 bg-zinc-900 border-zinc-800 h-96 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">Knowledge Fabric</h2>
          <div className="flex-1 bg-zinc-950 rounded border border-zinc-800 p-4 font-mono text-xs text-zinc-300 overflow-y-auto">
            {(data?.objects || []).map(obj => (
              <div key={obj.id} className="mb-2">
                <span className="text-purple-400">MERGE</span> (e:Entity &#123;id: "{obj.id}"&#125;)<br/>
                <span className="text-blue-400">SET</span> e.label = "{obj.label}"<br/>
                <span className="text-blue-400">SET</span> e.confidence = {obj.confidence}<br/>
                <span className="text-green-400">WITH</span> e <span className="text-purple-400">MATCH</span> (w:World)<br/>
                <span className="text-purple-400">MERGE</span> (w)-[:CONTAINS]-&gt;(e)
                <div className="border-b border-zinc-800 my-2"></div>
              </div>
            ))}
            {(!data?.objects || data.objects.length === 0) && <div className="text-zinc-600 italic">No artifacts currently resolved in view.</div>}
          </div>
        </Card>
      </div>
    </div>
  );
}

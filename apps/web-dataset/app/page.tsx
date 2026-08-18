camera_path = Sdf.Path("camera_path = Sdf.Path("camera_path = Sdf.Path("camera_path = Sdf.Path("camera_path = Sdf.Path("camera_path = Sdf.Path("/World/OrthographicCamera")
usd_camera = UsdGeom.Camera.Define(stage, camera_path)
usd_camera.CreateProjectionAttr().Set(UsdGeom.Tokens.orthographic)
")
usd_camera = UsdGeom.Camera.Define(stage, camera_path)
usd_camera.CreateProjectionAttr().Set(UsdGeom.Tokens.perspective)

# set some other common attributes on the camera
usd_camera.CreateFocalLengthAttr().Set(35)
usd_camera.CreateHorizontalApertureAttr().Set(20.955)
usd_camera.CreateVerticalApertureAttr().Set(15.2908)
usd_camera.CreateClippingRangeAttr().Set((0.1,100000))
")
usd_camera = UsdGeom.Camera.Define(stage, camera_path)
usd_camera.CreateProjectionAttr().Set(UsdGeom.Tokens.orthographic)
")
usd_camera = UsdGeom.Camera.Define(stage, camera_path)
usd_camera.CreateProjectionAttr().Set(UsdGeom.Tokens.orthographic)
")
usd_camera = UsdGeom.Camera.Define(stage, camera_path)
usd_camera.CreateProjectionAttr().Set(UsdGeom.Tokens.orthographic)
")
usd_camera = UsdGeom.Camera.Define(stage, camera_path)
usd_camera.CreateProjectionAttr().Set(UsdGeom.Tokens.orthographic)
'use client';

import React, { useState, Suspense } from 'react';
import { DomainSearch, MFEErrorBoundary, MFELoadingSkeleton } from '@holokai/ui';

interface SearchResult {
  text: string;
  metadata: Record<string, any>;
  score: number;
}

function DatasetMFEContent() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (query: string, beastMode: boolean) => {
    console.log('Search:', query, 'Beast Mode:', beastMode);
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/api/dataset/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, top_k: 5 }),
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setResults(data.results || []);
      } else {
        setError(data.message || 'An error occurred during search.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05050a] text-white p-6 md:p-12 lg:p-24">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            HoloKai <span className="text-amber-500">Dataset Explorer</span>
          </h1>
          <p className="text-zinc-400 text-lg">
            Query the V17.1 Botanical and Medicinal Knowledge Base
          </p>
        </div>

        <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 md:p-8">
          <DomainSearch onSearch={handleSearch} />
          
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4">
            {isLoading && (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            
            {!isLoading && results.length === 0 && !error && (
              <div className="text-center py-12 text-zinc-500">
                Enter a query above to explore the knowledge base.
              </div>
            )}

            {!isLoading && results.map((result, index) => (
              <div key={index} className="bg-zinc-900 border border-white/5 p-6 rounded-xl hover:border-amber-500/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                    Score: {(result.score * 100).toFixed(1)}%
                  </span>
                  <span className="text-xs text-zinc-500">
                    Source: {result.metadata.source || 'Unknown'}
                  </span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
                  {result.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DatasetMFEPage() {
  return (
    <MFEErrorBoundary zoneName="Dataset Explorer">
      <Suspense fallback={<MFELoadingSkeleton />}>
        <DatasetMFEContent />
      </Suspense>
    </MFEErrorBoundary>
  );
}

import React, { useState } from 'react';
import { Eye, Glasses, Box } from 'lucide-react';

/**
 * WebXRArtifactViewer
 * 3D Spatial Artifact Projection supporting GLTF/GLB (WebXR) and USDZ (Apple Vision Pro / iOS QuickLook).
 */
export default function WebXRArtifactViewer({ artifact }) {
  const [arSupported, setArSupported] = useState(true);

  const sampleArtifact = artifact || {
    id: "golden-stool",
    name: "Sika Dwa Kofi (Golden Stool of Asante)",
    period: "c. 1700 CE",
    gltfUrl: "/models/golden-stool.glb",
    usdzUrl: "/models/golden-stool.usdz",
    previewImg: "/images/artifacts/golden-stool-preview.png",
    description: "Sacred throne of the Asante Kingdom encapsulating royal lineage and spiritual unity."
  };

  const launchVisionProUSDZ = () => {
    const anchor = document.createElement('a');
    anchor.rel = 'ar';
    anchor.href = sampleArtifact.usdzUrl;
    anchor.appendChild(document.createElement('img'));
    anchor.click();
  };

  return (
    <div className="my-6 p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Glasses className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-amber-100 flex items-center gap-2">
              WebXR Spatial AR Projection
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
                USDZ + GLTF
              </span>
            </h3>
            <p className="text-xs text-slate-400">Project 3D historical artifacts into physical space on Apple Vision Pro & Mobile AR</p>
          </div>
        </div>
      </div>

      {/* Artifact Preview & Launch Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
          <Box className="w-16 h-16 text-amber-500/40 animate-spin-slow" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-xs font-mono text-amber-300">
            {sampleArtifact.name} ({sampleArtifact.period})
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed font-sans">{sampleArtifact.description}</p>

          <div className="flex flex-wrap gap-3">
            {/* Apple Vision Pro & iOS QuickLook (USDZ) */}
            <button
              onClick={launchVisionProUSDZ}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-lg transition"
            >
              <Glasses className="w-4 h-4" />
              Vision Pro / iOS AR (USDZ)
            </button>

            {/* WebXR GLTF Viewer */}
            <a
              href={sampleArtifact.gltfUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs transition"
            >
              <Eye className="w-4 h-4 text-sky-400" />
              WebXR Browser (GLTF/GLB)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

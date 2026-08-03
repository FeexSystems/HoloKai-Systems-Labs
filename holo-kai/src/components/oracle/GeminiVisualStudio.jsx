import React, { useState } from 'react';
import {
  Image as ImageIcon, Sparkles, Download, RefreshCw,
  Maximize2, Sliders
} from 'lucide-react';

const SAMPLE_PROMPTS = [
  'Photorealistic 3D architectural blueprint of the Great Enclosure at Great Zimbabwe at golden hour with intricate granite masonry.',
  'Ancient Aksumite stelae obelisk engraved with Ge\'ez royal inscriptions lit by starry night sky and golden torch light.',
  'Sankore University library scroll vault in Timbuktu with astronomers examining celestial maps.',
  'Guardian avatar of Meroë Nubian pyramids surrounded by desert sands and golden jewelry.'
];

export default function GeminiVisualStudio() {
  const [prompt, setPrompt] = useState(SAMPLE_PROMPTS[0]);
  const [imageSize, setImageSize] = useState('1K'); // 1K, 2K, 4K
  const [aspectRatio, setAspectRatio] = useState('1:1'); // 1:1, 16:9, 4:3, 9:16
  const [model, setModel] = useState('gemini-3-pro-image-preview');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!prompt.trim() || generating) return;

    setGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model,
          image_size: imageSize,
          aspect_ratio: aspectRatio
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to generate image');
      }

      const data = await res.json();
      const newImg = {
        id: Date.now().toString(),
        url: data.imageUrl,
        prompt,
        size: imageSize,
        aspectRatio,
        timestamp: new Date().toLocaleTimeString()
      };

      setGeneratedImage(newImg);
      setHistory(prev => [newImg, ...prev]);

    } catch (err) {
      console.error('Image generation error:', err);
      setError(err.message || 'Image generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const downloadImage = (imgUrl, filename) => {
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = filename || `holokai-reconstruction-${imageSize}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-slate-950/80 border border-amber-500/20 rounded-xl p-6 shadow-2xl text-slate-100 backdrop-blur-md">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-100 text-lg flex items-center gap-2">
              Gemini Visual Studio
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
                gemini-3-pro-image-preview
              </span>
            </h3>
            <p className="text-xs text-slate-400">High-fidelity 3D historical reconstructions & artifact visualization</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5">
          {/* Prompt Area */}
          <div>
            <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
              Visual Reconstruction Prompt
            </label>
            <textarea
              id="visual_reconstruction_prompt"
              name="visual_reconstruction_prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Describe the architectural site, artifact, monument, or civilization scene..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition resize-none"
            />
          </div>

          {/* Preset Prompts */}
          <div>
            <span className="block text-xs text-slate-400 mb-2">Sample Archaeology Prompts:</span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(sample)}
                  className="text-left text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-300 px-2.5 py-1 rounded transition truncate max-w-full"
                >
                  {sample.slice(0, 45)}...
                </button>
              ))}
            </div>
          </div>

          {/* Size Affordance Selector (1K, 2K, 4K) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                Image Resolution (Size):
              </label>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {imageSize}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {['1K', '2K', '4K'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setImageSize(size)}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition flex flex-col items-center justify-center ${
                    imageSize === size
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-sm">{size}</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {size === '1K' ? '1024×1024' : size === '2K' ? '2048×2048' : '3840×2160'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-3">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              Aspect Ratio:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['1:1', '16:9', '4:3', '9:16'].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition ${
                    aspectRatio === ratio
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-40 text-slate-950 font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Rendering {imageSize} Reconstruction...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate {imageSize} Image</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Display Canvas Column */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-900/60 border border-slate-800 rounded-xl p-4 min-h-[420px] relative overflow-hidden">
          {generatedImage ? (
            <div className="w-full flex flex-col items-center space-y-4">
              <div className="relative group max-h-[480px] rounded-lg overflow-hidden border border-amber-500/30 shadow-2xl bg-black">
                <img
                  src={generatedImage.url}
                  alt={generatedImage.prompt}
                  className="w-full object-contain max-h-[460px] rounded-lg"
                />
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/40 text-[11px] font-mono text-amber-300 shadow">
                  {generatedImage.size} ({generatedImage.aspectRatio})
                </div>
              </div>

              <div className="flex items-center gap-3 w-full justify-between px-2">
                <p className="text-xs text-slate-400 italic truncate max-w-[70%]">
                  "{generatedImage.prompt}"
                </p>
                <button
                  onClick={() => downloadImage(generatedImage.url, `holokai-${imageSize}.png`)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download {generatedImage.size}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                <ImageIcon className="w-8 h-8" />
              </div>
              <p className="text-slate-400 text-sm font-medium">No image generated yet</p>
              <p className="text-slate-500 text-xs max-w-sm">
                Enter a historical prompt and select a resolution (1K, 2K, 4K) to render archaeological visual reconstructions.
              </p>
            </div>
          )}

          {/* History Gallery */}
          {history.length > 1 && (
            <div className="w-full mt-6 pt-4 border-t border-slate-800">
              <span className="block text-xs font-semibold text-slate-400 mb-2">Previous Renders:</span>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {history.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setGeneratedImage(img)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border transition shrink-0 ${
                      generatedImage?.id === img.id ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

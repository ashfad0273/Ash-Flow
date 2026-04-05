"use client";
import { useState } from 'react';
import { ashCompressEngine } from './utils/compressor';
import { Upload, Download, Eye, Layers, Zap } from 'lucide-react';


type CompressionLevel = 'balanced' | 'aggressive' | 'maximum';

export default function AshFlow() {
  const [results, setResults] = useState<any[]>([]);
  const [selectedFormats, setSelectedFormats] = useState(['webp']);
  const [comparing, setComparing] = useState<any>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('aggressive'); 

  const formats = ['png', 'jpeg', 'webp']; // 

  // ✅ Pass compressionLevel into the engine here
  const handleUpload = async (e: any) => {
    const rawFiles = Array.from(e.target.files) as File[];
    const allProcessed: any[] = [];

    for (const file of rawFiles) {
      const originalUrl = URL.createObjectURL(file);
      for (const format of selectedFormats) {
        const compressed = await ashCompressEngine(file, format, 0.85, compressionLevel);
        allProcessed.push({
          originalName: file.name,
          originalUrl,
          originalSize: (file.size / 1024).toFixed(2),
          compressedUrl: URL.createObjectURL(compressed),
          compressedSize: (compressed.size / 1024).toFixed(2),
          format: format.toUpperCase(),
          downloadName: compressed.name,
        });
      }
    }
    setResults([...results, ...allProcessed]);
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white p-8 md:p-20 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-7xl font-bold tracking-tighter mb-2 italic">ASH-FLOW</h1>
        <p className="text-gray-500 mb-12">Multi-Format Precision Engine</p>

        {/* Format Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {formats.map(f => (
            <button
              key={f}
              onClick={() => setSelectedFormats(prev =>
                prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
              )}
              className={`p-6 rounded-3xl border transition-all ${
                selectedFormats.includes(f)
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 border-white/10 text-gray-500'
              }`}
            >
              <Layers className="mb-2 w-5 h-5" />
              <span className="font-bold uppercase tracking-widest text-xs">{f}</span>
            </button>
          ))}
        </div>

        {/* ✅ Compression Level Selector — add this block */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {(['balanced', 'aggressive', 'maximum'] as CompressionLevel[]).map(level => (
            <button
              key={level}
              onClick={() => setCompressionLevel(level)}
              className={`p-4 rounded-2xl border transition-all flex items-center gap-2 justify-center ${
                compressionLevel === level
                  ? 'bg-white/10 border-white/40 text-white'
                  : 'bg-white/[0.02] border-white/5 text-gray-600'
              }`}
            >
              <Zap className={`w-4 h-4 ${compressionLevel === level ? 'text-green-400' : ''}`} />
              <span className="text-xs uppercase tracking-widest font-bold">{level}</span>
            </button>
          ))}
        </div>

        {/* Upload Zone */}
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 bg-white/[0.02] rounded-[2.5rem] cursor-pointer hover:bg-white/[0.05] transition-all mb-12">
          <Upload className="w-8 h-8 mb-2 text-gray-400" />
          <p className="text-gray-400 text-sm tracking-wide">
            Select images for {selectedFormats.join(' + ')} · {compressionLevel} {/* ✅ shows current level */}
          </p>
          <input type="file" multiple className="hidden" onChange={handleUpload} />
        </label>

        {/* Results */}
        <div className="space-y-4">
          {results.map((res, i) => (
            <div key={i} className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] backdrop-blur-xl">
              <div>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md text-gray-400 mr-3 uppercase">{res.format}</span>
                <span className="text-sm font-medium">{res.originalName}</span>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase italic">Reduction</p>
                  <p className="text-green-400 text-sm font-bold">
                    -{Math.round(100 - (res.compressedSize / res.originalSize * 100))}%
                  </p>
                </div>
                <button onClick={() => setComparing(res)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                  <Eye className="w-5 h-5" />
                </button>
                <a href={res.compressedUrl} download={res.downloadName} className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
                  <Download className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Modal */}
      {comparing && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl p-10 flex flex-col items-center">
          <button onClick={() => setComparing(null)} className="absolute top-10 right-10 text-white text-4xl font-light">×</button>
          <h2 className="text-2xl font-bold mb-10 tracking-tighter italic">QUALITY COMPARISON</h2>
          <div className="grid grid-cols-2 gap-10 w-full max-w-6xl flex-1 overflow-hidden">
            <div className="flex flex-col gap-4">
              <span className="text-xs uppercase tracking-widest text-gray-500">Original ({comparing.originalSize} KB)</span>
              <div className="w-full h-full rounded-3xl overflow-hidden border border-white/10">
                <img src={comparing.originalUrl} className="w-full h-full object-contain" alt="Original" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs uppercase tracking-widest text-green-500">Ash-Flow ({comparing.compressedSize} KB)</span>
              <div className="w-full h-full rounded-3xl overflow-hidden border border-white/10">
                <img src={comparing.compressedUrl} className="w-full h-full object-contain" alt="Compressed" />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
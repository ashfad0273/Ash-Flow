"use client";
import { useState } from 'react';
import { ashCompressEngine } from './utils/compressor';
import { Upload, Download, Eye, Layers, Zap, CheckCircle2 } from 'lucide-react';

type CompressionLevel = 'balanced' | 'aggressive' | 'maximum';

export default function AshFlow() {
  const [results, setResults] = useState<any[]>([]);
  const [selectedFormats, setSelectedFormats] = useState(['webp']);
  const [comparing, setComparing] = useState<any>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('maximum');
  const [isProcessing, setIsProcessing] = useState(false);

  const markAsDownloaded = (index: number) => {
    setResults(prev => prev.map((item, i) => 
      i === index ? { ...item, downloaded: true } : item
    ));
  };

  const downloadAll = () => {
    results.forEach((res, index) => {
      const link = document.createElement('a');
      link.href = res.compressedUrl;
      link.download = res.downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      markAsDownloaded(index);
    });
  };

  const formats = ['png', 'jpeg', 'webp'];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setIsProcessing(true);
    
    const rawFiles = Array.from(e.target.files);
    const allProcessed: any[] = [];

    for (const file of rawFiles) {
      const originalUrl = URL.createObjectURL(file);
      for (const format of selectedFormats) {
        try {
          // Assuming ashCompressEngine returns a File/Blob
          const compressed = await ashCompressEngine(file, format, 0.85, compressionLevel);
          allProcessed.push({
            originalName: file.name,
            originalUrl,
            originalSize: (file.size / 1024).toFixed(2),
            compressedUrl: URL.createObjectURL(compressed),
            compressedSize: (compressed.size / 1024).toFixed(2),
            format: format.toUpperCase(),
            downloadName: `ash-${file.name.split('.')[0]}.${format}`,
            downloaded: false,
          });
        } catch (error) {
          console.error("Compression failed", error);
        }
      }
    }
    setResults(prev => [...allProcessed, ...prev]);
    setIsProcessing(false);
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white p-8 md:p-20 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-7xl font-bold tracking-tighter italic">ASH-FLOW</h1>
            <p className="text-gray-500 uppercase tracking-widest text-xs mt-2">Multi-Format Precision Engine</p>
          </div>
          
          {results.length > 0 && (
            <button 
              onClick={downloadAll}
              className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              Download All ({results.length})
            </button>
          )}
        </header>

        {/* Format Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {formats.map(f => (
            <button
              key={f}
              onClick={() => setSelectedFormats(prev =>
                prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
              )}
              className={`p-6 rounded-3xl border transition-all flex flex-col items-start ${
                selectedFormats.includes(f)
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
              }`}
            >
              <Layers className="mb-2 w-5 h-5" />
              <span className="font-bold uppercase tracking-widest text-xs">{f}</span>
            </button>
          ))}
        </div>

        {/* Compression Level Selector */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {(['balanced', 'aggressive', 'maximum'] as CompressionLevel[]).map(level => (
            <button
              key={level}
              onClick={() => setCompressionLevel(level)}
              className={`p-4 rounded-2xl border transition-all flex items-center gap-2 justify-center ${
                compressionLevel === level
                  ? 'bg-white/10 border-white/40 text-white'
                  : 'bg-white/[0.02] border-white/5 text-gray-600 hover:text-gray-400'
              }`}
            >
              <Zap className={`w-4 h-4 ${compressionLevel === level ? 'text-yellow-400' : ''}`} />
              <span className="text-xs uppercase tracking-widest font-bold">{level}</span>
            </button>
          ))}
        </div>

        {/* Upload Zone */}
        <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-[2.5rem] cursor-pointer transition-all mb-12 ${
          isProcessing ? 'border-yellow-500/50 bg-yellow-500/5 animate-pulse' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
        }`}>
          <Upload className={`w-8 h-8 mb-2 ${isProcessing ? 'text-yellow-500' : 'text-gray-400'}`} />
          <p className="text-gray-400 text-sm tracking-wide">
            {isProcessing ? 'ENGINE PROCESSING...' : `Select images for ${selectedFormats.join(' + ')} · ${compressionLevel}`}
          </p>
          <input type="file" multiple className="hidden" onChange={handleUpload} disabled={isProcessing} />
        </label>

        {/* Results List */}
        <div className="space-y-4">
          {results.map((res, i) => (
            <div 
              key={i} 
              className={`flex items-center justify-between p-6 border rounded-[2rem] backdrop-blur-xl transition-all ${
                res.downloaded 
                ? 'bg-green-500/[0.03] border-green-500/20' 
                : 'bg-white/[0.03] border-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                   <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md text-gray-400 uppercase">{res.format}</span>
                   {res.downloaded && (
                     <CheckCircle2 className="w-4 h-4 text-green-500 absolute -top-3 -left-2 bg-[#080808] rounded-full" />
                   )}
                </div>
                <div>
                  <p className={`text-sm font-medium transition-colors ${res.downloaded ? 'text-green-400' : 'text-white'}`}>
                    {res.originalName}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase">{res.compressedSize} KB</p>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-8">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-gray-500 uppercase italic">Reduction</p>
                  <p className="text-green-400 text-sm font-bold">
                    -{Math.round(100 - (Number(res.compressedSize) / Number(res.originalSize) * 100))}%
                  </p>
                </div>
                
                <button 
                  onClick={() => setComparing(res)} 
                  className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                  title="Preview"
                >
                  <Eye className="w-5 h-5 text-gray-400" />
                </button>

                <a 
                  href={res.compressedUrl} 
                  download={res.downloadName} 
                  onClick={() => markAsDownloaded(i)}
                  className={`p-3 rounded-full transition-all hover:scale-110 ${
                    res.downloaded ? 'bg-green-500 text-white' : 'bg-white text-black'
                  }`}
                  title="Download"
                >
                  {res.downloaded ? <CheckCircle2 className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Modal */}
      {comparing && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl p-6 md:p-10 flex flex-col items-center">
          <button 
            onClick={() => setComparing(null)} 
            className="absolute top-6 right-6 md:top-10 md:right-10 text-white text-4xl font-light hover:rotate-90 transition-transform"
          >
            ×
          </button>
          <h2 className="text-2xl font-bold mb-10 tracking-tighter italic uppercase">Quality Comparison</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full max-w-6xl flex-1 overflow-hidden">
            <div className="flex flex-col gap-4 overflow-hidden">
              <span className="text-xs uppercase tracking-widest text-gray-500">Original ({comparing.originalSize} KB)</span>
              <div className="w-full h-full rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                <img src={comparing.originalUrl} className="w-full h-full object-contain" alt="Original" />
              </div>
            </div>
            <div className="flex flex-col gap-4 overflow-hidden">
              <span className="text-xs uppercase tracking-widest text-green-500">Ash-Flow ({comparing.compressedSize} KB)</span>
              <div className="w-full h-full rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                <img src={comparing.compressedUrl} className="w-full h-full object-contain" alt="Compressed" />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
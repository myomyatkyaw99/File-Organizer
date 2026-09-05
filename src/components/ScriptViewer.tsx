import { useState } from 'react';
import { Copy, Check, Download, Terminal, ShieldCheck, FileCheck, Layers } from 'lucide-react';
import { PYTHON_SCRIPT_CODE } from '../data';
import { downloadTextFile } from '../utils';

export function ScriptViewer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PYTHON_SCRIPT_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    downloadTextFile(PYTHON_SCRIPT_CODE, 'organize_files.py', 'text/x-python');
  };

  return (
    <div className="space-y-6">
      {/* Script Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="bg-[#0F0F12] p-5 rounded-xl border border-white/10 shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-3">
            <Terminal className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-semibold text-gray-200">Dual-Target Logging</h3>
          <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
            Uses Python&apos;s standard <code className="text-indigo-300 bg-white/5 px-1 py-0.5 rounded font-mono">logging</code> module to stream to <code className="text-gray-300 font-mono bg-white/5 px-1 py-0.5 rounded">file_organizer.log</code> and stdout.
          </p>
        </div>

        <div className="bg-[#0F0F12] p-5 rounded-xl border border-white/10 shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-semibold text-gray-200">Collision Protection</h3>
          <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
            Never overwrites existing files. Automatically increments duplicate filenames to <code className="text-gray-300 font-mono bg-white/5 px-1 py-0.5 rounded">photo_1.jpg</code>.
          </p>
        </div>

        <div className="bg-[#0F0F12] p-5 rounded-xl border border-white/10 shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-3">
            <FileCheck className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-semibold text-gray-200">Safe Self-Exclusion</h3>
          <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
            Protects the script file, log file, folders, and hidden files (<code className="text-gray-300 font-mono bg-white/5 px-1 py-0.5 rounded">.DS_Store</code>) from being moved.
          </p>
        </div>

        <div className="bg-[#0F0F12] p-5 rounded-xl border border-white/10 shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-semibold text-gray-200">Dry-Run Preview</h3>
          <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
            Pass <code className="text-indigo-300 font-mono bg-white/5 px-1 py-0.5 rounded">--dry-run</code> to audit every move and log the full plan without modifying any files.
          </p>
        </div>
      </div>

      {/* Code Container */}
      <div className="bg-[#0A0A0B] rounded-xl border border-white/10 overflow-hidden shadow-xl">
        {/* Header Bar */}
        <div className="bg-black/60 px-4 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5 mr-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <span className="text-xs font-mono font-semibold text-indigo-400">
              organize_files.py
            </span>
            <span className="text-[11px] text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">
              Python 3 Standard Library
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-copy-python-code"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-gray-200 border border-white/10 text-xs font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              id="btn-download-python-code"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Script</span>
            </button>
          </div>
        </div>

        {/* Code Block with line numbers */}
        <div className="p-4 font-mono text-xs overflow-x-auto max-h-[580px] overflow-y-auto select-text text-gray-300 leading-relaxed bg-[#0A0A0B]">
          <pre className="grid grid-cols-[3rem_1fr] gap-x-4">
            {PYTHON_SCRIPT_CODE.trim().split('\n').map((line, idx) => (
              <span key={idx} className="contents hover:bg-white/5">
                <span className="text-gray-600 text-right select-none pr-2">
                  {idx + 1}
                </span>
                <span className="whitespace-pre">{line}</span>
              </span>
            ))}
          </pre>
        </div>
      </div>

      {/* Terminal CLI Usage Guide */}
      <div className="bg-[#0F0F12] rounded-xl border border-white/10 p-5 shadow-xl space-y-3">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
          How to Run From Terminal
        </h3>
        <div className="space-y-2 text-xs font-mono">
          <div className="bg-black/40 border border-white/10 rounded-lg p-3">
            <p className="text-gray-500 mb-1 text-[11px]"># 1. Test in Dry-Run mode first (no files moved):</p>
            <p className="text-indigo-300 font-bold select-all">
              python3 organize_files.py ~/Downloads --dry-run
            </p>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-lg p-3">
            <p className="text-gray-500 mb-1 text-[11px]"># 2. Organize by Categories (Documents, Images, Audio...):</p>
            <p className="text-indigo-300 font-bold select-all">
              python3 organize_files.py ~/Downloads --mode category
            </p>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-lg p-3">
            <p className="text-gray-500 mb-1 text-[11px]"># 3. Organize by Exact Extension (PDF, JPG, PNG, MP3...):</p>
            <p className="text-indigo-300 font-bold select-all">
              python3 organize_files.py ~/Downloads --mode extension
            </p>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-lg p-3">
            <p className="text-gray-500 mb-1 text-[11px]"># 4. Check the generated log file:</p>
            <p className="text-indigo-300 font-bold select-all">
              cat ~/Downloads/file_organizer.log
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

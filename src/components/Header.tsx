import { Download, FileCode, Play, Terminal } from 'lucide-react';
import { downloadTextFile } from '../utils';
import { PYTHON_SCRIPT_CODE } from '../data';

interface HeaderProps {
  activeTab: 'simulator' | 'script' | 'config';
  setActiveTab: (tab: 'simulator' | 'script' | 'config') => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const handleDownloadScript = () => {
    downloadTextFile(PYTHON_SCRIPT_CODE, 'organize_files.py', 'text/x-python');
  };

  return (
    <header className="border-b border-white/5 bg-[#0F0F12] sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xs">
              <Terminal className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-semibold tracking-tight text-white">
                  File Organizer Script
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Python 3
                </span>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">
                File System Automator • Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-lg bg-black/40 p-1 border border-white/10 text-xs font-medium">
              <button
                id="tab-btn-simulator"
                onClick={() => setActiveTab('simulator')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'simulator'
                    ? 'bg-white/10 text-white shadow-xs font-medium'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5 text-indigo-400" />
                Live Simulator
              </button>
              <button
                id="tab-btn-script"
                onClick={() => setActiveTab('script')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'script'
                    ? 'bg-white/10 text-white shadow-xs font-medium'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                Python Script
              </button>
              <button
                id="tab-btn-config"
                onClick={() => setActiveTab('config')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'config'
                    ? 'bg-white/10 text-white shadow-xs font-medium'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Extension Rules
              </button>
            </div>

            <button
              id="btn-download-script-header"
              onClick={handleDownloadScript}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
              title="Download standalone organize_files.py script"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .py</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { InteractiveOrganizer } from './components/InteractiveOrganizer';
import { ScriptViewer } from './components/ScriptViewer';
import { CategoryConfigurator } from './components/CategoryConfigurator';
import { DEFAULT_CATEGORY_RULES, INITIAL_MOCK_FILES } from './data';
import { CategoryRule, FileItem, LogEntry } from './types';
import { Terminal, Shield, FolderCheck, Download } from 'lucide-react';
import { downloadTextFile } from './utils';
import { PYTHON_SCRIPT_CODE } from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'script' | 'config'>('simulator');
  const [files, setFiles] = useState<FileItem[]>(INITIAL_MOCK_FILES);
  const [categories, setCategories] = useState<CategoryRule[]>(DEFAULT_CATEGORY_RULES);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level: 'INFO',
      message: 'File Organizer environment initialized. Ready to organize files.',
      type: 'session_header',
    },
    {
      id: 'init-2',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level: 'INFO',
      message: 'Loaded 12 sample files. Dual logging active: stdout + file_organizer.log',
      type: 'session_header',
    },
  ]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-gray-300 flex flex-col font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* App Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner with fast context */}
        <div className="bg-[#0F0F12] border border-white/10 text-gray-300 rounded-xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Python 3.10+ Script
              </span>
              <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">
                Standard Library • Move Logger
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-white">
              Automated File Organization with Move-Level Logging
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
              Sorts messy directories into clean folders by extension or category, records every file relocation to{' '}
              <code className="text-indigo-300 font-mono text-xs bg-black/40 px-1.5 py-0.5 rounded border border-white/10">file_organizer.log</code>, and safeguards against duplicate overwrites.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('script')}
              className="px-3.5 py-2 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors shadow-2xs"
            >
              View Script Source
            </button>
            <button
              onClick={() => downloadTextFile(PYTHON_SCRIPT_CODE, 'organize_files.py', 'text/x-python')}
              className="px-3.5 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download Script
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'simulator' && (
          <InteractiveOrganizer
            files={files}
            setFiles={setFiles}
            categories={categories}
            logs={logs}
            setLogs={setLogs}
          />
        )}

        {activeTab === 'script' && <ScriptViewer />}

        {activeTab === 'config' && (
          <CategoryConfigurator
            categories={categories}
            setCategories={setCategories}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 sm:px-8 py-3.5 bg-[#0F0F12] border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[11px] text-gray-400 font-mono">Logger Active • PID: 8842</span>
            </div>
            <div className="h-3 w-px bg-white/10 hidden sm:block"></div>
            <span className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-indigo-400">
              <Terminal className="w-3 h-3" />
              python3 organize_files.py [dir] [-m category|extension] [-d]
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-gray-400">
              <Shield className="w-3 h-3 text-emerald-400" />
              Collision renaming safe
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <FolderCheck className="w-3 h-3 text-indigo-400" />
              Exclusion protection
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

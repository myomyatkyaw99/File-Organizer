import { useState } from 'react';
import { Copy, Check, Download, Trash2, Search } from 'lucide-react';
import { LogEntry } from '../types';
import { downloadTextFile } from '../utils';

interface LogViewerProps {
  logs: LogEntry[];
  onClearLogs: () => void;
  targetDirName: string;
}

export function LogViewer({ logs, onClearLogs, targetDirName }: LogViewerProps) {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fullLogText = logs.map((l) => `[${l.timestamp}] [${l.level.padEnd(7)}] ${l.message}`).join('\n');

  const filteredLogs = searchQuery
    ? logs.filter(
        (l) =>
          l.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.timestamp.includes(searchQuery)
      )
    : logs;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullLogText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadLog = () => {
    downloadTextFile(fullLogText, 'file_organizer.log', 'text/plain');
  };

  return (
    <div className="bg-[#0A0A0B] text-gray-300 rounded-xl overflow-hidden border border-white/10 shadow-xl flex flex-col h-full">
      {/* Terminal Titlebar */}
      <div className="bg-black/60 px-4 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-xs font-mono text-gray-300 ml-2 font-medium">
            file_organizer.log
          </span>
          <span className="text-[11px] font-mono bg-white/10 text-indigo-300 px-2 py-0.5 rounded border border-white/10">
            {targetDirName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/60 text-xs text-gray-200 placeholder-gray-600 pl-8 pr-2.5 py-1 rounded-lg border border-white/10 focus:outline-hidden focus:border-indigo-500/60 w-32 sm:w-44 font-mono transition-colors"
            />
          </div>

          <button
            id="btn-copy-logs"
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Copy all logs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            id="btn-download-logs"
            onClick={handleDownloadLog}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Download file_organizer.log"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            id="btn-clear-logs"
            onClick={onClearLogs}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-rose-400 transition-colors"
            title="Clear logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 font-mono text-xs overflow-y-auto space-y-1.5 max-h-[380px] min-h-[220px] select-text bg-[#0A0A0B]">
        {filteredLogs.length === 0 ? (
          <div className="text-gray-500 italic py-8 text-center">
            {logs.length === 0
              ? "Logs will stream here when 'Run File Organizer' is executed..."
              : 'No log lines matched your filter query.'}
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isMove = log.message.startsWith('MOVED:');
            const isDryRun = log.message.startsWith('[DRY-RUN]');
            const isSkip = log.message.startsWith('Skipping');
            const isHeader = log.type === 'session_header' || log.type === 'summary';

            return (
              <div
                key={log.id}
                className={`leading-relaxed break-all transition-colors ${
                  isMove
                    ? 'text-emerald-400 font-medium'
                    : isDryRun
                    ? 'text-indigo-300'
                    : isSkip
                    ? 'text-gray-500 italic'
                    : isHeader
                    ? 'text-gray-200 font-semibold'
                    : 'text-gray-300'
                }`}
              >
                <span className="text-gray-600 mr-2">[{log.timestamp}]</span>
                <span
                  className={`mr-2 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold border ${
                    log.level === 'INFO'
                      ? 'text-indigo-300 bg-indigo-500/10 border-indigo-500/25'
                      : log.level === 'WARNING'
                      ? 'text-amber-300 bg-amber-500/10 border-amber-500/25'
                      : 'text-rose-300 bg-rose-500/10 border-rose-500/25'
                  }`}
                >
                  {log.level}
                </span>
                <span>{log.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

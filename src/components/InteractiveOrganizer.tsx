import React, { useState } from 'react';
import {
  Folder,
  FolderTree,
  Play,
  RotateCcw,
  FilePlus,
  SlidersHorizontal,
  CheckCircle2,
  FolderCheck,
  FileText,
  FileImage,
  FileAudio,
  FileVideo,
  FileArchive,
  FileCode,
  File,
  ArrowRight,
  Upload,
  Info
} from 'lucide-react';
import { CategoryRule, FileItem, LogEntry } from '../types';
import { formatBytes, getFileExtension, getTargetFolder, runSimulation } from '../utils';
import { LogViewer } from './LogViewer';

interface InteractiveOrganizerProps {
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  categories: CategoryRule[];
  logs: LogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}

export function InteractiveOrganizer({
  files,
  setFiles,
  categories,
  logs,
  setLogs,
}: InteractiveOrganizerProps) {
  const [mode, setMode] = useState<'category' | 'extension'>('category');
  const [dryRun, setDryRun] = useState<boolean>(false);
  const [targetDir, setTargetDir] = useState<string>('~/Downloads/Messy_Files');
  const [viewTab, setViewTab] = useState<'all' | 'folders'>('all');
  const [isOrganizing, setIsOrganizing] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastRunStats, setLastRunStats] = useState<{
    moved: number;
    skipped: number;
    errors: number;
    dryRun: boolean;
  } | null>(null);

  // Helper to get file icon
  const getFileIcon = (ext: string) => {
    const lower = ext.toLowerCase();
    if (['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.pptx', '.csv', '.md'].includes(lower)) {
      return <FileText className="w-4 h-4 text-indigo-400" />;
    }
    if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(lower)) {
      return <FileImage className="w-4 h-4 text-purple-400" />;
    }
    if (['.mp3', '.wav', '.flac', '.aac', '.ogg'].includes(lower)) {
      return <FileAudio className="w-4 h-4 text-pink-400" />;
    }
    if (['.mp4', '.mkv', '.mov', '.avi'].includes(lower)) {
      return <FileVideo className="w-4 h-4 text-amber-400" />;
    }
    if (['.zip', '.tar', '.gz', '.7z', '.rar'].includes(lower)) {
      return <FileArchive className="w-4 h-4 text-rose-400" />;
    }
    if (['.py', '.js', '.ts', '.html', '.css', '.json', '.sql'].includes(lower)) {
      return <FileCode className="w-4 h-4 text-cyan-400" />;
    }
    return <File className="w-4 h-4 text-gray-500" />;
  };

  const handleRunOrganizer = () => {
    setIsOrganizing(true);
    
    // Simulate slight async delay for visual feedback
    setTimeout(() => {
      const result = runSimulation(files, mode, categories, dryRun, targetDir);
      
      // Update logs
      setLogs((prev) => [...result.logs, ...prev]);
      setLastRunStats({
        moved: result.movedCount,
        skipped: result.skippedCount,
        errors: result.errorCount,
        dryRun,
      });

      if (!dryRun) {
        // Apply moves to files
        setFiles((prev) =>
          prev.map((file) => {
            if (file.name.startsWith('.')) {
              return { ...file, status: 'skipped' };
            }
            const folder = getTargetFolder(file.name, mode, categories);
            return {
              ...file,
              currentFolder: folder,
              status: 'moved',
            };
          })
        );
        setViewTab('folders');
      }

      setIsOrganizing(false);
    }, 350);
  };

  const handleReset = () => {
    setFiles((prev) =>
      prev.map((f) => ({
        ...f,
        currentFolder: null,
        status: 'idle',
      }))
    );
    setLastRunStats(null);
    setViewTab('all');
  };

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const name = newFileName.trim();
    const ext = getFileExtension(name);
    const newFile: FileItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name,
      sizeBytes: Math.floor(Math.random() * 8000000) + 1024,
      extension: ext,
      originalPath: name,
      currentFolder: null,
      status: 'idle',
    };
    setFiles((prev) => [newFile, ...prev]);
    setNewFileName('');
  };

  // Drag and drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles: FileItem[] = Array.from(e.dataTransfer.files).map((f: File) => ({
        id: `drop-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: f.name,
        sizeBytes: f.size || 1024,
        extension: getFileExtension(f.name),
        originalPath: f.name,
        currentFolder: null,
        status: 'idle',
      }));
      setFiles((prev) => [...droppedFiles, ...prev]);
    }
  };

  // Group files by folder for organized view
  const groupedByFolder: Record<string, FileItem[]> = {};
  const rootFiles: FileItem[] = [];

  files.forEach((f) => {
    if (f.currentFolder) {
      if (!groupedByFolder[f.currentFolder]) {
        groupedByFolder[f.currentFolder] = [];
      }
      groupedByFolder[f.currentFolder].push(f);
    } else {
      rootFiles.push(f);
    }
  });

  const totalSize = files.reduce((acc, f) => acc + f.sizeBytes, 0);
  const movedFilesCount = files.filter((f) => f.currentFolder !== null).length;

  return (
    <div className="space-y-6">
      {/* Control Toolbar */}
      <div className="bg-[#0F0F12] rounded-xl border border-white/10 p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Target directory input */}
          <div className="flex-1 min-w-[240px]">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">
              Source Directory
            </label>
            <div className="relative">
              <Folder className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-target-dir"
                type="text"
                value={targetDir}
                onChange={(e) => setTargetDir(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-gray-200 placeholder-gray-600 focus:bg-black/60 focus:outline-hidden focus:border-indigo-500/60 transition-colors"
                placeholder="/users/admin/downloads/raw"
              />
            </div>
          </div>

          {/* Mode & Dry Run Options */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">
                Classification Mode
              </label>
              <div className="inline-flex rounded-lg bg-black/40 p-1 border border-white/10">
                <button
                  id="mode-category-btn"
                  type="button"
                  onClick={() => setMode('category')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    mode === 'category'
                      ? 'bg-indigo-600 text-white shadow-xs font-medium'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Category
                </button>
                <button
                  id="mode-extension-btn"
                  type="button"
                  onClick={() => setMode('extension')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    mode === 'extension'
                      ? 'bg-indigo-600 text-white shadow-xs font-medium'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Exact Extension
                </button>
              </div>
            </div>

            {/* Dry Run Checkbox */}
            <div className="flex flex-col justify-end">
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">
                Simulation
              </span>
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-black/40 hover:bg-white/5 cursor-pointer text-xs font-medium text-gray-300 transition-colors">
                <input
                  id="checkbox-dry-run"
                  type="checkbox"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  className="rounded border-white/20 bg-black/40 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Dry Run Mode</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-end gap-2 pt-1 lg:pt-0">
              <button
                id="btn-run-organizer"
                onClick={handleRunOrganizer}
                disabled={isOrganizing || files.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-medium text-xs shadow-md transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isOrganizing ? 'Organizing...' : dryRun ? 'Test Dry Run' : 'Run File Organizer'}</span>
              </button>

              <button
                id="btn-reset-files"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/15 text-gray-300 border border-white/10 text-xs font-medium transition-colors"
                title="Scatter files back to root"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational banner if dry run is active */}
        {dryRun && (
          <div className="mt-4 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs flex items-center gap-2.5">
            <Info className="w-4 h-4 shrink-0 text-indigo-400" />
            <span>
              <strong>Dry Run active:</strong> The script will inspect files and log all predicted destination moves without modifying or moving actual files.
            </span>
          </div>
        )}
      </div>

      {/* Directory Metrics & Quick Add */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0F0F12] p-5 rounded-xl border border-white/5 shadow-lg">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Files</p>
          <p className="text-2xl font-light text-white mt-1">{files.length}</p>
        </div>
        <div className="bg-[#0F0F12] p-5 rounded-xl border border-white/5 shadow-lg">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Success Rate</p>
          <p className="text-2xl font-light text-emerald-400 mt-1">
            {files.length > 0 ? `${Math.round((movedFilesCount / files.length) * 100)}%` : '100%'}
          </p>
        </div>
        <div className="bg-[#0F0F12] p-5 rounded-xl border border-white/5 shadow-lg">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Size</p>
          <p className="text-2xl font-light text-white mt-1">{formatBytes(totalSize)}</p>
        </div>
        <div className="bg-[#0F0F12] p-5 rounded-xl border border-white/5 shadow-lg">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Folders Created</p>
          <p className="text-2xl font-light text-indigo-400 mt-1">
            {Object.keys(groupedByFolder).length}
          </p>
        </div>
      </div>

      {/* Quick Add File & Drag & Drop Zone */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Add custom file */}
        <form
          onSubmit={handleAddFile}
          className="bg-[#0F0F12] p-4 rounded-xl border border-white/10 shadow-lg flex items-center gap-2 md:col-span-1"
        >
          <FilePlus className="w-4 h-4 text-gray-500 shrink-0" />
          <input
            id="input-custom-filename"
            type="text"
            placeholder="Add file (e.g. audit.xlsx)..."
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="flex-1 text-xs bg-black/40 text-gray-200 placeholder-gray-600 px-2.5 py-1.5 rounded-lg border border-white/10 focus:outline-hidden focus:border-indigo-500/60 font-mono"
          />
          <button
            id="btn-submit-custom-file"
            type="submit"
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Add
          </button>
        </form>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`md:col-span-2 border-2 border-dashed rounded-xl p-4 flex items-center justify-center gap-3 transition-colors ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
              : 'border-white/10 bg-[#0F0F12]/60 text-gray-400 hover:border-indigo-500/30 hover:bg-white/5'
          }`}
        >
          <Upload className="w-4 h-4 text-indigo-400" />
          <span className="text-xs">
            Drag & drop files from your computer to test organizer sorting
          </span>
        </div>
      </div>

      {/* File Explorer & View Switcher */}
      <div className="bg-[#0F0F12] rounded-xl border border-white/10 overflow-hidden shadow-xl">
        {/* Navigation Bar inside Explorer */}
        <div className="border-b border-white/10 px-5 py-3.5 bg-black/40 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
              Virtual Directory Workspace
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="view-tab-all"
              onClick={() => setViewTab('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-gray-400 hover:text-white bg-white/5 border border-white/10'
              }`}
            >
              Files List ({files.length})
            </button>
            <button
              id="view-tab-folders"
              onClick={() => setViewTab('folders')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewTab === 'folders'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-gray-400 hover:text-white bg-white/5 border border-white/10'
              }`}
            >
              Folder Hierarchy ({Object.keys(groupedByFolder).length} Folders)
            </button>
          </div>
        </div>

        {/* View 1: Flat Files List with Target Destination Preview */}
        {viewTab === 'all' && (
          <div className="divide-y divide-white/5 max-h-[340px] overflow-y-auto">
            {files.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-xs">
                No files in directory. Add one above or drop files here.
              </div>
            ) : (
              files.map((file) => {
                const targetFolder = getTargetFolder(file.name, mode, categories);
                const isHidden = file.name.startsWith('.');

                return (
                  <div
                    key={file.id}
                    className="px-5 py-2.5 flex items-center justify-between text-xs hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0">{getFileIcon(file.extension)}</div>
                      <div className="truncate">
                        <span className="font-mono text-gray-200 font-medium">{file.name}</span>
                        {isHidden && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-white/10 text-gray-400 text-[10px] uppercase font-mono">
                            Hidden (Skip)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-gray-500 font-mono text-[11px]">
                        {formatBytes(file.sizeBytes)}
                      </span>

                      {/* Destination Status */}
                      {file.currentFolder ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{file.currentFolder}/</span>
                        </span>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-gray-500 font-mono text-[11px]">
                          <span>will move to</span>
                          <ArrowRight className="w-3 h-3 text-indigo-400" />
                          <span className="font-medium text-indigo-300 bg-indigo-500/15 border border-indigo-500/25 px-2 py-0.5 rounded">
                            {targetFolder}/
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* View 2: Grouped Folder View */}
        {viewTab === 'folders' && (
          <div className="p-5">
            {Object.keys(groupedByFolder).length === 0 ? (
              <div className="py-12 text-center">
                <FolderCheck className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-300 text-xs font-medium">Files have not been organized yet.</p>
                <p className="text-gray-500 text-[11px] mt-1">
                  Click <strong className="text-indigo-400">&quot;Run File Organizer&quot;</strong> above to sort all files into folders.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {Object.entries(groupedByFolder).map(([folderName, folderFiles]) => (
                  <div
                    key={folderName}
                    className="border border-white/10 rounded-xl p-4 bg-black/40 shadow-md hover:border-indigo-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-indigo-400" />
                        <span className="font-semibold text-xs text-gray-200 font-mono">
                          {folderName}/
                        </span>
                      </div>
                      <span className="text-[10px] bg-white/10 border border-white/10 text-gray-300 px-2 py-0.5 rounded-full font-mono font-medium">
                        {folderFiles.length} {folderFiles.length === 1 ? 'file' : 'files'}
                      </span>
                    </div>

                    <div className="space-y-1 max-h-36 overflow-y-auto pl-2 border-l border-white/10">
                      {folderFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between text-[11px] text-gray-300 py-1"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            {getFileIcon(file.extension)}
                            <span className="truncate font-mono">{file.name}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 shrink-0 font-mono ml-2">
                            {formatBytes(file.sizeBytes)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Real-time Log Stream Viewer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
              Real-time Output Log
            </h2>
          </div>
          {lastRunStats && (
            <span className="text-xs text-gray-400 font-mono">
              Last Run:{' '}
              <strong className="text-emerald-400">{lastRunStats.moved} moved</strong>,{' '}
              <strong className="text-gray-400">{lastRunStats.skipped} skipped</strong>,{' '}
              <strong className="text-rose-400">{lastRunStats.errors} errors</strong>
            </span>
          )}
        </div>

        <LogViewer
          logs={logs}
          onClearLogs={() => setLogs([])}
          targetDirName={targetDir}
        />
      </div>
    </div>
  );
}

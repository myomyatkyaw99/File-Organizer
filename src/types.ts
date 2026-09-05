export interface FileItem {
  id: string;
  name: string;
  sizeBytes: number;
  extension: string;
  originalPath: string;
  currentFolder: string | null; // null = root directory
  previousFolder?: string | null;
  status: 'idle' | 'moved' | 'skipped';
}

export interface CategoryRule {
  id: string;
  name: string;
  extensions: string[];
  color: string;
  badgeBg: string;
  badgeText: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
  type: 'session_header' | 'move' | 'skip' | 'dry_run' | 'summary' | 'error';
}

export interface SimulationResult {
  movedCount: number;
  skippedCount: number;
  errorCount: number;
  logs: LogEntry[];
}

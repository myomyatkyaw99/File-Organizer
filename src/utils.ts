import { CategoryRule, FileItem, LogEntry, SimulationResult } from './types';

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === 0) return '';
  return filename.slice(lastDotIndex).toLowerCase();
}

export function getTargetFolder(
  filename: string,
  mode: 'category' | 'extension',
  categories: CategoryRule[]
): string {
  const ext = getFileExtension(filename);

  if (mode === 'extension') {
    return ext ? ext.replace('.', '').toUpperCase() : 'NO_EXTENSION';
  }

  // mode === 'category'
  if (!ext) return 'Misc';

  for (const cat of categories) {
    if (cat.extensions.includes(ext)) {
      return cat.name;
    }
  }

  return 'Other';
}

export function runSimulation(
  files: FileItem[],
  mode: 'category' | 'extension',
  categories: CategoryRule[],
  dryRun: boolean,
  targetDirName: string = '/Users/alex/Downloads'
): SimulationResult {
  const now = new Date();
  const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19);
  const logs: LogEntry[] = [];

  let movedCount = 0;
  let skippedCount = 0;
  const errorCount = 0;

  logs.push({
    id: `log-${Date.now()}-0`,
    timestamp: timestampStr,
    level: 'INFO',
    message: '=================================================================',
    type: 'session_header',
  });
  logs.push({
    id: `log-${Date.now()}-1`,
    timestamp: timestampStr,
    level: 'INFO',
    message: 'Starting File Organization Session',
    type: 'session_header',
  });
  logs.push({
    id: `log-${Date.now()}-2`,
    timestamp: timestampStr,
    level: 'INFO',
    message: `Target Directory : ${targetDirName}`,
    type: 'session_header',
  });
  logs.push({
    id: `log-${Date.now()}-3`,
    timestamp: timestampStr,
    level: 'INFO',
    message: `Organization Mode: ${mode === 'category' ? 'Category' : 'Extension'}`,
    type: 'session_header',
  });
  logs.push({
    id: `log-${Date.now()}-4`,
    timestamp: timestampStr,
    level: 'INFO',
    message: `Dry Run Mode     : ${dryRun ? 'ACTIVE (No files will be modified)' : 'OFF'}`,
    type: 'session_header',
  });
  logs.push({
    id: `log-${Date.now()}-5`,
    timestamp: timestampStr,
    level: 'INFO',
    message: `Log File Location: ${targetDirName}/file_organizer.log`,
    type: 'session_header',
  });
  logs.push({
    id: `log-${Date.now()}-6`,
    timestamp: timestampStr,
    level: 'INFO',
    message: '=================================================================',
    type: 'session_header',
  });

  // Track simulated existing names in target folders to simulate collision resolution
  const existingInFolder: Record<string, Set<string>> = {};

  // Sort files alphabetically like Python's sorted(iterdir())
  const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));

  sortedFiles.forEach((file, index) => {
    // Hidden files skip
    if (file.name.startsWith('.')) {
      skippedCount++;
      logs.push({
        id: `log-${Date.now()}-${index + 10}`,
        timestamp: timestampStr,
        level: 'INFO',
        message: `Skipping hidden file: '${file.name}'`,
        type: 'skip',
      });
      return;
    }

    const destFolder = getTargetFolder(file.name, mode, categories);
    if (!existingInFolder[destFolder]) {
      existingInFolder[destFolder] = new Set();
    }

    // Check collision
    let finalName = file.name;
    let collisionNote = '';
    if (existingInFolder[destFolder].has(finalName)) {
      const ext = getFileExtension(file.name);
      const stem = ext ? file.name.slice(0, file.name.lastIndexOf('.')) : file.name;
      let counter = 1;
      while (existingInFolder[destFolder].has(`${stem}_${counter}${ext}`)) {
        counter++;
      }
      finalName = `${stem}_${counter}${ext}`;
      collisionNote = ` (renamed to '${finalName}' to avoid collision)`;
    }
    existingInFolder[destFolder].add(finalName);

    const sizeStr = formatBytes(file.sizeBytes);

    if (dryRun) {
      movedCount++;
      logs.push({
        id: `log-${Date.now()}-${index + 10}`,
        timestamp: timestampStr,
        level: 'INFO',
        message: `[DRY-RUN] Would move '${file.name}' (${sizeStr}) -> '${destFolder}/${finalName}'${collisionNote}`,
        type: 'dry_run',
      });
    } else {
      movedCount++;
      logs.push({
        id: `log-${Date.now()}-${index + 10}`,
        timestamp: timestampStr,
        level: 'INFO',
        message: `MOVED: '${file.name}' (${sizeStr}) -> '${destFolder}/${finalName}'${collisionNote}`,
        type: 'move',
      });
    }
  });

  logs.push({
    id: `log-${Date.now()}-end1`,
    timestamp: timestampStr,
    level: 'INFO',
    message: '-----------------------------------------------------------------',
    type: 'summary',
  });
  logs.push({
    id: `log-${Date.now()}-end2`,
    timestamp: timestampStr,
    level: 'INFO',
    message: 'Organization Session Completed',
    type: 'summary',
  });
  logs.push({
    id: `log-${Date.now()}-end3`,
    timestamp: timestampStr,
    level: 'INFO',
    message: `Summary: ${movedCount} moved, ${skippedCount} skipped, ${errorCount} errors.`,
    type: 'summary',
  });
  logs.push({
    id: `log-${Date.now()}-end4`,
    timestamp: timestampStr,
    level: 'INFO',
    message: '=================================================================\n',
    type: 'summary',
  });

  return {
    movedCount,
    skippedCount,
    errorCount,
    logs,
  };
}

export function downloadTextFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

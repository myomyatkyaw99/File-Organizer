import { CategoryRule, FileItem } from './types';

export const DEFAULT_CATEGORY_RULES: CategoryRule[] = [
  {
    id: 'docs',
    name: 'Documents',
    extensions: ['.pdf', '.docx', '.doc', '.txt', '.xlsx', '.pptx', '.csv', '.md'],
    color: 'emerald',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-700',
  },
  {
    id: 'images',
    name: 'Images',
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.tiff', '.ico'],
    color: 'blue',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeText: 'text-blue-700',
  },
  {
    id: 'audio',
    name: 'Audio',
    extensions: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'],
    color: 'purple',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeText: 'text-purple-700',
  },
  {
    id: 'videos',
    name: 'Videos',
    extensions: ['.mp4', '.mkv', '.mov', '.avi', '.webm', '.flv'],
    color: 'amber',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'text-amber-700',
  },
  {
    id: 'archives',
    name: 'Archives',
    extensions: ['.zip', '.tar', '.gz', '.7z', '.rar', '.bz2'],
    color: 'rose',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeText: 'text-rose-700',
  },
  {
    id: 'code',
    name: 'Code & Data',
    extensions: ['.py', '.js', '.ts', '.html', '.css', '.json', '.sql', '.sh'],
    color: 'cyan',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    badgeText: 'text-cyan-700',
  },
  {
    id: 'executables',
    name: 'Executables',
    extensions: ['.exe', '.dmg', '.pkg', '.deb', '.apk', '.msi'],
    color: 'slate',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
    badgeText: 'text-slate-700',
  },
];

export const INITIAL_MOCK_FILES: FileItem[] = [
  {
    id: 'f1',
    name: 'Q3_Financial_Report.pdf',
    sizeBytes: 2450000,
    extension: '.pdf',
    originalPath: 'Q3_Financial_Report.pdf',
    currentFolder: null,
    status: 'idle',
  },
  {
    id: 'f2',
    name: 'vacation_sunset.jpg',
    sizeBytes: 4200000,
    extension: '.jpg',
    originalPath: 'vacation_sunset.jpg',
    currentFolder: null,
    status: 'idle',
  },
  {
    id: 'f3',
    name: 'podcast_episode_12.mp3',
    sizeBytes: 38500000,
    extension: '.mp3',
    originalPath: 'podcast_episode_12.mp3',
    currentFolder: null,
    status: 'idle',
  },
  {
    id: 'f4',
    name: 'client_presentation_final.pptx',
    sizeBytes: 15400000,
    extension: '.pptx',
    originalPath: 'client_presentation_final.pptx',
    currentFolder: null,
    status: 'idle',
  },
  {
    id: 'f5',
    name: 'project_backup_2026.zip',
    sizeBytes: 98000000,
    extension: '.zip',
    originalPath: 'project_backup_2026.zip',
    currentFolder: null,
    status: 'idle',
  },
  {
    id: 'f6',
    name: 'data_analysis_pipeline.py',
    sizeBytes: 14500,
    extension: '.py',
    originalPath: 'data_analysis_pipeline.py',
    currentFolder: null,
    status: 'idle',
  },
  {
    id: 'f7',
    name: 'product_walkthrough.mp4',
    sizeBytes: 124000000,
    extension: '.mp4',
    originalPath: 'product_walkthrough.mp4',
    currentFolder: null,
    status: 'idle',
  },
  {
    id: 'f8',
    name: 'team_roster_dataset.csv',
    sizeBytes: 450000,
    extension: '.csv',
    originalPath: 'team_roster_dataset.csv',
    currentFolder: null,
    status: 'idle',
  },
  {
    id: 'f9',
    name: 'company_logo_vector.svg',
    sizeBytes: 85000,
    extension: '.svg',
    originalPath: 'company_logo_vector.svg',
    currentFolder: null,
    status: 'idle',
  },
  {
    id: 'f10',
    name: 'installer_setup.dmg',
    sizeBytes: 74000000,
    extension: '.dmg',
    originalPath: 'installer_setup.dmg',
    currentFolder: null,
    status: 'idle',
  },
  {
    id: 'f11',
    name: '.DS_Store',
    sizeBytes: 6148,
    extension: '',
    originalPath: '.DS_Store',
    currentFolder: null,
    status: 'idle',
  },
  {
    id: 'f12',
    name: 'notes_and_ideas.txt',
    sizeBytes: 12000,
    extension: '.txt',
    originalPath: 'notes_and_ideas.txt',
    currentFolder: null,
    status: 'idle',
  },
];

export const PYTHON_SCRIPT_CODE = `#!/usr/bin/env python3
"""
File Organizer Script
=====================
Organizes files in a directory into folders based on their file extension or category,
with comprehensive logging for each move to both a dedicated log file and the console.

Usage:
  python organize_files.py [directory] [--mode {category,extension}] [--dry-run] [--log-file PATH]
"""

import os
import shutil
import logging
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple

DEFAULT_CATEGORIES: Dict[str, List[str]] = {
    "Documents": [".pdf", ".docx", ".doc", ".txt", ".rtf", ".odt", ".xlsx", ".xls", ".csv", ".pptx", ".ppt", ".md"],
    "Images": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp", ".tiff", ".ico"],
    "Audio": [".mp3", ".wav", ".aac", ".flac", ".ogg", ".m4a"],
    "Videos": [".mp4", ".mkv", ".mov", ".avi", ".wmv", ".flv", ".webm"],
    "Archives": [".zip", ".tar", ".gz", ".7z", ".rar", ".bz2"],
    "Code & Data": [".py", ".js", ".ts", ".html", ".css", ".json", ".xml", ".sql", ".sh"],
    "Executables": [".exe", ".msi", ".apk", ".deb", ".rpm", ".dmg", ".pkg"]
}


def setup_logger(log_file_path: Path) -> logging.Logger:
    """Configures formatted dual-target logging (file + console)."""
    logger = logging.getLogger("FileOrganizer")
    logger.setLevel(logging.INFO)
    logger.handlers.clear()

    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)-7s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    file_handler = logging.FileHandler(log_file_path, mode="a", encoding="utf-8")
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    return logger


def get_destination_folder_name(file_path: Path, mode: str, categories: Dict[str, List[str]]) -> str:
    """Calculates target folder name by category or extension."""
    ext = file_path.suffix.lower()
    if mode == "extension":
        return ext.lstrip(".").upper() if ext else "No_Extension"
    
    if not ext:
        return "Misc"

    for category, extensions in categories.items():
        if ext in extensions:
            return category
    return "Other"


def get_unique_destination_path(target_path: Path) -> Path:
    """Prevents file overwriting by incrementing filename (e.g., photo_1.jpg)."""
    if not target_path.exists():
        return target_path

    parent = target_path.parent
    stem = target_path.stem
    suffix = target_path.suffix
    counter = 1

    while True:
        candidate = parent / f"{stem}_{counter}{suffix}"
        if not candidate.exists():
            return candidate
        counter += 1


def format_size(num_bytes: int) -> str:
    """Returns human-readable size string."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if abs(num_bytes) < 1024.0:
            return f"{num_bytes:3.1f} {unit}"
        num_bytes /= 1024.0
    return f"{num_bytes:.1f} TB"


def organize_directory(
    target_dir: str,
    mode: str = "category",
    dry_run: bool = False,
    log_file_name: str = "file_organizer.log",
    categories: Dict[str, List[str]] = None
) -> Tuple[int, int, int]:
    """Organizes files in target directory and logs each move."""
    if categories is None:
        categories = DEFAULT_CATEGORIES

    directory = Path(target_dir).resolve()
    if not directory.exists() or not directory.is_dir():
        print(f"Error: Directory '{target_dir}' does not exist.")
        return (0, 0, 1)

    log_path = directory / log_file_name
    logger = setup_logger(log_path)

    logger.info("=" * 65)
    logger.info("Starting File Organization Session")
    logger.info(f"Target Directory : {directory}")
    logger.info(f"Organization Mode: {mode.title()}")
    logger.info(f"Dry Run Mode     : {'ACTIVE (No files touched)' if dry_run else 'OFF'}")
    logger.info(f"Log File Location: {log_path}")
    logger.info("=" * 65)

    moved_count, skipped_count, error_count = 0, 0, 0
    current_script_path = Path(__file__).resolve() if "__file__" in globals() else None

    try:
        entries = list(directory.iterdir())
    except Exception as e:
        logger.error(f"Failed to read directory: {e}")
        return (0, 0, 1)

    for item in sorted(entries, key=lambda p: p.name.lower()):
        if item.is_dir():
            continue
        if item.resolve() == log_path.resolve():
            continue
        if current_script_path and item.resolve() == current_script_path:
            logger.info(f"Skipping script file: {item.name}")
            skipped_count += 1
            continue
        if item.name.startswith("."):
            logger.info(f"Skipping hidden file: {item.name}")
            skipped_count += 1
            continue

        dest_folder_name = get_destination_folder_name(item, mode, categories)
        dest_folder_path = directory / dest_folder_name
        dest_file_path = dest_folder_path / item.name

        try:
            size_str = format_size(item.stat().st_size)
        except Exception:
            size_str = "Unknown size"

        final_dest_path = get_unique_destination_path(dest_file_path)
        renamed_notice = f" (renamed to '{final_dest_path.name}')" if final_dest_path != dest_file_path else ""

        if dry_run:
            logger.info(f"[DRY-RUN] Would move '{item.name}' ({size_str}) -> '{dest_folder_name}/{final_dest_path.name}'{renamed_notice}")
            moved_count += 1
            continue

        try:
            dest_folder_path.mkdir(parents=True, exist_ok=True)
            shutil.move(str(item), str(final_dest_path))
            logger.info(f"MOVED: '{item.name}' ({size_str}) -> '{dest_folder_name}/{final_dest_path.name}'{renamed_notice}")
            moved_count += 1
        except Exception as e:
            logger.error(f"ERROR moving '{item.name}': {e}")
            error_count += 1

    logger.info("-" * 65)
    logger.info(f"Session Completed: {moved_count} moved, {skipped_count} skipped, {error_count} errors.")
    logger.info("=" * 65 + "\\n")
    return (moved_count, skipped_count, error_count)


def parse_args():
    parser = argparse.ArgumentParser(description="Organize files by extension with detailed move logging.")
    parser.add_argument("directory", nargs="?", default=".", help="Directory to organize (default: current dir)")
    parser.add_argument("-m", "--mode", choices=["category", "extension"], default="category", help="Grouping mode")
    parser.add_argument("-d", "--dry-run", action="store_true", help="Simulate without moving files")
    parser.add_argument("-l", "--log-file", default="file_organizer.log", help="Log filename")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    organize_directory(args.directory, mode=args.mode, dry_run=args.dry_run, log_file_name=args.log_file)
`;

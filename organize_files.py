#!/usr/bin/env python3
"""
File Organizer Script
=====================
Organizes files in a directory into folders based on their file extension or category,
with comprehensive logging to both a dedicated log file and the console.

Features:
- Organizes by file category (e.g. Images, Documents) or by exact extension (e.g. PDF, JPG).
- Robust logging with timestamps, file paths, sizes, and collision handling.
- Handles filename collisions safely by appending an incremental counter (e.g., photo_1.jpg).
- Safe skips: ignores the script itself, the log file, hidden files (starting with .),
  and existing destination folders.
- Dry-run mode (`--dry-run`) to preview actions without moving any files.
- Command-line interface with customizable arguments.
"""

import os
import shutil
import logging
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple

# Default extension categories mapping
DEFAULT_CATEGORIES: Dict[str, List[str]] = {
    "Documents": [
        ".pdf", ".docx", ".doc", ".txt", ".rtf", ".odt", ".pages",
        ".xlsx", ".xls", ".csv", ".tsv", ".pptx", ".ppt", ".key",
        ".epub", ".mobi"
    ],
    "Images": [
        ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".tif",
        ".svg", ".webp", ".heic", ".raw", ".cr2", ".nef", ".ico"
    ],
    "Audio": [
        ".mp3", ".wav", ".aac", ".flac", ".ogg", ".m4a", ".wma",
        ".aiff", ".alac", ".opus"
    ],
    "Videos": [
        ".mp4", ".mkv", ".mov", ".avi", ".wmv", ".flv", ".webm",
        ".m4v", ".3gp", ".mpeg", ".mpg"
    ],
    "Archives": [
        ".zip", ".tar", ".gz", ".tgz", ".bz2", ".7z", ".rar",
        ".xz", ".iso", ".dmg"
    ],
    "Code & Data": [
        ".py", ".js", ".ts", ".jsx", ".tsx", ".html", ".css",
        ".scss", ".json", ".xml", ".yaml", ".yml", ".sql", ".c",
        ".cpp", ".h", ".cs", ".java", ".go", ".rs", ".php", ".sh"
    ],
    "Executables & Installers": [
        ".exe", ".msi", ".apk", ".deb", ".rpm", ".pkg", ".appimage"
    ]
}


def setup_logger(log_file_path: Path) -> logging.Logger:
    """
    Configures a logger that logs to both a file and standard output.
    """
    logger = logging.getLogger("FileOrganizer")
    logger.setLevel(logging.INFO)
    logger.handlers.clear()  # Prevent duplicate handlers if re-initialized

    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)-7s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # File Handler
    try:
        file_handler = logging.FileHandler(log_file_path, mode="a", encoding="utf-8")
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    except Exception as err:
        print(f"Warning: Could not setup log file at {log_file_path}: {err}")

    # Console Handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    return logger


def get_destination_folder_name(file_path: Path, mode: str, categories: Dict[str, List[str]]) -> str:
    """
    Determines the destination folder name based on the chosen mode ('category' or 'extension').
    """
    ext = file_path.suffix.lower()
    
    if mode == "extension":
        if not ext:
            return "No_Extension"
        # Return clean extension name (e.g., 'pdf', 'png')
        return ext.lstrip(".").upper()
    
    # Mode is 'category'
    if not ext:
        return "Misc"

    for category, extensions in categories.items():
        if ext in extensions:
            return category

    return "Other"


def get_unique_destination_path(target_path: Path) -> Path:
    """
    If target_path already exists, generates a non-conflicting filename
    by appending an incremental counter: 'filename_1.ext', 'filename_2.ext', etc.
    """
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


def organize_directory(
    target_dir: str,
    mode: str = "category",
    dry_run: bool = False,
    log_file_name: str = "file_organizer.log",
    categories: Dict[str, List[str]] = None
) -> Tuple[int, int, int]:
    """
    Organizes files in the specified directory and logs all actions.
    
    Returns:
        Tuple of (files_moved, files_skipped, errors_count)
    """
    if categories is None:
        categories = DEFAULT_CATEGORIES

    directory = Path(target_dir).resolve()
    if not directory.exists() or not directory.is_dir():
        print(f"Error: Target directory '{target_dir}' does not exist or is not a directory.")
        return (0, 0, 1)

    log_path = directory / log_file_name
    logger = setup_logger(log_path)

    logger.info("=" * 65)
    logger.info("Starting File Organization Session")
    logger.info(f"Target Directory : {directory}")
    logger.info(f"Organization Mode: {mode.title()}")
    logger.info(f"Dry Run Mode     : {'ACTIVE (No files will be modified)' if dry_run else 'OFF'}")
    logger.info(f"Log File Location: {log_path}")
    logger.info("=" * 65)

    moved_count = 0
    skipped_count = 0
    error_count = 0

    # Self-protection: script itself and log file should never be moved
    current_script_path = Path(__file__).resolve() if "__file__" in globals() else None

    # List items in the target directory (only top-level files by default)
    try:
        entries = list(directory.iterdir())
    except Exception as e:
        logger.error(f"Failed to read directory '{directory}': {e}")
        return (0, 0, 1)

    for item in sorted(entries, key=lambda p: p.name.lower()):
        # Skip directories
        if item.is_dir():
            continue

        # Skip the log file
        if item.resolve() == log_path.resolve():
            continue

        # Skip this script itself
        if current_script_path and item.resolve() == current_script_path:
            logger.info(f"Skipping script file: {item.name}")
            skipped_count += 1
            continue

        # Skip hidden files (like .DS_Store, .gitignore)
        if item.name.startswith("."):
            logger.info(f"Skipping hidden file: {item.name}")
            skipped_count += 1
            continue

        dest_folder_name = get_destination_folder_name(item, mode, categories)
        dest_folder_path = directory / dest_folder_name
        dest_file_path = dest_folder_path / item.name

        # Calculate file size for informative logging
        try:
            file_size_bytes = item.stat().st_size
            file_size_str = format_size(file_size_bytes)
        except Exception:
            file_size_str = "Unknown size"

        # Resolve filename collisions
        final_dest_path = get_unique_destination_path(dest_file_path)
        renamed_notice = f" (renamed to '{final_dest_path.name}' to avoid collision)" if final_dest_path != dest_file_path else ""

        if dry_run:
            logger.info(
                f"[DRY-RUN] Would move '{item.name}' ({file_size_str}) -> '{dest_folder_name}/{final_dest_path.name}'{renamed_notice}"
            )
            moved_count += 1
            continue

        try:
            # Create destination folder if it doesn't exist
            dest_folder_path.mkdir(parents=True, exist_ok=True)

            # Move file
            shutil.move(str(item), str(final_dest_path))
            logger.info(
                f"MOVED: '{item.name}' ({file_size_str}) -> '{dest_folder_name}/{final_dest_path.name}'{renamed_notice}"
            )
            moved_count += 1
        except Exception as e:
            logger.error(f"ERROR moving '{item.name}': {e}")
            error_count += 1

    logger.info("-" * 65)
    logger.info("Organization Session Completed")
    logger.info(f"Summary: {moved_count} moved, {skipped_count} skipped, {error_count} errors.")
    logger.info("=" * 65 + "\n")

    return (moved_count, skipped_count, error_count)


def format_size(num_bytes: int) -> str:
    """Formats bytes into human-readable unit string."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if abs(num_bytes) < 1024.0:
            return f"{num_bytes:3.1f} {unit}"
        num_bytes /= 1024.0
    return f"{num_bytes:.1f} TB"


def parse_args():
    parser = argparse.ArgumentParser(
        description="Organize files in a folder by their extension or category with detailed logging."
    )
    parser.add_argument(
        "directory",
        nargs="?",
        default=".",
        help="Path to the directory to organize (default: current directory)"
    )
    parser.add_argument(
        "-m", "--mode",
        choices=["category", "extension"],
        default="category",
        help="Organization mode: 'category' (e.g. Images, Documents) or 'extension' (e.g. PDF, JPG) (default: category)"
    )
    parser.add_argument(
        "-d", "--dry-run",
        action="store_true",
        help="Simulate the organization and write logs without moving any actual files"
    )
    parser.add_argument(
        "-l", "--log-file",
        default="file_organizer.log",
        help="Name or path for the log file (default: file_organizer.log in target directory)"
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    organize_directory(
        target_dir=args.directory,
        mode=args.mode,
        dry_run=args.dry_run,
        log_file_name=args.log_file
    )

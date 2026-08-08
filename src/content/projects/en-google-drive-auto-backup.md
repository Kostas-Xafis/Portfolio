---
slug: google-drive-auto-backup
lang: en
title: Google Drive Auto Backup
summary: An incremental backup CLI for Google Drive with glob exclusions, conflict-aware relocation detection and no re-uploading of unchanged files.
category: extensions
stack: [TypeScript, googleapis, OAuth2, micromatch]
status: maintained
year: 2025
featured: true
links:
  repo: https://github.com/Kostas-Xafis/Google-Drive-Auto-Backup
---

## Overview

Backing up a folder to Google Drive should be a diff, not a re-upload. This CLI implements incremental backups with file and folder exclusions, preserving remote/local structure and skipping unchanged files entirely.

## What I built

The core data structure is an in-memory `FileNode` tree built from the local filesystem and diffed against Drive. Conflict resolution detects relocations instead of delete-and-reupload: a 0.6 relocation-frequency threshold decides whether a Drive folder is the same folder that moved. Modification times drive change detection, and Drive folder/file IDs are persisted in `backupFile.json` so unchanged files are never re-uploaded.

Exclusions are glob patterns keyed by absolute path or a `*` global, pruned from the tree with `micromatch`. Uploads run in parallel with throughput limiting, MIME types come from a bundled mapping, and the CLI offers clean progress output (`cli-progress`). A `setup.bat` wires backups into Windows Task Scheduler at HOURLY/DAILY/WEEKLY/MONTHLY cadence, and a download mode restores remote state.

## Technical highlights

- Tree-based diffing with relocation-frequency conflict resolution
- Glob exclusion pruning per backup or globally
- Persisted IDs and modification times: zero re-uploads of unchanged files
- Scheduled runs and restore mode

## Outcome

Runs unattended on schedule; the diffing logic means only real changes ever touch the API.

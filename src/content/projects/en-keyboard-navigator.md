---
slug: keyboard-navigator
lang: en
title: KeyboardNavigator
summary: A Manifest V3 browser extension for keyboard-first browsing — an activation shortcut tags every reachable element with a two-set combo for instant navigation.
category: extensions
stack: [TypeScript, Chrome Extension MV3, Vite]
status: maintained
year: 2024
featured: false
links:
  repo: https://github.com/Kostas-Xafis/KeyboardNavigator
---

## Overview

A browser extension that lets you navigate any page without touching the mouse: press the activation shortcut (default Ctrl+Space), and every tabbable element is tagged with a short combo you can type to jump straight to it.

## What I built

The combo engine is a two-set system: pick two character sets (say A–Z × 0–9), and combos are `set1 × set2 × (set1+set2+1)` — 360 combos for a 6×5 pairing, all derivable by reading the badge. The content script maintains chord state (`{0: key, 1: key, pressed}`) and injects CSS badges dynamically.

The interesting engineering is visibility detection: a `FocusableElements` filter checks `tabIndex`, disabled state, viewport bounds and ancestor visibility, and an `InvisibleElements` detector reads computed styles (`display:none`, `visibility:hidden`, opacity ≤ 0.1) with a Set-based implementation — so the extension tags what is actually on screen, not every DOM node.

The project uses Vite with two separate build configs (content script vs popup), storage-driven configuration with live updates via `chrome.storage.onChanged`, and a popup UI with shortcut recorder and theme controls.

## Technical highlights

- Two-set chord combinatorics with badge-driven UI
- Computed-style visibility analysis, performance-conscious
- Dual-bundle Vite build and storage-driven live configuration

## Outcome

A polished MV3 extension; the badge system made it usable on real pages immediately.

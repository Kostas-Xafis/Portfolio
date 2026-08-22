---
slug: workscheduling
lang: en
cover: workscheduling.webp
title: WorkScheduling
summary: A constraint-aware monthly shift scheduler for a six-person team that balances fairness counters and exports a polished landscape A4 PDF roster.
category: fullstack
stack: [Bun, TypeScript, Puppeteer, PDF]
status: maintained
year: 2026
featured: false
links:
  repo: https://github.com/Kostas-Xafis/WorkScheduling
---

## Overview

A monthly shift scheduler that auto-assigns 24-hour duties, 8-hour shifts and day-offs for a six-person team, then exports a color-coded landscape A4 PDF schedule.

## What I built

The assignment logic is a constraint-solving routine: weekdays must have exactly four staff on duty (two duty types plus fillers), weekends only 24-hour workers, no back-to-back 24-hour shifts, with hard `full` restrictions (forced day off) and `evening` restrictions (no 24-hour duty). Fairness counters — 24h duties, weekend duties, 8h shifts, day-offs — are balanced across the month.

Tie-breaking is handled by a hand-rolled seedable PRNG (Mulberry32), so a given seed produces deterministic, reproducible schedules. Config lives in `work.json`.

Rendering uses Puppeteer to produce the PDF roster: color-coded cells for the two 24-hour duty types, 8-hour shifts and day-offs, with a legend, in landscape A4.

## Technical highlights

- Constraint and fairness-balanced distribution across all shift types
- Deterministic seeded randomness for reproducible output
- Professional PDF output via headless Chromium

## Outcome

Generates the monthly roster for the team; the exported PDF is printed and posted.

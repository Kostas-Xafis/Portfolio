---
slug: byz-pdfworker
lang: en
title: Byz-PdfWorker
summary: A type-safe PDF-generation microservice that fills official Byzantine music school registration forms, embeds custom fonts, merges batches and authenticates callers.
category: fullstack
stack: [Bun, TypeScript, pdf-lib, fontkit, Docker]
status: maintained
year: 2025
featured: false
links:
  repo: https://github.com/Kostas-Xafis/Byz-PdfWorker
---

## Overview

A PDF microservice for the Byzantine music school ecosystem: it receives registration data and fills the school's official registration-form PDF template — a job too finicky to do reliably on the main platform.

## What I built

A POST-only JSON API on `Bun.serve`. It fills ~25 fields of the official template (student details, teacher, academic year with a smart September-boundary rule, instrument variants) at hardcoded template coordinates — a coordinate system that required mirroring the PDF's bottom-left origin. The DidactGothic font is embedded via fontkit, and both font and template buffers are cached in static fields across requests.

Batch requests merge many filled forms into a single PDF via `copyPages`/`addPage`. Request models are typed with shared discriminated unions.

Security mirrors the ecosystem pattern: CORS preflight handling, a referer allowlist for the two permitted origins, and Bearer-token authentication validated by proxying the session to the school backend's auth endpoint.

## Technical highlights

- Pixel-coordinate template filling with custom font embedding (fontkit)
- Single- and multi-student PDF output (document merging)
- Static caching of network-fetched templates and fonts
- Referer allowlisting plus session-proxy authentication
- Multi-stage Docker build on `oven/bun`

## Outcome

Runs as a Docker service alongside the school platform, invoked by the registration flow.

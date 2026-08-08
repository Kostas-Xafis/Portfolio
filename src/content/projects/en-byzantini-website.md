---
slug: byzantini-website
lang: en
title: Byzantine Music School Platform
summary: A production full-stack platform for a Byzantine music school — public site, registrations, teacher and book management, payments, and an admin panel, on Cloudflare Pages with a typed Valibot API.
category: fullstack
stack: [Astro 5, SolidJS, TypeScript, Tailwind CSS, Turso, libSQL, Cloudflare Pages, R2, Arctic, Valibot]
status: production
year: 2026
featured: true
links:
  repo: https://github.com/Kostas-Xafis/byzantini-website
---

## Overview

A full-stack platform operated by a Byzantine music school: public pages for the school, its teachers and study locations, a student registration system (with class, teacher and instrument assignment), book inventory, payments and payoffs, announcements, and a complete admin panel.

## What I built

The architecture mirrors what I built for Isokratis, refined: every API endpoint is defined as a `.client.ts` contract — path, method, Valibot schema and middleware flags — implemented in a `.server.ts` module, and routed through a single catch-all endpoint. Middleware (authentication, validation, multipart) is injected automatically from the contract flags, and the frontend consumes it fully typed via `useAPI("Authentication.userLogin", payload)`.

Persistence uses Turso (libSQL) in production with a snapshot-replication workflow: `replicate.ts` produces dated SQL snapshots for a local dev database. Files go to Cloudflare R2. Google OAuth uses the `arctic` library with PKCE; passwords are salted SHA-256 hashes.

The system was designed around a set of companion microservices — PDF generation, image compression, automated emails — each a separate service wired to this platform, forming a coherent deployment.

## Technical highlights

- Typed contract-driven API with automatic middleware injection (14 route groups)
- Admin panel with registrations, books, payments, payoffs, teachers and totals
- Turso/libSQL with snapshot-based dev replication; legacy MySQL schema preserved
- Google OAuth (PKCE), httpOnly session cookies, invite-based admin signup
- R2 object storage with S3-compatible dev endpoint
- `bun test` suite with endpoint-hash caching that skips unchanged tests

## Outcome

In production for the school, integrated with the PDF, compression and mailing services.

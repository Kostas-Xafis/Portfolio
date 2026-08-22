---
slug: callcenter
lang: en
cover: callcenter.webp
title: CallCenter Directory
summary: A self-hosted Bun + SQLite directory of ~1,000 phone records with a hand-rolled fuzzy-search engine, Greek keyboard-layout support and IndexedDB caching.
category: fullstack
stack: [Bun, TypeScript, SQLite, IndexedDB, Service Worker]
status: maintained
year: 2026
featured: false
links:
  repo: https://github.com/Kostas-Xafis/CallCenter
---

## Overview

A phone-records directory for a call center: fast search across ~1,000 records, Excel import, and admin tooling. Originally deployed on Cloudflare Workers + D1, it was later migrated to a fully self-hosted Bun HTTP server with SQLite.

## What I built

The REST API is built directly on `Bun.serve` with a route registry — no framework. Search is a custom client-side fuzzy matcher written from scratch, including a Greek keyboard-layout mapping so accented Greek text can be typed on a Latin layout and still match.

The client is a vanilla SPA backed by IndexedDB: records are cached locally and served instantly, with server-side content-fingerprint (`GET /api/records/hash`) driving hash-based cache invalidation. A service worker with a versioned cache makes it a PWA.

Auth uses HttpOnly cookies with PBKDF2/SHA-256 (100k iterations), and access is role-based: admins can create invitations, bulk-upload `.xlsx` files to replace records, and view stats; users get read access.

## Technical highlights

- Hand-rolled fuzzy search with Greek keyboard-layout normalization
- IndexedDB caching with content-hash invalidation (no stale cache, no refetch)
- Session auth with strong key derivation, RBAC, invite-only signup
- SQL migrations (`0001`–`0008`) and CLI scripts for user creation and cache invalidation

## Outcome

In daily use by the call center; migrated from Workers to self-hosted without downtime.

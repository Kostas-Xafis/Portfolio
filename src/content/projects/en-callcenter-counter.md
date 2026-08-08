---
slug: callcenter-counter
lang: en
title: CallCenterCounter
summary: A Cloudflare Workers + D1 app where call-center agents log their personal call counts, with charts, invite-only signup and a production call window.
category: fullstack
stack: [Astro 5, Cloudflare Workers, D1, Wrangler, TypeScript]
status: production
year: 2026
featured: false
links:
  repo: https://github.com/Kostas-Xafis/CallCenterCounter
---

## Overview

Call-center agents sign in, increment their personal incoming-call counter with one tap, remove the last entry when a call gets misattributed, and view personal and team statistics with charts.

## What I built

Built on Astro 5 with the Cloudflare adapter, with API routes split between Astro SSR pages and a Worker handler (`src/index.ts`): login/logout/me, `calls/increment`, `calls/remove-last`, stats with `scope=user|total`, admin invites and signup verification.

Authentication uses HttpOnly sessions with SHA-256 password hashing plus an `AUTH_PEPPER` secret. Signup is invite-only: the owner generates one-time invite links that expire after 5 days and are cleaned up automatically. Production enforces a call window (07:00–14:30 GMT+2), which is disabled in dev.

## Technical highlights

- D1 schema: `users`, `sessions`, `calls`, `signup_invites` with hashed tokens and expiry
- Expiring invite-link signup flow gating access
- Personal and global stats scoped via SQL, charted client-side
- Call-window enforcement in production only

## Outcome

Deployed and in daily use at the call center.

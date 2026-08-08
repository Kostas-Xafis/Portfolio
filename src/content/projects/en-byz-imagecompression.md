---
slug: byz-imagecompression
lang: en
title: Byz-ImageCompression
summary: A Bun + sharp microservice that compresses uploaded images to a fixed ~40 KB budget using metadata-driven dimension scaling.
category: fullstack
stack: [Bun, TypeScript, sharp, Docker]
status: maintained
year: 2024
featured: false
links:
  repo: https://github.com/Kostas-Xafis/Byz-ImageCompression
---

## Overview

The school platform needed every uploaded image to reach web-ready size without manual intervention. This microservice guarantees a fixed target: roughly 40 KB per image.

## What I built

A single POST endpoint on `Bun.serve` using `sharp` (libvips). The logic reads image metadata first: if the source is already within budget it is returned as-is; otherwise a shrink factor is computed from the file size (`sqrt(size/40KB)/2`), halving each dimension to quarter the pixel area, and the image is resized and re-encoded.

It shares the ecosystem's security pattern: CORS preflight, referer allowlist, and session-proxy authentication against the school backend — plus the same typed `EndpointResponse` union as its sibling services, so all three services speak the same API language.

## Technical highlights

- Budget-driven proportional downscaling math, not fixed dimensions
- Metadata-first fast path that avoids re-encoding already-small images
- Consistent auth and typed-response patterns across the microservice family

## Outcome

Runs in Docker alongside the school platform, called on upload.

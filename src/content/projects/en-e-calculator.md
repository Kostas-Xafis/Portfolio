---
slug: e-calculator
lang: en
cover: e-calculator.webp
title: E-Calculator
summary: "An iterative performance-engineering diary in C: eleven implementations of Euler's constant, ending at one billion digits in ~2.8 hours on a laptop via binary splitting, GMP and task-queue multithreading."
category: systems
stack: [C, GMP, pthreads, Makefile]
status: maintained
year: 2022
featured: true
links:
  repo: https://github.com/Kostas-Xafis/E-Calculator
---

## Overview

Compute Euler's constant e to as many digits as possible, as fast as possible. Eleven evolving implementations document a long performance journey: from a naive baseline to a fully parallel GMP engine.

## What I built

The math: e is the sum of reciprocal factorials, computed with GMP arbitrary-precision integers so only integer multiply/add operations are needed. The algorithm: **binary splitting** — a divide-and-conquer factorial product (`Q_F(a,b)`) that splits the series into parallelizable chunks, with split lengths tuned between 2^15 and 2^18.

The parallelism evolved through four designs — multithreaded, semi-multithreaded, SM+ (v9), and full multithreading (v10+): a work-queue architecture (`numQueue`, `bsfQueue`, `resQueue`) with dynamically tuned thread counts over a recompiled GCC with a machine-optimized GMP build.

Verification is not an afterthought: a JavaScript digit-checker diffs the output against reference digits from numberworld.org, and an experimental JS FFT module (TypeScript + Jest) was explored along the way.

## Technical highlights

- Binary splitting with tuned chunk sizes for near-linear scaling
- Progressive multithreading through four designs, culminating in task queues
- Honest, versioned benchmarks: 1M digits in 484 ms, 10M in 6 s, 100M in 3 min 20 s — 1 billion in ~168 minutes on a Ryzen 3500U laptop

## Outcome

One billion digits of e, computed on a laptop, with the entire engineering trail committed to the repository.

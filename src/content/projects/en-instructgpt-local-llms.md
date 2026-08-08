---
slug: instructgpt-local-llms
lang: en
title: Local LLM Experiments
summary: Hands-on experiments with quantized open-source LLMs — Llama 3.2 and Aya via llama-cpp — covering prompt variety, sampling parameters and embedding similarity.
category: ml
stack: [Python, llama-cpp-python, Hugging Face, GGUF, scikit-learn]
status: academic
year: 2025
featured: false
links:
  repo: https://github.com/Kostas-Xafis/InstructGPT
---

## Overview

An investigation of local, quantized instruction-tuned models — no API calls, everything running on the machine. Models: Llama-3.2-3B-Instruct and aya-expanse-8b as GGUF files downloaded from the Hugging Face Hub.

## What I built

A CLI with four modes: plain Q&A, varied question sets, alternative responses at different temperature/top-p settings, and embedding-similarity analysis as a bonus exercise. Prompts were tested bilingually (English and Greek) to probe how instruction-tuned models handle code-switching, and an optional `--log` flag persists every response for review.

## Technical highlights

- GGUF quantization workflow (Q4_K_M) with llama-cpp-python
- Controlled sampling-parameter exploration
- Embedding-based cosine-similarity analysis over responses
- Bilingual prompt evaluation

## Outcome

Practical working knowledge of running and probing open-weight models locally.

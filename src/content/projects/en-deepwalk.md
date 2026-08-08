---
slug: deepwalk
lang: en
title: DeepWalk from Scratch
summary: A from-scratch PyTorch implementation of DeepWalk — random walks over the Karate Club graph fed into a CBOW embedding model, with full hyperparameter grid search and t-SNE evaluation.
category: ml
stack: [Python, PyTorch, networkx, scikit-learn]
status: academic
year: 2025
featured: false
links:
  repo: https://github.com/Kostas-Xafis/Deepwalk
---

## Overview

An implementation of the DeepWalk node-embedding technique built entirely from scratch: random walks over a graph, treated as sentences for a Continuous Bag-of-Words model.

## What I built

Random-walk generation over Zachary's Karate Club graph (`nx.karate_club_graph`), with walk/context-window datasets cached to CSV for reproducible runs. The CBOW model is minimal by design: an embedding layer, mean-pooled context, a linear layer and log-softmax — trained with Adam and cross-entropy.

The CLI grid-searches over window size, walk length, number of walks and embedding dimension (12–32), with early stopping. Evaluation clusters the learned embeddings with KMeans and compares against the true club split, and t-SNE visualizations expose the embedding geometry.

## Technical highlights

- Clean, dependency-light CBOW implementation
- Systematic grid search over all hyperparameters
- Quantitative (KMeans accuracy) and qualitative (t-SNE) evaluation

## Outcome

Learned embeddings that recover the club structure — the classic technique, implemented by hand.

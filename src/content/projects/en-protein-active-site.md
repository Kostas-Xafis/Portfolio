---
slug: protein-active-site
lang: en
title: Protein Active Site Classification
summary: An end-to-end bioinformatics pipeline — from UniProt queries and 3D protein structures to a trained Keras classifier that predicts active-site residues.
category: ml
stack: [Python, Biopython, Keras, TensorFlow, scikit-learn]
status: prototype
year: 2026
featured: false
links:
  repo: https://github.com/Kostas-Xafis/Protein-Active-Site-Classification-Model
---

## Overview

Which amino-acid residues make up a protein's active site? Answering it classically requires structural analysis. This project builds a residue-level dataset from real structures and trains a neural network to classify residues automatically.

## What I built

A four-stage pipeline. First, a UniProt query extracts human proteins with annotated active sites and picks the best-resolution linked PDB structure. Then mmCIF structures are downloaded in parallel. A feature extractor computes residue-centered descriptors: one-hot amino-acid identity, neighbor counts within a radius, mean and standard deviation of neighbor distances, and surface accessibility via the Shrake–Rupley algorithm.

The classifier is a dense feed-forward Keras network trained on the stratified split with class weighting for imbalance, early stopping and AUPRC tracking — the right metric for rare positives. TensorBoard logs and training history are persisted alongside the model.

## Technical highlights

- Real multi-stage data engineering: public bioinformatics APIs, structures and features
- Parallel downloads via `ThreadPoolExecutor`
- Structural feature engineering, including Shrake–Rupley accessibility
- Imbalance-aware training with AUPRC evaluation

## Outcome

A complete, reproducible ML pipeline from public data to a trained residue classifier.

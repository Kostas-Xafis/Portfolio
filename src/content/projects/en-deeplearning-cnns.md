---
slug: deeplearning-cnns
lang: en
title: Deep Learning — CNN Architectures
summary: Five CNN architectures — from scratch and pretrained — for COVID-19 chest X-ray classification in PyTorch, with explicit GPU memory budgeting.
category: ml
stack: [Python, PyTorch, torchvision, ResNet50]
status: academic
year: 2025
featured: false
links:
  repo: https://github.com/Kostas-Xafis/DeepLearning
---

## Overview

A systematic comparison of convolutional architectures on the COVID-19 Radiography dataset: two custom CNNs, a BasicBlock-based residual CNN, ResNet50 from scratch and a pretrained fine-tuned ResNet50.

## What I built

A custom dataset loader with batch visualization, five switchable model configurations, early stopping, and run logs with plots. The training CLI estimates VRAM usage up front (training 13.62 GB / validation 4.54 GB in the reference configuration) and can pin datasets into GPU memory — treating memory as a first-class engineering constraint rather than letting runs fail late.

The same repository carries logistic-regression baselines, including a training-progress GIF, forming a complete progression from linear baselines to deep networks.

## Technical highlights

- Scratch and pretrained ResNet50 paths against custom CNNs
- Explicit VRAM budgeting and GPU-resident datasets
- Reproducible run logs and plots per configuration

## Outcome

A complete comparison study with documented results and full reproducibility.

---
slug: datamining-bankruptcy
lang: en
title: Bankruptcy Prediction Pipeline
summary: A rigorous scikit-learn pipeline for company bankruptcy prediction — SMOTE balancing, correlation pruning, histogram gradient boosting tuned by grid search, and permutation-importance analysis.
category: ml
stack: [Python, scikit-learn, imbalanced-learn, pandas]
status: academic
year: 2025
featured: false
links:
  repo: https://github.com/Kostas-Xafis/DataMining
---

## Overview

A data-mining project attacking an imbalanced company-bankruptcy dataset (target `X65`): preprocess honestly, choose models empirically, and explain the result.

## What I built

A config-driven preprocessing pipeline: deduplication, NaN threshold drops and fills, Kendall-correlation feature pruning at 0.999, outlier filtering, robust normalization, polynomial features, PCA and `SelectKBest`. For the imbalance, SMOTE oversampling with balanced class weights.

The winning model is a `HistGradientBoostingClassifier` (balanced weights, `max_iter=200`, `max_depth=20`, `l2_regularization=0.2`) tuned via `GridSearchCV` and evaluated with repeated k-fold cross-validation. `permutation_importance` ranks features, and a dedicated top-10-features analysis shows how performance holds as the feature set shrinks.

## Technical highlights

- Systematic preprocessing with documented thresholds for every decision
- Empirical model selection with repeated cross-validation
- Feature ranking and a top-10-features ablation
- A `regression.py` path with linear baselines for comparison

## Outcome

A defensible model with measured performance and an explainability story.

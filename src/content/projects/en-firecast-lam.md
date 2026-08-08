---
slug: firecast-lam
lang: en
title: FireCastNet — Local Area Modeling
summary: "My thesis: regional graph-based wildfire forecasting built on the FireCastNet GraphCast-style architecture, with per-region icosphere meshes and geospatially-aware losses. Merged upstream into the lam and lam-visual branches."
category: ml
stack: [Python, PyTorch, PyTorch Lightning, DGL, xarray, SeasFire, PyMesh]
status: thesis
year: 2026
featured: true
links:
  repo: https://github.com/Kostas-Xafis/Firecast_demo
---

## Overview

Global wildfire models struggle to represent local conditions: fire is a regional phenomenon. For my thesis I designed a Local Area Modeling (LAM) approach on top of the FireCastNet GraphCast-style architecture — graph neural networks over icosphere meshes that forecast burned area from climate-cube inputs.

The code was merged into the upstream project and lives in the `lam` and `lam-visual` branches of [FireCastNet](https://github.com/d-michail/firecastnet):
[lam](https://github.com/d-michail/firecastnet/tree/lam) · [lam-visual](https://github.com/d-michail/firecastnet/tree/lam-visual).

## What I built

Regional modeling needs meshes that concentrate resolution where fire happens. I built a pipeline that constructs per-region icosphere meshes (GFED regions such as BONA, CEAM, CEAS) with PyMesh in Docker, and data pipelines that slice the SeasFire climate cubes into region-local inputs (`mslp`, `tp`, `vpd`, `sst`, `t2m_mean`, `ssrd`, `ndvi`, population density) with `gwis_ba` burned area as the classification target.

The model uses the GraphCast encoder–processor–decoder stack with mesh-node GRU processors. Training is config-driven through the Lightning CLI with cell-area-weighted losses (L1/MSE/Huber) so grid-cell area is respected in the objective, AUPRC-based checkpointing and Weights & Biases logging. Baselines include GRU, ConvGRU, ConvLSTM, UTAE and custom GAT/GraphConv/GraphMsgPassing models.

## Technical highlights

- Regional icosphere mesh construction for local-scale graph modeling
- GraphCast-style spatiotemporal GNN: encoder–processor–decoder with GRU processor
- Geospatially-aware cell-area-weighted losses
- Full Lightning CLI experiment stack with W&B tracking and AUPRC metrics

## Outcome

The thesis results were contributed upstream; the `lam` branch carries the modeling work and `lam-visual` the visualization of its outputs.

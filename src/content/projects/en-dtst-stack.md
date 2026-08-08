---
slug: dtst-stack
lang: en
title: DTST — Tax Declaration System
summary: "A property-transaction tax declaration system delivered end to end: Spring Boot API, React dashboard, and a DevOps pipeline with Docker, Ansible and Jenkins on GCP."
category: devops
stack: [Java, Spring Boot, React, Vite, PostgreSQL, Docker, Ansible, Jenkins]
status: academic
year: 2024
featured: false
links:
  repo: https://github.com/Kostas-Xafis/Dtst-2
---

## Overview

A role-based system for Greek property-transaction tax declarations — real estate records, declarations, sales, notary assignment and user administration. The interesting part is how much of the delivery chain it covers: API, frontend, containerization, provisioning and CI.

## What I built

The backend (`Dtst-2`) is Spring Boot 3 with Spring Security and JWT (`AuthTokenFilter`, `JwtUtils`, `AuthEntryPointJwt`), role-based `@Secured` endpoints, Spring Data JPA over PostgreSQL, BCrypt hashing and Swagger documentation. The frontend (`DtstProjectFrontend`) is a React 18 + Vite + TypeScript dashboard with CSS modules and route guards.

Deployment is treated as first-class: a multi-stage Docker build (Node 20 → nginx reverse-proxying `/api` to the backend), and an Ansible playbook set (`ansible-devops`) that provisions the three-tier stack on Google Cloud VMs — Postgres, Spring, frontend — with vault-encrypted secrets, Jinja-templated nginx and systemd units, plus a Docker-compose deployment path. Jenkins pipelines drive builds and trigger the Ansible jobs.

## Technical highlights

- JWT-secured Spring Boot API with role-based authorization
- Containerized frontend with nginx proxy configuration
- Dual deployment paths: bare VMs and docker-compose, from one playbook set
- Vault-encrypted secrets and Jenkins-triggered provisioning

## Outcome

A complete vertical slice of professional delivery: from schema to running infrastructure.

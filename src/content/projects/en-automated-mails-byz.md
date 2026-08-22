---
slug: automated-mails-byz
lang: en
cover: automated-mails-byz.webp
title: Automated-Mails-Byz
summary: A transactional email service for the Byzantine music school — typed template-driven Greek mails through the MailerSend API, backed by a Turso database.
category: fullstack
stack: [Bun, TypeScript, MailerSend, Turso, libSQL]
status: maintained
year: 2024
featured: false
links:
  repo: https://github.com/Kostas-Xafis/Automated-Mails-Byz
---

## Overview

The school needed dependable, personalized email throughout the academic year: registration reminders, admission notifications, AMKA collection requests, seminar announcements. This service makes those sends programmatic.

## What I built

A POST service on `Bun.serve`, authenticated by a shared service token. It fetches HTML templates live from the school site, substitutes `{{ placeholder }}` tokens with typed payloads, and sends through the MailerSend SDK — from `no-reply@musicschool-metamorfosi.gr` under the school's display name.

Recipient data is read from a Turso (libSQL) database; the entity types mirror the full school domain (students, registrations, books, payments, wholesalers). A library of Greek templates covers the school-year events, and a local development path swaps MailerSend for the Gmail API via OAuth2, logging every send to `mail_log.txt`.

## Technical highlights

- Live-fetched HTML templates with typed token substitution
- MailerSend SDK integration with typed recipients and senders
- Turso database with env-driven prod/dev switching
- Parallel Gmail-API development path for local testing

## Outcome

Sends the school's automated correspondence each season.

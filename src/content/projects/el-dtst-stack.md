---
slug: dtst-stack
lang: el
cover: dtst-stack.webp
title: DTST — Σύστημα Δηλώσεων
summary: "Σύστημα δηλώσεων φόρου ακινήτων παραδοτέο από άκρη σε άκρη: Spring Boot API, React dashboard και DevOps pipeline με Docker, Ansible και Jenkins στο GCP."
category: devops
stack: [Java, Spring Boot, React, Vite, PostgreSQL, Docker, Ansible, Jenkins]
status: academic
year: 2024
featured: false
links:
  repo: https://github.com/Kostas-Xafis/Dtst-2
---

## Επισκόπηση

Ένα σύστημα βασισμένο σε ρόλους για δηλώσεις φόρου μεταβιβάσεων ακινήτων — αρχεία ακινήτων, δηλώσεις, πωλήσεις, ανάθεση συμβολαιογράφου και διαχείριση χρηστών. Το ενδιαφέρον είναι πόσο μεγάλο μέρος της αλυσίδας παράδοσης καλύπτει: API, frontend, containerization, provisioning και CI.

## Τι έφτιαξα

Το backend (`Dtst-2`) είναι Spring Boot 3 με Spring Security και JWT (`AuthTokenFilter`, `JwtUtils`, `AuthEntryPointJwt`), endpoints `@Secured` βάσει ρόλων, Spring Data JPA πάνω από PostgreSQL, κρυπτογράφηση BCrypt και τεκμηρίωση Swagger. Το frontend (`DtstProjectFrontend`) είναι React 18 + Vite + TypeScript dashboard με CSS modules και route guards.

Η ανάπτυξη αντιμετωπίζεται ως πρώτης τάξεως ζήτημα: multi-stage Docker build (Node 20 με nginx reverse proxy του `/api` στο backend), και σύνολο playbooks Ansible (`ansible-devops`) που προμηθεύει τη στοίβα τριών επιπέδων σε VMs του Google Cloud — Postgres, Spring, frontend — με κρυπτογραφημένα μυστικά (vault), Jinja templates για nginx και systemd, συν διαδρομή ανάπτυξης με docker-compose. Τα pipelines Jenkins οδηγούν τα builds και πυροδοτούν τις εργασίες Ansible.

## Τεχνικά highlights

- Spring Boot API με ασφάλεια JWT και εξουσιοδότηση βάσει ρόλων
- Containerized frontend με διαμόρφωση proxy nginx
- Διπλές διαδρομές ανάπτυξης: bare VMs και docker-compose από το ίδιο σύνολο playbooks
- Κρυπτογραφημένα μυστικά vault και provisioning μέσω Jenkins

## Αποτέλεσμα

Μια πλήρης κατακόρυφη φέτα επαγγελματικής παράδοσης: από το σχήμα έως την υποδομή σε λειτουργία.

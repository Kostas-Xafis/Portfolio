---
slug: callcenter-counter
lang: el
cover: callcenter-counter.webp
title: CallCenterCounter
summary: Εφαρμογή σε Cloudflare Workers + D1 όπου οι χειριστές τηλεφωνικού κέντρου καταγράφουν τα προσωπικά τους κλήσεις, με γραφήματα, εγγραφή μόνο με πρόσκληση και ωράριο λειτουργίας στην παραγωγή.
category: fullstack
stack: [Astro 5, Cloudflare Workers, D1, Wrangler, TypeScript]
status: production
year: 2026
featured: false
links:
  repo: https://github.com/Kostas-Xafis/CallCenterCounter
---

## Επισκόπηση

Οι χειριστές τηλεφωνικού κέντρου συνδέονται, καταγράφουν με ένα πάτημα τις προσωπικές εισερχόμενες κλήσεις, διαγράφουν την τελευταία εγγραφή όταν χρεώνεται λάθος, και βλέπουν προσωπικά και συνολικά στατιστικά με γραφήματα.

## Τι έφτιαξα

Χτισμένο σε Astro 5 με τον adapter Cloudflare, με τα API routes μοιρασμένα ανάμεσα σε Astro SSR σελίδες και έναν Worker handler (`src/index.ts`): login/logout/me, `calls/increment`, `calls/remove-last`, στατιστικά με `scope=user|total`, προσκλήσεις admin και έλεγχο εγγραφής.

Ο έλεγχος ταυτότητας χρησιμοποιεί HttpOnly συνόδους με SHA-256 hash κωδικών και μυστικό `AUTH_PEPPER`. Η εγγραφή γίνεται μόνο με πρόσκληση: ο ιδιοκτήτης δημιουργεί συνδέσμους μίας χρήσης που λήγουν σε 5 ημέρες και καθαρίζονται αυτόματα. Στην παραγωγή ισχύει ωράριο κλήσεων (07:00–14:30 GMT+2), το οποίο είναι απενεργοποιημένο στην ανάπτυξη.

## Τεχνικά highlights

- Σχήμα D1: `users`, `sessions`, `calls`, `signup_invites` με hashed tokens και λήξη
- Ροή εγγραφής με προσκλήσεις που λήγουν
- Προσωπικά και συνολικά στατιστικά μέσω SQL
- Επιβολή ωραρίου μόνο στην παραγωγή

## Αποτέλεσμα

Αναπτυγμένο και σε καθημερινή χρήση στο τηλεφωνικό κέντρο.

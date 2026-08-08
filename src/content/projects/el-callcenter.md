---
slug: callcenter
lang: el
title: Κατάλογος Τηλεφωνικού Κέντρου
summary: Self-hosted κατάλογος ~1.000 εγγραφών σε Bun + SQLite με χειροποίητη μηχανή fuzzy αναζήτησης, υποστήριξη ελληνικού πληκτρολογίου και caching στο IndexedDB.
category: fullstack
stack: [Bun, TypeScript, SQLite, IndexedDB, Service Worker]
status: maintained
year: 2026
featured: false
links:
  repo: https://github.com/Kostas-Xafis/CallCenter
---

## Επισκόπηση

Ένας κατάλογος τηλεφωνικών εγγραφών για τηλεφωνικό κέντρο: γρήγορη αναζήτηση σε ~1.000 εγγραφές, εισαγωγή Excel και εργαλεία διαχειριστή. Αρχικά αναπτύχθηκε σε Cloudflare Workers + D1 και μεταφέρθηκε σε πλήρως self-hosted εξυπηρετητή Bun με SQLite.

## Τι έφτιαξα

Το REST API είναι χτισμένο απευθείας πάνω στο `Bun.serve` με μητρώο routes — χωρίς framework. Η αναζήτηση είναι custom client-side fuzzy matcher γραμμένος από το μηδέν, με αντιστοίχιση ελληνικού πληκτρολογίου ώστε τονισμένα ελληνικά να βρίσκονται ακόμα κι αν πληκτρολογούνται με λατινική διάταξη.

Το client είναι vanilla SPA με IndexedDB: οι εγγραφές αποθηκεύονται τοπικά και εξυπηρετούνται άμεσα, με server-side content fingerprint (`GET /api/records/hash`) για ακύρωση cache βάσει hash. Ένα service worker με εκδόσεις cache το καθιστά PWA.

Ο έλεγχος ταυτότητας χρησιμοποιεί HttpOnly cookies με PBKDF2/SHA-256 (100k επαναλήψεις), και η πρόσβαση βασίζεται σε ρόλους: οι admins δημιουργούν προσκλήσεις, ανεβάζουν `.xlsx` μαζικά για αντικατάσταση εγγραφών και βλέπουν στατιστικά· οι χρήστες έχουν δικαιώματα ανάγνωσης.

## Τεχνικά highlights

- Χειροποίητη fuzzy αναζήτηση με ομαλοποίηση ελληνικής διάταξης
- Caching IndexedDB με ακύρωση βάσει content hash
- Συνόδους με ισχυρή παραγωγή κλειδιών, RBAC, εγγραφή με προσκλήσεις
- SQL migrations (`0001`–`0008`) και CLI scripts

## Αποτέλεσμα

Σε καθημερινή χρήση από το τηλεφωνικό κέντρο· μεταφέρθηκε από Workers σε self-hosted χωρίς διακοπή.

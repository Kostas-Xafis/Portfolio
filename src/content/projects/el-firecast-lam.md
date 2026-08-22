---
slug: firecast-lam
lang: el
cover: firecast-lam.webp
title: FireCastNet — Τοπική Μοντελοποίηση (LAM)
summary: "Η διπλωματική μου εργασία: περιφερειακή πρόβλεψη δασικών πυρκαγιών με γραφικά νευρωνικά δίκτυα στην αρχιτεκτονική GraphCast του FireCastNet, με πλέγματα icosphere ανά περιοχή και γεωχωρικά σταθμισμένες συναρτήσεις απώλειας. Ενσωματώθηκε στους κλάδους lam και lam-visual."
category: ml
stack: [Python, PyTorch, PyTorch Lightning, DGL, xarray, SeasFire, PyMesh]
status: thesis
year: 2026
featured: true
links:
  repo: https://github.com/Kostas-Xafis/Firecast_demo
---

## Επισκόπηση

Τα παγκόσμια μοντέλα πυρκαγιάς δυσκολεύονται να αποτυπώσουν τις τοπικές συνθήκες: η φωτιά είναι περιφερειακό φαινόμενο. Στη διπλωματική μου εργασία σχεδίασα μια προσέγγιση Τοπικής Μοντελοποίησης (Local Area Modeling, LAM) πάνω στην αρχιτεκτονική GraphCast του FireCastNet — γραφικά νευρωνικά δίκτυα σε πλέγματα icosphere που προβλέπουν καμένη έκταση από κλιματικά δεδομένα.

Ο κώδικας ενσωματώθηκε στο αρχικό έργο και βρίσκεται στους κλάδους `lam` και `lam-visual` του [FireCastNet](https://github.com/d-michail/firecastnet):
[lam](https://github.com/d-michail/firecastnet/tree/lam) · [lam-visual](https://github.com/d-michail/firecastnet/tree/lam-visual).

## Τι έφτιαξα

Η περιφερειακή μοντελοποίηση χρειάζεται πλέγματα που συγκεντρώνουν ανάλυση εκεί που γίνεται η φωτιά. Έχτισα pipeline κατασκευής πλεγμάτων icosphere ανά περιφέρεια (GFED περιοχές όπως BONA, CEAM, CEAS) με PyMesh σε Docker, και pipeline δεδομένων που κόβουν τους κλιματικούς κύβους SeasFire σε τοπικά inputs (`mslp`, `tp`, `vpd`, `sst`, `t2m_mean`, `ssrd`, `ndvi`, πληθυσμιακή πυκνότητα) με την καμένη έκταση `gwis_ba` ως στόχο ταξινόμησης.

Το μοντέλο χρησιμοποιεί τη στοίβα encoder–processor–decoder του GraphCast με GRU processors στους κόμβους του πλέγματος. Η εκπαίδευση είναι config-driven μέσω Lightning CLI με συναρτήσεις απώλειας σταθμισμένες ως προς το εμβαδόν των κελιών (L1/MSE/Huber), checkpointing βάσει AUPRC και καταγραφή Weights & Biases. Οι βασικές γραμμές περιλαμβάνουν GRU, ConvGRU, ConvLSTM, UTAE και custom μοντέλα GAT/GraphConv/GraphMsgPassing.

## Τεχνικά highlights

- Κατασκευή περιφερειακών πλεγμάτων icosphere για μοντελοποίηση τοπικής κλίμακας
- Χωροχρονικό GNN τύπου GraphCast: encoder–processor–decoder με GRU processor
- Γεωχωρικά σταθμισμένες απώλειες ως προς το εμβαδόν κελιών
- Πλήρης στοίβα πειραμάτων Lightning CLI με W&B και μετρικές AUPRC

## Αποτέλεσμα

Τα αποτελέσματα της διπλωματικής συνεισφέρθηκαν στο αρχικό έργο· ο κλάδος `lam` φέρει την ερευνητική υλοποίηση και ο `lam-visual` την οπτικοποίηση των εξόδων της.

export type Lang = 'en' | 'el';

export interface TerminalStrings {
  title: string;
  body: string;
  comment: string;
  promptLabel: string;
  inputAria: string;
  help: string;
  whoami: string;
  ls: string;
  notFound: string;
  hint: string;
  home: string;
}

export const TERMINAL: Record<Lang, TerminalStrings> = {
  en: {
    title: '404 — Page not found',
    body: 'The page you are looking for does not exist.',
    comment: 'last known location: lost in /dev/null',
    promptLabel: 'type "help" and press Enter',
    inputAria: 'Terminal command',
    help: 'Available commands: help · whoami · ls · home · projects · blog · about · contact',
    whoami: 'konstantinos.chafis — software engineer',
    ls: 'home/  projects/  blog/  about/  contact/',
    notFound: 'command not found:',
    hint: 'try "help"',
    home: 'Back to home',
  },
  el: {
    title: '404 — Η σελίδα δεν βρέθηκε',
    body: 'Η σελίδα που αναζητάτε δεν υπάρχει.',
    comment: 'τελευταία γνωστή τοποθεσία: χαμένη στο /dev/null',
    promptLabel: 'πληκτρολογήστε "help" και πατήστε Enter',
    inputAria: 'Εντολή τερματικού',
    help: 'Διαθέσιμες εντολές: help · whoami · ls · home · projects · blog · about · contact',
    whoami: 'konstantinos.chafis — μηχανικός λογισμικού',
    ls: 'home/  projects/  blog/  about/  contact/',
    notFound: 'η εντολή δεν βρέθηκε:',
    hint: 'δοκιμάστε "help"',
    home: 'Επιστροφή στην αρχική',
  },
};

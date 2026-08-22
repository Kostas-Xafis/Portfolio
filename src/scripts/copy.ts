/**
 * Shared copy-to-clipboard helper, used by the contact page (email) and
 * blog posts (link). A single delegated click listener handles every
 * [data-copy] button on the page.
 *
 * Button contract:
 *   data-copy        text to copy
 *   data-copy-label  default label
 *   data-copy-copied label shown briefly after a successful copy
 */

let installed = false;

export function initCopyButtons(): void {
  if (installed) return;
  installed = true;

  document.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement | null;
    const button = target?.closest<HTMLButtonElement>('[data-copy]');
    if (!button || button.dataset.copiedBusy) return;

    const text = button.dataset.copy ?? '';
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers / non-secure contexts.
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      area.remove();
    }

    const label = button.dataset.copyLabel ?? '';
    button.textContent = button.dataset.copyCopied ?? '';
    button.dataset.copiedBusy = 'true';
    window.setTimeout(() => {
      button.textContent = label;
      delete button.dataset.copiedBusy;
    }, 1500);
  });
}

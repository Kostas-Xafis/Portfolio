# Cover images

The repo ships a full set of procedurally generated covers
(`npm run covers:generate` — see `scripts/generate-covers.mjs`), which also
injects the matching `cover:` line into both language files.

To replace a cover (for example with AI-generated art from
`image-gen-prompt.txt`), drop the new image in this folder using the same
filename, or reference a filename in the frontmatter of both language files:

```yaml
cover: isokratis.webp
```

- Supported formats: `png`, `jpg`, `jpeg`, `webp`, `avif`
- Recommended: 2560×1440 (16:9), `webp` — the generated set matches this, and
  it keeps detail-page banners sharp on retina displays with browser zoom
  (1200×675 is the absolute minimum for the ~960px banner)
- When `cover` is absent (or the file is missing), cards and detail pages render
  a styled placeholder instead — so content never looks broken while images are
  being prepared.

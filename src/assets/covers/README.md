# Cover images

Drop cover images for projects and blog posts in this folder, then reference the
filename in the frontmatter of the matching content file:

```yaml
cover: isokratis.webp
```

- Supported formats: `png`, `jpg`, `jpeg`, `webp`, `avif`
- Recommended: 1200×675 (16:9) or 1200×600 (2:1), `webp`
- When `cover` is absent (or the file is missing), cards and detail pages render
  a styled placeholder instead — so content never looks broken while images are
  being prepared.

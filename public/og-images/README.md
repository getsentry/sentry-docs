# OG Images

This directory contains Open Graph images for documentation pages.

## Generation

Images in this directory are automatically generated during the build process by running:

```bash
pnpm generate-og-images
```

This script:

1. Scans all MDX files in `docs/` and `develop-docs/`
2. Finds the first image in each file
3. Copies it here with a predictable name based on the page slug
4. Updates the frontmatter with `og_image: /og-images/[name].ext`

## Local Development

These files are gitignored to keep the repository clean. Run `pnpm generate-og-images` or `pnpm build` to generate them locally.

## Production

On Vercel, these images are generated during the build process and deployed with the site.

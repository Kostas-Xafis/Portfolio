import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const projectCategories = [
  "fullstack",
  "ml",
  "compilers",
  "systems",
  "extensions",
  "devops",
] as const;

const projects = defineCollection({
  loader: glob({
    pattern: "projects/*.md",
    base: "./src/content",
    generateId: ({ entry }) => entry,
  }),
  schema: z.object({
    slug: z.string(),
    lang: z.enum(["en", "el"]),
    title: z.string(),
    summary: z.string(),
    category: z.enum(projectCategories),
    stack: z.array(z.string()),
    status: z.enum([
      "production",
      "maintained",
      "archived",
      "academic",
      "thesis",
      "prototype",
    ]),
    year: z.number(),
    featured: z.boolean().default(false),
    // Optional cover image: a filename inside src/assets/covers (e.g. "isokratis.webp").
    // When absent, cards and detail pages render a styled placeholder instead.
    cover: z.string().optional(),
    links: z
      .object({
        repo: z.string().url().optional(),
        live: z.string().url().optional(),
        paper: z.string().url().optional(),
      })
      .optional(),
  }),
});

const blog = defineCollection({
  loader: glob({
    pattern: "blog/*.md",
    base: "./src/content",
    generateId: ({ entry }) => entry,
  }),
  schema: z.object({
    slug: z.string(),
    lang: z.enum(["en", "el"]),
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Optional cover image: a filename inside src/assets/covers (e.g. "drone-engine.webp").
    // When absent, cards and detail pages render a styled placeholder instead.
    cover: z.string().optional(),
  }),
});

export const collections = { projects, blog };

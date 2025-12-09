// content/config.ts

import { defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { pageSiteGraphSchema } from 'starlight-site-graph/schema';

export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: pageSiteGraphSchema,
    }),
  }),
};

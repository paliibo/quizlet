import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      // Shared decks live in the URL fragment, so there is nothing here worth
      // indexing beyond the landing page.
      disallow: "/import",
      userAgent: "*",
    },
  };
}

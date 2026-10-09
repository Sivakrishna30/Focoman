import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://focoman.web.app';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/account-settings',
          '/workspaces',
          '/onboarding',
          '/sign-in',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

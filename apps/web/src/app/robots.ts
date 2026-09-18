import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/account-settings',
          '/workspaces',
          '/devportal',
          '/onboarding',
          '/sign-in',
        ],
      },
    ],
    sitemap: 'https://focoman.web.app/sitemap.xml',
  };
}

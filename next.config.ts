import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep the legacy `/lessons/k1/slug/` URL shape; `/apply` redirects to `/apply/`.
  // URLs with a file extension (e.g. `/sitemap.xml`) are left as-is.
  trailingSlash: true,
  experimental: {
    // Image uploads go through a Server Action (lib/actions/media.ts): 4 MB files plus form overhead.
    serverActions: { bodySizeLimit: '4.5mb' },
  },
  async redirects() {
    return [
      // www.<domain> → <domain>, keeping the path and its trailing slash. The domain comes from the
      // request, so it isn't written here.
      {
        source: '/:path*/',
        has: [{ type: 'host', value: 'www\\.(?<domain>.+)' }],
        destination: 'https://:domain/:path*/',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www\\.(?<domain>.+)' }],
        destination: 'https://:domain/:path*',
        permanent: true,
      },
      // No .html in URLs: /index.html → /, /lessons/index.html → /lessons/, /blog/<slug>.html → /blog/<slug>/.
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/:path(.+)/index.html', destination: '/:path/', permanent: true },
      { source: '/:path(.+)\\.html', destination: '/:path/', permanent: true },
    ];
  },
};

export default nextConfig;

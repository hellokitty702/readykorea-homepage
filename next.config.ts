import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep the legacy `/lessons/k1/slug/` URL shape; `/apply` redirects to `/apply/`.
  // URLs with a file extension (e.g. `/blog/first-week-teaching-in-korea.html`) are left as-is.
  trailingSlash: true,
  async redirects() {
    // The old static site also answered at `.../index.html`; keep those links working.
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/:path*/index.html', destination: '/:path*/', permanent: true },
    ];
  },
};

export default nextConfig;

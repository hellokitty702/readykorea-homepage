import type { Metadata } from 'next';
import { SITE_ORIGIN } from './site';

/** Both root layouts (public site, admin) start from this: pages give relative canonical/OG URLs, resolved against the site's origin. */
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
};

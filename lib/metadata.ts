import type { Metadata } from 'next';
import { SITE_ORIGIN } from './site';

/** Shared by every root layout: pages give relative canonical/OG URLs, resolved against the site's origin. */
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
};

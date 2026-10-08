import type { Metadata } from 'next';
import { SITE_URL } from './site';

/** Shared by every root layout so relative canonical/OG URLs resolve to the production domain. */
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

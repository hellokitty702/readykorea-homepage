/**
 * The site's own origin, e.g. https://readykoreaesl.com. Links in the code are relative paths; this is
 * only for the few places that must be absolute: canonical and Open Graph tags (metadataBase in
 * lib/metadata.ts), sitemap.xml, robots.txt and JSON-LD.
 *
 * Comes from the deployment, not the code: SITE_URL if set, else Vercel's production domain (the
 * project's shortest custom domain), else this machine in development.
 */
export const SITE_ORIGIN = new URL(
  process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : `http://localhost:${process.env.PORT || 3000}`),
).origin;

/** Absolute address of a site path: absoluteUrl('/blog/') → https://readykoreaesl.com/blog/. */
export const absoluteUrl = (path: string) => new URL(path, SITE_ORIGIN).href;
export const SITE_NAME = 'ReadyKorea';

/** Google Form previously used for teacher applications (still linked from the footer CTA). */
export const TEACHER_APPLY_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSf7MvPqQfioWQ0BugCat9gvgdYpLfhp8CSaB3R-Q2u3gy8zUw/viewform';

/** Google Form schools use to post a job ("Post a Job" / 구인등록). */
export const SCHOOL_POST_JOB_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSd2mex_U-3rbHk6akqp-mddBPAvtFsWSdQIzjelnV1Sp-S7tg/viewform';

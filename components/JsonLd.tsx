/** Structured data for search engines. */
export function JsonLd({ data }: { data: object }) {
  // Escape `<` so the payload can never close the script tag early.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

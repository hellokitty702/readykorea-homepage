const STATS = [
  { value: '162', label: 'Curriculum Units' },
  { value: '92%', label: 'Teacher Retention' },
  { value: '500+', label: 'Verified Placements' },
];

/** Hidden on the simplified home view (`body.home-view-simple`). */
export function PlatformPerformance() {
  return (
    <section
      className="platform-performance"
      style={{
        padding: '56px 0',
        borderTop: '0.5px solid var(--line)',
        borderBottom: '0.5px solid var(--line)',
        background: 'var(--bg-2)',
      }}
    >
      <div className="wrap" style={{ textAlign: 'center' }}>
        <div
          className="eyebrow"
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: 8,
          }}
        >
          Platform Performance
        </div>
        <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 32, fontWeight: 800, marginBottom: 28 }}>
          Data-Driven Results
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 20,
            maxWidth: 800,
            margin: '0 auto',
          }}
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              style={{ background: 'white', padding: 24, borderRadius: 12, border: '0.5px solid var(--line)' }}
            >
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

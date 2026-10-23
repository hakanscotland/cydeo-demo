export default function HomePage() {
  return (
    <main style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-club-green)', fontSize: '2rem', fontWeight: 'bold' }}>
          PINT FC
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Club Website & Matchday Attendance</p>
      </header>

      <section
        data-testid="hero-match-card"
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-club-dark)' }}>
          Next Match
        </h2>
        <div data-testid="countdown-timer" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-accent-gold)' }}>
          Loading countdown...
        </div>
      </section>
    </main>
  );
}

'use client'
import { useRouter } from 'next/navigation'

const PRODUKTE = [
  {
    id: 'terminpilot',
    name: 'TerminPilot',
    beschreibung: 'Terminbuchung, Kalender-Sync und automatische Meeting-Links.',
    href: '/dashboard/terminpilot/scheduling',
    status: 'aktiv',
    features: ['Scheduling', 'Availability', 'Meetings', 'Integrations', 'Contacts'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor"/>
        <rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor"/>
        <rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor"/>
        <rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'crmpilot',
    name: 'CRMPilot',
    beschreibung: 'Klientenverwaltung, Sales-Pipeline und Deal-Tracking.',
    href: '/dashboard/crmpilot/klienten',
    status: 'aktiv',
    features: ['Klienten', 'Pipeline', 'Deals', 'Aktivitäten', 'Berichte'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: 'bald-1',
    name: 'InvoicePilot',
    beschreibung: 'Rechnungen, Angebote und Zahlungsverfolgung.',
    href: '#',
    status: 'bald',
    features: ['Rechnungen', 'Angebote', 'Zahlungen', 'DATEV-Export'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    id: 'bald-2',
    name: 'MailPilot',
    beschreibung: 'E-Mail-Sequenzen, Newsletter und Automationen.',
    href: '#',
    status: 'bald',
    features: ['Kampagnen', 'Sequenzen', 'Templates', 'Analytics'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
]

export default function OverviewPage() {
  const router = useRouter()

  return (
    <div style={{ background: 'var(--bg-alt)', padding: '48px 40px', minHeight: '100vh' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.04em' }}>PilotSuite</div>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: 40 }}>
          Willkommen, Martin. Wähle ein Produkt um loszulegen.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 40 }}>
          {PRODUKTE.map(p => {
            const istAktiv = p.status === 'aktiv'
            return (
              <div key={p.id}
                onClick={() => istAktiv && router.push(p.href)}
                style={{
                  background: 'var(--white)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '24px',
                  cursor: istAktiv ? 'pointer' : 'default',
                  transition: 'all 0.2s', opacity: istAktiv ? 1 : 0.55,
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => { if (istAktiv) { e.currentTarget.style.borderColor = '#0A0A0A'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)' }}}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}>

                {!istAktiv && (
                  <div style={{ position: 'absolute', top: 14, right: 14, fontSize: '0.70rem', fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: '#F3F4F6', color: 'var(--muted)', border: '1px solid var(--border)' }}>
                    Demnächst
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: istAktiv ? '#0A0A0A' : 'var(--bg-alt)', color: istAktiv ? '#fff' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: istAktiv ? 'none' : '1px solid var(--border)' }}>
                    {p.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{p.name}</div>
                    {istAktiv && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                        <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>Aktiv</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '0.84rem', color: 'var(--muted)', marginBottom: 16, lineHeight: 1.5 }}>
                  {p.beschreibung}
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {p.features.map(f => (
                    <span key={f} style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: 999, background: 'var(--bg-alt)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                      {f}
                    </span>
                  ))}
                </div>

                {istAktiv && (
                  <div style={{ position: 'absolute', bottom: 20, right: 20, color: 'var(--muted)', fontSize: '1rem' }}>→</div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--muted)' }}>
          WhaleByte · PilotSuite · Admin: Martin L.
        </div>

      </div>
    </div>
  )
}
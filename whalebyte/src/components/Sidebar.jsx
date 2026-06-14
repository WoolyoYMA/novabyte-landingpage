'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const PRODUKTE = [
  {
    id: 'terminpilot',
    label: 'TerminPilot',
    href: '/dashboard/terminpilot/scheduling',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor"/>
        <rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor"/>
        <rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor"/>
        <rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor"/>
      </svg>
    ),
    items: [
      {
        href: '/dashboard/terminpilot/scheduling',
        label: 'Scheduling',
        icon: (
          <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8"  y1="2" x2="8"  y2="6"/>
            <line x1="3"  y1="10" x2="21" y2="10"/>
          </svg>
        ),
      },
      {
        href: '/dashboard/terminpilot/availability',
        label: 'Availability',
        icon: (
          <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        ),
      },
      {
        href: '/dashboard/terminpilot/meetings',
        label: 'Meetings',
        badge: '3',
        icon: (
          <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        ),
      },
      {
        href: '/dashboard/terminpilot/integrations',
        label: 'Integrations',
        icon: (
          <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        ),
      },
      {
        href: '/dashboard/terminpilot/contacts',
        label: 'Contacts',
        icon: (
          <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        ),
      },
    ],
  },
  {
    id: 'crmpilot',
    label: 'CRMPilot',
    href: '/dashboard/crmpilot/klienten',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    items: [
      {
        href: '/dashboard/crmpilot/klienten',
        label: 'Klienten',
        icon: (
          <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        ),
      },
      {
        href: '/dashboard/crmpilot/pipeline',
        label: 'Pipeline',
        icon: (
          <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        ),
      },
      {
        href: '/dashboard/crmpilot/deals',
        label: 'Deals',
        badge: '5',
        icon: (
          <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        ),
      },
      {
        href: '/dashboard/crmpilot/aktivitaeten',
        label: 'Aktivitäten',
        icon: (
          <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8"  y1="2" x2="8"  y2="6"/>
            <line x1="3"  y1="10" x2="21" y2="10"/>
          </svg>
        ),
      },
      {
        href: '/dashboard/crmpilot/berichte',
        label: 'Berichte',
        icon: (
          <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6"  y1="20" x2="6"  y2="14"/>
          </svg>
        ),
      },
    ],
  },
]

const BOTTOM_ITEMS = [
  {
    href: '/dashboard/settings',
    label: 'Einstellungen',
    icon: (
      <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/help',
    label: 'Hilfe',
    icon: (
      <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
]

export default function Sidebar({ aktivesProdukt: aktivProp }) {
  const pathname = usePathname()

  const aktivesProdukt = aktivProp ||
    (pathname.startsWith('/dashboard/crmpilot') ? 'crmpilot' :
     pathname.startsWith('/dashboard/terminpilot') ? 'terminpilot' : null)

  const produkt = PRODUKTE.find(p => p.id === aktivesProdukt)
  const istOverview = pathname === '/dashboard/overview' || pathname === '/dashboard'

  return (
    <aside className="sidebar" style={{ width: 240, overflowY: 'auto' }}>

      {/* LOGO */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '20px 16px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ width: 30, height: 30, background: '#fff', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="5" height="5" rx="1" fill="#0A0A0A"/>
            <rect x="9" y="2" width="5" height="5" rx="1" fill="#0A0A0A"/>
            <rect x="2" y="9" width="5" height="5" rx="1" fill="#0A0A0A"/>
            <rect x="9" y="9" width="5" height="5" rx="1" fill="#0A0A0A"/>
          </svg>
        </div>
        <span style={{ fontSize: '1.05rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff' }}>
          PilotSuite
        </span>
      </div>

      {/* NAV */}
      <nav style={{ flex: 1, padding: '10px 10px' }}>

        {/* Übersicht */}
        <Link href="/dashboard/overview"
          className={`nav-item ${istOverview ? 'active' : ''}`}
          style={{ marginBottom: 6 }}>
          <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          Übersicht
        </Link>

        {/* Produkte */}
        {PRODUKTE.map(p => {
          const istAktiv = aktivesProdukt === p.id
          return (
            <div key={p.id} style={{ marginBottom: 4 }}>

              {/* Produkt-Header */}
              <div style={{
                fontSize: '0.60rem', fontWeight: 900, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
                padding: '12px 12px 5px',
              }}>
                {p.label}
              </div>

              {/* Items */}
              {istAktiv && p.items.map(item => (
                <Link key={item.href} href={item.href}
                  className={`nav-item ${pathname === item.href ? 'active' : ''}`}>
                  {item.icon}
                  {item.label}
                  {item.badge && <span className="nav-item__badge">{item.badge}</span>}
                </Link>
              ))}

              {/* Wenn nicht aktiv: nur klickbarer Einstieg */}
              {!istAktiv && (
                <Link href={p.href}
                  className="nav-item"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {p.icon}
                  <span style={{ fontSize: '0.84rem' }}>Öffnen →</span>
                </Link>
              )}
            </div>
          )
        })}

      </nav>

      {/* BOTTOM */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '8px 10px' }}>
        {BOTTOM_ITEMS.map(item => (
          <Link key={item.href} href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}>
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>

      {/* FOOTER */}
      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar">ML</div>
          <div>
            <div className="sidebar__user-name">Martin L.</div>
            <div className="sidebar__user-role">Admin · WhaleByte</div>
          </div>
        </div>
      </div>

    </aside>
  )
}
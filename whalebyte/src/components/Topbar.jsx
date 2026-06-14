'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'

const MOCK_SUCHE = [
  { typ: 'kontakt', label: 'Anna Müller',       sub: 'anna.mueller@email.de',   href: '/dashboard/contacts'     },
  { typ: 'kontakt', label: 'Eva Bauer',          sub: 'eva.bauer@gmail.com',     href: '/dashboard/contacts'     },
  { typ: 'kontakt', label: 'Lars Meyer',         sub: 'lars.meyer@company.de',   href: '/dashboard/contacts'     },
  { typ: 'seite',   label: 'Availability',       sub: 'Verfügbarkeit verwalten', href: '/dashboard/availability' },
  { typ: 'seite',   label: 'Scheduling',         sub: 'Termine & Buchungen',     href: '/dashboard/scheduling'   },
  { typ: 'seite',   label: 'Integrations',       sub: 'Apps verbinden',          href: '/dashboard/integrations' },
  { typ: 'seite',   label: 'Einstellungen',      sub: 'Konto & Profil',          href: '/dashboard/settings'     },
  { typ: 'termin',  label: 'Termin mit Anna',    sub: 'Morgen, 10:00 Uhr',       href: '/dashboard/scheduling'   },
  { typ: 'termin',  label: 'Beratung Eva Bauer', sub: 'Fr, 14:00 Uhr',           href: '/dashboard/scheduling'   },
]

const MOCK_BENACHRICHTIGUNGEN = [
  { id: 1, gelesen: false, icon: '📅', titel: 'Neue Buchung',          text: 'Anna Müller hat einen Termin gebucht.',              zeit: 'Vor 5 Min'  },
  { id: 2, gelesen: false, icon: '🎯', titel: 'Neuer Lead',            text: 'Jonas Richter hat sich registriert.',                zeit: 'Vor 23 Min' },
  { id: 3, gelesen: false, icon: '⚠️', titel: 'Kalender-Sync Fehler', text: 'Google Kalender konnte nicht synchronisiert werden.', zeit: 'Vor 1 Std'  },
  { id: 4, gelesen: true,  icon: '✅', titel: 'Termin abgeschlossen',  text: 'Coaching mit Eva Bauer abgeschlossen.',              zeit: 'Vor 3 Std'  },
  { id: 5, gelesen: true,  icon: '💬', titel: 'Erinnerung',            text: 'Termin mit Lars Meyer in 1 Stunde.',                 zeit: 'Gestern'    },
]

export default function Topbar() {
  const router = useRouter()
  const { signOut } = useClerk()

  const [suche, setSuche]             = useState('')
  const [sucheFokus, setSucheFokus]   = useState(false)
  const [glockeOffen, setGlockeOffen] = useState(false)
  const [profilOffen, setProfilOffen] = useState(false)
  const [notifs, setNotifs]           = useState(MOCK_BENACHRICHTIGUNGEN)

  const glockeRef = useRef()
  const profilRef = useRef()

  const ungelesen = notifs.filter(n => !n.gelesen).length

  const sucheErgebnis = suche.trim().length > 0
    ? MOCK_SUCHE.filter(e =>
        e.label.toLowerCase().includes(suche.toLowerCase()) ||
        e.sub.toLowerCase().includes(suche.toLowerCase())
      )
    : []

  useEffect(() => {
    function handleClick(e) {
      if (glockeRef.current && !glockeRef.current.contains(e.target)) setGlockeOffen(false)
      if (profilRef.current && !profilRef.current.contains(e.target)) setProfilOffen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function navigate(href) {
    setSuche('')
    setSucheFokus(false)
    setProfilOffen(false)
    setGlockeOffen(false)
    router.push(href)
  }

  function alleAlsGelesenMarkieren() {
    setNotifs(prev => prev.map(n => ({ ...n, gelesen: true })))
  }

  function notifLoeschen(id) {
    setNotifs(prev => prev.filter(n => n.id !== id))
  }

  async function handleAbmelden() {
    setProfilOffen(false)
    await signOut()
    router.push('/')
  }

  const typIcon = {
    kontakt: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    seite: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    termin: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8"  y1="2" x2="8"  y2="6"/>
        <line x1="3"  y1="10" x2="21" y2="10"/>
      </svg>
    ),
  }

  return (
    <header className="topbar">

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '340px' }}>
          <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#999999', pointerEvents: 'none' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Suchen..."
            value={suche}
            onChange={e => setSuche(e.target.value)}
            onFocus={() => setSucheFokus(true)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 32px',
              border: '1px solid #e8e8e8',
              borderRadius: '4px',
              fontSize: '0.84rem',
              background: '#f7f7f7',
              color: '#0a0a0a',
            }}
          />
          {sucheFokus && sucheErgebnis.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'white',
              border: '1px solid #e8e8e8',
              borderTop: 'none',
              borderRadius: '0 0 4px 4px',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 100,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}>
              {sucheErgebnis.map((item, i) => (
                <div
                  key={i}
                  onClick={() => navigate(item.href)}
                  style={{
                    padding: '10px 12px',
                    borderBottom: i < sucheErgebnis.length - 1 ? '1px solid #e8e8e8' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.84rem',
                  }}
                  onMouseEnter={e => e.target.style.background = '#f7f7f7'}
                  onMouseLeave={e => e.target.style.background = 'white'}
                >
                  <div style={{ color: '#999999' }}>{typIcon[item.typ]}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0a0a0a' }}>{item.label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#999999', marginTop: '2px' }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

        <button
          onClick={() => setGlockeOffen(!glockeOffen)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '4px',
            border: '1px solid #e8e8e8',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999999',
            cursor: 'pointer',
            position: 'relative',
            padding: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {ungelesen > 0 && (
            <div style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '7px',
              height: '7px',
              background: '#DC2626',
              borderRadius: '50%',
              border: '1.5px solid white',
            }}/>
          )}
        </button>

        {glockeOffen && (
          <div
            ref={glockeRef}
            style={{
              position: 'absolute',
              top: '64px',
              right: '12px',
              background: 'white',
              border: '1px solid #e8e8e8',
              borderRadius: '4px',
              width: '340px',
              maxHeight: '400px',
              overflowY: 'auto',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              zIndex: 1000,
            }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>Benachrichtigungen</div>
              {ungelesen > 0 && (
                <button onClick={alleAlsGelesenMarkieren} style={{ background: 'none', border: 'none', color: '#0a0a0a', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                  Alle als gelesen
                </button>
              )}
            </div>
            {notifs.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999999', fontSize: '0.84rem' }}>
                Keine Benachrichtigungen
              </div>
            ) : (
              notifs.map(notif => (
                <div
                  key={notif.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #e8e8e8',
                    background: notif.gelesen ? 'white' : '#f9f9f9',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ fontSize: '1.1rem', flexShrink: 0 }}>{notif.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.84rem', color: '#0a0a0a' }}>{notif.titel}</div>
                    <div style={{ fontSize: '0.78rem', color: '#666666', marginTop: '2px', lineHeight: 1.4 }}>{notif.text}</div>
                    <div style={{ fontSize: '0.70rem', color: '#999999', marginTop: '4px' }}>{notif.zeit}</div>
                  </div>
                  <button
                    onClick={() => notifLoeschen(notif.id)}
                    style={{ background: 'none', border: 'none', color: '#999999', cursor: 'pointer', fontSize: '1rem', padding: '2px' }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        <div
          ref={profilRef}
          style={{ position: 'relative' }}
        >
          <button
            onClick={() => setProfilOffen(!profilOffen)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#d6d6d6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.84rem',
              fontWeight: 900,
              color: '#0a0a0a',
              flexShrink: 0,
            }}>
              ML
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0a0a0a' }}>
              Martin L.
            </div>
          </button>

          {profilOffen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: 'white',
                border: '1px solid #e8e8e8',
                borderRadius: '4px',
                minWidth: '180px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 1000,
                marginTop: '8px',
              }}
            >
              <button
                onClick={() => navigate('/dashboard/settings')}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  color: '#0a0a0a',
                  borderBottom: '1px solid #e8e8e8',
                }}
                onMouseEnter={e => e.target.style.background = '#f7f7f7'}
                onMouseLeave={e => e.target.style.background = 'none'}
              >
                Einstellungen
              </button>
              <button
                onClick={handleAbmelden}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  color: '#DC2626',
                }}
                onMouseEnter={e => e.target.style.background = '#f7f7f7'}
                onMouseLeave={e => e.target.style.background = 'none'}
              >
                Abmelden
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  )
}

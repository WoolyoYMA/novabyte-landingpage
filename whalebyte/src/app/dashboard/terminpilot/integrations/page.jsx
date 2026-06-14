'use client'
import { useState } from 'react'

// ============================================
// KONFIGURATION
// ============================================

const KATEGORIEN = ['Alle', 'Kalender', 'Video']

const INTEGRATIONEN = [
  // ── KALENDER ──────────────────────────────────────────────
  {
    id:        'google-calendar',
    name:      'Google Calendar',
    kategorie: 'Kalender',
    beschreibung: 'Synchronisiere Termine automatisch mit deinem Google Kalender. Gebuchte Termine werden direkt eingetragen, bestehende Termine blockieren deine Verfügbarkeit.',
    logo: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#fff" stroke="#E5E7EB"/>
        <path d="M17 3H7C5.9 3 5 3.9 5 5v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="#4285F4"/>
        <rect x="7" y="10" width="10" height="1.5" rx=".75" fill="#fff"/>
        <rect x="7" y="13" width="7" height="1.5" rx=".75" fill="#fff"/>
        <rect x="8" y="6" width="1.5" height="3" rx=".75" fill="#fff"/>
        <rect x="14.5" y="6" width="1.5" height="3" rx=".75" fill="#fff"/>
      </svg>
    ),
    felder: [
      { key: 'clientId',     label: 'Client ID',     typ: 'text',     placeholder: '123456789-abc.apps.googleusercontent.com', hilfe: 'Aus der Google Cloud Console → APIs & Services → Credentials' },
      { key: 'clientSecret', label: 'Client Secret', typ: 'password', placeholder: 'GOCSPX-…',                                  hilfe: 'Geheimnis deines OAuth 2.0 Clients'                          },
      { key: 'calendarId',   label: 'Kalender-ID',   typ: 'text',     placeholder: 'primary oder deine@email.de',               hilfe: '„primary" für Hauptkalender oder spezifische Kalender-ID'   },
    ],
    webhookPfad:  '/api/webhooks/google-calendar',
    n8nDoku: 'Nutze den Google Calendar Node in n8n. Verbinde über OAuth2 Credential mit deinen Client ID & Secret.',
    scopes: ['https://www.googleapis.com/auth/calendar'],
    farbe: '#4285F4',
  },
  {
    id:        'outlook-calendar',
    name:      'Outlook Calendar',
    kategorie: 'Kalender',
    beschreibung: 'Verbinde Microsoft Outlook / Office 365 Kalender. Perfekt für Business-Umgebungen mit Microsoft 365.',
    logo: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#fff" stroke="#E5E7EB"/>
        <path d="M13 4H4v16h9V4z" fill="#0078D4"/>
        <path d="M13 4h7v5h-7V4z" fill="#0078D4" opacity=".6"/>
        <path d="M13 9h7v5h-7V9z" fill="#0078D4" opacity=".8"/>
        <path d="M13 14h7v6h-7v-6z" fill="#0078D4"/>
        <rect x="5.5" y="8" width="6" height="8" rx="1.5" fill="#fff"/>
      </svg>
    ),
    felder: [
      { key: 'tenantId',     label: 'Tenant ID',     typ: 'text',     placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', hilfe: 'Azure Active Directory → Tenant ID'          },
      { key: 'clientId',     label: 'Client ID',     typ: 'text',     placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', hilfe: 'Azure App Registration → Application (client) ID' },
      { key: 'clientSecret', label: 'Client Secret', typ: 'password', placeholder: '~xxxxxxxx~',                           hilfe: 'Azure App Registration → Certificates & secrets' },
    ],
    webhookPfad: '/api/webhooks/outlook-calendar',
    n8nDoku: 'Nutze den Microsoft Outlook Node in n8n. Verbinde über Microsoft OAuth2 API mit Tenant- und Client-ID.',
    scopes: ['Calendars.ReadWrite'],
    farbe: '#0078D4',
  },
  {
    id:        'apple-calendar',
    name:      'Apple Calendar',
    kategorie: 'Kalender',
    beschreibung: 'Synchronisiere mit iCloud Kalender über CalDAV-Protokoll. Für Mac- und iOS-Nutzer.',
    logo: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#fff" stroke="#E5E7EB"/>
        <rect x="4" y="5" width="16" height="15" rx="2" fill="#FF3B30"/>
        <rect x="4" y="8" width="16" height="12" rx="0" fill="#fff"/>
        <rect x="4" y="8" width="16" height="3" fill="#FF3B30" opacity=".15"/>
        <text x="12" y="17" textAnchor="middle" fontSize="6" fontWeight="700" fill="#FF3B30">CAL</text>
        <rect x="8" y="3" width="2" height="4" rx="1" fill="#FF3B30"/>
        <rect x="14" y="3" width="2" height="4" rx="1" fill="#FF3B30"/>
      </svg>
    ),
    felder: [
      { key: 'appleId',  label: 'Apple ID (E-Mail)', typ: 'email',    placeholder: 'deine@icloud.com', hilfe: 'Deine Apple ID E-Mail-Adresse'               },
      { key: 'appPwd',   label: 'App-spezifisches Passwort', typ: 'password', placeholder: 'xxxx-xxxx-xxxx-xxxx', hilfe: 'Erstelle unter appleid.apple.com → Sicherheit → App-spezifische Passwörter' },
      { key: 'calDavUrl',label: 'CalDAV URL',         typ: 'text',     placeholder: 'https://caldav.icloud.com', hilfe: 'Standard: https://caldav.icloud.com'  },
    ],
    webhookPfad: '/api/webhooks/apple-calendar',
    n8nDoku: 'Nutze den CalDAV Node oder HTTP Request in n8n mit Basic Auth (Apple ID + App-Passwort).',
    scopes: [],
    farbe: '#FF3B30',
  },

  // ── VIDEO ─────────────────────────────────────────────────
  {
    id:        'zoom',
    name:      'Zoom',
    kategorie: 'Video',
    beschreibung: 'Erstelle automatisch Zoom-Meetings für jeden gebuchten Termin. Meeting-Link wird direkt in die Buchungsbestätigung eingebettet.',
    logo: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#2D8CFF"/>
        <path d="M4 9a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9z" fill="#fff"/>
        <path d="M15 11l5-3v8l-5-3v-2z" fill="#fff"/>
      </svg>
    ),
    felder: [
      { key: 'accountId',   label: 'Account ID',    typ: 'text',     placeholder: 'xxxxxxxxxxxxxxxxxx',  hilfe: 'Zoom Marketplace → App → Credentials → Account ID'    },
      { key: 'clientId',    label: 'Client ID',     typ: 'text',     placeholder: 'xxxxxxxxxxxxxxxxxx',  hilfe: 'Zoom Marketplace → Deine App → Client ID'              },
      { key: 'clientSecret',label: 'Client Secret', typ: 'password', placeholder: 'xxxxxxxxxxxxxxxxxx',  hilfe: 'Zoom Marketplace → Deine App → Client Secret'          },
    ],
    webhookPfad: '/api/webhooks/zoom',
    n8nDoku: 'Nutze den Zoom Node in n8n. Verbinde über OAuth2 mit Account ID, Client ID & Secret. Trigger: Meeting Created/Ended.',
    scopes: ['meeting:write', 'meeting:read'],
    farbe: '#2D8CFF',
  },
  {
    id:        'google-meet',
    name:      'Google Meet',
    kategorie: 'Video',
    beschreibung: 'Generiere automatisch Google Meet Links bei jeder Buchung. Nutzt dieselben Credentials wie Google Calendar.',
    logo: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#fff" stroke="#E5E7EB"/>
        <path d="M4 8a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" fill="#00832D"/>
        <path d="M15 10.5l5-3v9l-5-3v-3z" fill="#00832D"/>
      </svg>
    ),
    felder: [
      { key: 'clientId',     label: 'Client ID',     typ: 'text',     placeholder: '123456789-abc.apps.googleusercontent.com', hilfe: 'Gleiche Credentials wie Google Calendar (Google Cloud Console)' },
      { key: 'clientSecret', label: 'Client Secret', typ: 'password', placeholder: 'GOCSPX-…',                                  hilfe: 'Gleiche App wie Google Calendar verwenden'                      },
    ],
    webhookPfad: '/api/webhooks/google-meet',
    n8nDoku: 'Google Meet Links werden automatisch via Google Calendar API erstellt (conferenceData). Kein separater Node nötig.',
    scopes: ['https://www.googleapis.com/auth/calendar'],
    farbe: '#00832D',
  },
  {
    id:        'ms-teams',
    name:      'Microsoft Teams',
    kategorie: 'Video',
    beschreibung: 'Erstelle automatisch Teams-Meeting-Links. Nutzt dieselbe Azure App wie Outlook Calendar.',
    logo: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#5059C9"/>
        <circle cx="15" cy="7" r="2.5" fill="#fff"/>
        <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="#fff"/>
        <path d="M17 10h-3.5A1.5 1.5 0 0 0 12 11.5V17h6.5A1.5 1.5 0 0 0 20 15.5V11.5A1.5 1.5 0 0 0 18.5 10H17z" fill="#fff" opacity=".7"/>
        <path d="M4 12.5A1.5 1.5 0 0 1 5.5 11h8a1.5 1.5 0 0 1 1.5 1.5v4A1.5 1.5 0 0 1 13.5 18h-8A1.5 1.5 0 0 1 4 16.5v-4z" fill="#fff"/>
      </svg>
    ),
    felder: [
      { key: 'tenantId',     label: 'Tenant ID',     typ: 'text',     placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', hilfe: 'Gleiche Azure App wie Outlook Calendar'           },
      { key: 'clientId',     label: 'Client ID',     typ: 'text',     placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', hilfe: 'Azure App Registration → Application (client) ID' },
      { key: 'clientSecret', label: 'Client Secret', typ: 'password', placeholder: '~xxxxxxxx~',                           hilfe: 'Azure App Registration → Certificates & secrets'  },
    ],
    webhookPfad: '/api/webhooks/ms-teams',
    n8nDoku: 'Nutze den Microsoft Teams Node in n8n. Verbinde über Microsoft OAuth2 API. Trigger: Meeting Created.',
    scopes: ['OnlineMeetings.ReadWrite'],
    farbe: '#5059C9',
  },
]

// ============================================
// HILFSFUNKTIONEN
// ============================================

function StatusBadge({ status }) {
  const cfg = {
    verbunden:    { label: 'Verbunden',     bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
    fehler:       { label: 'Fehler',        bg: '#FEE2E2', text: '#DC2626', dot: '#EF4444' },
    nicht_verbunden: { label: 'Nicht verbunden', bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' },
  }[status] || { label: status, bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' }
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999, background: cfg.bg, color: cfg.text, fontSize: '0.74rem', fontWeight: 600 }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot }} />
      {cfg.label}
    </div>
  )
}

// ============================================
// HAUPTKOMPONENTE
// ============================================

export default function IntegrationsPage() {

  const [aktiveKat, setAktiveKat]       = useState('Alle')
  const [verbindungen, setVerbindungen] = useState({})   // { [id]: { status, felder, zuletzt } }
  const [offenModal, setOffenModal]     = useState(null) // integration-id | null
  const [formDaten, setFormDaten]       = useState({})
  const [sichtbar, setSichtbar]         = useState({})   // { [key]: bool } — Passwort anzeigen
  const [testLaeuft, setTestLaeuft]     = useState(false)
  const [toast, setToast]               = useState('')
  const [n8nOffen, setN8nOffen]         = useState(null) // integration-id | null

  // ============================================
  // FILTER
  // ============================================

  const gefilterteIntegrationen = aktiveKat === 'Alle'
    ? INTEGRATIONEN
    : INTEGRATIONEN.filter(i => i.kategorie === aktiveKat)

  // ============================================
  // MODAL
  // ============================================

  function openModal(integration) {
    setOffenModal(integration.id)
    const bestehend = verbindungen[integration.id]?.felder || {}
    const initial   = {}
    integration.felder.forEach(f => { initial[f.key] = bestehend[f.key] || '' })
    setFormDaten(initial)
    setSichtbar({})
    setN8nOffen(null)
  }

  function closeModal() {
    setOffenModal(null)
    setFormDaten({})
  }

  // ============================================
  // VERBINDEN / TRENNEN
  // ============================================

  function handleVerbinden() {
    const integration = INTEGRATIONEN.find(i => i.id === offenModal)
    const pflichtFelder = integration.felder.filter(f => !formDaten[f.key]?.trim())
    if (pflichtFelder.length > 0) {
      showToast(`⚠️ Bitte alle Felder ausfüllen`)
      return
    }

    setTestLaeuft(true)
    // Simulierter API-Test (1.5 Sek)
    setTimeout(() => {
      setVerbindungen(prev => ({
        ...prev,
        [offenModal]: {
          status:   'verbunden',
          felder:   { ...formDaten },
          zuletzt:  new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        },
      }))
      setTestLaeuft(false)
      showToast(`✓ ${integration.name} erfolgreich verbunden`)
      closeModal()
    }, 1500)
  }

  function handleTrennen(id) {
    const integration = INTEGRATIONEN.find(i => i.id === id)
    setVerbindungen(prev => {
      const updated = { ...prev }
      delete updated[id]
      return updated
    })
    showToast(`✓ ${integration.name} getrennt`)
  }

  function handleTesten(id) {
    const integration = INTEGRATIONEN.find(i => i.id === id)
    setTestLaeuft(true)
    setTimeout(() => {
      setTestLaeuft(false)
      // Zufällig Erfolg oder Fehler simulieren
      const erfolg = Math.random() > 0.3
      setVerbindungen(prev => ({
        ...prev,
        [id]: { ...prev[id], status: erfolg ? 'verbunden' : 'fehler', zuletzt: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) },
      }))
      showToast(erfolg ? `✓ ${integration.name} Verbindung OK` : `✗ ${integration.name} Verbindungsfehler`)
    }, 1200)
  }

  // ============================================
  // TOAST
  // ============================================

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  const verbundenCount = Object.values(verbindungen).filter(v => v.status === 'verbunden').length
  const aktuellIntegration = INTEGRATIONEN.find(i => i.id === offenModal)

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="page">

      {/* ---- Seitenkopf ---- */}
      <div className="section-head">
        <div>
          <div className="section-head__title">Integrations</div>
          <div className="section-head__sub">Verbinde externe Dienste für Kalender und Video-Meetings.</div>
        </div>
        <div className="section-head__actions">
          {verbundenCount > 0 && (
            <div style={{ padding: '5px 12px', background: '#D1FAE5', border: '1px solid #86EFAC', borderRadius: 'var(--r)', fontSize: '0.78rem', fontWeight: 600, color: '#065F46' }}>
              {verbundenCount} aktive Verbindung{verbundenCount !== 1 ? 'en' : ''}
            </div>
          )}
        </div>
      </div>

      {/* ---- n8n Info-Banner ---- */}
      <div style={{ background: '#F8FAFF', border: '1px solid #C7D7FD', borderRadius: 'var(--r)', padding: '16px 20px', marginBottom: 8, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ fontSize: '1.3rem', flexShrink: 0 }}>⚡</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.86rem', fontWeight: 700, marginBottom: 4, color: '#1D4ED8' }}>n8n Workflow-Integration</div>
          <div style={{ fontSize: '0.80rem', color: '#3B4B6B', lineHeight: 1.5 }}>
            Alle Verbindungsdaten (API-Keys, Webhooks, OAuth Credentials) werden automatisch für deine n8n-Workflows bereitgestellt.
            Klicke auf <strong>„n8n Setup"</strong> bei einer verbundenen Integration für den passenden Node und Webhook-URL.
          </div>
        </div>
        <a href="https://n8n.io" target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, padding: '6px 14px', background: '#1D4ED8', color: '#fff', borderRadius: 'var(--r)', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}>
          n8n öffnen ↗
        </a>
      </div>

      {/* ---- Kategorie-Tabs ---- */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        {KATEGORIEN.map(k => {
          const count = k === 'Alle' ? INTEGRATIONEN.length : INTEGRATIONEN.filter(i => i.kategorie === k).length
          const verbunden = k === 'Alle'
            ? verbundenCount
            : INTEGRATIONEN.filter(i => i.kategorie === k && verbindungen[i.id]?.status === 'verbunden').length
          return (
            <button key={k} onClick={() => setAktiveKat(k)} style={{
              padding: '8px 16px', fontSize: '0.84rem', cursor: 'pointer', borderRadius: 'var(--r)',
              border: aktiveKat === k ? '2px solid var(--black)' : '1px solid var(--border)',
              background: aktiveKat === k ? 'var(--black)' : 'var(--white)',
              color: aktiveKat === k ? 'var(--white)' : 'var(--black)',
              fontWeight: aktiveKat === k ? 600 : 400,
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s',
            }}>
              {k}
              <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>{count}</span>
              {verbunden > 0 && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: aktiveKat === k ? '#4ade80' : '#10B981', flexShrink: 0 }} />
              )}
            </button>
          )
        })}
      </div>

      {/* ---- Integrations-Grid ---- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {gefilterteIntegrationen.map(integration => {
          const verbindung = verbindungen[integration.id]
          const status     = verbindung?.status || 'nicht_verbunden'
          const isVerbunden = status === 'verbunden'

          return (
            <div key={integration.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>

              {/* Farbstreifen oben */}
              <div style={{ height: 3, background: isVerbunden ? integration.farbe : 'var(--border)' }} />

              <div style={{ padding: '20px' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                  <div style={{ flexShrink: 0 }}>{integration.logo}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                      <div style={{ fontSize: '0.96rem', fontWeight: 700 }}>{integration.name}</div>
                      <StatusBadge status={status} />
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--muted)', padding: '2px 8px', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 999, display: 'inline-block' }}>
                      {integration.kategorie}
                    </div>
                  </div>
                </div>

                {/* Beschreibung */}
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.55, marginBottom: 16, margin: '0 0 16px' }}>
                  {integration.beschreibung}
                </p>

                {/* Verbunden-Info */}
                {isVerbunden && verbindung.zuletzt && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 'var(--r)', marginBottom: 14, fontSize: '0.76rem', color: '#065F46' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Verbunden · Zuletzt getestet: {verbindung.zuletzt}
                  </div>
                )}

                {/* Webhooks & n8n Info (wenn verbunden) */}
                {isVerbunden && (
                  <div style={{ marginBottom: 14 }}>
                    <button
                      onClick={() => setN8nOffen(n8nOffen === integration.id ? null : integration.id)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFF', border: '1px solid #C7D7FD', borderRadius: 'var(--r)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, color: '#1D4ED8' }}>
                      <span>⚡ n8n Setup & Webhook-URL</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transition: 'transform 0.15s', transform: n8nOffen === integration.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>

                    {n8nOffen === integration.id && (
                      <div style={{ marginTop: 8, padding: '12px', background: '#F8FAFF', border: '1px solid #C7D7FD', borderRadius: 'var(--r)', display: 'flex', flexDirection: 'column', gap: 10 }}>

                        {/* n8n Doku */}
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>n8n Node</div>
                          <div style={{ fontSize: '0.78rem', color: '#1D4ED8', lineHeight: 1.5 }}>{integration.n8nDoku}</div>
                        </div>

                        {/* Webhook-URL */}
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>Webhook URL</div>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <code style={{ flex: 1, padding: '6px 10px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r)', fontSize: '0.72rem', color: '#1D4ED8', wordBreak: 'break-all' }}>
                              {`https://deine-domain.de${integration.webhookPfad}`}
                            </code>
                            <button
                              onClick={() => { navigator.clipboard.writeText(`https://deine-domain.de${integration.webhookPfad}`); showToast('✓ URL kopiert') }}
                              style={{ flexShrink: 0, padding: '6px 10px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, color: 'var(--black)' }}>
                              Kopieren
                            </button>
                          </div>
                        </div>

                        {/* Scopes */}
                        {integration.scopes.length > 0 && (
                          <div>
                            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>OAuth Scopes</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {integration.scopes.map(s => (
                                <code key={s} style={{ padding: '2px 7px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 999, fontSize: '0.70rem', color: 'var(--black)' }}>{s}</code>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                )}

                {/* Aktions-Buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {isVerbunden ? (
                    <>
                      <button className="btn btn--outline btn--sm"
                        onClick={() => handleTesten(integration.id)}
                        disabled={testLaeuft}
                        style={{ flex: 1, opacity: testLaeuft ? 0.6 : 1 }}>
                        {testLaeuft ? '⏳ Teste…' : '↺ Verbindung testen'}
                      </button>
                      <button className="btn btn--ghost btn--sm" onClick={() => openModal(integration)}>
                        Bearbeiten
                      </button>
                      <button className="btn btn--ghost btn--sm" style={{ color: 'var(--red)' }}
                        onClick={() => { if (confirm(`${integration.name} wirklich trennen?`)) handleTrennen(integration.id) }}>
                        Trennen
                      </button>
                    </>
                  ) : (
                    <button className="btn btn--primary btn--sm" style={{ flex: 1 }}
                      onClick={() => openModal(integration)}>
                      Verbinden
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ============================================
          VERBINDUNGS-MODAL
          ============================================ */}
      {offenModal && aktuellIntegration && (
        <div className="modal-backdrop open">
          <div className="modal" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {aktuellIntegration.logo}
                <div className="modal-header__title">{aktuellIntegration.name} verbinden</div>
              </div>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="modal-body">

              {/* Schritt-Hinweis */}
              <div style={{ background: '#F8FAFF', border: '1px solid #C7D7FD', borderRadius: 'var(--r)', padding: '12px 14px', marginBottom: 20, fontSize: '0.80rem', color: '#1D4ED8', lineHeight: 1.5 }}>
                <strong>Wo finde ich diese Daten?</strong><br />
                {aktuellIntegration.felder.map(f => (
                  <div key={f.key} style={{ marginTop: 4 }}>• <strong>{f.label}:</strong> {f.hilfe}</div>
                ))}
              </div>

              {/* Formular-Felder */}
              {aktuellIntegration.felder.map(f => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label} *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="form-input"
                      type={f.typ === 'password' && !sichtbar[f.key] ? 'password' : f.typ === 'password' ? 'text' : f.typ}
                      placeholder={f.placeholder}
                      value={formDaten[f.key] || ''}
                      onChange={e => setFormDaten(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ paddingRight: f.typ === 'password' ? 40 : 12 }}
                    />
                    {f.typ === 'password' && (
                      <button
                        type="button"
                        onClick={() => setSichtbar(p => ({ ...p, [f.key]: !p[f.key] }))}
                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 0, fontSize: '0.8rem' }}>
                        {sichtbar[f.key] ? '🙈' : '👁'}
                      </button>
                    )}
                  </div>
                  <div className="form-hint">{f.hilfe}</div>
                </div>
              ))}

              {/* Webhook-Info */}
              <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '12px 14px' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Dein Webhook Endpoint</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <code style={{ flex: 1, fontSize: '0.74rem', color: '#1D4ED8', wordBreak: 'break-all' }}>
                    {`https://deine-domain.de${aktuellIntegration.webhookPfad}`}
                  </code>
                  <button
                    onClick={() => { navigator.clipboard.writeText(`https://deine-domain.de${aktuellIntegration.webhookPfad}`); showToast('✓ URL kopiert') }}
                    style={{ flexShrink: 0, padding: '4px 10px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600 }}>
                    Kopieren
                  </button>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 6 }}>
                  Trage diese URL in deinem n8n-Webhook-Node als Trigger-URL ein.
                </div>
              </div>

            </div>

            <div className="modal-footer">
              <button className="btn btn--ghost" onClick={closeModal}>Abbrechen</button>
              <button className="btn btn--primary" onClick={handleVerbinden} disabled={testLaeuft}
                style={{ opacity: testLaeuft ? 0.7 : 1, minWidth: 120 }}>
                {testLaeuft ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                    Verbinde…
                  </span>
                ) : 'Verbinden & testen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Toast --- */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'var(--black)', color: 'var(--white)', padding: '12px 20px', borderRadius: 'var(--r)', fontSize: '0.86rem', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 300, animation: 'modalIn 0.3s ease' }}>
          {toast}
        </div>
      )}

      {/* Spin-Animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

    </div>
  )
}
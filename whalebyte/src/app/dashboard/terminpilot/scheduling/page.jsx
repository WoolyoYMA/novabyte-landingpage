'use client'
import { useState, useMemo } from 'react'

// ============================================
// DEMO-DATEN
// ============================================

const INITIAL_TYPEN = [
  {
    id: 1, name: 'Erstgespräch', beschreibung: 'Lead · Kostenlos',
    dauer: 30, preis: 0, status: 'aktiv',
    buchungen: 47, conversion: 38,
    farbe: '#4338CA', trend: [20,25,30,35,40,44,47],
    link: 'erstgespraech', kategorie: 'Lead',
  },
  {
    id: 2, name: 'Coaching-Session', beschreibung: '1:1 · 149€',
    dauer: 60, preis: 149, status: 'aktiv',
    buchungen: 23, conversion: 55,
    farbe: '#16A34A', trend: [10,12,15,17,19,21,23],
    link: 'coaching-session', kategorie: '1:1',
  },
  {
    id: 3, name: 'Quick-Call', beschreibung: 'Kostenlos',
    dauer: 15, preis: 0, status: 'aktiv',
    buchungen: 61, conversion: 72,
    farbe: '#2563EB', trend: [30,38,44,50,55,58,61],
    link: 'quick-call', kategorie: 'Lead',
  },
  {
    id: 4, name: 'Strategie-Workshop', beschreibung: 'Team · 299€',
    dauer: 90, preis: 299, status: 'entwurf',
    buchungen: 0, conversion: 0,
    farbe: '#D97706', trend: [0,0,0,0,0,0,0],
    link: 'strategie-workshop', kategorie: 'Team',
  },
  {
    id: 5, name: 'VIP-Intensiv', beschreibung: '1:1 · 499€',
    dauer: 120, preis: 499, status: 'aktiv',
    buchungen: 8, conversion: 90,
    farbe: '#BE185D', trend: [2,3,4,5,6,7,8],
    link: 'vip-intensiv', kategorie: '1:1',
  },
  {
    id: 6, name: 'Gruppen-Webinar', beschreibung: 'Gruppe · 49€',
    dauer: 60, preis: 49, status: 'inaktiv',
    buchungen: 12, conversion: 45,
    farbe: '#0891B2', trend: [5,7,8,10,11,12,12],
    link: 'gruppen-webinar', kategorie: 'Gruppe',
  },
  {
    id: 7, name: 'Follow-Up',beschreibung: 'Bestandskunde · Kostenlos',
    dauer: 30, preis: 0, status: 'aktiv',
    buchungen: 19, conversion: 80,
    farbe: '#7C3AED', trend: [8,10,12,14,16,18,19],
    link: 'follow-up', kategorie: '1:1',
  },
]

const KATEGORIEN = ['Alle', 'Lead', '1:1', 'Team', 'Gruppe']

const LEER_TYP = {
  name: '', beschreibung: '', dauer: 30, preis: 0,
  status: 'entwurf', farbe: '#4338CA', link: '', kategorie: 'Lead',
  buchungen: 0, conversion: 0, trend: [0,0,0,0,0,0,0],
}

const FARB_OPTIONEN = [
  '#4338CA','#16A34A','#2563EB','#D97706',
  '#BE185D','#0891B2','#7C3AED','#DC2626',
]

// ============================================
// HILFSFUNKTIONEN
// ============================================

function statusConfig(status) {
  return {
    aktiv:   { label: 'Aktiv',    bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
    entwurf: { label: 'Entwurf',  bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
    inaktiv: { label: 'Inaktiv',  bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' },
  }[status] || { label: status, bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' }
}

function formatPreis(preis) {
  return preis === 0 ? 'Kostenlos' : `${preis} €`
}

function formatDauer(min) {
  if (min < 60) return `${min} Min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// Mini-Sparkline SVG
function Sparkline({ data, farbe }) {
  if (!data || data.length < 2) return <span style={{ color: 'var(--muted)', fontSize: '0.76rem' }}>–</span>
  const max = Math.max(...data, 1)
  const w = 64, h = 28
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - (v / max) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={farbe} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={(data.length-1)/(data.length-1)*w} cy={h-(data[data.length-1]/max)*h} r="3" fill={farbe}/>
    </svg>
  )
}

// Conversion-Ring
function ConversionRing({ value, farbe }) {
  const r = 14, circ = 2 * Math.PI * r
  const dash = (value / 100) * circ
  return (
    <div style={{ position: 'relative', width: 36, height: 36, flexShrink: 0 }}>
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="var(--border)" strokeWidth="3"/>
        <circle cx="18" cy="18" r={r} fill="none" stroke={farbe} strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 18 18)" style={{ transition: 'stroke-dasharray 0.5s' }}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.58rem', fontWeight: 700 }}>
        {value}%
      </div>
    </div>
  )
}

// ============================================
// HAUPTKOMPONENTE
// ============================================

export default function SchedulingPage() {

  const [typen, setTypen]           = useState(INITIAL_TYPEN)
  const [kategorie, setKategorie]   = useState('Alle')
  const [statusFilter, setStatusF]  = useState('alle')
  const [sortBy, setSortBy]         = useState('buchungen_desc')
  const [formModal, setFormModal]   = useState(false)
  const [formEdit, setFormEdit]     = useState(null)
  const [formDaten, setFormDaten]   = useState(LEER_TYP)
  const [formFehler, setFormFehler] = useState({})
  const [detailTyp, setDetailTyp]   = useState(null)
  const [linkKopiert, setLinkKopiert] = useState(null)
  const [toast, setToast]           = useState('')

  // ============================================
  // STATISTIKEN
  // ============================================

  const stats = useMemo(() => {
    const aktiveTypen   = typen.filter(t => t.status === 'aktiv')
    const buchungenGes  = aktiveTypen.reduce((s, t) => s + t.buchungen, 0)
    const convGes       = aktiveTypen.length > 0
      ? Math.round(aktiveTypen.reduce((s, t) => s + t.conversion, 0) / aktiveTypen.length)
      : 0
    const dauerSchnitt  = aktiveTypen.length > 0
      ? Math.round(aktiveTypen.reduce((s, t) => s + t.dauer, 0) / aktiveTypen.length)
      : 0
    return {
      buchungen:   buchungenGes,
      aktiveTypen: aktiveTypen.length,
      gesamtTypen: typen.length,
      conversion:  convGes,
      dauer:       dauerSchnitt,
    }
  }, [typen])

  // ============================================
  // GEFILTERT + SORTIERT
  // ============================================

  const gefiltert = useMemo(() => {
    let r = [...typen]
    if (kategorie !== 'Alle')      r = r.filter(t => t.kategorie === kategorie)
    if (statusFilter !== 'alle')   r = r.filter(t => t.status === statusFilter)
    r.sort((a, b) => {
      switch (sortBy) {
        case 'buchungen_desc': return b.buchungen - a.buchungen
        case 'buchungen_asc':  return a.buchungen - b.buchungen
        case 'conv_desc':      return b.conversion - a.conversion
        case 'dauer_asc':      return a.dauer - b.dauer
        case 'name_asc':       return a.name.localeCompare(b.name)
        default: return 0
      }
    })
    return r
  }, [typen, kategorie, statusFilter, sortBy])

  // ============================================
  // FORMULAR
  // ============================================

  function openNeu() {
    setFormEdit(null)
    setFormDaten({ ...LEER_TYP })
    setFormFehler({})
    setFormModal(true)
  }

  function openEdit(typ) {
    setFormEdit(typ)
    setFormDaten({ ...typ })
    setFormFehler({})
    setFormModal(true)
  }

  function validiereForm() {
    const f = {}
    if (!formDaten.name.trim()) f.name = 'Name ist Pflichtfeld'
    if (formDaten.dauer < 5)    f.dauer = 'Mindestens 5 Minuten'
    if (formDaten.preis < 0)    f.preis = 'Kein negativer Preis'
    return f
  }

  function handleSave() {
    const fehler = validiereForm()
    if (Object.keys(fehler).length > 0) { setFormFehler(fehler); return }

    const link = formDaten.link || slugify(formDaten.name)

    if (formEdit) {
      setTypen(prev => prev.map(t => t.id === formEdit.id ? { ...t, ...formDaten, link } : t))
      if (detailTyp?.id === formEdit.id) setDetailTyp(prev => ({ ...prev, ...formDaten, link }))
      showToast('✓ Termin-Typ aktualisiert')
    } else {
      const neu = { ...formDaten, id: Date.now(), link, trend: [0,0,0,0,0,0,0] }
      setTypen(prev => [...prev, neu])
      showToast('✓ Termin-Typ erstellt')
    }
    setFormModal(false)
  }

  function handleDelete(id) {
    setTypen(prev => prev.filter(t => t.id !== id))
    setDetailTyp(null)
    showToast('✓ Termin-Typ gelöscht')
  }

  function handleStatusToggle(id) {
    setTypen(prev => prev.map(t => {
      if (t.id !== id) return t
      const next = t.status === 'aktiv' ? 'inaktiv' : 'aktiv'
      return { ...t, status: next }
    }))
  }

  function handleLinkKopieren(typ) {
    const url = `https://terminpilot.de/b/${typ.link}`
    navigator.clipboard.writeText(url)
    setLinkKopiert(typ.id)
    setTimeout(() => setLinkKopiert(null), 2000)
    showToast('✓ Buchungslink kopiert')
  }

  // ============================================
  // TOAST
  // ============================================

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="page">

      {/* ---- Seitenkopf ---- */}
      <div className="section-head">
        <div>
          <div className="section-head__title">Scheduling</div>
          <div className="section-head__sub">Verwalte deine Termin-Typen.</div>
        </div>
        <div className="section-head__actions">
          <button className="btn btn--ghost btn--sm"
            onClick={() => showToast('→ Öffentliche Buchungsseite öffnen')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            Buchungsseite
          </button>
          <button className="btn btn--primary btn--sm" onClick={openNeu}>
            + Neuer Termin-Typ
          </button>
        </div>
      </div>

      {/* ============================================
          STATISTIK-KACHELN
          ============================================ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          {
            label: 'Buchungen (7d)',
            value: stats.buchungen,
            delta: '+18%',
            deltaUp: true,
            sub: 'letzte 7 Tage',
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8"  y1="2" x2="8"  y2="6"/>
                <line x1="3"  y1="10" x2="21" y2="10"/>
              </svg>
            ),
          },
          {
            label: 'Aktive Typen',
            value: stats.aktiveTypen,
            delta: `von ${stats.gesamtTypen} gesamt`,
            deltaUp: null,
            sub: 'Termin-Typen',
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            ),
          },
          {
            label: 'Conversion',
            value: `${stats.conversion}%`,
            delta: '+4%',
            deltaUp: true,
            sub: 'Ø über alle Typen',
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="20" x2="12" y2="10"/>
                <line x1="18" y1="20" x2="18" y2="4"/>
                <line x1="6"  y1="20" x2="6"  y2="16"/>
              </svg>
            ),
          },
          {
            label: 'Ø Dauer',
            value: formatDauer(stats.dauer),
            delta: '−2 Min',
            deltaUp: false,
            sub: 'aktive Typen',
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            ),
          },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted)' }}>
                {s.label}
              </div>
              <div style={{ color: 'var(--muted)' }}>{s.icon}</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, marginBottom: 6 }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              {s.deltaUp !== null ? (
                <span style={{ color: s.deltaUp ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
                  {s.delta}
                </span>
              ) : (
                <span style={{ color: 'var(--muted)' }}>{s.delta}</span>
              )}
              <span style={{ color: 'var(--muted)' }}>{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================
          FILTER + TABELLE
          ============================================ */}
      <div className="card">

        {/* Filter-Zeile */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Kategorie-Tabs */}
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            {KATEGORIEN.map(k => (
              <button key={k} onClick={() => setKategorie(k)} style={{
                padding: '7px 14px', fontSize: '0.82rem', cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
                background: kategorie === k ? 'var(--black)' : 'var(--white)',
                color: kategorie === k ? 'var(--white)' : 'var(--muted)',
                fontWeight: kategorie === k ? 600 : 400, transition: 'all 0.15s',
              }}>
                {k}
              </button>
            ))}
          </div>

          {/* Status-Filter */}
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            {[
              { value: 'alle',    label: 'Alle'     },
              { value: 'aktiv',   label: 'Aktiv'    },
              { value: 'entwurf', label: 'Entwurf'  },
              { value: 'inaktiv', label: 'Inaktiv'  },
            ].map(s => (
              <button key={s.value} onClick={() => setStatusF(s.value)} style={{
                padding: '7px 12px', fontSize: '0.82rem', cursor: 'pointer', border: 'none',
                background: statusFilter === s.value ? 'var(--black)' : 'var(--white)',
                color: statusFilter === s.value ? 'var(--white)' : 'var(--muted)',
                fontWeight: statusFilter === s.value ? 600 : 400, transition: 'all 0.15s',
              }}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Sortierung */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
            padding: '7px 12px', fontSize: '0.82rem', border: '1px solid var(--border)',
            borderRadius: 'var(--r)', background: 'var(--white)', outline: 'none', cursor: 'pointer',
          }}>
            <option value="buchungen_desc">Meiste Buchungen</option>
            <option value="buchungen_asc">Wenigste Buchungen</option>
            <option value="conv_desc">Höchste Conversion</option>
            <option value="dauer_asc">Kürzeste Dauer</option>
            <option value="name_asc">Name A–Z</option>
          </select>

          <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--muted)' }}>
            {gefiltert.length} von {typen.length} Typen
          </span>
        </div>

        {/* TABELLE */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-alt)' }}>
                {['Name', 'Dauer', 'Preis', 'Status', 'Buchungen', 'Conversion', 'Trend', 'Aktionen'].map((h, i) => (
                  <th key={i} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.74rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gefiltert.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.86rem' }}>
                    Keine Termin-Typen für die aktuellen Filter.
                  </td>
                </tr>
              ) : gefiltert.map((typ, idx) => {
                const sc = statusConfig(typ.status)
                return (
                  <tr key={typ.id}
                    style={{ borderBottom: idx < gefiltert.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-alt)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--white)'}>

                    {/* Name */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: typ.farbe, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{typ.name}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{typ.beschreibung}</div>
                        </div>
                      </div>
                    </td>

                    {/* Dauer */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>{formatDauer(typ.dauer)}</span>
                    </td>

                    {/* Preis */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '0.84rem', color: typ.preis > 0 ? '#16A34A' : 'var(--muted)', fontWeight: typ.preis > 0 ? 600 : 400 }}>
                        {formatPreis(typ.preis)}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <div
                        onClick={() => typ.status !== 'entwurf' && handleStatusToggle(typ.id)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, background: sc.bg, color: sc.text, fontSize: '0.76rem', fontWeight: 600, cursor: typ.status !== 'entwurf' ? 'pointer' : 'default' }}
                        title={typ.status !== 'entwurf' ? 'Klicken zum Umschalten' : ''}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
                        {sc.label}
                      </div>
                    </td>

                    {/* Buchungen */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{typ.buchungen}</span>
                    </td>

                    {/* Conversion */}
                    <td style={{ padding: '14px 16px' }}>
                      {typ.conversion > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <ConversionRing value={typ.conversion} farbe={typ.farbe} />
                        </div>
                      ) : (
                        <span style={{ color: 'var(--muted)', fontSize: '0.84rem' }}>–</span>
                      )}
                    </td>

                    {/* Trend */}
                    <td style={{ padding: '14px 16px' }}>
                      <Sparkline data={typ.trend} farbe={typ.farbe} />
                    </td>

                    {/* Aktionen */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn--ghost btn--sm"
                          onClick={() => setDetailTyp(typ)}>
                          Details
                        </button>
                        <button className="btn btn--ghost btn--sm"
                          onClick={() => openEdit(typ)}
                          style={{ padding: '5px 8px' }}
                          title="Bearbeiten">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button className="btn btn--ghost btn--sm"
                          onClick={() => handleLinkKopieren(typ)}
                          style={{ padding: '5px 8px', color: linkKopiert === typ.id ? '#16A34A' : 'var(--muted)' }}
                          title="Buchungslink kopieren">
                          {linkKopiert === typ.id ? (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          ) : (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                            </svg>
                          )}
                        </button>
                        <button className="btn btn--ghost btn--sm"
                          onClick={() => { if (confirm(`„${typ.name}" wirklich löschen?`)) handleDelete(typ.id) }}
                          style={{ padding: '5px 8px', color: 'var(--red)' }}
                          title="Löschen">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
          <span>{gefiltert.length} Termin-Typ{gefiltert.length !== 1 ? 'en' : ''} angezeigt</span>
          <span>{typen.filter(t => t.status === 'aktiv').length} aktiv · {typen.filter(t => t.status === 'entwurf').length} Entwurf · {typen.filter(t => t.status === 'inaktiv').length} inaktiv</span>
        </div>
      </div>

      {/* ============================================
          DETAIL MODAL
          ============================================ */}
      {detailTyp && (
        <div className="modal-backdrop open">
          <div className="modal" style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: detailTyp.farbe }} />
                <div className="modal-header__title">{detailTyp.name}</div>
              </div>
              <button className="modal-close" onClick={() => setDetailTyp(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ padding: 0 }}>

              {/* Banner */}
              <div style={{ background: 'var(--bg-alt)', padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  {(() => { const sc = statusConfig(detailTyp.status); return (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, background: sc.bg, color: sc.text, fontSize: '0.76rem', fontWeight: 600 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
                      {sc.label}
                    </div>
                  )})()}
                  <span style={{ padding: '3px 9px', borderRadius: 999, background: 'var(--white)', border: '1px solid var(--border)', fontSize: '0.76rem' }}>{detailTyp.kategorie}</span>
                  <span style={{ padding: '3px 9px', borderRadius: 999, background: 'var(--white)', border: '1px solid var(--border)', fontSize: '0.76rem' }}>{formatDauer(detailTyp.dauer)}</span>
                  <span style={{ padding: '3px 9px', borderRadius: 999, background: 'var(--white)', border: '1px solid var(--border)', fontSize: '0.76rem', color: detailTyp.preis > 0 ? '#16A34A' : 'var(--muted)', fontWeight: detailTyp.preis > 0 ? 600 : 400 }}>{formatPreis(detailTyp.preis)}</span>
                </div>
                <button className="btn btn--primary btn--sm" onClick={() => { setDetailTyp(null); openEdit(detailTyp) }}>
                  Bearbeiten
                </button>
              </div>

              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Statistiken */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[
                    { label: 'Buchungen', value: detailTyp.buchungen },
                    { label: 'Conversion', value: `${detailTyp.conversion}%` },
                    { label: 'Dauer', value: formatDauer(detailTyp.dauer) },
                  ].map(s => (
                    <div key={s.label} style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '14px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>{s.value}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Trend */}
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Buchungs-Trend (7 Tage)</div>
                  <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px', display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
                    {detailTyp.trend.map((v, i) => {
                      const max = Math.max(...detailTyp.trend, 1)
                      const h = Math.max((v / max) * 48, 4)
                      const tage = ['Mo','Di','Mi','Do','Fr','Sa','So']
                      return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: '100%', height: h, background: detailTyp.farbe, borderRadius: '3px 3px 0 0', opacity: i === detailTyp.trend.length - 1 ? 1 : 0.5, transition: 'height 0.3s' }} />
                          <div style={{ fontSize: '0.60rem', color: 'var(--muted)' }}>{tage[i]}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Buchungslink */}
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Buchungslink</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <code style={{ flex: 1, padding: '8px 12px', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--r)', fontSize: '0.78rem', color: '#1D4ED8', wordBreak: 'break-all' }}>
                      {`https://terminpilot.de/b/${detailTyp.link}`}
                    </code>
                    <button className="btn btn--ghost btn--sm" onClick={() => handleLinkKopieren(detailTyp)}>
                      {linkKopiert === detailTyp.id ? '✓ Kopiert' : 'Kopieren'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn--ghost" style={{ color: 'var(--red)' }}
                onClick={() => { if (confirm(`„${detailTyp.name}" wirklich löschen?`)) handleDelete(detailTyp.id) }}>
                Löschen
              </button>
              <button className="btn btn--ghost" onClick={() => {
                handleStatusToggle(detailTyp.id)
                setDetailTyp(prev => ({ ...prev, status: prev.status === 'aktiv' ? 'inaktiv' : 'aktiv' }))
              }}>
                {detailTyp.status === 'aktiv' ? 'Deaktivieren' : 'Aktivieren'}
              </button>
              <button className="btn btn--ghost" onClick={() => setDetailTyp(null)}>Schließen</button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          FORMULAR MODAL
          ============================================ */}
      {formModal && (
        <div className="modal-backdrop open">
          <div className="modal" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <div className="modal-header__title">{formEdit ? 'Termin-Typ bearbeiten' : 'Neuer Termin-Typ'}</div>
              <button className="modal-close" onClick={() => setFormModal(false)}>✕</button>
            </div>
            <div className="modal-body">

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className={`form-input${formFehler.name ? ' error' : ''}`}
                    placeholder="z.B. Erstgespräch"
                    value={formDaten.name}
                    onChange={e => {
                      const name = e.target.value
                      setFormDaten(p => ({ ...p, name, link: p.link || slugify(name) }))
                    }} />
                  {formFehler.name && <div className="form-hint" style={{ color: 'var(--red)' }}>{formFehler.name}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Kategorie</label>
                  <select className="form-input" value={formDaten.kategorie}
                    onChange={e => setFormDaten(p => ({ ...p, kategorie: e.target.value }))}>
                    {['Lead','1:1','Team','Gruppe'].map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Beschreibung</label>
                <input className="form-input" placeholder="z.B. Lead · Kostenlos"
                  value={formDaten.beschreibung}
                  onChange={e => setFormDaten(p => ({ ...p, beschreibung: e.target.value }))} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Dauer (Minuten) *</label>
                  <input type="number" className={`form-input${formFehler.dauer ? ' error' : ''}`}
                    min="5" step="5" value={formDaten.dauer}
                    onChange={e => setFormDaten(p => ({ ...p, dauer: Number(e.target.value) }))} />
                  {formFehler.dauer && <div className="form-hint" style={{ color: 'var(--red)' }}>{formFehler.dauer}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Preis (€)</label>
                  <input type="number" className={`form-input${formFehler.preis ? ' error' : ''}`}
                    min="0" step="1" value={formDaten.preis}
                    onChange={e => setFormDaten(p => ({ ...p, preis: Number(e.target.value) }))} />
                  {formFehler.preis && <div className="form-hint" style={{ color: 'var(--red)' }}>{formFehler.preis}</div>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-input" value={formDaten.status}
                    onChange={e => setFormDaten(p => ({ ...p, status: e.target.value }))}>
                    <option value="aktiv">Aktiv</option>
                    <option value="entwurf">Entwurf</option>
                    <option value="inaktiv">Inaktiv</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">URL-Slug</label>
                  <input className="form-input" placeholder="erstgespraech"
                    value={formDaten.link}
                    onChange={e => setFormDaten(p => ({ ...p, link: slugify(e.target.value) }))} />
                  <div className="form-hint">terminpilot.de/b/{formDaten.link || '…'}</div>
                </div>
              </div>

              {/* Farbe */}
              <div className="form-group">
                <label className="form-label">Farbe</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {FARB_OPTIONEN.map(f => (
                    <button key={f} type="button" onClick={() => setFormDaten(p => ({ ...p, farbe: f }))}
                      style={{ width: 28, height: 28, borderRadius: '50%', background: f, border: formDaten.farbe === f ? '3px solid var(--black)' : '2px solid transparent', cursor: 'pointer', transition: 'border 0.15s' }} />
                  ))}
                </div>
              </div>

            </div>
            <div className="modal-footer">
              <button className="btn btn--ghost" onClick={() => setFormModal(false)}>Abbrechen</button>
              {formEdit && (
                <button className="btn btn--ghost" style={{ color: 'var(--red)' }}
                  onClick={() => { if (confirm(`„${formEdit.name}" wirklich löschen?`)) { handleDelete(formEdit.id); setFormModal(false) } }}>
                  Löschen
                </button>
              )}
              <button className="btn btn--primary" onClick={handleSave}>
                {formEdit ? 'Speichern' : 'Erstellen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'var(--black)', color: 'var(--white)', padding: '12px 20px', borderRadius: 'var(--r)', fontSize: '0.86rem', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 300, animation: 'modalIn 0.3s ease' }}>
          {toast}
        </div>
      )}

    </div>
  )
}
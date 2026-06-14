'use client'
import { useState } from 'react'

// ============================================
// KONFIGURATION
// ============================================

const HEUTE = '13' // TODO: ersetzen mit → new Date().getDate().toString()

const TABS = ['Alle', 'Anstehend', 'Heute', 'Abgeschlossen']

const LEER_FORM = { name: '', email: '', telefon: '', type: 'Erstgespräch', datum: '', notiz: '' }

const MONATS_REIHENFOLGE = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez']

// ============================================
// DUMMY-DATEN (später ersetzen durch Supabase)
// ============================================

const INITIAL_MEETINGS = [
  { day: '13', mon: 'Jun', name: 'Anna Bauer',   email: 'anna.bauer@email.de',   telefon: '+49 151 1234567', type: 'Erstgespräch',    time: '10:00 – 10:30', ort: 'Google Meet', status: 'confirmed', badge: 'badge--green',  notiz: 'Interessiert an Coaching-Paket.' },
  { day: '13', mon: 'Jun', name: 'Thomas Klein', email: 'thomas.klein@email.de', telefon: '+49 160 9876543', type: 'Coaching-Session', time: '14:00 – 15:00', ort: 'Zoom',        status: 'confirmed', badge: 'badge--green',  notiz: '' },
  { day: '14', mon: 'Jun', name: 'Sara Müller',  email: 'sara.mueller@email.de', telefon: '+49 170 5554433', type: 'Quick-Call',       time: '09:00 – 09:15', ort: 'Telefon',     status: 'pending',   badge: 'badge--yellow', notiz: '' },
  { day: '15', mon: 'Jun', name: 'Markus Weber', email: 'markus.weber@email.de', telefon: '+49 152 3334455', type: 'Erstgespräch',    time: '11:00 – 11:30', ort: 'Google Meet', status: 'pending',   badge: 'badge--yellow', notiz: 'Noch keine Bestätigung.' },
  { day: '16', mon: 'Jun', name: 'Lisa Hofmann', email: 'lisa.hofmann@email.de', telefon: '+49 176 7778899', type: 'Coaching-Session', time: '15:00 – 16:00', ort: 'Zoom',        status: 'confirmed', badge: 'badge--green',  notiz: '' },
  { day: '10', mon: 'Jun', name: 'Peter Schulz', email: 'peter.schulz@email.de', telefon: '+49 157 2221100', type: 'Quick-Call',       time: '08:00 – 08:15', ort: 'Telefon',     status: 'completed', badge: 'badge--gray',   notiz: 'Abgeschlossen.' },
  { day: '09', mon: 'Jun', name: 'Julia Wagner', email: 'julia.wagner@email.de', telefon: '+49 163 4445566', type: 'Erstgespräch',    time: '13:00 – 13:30', ort: 'Google Meet', status: 'cancelled', badge: 'badge--red',    notiz: 'Kurzfristig storniert.' },
  { day: '02', mon: 'Jul', name: 'Klaus Braun',  email: 'klaus.braun@email.de',  telefon: '+49 172 8887766', type: 'Erstgespräch',    time: '09:00 – 09:30', ort: 'Google Meet', status: 'confirmed', badge: 'badge--green',  notiz: '' },
  { day: '08', mon: 'Jul', name: 'Eva Richter',  email: 'eva.richter@email.de',  telefon: '+49 151 3334455', type: 'Coaching-Session', time: '11:00 – 12:00', ort: 'Zoom',        status: 'pending',   badge: 'badge--yellow', notiz: 'Erst-Kontakt über Instagram.' },
]

// ============================================
// HAUPTKOMPONENTE
// ============================================

export default function MeetingsPage() {

  const [meetings, setMeetings]             = useState(INITIAL_MEETINGS)
  const [activeTab, setActiveTab]           = useState('Alle')
  const [search, setSearch]                 = useState('')
  const [typFilter, setTypFilter]           = useState('Alle Typen')
  const [zeitraumFilter, setZeitraumFilter] = useState('alle')
  const [zeitraumOpen, setZeitraumOpen]     = useState(false)
  const [subMenuOpen, setSubMenuOpen]       = useState(false)
  const [addModal, setAddModal]             = useState(false)
  const [detailMeeting, setDetailMeeting]   = useState(null)
  const [editMeeting, setEditMeeting]       = useState(null)
  const [form, setForm]                     = useState(LEER_FORM)
  const [editForm, setEditForm]             = useState(LEER_FORM)
  const [toast, setToast]                   = useState('')

  // Nur Monate die wirklich in meetings vorkommen, sortiert nach Kalender
  // Wird neu berechnet wenn meetings sich ändert (z.B. nach handleAdd)
  const vorhandeneMonate = MONATS_REIHENFOLGE.filter(mon =>
    meetings.some(m => m.mon === mon)
  )

  // ============================================
  // FILTER-LOGIK
  // ============================================

  const filtered = meetings.filter(m => {
    const matchTab =
      activeTab === 'Alle'          ? true :
      activeTab === 'Heute'         ? m.day === HEUTE :
      activeTab === 'Anstehend'     ? (m.status === 'confirmed' || m.status === 'pending') :
      activeTab === 'Abgeschlossen' ? (m.status === 'completed' || m.status === 'cancelled') : true

    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())

    const matchTyp = typFilter === 'Alle Typen' ? true : m.type === typFilter

    const matchZeitraum = (() => {
      if (zeitraumFilter === 'alle')  return true
      if (zeitraumFilter === 'heute') return m.day === HEUTE && m.mon === 'Jun'
      if (zeitraumFilter === 'woche') {
        const day = parseInt(m.day)
        return m.mon === 'Jun' && day >= 9 && day <= 15
      }
      if (zeitraumFilter === 'monat') return m.mon === 'Jun'
      // Einzelner Monat z.B. 'Jun', 'Jul'
      return m.mon === zeitraumFilter
    })()

    return matchTab && matchSearch && matchTyp && matchZeitraum
  })

  // ============================================
  // HILFSFUNKTIONEN
  // ============================================

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  // Lesbarer Label für den Zeitraum-Select
  function zeitraumLabel() {
    if (zeitraumFilter === 'alle')                    return 'Alle Zeiträume'
    if (zeitraumFilter === 'heute')                   return 'Heute'
    if (zeitraumFilter === 'woche')                   return 'Diese Woche'
    if (zeitraumFilter === 'monat')                   return 'Dieser Monat'
    if (MONATS_REIHENFOLGE.includes(zeitraumFilter))  return `Monat: ${zeitraumFilter}`
    return 'Alle Zeiträume'
  }

  function handleAdd() {
    if (!form.name || !form.datum) return
    const date  = new Date(form.datum)
    const day   = date.getDate().toString()
    const mon   = date.toLocaleString('de-DE', { month: 'short' })
    const hours = date.getHours().toString().padStart(2, '0')
    const mins  = date.getMinutes().toString().padStart(2, '0')
    setMeetings(prev => [{
      day, mon,
      name: form.name, email: form.email, telefon: form.telefon,
      type: form.type, time: `${hours}:${mins}`,
      ort: 'Manuell', status: 'confirmed', badge: 'badge--green', notiz: form.notiz,
    }, ...prev])
    setForm(LEER_FORM)
    setAddModal(false)
    showToast('✓ Termin wurde hinzugefügt')
  }

  function handleEditOpen(m) {
    setEditMeeting(m)
    setEditForm({ name: m.name, email: m.email, telefon: m.telefon, type: m.type, datum: '', notiz: m.notiz })
  }

  function handleEditSave() {
    if (!editForm.name) return
    setMeetings(prev =>
      prev.map(m => m === editMeeting ? {
        ...m,
        name: editForm.name, email: editForm.email,
        telefon: editForm.telefon, type: editForm.type, notiz: editForm.notiz,
        ...(editForm.datum ? (() => {
          const date = new Date(editForm.datum)
          return {
            day:  date.getDate().toString(),
            mon:  date.toLocaleString('de-DE', { month: 'short' }),
            time: `${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`,
          }
        })() : {}),
      } : m)
    )
    setEditMeeting(null)
    showToast('✓ Termin wurde aktualisiert')
  }

  function handleBestaetigen(target) {
    setMeetings(prev =>
      prev.map(m => m === target ? { ...m, status: 'confirmed', badge: 'badge--green' } : m)
    )
    showToast('✓ Termin wurde bestätigt')
  }

  function handleStornieren() {
    setMeetings(prev =>
      prev.map(m => m === detailMeeting ? { ...m, status: 'cancelled', badge: 'badge--red' } : m)
    )
    setDetailMeeting(null)
    showToast('✓ Termin wurde storniert')
  }

  function handleExport() {
    const header = ['Name', 'E-Mail', 'Telefon', 'Typ', 'Datum', 'Uhrzeit', 'Ort', 'Status', 'Notiz']
    const rows   = filtered.map(m => [
      m.name, m.email, m.telefon, m.type,
      `${m.day}. ${m.mon}`, m.time, m.ort, m.status, m.notiz
    ])
    const csv = [header, ...rows]
      .map(row => row.map(v => `"${(v ?? '').toString().replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `termine-export-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast(`✓ ${filtered.length} Termine exportiert`)
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="page">

      {/* --- Seitenkopf --- */}
      <div className="section-head">
        <div>
          <div className="section-head__title">Meetings</div>
          <div className="section-head__sub">Alle gebuchten Termine im Überblick.</div>
        </div>
        <div className="section-head__actions">
          <button className="btn btn--ghost btn--sm" onClick={handleExport}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exportieren ({filtered.length})
          </button>
          <button className="btn btn--outline btn--sm" onClick={() => setAddModal(true)}>
            + Manuell hinzufügen
          </button>
        </div>
      </div>

      {/* --- KPI Kacheln --- */}
      <div className="kpi-grid">
        {[
          { label: 'Heute',         value: meetings.filter(m => m.day === HEUTE).length,         delta: `am ${HEUTE}. Jun`,  tab: 'Heute',         color: '' },
          { label: 'Gesamt',        value: meetings.length,                                       delta: 'alle Termine',      tab: 'Alle',          color: 'up' },
          { label: 'Ausstehend',    value: meetings.filter(m => m.status === 'pending').length,   delta: 'Bestätigung nötig', tab: 'Anstehend',     color: 'yellow' },
          { label: 'Stornierungen', value: meetings.filter(m => m.status === 'cancelled').length, delta: 'diesen Monat',      tab: 'Abgeschlossen', color: 'down' },
        ].map(k => (
          <div key={k.tab} className="kpi-card"
            onClick={() => setActiveTab(k.tab)}
            style={{ cursor: 'pointer', outline: activeTab === k.tab ? '2px solid var(--black)' : 'none' }}>
            <div className="kpi-card__label">{k.label}</div>
            <div className="kpi-card__value">{k.value}</div>
            <div className={`kpi-card__delta ${k.color}`}
              style={k.color === 'yellow' ? { color: 'var(--yellow)' } : {}}>
              {k.delta}
            </div>
          </div>
        ))}
      </div>

      {/* --- Terminliste --- */}
      <div className="card">

        {/* Filter-Bar — alle drei Felder identisch im Design */}
        <div className="card-header">
          <div className="card-header__title">
            Termine
            <span style={{ marginLeft: 8, fontSize: '0.78rem', fontWeight: 400, color: 'var(--muted)' }}>
              {filtered.length} Einträge
            </span>
          </div>

          <div className="filter-bar">

            {/* 1. Suche — normales input */}
            <input
              type="text"
              placeholder="Name suchen..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            {/* 2. Typ-Filter — normales select */}
            <select value={typFilter} onChange={e => setTypFilter(e.target.value)}>
              <option value="Alle Typen">Alle Typen</option>
              <option value="Erstgespräch">Erstgespräch</option>
              <option value="Coaching-Session">Coaching-Session</option>
              <option value="Quick-Call">Quick-Call</option>
            </select>

            {/* 3. Zeitraum — custom dropdown, gleiche Optik wie select oben */}
            <div style={{ position: 'relative' }}>

              {/* Trigger — exakt gleiche Klassen/Styles wie das <select> oben */}
              <div
                className="filter-select-trigger"
                onClick={() => { setZeitraumOpen(o => !o); setSubMenuOpen(false) }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  // Gleiche Dimensionen wie select aus globals.css
                  height: '36px', padding: '0 32px 0 12px', minWidth: 150,
                  border: '1px solid var(--border)', borderRadius: 'var(--r)',
                  background: 'var(--white)',
                  fontSize: '0.84rem', color: 'var(--black)',
                  cursor: 'pointer', userSelect: 'none', boxSizing: 'border-box',
                  // Nativer Chevron-Pfeil wie bei select
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                  backgroundSize: '12px',
                  whiteSpace: 'nowrap',
                }}>
                {zeitraumLabel()}
              </div>

              {zeitraumOpen && (
                <>
                  {/* Backdrop — schließt Dropdown bei Klick außerhalb */}
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 90 }}
                    onClick={() => { setZeitraumOpen(false); setSubMenuOpen(false) }}
                  />

                  {/* Dropdown-Panel */}
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 4px)',
                    background: 'var(--white)', border: '1px solid var(--border)',
                    borderRadius: 'var(--r)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    minWidth: 180, zIndex: 100, padding: '4px 0',
                  }}>

                    {/* Standard-Zeitraum-Optionen */}
                    {[
                      { label: 'Alle Zeiträume', value: 'alle'  },
                      { label: 'Heute',           value: 'heute' },
                      { label: 'Diese Woche',     value: 'woche' },
                      { label: 'Dieser Monat',    value: 'monat' },
                    ].map(o => (
                      <div key={o.value}
                        onClick={() => { setZeitraumFilter(o.value); setZeitraumOpen(false); setSubMenuOpen(false) }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-alt)'; setSubMenuOpen(false) }}
                        onMouseLeave={e => { e.currentTarget.style.background = zeitraumFilter === o.value ? 'var(--bg-alt)' : 'transparent' }}
                        style={{
                          padding: '8px 14px', fontSize: '0.84rem', cursor: 'pointer',
                          background: zeitraumFilter === o.value ? 'var(--bg-alt)' : 'transparent',
                          fontWeight: zeitraumFilter === o.value ? 600 : 400,
                        }}>
                        {o.label}
                      </div>
                    ))}

                    {/* Monat-Eintrag — nur anzeigen wenn Monatsdaten vorhanden */}
                    {vorhandeneMonate.length > 0 && (
                      <>
                        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />

                        {/* Monat-Zeile mit Submenu-Pfeil */}
                        <div
                          style={{ position: 'relative' }}
                          onMouseEnter={() => setSubMenuOpen(true)}
                          onMouseLeave={() => setSubMenuOpen(false)}>

                          <div style={{
                            padding: '8px 14px', fontSize: '0.84rem', cursor: 'pointer',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: MONATS_REIHENFOLGE.includes(zeitraumFilter) ? 'var(--bg-alt)' : 'transparent',
                            fontWeight: MONATS_REIHENFOLGE.includes(zeitraumFilter) ? 600 : 400,
                          }}>
                            <span>
                              Monat{MONATS_REIHENFOLGE.includes(zeitraumFilter) ? `: ${zeitraumFilter}` : ''}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>›</span>
                          </div>

                          {/* Monats-Submenu — öffnet links, nur vorhandene Monate */}
                          {subMenuOpen && (
                            <div style={{
                              position: 'absolute',
                              right: 'calc(100% + 4px)', top: 0,
                              background: 'var(--white)', border: '1px solid var(--border)',
                              borderRadius: 'var(--r)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                              display: 'grid',
                              gridTemplateColumns: vorhandeneMonate.length >= 3 ? '1fr 1fr 1fr'
                                                 : vorhandeneMonate.length === 2 ? '1fr 1fr' : '1fr',
                              gap: 2, padding: 8, zIndex: 101,
                              minWidth: vorhandeneMonate.length >= 3 ? 160 : 100,
                            }}>
                              {vorhandeneMonate.map(mon => (
                                <div key={mon}
                                  onClick={() => { setZeitraumFilter(mon); setZeitraumOpen(false); setSubMenuOpen(false) }}
                                  onMouseEnter={e => { if (zeitraumFilter !== mon) e.currentTarget.style.background = 'var(--bg-alt)' }}
                                  onMouseLeave={e => { e.currentTarget.style.background = zeitraumFilter === mon ? 'var(--black)' : 'transparent' }}
                                  style={{
                                    padding: '7px 10px', fontSize: '0.82rem',
                                    cursor: 'pointer', textAlign: 'center',
                                    borderRadius: 'var(--r)',
                                    background: zeitraumFilter === mon ? 'var(--black)' : 'transparent',
                                    color: zeitraumFilter === mon ? 'var(--white)' : 'inherit',
                                    userSelect: 'none',
                                  }}>
                                  {mon}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
            {/* ---- Ende Zeitraum Dropdown ---- */}

          </div>
        </div>

        {/* Tabs */}
        <div className="tabs" style={{ padding: '0 24px', marginBottom: 0 }}>
          {TABS.map(t => (
            <div key={t}
              className={`tab ${activeTab === t ? 'active' : ''}`}
              onClick={() => setActiveTab(t)}>
              {t}
            </div>
          ))}
        </div>

        {/* Termin-Zeilen */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.86rem' }}>
              Keine Termine gefunden.
            </div>
          ) : (
            filtered.map((m, i) => (
              <div className="meeting-item" key={i}>
                <div className="meeting-item__date">
                  <div className="meeting-item__date-day">{m.day}</div>
                  <div className="meeting-item__date-mon">{m.mon}</div>
                </div>
                <div className="meeting-item__info">
                  <div className="meeting-item__name">{m.name}</div>
                  <div className="meeting-item__meta">
                    <span>{m.type}</span>
                    <span>🕐 {m.time}</span>
                    <span>📍 {m.ort}</span>
                  </div>
                </div>
                <div className="meeting-item__actions">
                  <span className={`badge ${m.badge}`}>{m.status}</span>
                  {m.status === 'pending' && (
                    <button className="btn btn--outline btn--sm"
                      style={{ borderColor: 'var(--green)', color: 'var(--green)' }}
                      onClick={() => handleBestaetigen(m)}>
                      ✓ Bestätigen
                    </button>
                  )}
                  <button className="btn btn--ghost btn--sm" onClick={() => handleEditOpen(m)}>Bearbeiten</button>
                  <button className="btn btn--ghost btn--sm" onClick={() => setDetailMeeting(m)}>Details</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ============================================
          DETAIL MODAL
          ============================================ */}
      {detailMeeting && (
        <div className="modal-backdrop open">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-header__title">{detailMeeting.name}</div>
              <button className="modal-close" onClick={() => setDetailMeeting(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="form-label" style={{ margin: 0 }}>Status</span>
                  <span className={`badge ${detailMeeting.badge}`}>{detailMeeting.status}</span>
                </div>
                <div style={{ background: 'var(--bg-alt)', borderRadius: 'var(--r)', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[['Typ', detailMeeting.type],['Datum', `${detailMeeting.day}. ${detailMeeting.mon}`],['Uhrzeit', detailMeeting.time],['Ort', detailMeeting.ort]].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', gap: 12 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--muted)', width: 80 }}>{label}</span>
                      <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>{val}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'var(--bg-alt)', borderRadius: 'var(--r)', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[['E-Mail', detailMeeting.email],['Telefon', detailMeeting.telefon]].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', gap: 12 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--muted)', width: 80 }}>{label}</span>
                      <span style={{ fontSize: '0.86rem' }}>{val}</span>
                    </div>
                  ))}
                </div>
                {detailMeeting.notiz && (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Notiz</label>
                    <div style={{ fontSize: '0.86rem', color: 'var(--sub)', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--r)' }}>
                      {detailMeeting.notiz}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn--ghost" onClick={() => setDetailMeeting(null)}>Schließen</button>
              {detailMeeting.status === 'pending' && (
                <button className="btn btn--outline btn--sm"
                  style={{ borderColor: 'var(--green)', color: 'var(--green)' }}
                  onClick={() => { handleBestaetigen(detailMeeting); setDetailMeeting(null) }}>
                  ✓ Bestätigen
                </button>
              )}
              <button className="btn btn--danger btn--sm" onClick={handleStornieren}>Stornieren</button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          BEARBEITEN MODAL
          ============================================ */}
      {editMeeting && (
        <div className="modal-backdrop open">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-header__title">Termin bearbeiten</div>
              <button className="modal-close" onClick={() => setEditMeeting(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="form-input"
                  value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">E-Mail</label>
                  <input type="email" className="form-input"
                    value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefon</label>
                  <input className="form-input"
                    value={editForm.telefon} onChange={e => setEditForm({ ...editForm, telefon: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Termin-Typ</label>
                  <select className="form-input"
                    value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })}>
                    <option>Erstgespräch</option>
                    <option>Coaching-Session</option>
                    <option>Quick-Call</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Neues Datum (optional)</label>
                  <input type="datetime-local" className="form-input"
                    value={editForm.datum} onChange={e => setEditForm({ ...editForm, datum: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notiz</label>
                <textarea className="form-input" rows="2"
                  value={editForm.notiz} onChange={e => setEditForm({ ...editForm, notiz: e.target.value })} />
              </div>
              <div className="form-hint">Datum leer lassen = Datum bleibt unverändert</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn--ghost" onClick={() => setEditMeeting(null)}>Abbrechen</button>
              <button className="btn btn--primary" onClick={handleEditSave}>Speichern</button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          HINZUFÜGEN MODAL
          ============================================ */}
      {addModal && (
        <div className="modal-backdrop open">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-header__title">Termin hinzufügen</div>
              <button className="modal-close" onClick={() => { setAddModal(false); setForm(LEER_FORM) }}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="form-input" placeholder="Vor- und Nachname"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">E-Mail</label>
                  <input type="email" className="form-input" placeholder="email@beispiel.de"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefon</label>
                  <input className="form-input" placeholder="+49 151 ..."
                    value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Termin-Typ</label>
                  <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option>Erstgespräch</option>
                    <option>Coaching-Session</option>
                    <option>Quick-Call</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Datum & Uhrzeit *</label>
                  <input type="datetime-local" className="form-input"
                    value={form.datum} onChange={e => setForm({ ...form, datum: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notiz</label>
                <textarea className="form-input" rows="2" placeholder="Optionale Notiz..."
                  value={form.notiz} onChange={e => setForm({ ...form, notiz: e.target.value })} />
              </div>
              {(!form.name || !form.datum) && (
                <div className="form-hint" style={{ color: 'var(--red)' }}>* Name und Datum sind Pflichtfelder</div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn--ghost" onClick={() => { setAddModal(false); setForm(LEER_FORM) }}>Abbrechen</button>
              <button className="btn btn--primary" onClick={handleAdd}
                style={{ opacity: (!form.name || !form.datum) ? 0.5 : 1 }}>
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Toast --- */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: 'var(--black)', color: 'var(--white)',
          padding: '12px 20px', borderRadius: 'var(--r)',
          fontSize: '0.86rem', fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 300, animation: 'modalIn 0.3s ease'
        }}>
          {toast}
        </div>
      )}

    </div>
  )
}
'use client'
import { useState, useMemo, useRef } from 'react'

// ============================================
// DEMO-DATEN
// ============================================

const INITIAL_CONTACTS = [
  { id: 1,  name: 'Anna Müller',    email: 'anna.mueller@email.de',   telefon: '+49 170 1234567', status: 'aktiv',   termine: 8,  letzterTermin: '2026-06-10', tags: ['VIP', 'Coaching'],         notizen: 'Bevorzugt vormittags. Sehr pünktlich.',           geburtstag: '1988-03-15', umsatz: 1200 },
  { id: 2,  name: 'Ben Schmidt',    email: 'ben.schmidt@firma.de',    telefon: '+49 160 2345678', status: 'lead',    termine: 0,  letzterTermin: null,         tags: ['Interessent'],             notizen: 'Interesse an Coaching-Paket geäußert.',           geburtstag: '',           umsatz: 0    },
  { id: 3,  name: 'Clara Weber',    email: 'clara.weber@web.de',      telefon: '+49 151 3456789', status: 'aktiv',   termine: 3,  letzterTermin: '2026-05-22', tags: ['Coaching'],                notizen: '',                                                geburtstag: '1995-07-22', umsatz: 450  },
  { id: 4,  name: 'David Koch',     email: 'david.koch@company.com',  telefon: '+49 176 4567890', status: 'inaktiv', termine: 2,  letzterTermin: '2025-11-05', tags: [],                          notizen: 'Hat Pause eingelegt, evtl. wieder aktiv im Q1.',  geburtstag: '',           umsatz: 300  },
  { id: 5,  name: 'Eva Bauer',      email: 'eva.bauer@gmail.com',     telefon: '+49 172 5678901', status: 'aktiv',   termine: 12, letzterTermin: '2026-06-12', tags: ['VIP', 'Beratung'],         notizen: 'Stammkundin. Immer dienstags 10 Uhr.',            geburtstag: '1982-11-30', umsatz: 2400 },
  { id: 6,  name: 'Felix Braun',    email: 'felix.braun@startup.io',  telefon: '+49 178 6789012', status: 'lead',    termine: 0,  letzterTermin: null,         tags: ['Interessent', 'Beratung'], notizen: '',                                                geburtstag: '',           umsatz: 0    },
  { id: 7,  name: 'Greta Hoffmann', email: 'greta.hoffmann@mail.de',  telefon: '+49 163 7890123', status: 'aktiv',   termine: 5,  letzterTermin: '2026-06-01', tags: ['Coaching'],                notizen: 'Möchte monatliche Zusammenfassung per E-Mail.',   geburtstag: '1990-05-08', umsatz: 750  },
  { id: 8,  name: 'Hans Fischer',   email: 'hans.fischer@outlook.de', telefon: '+49 174 8901234', status: 'inaktiv', termine: 1,  letzterTermin: '2025-09-14', tags: [],                          notizen: '',                                                geburtstag: '',           umsatz: 150  },
  { id: 9,  name: 'Ida Wagner',     email: 'ida.wagner@icloud.com',   telefon: '+49 159 9012345', status: 'aktiv',   termine: 7,  letzterTermin: '2026-06-08', tags: ['VIP'],                     notizen: 'VIP-Status seit Januar. Sehr zufrieden.',         geburtstag: '1979-09-03', umsatz: 1750 },
  { id: 10, name: 'Jonas Richter',  email: 'jonas.richter@web.de',    telefon: '+49 175 0123456', status: 'lead',    termine: 0,  letzterTermin: null,         tags: ['Interessent'],             notizen: '',                                                geburtstag: '',           umsatz: 0    },
  { id: 11, name: 'Karin Schäfer',  email: 'karin.schaefer@mail.de',  telefon: '+49 162 1234560', status: 'aktiv',   termine: 4,  letzterTermin: '2026-05-30', tags: ['Beratung'],                notizen: 'Zahlt immer per Überweisung.',                    geburtstag: '1993-12-19', umsatz: 600  },
  { id: 12, name: 'Lars Meyer',     email: 'lars.meyer@company.de',   telefon: '+49 171 2345601', status: 'aktiv',   termine: 9,  letzterTermin: '2026-06-11', tags: ['VIP', 'Coaching'],         notizen: 'Empfiehlt aktiv weiter. Sehr engagiert.',         geburtstag: '1986-02-14', umsatz: 1350 },
]

const AKTIVITAETEN_MOCK = {
  1:  [ { datum: '2026-06-10', typ: 'termin',  text: 'Coaching Session abgeschlossen' }, { datum: '2026-05-01', typ: 'notiz', text: 'Notiz hinzugefügt' }, { datum: '2026-03-15', typ: 'status', text: 'Status → Aktiv' } ],
  5:  [ { datum: '2026-06-12', typ: 'termin',  text: 'Beratung Q2 abgeschlossen' }, { datum: '2026-05-20', typ: 'termin', text: 'Strategiegespräch' }, { datum: '2026-01-10', typ: 'status', text: 'Status → VIP' } ],
  12: [ { datum: '2026-06-11', typ: 'termin',  text: 'Coaching Session' }, { datum: '2026-05-15', typ: 'termin', text: 'Onboarding abgeschlossen' } ],
}

const STATUS_OPTIONEN = [
  { value: 'alle',    label: 'Alle'    },
  { value: 'aktiv',   label: 'Aktiv'   },
  { value: 'lead',    label: 'Lead'    },
  { value: 'inaktiv', label: 'Inaktiv' },
]

const ALLE_TAGS = ['VIP', 'Coaching', 'Beratung', 'Interessent']

const SORT_OPTIONEN = [
  { value: 'name_asc',     label: 'Name A–Z'         },
  { value: 'name_desc',    label: 'Name Z–A'         },
  { value: 'termine_desc', label: 'Meiste Termine'   },
  { value: 'termine_asc',  label: 'Wenigste Termine' },
  { value: 'datum_desc',   label: 'Zuletzt aktiv'    },
  { value: 'umsatz_desc',  label: 'Höchster Umsatz'  },
]

const LEER_KONTAKT = {
  name: '', email: '', telefon: '', status: 'lead',
  tags: [], notizen: '', geburtstag: '', umsatz: 0,
  termine: 0, letzterTermin: null,
}

// ============================================
// HILFSFUNKTIONEN
// ============================================

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function getAvatarColor(name) {
  const farben     = ['#E0E7FF','#FCE7F3','#D1FAE5','#FEF3C7','#DBEAFE','#F3E8FF','#FFE4E6','#ECFDF5']
  const textFarben = ['#4338CA','#BE185D','#065F46','#92400E','#1D4ED8','#7E22CE','#BE123C','#064E3B']
  const idx = name.charCodeAt(0) % farben.length
  return { bg: farben[idx], text: textFarben[idx] }
}

function statusConfig(status) {
  return {
    aktiv:   { label: 'Aktiv',   bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
    lead:    { label: 'Lead',    bg: '#DBEAFE', text: '#1D4ED8', dot: '#3B82F6' },
    inaktiv: { label: 'Inaktiv', bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' },
  }[status] || { label: status, bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' }
}

function formatDatum(dateStr) {
  if (!dateStr) return '–'
  return new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatEuro(val) {
  return `${Number(val).toLocaleString('de-DE')} €`
}

function checkDuplikat(contacts, form, excludeId = null) {
  return contacts.find(c =>
    c.id !== excludeId &&
    (c.email.toLowerCase() === form.email.toLowerCase() ||
     (form.telefon && c.telefon === form.telefon))
  )
}

function exportCSV(contacts) {
  const header = ['Name','E-Mail','Telefon','Status','Tags','Termine','Letzter Termin','Umsatz','Notizen']
  const rows   = contacts.map(c => [
    c.name, c.email, c.telefon, c.status,
    c.tags.join('; '), c.termine,
    c.letzterTermin || '', c.umsatz, c.notizen,
  ])
  const csv  = [header, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href = url; a.download = 'contacts.csv'; a.click()
  URL.revokeObjectURL(url)
}

// ============================================
// HAUPTKOMPONENTE
// ============================================

export default function ContactsPage() {

  const [contacts, setContacts]       = useState(INITIAL_CONTACTS)
  const [suche, setSuche]             = useState('')
  const [statusFilter, setStatus]     = useState('alle')
  const [tagFilter, setTagFilter]     = useState([])
  const [sortBy, setSortBy]           = useState('name_asc')
  const [selectedIds, setSelected]    = useState([])
  const [aktiverStat, setAktiverStat] = useState(null)
  const [toast, setToast]             = useState('')

  // Modals
  const [detailKontakt, setDetailKontakt] = useState(null)   // Kontakt-Objekt | null
  const [formModal, setFormModal]         = useState(false)
  const [formEdit, setFormEdit]           = useState(null)    // Kontakt-Objekt | null (edit mode)
  const [formDaten, setFormDaten]         = useState(LEER_KONTAKT)
  const [formFehler, setFormFehler]       = useState({})
  const [duplikatWarnung, setDuplikatWarnung] = useState(null)

  // Tag-Verwaltung
  const [tagVerwaltung, setTagVerwaltung] = useState(false)
  const [alleTags, setAlleTags]           = useState(ALLE_TAGS)
  const [neuerTagName, setNeuerTagName]   = useState('')

  // Import
  const importRef = useRef()

  // ============================================
  // STATISTIKEN
  // ============================================

  const stats = useMemo(() => {
    const gesamt    = contacts.length
    const aktiv     = contacts.filter(c => c.status === 'aktiv').length
    const leads     = contacts.filter(c => c.status === 'lead').length
    const termine   = contacts.reduce((sum, c) => sum + c.termine, 0)
    const mitTermin = contacts.filter(c => c.termine > 0).length
    const schnitt   = mitTermin > 0 ? Math.round(termine / mitTermin * 10) / 10 : 0
    return { gesamt, aktiv, leads, schnitt }
  }, [contacts])

  // ============================================
  // GEFILTERTE + SORTIERTE LISTE
  // ============================================

  const gefilterteSortiert = useMemo(() => {
    let result = [...contacts]

    if (suche.trim()) {
      const q = suche.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.telefon.includes(q)
      )
    }
    if (statusFilter !== 'alle')
      result = result.filter(c => c.status === statusFilter)
    if (tagFilter.length > 0)
      result = result.filter(c => tagFilter.every(t => c.tags.includes(t)))

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':     return a.name.localeCompare(b.name)
        case 'name_desc':    return b.name.localeCompare(a.name)
        case 'termine_desc': return b.termine - a.termine
        case 'termine_asc':  return a.termine - b.termine
        case 'umsatz_desc':  return b.umsatz - a.umsatz
        case 'datum_desc': {
          if (!a.letzterTermin) return 1
          if (!b.letzterTermin) return -1
          return new Date(b.letzterTermin) - new Date(a.letzterTermin)
        }
        default: return 0
      }
    })
    return result
  }, [contacts, suche, statusFilter, tagFilter, sortBy])

  // ============================================
  // STAT-KACHEL
  // ============================================

  function handleStatKlick(key) {
    if (aktiverStat === key) { setAktiverStat(null); setStatus('alle') }
    else {
      setAktiverStat(key)
      if (key === 'gesamt') setStatus('alle')
      if (key === 'aktiv')  setStatus('aktiv')
      if (key === 'leads')  setStatus('lead')
      if (key === 'schnitt') setStatus('aktiv')
    }
  }

  function handleStatusTab(val) { setStatus(val); setAktiverStat(null) }

  // ============================================
  // SELEKTION
  // ============================================

  function toggleSelect(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }
  function toggleAlleSelect() {
    if (selectedIds.length === gefilterteSortiert.length) setSelected([])
    else setSelected(gefilterteSortiert.map(c => c.id))
  }
  function toggleTag(tag) {
    setTagFilter(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  // ============================================
  // KONTAKT FORMULAR
  // ============================================

  function openNeu() {
    setFormEdit(null)
    setFormDaten({ ...LEER_KONTAKT })
    setFormFehler({})
    setDuplikatWarnung(null)
    setFormModal(true)
  }

  function openEdit(kontakt) {
    setFormEdit(kontakt)
    setFormDaten({ ...kontakt })
    setFormFehler({})
    setDuplikatWarnung(null)
    setFormModal(true)
  }

  function validiereForm() {
    const f = {}
    if (!formDaten.name.trim())  f.name  = 'Name ist Pflichtfeld'
    if (!formDaten.email.trim()) f.email = 'E-Mail ist Pflichtfeld'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formDaten.email)) f.email = 'Ungültige E-Mail'
    return f
  }

  function handleFormSave(forceSave = false) {
    const fehler = validiereForm()
    if (Object.keys(fehler).length > 0) { setFormFehler(fehler); return }

    if (!forceSave) {
      const dup = checkDuplikat(contacts, formDaten, formEdit?.id)
      if (dup) { setDuplikatWarnung(dup); return }
    }

    if (formEdit) {
      setContacts(prev => prev.map(c => c.id === formEdit.id ? { ...c, ...formDaten } : c))
      if (detailKontakt?.id === formEdit.id)
        setDetailKontakt(prev => ({ ...prev, ...formDaten }))
      showToast('✓ Kontakt aktualisiert')
    } else {
      const neu = { ...formDaten, id: Date.now(), termine: 0, letzterTermin: null }
      setContacts(prev => [...prev, neu])
      showToast('✓ Kontakt hinzugefügt')
    }
    setFormModal(false)
    setDuplikatWarnung(null)
  }

  function handleDelete(id) {
    setContacts(prev => prev.filter(c => c.id !== id))
    setDetailKontakt(null)
    showToast('✓ Kontakt gelöscht')
  }

  function handleArchivieren(id) {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status: 'inaktiv' } : c))
    setDetailKontakt(null)
    showToast('✓ Kontakt archiviert')
  }

  // ============================================
  // TAG-VERWALTUNG
  // ============================================

  function addTag() {
    const t = neuerTagName.trim()
    if (!t || alleTags.includes(t)) return
    setAlleTags(prev => [...prev, t])
    setNeuerTagName('')
    showToast(`✓ Tag „${t}" erstellt`)
  }

  function deleteTagGlobal(tag) {
    setAlleTags(prev => prev.filter(t => t !== tag))
    setContacts(prev => prev.map(c => ({ ...c, tags: c.tags.filter(t => t !== tag) })))
    showToast(`✓ Tag „${tag}" gelöscht`)
  }

  function toggleFormTag(tag) {
    setFormDaten(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag],
    }))
  }

  // ============================================
  // CSV IMPORT
  // ============================================

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const lines  = ev.target.result.split('\n').filter(Boolean)
      const header = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase())
      let importiert = 0
      lines.slice(1).forEach(line => {
        const cols = line.split(',').map(v => v.replace(/"/g, '').trim())
        const obj  = {}
        header.forEach((h, i) => { obj[h] = cols[i] || '' })
        if (!obj['name'] || !obj['e-mail']) return
        const neu = {
          id: Date.now() + Math.random(),
          name: obj['name'], email: obj['e-mail'],
          telefon: obj['telefon'] || '',
          status: obj['status'] || 'lead',
          tags: obj['tags'] ? obj['tags'].split(';').map(t => t.trim()).filter(Boolean) : [],
          notizen: obj['notizen'] || '',
          geburtstag: obj['geburtstag'] || '',
          umsatz: Number(obj['umsatz']) || 0,
          termine: Number(obj['termine']) || 0,
          letzterTermin: obj['letzter termin'] || null,
        }
        setContacts(prev => [...prev, neu])
        importiert++
      })
      showToast(`✓ ${importiert} Kontakte importiert`)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // ============================================
  // TOAST
  // ============================================

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const alleSelektiert = selectedIds.length > 0 && selectedIds.length === gefilterteSortiert.length
  const teils          = selectedIds.length > 0 && selectedIds.length < gefilterteSortiert.length

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="page">

      {/* ---- Seitenkopf ---- */}
      <div className="section-head">
        <div>
          <div className="section-head__title">Contacts</div>
          <div className="section-head__sub">Verwalte deine Kunden und Leads.</div>
        </div>
        <div className="section-head__actions">
          {selectedIds.length > 0 && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{selectedIds.length} ausgewählt</span>
              <button className="btn btn--ghost btn--sm" onClick={() => {
                exportCSV(contacts.filter(c => selectedIds.includes(c.id)))
                showToast(`✓ ${selectedIds.length} Kontakte exportiert`)
              }}>Export</button>
              <button className="btn btn--ghost btn--sm" style={{ color: 'var(--red)' }}
                onClick={() => {
                  setContacts(prev => prev.filter(c => !selectedIds.includes(c.id)))
                  showToast(`✓ ${selectedIds.length} Kontakte gelöscht`)
                  setSelected([])
                }}>Löschen</button>
            </div>
          )}
          <button className="btn btn--ghost btn--sm" onClick={() => setTagVerwaltung(true)}>🏷 Tags</button>
          <button className="btn btn--ghost btn--sm" onClick={() => importRef.current.click()}>↑ Import</button>
          <input ref={importRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleImport} />
          <button className="btn btn--ghost btn--sm" onClick={() => {
            exportCSV(gefilterteSortiert)
            showToast(`✓ ${gefilterteSortiert.length} Kontakte exportiert`)
          }}>↓ Export</button>
          <button className="btn btn--primary btn--sm" onClick={openNeu}>+ Kontakt hinzufügen</button>
        </div>
      </div>

      {/* ============================================
          STATISTIK-KACHELN
          ============================================ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 8 }}>
        {[
          {
            key: 'gesamt', label: 'Gesamt', value: stats.gesamt, sub: 'Alle Kontakte',
            color: 'var(--bg-alt)', border: 'var(--border)', activeBg: '#0A0A0A', activeBorder: '#0A0A0A',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
          },
          {
            key: 'aktiv', label: 'Aktive Kunden', value: stats.aktiv, sub: `${Math.round(stats.aktiv / stats.gesamt * 100)}% des Portfolios`,
            color: '#F0FDF4', border: '#86EFAC', activeBg: '#16A34A', activeBorder: '#16A34A',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
          },
          {
            key: 'leads', label: 'Leads', value: stats.leads, sub: 'Noch nicht gebucht',
            color: '#EFF6FF', border: '#93C5FD', activeBg: '#2563EB', activeBorder: '#2563EB',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
          },
          {
            key: 'schnitt', label: 'Ø Termine / Kunde', value: stats.schnitt, sub: 'Aktive Kunden',
            color: '#FFF7ED', border: '#FED7AA', activeBg: '#F59E0B', activeBorder: '#F59E0B',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
          },
        ].map(s => {
          const isAktiv = aktiverStat === s.key
          return (
            <div key={s.key} onClick={() => handleStatKlick(s.key)} style={{
              background: isAktiv ? s.activeBg : s.color,
              border: `${isAktiv ? '2px' : '1px'} solid ${isAktiv ? s.activeBorder : s.border}`,
              borderRadius: 'var(--r)', padding: '20px 24px',
              cursor: 'pointer', transition: 'all 0.15s', userSelect: 'none',
            }}
            onMouseEnter={e => { if (!isAktiv) e.currentTarget.style.borderColor = '#9CA3AF' }}
            onMouseLeave={e => { if (!isAktiv) e.currentTarget.style.borderColor = s.border }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: isAktiv ? 'rgba(255,255,255,0.75)' : 'var(--muted)' }}>
                  {s.label}
                </div>
                <div style={{ color: isAktiv ? 'rgba(255,255,255,0.9)' : 'var(--muted)' }}>{s.icon}</div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, marginBottom: 6, color: isAktiv ? '#fff' : 'var(--black)' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.76rem', color: isAktiv ? 'rgba(255,255,255,0.65)' : 'var(--muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{s.sub}</span>
                {isAktiv && <span style={{ fontSize: '0.70rem', padding: '2px 7px', borderRadius: 999, background: 'rgba(255,255,255,0.2)' }}>Aktiver Filter</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* ============================================
          SUCHE + FILTER + TABELLE
          ============================================ */}
      <div className="card">
        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Zeile 1 */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}
                width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" placeholder="Name, E-Mail oder Telefon suchen..."
                value={suche} onChange={e => setSuche(e.target.value)}
                style={{ width: '100%', padding: '8px 32px 8px 34px', border: '1px solid var(--border)', borderRadius: 'var(--r)', fontSize: '0.84rem', background: 'var(--bg-alt)', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--black)'}
                onBlur={e  => e.currentTarget.style.borderColor = 'var(--border)'} />
              {suche && (
                <button onClick={() => setSuche('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1, padding: 0 }}>✕</button>
              )}
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '8px 12px', fontSize: '0.82rem', border: '1px solid var(--border)', borderRadius: 'var(--r)', background: 'var(--bg-alt)', outline: 'none', cursor: 'pointer' }}>
              {SORT_OPTIONEN.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
              {STATUS_OPTIONEN.map(s => {
                const count = s.value === 'alle' ? contacts.length : contacts.filter(c => c.status === s.value).length
                return (
                  <button key={s.value} onClick={() => handleStatusTab(s.value)} style={{ padding: '7px 14px', fontSize: '0.82rem', cursor: 'pointer', border: 'none', whiteSpace: 'nowrap', background: statusFilter === s.value ? 'var(--black)' : 'var(--white)', color: statusFilter === s.value ? 'var(--white)' : 'var(--muted)', fontWeight: statusFilter === s.value ? 600 : 400, transition: 'background 0.15s, color 0.15s' }}>
                    {s.label} <span style={{ marginLeft: 4, fontSize: '0.72rem', opacity: statusFilter === s.value ? 0.7 : 1 }}>{count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Zeile 2: Tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--muted)', fontWeight: 500 }}>Tags:</span>
            {alleTags.map(tag => (
              <button key={tag} onClick={() => toggleTag(tag)} style={{ padding: '4px 12px', fontSize: '0.78rem', cursor: 'pointer', borderRadius: 999, border: tagFilter.includes(tag) ? '2px solid var(--black)' : '1px solid var(--border)', background: tagFilter.includes(tag) ? 'var(--black)' : 'var(--bg-alt)', color: tagFilter.includes(tag) ? 'var(--white)' : 'var(--black)', fontWeight: tagFilter.includes(tag) ? 600 : 400, transition: 'all 0.15s' }}>
                {tag}
              </button>
            ))}
            {(tagFilter.length > 0 || suche || statusFilter !== 'alle') && (
              <button onClick={() => { setTagFilter([]); setSuche(''); setStatus('alle'); setAktiverStat(null) }}
                style={{ padding: '4px 10px', fontSize: '0.76rem', cursor: 'pointer', borderRadius: 999, border: '1px solid var(--border)', background: 'none', color: 'var(--muted)' }}>
                ✕ Filter zurücksetzen
              </button>
            )}
            <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--muted)' }}>
              {gefilterteSortiert.length} von {contacts.length} Kontakten
            </span>
          </div>
        </div>

        {/* TABELLE */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-alt)' }}>
                <th style={{ width: 44, padding: '10px 16px' }}>
                  <input type="checkbox" checked={alleSelektiert}
                    ref={el => { if (el) el.indeterminate = teils }}
                    onChange={toggleAlleSelect} style={{ cursor: 'pointer', width: 15, height: 15 }} />
                </th>
                {['Kontakt','Status','Tags','Termine','Umsatz','Letzter Termin',''].map((h, i) => (
                  <th key={i} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.74rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gefilterteSortiert.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.86rem' }}>Keine Kontakte gefunden.</td></tr>
              ) : gefilterteSortiert.map((c, idx) => {
                const avatar = getAvatarColor(c.name)
                const sc     = statusConfig(c.status)
                const sel    = selectedIds.includes(c.id)
                return (
                  <tr key={c.id}
                    style={{ borderBottom: idx < gefilterteSortiert.length - 1 ? '1px solid var(--border)' : 'none', background: sel ? '#F8FAFF' : 'var(--white)', transition: 'background 0.1s' }}
                    onMouseEnter={e => { if (!sel) e.currentTarget.style.background = 'var(--bg-alt)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = sel ? '#F8FAFF' : 'var(--white)' }}>

                    <td style={{ padding: '12px 16px' }}>
                      <input type="checkbox" checked={sel} onChange={() => toggleSelect(c.id)} style={{ cursor: 'pointer', width: 15, height: 15 }} />
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: avatar.bg, color: avatar.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700 }}>
                          {getInitials(c.name)}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>{c.name}</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{c.email}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{c.telefon}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: sc.bg, color: sc.text, fontSize: '0.76rem', fontWeight: 600 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
                        {sc.label}
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {c.tags.length === 0
                          ? <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>–</span>
                          : c.tags.map(t => (
                              <span key={t} style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 500, background: 'var(--bg-alt)', border: '1px solid var(--border)' }}>{t}</span>
                            ))
                        }
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>{c.termine}</div>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: c.umsatz > 0 ? '#16A34A' : 'var(--muted)' }}>
                        {c.umsatz > 0 ? formatEuro(c.umsatz) : '–'}
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: '0.82rem', color: c.letzterTermin ? 'var(--black)' : 'var(--muted)' }}>
                        {formatDatum(c.letzterTermin)}
                      </div>
                    </td>

                    {/* Schnellaktionen */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn--ghost btn--sm" onClick={() => setDetailKontakt(c)} title="Details">
                          Details
                        </button>
                        <button className="btn btn--ghost btn--sm" onClick={() => openEdit(c)} title="Bearbeiten"
                          style={{ padding: '5px 8px' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button className="btn btn--ghost btn--sm" onClick={() => { if (confirm(`${c.name} wirklich löschen?`)) handleDelete(c.id) }} title="Löschen"
                          style={{ padding: '5px 8px', color: 'var(--red)' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
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

        {gefilterteSortiert.length > 0 && (
          <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{gefilterteSortiert.length} Kontakte angezeigt</span>
            {selectedIds.length > 0 && <span style={{ fontWeight: 600, color: 'var(--black)' }}>{selectedIds.length} ausgewählt</span>}
          </div>
        )}
      </div>

      {/* ============================================
          DETAIL MODAL
          ============================================ */}
      {detailKontakt && (() => {
        const avatar     = getAvatarColor(detailKontakt.name)
        const sc         = statusConfig(detailKontakt.status)
        const aktivitaeten = AKTIVITAETEN_MOCK[detailKontakt.id] || []
        return (
          <div className="modal-backdrop open">
            <div className="modal" style={{ maxWidth: 580 }}>
              <div className="modal-header">
                <div className="modal-header__title">Kontakt-Detail</div>
                <button className="modal-close" onClick={() => setDetailKontakt(null)}>✕</button>
              </div>
              <div className="modal-body" style={{ padding: 0 }}>

                {/* Header-Banner */}
                <div style={{ background: 'var(--bg-alt)', padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: avatar.bg, color: avatar.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700, flexShrink: 0 }}>
                    {getInitials(detailKontakt.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>{detailKontakt.name}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999, background: sc.bg, color: sc.text, fontSize: '0.76rem', fontWeight: 600 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: sc.dot }} />
                        {sc.label}
                      </div>
                      {detailKontakt.tags.map(t => (
                        <span key={t} style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.72rem', background: 'var(--white)', border: '1px solid var(--border)', fontWeight: 500 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn--ghost btn--sm" onClick={() => { setDetailKontakt(null); openEdit(detailKontakt) }}>Bearbeiten</button>
                    <button className="btn btn--primary btn--sm" onClick={() => showToast(`→ Termin mit ${detailKontakt.name} buchen`)}>
                      Termin buchen
                    </button>
                  </div>
                </div>

                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

                  {/* Kontaktdaten */}
                  <div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Kontaktdaten</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {[
                        { label: 'E-Mail',     value: detailKontakt.email      },
                        { label: 'Telefon',    value: detailKontakt.telefon    },
                        { label: 'Geburtstag', value: formatDatum(detailKontakt.geburtstag) },
                        { label: 'Umsatz',     value: detailKontakt.umsatz > 0 ? formatEuro(detailKontakt.umsatz) : '–' },
                      ].map(f => (
                        <div key={f.label} style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '10px 14px' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 3 }}>{f.label}</div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>{f.value || '–'}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Statistiken */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {[
                      { label: 'Termine gesamt', value: detailKontakt.termine },
                      { label: 'Letzter Termin', value: formatDatum(detailKontakt.letzterTermin) },
                      { label: 'Gesamtumsatz',   value: formatEuro(detailKontakt.umsatz) },
                    ].map(s => (
                      <div key={s.label} style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '12px 14px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 3 }}>{s.value}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Notizen */}
                  <div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Notizen</div>
                    <textarea
                      value={detailKontakt.notizen}
                      onChange={e => {
                        const updated = { ...detailKontakt, notizen: e.target.value }
                        setDetailKontakt(updated)
                        setContacts(prev => prev.map(c => c.id === detailKontakt.id ? updated : c))
                      }}
                      placeholder="Notizen zu diesem Kontakt..."
                      rows={3}
                      style={{ width: '100%', padding: '10px 12px', fontSize: '0.84rem', border: '1px solid var(--border)', borderRadius: 'var(--r)', background: 'var(--bg-alt)', resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--black)'}
                      onBlur={e  => e.currentTarget.style.borderColor = 'var(--border)'}
                    />
                  </div>

                  {/* Aktivitäts-Timeline */}
                  {aktivitaeten.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Aktivitäten</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {aktivitaeten.map((a, i) => {
                          const typIcon = { termin: '📅', notiz: '📝', status: '🔄' }[a.typ] || '•'
                          return (
                            <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 12, position: 'relative' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-alt)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>{typIcon}</div>
                                {i < aktivitaeten.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--border)', marginTop: 4 }} />}
                              </div>
                              <div style={{ paddingTop: 4 }}>
                                <div style={{ fontSize: '0.84rem', fontWeight: 500 }}>{a.text}</div>
                                <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: 2 }}>{formatDatum(a.datum)}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn--ghost" style={{ color: 'var(--red)' }}
                  onClick={() => { if (confirm(`${detailKontakt.name} wirklich löschen?`)) handleDelete(detailKontakt.id) }}>
                  Löschen
                </button>
                <button className="btn btn--ghost"
                  onClick={() => handleArchivieren(detailKontakt.id)}>
                  Archivieren
                </button>
                <button className="btn btn--ghost" onClick={() => setDetailKontakt(null)}>Schließen</button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ============================================
          KONTAKT FORMULAR MODAL (Neu + Bearbeiten)
          ============================================ */}
      {formModal && (
        <div className="modal-backdrop open">
          <div className="modal" style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <div className="modal-header__title">{formEdit ? 'Kontakt bearbeiten' : 'Neuer Kontakt'}</div>
              <button className="modal-close" onClick={() => setFormModal(false)}>✕</button>
            </div>
            <div className="modal-body">

              {/* Duplikat-Warnung */}
              {duplikatWarnung && (
                <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 'var(--r)', padding: '12px 14px', marginBottom: 16 }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, marginBottom: 4 }}>⚠️ Mögliches Duplikat gefunden</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 10 }}>
                    „{duplikatWarnung.name}" hat die gleiche E-Mail oder Telefonnummer.
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn--ghost btn--sm" onClick={() => setDuplikatWarnung(null)}>Abbrechen</button>
                    <button className="btn btn--primary btn--sm" onClick={() => handleFormSave(true)}>Trotzdem speichern</button>
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className={`form-input${formFehler.name ? ' error' : ''}`} placeholder="Max Mustermann"
                    value={formDaten.name} onChange={e => setFormDaten(p => ({ ...p, name: e.target.value }))} />
                  {formFehler.name && <div className="form-hint" style={{ color: 'var(--red)' }}>{formFehler.name}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-input" value={formDaten.status} onChange={e => setFormDaten(p => ({ ...p, status: e.target.value }))}>
                    <option value="lead">Lead</option>
                    <option value="aktiv">Aktiv</option>
                    <option value="inaktiv">Inaktiv</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">E-Mail *</label>
                  <input className={`form-input${formFehler.email ? ' error' : ''}`} type="email" placeholder="max@example.de"
                    value={formDaten.email} onChange={e => setFormDaten(p => ({ ...p, email: e.target.value }))} />
                  {formFehler.email && <div className="form-hint" style={{ color: 'var(--red)' }}>{formFehler.email}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Telefon</label>
                  <input className="form-input" placeholder="+49 170 ..."
                    value={formDaten.telefon} onChange={e => setFormDaten(p => ({ ...p, telefon: e.target.value }))} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Geburtstag</label>
                  <input type="date" className="form-input"
                    value={formDaten.geburtstag} onChange={e => setFormDaten(p => ({ ...p, geburtstag: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Umsatz (€)</label>
                  <input type="number" className="form-input" placeholder="0"
                    value={formDaten.umsatz} onChange={e => setFormDaten(p => ({ ...p, umsatz: Number(e.target.value) }))} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tags</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {alleTags.map(t => (
                    <button key={t} type="button" onClick={() => toggleFormTag(t)} style={{ padding: '4px 12px', fontSize: '0.78rem', cursor: 'pointer', borderRadius: 999, border: formDaten.tags.includes(t) ? '2px solid var(--black)' : '1px solid var(--border)', background: formDaten.tags.includes(t) ? 'var(--black)' : 'var(--bg-alt)', color: formDaten.tags.includes(t) ? 'var(--white)' : 'var(--black)', fontWeight: formDaten.tags.includes(t) ? 600 : 400, transition: 'all 0.15s' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notizen</label>
                <textarea className="form-input" rows={3} placeholder="Interne Notizen..."
                  value={formDaten.notizen} onChange={e => setFormDaten(p => ({ ...p, notizen: e.target.value }))}
                  style={{ resize: 'vertical', fontFamily: 'inherit' }} />
              </div>

            </div>
            <div className="modal-footer">
              <button className="btn btn--ghost" onClick={() => setFormModal(false)}>Abbrechen</button>
              {formEdit && (
                <button className="btn btn--ghost" style={{ color: 'var(--red)' }}
                  onClick={() => { if (confirm(`${formEdit.name} wirklich löschen?`)) { handleDelete(formEdit.id); setFormModal(false) } }}>
                  Löschen
                </button>
              )}
              <button className="btn btn--primary" onClick={() => handleFormSave(false)}>
                {formEdit ? 'Speichern' : 'Kontakt hinzufügen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          TAG-VERWALTUNG MODAL
          ============================================ */}
      {tagVerwaltung && (
        <div className="modal-backdrop open">
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <div className="modal-header__title">🏷 Tags verwalten</div>
              <button className="modal-close" onClick={() => setTagVerwaltung(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input className="form-input" placeholder="Neuer Tag..." value={neuerTagName}
                  onChange={e => setNeuerTagName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag()}
                  style={{ flex: 1 }} />
                <button className="btn btn--primary btn--sm" onClick={addTag}>Hinzufügen</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {alleTags.map(t => {
                  const count = contacts.filter(c => c.tags.includes(t)).length
                  return (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--r)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '0.86rem', fontWeight: 500 }}>{t}</span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{count} Kontakt{count !== 1 ? 'e' : ''}</span>
                      </div>
                      <button className="btn btn--ghost btn--sm" style={{ color: 'var(--red)', padding: '4px 8px' }}
                        onClick={() => { if (confirm(`Tag „${t}" und alle Zuweisungen löschen?`)) deleteTagGlobal(t) }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6"/><path d="M14 11v6"/>
                        </svg>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn--ghost" onClick={() => setTagVerwaltung(false)}>Schließen</button>
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

    </div>
  )
}
'use client'
import { useState } from 'react'

// ============================================
// KONFIGURATION
// ============================================

const WOCHENTAGE = [
  { key: 'mo', label: 'Montag',     kurz: 'Mo' },
  { key: 'di', label: 'Dienstag',   kurz: 'Di' },
  { key: 'mi', label: 'Mittwoch',   kurz: 'Mi' },
  { key: 'do', label: 'Donnerstag', kurz: 'Do' },
  { key: 'fr', label: 'Freitag',    kurz: 'Fr' },
  { key: 'sa', label: 'Samstag',    kurz: 'Sa' },
  { key: 'so', label: 'Sonntag',    kurz: 'So' },
]

const DEFAULT_SLOT = { von: '09:00', bis: '17:00' }

const INITIAL_VERFUEGBARKEIT = {
  mo: { aktiv: true,  slots: [{ von: '09:00', bis: '17:00' }] },
  di: { aktiv: true,  slots: [{ von: '09:00', bis: '17:00' }] },
  mi: { aktiv: true,  slots: [{ von: '09:00', bis: '17:00' }] },
  do: { aktiv: true,  slots: [{ von: '09:00', bis: '17:00' }] },
  fr: { aktiv: true,  slots: [{ von: '09:00', bis: '17:00' }] },
  sa: { aktiv: false, slots: [] },
  so: { aktiv: false, slots: [] },
}

const BLOCK_TYPEN = [
  { value: 'urlaub',    label: 'Urlaub',    emoji: '🏖️' },
  { value: 'event',     label: 'Event',     emoji: '🎯' },
  { value: 'krank',     label: 'Krank',     emoji: '🤒' },
  { value: 'feiertag',  label: 'Feiertag',  emoji: '🎉' },
  { value: 'sonstiges', label: 'Sonstiges', emoji: '🚫' },
]

const WIEDERHOLUNG_OPTIONEN = [
  { value: 'keine',     label: 'Keine'       },
  { value: 'woechtlich',label: 'Wöchentlich' },
  { value: 'monatlich', label: 'Monatlich'   },
]

const LEER_BLOCK = {
  titel: '', typ: 'urlaub', vonDatum: '', bisDatum: '',
  ganztag: true, vonZeit: '09:00', bisZeit: '17:00',
  wiederholung: 'keine',
}

const INITIAL_EINSTELLUNGEN = {
  pufferVor:          '0',
  pufferNach:         '0',
  vorlaufzeit:        '0',
  maxBuchungenTag:    '',
  buchungsreichweite: '60',
  wochenendeAktiv:    false,
  feiertagBlock:      true,
  feiertagBundesland: 'DE',
  zeitzone:           'Europe/Berlin',
  manuelleBestaetigung: false,
  kalenderSync:       null,   // null | 'google' | 'outlook'
  kalenderSyncZeit:   null,
}

const PAUSEN_INITIAL = []   // [{ von: '12:00', bis: '13:00', label: 'Mittagspause' }]

const ZEITZONEN = [
  { value: 'Europe/Berlin',   label: 'Berlin (MEZ/MESZ)' },
  { value: 'Europe/London',   label: 'London (GMT/BST)'  },
  { value: 'Europe/Paris',    label: 'Paris (MEZ/MESZ)'  },
  { value: 'Europe/Zurich',   label: 'Zürich (MEZ/MESZ)' },
  { value: 'America/New_York',label: 'New York (ET)'     },
  { value: 'America/Chicago', label: 'Chicago (CT)'      },
  { value: 'America/Denver',  label: 'Denver (MT)'       },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PT)' },
  { value: 'Asia/Tokyo',      label: 'Tokio (JST)'       },
  { value: 'Asia/Dubai',      label: 'Dubai (GST)'       },
  { value: 'UTC',             label: 'UTC'                },
]

const BUNDESLAENDER = [
  { value: 'DE',    label: 'Alle (bundesweit)' },
  { value: 'DE-BY', label: 'Bayern'            },
  { value: 'DE-BE', label: 'Berlin'            },
  { value: 'DE-BB', label: 'Brandenburg'       },
  { value: 'DE-HB', label: 'Bremen'            },
  { value: 'DE-HH', label: 'Hamburg'           },
  { value: 'DE-HE', label: 'Hessen'            },
  { value: 'DE-MV', label: 'Mecklenburg-Vorpommern' },
  { value: 'DE-NI', label: 'Niedersachsen'     },
  { value: 'DE-NW', label: 'Nordrhein-Westfalen' },
  { value: 'DE-RP', label: 'Rheinland-Pfalz'  },
  { value: 'DE-SL', label: 'Saarland'         },
  { value: 'DE-SN', label: 'Sachsen'          },
  { value: 'DE-ST', label: 'Sachsen-Anhalt'   },
  { value: 'DE-SH', label: 'Schleswig-Holstein' },
  { value: 'DE-TH', label: 'Thüringen'        },
]

const MONATSNAMEN = [
  'Januar','Februar','März','April','Mai','Juni',
  'Juli','August','September','Oktober','November','Dezember'
]

// ============================================
// ZEIT-HILFSFUNKTIONEN
// ============================================

function timeToMin(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function minToTime(min) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function naechsteVonZeit(slots) {
  if (slots.length === 0) return '09:00'
  const naechste = timeToMin(slots[slots.length - 1].bis) + 1
  return naechste >= 24 * 60 ? null : minToTime(naechste)
}

function validiereSlots(slots) {
  return slots.map((slot, i) => {
    const errors = []
    if (timeToMin(slot.von) >= timeToMin(slot.bis))
      errors.push('Von muss vor Bis liegen')
    if (i > 0 && timeToMin(slot.von) <= timeToMin(slots[i - 1].bis))
      errors.push(`Muss nach ${slots[i - 1].bis} beginnen`)
    return errors
  })
}

// Berechnet gebuchte Stunden pro Woche
function berechneWochenstunden(verfuegbarkeit) {
  let total = 0
  Object.values(verfuegbarkeit).forEach(tag => {
    if (!tag.aktiv) return
    tag.slots.forEach(s => { total += timeToMin(s.bis) - timeToMin(s.von) })
  })
  return Math.round(total / 60 * 10) / 10
}

// ============================================
// KALENDER-HILFSFUNKTIONEN
// ============================================

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

// Nächste N freie Slots ab heute generieren (für Vorschau)
function generiereNaechsteSlots(verfuegbarkeit, blocker, pausen, n = 6) {
  const slots = []
  const heute = new Date()
  let d = new Date(heute)
  let versuche = 0

  while (slots.length < n && versuche < 60) {
    versuche++
    const dateStr  = d.toISOString().slice(0, 10)
    const jsDay    = d.getDay()
    const tagIdx   = jsDay === 0 ? 6 : jsDay - 1
    const tagKey   = WOCHENTAGE[tagIdx].key
    const tagDaten = verfuegbarkeit[tagKey]
    const isBlocked = blocker.some(b => dateStr >= b.vonDatum && dateStr <= (b.bisDatum || b.vonDatum))

    if (tagDaten.aktiv && !isBlocked) {
      tagDaten.slots.forEach(s => {
        // Pausen rausrechnen (vereinfacht: Slot wird aufgeteilt)
        slots.push({
          datum: d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short' }),
          von:   s.von,
          bis:   s.bis,
        })
      })
    }

    d = new Date(d.getTime() + 86400000)
  }

  return slots.slice(0, n)
}

// ============================================
// HAUPTKOMPONENTE
// ============================================

export default function AvailabilityPage() {

  const [view, setView]                     = useState('liste')
  const [verfuegbarkeit, setVerfuegbarkeit] = useState(INITIAL_VERFUEGBARKEIT)
  const [blocker, setBlocker]               = useState([])
  const [pausen, setPausen]                 = useState(PAUSEN_INITIAL)
  const [blockerModal, setBlockerModal]     = useState(false)
  const [pauseModal, setPauseModal]         = useState(false)
  const [editBlocker, setEditBlocker]       = useState(null)
  const [editPause, setEditPause]           = useState(null)
  const [blockForm, setBlockForm]           = useState(LEER_BLOCK)
  const [pauseForm, setPauseForm]           = useState({ label: '', von: '12:00', bis: '13:00' })
  const [einstellungen, setEinstellungen]   = useState(INITIAL_EINSTELLUNGEN)
  const [toast, setToast]                   = useState('')
  const [vorschauOffen, setVorschauOffen]   = useState(false)

  const today = new Date()
  const [kalMonth, setKalMonth] = useState(today.getMonth())
  const [kalYear,  setKalYear]  = useState(today.getFullYear())

  const wochenstunden   = berechneWochenstunden(verfuegbarkeit)
  const aktiveTage      = Object.values(verfuegbarkeit).filter(t => t.aktiv).length
  const vorschauSlots   = generiereNaechsteSlots(verfuegbarkeit, blocker, pausen)

  // ============================================
  // TOAST
  // ============================================

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  // ============================================
  // WOCHENVERFÜGBARKEIT
  // ============================================

  function toggleTag(key) {
    setVerfuegbarkeit(prev => ({
      ...prev,
      [key]: { aktiv: !prev[key].aktiv, slots: !prev[key].aktiv ? [{ ...DEFAULT_SLOT }] : [] }
    }))
  }

  function updateSlot(key, index, field, value) {
    setVerfuegbarkeit(prev => {
      const slots  = [...prev[key].slots]
      slots[index] = { ...slots[index], [field]: value }
      if (field === 'bis' && index < slots.length - 1) {
        const naechste = timeToMin(value) + 1
        if (naechste < 24 * 60)
          slots[index + 1] = { ...slots[index + 1], von: minToTime(naechste) }
      }
      return { ...prev, [key]: { ...prev[key], slots } }
    })
  }

  function addSlot(key) {
    setVerfuegbarkeit(prev => {
      const slots   = prev[key].slots
      if (slots.length >= 3) return prev
      const vonZeit = naechsteVonZeit(slots)
      if (!vonZeit) return prev
      const vonMin  = timeToMin(vonZeit)
      const bisMin  = Math.min(vonMin + 60, 23 * 60 + 59)
      return { ...prev, [key]: { ...prev[key], slots: [...slots, { von: vonZeit, bis: minToTime(bisMin) }] } }
    })
  }

  function removeSlot(key, index) {
    setVerfuegbarkeit(prev => {
      const slots = prev[key].slots
      if (slots.length <= 1) return prev
      return { ...prev, [key]: { ...prev[key], slots: slots.filter((_, i) => i !== index) } }
    })
  }

  function aufAlleTage(key) {
    const quellSlots = verfuegbarkeit[key].slots
    setVerfuegbarkeit(prev => {
      const updated = { ...prev }
      WOCHENTAGE.forEach(t => {
        if (updated[t.key].aktiv)
          updated[t.key] = { ...updated[t.key], slots: quellSlots.map(s => ({ ...s })) }
      })
      return updated
    })
    showToast('✓ Zeiten auf alle aktiven Tage übertragen')
  }

  // ============================================
  // PAUSEN
  // ============================================

  function openAddPause() {
    setEditPause(null)
    setPauseForm({ label: '', von: '12:00', bis: '13:00' })
    setPauseModal(true)
  }

  function openEditPause(index) {
    setEditPause(index)
    setPauseForm({ ...pausen[index] })
    setPauseModal(true)
  }

  function handlePauseSave() {
    if (!pauseForm.label) return
    if (editPause !== null) {
      setPausen(prev => prev.map((p, i) => i === editPause ? { ...pauseForm } : p))
      showToast('✓ Pause aktualisiert')
    } else {
      setPausen(prev => [...prev, { ...pauseForm }])
      showToast('✓ Pause hinzugefügt')
    }
    setPauseModal(false)
  }

  function deletePause(index) {
    setPausen(prev => prev.filter((_, i) => i !== index))
    showToast('✓ Pause entfernt')
  }

  // ============================================
  // BLOCKER
  // ============================================

  function openAddBlocker(datumVorausfuellen = '') {
    setEditBlocker(null)
    setBlockForm({ ...LEER_BLOCK, vonDatum: datumVorausfuellen })
    setBlockerModal(true)
  }

  function openEditBlocker(index) {
    setEditBlocker(index)
    setBlockForm({ ...blocker[index] })
    setBlockerModal(true)
  }

  function handleBlockerSave() {
    if (!blockForm.titel || !blockForm.vonDatum) return
    if (editBlocker !== null) {
      setBlocker(prev => prev.map((b, i) => i === editBlocker ? { ...blockForm } : b))
      showToast('✓ Blocker aktualisiert')
    } else {
      setBlocker(prev =>
        [...prev, { ...blockForm }].sort((a, b) => new Date(a.vonDatum) - new Date(b.vonDatum))
      )
      showToast('✓ Zeitraum blockiert')
    }
    setBlockerModal(false)
    setBlockForm(LEER_BLOCK)
  }

  function deleteBlocker(index) {
    setBlocker(prev => prev.filter((_, i) => i !== index))
    showToast('✓ Blocker entfernt')
  }

  function blockerDatumLabel(b) {
    const von = new Date(b.vonDatum).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })
    if (!b.bisDatum || b.bisDatum === b.vonDatum)
      return b.ganztag ? von : `${von}, ${b.vonZeit} – ${b.bisZeit}`
    const bis = new Date(b.bisDatum).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })
    return b.ganztag ? `${von} – ${bis}` : `${von} ${b.vonZeit} – ${bis} ${b.bisZeit}`
  }

  function isDayBlocked(dateStr) {
    return blocker.some(b => dateStr >= b.vonDatum && dateStr <= (b.bisDatum || b.vonDatum))
  }

  function getBlockerForDay(dateStr) {
    return blocker.filter(b => dateStr >= b.vonDatum && dateStr <= (b.bisDatum || b.vonDatum))
  }

  function getWochentagKey(year, month, day) {
    const jsDay = new Date(year, month, day).getDay()
    return WOCHENTAGE[jsDay === 0 ? 6 : jsDay - 1].key
  }

  function handleSpeichern() {
    showToast('✓ Verfügbarkeit gespeichert')
  }

  // ============================================
  // SLOT RENDER
  // ============================================

  function renderSlots(tag) {
    const tagDaten  = verfuegbarkeit[tag.key]
    const fehler    = validiereSlots(tagDaten.slots)
    const kannHinzu = tagDaten.slots.length < 3 && naechsteVonZeit(tagDaten.slots) !== null

    if (!tagDaten.aktiv) {
      return (
        <div style={{ paddingTop: 7, fontSize: '0.82rem', color: 'var(--muted)', fontStyle: 'italic' }}>
          Nicht verfügbar
        </div>
      )
    }

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        {tagDaten.slots.map((slot, si) => {
          const hatFehler = fehler[si]?.length > 0
          const minVon    = si === 0 ? '00:00' : minToTime(timeToMin(tagDaten.slots[si - 1].bis) + 1)
          const minBis    = minToTime(timeToMin(slot.von) + 1)
          const maxVon    = minToTime(timeToMin(slot.bis) - 1)

          return (
            <div key={si}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: hatFehler ? '#FEF2F2' : 'var(--bg-alt)',
                border: `1px solid ${hatFehler ? '#FCA5A5' : 'var(--border)'}`,
                borderRadius: 'var(--r)', padding: '5px 10px',
              }}>
                <input type="time" value={slot.von} min={minVon} max={maxVon}
                  onChange={e => updateSlot(tag.key, si, 'von', e.target.value)}
                  style={{ border: 'none', background: 'transparent', fontSize: '0.84rem', fontWeight: 600, color: 'var(--black)', cursor: 'pointer', outline: 'none', width: 72 }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>–</span>
                <input type="time" value={slot.bis} min={minBis} max="23:59"
                  onChange={e => updateSlot(tag.key, si, 'bis', e.target.value)}
                  style={{ border: 'none', background: 'transparent', fontSize: '0.84rem', fontWeight: 600, color: 'var(--black)', cursor: 'pointer', outline: 'none', width: 72 }} />
                {tagDaten.slots.length > 1 && (
                  <button onClick={() => removeSlot(tag.key, si)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--muted)', fontSize: '0.9rem', padding: '0 2px', lineHeight: 1,
                  }}>✕</button>
                )}
              </div>
              {hatFehler && (
                <div style={{ fontSize: '0.72rem', color: '#DC2626', marginTop: 2, paddingLeft: 2 }}>
                  {fehler[si][0]}
                </div>
              )}
            </div>
          )
        })}
        {kannHinzu && (
          <button onClick={() => addSlot(tag.key)} style={{
            background: 'none', border: '1px dashed var(--border)',
            borderRadius: 'var(--r)', padding: '5px 12px',
            fontSize: '0.80rem', color: 'var(--muted)', cursor: 'pointer', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--black)'; e.currentTarget.style.color = 'var(--black)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
            + Zeitraum
          </button>
        )}
      </div>
    )
  }

  // ============================================
  // TOGGLE
  // ============================================

  function Toggle({ aktiv, onClick }) {
    return (
      <div onClick={onClick} style={{
        width: 36, height: 20, borderRadius: 10, cursor: 'pointer',
        background: aktiv ? 'var(--black)' : 'var(--border)',
        position: 'relative', flexShrink: 0, transition: 'background 0.2s',
      }}>
        <div style={{
          position: 'absolute', top: 3, left: aktiv ? 19 : 3,
          width: 14, height: 14, borderRadius: '50%',
          background: 'var(--white)', transition: 'left 0.2s',
        }} />
      </div>
    )
  }

  // ============================================
  // PILL BUTTON
  // ============================================

  function PillButton({ label, aktiv, onClick }) {
    return (
      <button onClick={onClick} style={{
        padding: '6px 14px', fontSize: '0.82rem', cursor: 'pointer',
        borderRadius: 'var(--r)',
        border: aktiv ? '2px solid var(--black)' : '1px solid var(--border)',
        background: aktiv ? 'var(--black)' : 'var(--bg-alt)',
        color: aktiv ? 'var(--white)' : 'var(--black)',
        fontWeight: aktiv ? 600 : 400,
        transition: 'all 0.15s',
      }}>
        {label}
      </button>
    )
  }

  // ============================================
  // KALENDER RENDER
  // ============================================

  function renderKalender() {
    const daysInMonth = getDaysInMonth(kalYear, kalMonth)
    const firstDay    = getFirstDayOfMonth(kalYear, kalMonth)
    const cells       = []

    for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} />)

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr   = `${kalYear}-${String(kalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const tagKey    = getWochentagKey(kalYear, kalMonth, d)
      const tagDaten  = verfuegbarkeit[tagKey]
      const blocked   = isDayBlocked(dateStr)
      const blockList = getBlockerForDay(dateStr)
      const isToday   = dateStr === today.toISOString().slice(0, 10)

      const bgColor     = blocked ? '#FEE2E2' : !tagDaten.aktiv ? 'var(--bg-alt)' : '#F0FDF4'
      const borderColor = blocked ? '#FCA5A5' : !tagDaten.aktiv ? 'var(--border)' : '#86EFAC'

      cells.push(
        <div key={d}
          onClick={() => blocked ? openEditBlocker(blocker.indexOf(blockList[0])) : openAddBlocker(dateStr)}
          style={{
            background: bgColor, border: `1px solid ${borderColor}`,
            borderRadius: 'var(--r)', padding: '8px 10px', cursor: 'pointer',
            minHeight: 72, display: 'flex', flexDirection: 'column', gap: 4,
            outline: isToday ? '2px solid var(--black)' : 'none', outlineOffset: 1,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          <div style={{
            fontSize: '0.82rem', fontWeight: isToday ? 700 : 500,
            color: blocked ? '#DC2626' : !tagDaten.aktiv ? 'var(--muted)' : '#16A34A',
          }}>{d}</div>
          {blocked
            ? blockList.map((b, i) => {
                const t = BLOCK_TYPEN.find(x => x.value === b.typ) || BLOCK_TYPEN[4]
                return <div key={i} style={{ fontSize: '0.68rem', color: '#DC2626', fontWeight: 500, lineHeight: 1.2 }}>{t.emoji} {b.titel}</div>
              })
            : tagDaten.aktiv
              ? tagDaten.slots.map((s, i) => (
                  <div key={i} style={{ fontSize: '0.68rem', color: '#16A34A', fontWeight: 500, lineHeight: 1.2 }}>{s.von}–{s.bis}</div>
                ))
              : <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>Frei</div>
          }
        </div>
      )
    }
    return cells
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="page">

      {/* ---- Seitenkopf ---- */}
      <div className="section-head">
        <div>
          <div className="section-head__title">Availability</div>
          <div className="section-head__sub">Definiere deine wöchentliche Verfügbarkeit für Buchungen.</div>
        </div>
        <div className="section-head__actions">

          {/* Statistik-Badges */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: `${aktiveTage} Tage/Woche`,       color: '#F0FDF4', border: '#86EFAC', text: '#16A34A' },
              { label: `${wochenstunden} Std/Woche`,     color: '#EFF6FF', border: '#93C5FD', text: '#2563EB' },
              { label: `${blocker.length} Blocker aktiv`,color: blocker.length > 0 ? '#FEF2F2' : 'var(--bg-alt)', border: blocker.length > 0 ? '#FCA5A5' : 'var(--border)', text: blocker.length > 0 ? '#DC2626' : 'var(--muted)' },
            ].map(b => (
              <div key={b.label} style={{
                padding: '5px 12px', borderRadius: 'var(--r)',
                background: b.color, border: `1px solid ${b.border}`,
                fontSize: '0.76rem', fontWeight: 600, color: b.text,
              }}>
                {b.label}
              </div>
            ))}
          </div>

          {/* Vorschau-Button */}
          <button className="btn btn--ghost btn--sm" onClick={() => setVorschauOffen(v => !v)}>
            {vorschauOffen ? 'Vorschau schließen' : '👁 Buchungsvorschau'}
          </button>

          {/* View-Switcher */}
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            {[
              { key: 'liste', label: 'Liste', icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              )},
              { key: 'kalender', label: 'Kalender', icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              )},
            ].map(v => (
              <button key={v.key} onClick={() => setView(v.key)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', fontSize: '0.82rem', fontWeight: 500,
                border: 'none', cursor: 'pointer',
                background: view === v.key ? 'var(--black)' : 'var(--white)',
                color:      view === v.key ? 'var(--white)' : 'var(--muted)',
                transition: 'background 0.15s, color 0.15s',
              }}>
                {v.icon}{v.label}
              </button>
            ))}
          </div>

          <button className="btn btn--primary btn--sm" onClick={handleSpeichern}>Speichern</button>
        </div>
      </div>

      {/* ============================================
          BUCHUNGSVORSCHAU (ausklappbar)
          ============================================ */}
      {vorschauOffen && (
        <div className="card" style={{ borderLeft: '3px solid var(--black)' }}>
          <div className="card-header">
            <div className="card-header__title">👁 Buchungsvorschau</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
              Nächste verfügbare Slots für deine Kunden
            </div>
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            {vorschauSlots.length === 0 ? (
              <div style={{ color: 'var(--muted)', fontSize: '0.84rem', fontStyle: 'italic' }}>
                Keine verfügbaren Slots gefunden — prüfe deine Wochenverfügbarkeit.
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {vorschauSlots.map((s, i) => (
                  <div key={i} style={{
                    padding: '8px 14px', background: '#F0FDF4',
                    border: '1px solid #86EFAC', borderRadius: 'var(--r)',
                    fontSize: '0.82rem',
                  }}>
                    <div style={{ fontWeight: 600, color: '#16A34A' }}>{s.datum}</div>
                    <div style={{ color: '#15803D' }}>{s.von} – {s.bis}</div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: 12, fontSize: '0.74rem', color: 'var(--muted)' }}>
              * Vorschau basiert auf Wochenverfügbarkeit & Blockern. Puffer und Buchungsdauer werden im finalen Buchungslink berücksichtigt.
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          LISTEN-ANSICHT
          ============================================ */}
      {view === 'liste' && (
        <div className="card">
          <div className="card-header">
            <div className="card-header__title">Wochenverfügbarkeit</div>
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            {WOCHENTAGE.map((tag, ti) => {
              const tagDaten = verfuegbarkeit[tag.key]
              return (
                <div key={tag.key} style={{
                  display: 'grid', gridTemplateColumns: '160px 1fr auto',
                  alignItems: 'flex-start', gap: 16, padding: '14px 0',
                  borderBottom: ti < WOCHENTAGE.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 7 }}>
                    <Toggle aktiv={tagDaten.aktiv} onClick={() => toggleTag(tag.key)} />
                    <span style={{
                      fontSize: '0.86rem', fontWeight: tagDaten.aktiv ? 600 : 400,
                      color: tagDaten.aktiv ? 'var(--black)' : 'var(--muted)',
                    }}>{tag.label}</span>
                  </div>
                  <div>{renderSlots(tag)}</div>
                  <div style={{ paddingTop: 8 }}>
                    {tagDaten.aktiv && (
                      <button onClick={() => aufAlleTage(tag.key)} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '0.78rem', color: 'var(--muted)',
                        textDecoration: 'underline', whiteSpace: 'nowrap', padding: 0,
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--black)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
                        Auf alle Tage
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ============================================
          KALENDER-ANSICHT
          ============================================ */}
      {view === 'kalender' && (
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button className="btn btn--ghost btn--sm" onClick={() => {
                if (kalMonth === 0) { setKalMonth(11); setKalYear(y => y - 1) }
                else setKalMonth(m => m - 1)
              }}>‹</button>
              <span style={{ fontSize: '0.96rem', fontWeight: 600, minWidth: 160, textAlign: 'center' }}>
                {MONATSNAMEN[kalMonth]} {kalYear}
              </span>
              <button className="btn btn--ghost btn--sm" onClick={() => {
                if (kalMonth === 11) { setKalMonth(0); setKalYear(y => y + 1) }
                else setKalMonth(m => m + 1)
              }}>›</button>
              <button className="btn btn--ghost btn--sm"
                style={{ marginLeft: 8, fontSize: '0.78rem' }}
                onClick={() => { setKalMonth(today.getMonth()); setKalYear(today.getFullYear()) }}>
                Heute
              </button>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {[
                { color: '#F0FDF4', border: '#86EFAC', label: 'Verfügbar' },
                { color: 'var(--bg-alt)', border: 'var(--border)', label: 'Nicht verfügbar' },
                { color: '#FEE2E2', border: '#FCA5A5', label: 'Blockiert' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color, border: `1px solid ${l.border}` }} />
                  <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{l.label}</span>
                </div>
              ))}
              <button className="btn btn--outline btn--sm" onClick={() => openAddBlocker()}>+ Blockieren</button>
            </div>
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
              {WOCHENTAGE.map(t => (
                <div key={t.key} style={{
                  textAlign: 'center', fontSize: '0.76rem', fontWeight: 600,
                  color: 'var(--muted)', padding: '4px 0',
                }}>
                  {t.kurz}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {renderKalender()}
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          IMMER SICHTBAR
          ============================================ */}

      {/* --- Pausen --- */}
      <div className="card">
        <div className="card-header">
          <div className="card-header__title">
            Feste Pausen
            {pausen.length > 0 && (
              <span style={{ marginLeft: 8, fontSize: '0.78rem', fontWeight: 400, color: 'var(--muted)' }}>
                {pausen.length} aktiv
              </span>
            )}
          </div>
          <button className="btn btn--outline btn--sm" onClick={openAddPause}>+ Pause hinzufügen</button>
        </div>
        <div style={{ padding: '0 24px 24px' }}>
          {pausen.length === 0 ? (
            <div style={{
              padding: '24px 0', textAlign: 'center', color: 'var(--muted)', fontSize: '0.86rem',
              border: '1px dashed var(--border)', borderRadius: 'var(--r)',
            }}>
              Keine festen Pausen definiert.<br />
              <span style={{ fontSize: '0.78rem' }}>z.B. Mittagspause 12:00–13:00 täglich blockieren.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {pausen.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px',
                  background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 'var(--r)',
                }}>
                  <span style={{ fontSize: '0.88rem' }}>☕</span>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{p.label}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{p.von} – {p.bis} täglich</div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginLeft: 4 }}>
                    <button className="btn btn--ghost btn--sm" onClick={() => openEditPause(i)}>✎</button>
                    <button className="btn btn--ghost btn--sm" style={{ color: 'var(--red)' }} onClick={() => deletePause(i)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- Blockierte Zeiträume --- */}
      <div className="card">
        <div className="card-header">
          <div className="card-header__title">
            Blockierte Zeiträume
            {blocker.length > 0 && (
              <span style={{ marginLeft: 8, fontSize: '0.78rem', fontWeight: 400, color: 'var(--muted)' }}>
                {blocker.length} Einträge
              </span>
            )}
          </div>
          <button className="btn btn--outline btn--sm" onClick={() => openAddBlocker()}>
            + Zeitraum blockieren
          </button>
        </div>
        <div style={{ padding: '0 24px 24px' }}>
          {blocker.length === 0 ? (
            <div style={{
              padding: '32px 0', textAlign: 'center', color: 'var(--muted)', fontSize: '0.86rem',
              border: '1px dashed var(--border)', borderRadius: 'var(--r)',
            }}>
              Keine blockierten Zeiträume vorhanden.<br />
              <span style={{ fontSize: '0.78rem' }}>Urlaub, Events oder Feiertage hier eintragen.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {blocker.map((b, i) => {
                const typInfo = BLOCK_TYPEN.find(t => t.value === b.typ) || BLOCK_TYPEN[4]
                const wiederInfo = WIEDERHOLUNG_OPTIONEN.find(w => w.value === b.wiederholung)
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
                    background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--r)',
                  }}>
                    <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{typInfo.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 600, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {b.titel}
                        {b.wiederholung !== 'keine' && (
                          <span style={{
                            fontSize: '0.70rem', padding: '2px 7px', borderRadius: 999,
                            background: '#EFF6FF', border: '1px solid #93C5FD', color: '#2563EB', fontWeight: 500,
                          }}>
                            🔁 {wiederInfo?.label}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', gap: 10 }}>
                        <span>{typInfo.label}</span><span>·</span><span>{blockerDatumLabel(b)}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn--ghost btn--sm" onClick={() => openEditBlocker(i)}>Bearbeiten</button>
                      <button className="btn btn--ghost btn--sm" style={{ color: 'var(--red)' }} onClick={() => deleteBlocker(i)}>Entfernen</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* --- Puffer & Einstellungen --- */}
      <div className="card">
        <div className="card-header">
          <div className="card-header__title">Puffer & Einstellungen</div>
        </div>
        <div style={{ padding: '0 24px 24px' }}>

          {/* Puffer vor + nach */}
          {[
            { key: 'pufferVor',  titel: 'Puffer vor Termin',  sub: 'Sperrzeit vor jedem Termin'  },
            { key: 'pufferNach', titel: 'Puffer nach Termin', sub: 'Sperrzeit nach jedem Termin' },
          ].map(p => (
            <div key={p.key} style={{
              display: 'grid', gridTemplateColumns: '220px 1fr',
              alignItems: 'flex-start', gap: 24, padding: '18px 0',
              borderBottom: '1px solid var(--border)',
            }}>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 600, marginBottom: 3 }}>{p.titel}</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{p.sub}</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[
                  { label: 'Kein Puffer', value: '0'  },
                  { label: '5 Min',       value: '5'  },
                  { label: '10 Min',      value: '10' },
                  { label: '15 Min',      value: '15' },
                  { label: '30 Min',      value: '30' },
                ].map(o => (
                  <PillButton key={o.value} label={o.label}
                    aktiv={einstellungen[p.key] === o.value}
                    onClick={() => setEinstellungen(e => ({ ...e, [p.key]: o.value }))} />
                ))}
              </div>
            </div>
          ))}

          {/* Vorlaufzeit */}
          <div style={{
            display: 'grid', gridTemplateColumns: '220px 1fr',
            alignItems: 'flex-start', gap: 24, padding: '18px 0',
            borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, marginBottom: 3 }}>Min. Vorlaufzeit</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>Wie kurzfristig buchbar?</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { label: 'Keine',  value: '0'  },
                { label: '1 Std',  value: '1'  },
                { label: '2 Std',  value: '2'  },
                { label: '4 Std',  value: '4'  },
                { label: '24 Std', value: '24' },
                { label: '48 Std', value: '48' },
              ].map(o => (
                <PillButton key={o.value} label={o.label}
                  aktiv={einstellungen.vorlaufzeit === o.value}
                  onClick={() => setEinstellungen(e => ({ ...e, vorlaufzeit: o.value }))} />
              ))}
            </div>
          </div>

          {/* Buchungsreichweite */}
          <div style={{
            display: 'grid', gridTemplateColumns: '220px 1fr',
            alignItems: 'flex-start', gap: 24, padding: '18px 0',
            borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, marginBottom: 3 }}>Max. Buchungsreichweite</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>Wie weit in die Zukunft buchbar?</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { label: '2 Wochen', value: '14'  },
                { label: '1 Monat',  value: '30'  },
                { label: '2 Monate', value: '60'  },
                { label: '3 Monate', value: '90'  },
                { label: '6 Monate', value: '180' },
                { label: 'Unbegrenzt', value: '0' },
              ].map(o => (
                <PillButton key={o.value} label={o.label}
                  aktiv={einstellungen.buchungsreichweite === o.value}
                  onClick={() => setEinstellungen(e => ({ ...e, buchungsreichweite: o.value }))} />
              ))}
            </div>
          </div>

          {/* Max. Buchungen/Tag */}
          <div style={{
            display: 'grid', gridTemplateColumns: '220px 1fr',
            alignItems: 'center', gap: 24, padding: '18px 0',
            borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, marginBottom: 3 }}>Max. Buchungen / Tag</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>Maximale Termine pro Tag</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {['1','2','3','4','5'].map(n => (
                <button key={n}
                  onClick={() => setEinstellungen(e => ({ ...e, maxBuchungenTag: e.maxBuchungenTag === n ? '' : n }))}
                  style={{
                    width: 36, height: 36, fontSize: '0.84rem', cursor: 'pointer',
                    borderRadius: 'var(--r)',
                    border: einstellungen.maxBuchungenTag === n ? '2px solid var(--black)' : '1px solid var(--border)',
                    background: einstellungen.maxBuchungenTag === n ? 'var(--black)' : 'var(--bg-alt)',
                    color: einstellungen.maxBuchungenTag === n ? 'var(--white)' : 'var(--black)',
                    fontWeight: einstellungen.maxBuchungenTag === n ? 600 : 400,
                    transition: 'all 0.15s',
                  }}>
                  {n}
                </button>
              ))}
              <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>oder</span>
              <input
                type="number" min="1" max="99" placeholder="Eigener Wert"
                value={['1','2','3','4','5'].includes(einstellungen.maxBuchungenTag) ? '' : einstellungen.maxBuchungenTag}
                onChange={e => setEinstellungen(prev => ({ ...prev, maxBuchungenTag: e.target.value }))}
                style={{
                  width: 110, padding: '6px 10px', fontSize: '0.84rem',
                  border: '1px solid var(--border)', borderRadius: 'var(--r)',
                  background: 'var(--bg-alt)', outline: 'none',
                }}
              />
              {einstellungen.maxBuchungenTag !== '' ? (
                <button onClick={() => setEinstellungen(e => ({ ...e, maxBuchungenTag: '' }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.76rem', color: 'var(--muted)', textDecoration: 'underline', padding: 0 }}>
                  Kein Limit
                </button>
              ) : (
                <span style={{ fontSize: '0.76rem', color: 'var(--muted)', fontStyle: 'italic' }}>Kein Limit</span>
              )}
            </div>
          </div>

          {/* Zeitzone */}
          <div style={{
            display: 'grid', gridTemplateColumns: '220px 1fr',
            alignItems: 'center', gap: 24, padding: '18px 0',
            borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, marginBottom: 3 }}>Zeitzone</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>Für internationale Kunden</div>
            </div>
            <select
              value={einstellungen.zeitzone}
              onChange={e => setEinstellungen(prev => ({ ...prev, zeitzone: e.target.value }))}
              style={{
                padding: '7px 12px', fontSize: '0.84rem', maxWidth: 260,
                border: '1px solid var(--border)', borderRadius: 'var(--r)',
                background: 'var(--bg-alt)', outline: 'none', cursor: 'pointer',
              }}>
              {ZEITZONEN.map(z => (
                <option key={z.value} value={z.value}>{z.label}</option>
              ))}
            </select>
          </div>

          {/* Wochenende buchbar */}
          <div style={{
            display: 'grid', gridTemplateColumns: '220px 1fr',
            alignItems: 'center', gap: 24, padding: '18px 0',
            borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, marginBottom: 3 }}>Wochenenden buchbar</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>Sa & So für Buchungen freigeben</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Toggle
                aktiv={einstellungen.wochenendeAktiv}
                onClick={() => {
                  const neu = !einstellungen.wochenendeAktiv
                  setEinstellungen(e => ({ ...e, wochenendeAktiv: neu }))
                  setVerfuegbarkeit(prev => ({
                    ...prev,
                    sa: { ...prev.sa, aktiv: neu, slots: neu ? [{ ...DEFAULT_SLOT }] : [] },
                    so: { ...prev.so, aktiv: neu, slots: neu ? [{ ...DEFAULT_SLOT }] : [] },
                  }))
                }}
              />
              <span style={{ fontSize: '0.84rem', color: einstellungen.wochenendeAktiv ? 'var(--black)' : 'var(--muted)' }}>
                {einstellungen.wochenendeAktiv ? 'Aktiviert' : 'Deaktiviert'}
              </span>
            </div>
          </div>

          {/* Feiertage blockieren + Bundesland */}
          <div style={{
            display: 'grid', gridTemplateColumns: '220px 1fr',
            alignItems: 'center', gap: 24, padding: '18px 0',
            borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, marginBottom: 3 }}>Feiertage automatisch blockieren</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>Deutsche Feiertage automatisch sperren</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Toggle
                aktiv={einstellungen.feiertagBlock}
                onClick={() => setEinstellungen(e => ({ ...e, feiertagBlock: !e.feiertagBlock }))}
              />
              <span style={{ fontSize: '0.84rem', color: einstellungen.feiertagBlock ? 'var(--black)' : 'var(--muted)' }}>
                {einstellungen.feiertagBlock ? 'Aktiviert' : 'Deaktiviert'}
              </span>
              {einstellungen.feiertagBlock && (
                <select
                  value={einstellungen.feiertagBundesland}
                  onChange={e => setEinstellungen(prev => ({ ...prev, feiertagBundesland: e.target.value }))}
                  style={{
                    padding: '6px 10px', fontSize: '0.82rem',
                    border: '1px solid var(--border)', borderRadius: 'var(--r)',
                    background: 'var(--bg-alt)', outline: 'none', cursor: 'pointer',
                  }}>
                  {BUNDESLAENDER.map(b => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Manuelle Bestätigung */}
          <div style={{
            display: 'grid', gridTemplateColumns: '220px 1fr',
            alignItems: 'center', gap: 24, padding: '18px 0',
            borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, marginBottom: 3 }}>Manuelle Bestätigung</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>Buchungen erst nach deiner Freigabe</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Toggle
                aktiv={einstellungen.manuelleBestaetigung}
                onClick={() => setEinstellungen(e => ({ ...e, manuelleBestaetigung: !e.manuelleBestaetigung }))}
              />
              <span style={{ fontSize: '0.84rem', color: einstellungen.manuelleBestaetigung ? 'var(--black)' : 'var(--muted)' }}>
                {einstellungen.manuelleBestaetigung ? 'Aktiviert — du bestätigst manuell' : 'Deaktiviert — sofortige Bestätigung'}
              </span>
            </div>
          </div>

          {/* Kalender-Sync */}
          <div style={{
            display: 'grid', gridTemplateColumns: '220px 1fr',
            alignItems: 'flex-start', gap: 24, padding: '18px 0',
          }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, marginBottom: 3 }}>Kalender-Sync</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>Externen Kalender verbinden</div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              {[
                { key: 'google',  label: '🗓 Google Kalender'  },
                { key: 'outlook', label: '📅 Outlook Kalender' },
              ].map(k => (
                <button key={k.key}
                  onClick={() => {
                    if (einstellungen.kalenderSync === k.key) {
                      setEinstellungen(e => ({ ...e, kalenderSync: null, kalenderSyncZeit: null }))
                      showToast(`✓ ${k.label} getrennt`)
                    } else {
                      setEinstellungen(e => ({ ...e, kalenderSync: k.key, kalenderSyncZeit: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) }))
                      showToast(`✓ ${k.label} verbunden`)
                    }
                  }}
                  style={{
                    padding: '7px 16px', fontSize: '0.82rem', cursor: 'pointer',
                    borderRadius: 'var(--r)',
                    border: einstellungen.kalenderSync === k.key ? '2px solid #16A34A' : '1px solid var(--border)',
                    background: einstellungen.kalenderSync === k.key ? '#F0FDF4' : 'var(--bg-alt)',
                    color: einstellungen.kalenderSync === k.key ? '#16A34A' : 'var(--black)',
                    fontWeight: einstellungen.kalenderSync === k.key ? 600 : 400,
                    transition: 'all 0.15s',
                  }}>
                  {einstellungen.kalenderSync === k.key ? '✓ Verbunden' : k.label}
                </button>
              ))}
              {einstellungen.kalenderSync && einstellungen.kalenderSyncZeit && (
                <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
                  Zuletzt sync: heute {einstellungen.kalenderSyncZeit}
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ============================================
          PAUSEN MODAL
          ============================================ */}
      {pauseModal && (
        <div className="modal-backdrop open">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-header__title">{editPause !== null ? 'Pause bearbeiten' : 'Pause hinzufügen'}</div>
              <button className="modal-close" onClick={() => setPauseModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Bezeichnung *</label>
                <input className="form-input" placeholder="z.B. Mittagspause, Kaffeepause..."
                  value={pauseForm.label}
                  onChange={e => setPauseForm({ ...pauseForm, label: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Von</label>
                  <input type="time" className="form-input" value={pauseForm.von}
                    onChange={e => setPauseForm({ ...pauseForm, von: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Bis</label>
                  <input type="time" className="form-input" value={pauseForm.bis}
                    onChange={e => setPauseForm({ ...pauseForm, bis: e.target.value })} />
                </div>
              </div>
              <div className="form-hint">Die Pause gilt täglich für alle aktiven Wochentage.</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn--ghost" onClick={() => setPauseModal(false)}>Abbrechen</button>
              {editPause !== null && (
                <button className="btn btn--ghost" style={{ color: 'var(--red)' }}
                  onClick={() => { deletePause(editPause); setPauseModal(false) }}>
                  Löschen
                </button>
              )}
              <button className="btn btn--primary"
                style={{ opacity: !pauseForm.label ? 0.5 : 1 }}
                onClick={handlePauseSave}>
                {editPause !== null ? 'Speichern' : 'Hinzufügen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          BLOCKER MODAL
          ============================================ */}
      {blockerModal && (
        <div className="modal-backdrop open">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-header__title">
                {editBlocker !== null ? 'Blocker bearbeiten' : 'Zeitraum blockieren'}
              </div>
              <button className="modal-close" onClick={() => setBlockerModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Bezeichnung *</label>
                <input className="form-input" placeholder="z.B. Sommerurlaub, Konferenz Berlin..."
                  value={blockForm.titel}
                  onChange={e => setBlockForm({ ...blockForm, titel: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Typ</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {BLOCK_TYPEN.map(t => (
                    <div key={t.value} onClick={() => setBlockForm({ ...blockForm, typ: t.value })} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px', borderRadius: 'var(--r)', cursor: 'pointer',
                      border: blockForm.typ === t.value ? '2px solid var(--black)' : '1px solid var(--border)',
                      background: blockForm.typ === t.value ? 'var(--black)' : 'var(--bg-alt)',
                      color: blockForm.typ === t.value ? 'var(--white)' : 'var(--black)',
                      fontSize: '0.82rem', fontWeight: blockForm.typ === t.value ? 600 : 400,
                      userSelect: 'none',
                    }}>
                      <span>{t.emoji}</span><span>{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Von *</label>
                  <input type="date" className="form-input" value={blockForm.vonDatum}
                    onChange={e => setBlockForm({ ...blockForm, vonDatum: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Bis (optional)</label>
                  <input type="date" className="form-input" value={blockForm.bisDatum} min={blockForm.vonDatum}
                    onChange={e => setBlockForm({ ...blockForm, bisDatum: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Toggle aktiv={blockForm.ganztag} onClick={() => setBlockForm({ ...blockForm, ganztag: !blockForm.ganztag })} />
                  <span style={{ fontSize: '0.84rem' }}>Ganztägig</span>
                </div>
              </div>
              {!blockForm.ganztag && (
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Von Uhrzeit</label>
                    <input type="time" className="form-input" value={blockForm.vonZeit}
                      onChange={e => setBlockForm({ ...blockForm, vonZeit: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bis Uhrzeit</label>
                    <input type="time" className="form-input" value={blockForm.bisZeit}
                      onChange={e => setBlockForm({ ...blockForm, bisZeit: e.target.value })} />
                  </div>
                </div>
              )}
              {/* Wiederholung */}
              <div className="form-group">
                <label className="form-label">Wiederholung</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {WIEDERHOLUNG_OPTIONEN.map(w => (
                    <div key={w.value} onClick={() => setBlockForm({ ...blockForm, wiederholung: w.value })} style={{
                      padding: '6px 14px', borderRadius: 'var(--r)', cursor: 'pointer', fontSize: '0.82rem',
                      border: blockForm.wiederholung === w.value ? '2px solid var(--black)' : '1px solid var(--border)',
                      background: blockForm.wiederholung === w.value ? 'var(--black)' : 'var(--bg-alt)',
                      color: blockForm.wiederholung === w.value ? 'var(--white)' : 'var(--black)',
                      fontWeight: blockForm.wiederholung === w.value ? 600 : 400,
                      userSelect: 'none',
                    }}>
                      {w.value !== 'keine' && '🔁 '}{w.label}
                    </div>
                  ))}
                </div>
              </div>
              {(!blockForm.titel || !blockForm.vonDatum) && (
                <div className="form-hint" style={{ color: 'var(--red)' }}>
                  * Bezeichnung und Von-Datum sind Pflichtfelder
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn--ghost" onClick={() => setBlockerModal(false)}>Abbrechen</button>
              {editBlocker !== null && (
                <button className="btn btn--ghost" style={{ color: 'var(--red)' }}
                  onClick={() => { deleteBlocker(editBlocker); setBlockerModal(false) }}>
                  Löschen
                </button>
              )}
              <button className="btn btn--primary"
                style={{ opacity: (!blockForm.titel || !blockForm.vonDatum) ? 0.5 : 1 }}
                onClick={handleBlockerSave}>
                {editBlocker !== null ? 'Speichern' : 'Blockieren'}
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
          zIndex: 300, animation: 'modalIn 0.3s ease',
        }}>
          {toast}
        </div>
      )}

    </div>
  )
}
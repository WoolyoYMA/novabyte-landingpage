'use client'
import { useState } from 'react'

// ============================================
// INITIALE DATEN
// ============================================

const INIT_PROFIL = {
  vorname: 'Martin', nachname: 'L.', email: 'martin@whalebyte.de',
  telefon: '+49 151 12345678', bio: 'Coach & Berater für digitale Transformation.',
  website: 'https://whalebyte.de', sprache: 'de', zeitzone: 'Europe/Berlin',
  datumsformat: 'DD.MM.YYYY', waehrung: 'EUR',
}

const INIT_FIRMA = {
  name: 'WhaleByte', website: 'https://whalebyte.de',
  adresse: 'Musterstraße 1', plz: '10115', stadt: 'Berlin', land: 'Deutschland',
  ustId: 'DE123456789', email: 'info@whalebyte.de',
}

const INIT_NOTIFS = {
  neueBuchung:       true,
  buchungStorniert:  true,
  erinnerung24h:     true,
  erinnerung1h:      false,
  neuerKontakt:      true,
  wochenbericht:     false,
  marketingEmails:   false,
}

const INIT_SICHERHEIT = {
  twoFa: false,
}

const INIT_ERSCHEINUNGSBILD = {
  modus:       'light',
  akzentfarbe: '#0A0A0A',
  kompakt:     false,
}

const ZEITZONEN = [
  'Europe/Berlin', 'Europe/Vienna', 'Europe/Zurich', 'Europe/London',
  'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo',
]

const SPRACHEN = [
  { value: 'de', label: 'Deutsch' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
]

const AKZENTFARBEN = [
  '#0A0A0A', '#2563EB', '#7C3AED', '#16A34A',
  '#D97706', '#DC2626', '#0891B2', '#BE185D',
]

// ============================================
// HILFS-KOMPONENTEN
// ============================================

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle" style={{ cursor: 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
      <span className="toggle-slider" />
    </label>
  )
}

function FormGruppe({ label, hilfe, fehler, children }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      {children}
      {hilfe  && !fehler && <div className="form-hint">{hilfe}</div>}
      {fehler && <div className="form-hint" style={{ color: 'var(--red)' }}>{fehler}</div>}
    </div>
  )
}

function Abschnitt({ titel, sub, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.96rem', fontWeight: 700 }}>{titel}</div>
        {sub && <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 3 }}>{sub}</div>}
      </div>
      {children}
    </div>
  )
}

function NotifZeile({ label, sub, checked, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{label}</div>
        {sub && <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 2 }}>{sub}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

// ============================================
// NAVIGATIONS-ITEMS
// ============================================

const NAV_ITEMS = [
  {
    id: 'profil', label: 'Profil',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  },
  {
    id: 'firma', label: 'Unternehmen',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    id: 'benachrichtigungen', label: 'Benachrichtigungen',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  },
  {
    id: 'sicherheit', label: 'Sicherheit',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
  {
    id: 'region', label: 'Sprache & Region',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  },
  {
    id: 'erscheinungsbild', label: 'Erscheinungsbild',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
  },
]

// ============================================
// HAUPTKOMPONENTE
// ============================================

export default function SettingsPage() {

  const [aktiv, setAktiv]           = useState('profil')
  const [profil, setProfil]         = useState(INIT_PROFIL)
  const [firma, setFirma]           = useState(INIT_FIRMA)
  const [notifs, setNotifs]         = useState(INIT_NOTIFS)
  const [sicherheit, setSicherheit] = useState(INIT_SICHERHEIT)
  const [design, setDesign]         = useState(INIT_ERSCHEINUNGSBILD)
  const [passwort, setPasswort]     = useState({ alt: '', neu: '', bestaetigen: '' })
  const [pwFehler, setPwFehler]     = useState({})
  const [toast, setToast]           = useState('')
  const [gespeichert, setGespeichert] = useState({})

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function handleSave(bereich) {
    setGespeichert(prev => ({ ...prev, [bereich]: true }))
    setTimeout(() => setGespeichert(prev => ({ ...prev, [bereich]: false })), 2000)
    showToast('✓ Einstellungen gespeichert')
  }

  function handlePasswortSave() {
    const f = {}
    if (!passwort.alt)                            f.alt = 'Pflichtfeld'
    if (passwort.neu.length < 8)                  f.neu = 'Mindestens 8 Zeichen'
    if (passwort.neu !== passwort.bestaetigen)    f.bestaetigen = 'Passwörter stimmen nicht überein'
    setPwFehler(f)
    if (Object.keys(f).length > 0) return
    setPasswort({ alt: '', neu: '', bestaetigen: '' })
    showToast('✓ Passwort geändert')
  }

  // ============================================
  // INHALTE PRO BEREICH
  // ============================================

  const INHALTE = {

    // ---- PROFIL ----
    profil: (
      <div>
        <Abschnitt titel="Persönliche Informationen" sub="Dein Name und deine Kontaktdaten.">

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#0A0A0A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, flexShrink: 0 }}>
              {profil.vorname[0]}{profil.nachname[0]}
            </div>
            <div>
              <button className="btn btn--outline btn--sm">Bild hochladen</button>
              <div style={{ fontSize: '0.76rem', color: 'var(--muted)', marginTop: 5 }}>JPG, PNG oder GIF · max. 2 MB</div>
            </div>
          </div>

          <div className="form-row">
            <FormGruppe label="Vorname">
              <input className="form-input" value={profil.vorname}
                onChange={e => setProfil(p => ({ ...p, vorname: e.target.value }))} />
            </FormGruppe>
            <FormGruppe label="Nachname">
              <input className="form-input" value={profil.nachname}
                onChange={e => setProfil(p => ({ ...p, nachname: e.target.value }))} />
            </FormGruppe>
          </div>

          <div className="form-row">
            <FormGruppe label="E-Mail" hilfe="Wird für Anmeldung und Benachrichtigungen genutzt">
              <input className="form-input" type="email" value={profil.email}
                onChange={e => setProfil(p => ({ ...p, email: e.target.value }))} />
            </FormGruppe>
            <FormGruppe label="Telefon">
              <input className="form-input" type="tel" value={profil.telefon}
                onChange={e => setProfil(p => ({ ...p, telefon: e.target.value }))} />
            </FormGruppe>
          </div>

          <FormGruppe label="Website">
            <input className="form-input" type="url" value={profil.website}
              onChange={e => setProfil(p => ({ ...p, website: e.target.value }))} />
          </FormGruppe>

          <FormGruppe label="Bio" hilfe="Kurze Beschreibung die auf deiner Buchungsseite angezeigt wird">
            <textarea className="form-input" rows={3} value={profil.bio}
              onChange={e => setProfil(p => ({ ...p, bio: e.target.value }))}
              style={{ resize: 'vertical' }} />
          </FormGruppe>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn--primary btn--sm" onClick={() => handleSave('profil')}>
              {gespeichert.profil ? '✓ Gespeichert' : 'Speichern'}
            </button>
          </div>
        </Abschnitt>
      </div>
    ),

    // ---- FIRMA ----
    firma: (
      <div>
        <Abschnitt titel="Unternehmensdaten" sub="Wird auf Rechnungen und der Buchungsseite angezeigt.">

          <div className="form-row">
            <FormGruppe label="Firmenname">
              <input className="form-input" value={firma.name}
                onChange={e => setFirma(p => ({ ...p, name: e.target.value }))} />
            </FormGruppe>
            <FormGruppe label="Website">
              <input className="form-input" type="url" value={firma.website}
                onChange={e => setFirma(p => ({ ...p, website: e.target.value }))} />
            </FormGruppe>
          </div>

          <div className="form-row">
            <FormGruppe label="E-Mail">
              <input className="form-input" type="email" value={firma.email}
                onChange={e => setFirma(p => ({ ...p, email: e.target.value }))} />
            </FormGruppe>
            <FormGruppe label="USt-IdNr.">
              <input className="form-input" value={firma.ustId}
                onChange={e => setFirma(p => ({ ...p, ustId: e.target.value }))} />
            </FormGruppe>
          </div>

          <FormGruppe label="Straße & Hausnummer">
            <input className="form-input" value={firma.adresse}
              onChange={e => setFirma(p => ({ ...p, adresse: e.target.value }))} />
          </FormGruppe>

          <div className="form-row">
            <FormGruppe label="PLZ">
              <input className="form-input" value={firma.plz}
                onChange={e => setFirma(p => ({ ...p, plz: e.target.value }))} />
            </FormGruppe>
            <FormGruppe label="Stadt">
              <input className="form-input" value={firma.stadt}
                onChange={e => setFirma(p => ({ ...p, stadt: e.target.value }))} />
            </FormGruppe>
          </div>

          <FormGruppe label="Land">
            <input className="form-input" value={firma.land}
              onChange={e => setFirma(p => ({ ...p, land: e.target.value }))} />
          </FormGruppe>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn--primary btn--sm" onClick={() => handleSave('firma')}>
              {gespeichert.firma ? '✓ Gespeichert' : 'Speichern'}
            </button>
          </div>
        </Abschnitt>
      </div>
    ),

    // ---- BENACHRICHTIGUNGEN ----
    benachrichtigungen: (
      <div>
        <Abschnitt titel="E-Mail-Benachrichtigungen" sub="Wähle wann du per E-Mail benachrichtigt werden möchtest.">
          <div style={{ marginBottom: 4 }}>
            <NotifZeile
              label="Neue Buchung"
              sub="Wenn ein Kunde einen Termin bucht"
              checked={notifs.neueBuchung}
              onChange={v => setNotifs(p => ({ ...p, neueBuchung: v }))}
            />
            <NotifZeile
              label="Buchung storniert"
              sub="Wenn ein Kunde einen Termin absagt"
              checked={notifs.buchungStorniert}
              onChange={v => setNotifs(p => ({ ...p, buchungStorniert: v }))}
            />
            <NotifZeile
              label="Erinnerung 24h vorher"
              sub="Termin-Erinnerung einen Tag im Voraus"
              checked={notifs.erinnerung24h}
              onChange={v => setNotifs(p => ({ ...p, erinnerung24h: v }))}
            />
            <NotifZeile
              label="Erinnerung 1h vorher"
              sub="Termin-Erinnerung eine Stunde im Voraus"
              checked={notifs.erinnerung1h}
              onChange={v => setNotifs(p => ({ ...p, erinnerung1h: v }))}
            />
            <NotifZeile
              label="Neuer Kontakt"
              sub="Wenn ein neuer Lead angelegt wird"
              checked={notifs.neuerKontakt}
              onChange={v => setNotifs(p => ({ ...p, neuerKontakt: v }))}
            />
            <NotifZeile
              label="Wochenbericht"
              sub="Zusammenfassung jeden Montag"
              checked={notifs.wochenbericht}
              onChange={v => setNotifs(p => ({ ...p, wochenbericht: v }))}
            />
            <NotifZeile
              label="Marketing-E-Mails"
              sub="Neuigkeiten, Updates und Angebote von TerminPilot"
              checked={notifs.marketingEmails}
              onChange={v => setNotifs(p => ({ ...p, marketingEmails: v }))}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <button className="btn btn--primary btn--sm" onClick={() => handleSave('notifs')}>
              {gespeichert.notifs ? '✓ Gespeichert' : 'Speichern'}
            </button>
          </div>
        </Abschnitt>
      </div>
    ),

    // ---- SICHERHEIT ----
    sicherheit: (
      <div>
        <Abschnitt titel="Passwort ändern" sub="Wähle ein sicheres Passwort mit mindestens 8 Zeichen.">
          <FormGruppe label="Aktuelles Passwort" fehler={pwFehler.alt}>
            <input className="form-input" type="password" value={passwort.alt}
              placeholder="••••••••"
              onChange={e => setPasswort(p => ({ ...p, alt: e.target.value }))} />
          </FormGruppe>
          <div className="form-row">
            <FormGruppe label="Neues Passwort" fehler={pwFehler.neu}>
              <input className="form-input" type="password" value={passwort.neu}
                placeholder="••••••••"
                onChange={e => setPasswort(p => ({ ...p, neu: e.target.value }))} />
            </FormGruppe>
            <FormGruppe label="Passwort bestätigen" fehler={pwFehler.bestaetigen}>
              <input className="form-input" type="password" value={passwort.bestaetigen}
                placeholder="••••••••"
                onChange={e => setPasswort(p => ({ ...p, bestaetigen: e.target.value }))} />
            </FormGruppe>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn--primary btn--sm" onClick={handlePasswortSave}>
              Passwort ändern
            </button>
          </div>
        </Abschnitt>

        <Abschnitt titel="Zwei-Faktor-Authentifizierung" sub="Erhöhe die Sicherheit deines Kontos mit 2FA.">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--r)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Zwei-Faktor-Authentifizierung</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 3 }}>
                {sicherheit.twoFa ? '✅ Aktiviert — dein Konto ist zusätzlich gesichert' : 'Aktuell deaktiviert'}
              </div>
            </div>
            <Toggle checked={sicherheit.twoFa} onChange={v => { setSicherheit(p => ({ ...p, twoFa: v })); showToast(v ? '✓ 2FA aktiviert' : '2FA deaktiviert') }} />
          </div>
        </Abschnitt>

        <Abschnitt titel="Aktive Sessions" sub="Geräte auf denen du aktuell angemeldet bist.">
          {[
            { gerät: 'Chrome · macOS', ort: 'Berlin, Deutschland', zeit: 'Jetzt aktiv', aktuell: true  },
            { gerät: 'Safari · iPhone', ort: 'Berlin, Deutschland', zeit: 'Vor 2 Stunden', aktuell: false },
            { gerät: 'Firefox · Windows', ort: 'Hamburg, Deutschland', zeit: 'Gestern 18:32', aktuell: false },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--r)', marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--r)', background: 'var(--white)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {s.gerät}
                    {s.aktuell && <span style={{ fontSize: '0.68rem', background: '#D1FAE5', color: '#065F46', padding: '2px 7px', borderRadius: 999, fontWeight: 600 }}>Dieses Gerät</span>}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{s.ort} · {s.zeit}</div>
                </div>
              </div>
              {!s.aktuell && (
                <button className="btn btn--ghost btn--sm" style={{ color: 'var(--red)' }}
                  onClick={() => showToast('Session beendet')}>
                  Beenden
                </button>
              )}
            </div>
          ))}
        </Abschnitt>
      </div>
    ),

    // ---- REGION ----
    region: (
      <div>
        <Abschnitt titel="Sprache & Region" sub="Lege deine bevorzugte Sprache und regionale Einstellungen fest.">

          <div className="form-row">
            <FormGruppe label="Sprache">
              <select className="form-input" value={profil.sprache}
                onChange={e => setProfil(p => ({ ...p, sprache: e.target.value }))}>
                {SPRACHEN.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </FormGruppe>
            <FormGruppe label="Zeitzone">
              <select className="form-input" value={profil.zeitzone}
                onChange={e => setProfil(p => ({ ...p, zeitzone: e.target.value }))}>
                {ZEITZONEN.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </FormGruppe>
          </div>

          <div className="form-row">
            <FormGruppe label="Datumsformat">
              <select className="form-input" value={profil.datumsformat}
                onChange={e => setProfil(p => ({ ...p, datumsformat: e.target.value }))}>
                <option value="DD.MM.YYYY">DD.MM.YYYY (z.B. 13.06.2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (z.B. 06/13/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (z.B. 2026-06-13)</option>
              </select>
            </FormGruppe>
            <FormGruppe label="Währung">
              <select className="form-input" value={profil.waehrung}
                onChange={e => setProfil(p => ({ ...p, waehrung: e.target.value }))}>
                <option value="EUR">Euro (€)</option>
                <option value="CHF">Schweizer Franken (CHF)</option>
                <option value="USD">US-Dollar ($)</option>
                <option value="GBP">Britisches Pfund (£)</option>
              </select>
            </FormGruppe>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn--primary btn--sm" onClick={() => handleSave('region')}>
              {gespeichert.region ? '✓ Gespeichert' : 'Speichern'}
            </button>
          </div>
        </Abschnitt>
      </div>
    ),

    // ---- ERSCHEINUNGSBILD ----
    erscheinungsbild: (
      <div>
        <Abschnitt titel="Erscheinungsbild" sub="Passe das Aussehen des Dashboards an.">

          {/* Modus */}
          <div className="form-group">
            <label className="form-label">Modus</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { value: 'light', label: 'Hell',   icon: '☀️' },
                { value: 'dark',  label: 'Dunkel', icon: '🌙' },
                { value: 'auto',  label: 'System', icon: '💻' },
              ].map(m => (
                <button key={m.value} onClick={() => setDesign(p => ({ ...p, modus: m.value }))}
                  style={{ padding: '16px', border: `2px solid ${design.modus === m.value ? 'var(--black)' : 'var(--border)'}`, borderRadius: 'var(--r)', background: design.modus === m.value ? 'var(--bg-alt)' : 'var(--white)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{m.icon}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: design.modus === m.value ? 700 : 400 }}>{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Akzentfarbe */}
          <div className="form-group">
            <label className="form-label">Akzentfarbe</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {AKZENTFARBEN.map(f => (
                <button key={f} onClick={() => setDesign(p => ({ ...p, akzentfarbe: f }))}
                  style={{ width: 32, height: 32, borderRadius: '50%', background: f, border: design.akzentfarbe === f ? '3px solid var(--black)' : '3px solid transparent', outline: design.akzentfarbe === f ? `2px solid ${f}` : 'none', outlineOffset: 2, cursor: 'pointer', transition: 'all 0.15s' }} />
              ))}
            </div>
          </div>

          {/* Kompakt-Modus */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--r)', marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Kompakter Modus</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 3 }}>Weniger Abstände, mehr Inhalt auf einen Blick</div>
            </div>
            <Toggle checked={design.kompakt} onChange={v => setDesign(p => ({ ...p, kompakt: v }))} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn--primary btn--sm" onClick={() => handleSave('design')}>
              {gespeichert.design ? '✓ Gespeichert' : 'Speichern'}
            </button>
          </div>
        </Abschnitt>

        <Abschnitt titel="Gefahrenzone" sub="Irreversible Aktionen — bitte mit Vorsicht nutzen.">
          <div style={{ border: '1px solid #FCA5A5', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            {[
              { titel: 'Alle Daten exportieren', sub: 'Lade eine Kopie aller deiner Daten herunter (CSV)', btn: 'Exportieren', farbe: 'var(--black)', danger: false },
              { titel: 'Konto deaktivieren',     sub: 'Dein Konto wird deaktiviert, Daten bleiben erhalten', btn: 'Deaktivieren', farbe: '#D97706', danger: false },
              { titel: 'Konto löschen',          sub: 'Alle Daten werden dauerhaft gelöscht — nicht rückgängig zu machen', btn: 'Konto löschen', farbe: 'var(--red)', danger: true },
            ].map((z, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', borderBottom: i < 2 ? '1px solid #FCA5A5' : 'none', background: z.danger ? '#FEF2F2' : 'var(--white)' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>{z.titel}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--muted)', marginTop: 2 }}>{z.sub}</div>
                </div>
                <button className="btn btn--ghost btn--sm" style={{ color: z.farbe, borderColor: z.farbe, flexShrink: 0 }}
                  onClick={() => showToast(`${z.titel} — TODO`)}>
                  {z.btn}
                </button>
              </div>
            ))}
          </div>
        </Abschnitt>
      </div>
    ),
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="page" style={{ gap: 0, padding: 0 }}>

      {/* Seitenkopf */}
      <div style={{ padding: '32px 32px 0' }}>
        <div className="section-head" style={{ marginBottom: 24 }}>
          <div>
            <div className="section-head__title">Einstellungen</div>
            <div className="section-head__sub">Verwalte dein Konto und deine Präferenzen.</div>
          </div>
        </div>
      </div>

      {/* Haupt-Layout */}
      <div style={{ display: 'flex', gap: 0, flex: 1, padding: '0 32px 32px', alignItems: 'flex-start' }}>

        {/* ---- LINKE NAVIGATION ---- */}
        <div style={{ width: 220, flexShrink: 0, marginRight: 24, position: 'sticky', top: 80 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => setAktiv(item.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: aktiv === item.id ? 'var(--black)' : 'none', color: aktiv === item.id ? 'var(--white)' : 'var(--black)', border: 'none', borderRadius: 'var(--r)', cursor: 'pointer', fontSize: '0.84rem', fontWeight: aktiv === item.id ? 600 : 400, textAlign: 'left', transition: 'all 0.15s' }}
                onMouseEnter={e => { if (aktiv !== item.id) e.currentTarget.style.background = 'var(--bg-alt)' }}
                onMouseLeave={e => { if (aktiv !== item.id) e.currentTarget.style.background = 'none' }}>
                <span style={{ opacity: aktiv === item.id ? 1 : 0.5 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* ---- RECHTER INHALT ---- */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="card" style={{ padding: '32px' }}>
            {INHALTE[aktiv]}
          </div>
        </div>

      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'var(--black)', color: 'var(--white)', padding: '12px 20px', borderRadius: 'var(--r)', fontSize: '0.86rem', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 300, animation: 'modalIn 0.3s ease' }}>
          {toast}
        </div>
      )}

    </div>
  )
}
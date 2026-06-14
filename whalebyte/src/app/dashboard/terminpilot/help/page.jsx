'use client'
import { useState } from 'react'

// ============================================
// HILFE-INHALTE
// ============================================

const KAPITEL = [
  {
    id: 'einstieg',
    label: 'Einstieg',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    artikel: [
      {
        id: 'was-ist-terminpilot',
        titel: 'Was ist TerminPilot?',
        inhalt: (
          <div>
            <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
              TerminPilot ist ein intelligentes Buchungs- und Terminverwaltungs-Tool für Coaches, Berater und Freelancer. Du erstellst Termin-Typen, teilst deinen Buchungslink und TerminPilot übernimmt den Rest.
            </p>
            <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 6, padding: '14px 16px', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: '0.86rem', marginBottom: 6, color: '#065F46' }}>✅ Das bekommst du mit TerminPilot</div>
              <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['Automatische Terminbuchung ohne E-Mail-Ping-Pong', 'Kalender-Sync mit Google, Outlook & Apple', 'Automatische Video-Meeting-Links (Zoom, Teams, Meet)', 'Kontaktverwaltung mit Terminhistorie', 'n8n-Integration für Automationen'].map(p => (
                  <li key={p} style={{ fontSize: '0.84rem', color: '#065F46' }}>{p}</li>
                ))}
              </ul>
            </div>
            <InfoBox typ="tipp" titel="Schnellstart">
              Starte mit einem kostenlosen Termin-Typ (z.B. „Erstgespräch 30 Min"), teile den Link und warte auf deine erste Buchung.
            </InfoBox>
          </div>
        ),
      },
      {
        id: 'schnellstart',
        titel: 'Schnellstart in 5 Schritten',
        inhalt: (
          <div>
            <p style={{ marginBottom: 20, lineHeight: 1.7, color: 'var(--muted)' }}>
              In weniger als 10 Minuten bist du buchungsbereit.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { nr: 1, titel: 'Kalender verbinden',      text: 'Gehe zu Integrations → Kalender und verbinde Google Calendar oder Outlook. So werden gebuchte Termine automatisch eingetragen.',             link: '/dashboard/integrations', linkText: 'Zu Integrations' },
                { nr: 2, titel: 'Verfügbarkeit festlegen', text: 'Unter Availability kannst du deine Arbeitszeiten pro Wochentag einstellen. Kunden können nur in diesen Zeiten buchen.',                   link: '/dashboard/availability', linkText: 'Zu Availability' },
                { nr: 3, titel: 'Termin-Typ erstellen',    text: 'Unter Scheduling → „+ Neuer Termin-Typ" erstellst du z.B. ein 30-minütiges Erstgespräch.',                                                  link: '/dashboard/scheduling',   linkText: 'Zu Scheduling'   },
                { nr: 4, titel: 'Buchungslink teilen',     text: 'Kopiere den generierten Link und teile ihn auf deiner Website, in E-Mails oder Social Media.',                                               link: '/dashboard/scheduling',   linkText: 'Link kopieren'   },
                { nr: 5, titel: 'Erste Buchung abwarten',  text: 'Sobald jemand bucht, bekommst du eine Benachrichtigung, der Termin erscheint im Kalender und der Kontakt wird automatisch angelegt.',       link: '/dashboard/meetings',     linkText: 'Zu Meetings'     },
              ].map(s => (
                <div key={s.nr} style={{ display: 'flex', gap: 14, padding: '16px', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 6 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--black)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.84rem', flexShrink: 0 }}>{s.nr}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{s.titel}</div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 8 }}>{s.text}</div>
                    <a href={s.link} style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2563EB', textDecoration: 'none' }}>→ {s.linkText}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
  },

  {
    id: 'scheduling',
    label: 'Scheduling',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8"  y1="2" x2="8"  y2="6"/>
        <line x1="3"  y1="10" x2="21" y2="10"/>
      </svg>
    ),
    artikel: [
      {
        id: 'termin-typen',
        titel: 'Termin-Typen erstellen',
        inhalt: (
          <div>
            <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
              Termin-Typen sind die Buchungsoptionen, die deine Kunden sehen. Jeder Typ hat eine eigene Dauer, einen Preis und einen Buchungslink.
            </p>
            <Tabelle
              headers={['Feld', 'Beschreibung', 'Beispiel']}
              rows={[
                ['Name',          'Anzeigename des Termins',              'Erstgespräch'],
                ['Kategorie',     'Zielgruppe / Art des Termins',         'Lead, 1:1, Team'],
                ['Dauer',         'Länge in Minuten',                     '30, 60, 90 Min'],
                ['Preis',         '0 = kostenlos, sonst €-Betrag',        '0, 149, 299'],
                ['Status',        'Aktiv = buchbar, Entwurf = unsichtbar','Aktiv'],
                ['URL-Slug',      'Individueller Buchungslink',           'erstgespraech'],
                ['Farbe',         'Farbliche Kennzeichnung im Dashboard', '#4338CA'],
              ]}
            />
            <InfoBox typ="tipp" titel={'Tipp: Status „Entwurf"'}>
              Erstelle neue Typen zunächst als Entwurf und aktiviere sie erst wenn alles stimmt — so sind sie nicht öffentlich buchbar.
            </InfoBox>
          </div>
        ),
      },
      {
        id: 'buchungslink',
        titel: 'Buchungslink teilen',
        inhalt: (
          <div>
            <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
              Jeder Termin-Typ hat einen eindeutigen Buchungslink. Diesen Link kannst du überall teilen — auf deiner Website, in E-Mails, WhatsApp oder Instagram-Bio.
            </p>
            <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 6, padding: '14px 16px', marginBottom: 16 }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>Format</div>
              <code style={{ fontSize: '0.86rem', color: '#2563EB' }}>https://terminpilot.de/b/[dein-slug]</code>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { wo: 'Website',        wie: 'Button „Jetzt buchen" → Link einfügen'         },
                { wo: 'E-Mail-Signatur',wie: 'Text „Termin buchen" verlinken'                 },
                { wo: 'Instagram Bio',  wie: 'Direkt einfügen oder über Linktree'             },
                { wo: 'WhatsApp',       wie: 'Link direkt in Nachrichten teilen'              },
                { wo: 'n8n Workflow',   wie: 'Nach Lead-Erfassung automatisch Link versenden' },
              ].map(r => (
                <div key={r.wo} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 6 }}>
                  <div style={{ width: 110, fontSize: '0.82rem', fontWeight: 600, flexShrink: 0 }}>{r.wo}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{r.wie}</div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: 'conversion',
        titel: 'Conversion verstehen',
        inhalt: (
          <div>
            <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
              Die Conversion-Rate zeigt wie viele Besucher deiner Buchungsseite tatsächlich einen Termin gebucht haben.
            </p>
            <div style={{ background: '#EFF6FF', border: '1px solid #93C5FD', borderRadius: 6, padding: '16px', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 8, color: '#1D4ED8' }}>📊 Formel</div>
              <div style={{ fontSize: '0.86rem', color: '#1D4ED8', fontFamily: 'monospace' }}>
                Conversion = (Buchungen ÷ Seitenbesuche) × 100
              </div>
            </div>
            <Tabelle
              headers={['Conversion', 'Bewertung', 'Maßnahme']}
              rows={[
                ['unter 20%', '⚠️ Niedrig',   'Beschreibung verbessern, Preis prüfen'],
                ['20–50%',    '✅ Normal',     'Weiter optimieren'],
                ['50–70%',    '🚀 Gut',        'Diesen Typ als Vorlage nutzen'],
                ['über 70%',  '⭐ Exzellent',  'Skalieren und bewerben'],
              ]}
            />
            <InfoBox typ="tipp" titel="Conversion erhöhen">
              Kurze Dauer + kostenlos = höhere Conversion. Nutze ein kostenloses Erstgespräch als Einstieg und konvertiere dann zu bezahlten Angeboten.
            </InfoBox>
          </div>
        ),
      },
    ],
  },

  {
    id: 'contacts',
    label: 'Contacts',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    artikel: [
      {
        id: 'kontakte-verwalten',
        titel: 'Kontakte verwalten',
        inhalt: (
          <div>
            <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
              Unter Contacts findest du alle Personen die jemals mit dir interagiert haben — gebuchte Kunden, Leads und inaktive Kontakte.
            </p>
            <Tabelle
              headers={['Status', 'Bedeutung']}
              rows={[
                ['Aktiv',   'Hat mindestens einen Termin gebucht und ist regelmäßiger Kunde'],
                ['Lead',    'Hat Interesse gezeigt aber noch keinen Termin gebucht'],
                ['Inaktiv', 'War früher aktiv, hat sich aber länger nicht gemeldet'],
              ]}
            />
            <InfoBox typ="info" titel="Automatische Anlage">
              Jede Buchung legt automatisch einen Kontakt an — oder aktualisiert einen bestehenden wenn die E-Mail-Adresse bereits existiert.
            </InfoBox>
          </div>
        ),
      },
      {
        id: 'tags',
        titel: 'Tags & Segmentierung',
        inhalt: (
          <div>
            <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
              Tags helfen dir deine Kontakte zu segmentieren und gezielt anzusprechen. Du kannst eigene Tags erstellen und beliebig kombinieren.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {[
                { tag: 'VIP',        farbe: '#FEF3C7', text: '#92400E', info: 'Beste Kunden'            },
                { tag: 'Coaching',   farbe: '#D1FAE5', text: '#065F46', info: 'Coaching-Bucher'         },
                { tag: 'Beratung',   farbe: '#DBEAFE', text: '#1D4ED8', info: 'Beratungs-Bucher'        },
                { tag: 'Interessent',farbe: '#F3E8FF', text: '#7E22CE', info: 'Noch nicht konvertiert'  },
              ].map(t => (
                <div key={t.tag} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: t.farbe, borderRadius: 6, border: `1px solid ${t.text}22` }}>
                  <span style={{ fontWeight: 600, fontSize: '0.84rem', color: t.text }}>{t.tag}</span>
                  <span style={{ fontSize: '0.76rem', color: t.text, opacity: 0.7 }}>— {t.info}</span>
                </div>
              ))}
            </div>
            <InfoBox typ="tipp" titel="n8n + Tags">
              In n8n kannst du Tags als Trigger nutzen — z.B. automatisch eine E-Mail an alle „VIP"-Kontakte senden wenn ein neues Angebot erstellt wird.
            </InfoBox>
          </div>
        ),
      },
      {
        id: 'import-export',
        titel: 'Import & Export',
        inhalt: (
          <div>
            <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
              Du kannst Kontakte als CSV importieren und exportieren. Das ist nützlich um bestehende Kundenlisten zu migrieren oder Daten für externe Tools zu nutzen.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: '14px 16px', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 6 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>↑ CSV-Import</div>
                <div style={{ fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                  Exportiere deine Kontakte aus Google Contacts, Outlook oder einem CRM als CSV. Stelle sicher dass die Spalten <code style={{ background: 'var(--border)', padding: '1px 5px', borderRadius: 3 }}>Name</code> und <code style={{ background: 'var(--border)', padding: '1px 5px', borderRadius: 3 }}>E-Mail</code> vorhanden sind.
                </div>
              </div>
              <div style={{ padding: '14px 16px', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 6 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>↓ CSV-Export</div>
                <div style={{ fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                  Exportiere gefilterte Kontakte für Newsletter-Tools (Mailchimp, Brevo), CRMs oder n8n-Workflows. Der Export enthält alle sichtbaren Felder.
                </div>
              </div>
            </div>
            <InfoBox typ="warnung" titel="Datenschutz">
              Achte beim Import darauf dass du die Einwilligung der Personen hast ihre Daten zu speichern (DSGVO).
            </InfoBox>
          </div>
        ),
      },
    ],
  },

  {
    id: 'integrations',
    label: 'Integrations',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
    artikel: [
      {
        id: 'kalender-verbinden',
        titel: 'Kalender verbinden',
        inhalt: (
          <div>
            <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
              Verbinde deinen Kalender damit gebuchte Termine automatisch eingetragen und Konflikte vermieden werden.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {[
                { name: 'Google Calendar', wo: 'Google Cloud Console → APIs & Services → Credentials', was: 'Client ID + Client Secret', farbe: '#4285F4' },
                { name: 'Outlook',         wo: 'Azure Active Directory → App Registration',            was: 'Tenant ID + Client ID + Secret', farbe: '#0078D4' },
                { name: 'Apple Calendar',  wo: 'appleid.apple.com → Sicherheit',                       was: 'Apple ID + App-Passwort', farbe: '#FF3B30' },
              ].map(k => (
                <div key={k.name} style={{ display: 'flex', gap: 12, padding: '14px 16px', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: k.farbe, flexShrink: 0, marginTop: 5 }} />
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{k.name}</div>
                    <div style={{ fontSize: '0.80rem', color: 'var(--muted)', marginBottom: 2 }}>📍 {k.wo}</div>
                    <div style={{ fontSize: '0.80rem', color: 'var(--muted)' }}>🔑 Benötigt: {k.was}</div>
                  </div>
                </div>
              ))}
            </div>
            <InfoBox typ="info" titel="Zwei-Wege-Sync">
              Der Kalender-Sync läuft in beide Richtungen: Neue Buchungen erscheinen im Kalender und bestehende Kalendereinträge blockieren deine Verfügbarkeit.
            </InfoBox>
          </div>
        ),
      },
      {
        id: 'video-verbinden',
        titel: 'Video-Tool verbinden',
        inhalt: (
          <div>
            <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
              Verbinde Zoom, Google Meet oder Microsoft Teams damit bei jeder Buchung automatisch ein Meeting-Link erstellt wird.
            </p>
            <Tabelle
              headers={['Tool', 'Benötigt', 'Link wird erstellt']}
              rows={[
                ['Zoom',         'Account ID + Client ID + Secret', 'Sofort bei Buchung'],
                ['Google Meet',  'Gleiche Credentials wie Google Calendar', 'Via Calendar API'],
                ['MS Teams',     'Gleiche Azure App wie Outlook', 'Via Graph API'],
              ]}
            />
            <InfoBox typ="tipp" titel="Empfehlung">
              Wenn du bereits Google Calendar nutzt, verwende auch Google Meet — kein zusätzlicher Setup nötig.
            </InfoBox>
          </div>
        ),
      },
    ],
  },

  {
    id: 'n8n',
    label: 'n8n Workflows',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    artikel: [
      {
        id: 'n8n-einfuehrung',
        titel: 'Was ist n8n?',
        inhalt: (
          <div>
            <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
              n8n ist ein Open-Source Automatisierungs-Tool das du nutzen kannst um TerminPilot mit anderen Apps zu verbinden — ohne Code zu schreiben.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { titel: '📧 E-Mail-Automation',   text: 'Nach jeder Buchung automatisch Bestätigung + Erinnerung senden'  },
                { titel: '📊 CRM-Sync',            text: 'Neue Kontakte direkt in HubSpot, Notion oder Airtable anlegen'    },
                { titel: '💬 Slack-Benachrichtigung',text: 'Bei neuer Buchung sofort Slack-Nachricht erhalten'               },
                { titel: '🧾 Rechnung erstellen',  text: 'Nach bezahltem Termin automatisch Rechnung in Lexoffice anlegen'  },
              ].map(k => (
                <div key={k.titel} style={{ padding: '14px', background: '#F8FAFF', border: '1px solid #C7D7FD', borderRadius: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.84rem', marginBottom: 6, color: '#1D4ED8' }}>{k.titel}</div>
                  <div style={{ fontSize: '0.78rem', color: '#3B4B6B', lineHeight: 1.5 }}>{k.text}</div>
                </div>
              ))}
            </div>
            <a href="https://n8n.io" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#1D4ED8', color: '#fff', borderRadius: 6, fontSize: '0.84rem', fontWeight: 600, textDecoration: 'none' }}>
              n8n öffnen ↗
            </a>
          </div>
        ),
      },
      {
        id: 'webhook-setup',
        titel: 'Webhook einrichten',
        inhalt: (
          <div>
            <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
              TerminPilot sendet bei bestimmten Ereignissen automatisch Daten an deine n8n-Webhooks. So richtest du es ein:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {[
                { nr: 1, text: 'n8n öffnen → Neuen Workflow erstellen'                                           },
                { nr: 2, text: 'Node hinzufügen → „Webhook" auswählen'                                           },
                { nr: 3, text: 'Methode: POST, Pfad: z.B. terminpilot-buchung'                                    },
                { nr: 4, text: 'Webhook-URL kopieren (z.B. https://dein-n8n.de/webhook/terminpilot-buchung)'      },
                { nr: 5, text: 'In TerminPilot → Integrations → n8n Setup → URL einfügen'                        },
                { nr: 6, text: 'Testbuchung auslösen → Daten erscheinen in n8n'                                   },
              ].map(s => (
                <div key={s.nr} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 14px', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--black)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>{s.nr}</div>
                  <div style={{ fontSize: '0.84rem', lineHeight: 1.5, paddingTop: 2 }}>{s.text}</div>
                </div>
              ))}
            </div>
            <Tabelle
              headers={['Event', 'Wann ausgelöst', 'Webhook-Pfad']}
              rows={[
                ['Neue Buchung',       'Wenn ein Termin gebucht wird',       '/api/webhooks/booking-created' ],
                ['Buchung storniert',  'Wenn ein Termin abgesagt wird',      '/api/webhooks/booking-cancelled'],
                ['Neuer Kontakt',      'Wenn ein neuer Lead angelegt wird',  '/api/webhooks/contact-created'  ],
                ['Kalender-Sync',      'Bei Kalenderänderungen',             '/api/webhooks/calendar-sync'    ],
              ]}
            />
          </div>
        ),
      },
      {
        id: 'workflow-beispiele',
        titel: 'Workflow-Beispiele',
        inhalt: (
          <div>
            <p style={{ marginBottom: 20, lineHeight: 1.7, color: 'var(--muted)' }}>
              Hier sind fertige Workflow-Ideen die du in n8n nachbauen kannst:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                {
                  titel:   '🎯 Lead-Follow-Up Automation',
                  trigger: 'Neuer Lead angelegt',
                  schritte: ['Warte 1 Stunde', 'Sende Willkommens-E-Mail mit Buchungslink', 'Wenn nicht gebucht nach 3 Tagen: Reminder senden', 'Nach 7 Tagen: Lead als „kalt" markieren'],
                  farbe: '#EFF6FF', border: '#93C5FD', text: '#1D4ED8',
                },
                {
                  titel:   '📅 Buchungsbestätigung',
                  trigger: 'Neue Buchung erstellt',
                  schritte: ['Bestätigungs-E-Mail mit Meeting-Link senden', 'Eintrag in Google Sheets anlegen', 'Slack-Nachricht an dich senden', '24h vorher: Erinnerungs-E-Mail an Kunden'],
                  farbe: '#F0FDF4', border: '#86EFAC', text: '#065F46',
                },
                {
                  titel:   '🧾 Zahlungs-Workflow',
                  trigger: 'Buchung für bezahlten Termin',
                  schritte: ['Stripe-Zahlung initiieren', 'Nach Zahlung: Buchung bestätigen', 'Rechnung in Lexoffice erstellen', 'Kontakt als „Aktiv" markieren'],
                  farbe: '#FFF7ED', border: '#FED7AA', text: '#92400E',
                },
              ].map(w => (
                <div key={w.titel} style={{ padding: '16px', background: w.farbe, border: `1px solid ${w.border}`, borderRadius: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4, color: w.text }}>{w.titel}</div>
                  <div style={{ fontSize: '0.76rem', color: w.text, opacity: 0.8, marginBottom: 10 }}>Trigger: {w.trigger}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {w.schritte.map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.82rem', color: w.text }}>
                        <span style={{ opacity: 0.5 }}>{i + 1}.</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
  },

  {
    id: 'availability',
    label: 'Availability',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    artikel: [
      {
        id: 'verfuegbarkeit',
        titel: 'Verfügbarkeit einstellen',
        inhalt: (
          <div>
            <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
              Unter Availability legst du fest an welchen Tagen und zu welchen Uhrzeiten du buchbar bist. Kunden können nur innerhalb dieser Zeiten buchen.
            </p>
            <Tabelle
              headers={['Einstellung', 'Beschreibung']}
              rows={[
                ['Wochentage',      'Aktiviere nur die Tage an denen du arbeitest'],
                ['Zeitfenster',     'Lege Start- und Endzeit pro Tag fest (z.B. 09:00–17:00)'],
                ['Mehrere Slots',   'Du kannst pro Tag mehrere Zeitfenster definieren (z.B. Pause 12–13 Uhr)'],
                ['Puffer',          'Automatische Pause zwischen Terminen (z.B. 15 Min nach jedem Termin)'],
                ['Vorlaufzeit',     'Mindestzeit vor einer Buchung (z.B. 24h im Voraus)'],
              ]}
            />
            <InfoBox typ="tipp" titel="Tipp: Urlaub & Auszeiten">
              Blockiere einzelne Tage direkt im verbundenen Kalender — TerminPilot erkennt diese als belegt und zeigt sie nicht als verfügbar an.
            </InfoBox>
          </div>
        ),
      },
    ],
  },

  {
    id: 'faq',
    label: 'FAQ',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    artikel: [
      {
        id: 'haeufige-fragen',
        titel: 'Häufige Fragen',
        inhalt: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { frage: 'Kann ich mehrere Kalender verbinden?',               antwort: 'Ja, du kannst gleichzeitig Google Calendar und Outlook verbinden. TerminPilot prüft beide auf Konflikte.' },
              { frage: 'Was passiert wenn ich einen Termin-Typ deaktiviere?',antwort: 'Bestehende Buchungen bleiben erhalten. Neue Buchungen sind nicht mehr möglich. Der Link leitet auf eine Fehlerseite.' },
              { frage: 'Wie ändere ich den Buchungslink nachträglich?',      antwort: 'Unter Scheduling → Bearbeiten kannst du den URL-Slug ändern. Teile dann den neuen Link — der alte funktioniert nicht mehr.' },
              { frage: 'Werden Kontakte automatisch angelegt?',              antwort: 'Ja, bei jeder Buchung wird der Kontakt automatisch angelegt oder aktualisiert (basierend auf der E-Mail-Adresse).' },
              { frage: 'Kann ich Zahlungen direkt über TerminPilot nehmen?', antwort: 'Aktuell über n8n + Stripe möglich. Native Zahlungsintegration ist in Planung.' },
              { frage: 'Wie exportiere ich alle meine Daten?',               antwort: 'Unter Contacts → Export kannst du alle Kontakte als CSV exportieren. Termine können über den Kalender-Sync exportiert werden.' },
              { frage: 'Ist TerminPilot DSGVO-konform?',                    antwort: 'Alle Daten werden auf europäischen Servern gespeichert. Du kannst Kontakte jederzeit löschen und exportieren.' },
            ].map((f, i) => (
              <FaqItem key={i} frage={f.frage} antwort={f.antwort} />
            ))}
          </div>
        ),
      },
    ],
  },
]

// ============================================
// HILFS-KOMPONENTEN
// ============================================

function InfoBox({ typ, titel, children }) {
  const cfg = {
    tipp:    { bg: '#F0FDF4', border: '#86EFAC', icon: '💡', color: '#065F46' },
    info:    { bg: '#EFF6FF', border: '#93C5FD', icon: 'ℹ️', color: '#1D4ED8' },
    warnung: { bg: '#FEF3C7', border: '#FDE68A', icon: '⚠️', color: '#92400E' },
  }[typ] || { bg: '#F3F4F6', border: '#E5E7EB', icon: '•', color: '#374151' }

  return (
    <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 6, padding: '12px 14px', marginTop: 16 }}>
      <div style={{ fontWeight: 700, fontSize: '0.84rem', marginBottom: 4, color: cfg.color }}>
        {cfg.icon} {titel}
      </div>
      <div style={{ fontSize: '0.82rem', color: cfg.color, lineHeight: 1.6 }}>{children}</div>
    </div>
  )
}

function Tabelle({ headers, rows }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 16 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
        <thead>
          <tr style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
            {headers.map(h => (
              <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '10px 12px', verticalAlign: 'top', lineHeight: 1.5, fontWeight: j === 0 ? 600 : 400, color: j === 0 ? 'var(--black)' : 'var(--muted)' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FaqItem({ frage, antwort }) {
  const [offen, setOffen] = useState(false)
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
      <button
        onClick={() => setOffen(v => !v)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', background: offen ? 'var(--bg-alt)' : 'var(--white)', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{frage}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ flexShrink: 0, transition: 'transform 0.2s', transform: offen ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--muted)' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {offen && (
        <div style={{ padding: '12px 16px', background: 'var(--bg-alt)', borderTop: '1px solid var(--border)', fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.6 }}>
          {antwort}
        </div>
      )}
    </div>
  )
}

// ============================================
// HAUPTKOMPONENTE
// ============================================

export default function HelpPage() {

  const [aktivesKapitel, setAktivesKapitel] = useState('einstieg')
  const [aktiverArtikel, setAktiverArtikel] = useState('was-ist-terminpilot')
  const [suche, setSuche]                   = useState('')

  const kapitel  = KAPITEL.find(k => k.id === aktivesKapitel)
  const artikel  = kapitel?.artikel.find(a => a.id === aktiverArtikel)

  // Suche über alle Artikel
  const sucheErgebnis = suche.trim().length > 1
    ? KAPITEL.flatMap(k => k.artikel.map(a => ({ ...a, kapitelId: k.id, kapitelLabel: k.label }))).filter(a =>
        a.titel.toLowerCase().includes(suche.toLowerCase())
      )
    : []

  function navigiere(kapitelId, artikelId) {
    setAktivesKapitel(kapitelId)
    setAktiverArtikel(artikelId)
    setSuche('')
  }

  return (
    <div className="page" style={{ gap: 0, padding: 0 }}>

      {/* ---- Seitenkopf ---- */}
      <div style={{ padding: '32px 32px 0' }}>
        <div className="section-head" style={{ marginBottom: 24 }}>
          <div>
            <div className="section-head__title">Hilfe & Dokumentation</div>
            <div className="section-head__sub">Alles was du über TerminPilot wissen musst.</div>
          </div>
          <a href="https://n8n.io" target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--sm">
            n8n Docs ↗
          </a>
        </div>
      </div>

      {/* ---- Haupt-Layout: Links + Rechts ---- */}
      <div style={{ display: 'flex', gap: 0, flex: 1, padding: '0 32px 32px', alignItems: 'flex-start' }}>

        {/* ============================================
            LINKE NAVIGATION
            ============================================ */}
        <div style={{ width: 240, flexShrink: 0, marginRight: 24, position: 'sticky', top: 80 }}>

          {/* Suche */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text" placeholder="Hilfe durchsuchen…"
              value={suche} onChange={e => setSuche(e.target.value)}
              style={{ width: '100%', padding: '8px 10px 8px 30px', boxSizing: 'border-box', border: '1px solid var(--border)', borderRadius: 'var(--r)', fontSize: '0.82rem', background: 'var(--white)', outline: 'none' }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--black)'}
              onBlur={e  => e.currentTarget.style.borderColor = 'var(--border)'}
            />
            {suche && (
              <button onClick={() => setSuche('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.8rem', padding: 0 }}>✕</button>
            )}
          </div>

          {/* Suchergebnisse */}
          {sucheErgebnis.length > 0 && (
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden', marginBottom: 12 }}>
              {sucheErgebnis.map(a => (
                <button key={a.id} onClick={() => navigiere(a.kapitelId, a.id)}
                  style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: '10px 12px', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-alt)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{a.titel}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{a.kapitelLabel}</span>
                </button>
              ))}
            </div>
          )}

          {/* Kapitel-Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {KAPITEL.map(k => (
              <div key={k.id}>
                {/* Kapitel-Header */}
                <button
                  onClick={() => { setAktivesKapitel(k.id); setAktiverArtikel(k.artikel[0].id) }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: aktivesKapitel === k.id ? 'var(--black)' : 'none', color: aktivesKapitel === k.id ? 'var(--white)' : 'var(--black)', border: 'none', borderRadius: 'var(--r)', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 600, textAlign: 'left', transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (aktivesKapitel !== k.id) e.currentTarget.style.background = 'var(--bg-alt)' }}
                  onMouseLeave={e => { if (aktivesKapitel !== k.id) e.currentTarget.style.background = 'none' }}>
                  <span style={{ opacity: aktivesKapitel === k.id ? 1 : 0.6 }}>{k.icon}</span>
                  {k.label}
                </button>

                {/* Artikel-Liste (wenn Kapitel aktiv) */}
                {aktivesKapitel === k.id && (
                  <div style={{ marginLeft: 16, marginTop: 2, marginBottom: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {k.artikel.map(a => (
                      <button key={a.id} onClick={() => setAktiverArtikel(a.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: aktiverArtikel === a.id ? '#F3F4F6' : 'none', border: 'none', borderRadius: 'var(--r)', cursor: 'pointer', fontSize: '0.80rem', fontWeight: aktiverArtikel === a.id ? 600 : 400, color: aktiverArtikel === a.id ? 'var(--black)' : 'var(--muted)', textAlign: 'left', transition: 'all 0.1s' }}
                        onMouseEnter={e => { if (aktiverArtikel !== a.id) e.currentTarget.style.background = 'var(--bg-alt)' }}
                        onMouseLeave={e => { if (aktiverArtikel !== a.id) e.currentTarget.style.background = 'none' }}>
                        {aktiverArtikel === a.id && (
                          <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--black)', flexShrink: 0 }} />
                        )}
                        {a.titel}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ============================================
            RECHTER INHALT
            ============================================ */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="card" style={{ padding: '32px' }}>

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: '0.78rem', color: 'var(--muted)' }}>
              <span>Hilfe</span>
              <span>›</span>
              <span>{kapitel?.label}</span>
              <span>›</span>
              <span style={{ color: 'var(--black)', fontWeight: 600 }}>{artikel?.titel}</span>
            </div>

            {/* Artikel-Titel */}
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 20, lineHeight: 1.3 }}>
              {artikel?.titel}
            </h1>

            {/* Artikel-Inhalt */}
            <div style={{ fontSize: '0.88rem', lineHeight: 1.7 }}>
              {artikel?.inhalt}
            </div>

            {/* Navigation zwischen Artikeln */}
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              {(() => {
                const alleArtikel = KAPITEL.flatMap(k => k.artikel.map(a => ({ ...a, kapitelId: k.id })))
                const idx = alleArtikel.findIndex(a => a.id === aktiverArtikel)
                const vorher = alleArtikel[idx - 1]
                const nachher = alleArtikel[idx + 1]
                return (
                  <>
                    {vorher ? (
                      <button onClick={() => navigiere(vorher.kapitelId, vorher.id)}
                        style={{ display: 'flex', flexDirection: 'column', padding: '12px 16px', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--r)', cursor: 'pointer', textAlign: 'left', maxWidth: '45%' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 4 }}>← Vorheriger</span>
                        <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>{vorher.titel}</span>
                      </button>
                    ) : <div />}
                    {nachher ? (
                      <button onClick={() => navigiere(nachher.kapitelId, nachher.id)}
                        style={{ display: 'flex', flexDirection: 'column', padding: '12px 16px', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--r)', cursor: 'pointer', textAlign: 'right', maxWidth: '45%' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 4 }}>Nächster →</span>
                        <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>{nachher.titel}</span>
                      </button>
                    ) : <div />}
                  </>
                )
              })()}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
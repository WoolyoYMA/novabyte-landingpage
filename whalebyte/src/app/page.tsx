"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { UserButton, useAuth } from "@clerk/nextjs";
import "./page.css";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [demoMode, setDemoMode] = useState<'book' | 'reschedule' | 'cancel'>('book');
  const [demoStep, setDemoStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [product, setProduct] = useState('terminpilot');
  const [token, setToken] = useState('');

  // Handle scroll for nav
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live Demo Animation Logic
  const runDemo = async () => {
    setIsAnimating(true);
    setDemoStep(1);
    await new Promise(r => setTimeout(r, 1200));
    setDemoStep(2);
    await new Promise(r => setTimeout(r, 1200));
    setDemoStep(3);
    await new Promise(r => setTimeout(r, 1200));
    if (product === 'plus') {
      setDemoStep(4);
      await new Promise(r => setTimeout(r, 1200));
    }
    setIsAnimating(false);
    setToken('TP-' + Math.random().toString(36).substring(2, 6).toUpperCase());
  };

  return (
    <div className="font-sans text-[#0A0A0A]">
      {/* NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-[900] transition-all duration-400 ${isScrolled ? 'bg-white/96 border-b border-[#E8E8E8] backdrop-blur-lg shadow-sm' : 'bg-transparent border-b border-transparent'}`}>
        <div className="max-w-[1140px] mx-auto px-8 h-[68px] flex items-center justify-between gap-6">
          <a href="#" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="WhaleByte" width={36} height={36} className="object-contain" />
            <span className="text-lg font-light tracking-[0.18em] uppercase text-[#0A0A0A] flex flex-col leading-tight">
              Whale<strong className="font-black text-xl tracking-tight">Byte</strong>
            </span>
          </a>

          <ul className="hidden md:flex items-center gap-9 text-[0.86rem] font-semibold text-[#666666]">
            {['Problem', 'Funktionen', 'Live Demo', 'Preise', 'Referenzen', 'FAQ'].map((item) => (
              <li key={item}><a href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-black transition-colors relative group">
                {item}
                <span className="absolute bottom-[-2px] left-0 w-0 h-[1.5px] bg-black transition-all duration-300 group-hover:w-full"></span>
              </a></li>
            ))}
          </ul>

        <div className="hidden md:flex items-center gap-4">
  {/* Wenn NICHT eingeloggt */}
{!isSignedIn && (
  <>
    <a href="/sign-in" className="px-5 py-2 text-[0.85rem] font-bold text-black bg-white border border-black rounded-[4px] transition-all hover:bg-black hover:text-white">
      Login
    </a>
    <a href="/sign-up" className="px-7 py-3.5 text-[0.9rem] font-bold bg-black text-white rounded-[4px] transition-all hover:bg-white hover:text-black hover:border-2 hover:border-black">
      Sign Up
    </a>
  </>
)}

{/* Wenn EINGELOGGT */}
{isSignedIn && (
  <UserButton />
)}

{/* DEMO-BUTTON (bleibt immer da) */}
<a href="#demo" className="px-7 py-3.5 text-[0.9rem] font-bold bg-black text-white rounded-[4px] transition-all hover:bg-white hover:text-black hover:border-2 hover:border-black">
  Demo testen
</a>
</div>

          <button className="md:hidden flex flex-col gap-1.5 p-1.5" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span className={`block w-5 h-0.5 bg-black transition-transform ${isMobileMenuOpen ? 'translate-y-1.5 rotate-45' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-black transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-black transition-transform ${isMobileMenuOpen ? '-translate-y-1.5 -rotate-45' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
<div className={`fixed top-[68px] left-0 right-0 bg-white border-b border-[#E8E8E8] transition-all duration-500 overflow-hidden z-[899] ${isMobileMenuOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
  <div className="p-5 flex flex-col gap-1">
    {['Problem', 'Funktionen', 'Live Demo', 'Preise', 'Referenzen', 'FAQ'].map((item) => (
      <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="py-3 text-base font-semibold text-[#666666] border-b border-[#E8E8E8] hover:text-black" onClick={() => setIsMobileMenuOpen(false)}>{item}</a>
    ))}
    
    {!isSignedIn && (
      <>
        <a href="/sign-in" className="mt-5 px-7 py-4 text-center font-bold text-black bg-white border border-black rounded-[4px]">Login</a>
        <a href="/sign-up" className="px-7 py-4 text-center font-bold bg-black text-white rounded-[4px]">Sign Up</a>
      </>
    )}
    
    <a href="#demo" className="mt-5 px-7 py-4 text-center font-bold bg-black text-white rounded-[4px]">Demo testen</a>
  </div>
</div>

      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center pt-[68px] overflow-hidden bg-white">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)', backgroundSize: '32px 32px', maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 20%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 20%, transparent 100%)' }}></div>
          
          <div className="container mx-auto px-8 relative z-10 py-20">
            <span className="inline-block text-[0.68rem] font-bold tracking-[0.22em] uppercase text-[#999999] mb-4">Automatisierung für KMU</span>
            <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[1.02] tracking-[-0.055em] mb-9">
              Ihr Terminkalender.<br/>Vollautomatisch.<br/><span className="text-[#BBBBBB]">Ab heute.</span>
            </h1>
            <p className="text-[clamp(1rem,1.8vw,1.15rem)] text-[#666666] max-w-[520px] leading-[1.8] mb-11">
              WhaleByte übernimmt Buchung, Umbuchung, Stornierung, Erinnerung und Bewertungsanfrage — vollautomatisch, rund um die Uhr. Damit Sie sich auf Ihre Kunden konzentrieren können.
            </p>
            <div className="flex flex-wrap gap-3 mb-12">
              <a href="#demo" className="px-9 py-4 text-lg font-bold bg-black text-white rounded-[4px] transition-transform hover:scale-105 active:scale-95">Live Demo testen →</a>
              <a href="#pricing" className="px-9 py-4 text-lg font-bold border-2 border-black text-black rounded-[4px] transition-all hover:bg-black hover:text-white">Beratung buchen</a>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[0.78rem] font-semibold text-[#999999]">
              <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-black text-white text-[0.52rem] flex items-center justify-center">✓</span>Kein Vertrag</span>
              <span className="w-1 h-1 bg-[#E8E8E8] rounded-full"></span>
              <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-black text-white text-[0.52rem] flex items-center justify-center">✓</span>Sofort einsatzbereit</span>
              <span className="w-1 h-1 bg-[#E8E8E8] rounded-full"></span>
              <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-black text-white text-[0.52rem] flex items-center justify-center">✓</span>DSGVO-konform</span>
              <span className="w-1 h-1 bg-[#E8E8E8] rounded-full"></span>
              <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-black text-white text-[0.52rem] flex items-center justify-center">✓</span>14 Tage kostenlos</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#E8E8E8] overflow-hidden">
            <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-black to-transparent animate-sweep"></div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="border-y border-[#E8E8E8] bg-white py-3.5 overflow-hidden relative">
          <div className="flex w-max animate-marquee">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex">
                {[
                  { t: '−70%', s: 'No-Shows' },
                  { t: '8 Std.', s: 'gespart pro Woche' },
                  { t: '3×', s: 'mehr Google-Bewertungen' },
                  { t: '100%', s: 'automatisiert' },
                  { t: 'DSGVO-konform', s: '' },
                  { t: '15 Min.', s: 'Einrichtung' },
                  { t: 'WhatsApp', s: 'Integration' },
                  { t: 'Kein Vertrag', s: 'Monatlich kündbar' },
                  { t: '500+', s: 'zufriedene Kunden' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-8 text-[0.76rem] font-semibold text-[#999999] whitespace-nowrap border-r border-[#E8E8E8]">
                    <strong className="text-black">{item.t}</strong> {item.s}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* PROBLEM SECTION */}
        <section id="problem" className="py-32 bg-[#F7F7F7] border-t border-[#E8E8E8]">
          <div className="container mx-auto px-8">
            <div className="text-left mb-16">
              <span className="inline-block text-[0.68rem] font-bold tracking-[0.22em] uppercase text-[#999999] mb-4">Das Problem</span>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight tracking-tight mb-4">
                Wie viel Zeit verlieren Sie täglich<br/>durch <span className="relative inline-block after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-0 after:h-[3px] after:bg-black after:transition-all after:duration-700 hover:after:w-full">manuelle Terminverwaltung?</span>
              </h2>
              <p className="text-[1.1rem] text-[#666666] max-w-[520px] leading-relaxed mt-4">
                Für KMU-Inhaber ist die Terminverwaltung einer der größten versteckten Kostentreiber — in Zeit, Geld und Nerven.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#E8E8E8] border border-[#E8E8E8]">
              {[
                { title: 'Endlose Telefonate', text: 'Kunden rufen an, wenn Sie gerade arbeiten. Termine werden mündlich vereinbart, vergessen oder doppelt gebucht.', stat: '8 Std.', lbl: 'verloren pro Woche' },
                { title: 'No-Shows kosten Geld', text: 'Kunden vergessen Termine ohne automatische Erinnerung. Jeder nicht wahrgenommene Termin ist direkter Umsatzverlust.', stat: '€ 4.200', lbl: 'Verlust pro Jahr' },
                { title: 'Kaum Online-Bewertungen', text: 'Zufriedene Kunden hinterlassen selten von sich aus Bewertungen. Ohne aktive Anfrage verschenken Sie Vertrauen.', stat: '3×', lbl: 'mehr Bewertungen' },
              ].map((item, i) => (
                <div key={i} className="bg-[#F7F7F7] p-12 transition-colors hover:bg-white group relative overflow-hidden">
                  <div className="w-11 h-11 bg-black rounded-sm mb-6 transition-transform group-hover:scale-110 group-hover:rotate-[-4deg]"></div>
                  <h3 className="text-[1.05rem] font-black mb-3">{item.title}</h3>
                  <p className="text-[0.88rem] text-[#666666] leading-relaxed mb-7">{item.text}</p>
                  <span className="text-[2.8rem] font-black leading-none block">{item.stat}</span>
                  <span className="text-[0.72rem] text-[#666666] font-semibold block mt-1">{item.lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-32 bg-white border-t border-[#E8E8E8]">
          <div className="container mx-auto px-8">
            <div className="text-center mb-16">
              <span className="inline-block text-[0.68rem] font-bold tracking-[0.22em] uppercase text-[#999999] mb-4">Die Lösung</span>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight mb-4">Alles automatisiert.<br/>Sie entspannen.</h2>
              <p className="text-[1.1rem] text-[#666666] max-w-[500px] mx-auto mt-4">WhaleByte übernimmt jeden Schritt Ihrer Terminverwaltung — vollautomatisch, 24 Stunden am Tag.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16">
             { [
    { 
      n: '01', t: 'Automatische Terminerstellung', d: 'Ihre Kunden buchen selbst — online, rund um die Uhr, ohne Anruf.', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> 
    },
    { 
      n: '02', t: 'Automatische Umbuchung', d: 'WhaleByte schlägt automatisch freie Alternativen vor und bestätigt die Umbuchung.', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg> 
    },
    { 
      n: '03', t: 'Automatische Stornierung', d: 'Stornierungen werden automatisch verarbeitet und Slots sofort wieder freigegeben.', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="//9" y1="//9" x2="15" y2="15"></line></svg> 
    },
    { 
      n: '04', t: 'Automatische Erinnerungen', d: 'Erinnerungen per E-Mail, WhatsApp, SMS oder Telegram zum richtigen Zeitpunkt.', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg> 
    },
    { 
      n: '05', t: 'Automatische Bewertungen', d: 'Nach jedem Termin fragt WhaleByte automatisch nach einer Bewertung auf dem richtigen Kanal.', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> 
    },
    { 
      n: '06', t: 'Dashboard & Analytics', d: 'Alle Termine, Auslastung und No-Show-Raten auf einen Blick.', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> 
    },
  ].map((f, i) => (
    <div key={i} className="p-9 border border-[#E8E8E8] rounded-[4px] transition-all hover:-translate-y-1.5 hover:shadow-xl hover:border-black group relative overflow-hidden">
      <span className="text-[0.62rem] font-bold tracking-widest text-[#BBBBBB] block mb-4">{f.n}</span>
      <div className="w-11 h-11 bg-black rounded-[4px] mb-5 transition-transform group-hover:scale-110 group-hover:rotate-[-5deg] flex items-center justify-center">
        {f.icon}
      </div>
      <h3 className="text-[0.97rem] font-black mb-2">{f.t}</h3>
      <p className="text-[0.86rem] text-[#666666] leading-relaxed">{f.d}</p>
    </div>
  ))}
            </div>
          </div>
        </section>

        {/* LIVE DEMO */}
        <section id="demo" className="py-32 bg-white border-t border-[#E8E8E8]">
          <div className="container mx-auto px-8">
            <div className="text-center mb-16">
              <span className="inline-block text-[0.68rem] font-bold tracking-[0.22em] uppercase text-[#999999] mb-4">Live Buchungstest</span>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight mb-4">Erleben Sie WhaleByte<br/>in Echtzeit.</h2>
              <p className="text-[1.1rem] text-[#666666] max-w-[520px] mx-auto mt-4">Testen Sie eine echte Buchung, Umbuchung oder Stornierung.</p>
            </div>
            <div className="bg-[#F7F7F7] border border-[#E8E8E8] rounded-2xl p-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-black mb-1">Live Buchung testen</h3>
                <p className="text-sm text-[#666666] mb-6">Simulieren Sie eine echte Buchung.</p>
                
                <div className="flex gap-1 bg-white border border-[#E8E8E8] p-1 rounded-[4px] mb-6">
                  <button onClick={() => setDemoMode('book')} className={`flex-1 py-2 text-xs font-bold rounded-[2px] transition-all ${demoMode === 'book' ? 'bg-black text-white' : 'text-[#999999] hover:text-black'}`}>Termin buchen</button>
                  <button onClick={() => setDemoMode('reschedule')} className={`flex-1 py-2 text-xs font-bold rounded-[2px] transition-all ${demoMode !== 'book' ? 'bg-black text-white' : 'text-[#999999] hover:text-black'}`}>Ändern / Stornieren</button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-[0.72rem] font-bold text-[#999999] uppercase mb-1">Produkt</label>
                    <select value={product} onChange={(e) => setProduct(e.target.value)} className="w-full p-3 bg-white border border-[#E8E8E8] rounded-[4px] text-sm">
                      <option value="terminpilot">TerminPilot Standard</option>
                      <option value="plus">TerminPilot Plus (WhatsApp & Follow-Ups)</option>
                    </select>
                  </div>
                  {demoMode === 'book' ? (
                    <div className="grid grid-cols-1 gap-4">
                      <input type="text" placeholder="Name *" className="w-full p-3 bg-white border border-[#E8E8E8] rounded-[4px] text-sm" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="email" placeholder="E-Mail *" className="w-full p-3 bg-white border border-[#E8E8E8] rounded-[4px] text-sm" />
                        <input type="tel" placeholder="Telefon" className="w-full p-3 bg-white border border-[#E8E8E8] rounded-[4px] text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="date" className="w-full p-3 bg-white border border-[#E8E8E8] rounded-[4px] text-sm" />
                        <select className="w-full p-3 bg-white border border-[#E8E8E8] rounded-[4px] text-sm">
                          <option>Uhrzeit wählen</option>
                          <option>09:00 Uhr</option>
                          <option>10:00 Uhr</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <select className="w-full p-3 bg-white border border-[#E8E8E8] rounded-[4px] text-sm">
                        <option>Termin umbuchen</option>
                        <option>Termin stornieren</option>
                      </select>
                      <input type="email" placeholder="E-Mail *" className="w-full p-3 bg-white border border-[#E8E8E8] rounded-[4px] text-sm" />
                      <input type="text" placeholder="Sicherheitscode *" className="w-full p-3 bg-white border border-[#E8E8E8] rounded-[4px] text-sm" />
                    </div>
                  )}
                </div>

                <button 
                  onClick={runDemo} 
                  disabled={isAnimating}
                  className={`w-full py-4 font-bold rounded-[4px] transition-all ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
                >
                  {isAnimating ? 'Wird verarbeitet...' : demoMode === 'book' ? 'Termin verbindlich anfragen' : 'Änderung bestätigen'}
                </button>
                
                {token && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-[4px] text-center">
                    <p className="text-green-700 font-bold text-sm mb-2">✅ Termin erfolgreich!</p>
                    <div className="bg-black text-white font-mono py-1 px-4 inline-block rounded text-lg">{token}</div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-black mb-1">Automatisierungs-Status</h3>
                <p className="text-sm text-[#666666] mb-6">Live-Verarbeitung im Hintergrund.</p>
                <div className="space-y-3">
                  {[
                    { id: 1, t: 'Buchung verarbeitet', icon: '✉️' },
                    { id: 2, t: product === 'plus' ? 'WhatsApp Erinnerung' : 'E-Mail Erinnerung', icon: '🔔' },
                    { id: 3, t: product === 'plus' ? 'WhatsApp Bewertung' : 'Bewertungsanfrage', icon: '⭐' },
                    { id: 4, t: 'Smart Follow-Up (Plus)', icon: '📈', plusOnly: true },
                  ].map((step) => (
                    <div key={step.id} className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-500 ${demoStep >= step.id ? 'border-black bg-black/5' : 'border-[#E8E8E8] opacity-40'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${demoStep === step.id ? 'bg-black text-white' : (demoStep > step.id ? 'bg-green-600 text-white' : 'bg-[#F7F7F7] text-[#999999]')}`}>
                        {step.id}
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm font-bold">{step.t}</span>
                        <div className="w-24 h-6 relative overflow-hidden">
                          {demoStep === step.id && <div className="absolute inset-0 flex items-center justify-center animate-pulse">{step.icon}</div>}
                          {demoStep > step.id && <span className="text-green-600 text-sm font-bold">Erledigt ✓</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-32 bg-[#F7F7F7] border-t border-[#E8E8E8]">
          <div className="container mx-auto px-8 text-center">
            <span className="inline-block text-[0.68rem] font-bold tracking-[0.22em] uppercase text-[#999999] mb-4">Preise</span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight mb-4">Transparent. Fair.<br/>Ohne versteckte Kosten.</h2>
            <p className="text-[1.1rem] text-[#666666] max-w-[480px] mx-auto mt-4 mb-16">Monatlich kündbar, keine Einrichtungsgebühr. 14 Tage kostenlos testen.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[860px] mx-auto">
              <div className="p-10 border border-[#E8E8E8] bg-white rounded-[4px] text-left transition-all hover:shadow-xl">
                <h3 className="text-lg font-black mb-1">TerminPilot</h3>
                <p className="text-sm text-[#666666] mb-6">Der perfekte Einstieg für KMU</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-lg font-bold text-[#666666]">€</span>
                  <span className="text-6xl font-black tracking-tighter">36</span>
                </div>
                <span className="text-sm text-[#666666] block mb-1">pro Monat</span>
                <span className="text-[0.7rem] text-[#999999] block mb-6">zzgl. gesetzl. MwSt.</span>
                <div className="h-px bg-[#E8E8E8] mb-5"></div>
                <ul className="space-y-3 mb-8">
                  {['Automatische Terminerstellung', 'Umbuchung & Stornierung', 'E-Mail Erinnerungen', 'Bewertungsanfragen', 'Dashboard & Übersicht'].map(f => (
                    <li key={f} className="text-sm flex items-center gap-2"><span className="text-black">✓</span> {f}</li>
                  ))}
                  <li className="text-sm text-[#999999] flex items-center gap-2"><span>✗</span> WhatsApp-Integration</li>
                </ul>
                <a href="#demo" className="block w-full py-4 text-center font-bold border-2 border-black text-black rounded-[4px] hover:bg-black hover:text-white transition-all">Jetzt kostenlos starten →</a>
                <p className="text-center text-[0.7rem] text-[#999999] mt-3">14 Tage kostenlos · Keine Kreditkarte</p>
              </div>

              <div className="p-10 border-2 border-black bg-black text-white rounded-[4px] text-left relative transition-all hover:scale-[1.02] shadow-2xl">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-[0.62rem] font-black uppercase tracking-widest px-4 py-1 rounded-full border border-[#E8E8E8]">⭐ Empfohlen</div>
                <h3 className="text-lg font-black mb-1">TerminPilot Plus</h3>
                <p className="text-sm text-white/50 mb-6">Maximale Automatisierung</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-lg font-bold text-white/50">€</span>
                  <span className="text-6xl font-black tracking-tighter">65</span>
                </div>
                <span className="text-sm text-white/50 block mb-1">pro Monat</span>
                <span className="text-[0.7rem] text-white/30 block mb-6">zzgl. gesetzl. MwSt.</span>
                <div className="h-px bg-white/10 mb-5"></div>
                <ul className="space-y-3 mb-8">
                  {['Alles aus TerminPilot', 'WhatsApp-Integration', 'SMS-Integration', 'Telegram-Integration', 'Erweiterte Automatisierung', 'Prioritäts-Support', 'Detaillierte Analytics'].map(f => (
                    <li key={f} className="text-sm flex items-center gap-2"><span className="text-white">✓</span> {f}</li>
                  ))}
                </ul>
                <a href="#demo" className="block w-full py-4 text-center font-bold bg-white text-black rounded-[4px] hover:bg-gray-200 transition-all">Jetzt kostenlos starten →</a>
                <p className="text-center text-[0.7rem] text-white/30 mt-3">14 Tage kostenlos · Keine Kreditkarte</p>
              </div>
            </div>
          </div>
        </section>

        {/* TARGET GROUPS */}
        <section id="targets" className="py-32 bg-white border-t border-[#E8E8E8]">
          <div className="container mx-auto px-8 text-center">
            <span className="inline-block text-[0.68rem] font-bold tracking-[0.22em] uppercase text-[#999999] mb-4">Zielgruppen</span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight mb-4">WhaleByte funktioniert für<br/>jede Dienstleistungsbranche.</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-16">
              {['💇 Friseure', '🧘 Therapeuten', '💅 Salons', '🔧 Handwerker', '🎯 Coaches', '🏥 Ärzte', '⚖️ Rechtsanwälte', '💪 Fitness'].map((t, i) => (
                <div key={i} className="p-8 border border-[#E8E8E8] rounded-[4px] hover:border-black transition-all group cursor-default relative overflow-hidden">
                  <div className="absolute inset-0 bg-black scale-y-0 origin-bottom transition-transform duration-500 group-hover:scale-y-100"></div>
                  <span className="relative z-10 font-bold transition-colors group-hover:text-white">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section id="stats" className="py-32 bg-[#F7F7F7] border-t border-[#E8E8E8]">
          <div className="container mx-auto px-8 text-center">
            <span className="inline-block text-[0.68rem] font-bold tracking-[0.22em] uppercase text-[#999999] mb-4">Warum WhaleByte</span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight mb-16">Zahlen, die für sich<br/>selbst sprechen.</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[#E8E8E8] border border-[#E8E8E8]">
              {[
                { n: '70%', t: 'Weniger No-Shows', d: 'Automatische Erinnerungen reduzieren Terminausfälle drastisch.' },
                { n: '8 Std.', t: 'Gespart pro Woche', d: 'Zeitersparnis durch Wegfall manueller Verwaltung.' },
                { n: '500+', t: 'Zufriedene Kunden', d: 'Von der Einzelpraxis bis zum kleinen Team.' },
                { n: '15 Min.', t: 'Bis zur Einrichtung', d: 'Kein IT-Wissen nötig, sofort einsatzbereit.' },
              ].map((s, i) => (
                <div key={i} className="bg-white p-12 transition-colors hover:bg-[#F7F7F7] group relative">
                  <span className="text-5xl font-black block mb-2">{s.n}</span>
                  <h3 className="text-lg font-black mb-2">{s.t}</h3>
                  <p className="text-sm text-[#666666] leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="py-32 bg-white border-t border-[#E8E8E8]">
          <div className="container mx-auto px-8 text-center">
            <span className="inline-block text-[0.68rem] font-bold tracking-[0.22em] uppercase text-[#999999] mb-4">Kundenstimmen</span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight mb-16">Was unsere Kunden über<br/>WhaleByte sagen.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { name: 'Sandra K.', role: 'Friseurmeisterin, Berlin', text: 'Seit ich WhaleByte nutze, habe ich endlich wieder Zeit für meine Kunden. Die No-Show-Rate ist massiv gesunken.' },
                { name: 'Markus H.', role: 'Physiotherapeut, München', text: 'Als Physio war die Verwaltung mein größter Stressfaktor. Jetzt spare ich locker 10 Stunden pro Woche.' },
                { name: 'Laura M.', role: 'Beauty Studio, Hamburg', text: 'Die WhatsApp-Integration ist ein Game-Changer. Meine Bewertungen sind in drei Monaten explodiert!' },
              ].map((t, i) => (
                <div key={i} className="p-8 border border-[#E8E8E8] rounded-[4px] text-left transition-all hover:border-black hover:shadow-xl relative">
                  <span className="absolute top-4 right-4 text-4xl font-black text-black/5 font-serif">“</span>
                  <div className="text-black mb-4">★★★★★</div>
                  <p className="text-sm text-[#666666] italic leading-relaxed mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black text-xs">{t.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <div className="text-sm font-black">{t.name}</div>
                      <div className="text-[0.72rem] text-[#999999]">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-32 bg-[#F7F7F7] border-t border-[#E8E8E8]">
          <div className="container mx-auto px-8 text-center">
            <span className="inline-block text-[0.68rem] font-bold tracking-[0.22em] uppercase text-[#999999] mb-4">FAQ</span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight mb-16">Häufig gestellte<br/>Fragen.</h2>
            <div className="max-w-[720px] mx-auto text-left space-y-4">
              {[
                { q: 'Wie lange dauert die Einrichtung?', a: 'Die Einrichtung dauert in der Regel 15 bis 30 Minuten. Sie benötigen keinerlei technisches Vorwissen.' },
                { q: 'Gibt es eine kostenlose Testphase?', a: 'Ja, Sie können WhaleByte 14 Tage lang vollständig kostenlos und ohne Kreditkarte testen.' },
                { q: 'Ist WhaleByte DSGVO-konform?', a: 'Ja. Alle Daten werden ausschließlich auf deutschen Servern gespeichert und verarbeitet.' },
                { q: 'Welche Kalender werden unterstützt?', a: 'Google Calendar, Microsoft Outlook, Apple iCloud sowie alle CalDAV-kompatiblen Systeme.' },
              ].map((faq, i) => (
                <details key={i} className="group border-b border-[#E8E8E8] bg-white rounded-t-[4px]">
                  <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-sm list-none">
                    {faq.q}
                    <span className="transition-transform group-open:rotate-180">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </summary>
                  <div className="p-5 pt-0 text-sm text-[#666666] leading-relaxed">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 bg-black text-white text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[22vw] font-black text-white/[0.03] pointer-events-none whitespace-nowrap tracking-tighter">WHALEBYTE</div>
          <div className="container mx-auto px-8 relative z-10">
            <span className="inline-block text-[0.66rem] font-bold tracking-[0.24em] uppercase text-white/30 mb-4">Jetzt starten</span>
            <h2 className="text-[clamp(2.2rem,5.5vw,4.4rem)] font-black leading-tight mb-4">Bereit, Ihre Terminverwaltung<br/>zu automatisieren?</h2>
            <p className="text-lg text-white/40 max-w-[460px] mx-auto mb-11 leading-relaxed">Richten Sie WhaleByte in 15 Minuten ein und erleben Sie, wie sich Ihr Arbeitsalltag verändert.</p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <a href="#demo" className="px-8 py-4 text-lg font-bold bg-white text-black rounded-[4px] hover:bg-gray-200 transition-all">Kostenlos 14 Tage testen →</a>
              <a href="#demo" className="px-8 py-4 text-lg font-bold border border-white/40 text-white rounded-[4px] hover:bg-white hover:text-black transition-all">Live Demo ansehen</a>
            </div>
            <p className="text-[0.76rem] text-white/20">Keine Kreditkarte · Keine Mindestlaufzeit · DSGVO-konform</p>
          </div>
        </section>
      </main>

           {/* FOOTER */}
      <footer className="bg-black text-white py-20 border-t border-white/10">
        <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="invert" />
              <span className="text-lg font-light tracking-widest uppercase">
                Whale<strong className="font-black">Byte</strong>
              </span>
            </div>
            <p className="text-sm text-white/50 max-w-[240px] leading-relaxed">
              Vollautomatische Terminverwaltung für KMU — von der Buchung bis zur Bewertungsanfrage.
            </p>
          </div>

          <div>
            <div className="text-[0.65rem] font-black tracking-widest uppercase text-white mb-4">Produkt</div>
            <ul className="flex flex-col gap-2 text-sm text-white/50">
              <li><a href="#features" className="hover:text-white transition-colors">Funktionen</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Preise</a></li>
              <li><a href="#demo" className="hover:text-white transition-colors">Live Demo</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <div className="text-[0.65rem] font-black tracking-widest uppercase text-white mb-4">Unternehmen</div>
            <ul className="flex flex-col gap-2 text-sm text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">Über uns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Karriere</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kontakt</a></li>
            </ul>
          </div>

          <div>
            <div className="text-[0.65rem] font-black tracking-widest uppercase text-white mb-4">Rechtliches</div>
            <ul className="flex flex-col gap-2 text-sm text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">Datenschutz</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Impressum</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AGB</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/30">© {new Date().getFullYear()} WhaleByte. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6 text-sm text-white/30">
            <a href="#" className="hover:text-white transition-colors">Datenschutz</a>
            <a href="#" className="hover:text-white transition-colors">Impressum</a>
            <a href="#" className="hover:text-white transition-colors">AGB</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

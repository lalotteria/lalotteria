'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ nome: string } | null>(null);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [showSignup, setShowSignup] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [playedToday, setPlayedToday] = useState(new Set<string>());
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelResult, setWheelResult] = useState<any>(null);
  const [spinning, setSpinning] = useState(false);

  const companies = [
    { id: 'mario', name: 'Pizzeria Da Mario', tag: 'Ristorazione', color: 'bg-green', initial: 'M' },
    { id: 'centrale', name: 'Bar Centrale', tag: 'Bar & Caffetteria', color: 'bg-gold', initial: 'C' },
    { id: 'fitzone', name: 'Palestra FitZone', tag: 'Sport & Benessere', color: 'bg-blue', initial: 'F' },
    { id: 'visione', name: 'Ottica Visione', tag: 'Ottica', color: 'bg-orange', initial: 'V' },
    { id: 'latavola', name: 'Ristorante La Tavola', tag: 'Ristorazione', color: 'bg-green', initial: 'T' },
    { id: 'bellezza', name: 'Estetica Bellezza', tag: 'Beauty & Cura', color: 'bg-gold', initial: 'B' },
  ];

  const prizes = [
    { label: 'Sconto 10%', weight: 3, note: 'Codice sconto valido 7 giorni.', bonus: false },
    { label: 'Riprova domani', weight: 5, note: 'Torna domani per un nuovo giro.', bonus: false },
    { label: 'Un altro giro', weight: 2, note: 'Hai diritto a un giro extra, subito.', bonus: true },
    { label: 'Sconto 5%', weight: 4, note: 'Codice sconto valido 7 giorni.', bonus: false },
    { label: 'Omaggio a sorpresa', weight: 2, note: 'Un piccolo omaggio ti aspetta.', bonus: false },
    { label: 'Niente stavolta', weight: 5, note: 'Un nuovo giro domani.', bonus: false },
    { label: 'Sconto 15%', weight: 1, note: 'Il premio più raro! Codice sconto valido 7 giorni.', bonus: false },
    { label: 'Un altro giro', weight: 2, note: 'Hai diritto a un giro extra, subito.', bonus: true },
  ];

  const wheelColors = ['#67b369', '#ffc01c', '#1771bd', '#fb621f', '#67b369', '#ffc01c', '#1771bd', '#fb621f'];

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const nome = authMode === 'register' ? (formData.get('nome') as string) : 'Utente';
    setCurrentUser({ nome: nome.trim() || 'Utente' });
    setIsRegistered(true);
    setShowSignup(false);
  };

  const handleCompanyClick = (companyId: string) => {
    if (playedToday.has(companyId)) return;
    if (!isRegistered) {
      setActiveCompanyId(companyId);
      setShowSignup(true);
      return;
    }
    setActiveCompanyId(companyId);
    setWheelResult(null);
    setWheelRotation(0);
    setShowWheel(true);
  };

  const weightedRandomIndex = () => {
    const total = prizes.reduce((s, p) => s + p.weight, 0);
    let r = Math.random() * total;
    for (let i = 0; i < prizes.length; i++) {
      r -= prizes[i].weight;
      if (r <= 0) return i;
    }
    return prizes.length - 1;
  };

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setWheelResult(null);

    const idx = weightedRandomIndex();
    const segAngle = 360 / prizes.length;
    const segCenter = idx * segAngle + segAngle / 2;
    const jitter = (Math.random() - 0.5) * (segAngle * 0.6);
    const baseTarget = (360 - (segCenter + jitter) + 360) % 360;
    const extraSpins = 6;
    const currentMod = ((wheelRotation % 360) + 360) % 360;
    let delta = baseTarget - currentMod;
    if (delta < 0) delta += 360;
    const newRotation = wheelRotation + extraSpins * 360 + delta;
    setWheelRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setWheelResult(prizes[idx]);
    }, 4300);
  };

  const closeWheel = () => {
    if (activeCompanyId && !wheelResult?.bonus) {
      setPlayedToday(new Set([...playedToday, activeCompanyId]));
    }
    setShowWheel(false);
    setActiveCompanyId(null);
  };

  return (
    <div className="min-h-screen bg-navy">
      <header className="sticky top-0 z-30 bg-navy/92 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-7 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-baloo font-bold text-xl"><span className="text-orange">La</span>Lotteria</span>
          </div>
          <nav className="hidden md:flex gap-7">
            <a href="#come-funziona" className="text-muted font-semibold text-sm">Come funziona</a>
            <a href="#aziende" className="text-muted font-semibold text-sm">Aziende</a>
          </nav>
          <div className="flex items-center gap-3">
            {!isRegistered ? (
              <>
                <button onClick={() => setShowSignup(true)} className="px-6 py-3 rounded-full text-white font-bold text-sm border border-white/35">Accedi</button>
                <button onClick={() => setShowSignup(true)} className="px-6 py-3 rounded-full bg-orange text-white font-bold text-sm">Iscriviti</button>
              </>
            ) : (
              <div className="flex items-center gap-2 bg-navy-light px-4 py-2 rounded-full">
                <div className="w-6 h-6 rounded-full bg-gold text-navy-dark flex items-center justify-center text-xs font-bold">{currentUser?.nome.charAt(0)}</div>
                <span className="font-bold text-sm">Ciao, {currentUser?.nome}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-7 grid md:grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <h1 className="text-5xl font-bold font-baloo leading-tight">Un giro al giorno,<br />un <span className="text-gold">premio</span> in tasca.</h1>
            <p className="mt-5 text-base text-muted">Scegli l'azienda, gira la ruota, scopri il premio. Un giro gratuito al giorno per ogni azienda.</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button onClick={() => setShowSignup(true)} className="px-7 py-3.5 rounded-full bg-orange text-white font-bold">Iscriviti gratis</button>
              <a href="#aziende" className="px-7 py-3.5 rounded-full text-white font-bold border border-white/35 inline-flex items-center justify-center">Scegli un'azienda</a>
            </div>
          </div>

          <div className="flex items-center justify-center relative">
            <div className="w-72 h-72 rounded-full border-8 border-gold shadow-2xl animate-idle-spin flex items-center justify-center" style={{ background: 'conic-gradient(#67b369 0deg 90deg, #ffc01c 90deg 180deg, #1771bd 180deg 270deg, #fb621f 270deg 360deg)' }}>
              <div className="w-16 h-16 rounded-full bg-navy-dark border-4 border-white" />
            </div>
          </div>
        </div>
      </section>

      <section id="come-funziona" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-7">
          <h2 className="text-3xl md:text-4xl font-bold font-baloo">Come funziona</h2>
          <p className="mt-2 text-base text-muted">Tre passaggi.</p>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[{ num: '1', title: 'Iscriviti', desc: 'Nome, email e password.' }, { num: '2', title: 'Scegli azienda', desc: 'Seleziona chi vuoi giocare.' }, { num: '3', title: 'Gira', desc: 'Scopri il premio.' }].map((s) => (
              <div key={s.num} className="bg-navy-light rounded-2xl p-7">
                <div className="w-10 h-10 rounded-full bg-navy-dark text-gold flex items-center justify-center font-bold">{s.num}</div>
                <h3 className="mt-4 text-lg font-bold font-baloo">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="aziende" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-7">
          <h2 className="text-3xl md:text-4xl font-bold font-baloo">Scegli l'azienda</h2>
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {companies.map((c) => (
              <button key={c.id} onClick={() => handleCompanyClick(c.id)} disabled={playedToday.has(c.id)} className={`relative bg-navy-light rounded-2xl p-6 text-left transition ${playedToday.has(c.id) ? 'opacity-55' : 'hover:-translate-y-1'}`}>
                <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center text-navy-dark font-bold font-baloo`}>{c.initial}</div>
                <div className="mt-3"><div className="font-bold font-baloo">{c.name}</div><div className="text-xs text-muted mt-1">{c.tag}</div></div>
                <div className="border-t border-dashed border-white/20 my-3" />
                <div className="text-sm font-bold text-gold">{playedToday.has(c.id) ? 'Giocato' : 'Gioca'}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {showSignup && (
        <div className="fixed inset-0 bg-navy-dark/70 backdrop-blur-sm flex items-center justify-center p-5 z-40">
          <div className="bg-navy-light rounded-3xl w-full max-w-sm p-8">
            <button onClick={() => setShowSignup(false)} className="absolute top-4 right-4 text-2xl">×</button>
            <h2 className="text-2xl font-bold font-baloo">Iscriviti</h2>
            <form onSubmit={handleSignup} className="mt-6">
              {authMode === 'register' && (<div className="mb-4"><input type="text" name="nome" placeholder="Nome" required className="w-full px-3.5 py-3 rounded-xl border border-white/20 bg-navy-dark text-white outline-none focus:border-gold" /></div>)}
              <div className="mb-4"><input type="email" name="email" placeholder="Email" required className="w-full px-3.5 py-3 rounded-xl border border-white/20 bg-navy-dark text-white outline-none focus:border-gold" /></div>
              <div className="mb-4"><input type="password" name="password" placeholder="Password" minLength={8} required className="w-full px-3.5 py-3 rounded-xl border border-white/20 bg-navy-dark text-white outline-none focus:border-gold" /></div>
              <button type="submit" className="w-full px-6 py-3 rounded-full bg-orange text-white font-bold">Iscriviti</button>
            </form>
          </div>
        </div>
      )}

      {showWheel && (
        <div className="fixed inset-0 bg-navy-dark/70 backdrop-blur-sm flex items-center justify-center p-5 z-40">
          <div className="bg-navy-light rounded-3xl w-full max-w-sm p-8 text-center">
            <button onClick={closeWheel} className="absolute top-4 right-4 text-2xl">×</button>
            <h2 className="text-2xl font-bold font-baloo mb-6">{companies.find(c => c.id === activeCompanyId)?.name}</h2>
            <div className="w-64 h-64 mx-auto mb-6 rounded-full border-8 border-gold flex items-center justify-center" style={{ background: `conic-gradient(${wheelColors.map((col, i) => `${col} ${i * 45}deg ${(i + 1) * 45}deg`).join(', ')})`, transform: `rotate(${wheelRotation}deg)`, transition: spinning ? 'transform 4.2s cubic-bezier(0.13, 0.75, 0.15, 1)' : 'none' }}>
              <div className="w-12 h-12 rounded-full bg-navy-dark border-4 border-white font-bold text-gold text-xs">GIRA</div>
            </div>
            <button onClick={spinWheel} disabled={spinning || wheelResult} className="px-10 py-3.5 rounded-full bg-gold text-navy-dark font-bold mb-6">{wheelResult ? 'Vinto!' : 'Gira'}</button>
            {wheelResult && (<div className="bg-navy-dark rounded-2xl p-5"><p className="text-sm text-muted">Hai vinto</p><p className="text-2xl font-bold text-gold font-baloo mt-2">{wheelResult.label}</p><p className="text-xs text-muted mt-2">{wheelResult.note}</p><button onClick={closeWheel} className="mt-4 w-full px-6 py-2 rounded-full text-white font-bold border border-white/35">OK</button></div>)}
          </div>
        </div>
      )}
    </div>
  );
}
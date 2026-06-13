'use client';

import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Warte, bis Clerk geladen ist
    if (isLoaded && !userId) {
      // Wenn nicht eingeloggt → zur Login-Seite
      router.push('/sign-in');
    }
  }, [isLoaded, userId, router]);

  // Während Clerk lädt, zeige nichts
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Wenn nicht eingeloggt, zeige nichts (wird ja redirected)
  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-8 text-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-black tracking-tight">
            Willkommen bei WhaleByte <span className="text-gray-400">Dashboard</span> 🐳
          </h1>
          <UserButton />
        </div>
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white border border-[#E8E8E8] rounded-[4px] shadow-sm hover:border-black transition-colors group">
            <div className="w-10 h-10 bg-black text-white rounded-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              📅
            </div>
            <h3 className="text-lg font-black mb-2">Meine Termine</h3>
            <p className="text-[#666666] text-sm leading-relaxed">
              Hier siehst du alle deine anstehenden Buchungen und kannst sie verwalten.
            </p>
          </div>

          <div className="p-8 bg-white border border-[#E8E8E8] rounded-[4px] shadow-sm hover:border-black transition-colors group">
            <div className="w-10 h-10 bg-black text-white rounded-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              ⚙️
            </div>
            <h3 className="text-lg font-black mb-2">Verfügbarkeiten</h3>
            <p className="text-[#666666] text-sm leading-relaxed">
              Lege fest, wann du für deine Kunden Zeit hast und erstelle deine Slots.
            </p>
          </div>

          <div className="p-8 bg-white border border-[#E8E8E8] rounded-[4px] shadow-sm hover:border-black transition-colors group">
            <div className="w-10 h-10 bg-black text-white rounded-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              👤
            </div>
            <h3 className="text-lg font-black mb-2">Profil-Einstellungen</h3>
            <p className="text-[#666666] text-sm leading-relaxed">
              Verwalte deine persönlichen Daten und deine Integrationen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
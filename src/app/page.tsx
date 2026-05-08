"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-neutral-50 font-sans text-neutral-900 selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-extrabold tracking-tighter">NEXAR.</div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-neutral-600">
            <a
              href="#how-it-works"
              className="hover:text-black transition-colors"
            >
              Wie es funktioniert
            </a>
            <a href="#services" className="hover:text-black transition-colors">
              Unsere Services
            </a>
            <a href="#fleet" className="hover:text-black transition-colors">
              Handwerker-Netzwerk
            </a>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 rounded-full transition-all"
            >
              Anmelden
            </Link>
            <Link
              href="/dashboard/customer"
              className="px-5 py-2.5 text-sm font-semibold bg-black text-white rounded-full hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl"
            >
              Handwerker rufen
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center mt-12 space-y-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Aktiv in Trier & Umgebung
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight max-w-4xl leading-tight">
            Deutschlands erste{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-800">
              autonome
            </span>{" "}
            Handwerker-Flotte.
          </h1>
          <p className="text-xl md:text-2xl text-neutral-500 font-light max-w-2xl">
            Analysieren Sie Fehler in Sekunden mit KI und lassen Sie den besten
            Experten in Ihrer Nähe sofort vor Ihre Tür navigieren.
          </p>

          {/* Video Placeholder */}
          <div className="w-full max-w-5xl mt-12 aspect-video bg-neutral-900 rounded-[2rem] overflow-hidden shadow-2xl relative group">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-6 left-8 text-white text-left">
              <p className="text-sm font-medium opacity-70">NEXAR System</p>
              <p className="text-2xl font-bold">
                Wie funktioniert autonomes Routing?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight">
              Keine menschlichen Fehler. Nur KI.
            </h2>
            <p className="mt-4 text-neutral-500">
              Unser System trifft Entscheidungen in Sekunden mittels
              Schwarmintelligenz-Algorithmen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "1. KI-Fehleranalyse",
                desc: "Laden Sie ein Foto hoch. Unser System nutzt eine Datenbank aus über 30 Jahren technischer Erfahrung, um das Problem und die Kosten sofort zu ermitteln.",
              },
              {
                title: "2. Autonomes Matching",
                desc: "Das System sendet ein direktes Navigationssignal an den nächstgelegenen und am besten bewerteten Handwerker auf der Live-Karte.",
              },
              {
                title: "3. Sichere Abwicklung",
                desc: "Der Handwerker beendet die Arbeit und gibt die digitale Freigabe. Die Zahlung wird sicher über unser Treuhand-System abgewickelt.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-neutral-50 border border-neutral-100 hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl font-black text-neutral-200 mb-6">
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-neutral-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans selection:bg-white selection:text-black">
      {/* Arka Plan Efekti */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800 via-black to-black -z-10"></div>

      <main className="text-center space-y-8 p-8 max-w-4xl relative z-10 animate-in fade-in zoom-in duration-1000">
        <div className="inline-block px-4 py-1.5 bg-neutral-800/50 border border-neutral-700 rounded-full text-xs font-bold uppercase tracking-widest text-neutral-300 mb-4 backdrop-blur-md">
          Trier Pilot Program Live
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter">
          NEXAR<span className="text-green-500">.</span>
        </h1>
        <p className="text-xl md:text-2xl text-neutral-400 font-light max-w-2xl mx-auto">
          Das erste autonome Ökosystem für technische Dienstleistungen in
          Deutschland.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-8">
          <Link
            href="/dashboard/customer"
            className="group relative p-1 rounded-3xl bg-gradient-to-b from-neutral-800 to-black hover:from-white hover:to-neutral-300 transition-all duration-500"
          >
            <div className="h-full w-full bg-neutral-900 group-hover:bg-black rounded-[22px] p-8 transition-colors flex flex-col items-center justify-center">
              <span className="text-4xl mb-4">📱</span>
              <h2 className="text-xl font-bold text-white mb-2">Kunde</h2>
              <p className="text-sm text-neutral-500">KI-Diagnose starten</p>
            </div>
          </Link>

          <Link
            href="/dashboard/technician"
            className="group relative p-1 rounded-3xl bg-gradient-to-b from-neutral-800 to-black hover:from-blue-500 hover:to-blue-800 transition-all duration-500"
          >
            <div className="h-full w-full bg-neutral-900 group-hover:bg-black rounded-[22px] p-8 transition-colors flex flex-col items-center justify-center">
              <span className="text-4xl mb-4">🔧</span>
              <h2 className="text-xl font-bold text-white mb-2">Techniker</h2>
              <p className="text-sm text-neutral-500">Live-Radar öffnen</p>
            </div>
          </Link>

          <Link
            href="/dashboard/admin"
            className="group relative p-1 rounded-3xl bg-gradient-to-b from-neutral-800 to-black hover:from-green-500 hover:to-green-800 transition-all duration-500"
          >
            <div className="h-full w-full bg-neutral-900 group-hover:bg-black rounded-[22px] p-8 transition-colors flex flex-col items-center justify-center">
              <span className="text-4xl mb-4">🌐</span>
              <h2 className="text-xl font-bold text-white mb-2">HQ Admin</h2>
              <p className="text-sm text-neutral-500">Kommandozentrale</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}

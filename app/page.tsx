import VINSearch from "@/components/VINSearch";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-zinc-950 text-white flex flex-col"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -10%, rgba(245,158,11,0.08) 0%, transparent 60%),
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 40px 40px, 40px 40px",
      }}
    >
      <header className="w-full border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-sm">VeriChain</span>
              <span className="ml-2 text-[10px] uppercase tracking-[0.15em] text-amber-400/70 font-semibold">Vehicle Verification</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-zinc-500 tracking-wide">Network Active</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start px-6 pt-16 pb-12">
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-10">
          <div className="text-center flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 mx-auto bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-1">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-semibold text-amber-400 tracking-wide">Tamper-Evident Records</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight" style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}>
              Vehicle History
              <br />
              <span className="text-amber-400">You Can Trust</span>
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Query immutable, cryptographically verified vehicle records before you buy.
            </p>
          </div>

          <VINSearch />

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Immutable Records", icon: "🔒" },
              { label: "Hash Verified", icon: "🔗" },
              { label: "AI Risk Analysis", icon: "🧠" },
            ].map((item) => (
              <div key={item.label} className="bg-zinc-900/60 border border-white/5 rounded-lg px-4 py-3 flex flex-col items-center gap-2 text-center">
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs text-zinc-500 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
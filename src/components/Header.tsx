import { Download, ShieldCheck, Zap, Sparkles, Heart } from "lucide-react";

interface HeaderProps {
  onDonateClick: () => void;
}

export default function Header({ onDonateClick }: HeaderProps) {
  return (
    <header id="main-header" className="w-full border-b border-white/5 bg-[#030303]/80 py-4 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo - Bento style */}
        <div className="flex items-center gap-2.5">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-lg bg-red-600 opacity-70 blur-md group-hover:opacity-100 transition duration-1000" />
            <div className="relative p-2.5 rounded-lg bg-[#0A0A0A] border border-white/5 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.35)]">
              <Download className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white font-sans uppercase">
              Veloce<span className="text-red-500">Load</span>
            </span>
            <span className="block text-[9px] font-mono font-medium tracking-widest text-zinc-500 uppercase select-none leading-none mt-0.5">
              High Decibel Stream Pipeline
            </span>
          </div>
        </div>

        {/* Feature/Nav Links - Bento Grid Match */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#downloader-card" className="hover:text-white transition-colors text-white border-b border-red-500 pb-1 font-semibold">Downloader</a>
          <a href="#brand-showcase-section" className="hover:text-white transition-colors">How it works</a>
          <button 
            type="button"
            onClick={onDonateClick}
            className="hover:text-white text-zinc-400 transition-colors flex items-center gap-1.5"
          >
            Donate
          </button>
          <div className="h-3 w-px bg-white/5" />
          <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
            <Zap className="h-3 w-3 text-red-500" />
            <span>Instant-Start Active</span>
          </div>
        </nav>

        {/* Action Button/Live Info - Bento theme */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onDonateClick}
            className="group px-4 py-2 rounded-full bg-red-950/25 hover:bg-red-950/50 text-xs font-bold border border-red-500/20 hover:border-red-500/45 text-red-500 hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            <Heart className="h-3.5 w-3.5 fill-red-500/20 group-hover:fill-red-500 transition-all group-hover:scale-110" />
            <span>Support Veloce</span>
          </button>
        </div>
      </div>
    </header>
  );
}

import { Github, Linkedin, Youtube, Facebook, Heart } from "lucide-react";

interface FooterProps {
  onDonateClick: () => void;
}

export default function Footer({ onDonateClick }: FooterProps) {
  return (
    <footer id="main-footer" className="w-full border-t border-white/5 bg-[#030303] py-10 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left: Avatar overlapping circles + creator name */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#030303] bg-zinc-900 flex items-center justify-center hover:scale-105 transition-transform">
              <Facebook className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-[#030303] bg-zinc-900 flex items-center justify-center hover:scale-105 transition-transform animate-pulse">
              <Youtube className="w-3.5 h-3.5 text-red-500 hover:text-white" />
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-[#030303] bg-zinc-900 flex items-center justify-center hover:scale-105 transition-transform">
              <Linkedin className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
            </div>
          </div>
          <button 
            type="button"
            onClick={onDonateClick}
            className="text-xs text-zinc-500 font-sans hover:text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
          >
            Developed by <span className="text-white font-semibold">@Sajid</span> with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 animate-pulse inline" /> (Non-Ads • Tap to Support)
          </button>
        </div>

        {/* Center / Right: Media tags with status pulses */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex flex-wrap justify-center gap-3 text-[11px] font-mono text-zinc-600">
            <span>YouTube • Shorts • MP3</span>
            <span className="text-zinc-800">|</span>
            <span>TikTok • No Watermark</span>
            <span className="text-zinc-800">|</span>
            <span>LinkedIn • Premium HD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-none">Status: pipeline active</span>
            <div className="w-2.5 h-2.5 rounded-full bg-red-650 animate-pulse border border-red-500/20" />
          </div>
        </div>

      </div>
    </footer>
  );
}

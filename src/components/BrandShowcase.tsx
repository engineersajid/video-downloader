import { Youtube, Facebook, Instagram, ShieldCheck, Zap, DownloadCloud, Sparkles } from "lucide-react";

export default function BrandShowcase() {
  const features = [
    {
      icon: <Zap className="h-5 w-5 text-red-500" />,
      title: "Instant-Start Protocol",
      description: "Asynchronous links pre-fetching checks validity the moment you paste. Zero intermediate processing waits."
    },
    {
      icon: <DownloadCloud className="h-5 w-5 text-red-500" />,
      title: "Stream Chunking Bypass",
      description: "Direct server-to-browser pipe keeps speeds blazing fast on YouTube Shorts, TikTok, and Instagram."
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-red-500" />,
      title: "Fully Decrypted Streams",
      description: "No watermarks, high-fidelity audio up to 320kbps and 4K video streams compiled securely."
    },
    {
      icon: <Sparkles className="h-5 w-5 text-red-500" />,
      title: "Fluid Design Transitions",
      description: "Elegant layout adapting accent highlights perfectly matching pasted system domains."
    }
  ];

  return (
    <div id="brand-showcase-section" className="space-y-12">
      {/* Visual Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/10 text-xs font-mono font-bold text-red-500 uppercase tracking-widest">
          <Sparkles className="h-3 w-3" />
          <span>High-Decibel Performance Pipeline</span>
        </div>
        <h2 className="font-sans font-extrabold text-3xl md:text-4xl tracking-tight text-white leading-tight">
          One Downloader.<br />
          All Your Favorite Platforms.
        </h2>
        <p className="text-sm md:text-base text-zinc-400 font-sans leading-relaxed">
          Unlock maximum resolutions up to 4K Ultra HD and pristine audio extraction with zero subscription hurdles. Copy, paste, and let Veloce handle the rest.
        </p>
      </div>

      {/* Feature Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="flex gap-4 p-6 rounded-3xl border border-white/5 bg-[#0A0A0A]/40 hover:border-white/10 transition-all duration-300 relative overflow-hidden group"
          >
            {/* Top tiny line accent to feel like a bento box */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-red-650 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-zinc-900 border border-white/5 group-hover:bg-red-950/20 group-hover:border-red-500/30 transition-all duration-350">
              {feat.icon}
            </div>
            <div className="space-y-1">
              <h4 className="font-sans font-bold text-[15px] text-zinc-100 group-hover:text-red-500 transition-colors">{feat.title}</h4>
              <p className="font-sans text-xs text-zinc-450 leading-relaxed">{feat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

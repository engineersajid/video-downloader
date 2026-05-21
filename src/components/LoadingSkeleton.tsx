import { Loader2, Sparkles, RefreshCw } from "lucide-react";

export default function LoadingSkeleton() {
  return (
    <div id="loading-skeleton-card" className="relative rounded-3xl border border-white/5 bg-[#0A0A0A]/40 p-6 backdrop-blur-xl shadow-xl overflow-hidden animate-pulse">
      
      {/* Dynamic scan glowing absolute line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/80 to-transparent animate-shimmer" />

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Aspect ratio video placeholder */}
        <div className="relative aspect-video w-full rounded-2xl bg-[#030303] lg:w-[320px] shrink-0 flex items-center justify-center border border-white/5">
          <Loader2 className="h-6 w-6 animate-spin text-red-500/45" />
        </div>

        {/* Info detail placeholders */}
        <div className="flex w-full flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Author */}
            <div className="h-3 w-28 rounded bg-red-500/20" />
            
            {/* Title */}
            <div className="space-y-2">
              <div className="h-5 w-4/5 rounded bg-zinc-900" />
              <div className="h-5 w-1/2 rounded bg-zinc-900" />
            </div>

            {/* Description fallback */}
            <div className="pt-2 space-y-2">
              <div className="h-3 w-full rounded bg-zinc-900/60" />
              <div className="h-3 w-5/6 rounded bg-zinc-900/60" />
            </div>
          </div>

          {/* Skeletons options */}
          <div className="space-y-2.5">
            <div className="h-3 w-36 rounded bg-zinc-900" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="h-12 rounded-xl bg-zinc-900/65 border border-white/5" />
              <div className="h-12 rounded-xl bg-zinc-900/65 border border-white/5" />
            </div>
          </div>

          {/* Loader status notification */}
          <div className="flex items-center gap-2 justify-center py-2 text-xs md:text-sm text-zinc-400 font-mono">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-red-500" />
            <span>Resolving direct media CDN streams...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

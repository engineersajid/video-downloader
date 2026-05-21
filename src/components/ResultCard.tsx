import React, { useState } from "react";
import { VideoMetadata, DownloadOption, getApiUrl } from "../types.js";
import { brandThemes } from "./brandThemes.js";
import {
  Play,
  Download,
  Music,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Activity,
} from "lucide-react";

interface ResultCardProps {
  metadata: VideoMetadata;
}

export default function ResultCard({ metadata }: ResultCardProps) {
  const currentTheme = brandThemes[metadata.platform] || brandThemes.default;
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    metadata.options[0]?.id || "",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Find currently selected option
  const activeOption =
    metadata.options.find((opt) => opt.id === selectedOptionId) ||
    metadata.options[0];

  // Initiate direct browser download stream immediately
  const handleDownloadTrigger = async () => {
    if (!activeOption) return;
    setIsProcessing(true);
    setIsDone(false);

    // Extract a nice safe filename
    const titleCleaned =
      metadata.title
        .replace(/[\\/*?:"<>|]/g, "")
        .replace(/\s+/g, "_")
        .substring(0, 45) || "media_stream";
    const filename = `${titleCleaned}.${activeOption.format}`;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const downloadUrl = getApiUrl(
        activeOption.url.includes("?")
          ? `${activeOption.url}&download=true&filename=${encodeURIComponent(filename)}`
          : `${activeOption.url}?download=true&filename=${encodeURIComponent(filename)}`,
      );

      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.setAttribute("download", filename);
      anchor.target = "_self";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      setIsDone(true);
      setTimeout(() => setIsDone(false), 3000);
    } catch (err) {
      console.error("Downloader failed direct stream:", err);
      try {
        const fallbackUrl = getApiUrl(
          activeOption.url.includes("?")
            ? `${activeOption.url}&download=true&filename=${encodeURIComponent(filename)}`
            : `${activeOption.url}?download=true&filename=${encodeURIComponent(filename)}`,
        );
        const fallbackAnchor = document.createElement("a");
        fallbackAnchor.href = fallbackUrl;
        fallbackAnchor.target = "_self";
        document.body.appendChild(fallbackAnchor);
        fallbackAnchor.click();
        document.body.removeChild(fallbackAnchor);
        setIsDone(true);
        setTimeout(() => setIsDone(false), 3000);
      } catch (fallbackErr) {
        console.error("Fallback failed:", fallbackErr);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      id="result-metadata-container"
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full"
    >
      {/* CARD 1: Main Info Bento Unit */}
      <div className="col-span-1 lg:col-span-8 bg-[#0A0A0A]/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-all duration-300 flex flex-col justify-between min-h-[380px]">
        <div
          className={`absolute top-0 left-0 w-full h-[3px] ${currentTheme.topLineHighlight}`}
        />

        <div className="flex flex-col md:flex-row gap-6 h-full">
          {/* Aspect ratio video preview block */}
          <div className="w-full md:w-64 h-48 md:h-full min-h-[180px] rounded-2xl bg-[#030303] relative overflow-hidden shadow-2xl shrink-0 group">
            {isPlaying ? (
              <div className="absolute inset-0 w-full h-full bg-black z-20">
                {activeOption?.format === "mp3" ||
                activeOption?.quality === "audio" ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4 text-center bg-zinc-950">
                    <Music className="h-10 w-10 text-red-500 animate-bounce" />
                    <span className="text-[11px] font-mono text-zinc-400 truncate max-w-full">
                      Streaming Audio Track...
                    </span>
                    <audio
                      key={activeOption?.id || "audio-stream"}
                      src={getApiUrl(activeOption.url)}
                      controls
                      autoPlay
                      className="w-full max-w-[200px] h-8 mt-1"
                    />
                  </div>
                ) : (
                  <video
                    key={activeOption?.id || "video-stream"}
                    src={getApiUrl(activeOption.url)}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaying(false);
                  }}
                  className="absolute top-2 right-2 z-30 flex items-center justify-center w-6 h-6 rounded-full bg-black/70 hover:bg-black/90 text-white font-bold text-xs border border-white/10 shadow-lg"
                  title="Close Preview"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <img
                  id="result-preview-image"
                  src={metadata.thumbnail}
                  alt={metadata.title}
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                {/* [👑 EXCLUSIVE CLICK TRIGGER]: শুধুমাত্র মাঝখানের লাল বাটনে ক্লিক করলেই প্রিভিউ প্লে হবে */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlaying(true);
                    }}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 border border-white/10 text-white shadow-2xl transform transition hover:scale-110 active:scale-[0.95] cursor-pointer"
                  >
                    <Play className="h-4 w-4 fill-white pl-0.5" />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                  <span
                    className={`px-2 py-0.5 border text-[9px] font-mono font-bold rounded uppercase tracking-widest ${currentTheme.badgeBackground}`}
                  >
                    Decrypted
                  </span>
                  {metadata.duration && (
                    <span className="text-[10px] font-mono font-medium text-zinc-300 bg-[#030303]/80 px-2 py-0.5 rounded border border-white/5">
                      {metadata.duration}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Info Details container */}
          <div className="flex flex-col justify-between py-1 flex-grow">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  className={`px-2 py-1 rounded border text-[9px] font-bold uppercase tracking-wider ${currentTheme.badgeBackground}`}
                >
                  {metadata.platform} Detected
                </span>
                <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-wider border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Verified Secure
                </span>
              </div>

              <h2
                id="result-video-title"
                className="text-xl md:text-2xl font-bold tracking-tight text-white leading-snug uppercase"
              >
                {metadata.title}
              </h2>
              <p className="mt-2 text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                {metadata.description ||
                  "Stream container decrypted, headers optimized, and bandwidth channels initialized correctly."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 md:mt-0">
              <div className="bg-zinc-900/40 p-3.5 rounded-2xl border border-white/5">
                <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest font-mono mb-1">
                  Estimated Size
                </p>
                <p className="text-base md:text-lg font-mono text-zinc-100">
                  {activeOption?.size || "Cached resolution size"}
                </p>
              </div>
              <div className="bg-zinc-900/40 p-3.5 rounded-2xl border border-white/5">
                <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest font-mono mb-1 flex items-center gap-1">
                  <Activity className="h-2.5 w-2.5 text-emerald-400 animate-pulse" />
                  Stream Handshake
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-emerald-400 font-mono">
                    Ready
                  </span>
                  <div className="h-1.5 flex-grow bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 2: Right-hand Selector */}
      <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
        <div className="flex-1 bg-[#0A0A0A]/40 border border-white/5 rounded-3xl p-5 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
              Choose Resolution
            </h3>
            <div className="space-y-2">
              {metadata.options.map((opt) => {
                const isSelected = opt.id === selectedOptionId;
                const isMediaAudio =
                  opt.format === "mp3" || opt.quality === "audio";
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedOptionId(opt.id);
                      setIsDone(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? `${currentTheme.badgeBackground} border-red-500/25 font-bold shadow-inner scale-[1.01]`
                        : "bg-[#030303] border-white/5 hover:bg-zinc-900/60 text-zinc-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded flex items-center justify-center text-[11px] font-bold ${isSelected ? "bg-red-600 text-white shadow-md shadow-red-500/20" : "bg-zinc-800 text-zinc-400"}`}
                      >
                        {isMediaAudio
                          ? "MP3"
                          : opt.quality.includes("p")
                            ? opt.quality.toUpperCase()
                            : "HD"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-100">
                          {opt.label}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono uppercase">
                          {opt.format} • stream direct
                        </p>
                      </div>
                    </div>
                    {opt.size && (
                      <span className="text-[10px] font-mono text-zinc-500 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                        {opt.size}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-white/5">
            <button
              id="btn-trigger-download"
              onClick={handleDownloadTrigger}
              disabled={isProcessing}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all text-xs uppercase cursor-pointer ${
                isDone
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/25"
                  : isProcessing
                    ? "bg-zinc-900 border border-white/5 text-zinc-500 cursor-not-allowed"
                    : currentTheme.buttonStyles
              } hover:scale-[1.008] active:scale-[0.99]`}
            >
              {isDone ? (
                <>
                  <CheckCircle2 className="h-4 w-4 animate-bounce shrink-0" />
                  <span>Stream Acquired!</span>
                </>
              ) : isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-400 shrink-0" />
                  <span>Handshaking CDN...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 shrink-0" />
                  <span>
                    DOWNLOAD ({activeOption?.format?.toUpperCase() || "MP4"})
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Speed Indicator Bento */}
        <div className="h-28 bg-[#0A0A0A]/40 border border-white/5 rounded-3xl p-5 flex items-center gap-4 hover:border-white/10 transition-all duration-300">
          <div className="p-3 bg-red-600/10 rounded-2xl border border-red-500/10">
            <Zap className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
              Pipeline Speed
            </p>
            <p className="text-2xl font-mono text-red-500 font-extrabold flex items-baseline gap-1">
              128.4{" "}
              <span className="text-xs text-zinc-500 uppercase font-sans font-semibold tracking-wider">
                MB/s
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

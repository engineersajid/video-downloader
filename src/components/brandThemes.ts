import { PlatformType } from "../types.js";

export interface BrandTheme {
  name: string;
  accentColor: string;
  gradientFromTo: string;
  glowShadow: string;
  buttonStyles: string;
  badgeBackground: string;
  accentText: string;
  platformColor: string;
  topLineHighlight: string;
}

export const brandThemes: Record<PlatformType, BrandTheme> = {
  youtube: {
    name: "YouTube",
    accentColor: "text-red-500",
    gradientFromTo: "from-red-600/50 via-zinc-800 to-zinc-800",
    glowShadow: "shadow-[0_0_50px_rgba(220,38,38,0.15)] border-red-500/20",
    buttonStyles: "bg-red-650 hover:bg-red-700 text-white focus:ring-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)]",
    badgeBackground: "bg-red-500/10 border-red-500/20 text-red-400",
    accentText: "text-red-500",
    platformColor: "#FF0000",
    topLineHighlight: "bg-red-600",
  },
  facebook: {
    name: "Facebook",
    accentColor: "text-blue-500",
    gradientFromTo: "from-blue-600/50 via-zinc-800 to-zinc-800",
    glowShadow: "shadow-[0_0_50px_rgba(24,119,242,0.15)] border-blue-500/20",
    buttonStyles: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-[0_0_20px_rgba(24,119,242,0.3)]",
    badgeBackground: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    accentText: "text-blue-500",
    platformColor: "#1877F2",
    topLineHighlight: "bg-blue-600",
  },
  instagram: {
    name: "Instagram",
    accentColor: "text-pink-500",
    gradientFromTo: "from-pink-500/50 via-zinc-800 to-zinc-800",
    glowShadow: "shadow-[0_0_50px_rgba(225,48,108,0.15)] border-pink-500/20",
    buttonStyles: "bg-gradient-to-r from-pink-500 via-purple-600 to-orange-500 hover:opacity-90 text-white focus:ring-pink-500 shadow-[0_0_20px_rgba(225,48,108,0.3)]",
    badgeBackground: "bg-pink-500/10 border-pink-500/20 text-pink-400",
    accentText: "text-pink-500",
    platformColor: "#E1306C",
    topLineHighlight: "bg-pink-500",
  },
  tiktok: {
    name: "TikTok",
    accentColor: "text-cyan-400",
    gradientFromTo: "from-cyan-500/50 via-zinc-800 to-zinc-800",
    glowShadow: "shadow-[5px_5px_15px_rgba(0,242,254,0.1),-5px_-5px_15px_rgba(254,9,121,0.1)] border-cyan-500/20",
    buttonStyles: "bg-gradient-to-r from-cyan-500 via-zinc-900 to-fuchsia-600 hover:opacity-95 text-white focus:ring-cyan-500 border border-zinc-800 shadow-[0_0_20px_rgba(6,182,212,0.3)]",
    badgeBackground: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    accentText: "text-cyan-400",
    platformColor: "#000000",
    topLineHighlight: "bg-cyan-500",
  },
  linkedin: {
    name: "LinkedIn",
    accentColor: "text-sky-500",
    gradientFromTo: "from-sky-500/50 via-zinc-800 to-zinc-800",
    glowShadow: "shadow-[0_0_50px_rgba(10,102,194,0.15)] border-sky-500/20",
    buttonStyles: "bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500 shadow-[0_0_20px_rgba(10,102,194,0.3)]",
    badgeBackground: "bg-sky-500/10 border-sky-500/20 text-sky-450",
    accentText: "text-sky-500",
    platformColor: "#0A66C2",
    topLineHighlight: "bg-sky-500",
  },
  default: {
    name: "Veloce MultiLoad",
    accentColor: "text-red-500",
    gradientFromTo: "from-red-600/50 via-zinc-800 to-zinc-800",
    glowShadow: "shadow-[0_0_50px_rgba(220,38,38,0.15)] border-red-500/20",
    buttonStyles: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)]",
    badgeBackground: "bg-zinc-800 border-zinc-700/50 text-zinc-100",
    accentText: "text-zinc-300",
    platformColor: "#FF0000",
    topLineHighlight: "bg-red-600",
  }
};

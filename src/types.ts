export type PlatformType = 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'linkedin' | 'default';

export interface DownloadOption {
  id: string;
  label: string; // e.g., "1080p (Full HD)", "720p (HD)", "360p", "Audio (MP3)"
  quality: string; // e.g., "1080p", "720p", "360p", "audio"
  format: 'mp4' | 'mp3' | 'm4a';
  size?: string; // e.g., "45.2 MB"
  url: string; // Direct stream or proxied URL
}

export interface VideoMetadata {
  url: string;
  title: string;
  description?: string;
  thumbnail: string;
  duration?: string; // e.g., "3:45"
  author?: string;
  platform: PlatformType;
  options: DownloadOption[];
}

/**
 * Resolves relative API paths to absolute URLs if VITE_API_URL is configured
 * (critical for hosting the frontend on Vercel while using a separate Express backend).
 */
export function getApiUrl(path: string): string {
  // Try importing from import.meta.env safely using a type assertion to prevent TS build errors
  const meta = import.meta as any;
  const apiBase = (meta && meta.env && meta.env.VITE_API_URL) || "";
  if (apiBase && path.startsWith("/")) {
    const cleanBase = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
    return `${cleanBase}${path}`;
  }
  return path;
}

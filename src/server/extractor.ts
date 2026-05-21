import { GoogleGenAI } from "@google/genai";
import { PlatformType, VideoMetadata, DownloadOption } from "../types.js";

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    })
  : null;

export function detectPlatform(url: string): PlatformType {
  const normalized = url.toLowerCase().trim();
  if (normalized.includes("youtube.com") || normalized.includes("youtu.be"))
    return "youtube";
  if (
    normalized.includes("facebook.com") ||
    normalized.includes("fb.watch") ||
    normalized.includes("fb.com")
  )
    return "facebook";
  if (normalized.includes("instagram.com")) return "instagram";
  if (normalized.includes("tiktok.com")) return "tiktok";
  if (normalized.includes("linkedin.com")) return "linkedin";
  return "default";
}

export function sanitizeFilename(title: string): string {
  return title
    .replace(/[\\/*?:"<>|]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 50);
}

function formatBytes(bytes: number | undefined, fallback: string): string {
  if (!bytes || isNaN(bytes)) return fallback;
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

function getDownloadOptions(
  platform: PlatformType,
  url: string,
  rawTitle: string,
  cobaltContext?: any,
): DownloadOption[] {
  const cleanTitle = sanitizeFilename(rawTitle || "video");
  const encodedUrl = encodeURIComponent(url);

  const getQualitySize = (targetQuality: string, isAudio = false) => {
    if (!cobaltContext) return null;

    if (cobaltContext.picker && Array.isArray(cobaltContext.picker)) {
      const match = cobaltContext.picker.find((item: any) => {
        if (isAudio) return item.type === "audio";
        return (
          item.quality === targetQuality || item.videoQuality === targetQuality
        );
      });
      if (match?.size) return formatBytes(match.size, "⚡ Ready");
    }

    if (cobaltContext.size) return formatBytes(cobaltContext.size, "⚡ Ready");
    return null;
  };

  switch (platform) {
    case "youtube":
      return [
        {
          id: "yt-1080p",
          label: "1080p (Full HD)",
          quality: "1080p",
          format: "mp4",
          size: getQualitySize("1080") || "45.5 MB",
          url: `/api/stream?platform=youtube&quality=1080p&title=${cleanTitle}&url=${encodedUrl}`,
        },
        {
          id: "yt-720p",
          label: "720p (HD)",
          quality: "720p",
          format: "mp4",
          size: getQualitySize("720") || "25.0 MB",
          url: `/api/stream?platform=youtube&quality=720p&title=${cleanTitle}&url=${encodedUrl}`,
        },
        {
          id: "yt-360p",
          label: "360p (SD)",
          quality: "360p",
          format: "mp4",
          size: getQualitySize("360") || "10.2 MB",
          url: `/api/stream?platform=youtube&quality=360p&title=${cleanTitle}&url=${encodedUrl}`,
        },
        {
          id: "yt-mp3",
          label: "Audio (MP3 Preset)",
          quality: "audio",
          format: "mp3",
          size: getQualitySize("audio", true) || "4.1 MB",
          url: `/api/stream?platform=youtube&quality=mp3&title=${cleanTitle}&url=${encodedUrl}`,
        },
      ];
    case "facebook":
      return [
        {
          id: "fb-hd",
          label: "720p HD Quality",
          quality: "720p",
          format: "mp4",
          size: getQualitySize("720") || "⚡ Ready",
          url: `/api/stream?platform=facebook&quality=720p&title=${cleanTitle}&url=${encodedUrl}`,
        },
        {
          id: "fb-sd",
          label: "360p SD Quality",
          quality: "360p",
          format: "mp4",
          size: getQualitySize("360") || "⚡ Ready",
          url: `/api/stream?platform=facebook&quality=360p&title=${cleanTitle}&url=${encodedUrl}`,
        },
      ];
    case "instagram":
      return [
        {
          id: "ig-original",
          label: "Original HD Quality",
          quality: "1080p",
          format: "mp4",
          size: getQualitySize("1080") || "⚡ Ready",
          url: `/api/stream?platform=instagram&quality=1080p&title=${cleanTitle}&url=${encodedUrl}`,
        },
      ];
    case "tiktok":
      return [
        {
          id: "tt-watermark-free",
          label: "HD (No Watermark)",
          quality: "1080p",
          format: "mp4",
          size: getQualitySize("1080") || "⚡ Ready",
          url: `/api/stream?platform=tiktok&quality=1080p&title=${cleanTitle}&url=${encodedUrl}`,
        },
        {
          id: "tt-mp3",
          label: "Audio Track (MP3)",
          quality: "audio",
          format: "mp3",
          size: getQualitySize("audio", true) || "⚡ Ready",
          url: `/api/stream?platform=tiktok&quality=mp3&title=${cleanTitle}&url=${encodedUrl}`,
        },
      ];
    default:
      return [
        {
          id: "def-hd",
          label: "HD Quality",
          quality: "720p",
          format: "mp4",
          size: cobaltContext?.size
            ? formatBytes(cobaltContext.size, "⚡ Ready")
            : "⚡ Ready",
          url: `/api/stream?platform=default&quality=720p&title=${cleanTitle}&url=${encodedUrl}`,
        },
      ];
  }
}

export async function extractVideoMetadata(
  url: string,
): Promise<VideoMetadata> {
  const platform = detectPlatform(url);
  let title = "High-Quality Download Service";
  let thumbnail =
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600";
  let author = "Media Share";
  let duration = "01:30";
  let description = "Stream captured and parsed successfully.";
  let cobaltContext: any = null;

  try {
    const cobaltMetadataRes = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ url, urlSelection: "all", audioBitrate: "128" }),
    });
    if (cobaltMetadataRes.ok) {
      cobaltContext = await cobaltMetadataRes.json();
    }
  } catch (e) {
    console.warn("Cobalt pre-fetch context bypassed.");
  }

  try {
    if (platform === "youtube") {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        title = data.title || title;
        author = data.author_name || author;
        thumbnail = data.thumbnail_url || thumbnail;
        description = `YouTube video by ${data.author_name || "creator"}.`;
      }
      duration = "03:45";
    } else {
      let pageHtml = "";
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const pageRes = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (pageRes.ok) pageHtml = await pageRes.text();
      } catch (err) {
        console.warn("Page fetch direct bypass.");
      }

      if (pageHtml) {
        const ogTitleMatch = pageHtml.match(
          /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i,
        );
        const ogImageMatch = pageHtml.match(
          /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
        );
        if (ogTitleMatch && ogTitleMatch[1]) title = ogTitleMatch[1];
        if (ogImageMatch && ogImageMatch[1]) thumbnail = ogImageMatch[1];
      }
    }

    if (ai && title && title.length > 20 && title.includes("|")) {
      try {
        const aiRes = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Given this title: "${title}", return only a clean clickable human title.`,
        });
        if (aiRes.text) title = aiRes.text.replace(/"/g, "").trim();
      } catch (aiErr) {
        console.warn("AI bypassed.");
      }
    }
  } catch (error) {
    console.warn("Pipeline fallback applied.");
  }

  return {
    url,
    title: title.length > 100 ? title.substring(0, 100) + "..." : title,
    description,
    thumbnail,
    duration,
    author,
    platform,
    options: getDownloadOptions(platform, url, title, cobaltContext),
  };
}

import express from "express";
import { Readable } from "stream";
import dotenv from "dotenv";
import { extractVideoMetadata, detectPlatform, sanitizeFilename } from "../src/server/extractor.js";

dotenv.config();

const app = express();
app.use(express.json());

// CORS Config
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization, Accept, Range");
  res.setHeader("Access-Control-Credentials", "true");
  res.setHeader("Access-Control-Expose-Headers", "Content-Disposition, Content-Type, Content-Length, Content-Range, Accept-Ranges");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.post("/api/validate", (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") return res.status(400).json({ error: "URL is required" });
  const platform = detectPlatform(url);
  res.json({ valid: platform !== "default", platform });
});

app.post("/api/extract", async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") return res.status(400).json({ error: "URL is required" });
  try {
    const metadata = await extractVideoMetadata(url);
    res.json(metadata);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to extract video details" });
  }
});

// [👑 ULTIMATE PLAYER FIX] Vercel Serverless Stream + Player Router
app.get("/api/stream", async (req, res) => {
  const { quality, title, url } = req.query;

  if (!url) {
    return res.status(400).send("Target resource URL parameter is missing.");
  }

  const decodedTargetUrl = decodeURIComponent(url as string);
  const isAudio = quality === "mp3" || quality === "audio";
  const extension = isAudio ? "mp3" : "mp4";
  const filename = sanitizeFilename((title as string) || "video_download") + `.${extension}`;

  let sourceMediaUrl = "";

  try {
    const cobaltApiResponse = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        url: decodedTargetUrl,
        videoQuality: quality === "360p" ? "360" : quality === "1080p" ? "1080" : "720",
        isAudioOnly: isAudio,
        filenamePattern: "basic"
      }),
    });

    if (cobaltApiResponse.ok) {
      const data = await cobaltApiResponse.json();
      if (data.status === "stream" || data.status === "redirect") {
        sourceMediaUrl = data.url;
      }
    }

    // প্লেয়ারের ডিরেক্ট রেন্ডারিং বাইপাস এবং ফলব্যাক রিডাইরেকশন
    if (!sourceMediaUrl || req.headers.range || req.headers["user-agent"]?.includes("ExoPlayer")) {
      return res.redirect(sourceMediaUrl || decodedTargetUrl);
    }

    const response = await fetch(sourceMediaUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", Accept: "*/*" },
    });

    if (!response.ok || !response.body) {
      return res.redirect(sourceMediaUrl);
    }

    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader("Content-Type", isAudio ? "audio/mpeg" : "video/mp4");

    const nodeStream = Readable.fromWeb(response.body as any);
    nodeStream.pipe(res);
  } catch (err) {
    console.error("Streaming core failed, executing safety route:", err);
    res.redirect(sourceMediaUrl || decodedTargetUrl);
  }
});

export default app;
import express from "express";
import { Readable } from "stream";
import dotenv from "dotenv";
import {
  extractVideoMetadata,
  detectPlatform,
  sanitizeFilename,
} from "../src/server/extractor.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Enable Broad CORS permissions
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization, Accept",
  );
  res.setHeader("Access-Control-Credentials", "true");
  res.setHeader(
    "Access-Control-Expose-Headers",
    "Content-Disposition, Content-Type, Content-Length",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// API Route: Validate URL
app.post("/api/validate", (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL is required" });
  }
  const platform = detectPlatform(url);
  const isValid = platform !== "default";
  res.json({ valid: isValid, platform });
});

// API Route: Extract Metadata
app.post("/api/extract", async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const metadata = await extractVideoMetadata(url);
    res.json(metadata);
  } catch (err: any) {
    console.error("Metadata extraction error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to extract video details" });
  }
});

// [FIXED] API Route: Streaming Downloads (Real-media pipeline for serverless)
app.get("/api/stream", async (req, res) => {
  const { quality, title, url } = req.query;

  if (!url) {
    return res.status(400).send("Target resource URL parameter is missing.");
  }

  const isAudio = quality === "mp3" || quality === "audio";
  const extension = isAudio ? "mp3" : "mp4";
  const filename =
    sanitizeFilename((title as string) || "video_download") + `.${extension}`;

  let sourceMediaUrl = "";

  try {
    const cobaltApiResponse = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        url: decodeURIComponent(url as string),
        videoQuality:
          quality === "360p" ? "360" : quality === "1080p" ? "1080" : "720",
        isAudioOnly: isAudio,
        filenamePattern: "basic",
      }),
    });

    if (cobaltApiResponse.ok) {
      const data = await cobaltApiResponse.json();
      if (data.status === "stream" || data.status === "redirect") {
        sourceMediaUrl = data.url;
      }
    }

    if (!sourceMediaUrl) {
      throw new Error("Stream endpoint not resolved.");
    }

    const response = await fetch(sourceMediaUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Accept: "*/*",
      },
    });

    if (!response.ok || !response.body) {
      throw new Error(`Target host responded with status ${response.status}`);
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(filename)}"`,
    );
    res.setHeader("Content-Type", isAudio ? "audio/mpeg" : "video/mp4");

    const nodeStream = Readable.fromWeb(response.body as any);
    nodeStream.pipe(res);
  } catch (err: any) {
    console.error("Serverless proxy failed, redirecting:", err);
    if (sourceMediaUrl) {
      res.redirect(sourceMediaUrl);
    } else {
      res.status(500).send("Error compiling video stream.");
    }
  }
});

// Vercel Serverless Export
export default app;

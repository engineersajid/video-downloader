import express from "express";
import { Readable } from "stream";
import dotenv from "dotenv";
// extractor এর ইম্পোর্ট পাথ ঠিক করা হয়েছে
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
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization, Accept",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
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

// API Route: Streaming Downloads
app.get("/api/stream", async (req, res) => {
  const { platform, quality, title } = req.query;

  const isAudio = quality === "mp3" || quality === "audio";
  const extension = isAudio ? "mp3" : "mp4";
  const filename =
    sanitizeFilename((title as string) || "video_download") + `.${extension}`;

  let sourceMediaUrl = "";

  if (isAudio) {
    const audioOptions = [
      "https://ccrma.stanford.edu/~jos/mp3/pno-cs.mp3",
      "https://ccrma.stanford.edu/~jos/mp3/guitar.mp3",
      "https://ccrma.stanford.edu/~jos/mp3/bell.mp3",
    ];
    const index = platform === "youtube" ? 0 : platform === "tiktok" ? 1 : 2;
    sourceMediaUrl = audioOptions[index];
  } else {
    if (platform === "youtube") {
      sourceMediaUrl =
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
    } else if (platform === "tiktok") {
      sourceMediaUrl =
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";
    } else if (platform === "instagram") {
      sourceMediaUrl =
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4";
    } else if (platform === "facebook") {
      sourceMediaUrl =
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";
    } else if (platform === "linkedin") {
      sourceMediaUrl =
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4";
    } else {
      sourceMediaUrl =
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    }
  }

  try {
    const response = await fetch(sourceMediaUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "*/*",
      },
    });
    if (!response.ok || !response.body) {
      throw new Error("Failed to pull raw loop stream pointer");
    }

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", isAudio ? "audio/mpeg" : "video/mp4");

    const nodeStream = Readable.fromWeb(response.body as any);
    nodeStream.pipe(res);
  } catch (err: any) {
    console.error(
      "Streaming file failed, directing to redirect fallback:",
      err,
    );
    res.redirect(sourceMediaUrl);
  }
});

// Vercel Serverless Function এর মেইন এক্সপোর্ট
export default app;

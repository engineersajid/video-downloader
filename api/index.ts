import express from "express";
import { Readable } from "stream";
import dotenv from "dotenv";
import {
  extractVideoMetadata,
  detectPlatform,
  sanitizeFilename,
} from "../src/server/extractor.js";

dotenv.config();

const app = express();
app.use(express.json());

// CORS Config
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization, Accept, Range",
  );
  res.setHeader("Access-Control-Credentials", "true");
  res.setHeader(
    "Access-Control-Expose-Headers",
    "Content-Disposition, Content-Type, Content-Length, Content-Range, Accept-Ranges",
  );

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.post("/api/validate", (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string")
    return res.status(400).json({ error: "URL is required" });
  const platform = detectPlatform(url);
  res.json({ valid: platform !== "default", platform });
});

app.post("/api/extract", async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string")
    return res.status(400).json({ error: "URL is required" });
  try {
    const metadata = await extractVideoMetadata(url);
    res.json(metadata);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: err.message || "Failed to extract video details" });
  }
});

// [👑 ULTIMATE PLAYER FIX] Vercel Serverless Stream + Player Router
app.get("/api/stream", async (req, res) => {
  // [👑 FIXED]: ResultCard থেকে পাঠানো 'filename' প্যারামিটার এখানে রিসিভ করার ব্যবস্থা করা হয়েছে
  const { quality, title, filename, url } = req.query;

  if (!url) {
    return res.status(400).send("Target resource URL parameter is missing.");
  }

  const decodedTargetUrl = decodeURIComponent(url as string);
  const isAudio =
    quality === "mp3" || quality === "audio" || quality === "audioOnly";
  const extension = isAudio ? "mp3" : "mp4";

  // রেজাল্ট কার্ডের পাঠানো জেনুইন ফাইলনেম থাকলে সেটা优先, না থাকলে টাইটেল থেকে জেনারেট করবে
  const finalFilename = filename
    ? (filename as string)
    : sanitizeFilename((title as string) || "video_download") + `.${extension}`;

  let sourceMediaUrl = "";

  try {
    const cobaltApiResponse = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        url: decodedTargetUrl,
        videoQuality:
          quality === "360p" || quality === "360"
            ? "360"
            : quality === "1080p" || quality === "1080"
              ? "1080"
              : "720",
        isAudioOnly: isAudio,
        filenamePattern: "basic",
      }),
    });

    if (cobaltApiResponse.ok) {
      const data = await cobaltApiResponse.json();
      // [👑 FIXED]: Cobalt-এর ডাইনামিক অবজেক্ট স্ট্রাকচার (url অথবা picker) দুইটাই হ্যান্ডেল করার সেফগার্ড
      if (data.url) {
        sourceMediaUrl = data.url;
      } else if (
        data.picker &&
        Array.isArray(data.picker) &&
        data.picker.length > 0
      ) {
        sourceMediaUrl = data.picker[0].url;
      } else if (data.status === "stream" || data.status === "redirect") {
        sourceMediaUrl = data.url;
      }
    }

    // প্লেয়ারের ডিরেক্ট রেন্ডারিং বাইপাস এবং ফলব্যাক রিডাইরেকশন
    if (
      !sourceMediaUrl ||
      req.headers.range ||
      req.headers["user-agent"]?.includes("ExoPlayer")
    ) {
      return res.redirect(sourceMediaUrl || decodedTargetUrl);
    }

    const response = await fetch(sourceMediaUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Accept: "*/*",
      },
    });

    if (!response.ok || !response.body) {
      return res.redirect(sourceMediaUrl);
    }

    // রেসপন্স হেডার সেটআপ (ব্রাউজারে সরাসরি ডাউনলোড ট্রিগার করবে)
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(finalFilename)}"`,
    );
    res.setHeader("Content-Type", isAudio ? "audio/mpeg" : "video/mp4");

    // [👑 FIXED]: Content-Length ট্রান্সফার করা হয়েছে যাতে ফ্রন্টএন্ডে রিয়েল-টাইম সাইজ বার কাজ করে
    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    const nodeStream = Readable.fromWeb(response.body as any);
    nodeStream.pipe(res);
  } catch (err) {
    console.error("Streaming core failed, executing safety route:", err);
    res.redirect(sourceMediaUrl || decodedTargetUrl);
  }
});

export default app;

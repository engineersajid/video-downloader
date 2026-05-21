import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { Readable } from "stream";
import {
  extractVideoMetadata,
  detectPlatform,
  sanitizeFilename,
} from "./server/extractor.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

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
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Expose-Headers",
      "Content-Disposition, Content-Type, Content-Length, Content-Range, Accept-Ranges",
    );

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
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

  // [ULTIMATE FIX] প্লেয়ারে প্লে এবং ডাউনলোড দুটোই একসাথে রিয়াল-টাইমে করার ইঞ্জিন
  app.get("/api/stream", async (req, res) => {
    const { quality, title, url } = req.query;

    if (!url) {
      return res.status(400).send("Target dynamic URL parameter is missing.");
    }

    const isAudio = quality === "mp3" || quality === "audio";
    const extension = isAudio ? "mp3" : "mp4";
    const filename =
      sanitizeFilename((title as string) || "media_stream") + `.${extension}`;

    let sourceMediaUrl = "";

    try {
      // Cobalt API থেকে রিয়াল ডাইনামিক সোর্স ইউআরএল জেনারেট করা
      const cobaltApiResponse = await fetch(
        "https://api.cobalt.tools/api/json",
        {
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
        },
      );

      if (cobaltApiResponse.ok) {
        const data = await cobaltApiResponse.json();
        if (data.status === "stream" || data.status === "redirect") {
          sourceMediaUrl = data.url;
        }
      }

      // যদি কোনো কারণে টানেল কাজ না করে, ওরিজিনাল লিংকে রিডাইরেক্ট করবে (প্লেয়ার যেন ব্ল্যাঙ্ক না থাকে)
      if (!sourceMediaUrl) {
        return res.redirect(decodeURIComponent(url as string));
      }

      // [CRITICAL FOR PLAYER] ব্রাউজার প্লেয়ার যদি পারশিয়াল/রেঞ্জ ডেটা রিকোয়েস্ট করে (ভিডিও প্লে করার জন্য)
      if (req.headers.range) {
        return res.redirect(sourceMediaUrl);
      }

      // নরমাল ডাউনলোডের জন্য স্ট্রিম পাইপলাইন (বাটনে ক্লিক করলে যা কাজ করে)
      const response = await fetch(sourceMediaUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          Accept: "*/*",
        },
      });

      if (!response.ok || !response.body) {
        return res.redirect(sourceMediaUrl);
      }

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(filename)}"`,
      );
      res.setHeader("Content-Type", isAudio ? "audio/mpeg" : "video/mp4");

      const nodeStream = Readable.fromWeb(response.body as any);
      nodeStream.pipe(res);
    } catch (err) {
      console.error(
        "Core streaming engine bypass, redirecting to raw source:",
        err,
      );
      if (sourceMediaUrl) res.redirect(sourceMediaUrl);
      else res.redirect(decodeURIComponent(url as string));
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () =>
    console.log(`[CORE RUNNING] http://localhost:${PORT}`),
  );
}

startServer();

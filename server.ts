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

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // CORS Permissions Setup
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

  // [FIXED] API Route: রিয়াল-টাইম ডাইনামিক সোর্স প্রক্সি ইঞ্জিন (ডামি ফাইল রিমুভড)
  app.get("/api/stream", async (req, res) => {
    const { quality, title, url } = req.query;

    // ইউজারের পাঠানো মেইন লিংকটি যদি না থাকে
    if (!url) {
      return res.status(400).send("Target video/audio URL is required.");
    }

    const isAudio = quality === "mp3" || quality === "audio";
    const extension = isAudio ? "mp3" : "mp4";
    const filename =
      sanitizeFilename((title as string) || "download") + `.${extension}`;

    let sourceMediaUrl = "";

    try {
      // Cobalt API টানেল দিয়ে আসল মিডিয়া বাইনারি লিংক ফেচ করা
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

      if (!sourceMediaUrl) {
        throw new Error("Unable to parse live stream link from the endpoint.");
      }

      const response = await fetch(sourceMediaUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "*/*",
        },
      });

      if (!response.ok || !response.body) {
        throw new Error(
          `Target cloud host responded with status ${response.status}`,
        );
      }

      // ডাউনলোড ফোর্স করার জন্য হেডারস
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(filename)}"`,
      );
      res.setHeader("Content-Type", isAudio ? "audio/mpeg" : "video/mp4");

      // নোড জেনারেটর পাইপ দিয়ে সরাসরি ডাউনলোড শুরু করা
      const nodeStream = Readable.fromWeb(response.body as any);
      nodeStream.pipe(res);
    } catch (err: any) {
      console.error(
        "Local core proxy engine failed, falling back to direct link:",
        err,
      );
      if (sourceMediaUrl) {
        res.redirect(sourceMediaUrl);
      } else {
        res.status(500).send("Streaming handshake failed.");
      }
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

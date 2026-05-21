import { useState } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import DownloaderForm from "./components/DownloaderForm.jsx";
import ResultCard from "./components/ResultCard.jsx";
import BrandShowcase from "./components/BrandShowcase.jsx";
import LoadingSkeleton from "./components/LoadingSkeleton.jsx";
import DonateModal from "./components/DonateModal.jsx";
import { VideoMetadata } from "./types.js";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

export default function App() {
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  return (
    <div
      id="app-root"
      className="min-h-screen flex flex-col justify-between bg-[#030303] text-zinc-100 font-sans antialiased selection:bg-red-500/30 overflow-x-hidden"
    >
      {/* Decorative top ambient orb - Bento spec */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[100px] rounded-full" />

      <Header onDonateClick={() => setIsDonateOpen(true)} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16 relative z-10">
        {/* Hero Section */}
        <section
          id="hero"
          className="text-center max-w-3xl mx-auto space-y-6 pt-4"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/5 bg-[#0A0A0A] text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-red-500" />
            <span>Multi-Media Downloader Version 2.0</span>
          </div>

          <h1 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none text-white uppercase">
            Pristine Quality Video Downloads,{" "}
            <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              Simplified.
            </span>
          </h1>

          <p className="font-sans text-sm md:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
            Acquire high-fidelity mp4 videos and mp3 audio tracks from major
            social directories instantly. Decrypted. Clean. Watermark-free.
          </p>
        </section>

        {/* Central Core: Form & Results */}
        {/* [👑 FIXED]: max-w-3xl থেকে পরিবর্তন করে max-w-5xl করা হয়েছে যাতে রেজাল্ট কার্ডের ৮:৪ বেন্টো গ্রিড ডিজাইনটি ভাঙা ছাড়া ফুল স্পেসে খোলে */}
        <section
          id="core-application"
          className="max-w-5xl mx-auto w-full space-y-8"
        >
          {/* ডাউনলোডার ফর্মের আদিম লুক ও উইডথ ঠিক রাখার জন্য এখানে max-w-3xl র‍্যাপ করে দেওয়া হলো */}
          <div className="max-w-3xl mx-auto w-full">
            <DownloaderForm
              onMetadataExtracted={setMetadata}
              onLoadingStateChange={setIsExtracting}
            />
          </div>

          <AnimatePresence mode="wait">
            {isExtracting && (
              <motion.div
                key="loading-skeleton"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-5xl mx-auto w-full"
              >
                <LoadingSkeleton />
              </motion.div>
            )}

            {!isExtracting && metadata && (
              <motion.div
                key="result-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <ResultCard metadata={metadata} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Informative Brand Benefits Section */}
        <section id="features-and-brand" className="pt-8">
          <div className="border-t border-white/5 pt-16">
            <BrandShowcase />
          </div>
        </section>
      </main>

      <Footer onDonateClick={() => setIsDonateOpen(true)} />

      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
      />
    </div>
  );
}

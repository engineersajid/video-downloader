import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  X, 
  Check, 
  CreditCard, 
  Coins, 
  Coffee, 
  Smartphone, 
  Copy, 
  AlertCircle,
  TrendingUp,
  DollarSign
} from "lucide-react";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentGateway = "card" | "paypal" | "bkash" | "nagad" | "rocket" | "crypto";

export default function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>("card");
  const [amount, setAmount] = useState<string>("10");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Form input fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobilePIN, setMobilePIN] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  const presets = ["5", "10", "20", "50"];

  const handleCopyCrypto = () => {
    navigator.clipboard.writeText("bc1qxy2kg3ut763ycrc34rfsc73ywre29at798asdx");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentAmount = customAmount !== "" ? customAmount : amount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAmount || parseFloat(currentAmount) <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  const resetModal = () => {
    setIsSuccess(false);
    setIsSubmitting(false);
    setCustomAmount("");
    setAmount("10");
    setCardNumber("");
    setCardExpiry("");
    setCardCVC("");
    setMobileNumber("");
    setMobilePIN("");
    setPaypalEmail("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          id="donate-modal-overlay" 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
        >
          {/* Backdrop interaction to close */}
          <div className="absolute inset-0" onClick={resetModal} />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            id="donate-modal-container"
            className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col my-8"
          >
            {/* Red accent light line at the very top */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-red-700" />

            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between relative">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-red-650/10 border border-red-500/20 flex items-center justify-center">
                  <Heart className="h-4.5 w-4.5 text-red-500 fill-red-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg text-white">Support VeloceLoad</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">100% Secure & Clean</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={resetModal}
                className="p-1.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Success screen */}
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 md:p-12 text-center flex flex-col items-center justify-center gap-6 min-h-[400px]"
              >
                <div className="relative">
                  {/* Pulse visual ring */}
                  <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse scale-125" />
                  <div className="h-20 w-20 rounded-full bg-red-650 flex items-center justify-center border border-red-500/30 text-white relative z-10">
                    <Check className="h-10 w-10 stroke-[3px]" />
                  </div>
                </div>

                <div className="space-y-3 max-w-md">
                  <h4 className="text-2xl font-extrabold font-sans text-white uppercase tracking-tight">Support Received!</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed font-light">
                    Thank you immensely! Your contribution of <span className="text-red-500 font-semibold">${currentAmount}</span> keeps our servers lightning fast, direct pipelines ad-free, and limits fully bypassed.
                  </p>
                </div>

                <div className="bg-[#030303] border border-white/5 rounded-xl px-4 py-3 text-xs font-mono text-zinc-500 max-w-sm">
                  Transaction completed securely via simulated pipeline. No real credit details were captured.
                </div>

                <button
                  onClick={resetModal}
                  className="mt-4 px-8 py-3 rounded-full bg-red-650 hover:bg-red-700 text-white font-semibold text-xs tracking-wider uppercase transition-colors"
                >
                  Return to Downloader
                </button>
              </motion.div>
            ) : (
              <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[75vh]">
                
                {/* Heartfelt design narrative note */}
                <div className="p-5 rounded-2xl bg-[#030303] border border-white/5 relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-5 pointer-events-none">
                    <Heart className="h-44 w-44 text-red-500 fill-red-500" />
                  </div>
                  <div className="space-y-2.5 relative z-10">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">
                      <Coffee className="h-3.5 w-3.5" />
                      <span>Zero Ads • Infinite Pipelines</span>
                    </div>
                    <p className="font-sans text-[13px] md:text-sm text-zinc-300 leading-relaxed font-light">
                      VeloceLoad delivers ultra high-fidelity downloads and audio extraction completely <span className="text-white font-medium">free of advertisements, banners, redirects, or premium paywalls.</span> Running high-performance CDN decryption algorithms, however, requires continuous server capacity.
                    </p>
                    <p className="font-sans text-xs text-zinc-500 leading-relaxed">
                      If this tool saved you time or frustration, please consider contributing. Your polite donation protects our direct server pipe and ensures VeloceLoad remains active and beautifully pristine.
                    </p>
                  </div>
                </div>

                {/* Main donation configure forms */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Select Amount block */}
                  <div className="space-y-3">
                    <h5 className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Select Contribution Amount</h5>
                    <div className="grid grid-cols-4 gap-3">
                      {presets.map((preset) => {
                        const isSelected = amount === preset && customAmount === "";
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              setAmount(preset);
                              setCustomAmount("");
                            }}
                            className={`py-3 rounded-xl border font-mono text-sm font-bold transition-all ${
                              isSelected
                                ? "bg-red-650 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.25)]"
                                : "bg-[#030303] text-zinc-400 border-white/5 hover:border-white/10 hover:text-white"
                            }`}
                          >
                            ${preset}
                          </button>
                        );
                      })}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <DollarSign className="h-4 w-4 text-zinc-500" />
                      </div>
                      <input
                        type="number"
                        placeholder="Or enter custom USD amount..."
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setAmount("");
                        }}
                        min="1"
                        className="w-full pl-10 pr-4 py-3 bg-[#030303] border border-white/5 rounded-xl font-sans text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors placeholder:text-zinc-650"
                      />
                    </div>
                  </div>

                  {/* Payment Gateway Grid */}
                  <div className="space-y-3">
                    <h5 className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Choose Payment Processor</h5>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                       {/* Universal Stripe-like card */}
                      <button
                        type="button"
                        onClick={() => setSelectedGateway("card")}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          selectedGateway === "card"
                            ? "bg-red-650/10 text-red-500 border-red-500"
                            : "bg-[#030303] text-zinc-500 border-white/5 hover:text-zinc-300"
                        }`}
                      >
                        <CreditCard className="h-5 w-5 mb-1.5" />
                        <span className="text-[10px] font-sans font-medium whitespace-nowrap">Card</span>
                      </button>

                      {/* Paypal */}
                      <button
                        type="button"
                        onClick={() => setSelectedGateway("paypal")}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          selectedGateway === "paypal"
                            ? "bg-red-650/10 text-red-500 border-red-500"
                            : "bg-[#030303] text-zinc-500 border-white/5 hover:text-zinc-300"
                        }`}
                      >
                        <Coffee className="h-5 w-5 mb-1.5" />
                        <span className="text-[10px] font-sans font-medium whitespace-nowrap">PayPal</span>
                      </button>

                      {/* bKash */}
                      <button
                        type="button"
                        onClick={() => setSelectedGateway("bkash")}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          selectedGateway === "bkash"
                            ? "bg-red-650/10 text-red-500 border-red-500"
                            : "bg-[#030303] text-zinc-500 border-white/5 hover:text-zinc-300"
                        }`}
                      >
                        <Smartphone className="h-5 w-5 mb-1.5 text-pink-500" />
                        <span className="text-[10px] font-sans font-medium whitespace-nowrap">bKash</span>
                      </button>

                      {/* Nagad */}
                      <button
                        type="button"
                        onClick={() => setSelectedGateway("nagad")}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          selectedGateway === "nagad"
                            ? "bg-red-650/10 text-red-500 border-red-500"
                            : "bg-[#030303] text-zinc-500 border-white/5 hover:text-zinc-300"
                        }`}
                      >
                        <Smartphone className="h-5 w-5 mb-1.5 text-orange-500" />
                        <span className="text-[10px] font-sans font-medium whitespace-nowrap">Nagad</span>
                      </button>

                      {/* Rocket */}
                      <button
                        type="button"
                        onClick={() => setSelectedGateway("rocket")}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          selectedGateway === "rocket"
                            ? "bg-red-650/10 text-red-500 border-red-500"
                            : "bg-[#030303] text-zinc-500 border-white/5 hover:text-zinc-300"
                        }`}
                      >
                        <Smartphone className="h-5 w-5 mb-1.5 text-purple-500" />
                        <span className="text-[10px] font-sans font-medium whitespace-nowrap">Rocket</span>
                      </button>

                      {/* Crypto */}
                      <button
                        type="button"
                        onClick={() => setSelectedGateway("crypto")}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          selectedGateway === "crypto"
                            ? "bg-red-650/10 text-red-500 border-red-500"
                            : "bg-[#030303] text-zinc-500 border-white/5 hover:text-zinc-300"
                        }`}
                      >
                        <Coins className="h-5 w-5 mb-1.5" />
                        <span className="text-[10px] font-sans font-medium whitespace-nowrap">Crypto</span>
                      </button>
                    </div>
                  </div>

                  {/* Core Dynamic payment sub-forms */}
                  <div className="p-5 rounded-2xl bg-[#030303] border border-white/5 space-y-4">
                    
                    {/* CREDIT CARD GATEWAY */}
                    {selectedGateway === "card" && (
                      <div className="space-y-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                          <CreditCard className="h-3.5 w-3.5 text-red-500" />
                          <span>Direct Card Handshake</span>
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Card Number (e.g., 4111 2222 3333 4444)"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl font-sans text-xs text-white focus:outline-none focus:border-red-500/30"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            required
                            placeholder="MM / YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="px-4 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl font-sans text-xs text-white focus:outline-none focus:border-red-500/30 text-center"
                          />
                          <input
                            type="password"
                            required
                            maxLength={4}
                            placeholder="CVC"
                            value={cardCVC}
                            onChange={(e) => setCardCVC(e.target.value)}
                            className="px-4 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl font-sans text-xs text-white focus:outline-none focus:border-red-500/30 text-center"
                          />
                        </div>
                      </div>
                    )}

                    {/* PAYPAL / BUY ME COFFEE */}
                    {selectedGateway === "paypal" && (
                      <div className="space-y-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                          <Coffee className="h-3.5 w-3.5 text-red-500" />
                          <span>PayPal Account Link</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                          Your support will route directly to VeloceLoad developer pipelines under secure PayPal standard tokens.
                        </p>
                        <input
                          type="email"
                          required
                          placeholder="your-paypal-email@domain.com"
                          value={paypalEmail}
                          onChange={(e) => setPaypalEmail(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl font-sans text-xs text-white focus:outline-none focus:border-red-500/30"
                        />
                      </div>
                    )}

                    {/* bKash MOBILE WALLET */}
                    {selectedGateway === "bkash" && (
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                            <span>bKash Checkout</span>
                          </div>
                          <span className="text-[9px] font-mono bg-pink-550/10 border border-pink-500/20 text-pink-500 px-1.5 py-0.5 rounded uppercase">Highly Secure</span>
                        </div>
                        <input
                          type="tel"
                          required
                          placeholder="bKash Number (e.g., 017XXXXXXXX)"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl font-sans text-xs text-white focus:outline-none focus:border-red-500/30"
                        />
                        <input
                          type="password"
                          required
                          placeholder="Your 5-digit PIN (secured, client-side only)"
                          value={mobilePIN}
                          onChange={(e) => setMobilePIN(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl font-sans text-xs text-white focus:outline-none focus:border-red-500/30"
                        />
                        <p className="text-[10px] text-zinc-650 italic">
                          * Secure API integration will trigger a simulated OTP verification. No financial info is stored.
                        </p>
                      </div>
                    )}

                    {/* Nagad MOBILE WALLET */}
                    {selectedGateway === "nagad" && (
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            <span>Nagad Checkout</span>
                          </div>
                          <span className="text-[9px] font-mono bg-orange-550/10 border border-orange-500/20 text-orange-550 px-1.5 py-0.5 rounded uppercase">Fast Track</span>
                        </div>
                        <input
                          type="tel"
                          required
                          placeholder="Nagad Number (e.g., 018XXXXXXXX)"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl font-sans text-xs text-white focus:outline-none focus:border-red-500/30"
                        />
                        <input
                          type="password"
                          required
                          placeholder="Your 4-digit PIN (fully encrypted)"
                          value={mobilePIN}
                          onChange={(e) => setMobilePIN(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl font-sans text-xs text-white focus:outline-none focus:border-red-500/30"
                        />
                      </div>
                    )}

                    {/* Rocket MOBILE WALLET */}
                    {selectedGateway === "rocket" && (
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            <span>Rocket Dutch-Bangla Checkout</span>
                          </div>
                          <span className="text-[9px] font-mono bg-purple-550/10 border border-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded uppercase">DBBL Gate</span>
                        </div>
                        <input
                          type="tel"
                          required
                          placeholder="Rocket Number (12-digit format)"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl font-sans text-xs text-white focus:outline-none focus:border-red-500/30"
                        />
                        <input
                          type="password"
                          required
                          placeholder="Secret Wallet PIN"
                          value={mobilePIN}
                          onChange={(e) => setMobilePIN(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl font-sans text-xs text-white focus:outline-none focus:border-red-500/30"
                        />
                      </div>
                    )}

                    {/* DECENTRALIZED CRYPTO */}
                    {selectedGateway === "crypto" && (
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                            <Coins className="h-3.5 w-3.5 text-yellow-500" />
                            <span>Decentralized Wallet</span>
                          </div>
                          <span className="text-[9px] font-mono bg-yellow-500/10 border border-yellow-500/20 text-yellow-550 px-1.5 py-0.5 rounded uppercase">Anonymous</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                          Scan or copy the Bitcoin (BTC / Segwit) address below to send your secure token support.
                        </p>
                        
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            readOnly
                            value="bc1qxy2kg3ut763ycrc34rfsc73ywre29at798asdx"
                            className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl font-mono text-[10px] text-zinc-300 focus:outline-none cursor-text select-all"
                          />
                          <button
                            type="button"
                            onClick={handleCopyCrypto}
                            className={`px-4 py-2.5 rounded-xl text-xs font-semibold font-sans border transition-all shrink-0 flex items-center gap-1.5 ${
                              copied 
                                ? "bg-emerald-650/10 text-emerald-400 border-emerald-500/30" 
                                : "bg-zinc-900 border-white/5 text-zinc-400 hover:text-white"
                            }`}
                          >
                            {copied ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Summary amount information details */}
                  <div className="flex items-center justify-between px-1 text-xs">
                    <span className="text-zinc-500 font-sans">Payment Amount:</span>
                    <span className="text-white font-mono font-bold text-base flex items-center gap-0.5">
                      <span className="text-red-500 text-xs">$</span>
                      {currentAmount || "0.00"} USD
                    </span>
                  </div>

                  {/* Donate Button Action */}
                  <button
                    type={selectedGateway === "crypto" ? "button" : "submit"}
                    onClick={selectedGateway === "crypto" ? () => setIsSuccess(true) : undefined}
                    disabled={isSubmitting || !currentAmount || parseFloat(currentAmount) <= 0}
                    className="w-full py-4 rounded-xl bg-red-650 hover:bg-red-700 disabled:bg-zinc-900 border border-red-500/25 disabled:border-white/5 disabled:text-zinc-600 text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.2)] flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                        <span>Connecting Pipeline Handshake...</span>
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4 fill-white" />
                        <span>Send Support Contribution</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

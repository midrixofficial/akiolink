import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);
import {
    Store,
    ArrowRight,
    Check,
    Palette,
    Copy,
    Share2,
    Layers,
    Search,
    ShoppingBag,
    Star,
    Smartphone,
    TrendingUp,
    Shield,
    Flame,
    Sparkles,
    ChevronDown,
    Sun,
    Moon,
    ArrowUpRight
} from "lucide-react";

// Presets matching the LinkGenerator presets
const colorPresets = [
    { name: "Indigo Modern", hex: "#4f46e5", bg: "bg-[#4f46e5]" },
    { name: "Emerald Fresh", hex: "#059669", bg: "bg-[#059669]" },
    { name: "Crimson Premium", hex: "#e11d48", bg: "bg-[#e11d48]" },
    { name: "Amber Warm", hex: "#d97706", bg: "bg-[#d97706]" },
    { name: "Ocean Breeze", hex: "#0284c7", bg: "bg-[#0284c7]" },
    { name: "Deep Slate", hex: "#1e293b", bg: "bg-[#1e293b]" },
];

export default function LandingPage({ onNavigate, darkMode, setDarkMode, user }) {
    // Sandbox State
    const containerRef = useRef(null);

    useGSAP(() => {
        // Hero Animation
        const tlHero = gsap.timeline();
        tlHero.from(".hero-badge", { y: -20, opacity: 0, duration: 0.6, ease: "back.out(1.5)", delay: 0.2 })
              .from(".hero-title", { y: 40, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
              .from(".hero-desc", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.6")
              .from(".hero-actions", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.4")
              .from(".hero-indicators", { opacity: 0, x: -10, duration: 0.6, stagger: 0.1 }, "-=0.3");

        // Ambient Glows continuous floating
        gsap.to(".ambient-glow", {
            y: "random(-30, 30)",
            x: "random(-30, 30)",
            duration: "random(3, 6)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            stagger: 0.5
        });

        // Interactive Sandbox ScrollTrigger
        gsap.from(".sandbox-header", {
            scrollTrigger: { trigger: ".sandbox-section", start: "top 80%" },
            y: 30, opacity: 0, duration: 0.8, ease: "power2.out"
        });
        
        gsap.from(".sandbox-controls", {
            scrollTrigger: { trigger: ".sandbox-section", start: "top 70%" },
            x: -50, opacity: 0, duration: 0.8, ease: "power3.out"
        });
        
        gsap.from(".sandbox-mockup", {
            scrollTrigger: { trigger: ".sandbox-section", start: "top 70%" },
            scale: 0.8, opacity: 0, duration: 1, ease: "back.out(1.2)"
        });

        // Features Grid Stagger
        gsap.from(".feature-card", {
            scrollTrigger: { trigger: ".features-section", start: "top 75%" },
            y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out"
        });

        // Workflow Stepper
        const tlWorkflow = gsap.timeline({
            scrollTrigger: { trigger: ".workflow-section", start: "top 75%" }
        });
        
        tlWorkflow.from(".workflow-header", { y: 30, opacity: 0, duration: 0.6 })
                  .from(".workflow-line", { scaleX: 0, transformOrigin: "left center", duration: 1, ease: "power2.inOut" }, "-=0.2")
                  .from(".workflow-step", { scale: 0.8, opacity: 0, duration: 0.5, stagger: 0.2, ease: "back.out(1.5)" }, "-=0.8");

        // Testimonials
        gsap.from(".testimonial-card", {
            scrollTrigger: { trigger: ".testimonials-section", start: "top 75%" },
            y: 30, opacity: 0, duration: 0.6, stagger: 0.15, ease: "power2.out"
        });

        // FAQ
        gsap.from(".faq-item", {
            scrollTrigger: { trigger: ".faq-section", start: "top 80%" },
            x: -20, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out"
        });

        // Urgency Banner Parallax
        gsap.from(".urgency-banner", {
            scrollTrigger: { trigger: ".urgency-section", start: "top 90%", end: "bottom center", scrub: 1 },
            scale: 0.9, opacity: 0.5
        });

    }, { scope: containerRef });

    const [storeName, setStoreName] = useState("Gourmet Cafe");
    const [brandColor, setBrandColor] = useState("#4f46e5");
    const [themeMode, setThemeMode] = useState("glass"); // light | dark | glass
    const [activeTab, setActiveTab] = useState("Popular");
    const [cartCount, setCartCount] = useState(0);

    // FAQ Accordion State
    const [openFaq, setOpenFaq] = useState(null);

    // Calculated slug
    const slug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const getInitials = (name) => {
        if (!name) return "M";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleClaimStore = () => {
        // Save temporary branding options to localStorage for seamless onboarding pre-fill
        localStorage.setItem("akiolink_temp_brand_name", storeName);
        localStorage.setItem("akiolink_temp_brand_color", brandColor);
        localStorage.setItem("akiolink_temp_brand_theme", themeMode);
        
        // Navigate to signup or dashboard
        onNavigate(user ? "/merchant/dashboard" : "/merchant/signup");
    };

    // Simulated Product Data
    const mockProducts = [
        {
            id: 1,
            name: "Classic Avocado Toast",
            desc: "Sourdough bread topped with mashed avocado, cherry tomatoes, and microgreens.",
            price: "₹240",
            rating: "4.8",
            image: "🥑"
        },
        {
            id: 2,
            name: "Hazelnut Cold Brew",
            desc: "Slow-steeped cold brew infusion with nutty hazelnut cream.",
            price: "₹180",
            rating: "4.9",
            image: "☕"
        },
        {
            id: 3,
            name: "Blueberry Cheesecake Tart",
            desc: "Creamy, rich cheesecake fill topped with sweet, ripe local blueberries.",
            price: "₹210",
            rating: "4.7",
            image: "🍰"
        }
    ];

    // Theme responsive classes
    const themeBg = themeMode === "dark"
        ? "bg-slate-950 text-slate-100"
        : themeMode === "glass"
        ? "bg-gradient-to-tr from-sky-100/80 via-rose-50/80 to-indigo-50/80 text-slate-800"
        : "bg-[#f8fafc] text-slate-800";

    const headerBg = themeMode === "dark"
        ? "bg-slate-900 border-b border-slate-800"
        : themeMode === "glass"
        ? "bg-white/40 backdrop-blur-md border-b border-white/20"
        : "bg-white border-b border-slate-100";

    const cardBg = themeMode === "dark"
        ? "bg-slate-900 border border-slate-800"
        : themeMode === "glass"
        ? "bg-white/55 backdrop-blur-sm border border-white/30"
        : "bg-white border border-slate-100 shadow-sm";

    const textMuted = themeMode === "dark" ? "text-slate-400" : "text-[#667085]";

    return (
        <div ref={containerRef} className="min-h-screen bg-[#f4f6fb] dark:bg-[#0f1117] text-[#1a2231] dark:text-slate-100 overflow-x-hidden selection:bg-[#1a2231] selection:text-white dark:selection:bg-white dark:selection:text-[#1a2231]">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0">
                <div className="ambient-glow absolute top-12 left-10 w-[350px] h-[350px] rounded-full bg-indigo-400/10 dark:bg-indigo-500/15 blur-[120px]" />
                <div className="ambient-glow absolute top-48 right-12 w-[350px] h-[350px] rounded-full bg-rose-400/10 dark:bg-rose-500/10 blur-[120px]" style={{ animationDelay: '2s' }} />
                <div className="ambient-glow absolute bottom-10 left-1/3 w-[300px] h-[300px] rounded-full bg-sky-400/10 dark:bg-sky-500/10 blur-[100px]" style={{ animationDelay: '4s' }} />
            </div>

            {/* ── STICKY GLASSMORPHIC HEADER ── */}
            <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-[#0f1117]/70 backdrop-blur-md border-b border-[#e4e7ec] dark:border-slate-800/80 transition-colors">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    
                    {/* Logo */}
                    <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '24px', fontWeight: 800, letterSpacing: '-.04em' }} className="text-[#0c0c0c] dark:text-white leading-none select-none">
                            Akio<span className="text-[#bbbbbb] dark:text-[#4f5a72] font-bold">link</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#667085] dark:text-slate-300">
                        <a href="#features" className="hover:text-[#1a2231] dark:hover:text-white transition-colors">Features</a>
                        <a href="#demo" className="hover:text-[#1a2231] dark:hover:text-white transition-colors">Interactive Demo</a>
                        <a href="#how-it-works" className="hover:text-[#1a2231] dark:hover:text-white transition-colors">How It Works</a>
                        <a href="#testimonials" className="hover:text-[#1a2231] dark:hover:text-white transition-colors">Testimonials</a>
                        <a href="#faq" className="hover:text-[#1a2231] dark:hover:text-white transition-colors">FAQ</a>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        
                        {/* Theme Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e4e7ec] bg-white text-[#667085] hover:bg-[#f9fafb] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all shadow-sm"
                            title="Toggle Light/Dark Theme"
                        >
                            {darkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
                        </button>

                        {user ? (
                            <button
                                onClick={() => onNavigate("/merchant/dashboard")}
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1a2231] text-white dark:bg-white dark:text-[#1a2231] px-5 py-2.5 text-xs sm:text-sm font-bold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Dashboard
                                <ArrowRight size={14} />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => onNavigate("/merchant/signin")}
                                    className="hidden sm:inline-flex text-sm font-semibold text-[#667085] hover:text-[#1a2231] dark:text-slate-300 dark:hover:text-white px-3 py-2 transition-colors"
                                >
                                    Sign In
                                </button>
                                
                                <button
                                    onClick={() => onNavigate("/merchant/signup")}
                                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1a2231] text-white dark:bg-white dark:text-[#1a2231] px-5 py-2.5 text-xs sm:text-sm font-bold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Get Started Free
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </header>

            {/* ── HERO SECTION ── */}
            <section className="relative z-10 pt-16 pb-12 px-6">
                <div className="mx-auto max-w-7xl text-center space-y-8">
                    
                    {/* Badge */}
                    <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 shadow-sm animate-bounce">
                        <Sparkles size={13} className="fill-current" />
                        <span>The Ultimate Merchant Digital Menu Platform</span>
                    </div>

                    {/* Main Title */}
                    <div className="max-w-4xl mx-auto space-y-4">
                        <h1 className="hero-title text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1a2231] dark:text-white leading-[1.1] font-sans">
                            Turn Your Menu Into A Gorgeous{" "}
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-rose-400">
                                Digital Checkout Link
                            </span>
                        </h1>
                        <p className="hero-desc text-md sm:text-xl text-[#667085] dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Claim your custom URL slug, set up your menu card in seconds, customize colors and glassmorphic designs, and accept direct, zero-commission customer orders instantly.
                        </p>
                    </div>

                    {/* Primary actions */}
                    <div className="hero-actions flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-2">
                        {user ? (
                            <>
                                <button
                                    onClick={() => onNavigate("/merchant/dashboard")}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1a2231] dark:bg-white text-white dark:text-[#1a2231] px-8 py-4 text-sm font-bold shadow-lg shadow-slate-900/10 dark:shadow-white/5 hover:scale-[1.03] active:scale-[0.97] transition-all hover:bg-slate-800 dark:hover:bg-slate-100"
                                >
                                    Go to Dashboard
                                    <ArrowRight size={16} />
                                </button>
                                <a
                                    href="#demo"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d0d5dd] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#1a2231] dark:text-white px-8 py-4 text-sm font-bold shadow-sm hover:bg-[#f9fafb] dark:hover:bg-slate-800 transition-colors"
                                >
                                    Try Sandbox Simulator
                                </a>
                            </>
                        ) : (
                            <>
                                <a
                                    href="#demo"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1a2231] dark:bg-white text-white dark:text-[#1a2231] px-8 py-4 text-sm font-bold shadow-lg shadow-slate-900/10 dark:shadow-white/5 hover:scale-[1.03] active:scale-[0.97] transition-all hover:bg-slate-800 dark:hover:bg-slate-100"
                                >
                                    Try Sandbox Simulator
                                    <ArrowRight size={16} />
                                </a>
                                <button
                                    onClick={() => onNavigate("/merchant/signup")}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d0d5dd] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#1a2231] dark:text-white px-8 py-4 text-sm font-bold shadow-sm hover:bg-[#f9fafb] dark:hover:bg-slate-800 transition-colors"
                                >
                                    Quick SignUp
                                </button>
                            </>
                        )}
                    </div>

                    {/* Visual indicators */}
                    <div className="hero-indicators flex items-center justify-center gap-8 pt-4 text-xs font-semibold text-[#98a2b3] dark:text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Check size={14} className="text-emerald-500" />
                            <span>No Credit Card Required</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Check size={14} className="text-emerald-500" />
                            <span>Launch in 60 seconds</span>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── LIVE INTERACTIVE BRAND SANDBOX (THE WOW FACTOR) ── */}
            <section id="demo" className="sandbox-section relative z-10 py-16 px-6 border-t border-[#e4e7ec]/60 dark:border-slate-800/40">
                <div className="mx-auto max-w-7xl">
                    
                    <div className="sandbox-header text-center max-w-3xl mx-auto mb-16 space-y-3">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 dark:bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                            <Flame size={12} className="fill-current" />
                            <span>Try It Live</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1a2231] dark:text-white">
                            Customize Your Digital Portal Instantly
                        </h2>
                        <p className="text-sm sm:text-base text-[#667085] dark:text-slate-400">
                            Fiddle with the customization dashboard below and watch how your customer-facing digital ordering storefront updates inside the high-fidelity simulator.
                        </p>
                    </div>

                    {/* Sandbox Grid */}
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
                        
                        {/* LEFT Controls (5 Columns) */}
                        <div className="sandbox-controls lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                            
                            {/* Card 1: Brand details config */}
                            <div className="rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6 transition-colors">
                                
                                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                    <Palette size={18} />
                                    <h3 className="text-base font-bold text-[#1a2231] dark:text-white">Design Customizer Dashboard</h3>
                                </div>

                                {/* Custom Slug Live */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#344054] dark:text-slate-300 uppercase tracking-wider">
                                        Merchant Display Name
                                    </label>
                                    <input
                                        type="text"
                                        value={storeName}
                                        onChange={(e) => setStoreName(e.target.value || "My Store")}
                                        className="w-full rounded-xl border border-[#d0d5dd] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-[#1a2231] dark:text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                                        placeholder="e.g. Gourmet Coffee Cafe"
                                        maxLength="28"
                                    />
                                    
                                    {/* URL Preview */}
                                    <div className="flex items-center gap-1.5 text-xs text-[#98a2b3] dark:text-slate-500 select-none pt-1">
                                        <Share2 size={12} />
                                        <span>Portal URL:</span>
                                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 truncate">
                                            akiolink.com/store/{slug || "my-store"}
                                        </span>
                                    </div>
                                </div>

                                {/* Brand Theme Template */}
                                <div className="space-y-2.5 pt-4 border-t border-[#f2f4f7] dark:border-slate-800">
                                    <label className="text-xs font-bold text-[#344054] dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                        <Layers size={14} className="text-[#98a2b3]" />
                                        Store Theme Mode
                                    </label>
                                    
                                    <div className="grid grid-cols-3 gap-2">
                                        {["light", "dark", "glass"].map((mode) => (
                                            <button
                                                key={mode}
                                                type="button"
                                                onClick={() => setThemeMode(mode)}
                                                className={`rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all capitalize hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                                                    themeMode === mode
                                                        ? "bg-[#1a2231] text-white border-[#1a2231] dark:bg-white dark:text-[#1a2231] dark:border-white shadow-sm"
                                                        : "border-[#e4e7ec] dark:border-slate-800 text-[#667085] dark:text-slate-400"
                                                }`}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Brand Colors */}
                                <div className="space-y-3 pt-4 border-t border-[#f2f4f7] dark:border-slate-800">
                                    <label className="text-xs font-bold text-[#344054] dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                                        <span>Brand Color Theme</span>
                                        <span className="font-mono text-[11px] text-[#98a2b3]">{brandColor}</span>
                                    </label>
                                    
                                    <div className="grid grid-cols-6 gap-2">
                                        {colorPresets.map((preset) => (
                                            <button
                                                key={preset.name}
                                                type="button"
                                                onClick={() => setBrandColor(preset.hex)}
                                                className={`h-9 w-full rounded-xl transition transform hover:scale-105 active:scale-95 relative ${preset.bg} ${
                                                    brandColor === preset.hex
                                                        ? "ring-4 ring-offset-2 ring-[#1a2231] dark:ring-offset-slate-900 dark:ring-white"
                                                        : "border border-black/10 dark:border-white/10"
                                                }`}
                                                title={preset.name}
                                            >
                                                {brandColor === preset.hex && (
                                                    <Check size={14} className="absolute inset-0 m-auto text-white" />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* HTML Hex Picker */}
                                    <div className="mt-3 flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={brandColor}
                                            onChange={(e) => setBrandColor(e.target.value)}
                                            className="h-10 w-12 cursor-pointer rounded-xl border border-[#d0d5dd] dark:border-slate-700 bg-transparent p-0.5"
                                        />
                                        <div className="relative flex-1">
                                            <span className="absolute inset-y-0 left-3 flex items-center text-sm font-semibold text-[#98a2b3]">#</span>
                                            <input
                                                type="text"
                                                value={brandColor.replace("#", "")}
                                                onChange={(e) => setBrandColor("#" + e.target.value)}
                                                className="w-full rounded-xl border border-[#d0d5dd] dark:border-slate-700 bg-white dark:bg-slate-800 pl-7 pr-4 py-2.5 text-sm text-[#1a2231] dark:text-white outline-none"
                                                maxLength="7"
                                            />
                                        </div>
                                    </div>

                                </div>

                            </div>

                            {/* Call to action */}
                            <button
                                onClick={handleClaimStore}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-white px-6 py-4 text-sm font-bold hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                            >
                                <Flame size={16} />
                                Claim This Store & Start Free
                            </button>

                        </div>

                        {/* RIGHT Viewport Mockup (7 Columns) */}
                        <div className="sandbox-mockup lg:col-span-7 flex flex-col items-center">
                            
                            {/* Visual Indicator of Simulator */}
                            <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-[#98a2b3] dark:text-slate-500">
                                <Smartphone size={14} />
                                <span>Live Responsive Mobile Storefront Preview</span>
                            </div>

                            {/* Simulated Smartphone Frame */}
                            <div className="w-[325px] h-[570px] border-[6px] border-slate-950 dark:border-slate-800 rounded-[44px] shadow-2xl relative bg-white dark:bg-slate-950 flex flex-col transition-all duration-300 ring-1 ring-black/5">
                                
                                {/* Dynamic Island Ear slot */}
                                <div className="absolute top-[2.5px] left-1/2 -translate-x-1/2 h-[2px] w-12 bg-slate-800 dark:bg-slate-700 rounded-full z-50" />
                                
                                {/* Screen Content Container */}
                                <div className={`flex-1 rounded-[38px] overflow-hidden flex flex-col h-full w-full select-none ${themeBg} transition-all duration-300`}>
                                    
                                    {/* Simulated Phone Status Bar */}
                                    <div className={`relative flex items-center justify-between px-5 pt-3.5 pb-2.5 text-[9px] font-bold tracking-tight border-b border-black/5 dark:border-white/5`}>
                                        <span>9:41</span>
                                        {/* Micro Dynamic Island */}
                                        <div className="absolute left-1/2 -translate-x-1/2 top-3 h-3 w-10 rounded-full bg-black z-20 flex items-center justify-center gap-0.5 shadow-sm">
                                            <div className="h-0.5 w-0.5 rounded-full bg-emerald-500 animate-pulse" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>5G</span>
                                            <div className="w-3.5 h-2 border border-current rounded-sm flex items-center p-[1px]">
                                                <div className="bg-current h-full w-full rounded-[0.5px]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mock Shopfront Sticky Header */}
                                    <div className={`sticky top-0 z-10 py-3 px-4 flex items-center justify-between transition-all ${headerBg}`}>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-6 w-6 rounded-lg flex items-center justify-center text-white font-bold text-[10px] shadow-sm transition-colors"
                                                style={{ backgroundColor: brandColor }}
                                            >
                                                {storeName.charAt(0).toUpperCase() || "S"}
                                            </div>
                                            <span className="font-extrabold text-xs tracking-tight truncate max-w-[110px]">
                                                {storeName}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                                                <Search size={13} />
                                            </button>
                                            <button className="relative p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                                                <ShoppingBag size={13} />
                                                {cartCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#f04438] text-white flex items-center justify-center text-[7px] font-bold">
                                                        {cartCount}
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Shop banner header */}
                                    <div className="px-4 py-5 text-center space-y-1.5 border-b border-black/5 dark:border-white/5 bg-gradient-to-b from-black/[0.02] dark:from-white/[0.01] to-transparent relative overflow-hidden">
                                        <h2 className="text-base font-extrabold tracking-tight">{storeName}</h2>
                                        <p className={`text-[9px] max-w-[200px] mx-auto truncate ${textMuted}`}>
                                            New Bangalore Service Road, Vellore, Tamil Nadu
                                        </p>
                                        <div className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-1">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Open & Taking Orders
                                        </div>
                                    </div>

                                    {/* Scrollable Products list */}
                                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-none">
                                        
                                        {/* Categories */}
                                        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                                            {["Popular", "Brews", "Deserts", "Snacks"].map((cat) => (
                                                <span
                                                    key={cat}
                                                    onClick={() => setActiveTab(cat)}
                                                    className={`rounded-full px-3 py-0.5 text-[9px] font-bold whitespace-nowrap cursor-pointer transition-all ${
                                                        activeTab === cat
                                                            ? "text-white"
                                                            : "bg-black/5 dark:bg-white/5 hover:bg-black/10"
                                                    }`}
                                                    style={activeTab === cat ? { backgroundColor: brandColor } : null}
                                                >
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Products grid mockup */}
                                        <div className="grid gap-3">
                                            {mockProducts.map((prod) => (
                                                <div key={prod.id} className={`rounded-xl p-3 flex flex-col justify-between transition-all ${cardBg}`}>
                                                    <div className="flex gap-2">
                                                        <span className="text-xl flex-shrink-0">{prod.image}</span>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-start justify-between gap-1">
                                                                <h4 className="font-extrabold text-[10px] truncate leading-tight">{prod.name}</h4>
                                                                <div className="flex items-center gap-0.5 text-[8px] text-amber-500 font-bold flex-shrink-0">
                                                                    <Star size={8} fill="currentColor" />
                                                                    <span>{prod.rating}</span>
                                                                </div>
                                                            </div>
                                                            <p className={`text-[8px] mt-0.5 line-clamp-1 leading-normal ${textMuted}`}>{prod.desc}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5 dark:border-white/5">
                                                        <span className="text-[10px] font-extrabold">{prod.price}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setCartCount(c => c + 1)}
                                                            className="rounded-lg px-2.5 py-0.5 text-[8px] font-bold text-white transition-all transform active:scale-95 shadow-sm"
                                                            style={{ backgroundColor: brandColor }}
                                                        >
                                                            Add +
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    </div>

                                    {/* Mock Shopfront Sticky Footer */}
                                    <div className="mt-auto p-3 border-t border-black/5 dark:border-white/5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
                                        <button
                                            type="button"
                                            onClick={() => alert("Digital menu checkout simulation works! Secure your URL to configure this storefront.")}
                                            className="w-full rounded-xl py-2 text-[10px] font-bold text-white text-center transition-all shadow-md"
                                            style={{ backgroundColor: brandColor }}
                                        >
                                            View Cart • {cartCount > 0 ? `${cartCount} Item(s)` : "Empty"}
                                        </button>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* ── FEATURES BENTO GRID ── */}
            <section id="features" className="features-section relative z-10 py-16 px-6 bg-slate-50 dark:bg-slate-900/30 border-t border-b border-[#e4e7ec]/60 dark:border-slate-800/40">
                <div className="mx-auto max-w-7xl">
                    
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                            <Sparkles size={12} className="fill-current" />
                            <span>Product Pillars</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1a2231] dark:text-white">
                            Everything You Need to Sell Online
                        </h2>
                        <p className="text-sm sm:text-base text-[#667085] dark:text-slate-400">
                            No complicated coding, no high app fees. Build storefront portals designed strictly to boost merchant sales conversion.
                        </p>
                    </div>

                    {/* Bento Grid layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* Feature 1: Custom Slug */}
                        <div className="feature-card rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:shadow-md hover:scale-[1.01] transition-all duration-300">
                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                                <Share2 size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-[#1a2231] dark:text-white mb-2">Instant QR & Link Generator</h3>
                            <p className="text-sm text-[#667085] dark:text-slate-400 leading-relaxed">
                                Secure your branded slug (e.g. `akiolink.com/store/my-cafe`), and print dynamic QR codes for in-store dining or social sharing.
                            </p>
                        </div>

                        {/* Feature 2: High-Fidelity Previews */}
                        <div className="feature-card rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:shadow-md hover:scale-[1.01] transition-all duration-300">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                                <Smartphone size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-[#1a2231] dark:text-white mb-2">Live Responsive Mockups</h3>
                            <p className="text-sm text-[#667085] dark:text-slate-400 leading-relaxed">
                                Preview your storefront in real time on simulated Mobile, Tablet, and Desktop layouts side-by-side inside the builder dashboard.
                            </p>
                        </div>

                        {/* Feature 3: Design Customizer */}
                        <div className="feature-card rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:shadow-md hover:scale-[1.01] transition-all duration-300">
                            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                                <Layers size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-[#1a2231] dark:text-white mb-2">Glassmorphic Aesthetics</h3>
                            <p className="text-sm text-[#667085] dark:text-slate-400 leading-relaxed">
                                Choose custom branding hex codes and apply premium Light, Dark, or futuristic Glassmorphism template schemes instantly.
                            </p>
                        </div>

                        {/* Feature 4: Order Dashboard */}
                        <div className="feature-card rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:shadow-md hover:scale-[1.01] transition-all duration-300 md:col-span-2 lg:col-span-1">
                            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                                <TrendingUp size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-[#1a2231] dark:text-white mb-2">Smart Merchant Analytics</h3>
                            <p className="text-sm text-[#667085] dark:text-slate-400 leading-relaxed">
                                Track total orders, customers, and revenues. Process statuses (Pending, Completed, Cancelled) in a premium dashboard.
                            </p>
                        </div>

                        {/* Feature 5: Security */}
                        <div className="feature-card rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:shadow-md hover:scale-[1.01] transition-all duration-300">
                            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                                <Shield size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-[#1a2231] dark:text-white mb-2">Enterprise-Grade Security</h3>
                            <p className="text-sm text-[#667085] dark:text-slate-400 leading-relaxed">
                                Safe authentication layers, stable database storage, and optimized load times ensuring customers never drop during checkout.
                            </p>
                        </div>

                        {/* Feature 6: Customer Support */}
                        <div className="feature-card rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:shadow-md hover:scale-[1.01] transition-all duration-300">
                            <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4">
                                <Sparkles size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-[#1a2231] dark:text-white mb-2">Merchant Support Module</h3>
                            <p className="text-sm text-[#667085] dark:text-slate-400 leading-relaxed">
                                Integrated issue ticketing and feedback forms straight to our support staff to quickly unblock business activities.
                            </p>
                        </div>

                    </div>

                </div>
            </section>

            {/* ── VISUAL STEPPER (HOW IT WORKS) ── */}
            <section id="how-it-works" className="workflow-section relative z-10 py-16 px-6">
                <div className="mx-auto max-w-7xl">
                    
                    <div className="workflow-header text-center max-w-3xl mx-auto mb-16 space-y-3">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1a2231]/5 dark:bg-white/10 px-3 py-1 text-xs font-semibold text-[#1a2231] dark:text-white">
                            <span>Workflow</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1a2231] dark:text-white">
                            Launch Your Shop In 3 Steps
                        </h2>
                        <p className="text-sm sm:text-base text-[#667085] dark:text-slate-400">
                            A highly optimized setup flow getting your digital storefront up and running with minimal friction.
                        </p>
                    </div>

                    {/* Stepper Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        
                        {/* Connecting Line (for large displays) */}
                        <div className="workflow-line hidden md:block absolute top-1/2 left-20 right-20 h-0.5 bg-[#e4e7ec] dark:bg-slate-800 -translate-y-1/2 z-0" />

                        {/* Step 1 */}
                        <div className="workflow-step rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-center relative z-10 space-y-3 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-[#1a2231] dark:bg-white text-white dark:text-[#1a2231] font-bold text-sm flex items-center justify-center mx-auto shadow-sm">
                                1
                            </div>
                            <h3 className="text-md font-bold text-[#1a2231] dark:text-white">Branding Setup</h3>
                            <p className="text-xs text-[#667085] dark:text-slate-400">
                                Sign up, configure display details, pick custom Hex colors, and choose a light, dark, or glass template.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="workflow-step rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-center relative z-10 space-y-3 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-[#1a2231] dark:bg-white text-white dark:text-[#1a2231] font-bold text-sm flex items-center justify-center mx-auto shadow-sm">
                                2
                            </div>
                            <h3 className="text-md font-bold text-[#1a2231] dark:text-white">Add Products & Menus</h3>
                            <p className="text-xs text-[#667085] dark:text-slate-400">
                                Input categories (Mains, Brews) and upload item descriptions, pricing lists, and details.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="workflow-step rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-center relative z-10 space-y-3 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-[#1a2231] dark:bg-white text-white dark:text-[#1a2231] font-bold text-sm flex items-center justify-center mx-auto shadow-sm">
                                3
                            </div>
                            <h3 className="text-md font-bold text-[#1a2231] dark:text-white">Share Link & Sell</h3>
                            <p className="text-xs text-[#667085] dark:text-slate-400">
                                Share your custom slug, print generated ordering QR codes, and watch orders roll in live on the dashboard.
                            </p>
                        </div>

                    </div>

                </div>
            </section>

            {/* ── CUSTOMER TESTIMONIALS ── */}
            <section id="testimonials" className="testimonials-section relative z-10 py-16 px-6 bg-slate-50 dark:bg-slate-900/30 border-t border-b border-[#e4e7ec]/60 dark:border-slate-800/40">
                <div className="mx-auto max-w-7xl">
                    
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#12b76a]/10 px-3 py-1 text-xs font-semibold text-[#12b76a]">
                            <span>Merchant Love</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1a2231] dark:text-white">
                            Loved By Modern Businesses
                        </h2>
                        <p className="text-sm sm:text-base text-[#667085] dark:text-slate-400">
                            See how local diners, artisanal coffee rosters, and bakers scale their operations with Akiolink storefront solutions.
                        </p>
                    </div>

                    {/* Testimonials Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Testimonial 1 */}
                        <div className="testimonial-card rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 transition-colors">
                            <div className="flex gap-0.5 text-amber-400">
                                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="currentColor" />)}
                            </div>
                            <p className="text-xs sm:text-sm text-[#344054] dark:text-slate-300 italic leading-relaxed">
                                "The interactive preview sandbox let me style my digital menu to match my store's brand perfectly. Seamless signup prefilled all colors automatically. Amazing!"
                            </p>
                            <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <div className="h-9 w-9 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-xs">
                                    RD
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-[#1a2231] dark:text-white">Rayan D'souza</h4>
                                    <p className="text-[10px] text-[#98a2b3]">Roastery Coffee Diner</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="testimonial-card rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 transition-colors">
                            <div className="flex gap-0.5 text-amber-400">
                                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="currentColor" />)}
                            </div>
                            <p className="text-xs sm:text-sm text-[#344054] dark:text-slate-300 italic leading-relaxed">
                                "I printed my custom menu QR code on all tables. Now, customers scan, order, and pay, and it goes straight to the live orders dashboard. Akiolink saved us hours."
                            </p>
                            <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <div className="h-9 w-9 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs">
                                    AP
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-[#1a2231] dark:text-white">Ananya Patel</h4>
                                    <p className="text-[10px] text-[#98a2b3]">Artisanal Sourdough Bakery</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="testimonial-card rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 transition-colors">
                            <div className="flex gap-0.5 text-amber-400">
                                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="currentColor" />)}
                            </div>
                            <p className="text-xs sm:text-sm text-[#344054] dark:text-slate-300 italic leading-relaxed">
                                "We chose the premium Glassmorphic theme template, and customers consistently praise how slick and modern the interface feels. It really reflects the premium quality of our products."
                            </p>
                            <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <div className="h-9 w-9 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs">
                                    SL
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-[#1a2231] dark:text-white">Sara Lee</h4>
                                    <p className="text-[10px] text-[#98a2b3]">The Gourmet Bistro</p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* ── INTERACTIVE FAQ SECTION ── */}
            <section id="faq" className="faq-section relative z-10 py-16 px-6">
                <div className="mx-auto max-w-4xl">
                    
                    <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
                        <h2 className="text-3xl font-bold tracking-tight text-[#1a2231] dark:text-white">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-sm text-[#667085] dark:text-slate-400">
                            Clear and straightforward answers to help merchants unblock queries instantly.
                        </p>
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-4">
                        {[
                            {
                                q: "How much does Akiolink cost?",
                                a: "You can sign up and build your storefront link completely for free. We do not charge transaction commissions or monthly listing fees, keeping your earnings 100% yours."
                            },
                            {
                                q: "Do customers need to install an app to order?",
                                a: "No app downloads required! Your customer portal is web-based, optimized to render beautifully and load in milliseconds on any mobile or desktop browser when scanned or clicked."
                            },
                            {
                                q: "Can I use my custom brand theme colors?",
                                a: "Absolutely! The builder contains custom brand color presets and a full hex picker so your checkout interface perfectly aligns with your cafe or business logo branding."
                            },
                            {
                                q: "How do I print the storefront QR codes?",
                                a: "Akiolink generates custom QR codes linked directly to your portal URL inside the dashboard settings. You can download and print them on posters, tables, menus, or receipts."
                            }
                        ].map((faq, idx) => (
                            <div
                                key={idx}
                                className="faq-item rounded-2xl border border-[#e4e7ec] dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-300"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-sm sm:text-base text-[#1a2231] dark:text-white outline-none cursor-pointer"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown
                                        size={18}
                                        className={`text-[#98a2b3] transition-transform duration-300 ${
                                            openFaq === idx ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>
                                
                                {openFaq === idx && (
                                    <div className="px-6 pb-5 text-xs sm:text-sm text-[#667085] dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800/80 pt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* ── URGENCY FINAL CTA BANNER ── */}
            <section className="urgency-section relative z-10 py-16 px-6">
                <div className="urgency-banner mx-auto max-w-5xl rounded-3xl bg-[#1a2231] dark:bg-slate-900 border border-slate-800 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
                    
                    {/* Background Dot pattern */}
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                        }}
                    />
                    
                    {/* Decorative blobs */}
                    <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
                    <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-rose-500/10 blur-3xl" />

                    <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                        
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                            <Sparkles size={12} />
                            <span>Reserve Your Slug Today</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            Claim Your Custom Storefront Portal URL
                        </h2>
                        
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Securing your customized link like `akiolink.com/store/your-slug` takes less than 60 seconds. Launch your premium digital portal before someone else takes your name.
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 pt-4 max-w-md mx-auto">
                            <div className="flex rounded-xl bg-white/10 border border-white/15 px-3 py-3 items-center flex-1">
                                <span className="text-xs font-semibold text-slate-400 select-none pr-1">akiolink.com/store/</span>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setStoreName(e.target.value)}
                                    placeholder="shop-slug"
                                    className="bg-transparent text-xs text-white outline-none flex-1 font-semibold placeholder-slate-500"
                                />
                            </div>
                            <button
                                onClick={handleClaimStore}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-[#1a2231] hover:bg-slate-100 px-6 py-3.5 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            >
                                Secure Store URL
                                <ArrowUpRight size={15} />
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── DETAILED FOOTER ── */}
            <footer className="relative z-10 bg-white dark:bg-slate-950 border-t border-[#e4e7ec] dark:border-slate-900 py-12 px-6 transition-colors">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-[#f2f4f7] dark:border-slate-900">
                        
                        {/* Column 1: Brand Info */}
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: 800, letterSpacing: '-.04em' }} className="text-[#0c0c0c] dark:text-white leading-none select-none">
                                    Akio<span className="text-[#bbbbbb] dark:text-[#4f5a72] font-bold">link</span>
                                </div>
                            </div>
                            <p className="text-xs text-[#667085] dark:text-slate-500 leading-relaxed max-w-xs">
                                Turn menus and QR codes into beautiful, glassmorphic checkout experiences in 60 seconds. Sell smarter and accept direct local orders today.
                            </p>
                        </div>

                        {/* Column 2: Platform Links */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-[#344054] dark:text-slate-300 uppercase tracking-wider">Platform</h4>
                            <ul className="space-y-2 text-xs font-semibold text-[#667085] dark:text-slate-400">
                                <li><a href="#features" className="hover:text-[#1a2231] dark:hover:text-white transition-colors">Core Features</a></li>
                                <li><a href="#demo" className="hover:text-[#1a2231] dark:hover:text-white transition-colors">Interactive Playground</a></li>
                                <li><a href="#how-it-works" className="hover:text-[#1a2231] dark:hover:text-white transition-colors">Launch Stepper</a></li>
                            </ul>
                        </div>

                        {/* Column 3: Contact/Support */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-[#344054] dark:text-slate-300 uppercase tracking-wider">Connect</h4>
                            <ul className="space-y-2 text-xs font-semibold text-[#667085] dark:text-slate-400">
                                <li><span className="cursor-pointer hover:text-[#1a2231] dark:hover:text-white transition-colors" onClick={() => onNavigate("/merchant/support")}>Ticketing Support</span></li>
                                <li><span className="cursor-pointer hover:text-[#1a2231] dark:hover:text-white transition-colors" onClick={() => onNavigate("/merchant/feedback")}>Send Feedback</span></li>
                            </ul>
                        </div>

                        {/* Column 4: Newsletter */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-[#344054] dark:text-slate-300 uppercase tracking-wider">Stay Updated</h4>
                            <p className="text-xs text-[#667085] dark:text-slate-500">Subscribe for features release & optimization guides.</p>
                            <form onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }} className="flex gap-2">
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    className="rounded-xl border border-[#d0d5dd] dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-[#1a2231] dark:text-white outline-none flex-1"
                                />
                                <button
                                    type="submit"
                                    className="rounded-xl bg-[#1a2231] dark:bg-white text-white dark:text-[#1a2231] px-4 py-2 text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
                                >
                                    Join
                                </button>
                            </form>
                        </div>

                    </div>

                    {/* Bottom Copyright */}
                    <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#98a2b3] dark:text-slate-500">
                        <span>© {new Date().getFullYear()} Akiolink Inc. All rights reserved.</span>
                        <div className="flex gap-4 mt-2 sm:mt-0">
                            <a href="#" className="hover:underline">Privacy Policy</a>
                            <a href="#" className="hover:underline">Terms of Service</a>
                        </div>
                    </div>

                </div>
            </footer>

        </div>
    );
}

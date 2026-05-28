import { useState, useEffect } from "react";
import axios from "axios";
import {
    Link as LinkIcon,
    Smartphone,
    Tablet as TabletIcon,
    Laptop,
    Copy,
    Check,
    Palette,
    FileText,
    Share2,
    ArrowLeft,
    Layers,
    Search,
    ShoppingBag,
    Star
} from "lucide-react";

const inputClass =
    "w-full rounded-xl border border-[#d0d5dd] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-[#1a2231] dark:text-white placeholder-[#98a2b3] outline-none transition focus:border-[#1a2231] focus:ring-2 focus:ring-[#1a2231]/10 dark:focus:border-slate-400";

const colorPresets = [
    { name: "Indigo Modern", hex: "#4f46e5", bg: "bg-[#4f46e5]" },
    { name: "Emerald Fresh", hex: "#059669", bg: "bg-[#059669]" },
    { name: "Crimson Premium", hex: "#e11d48", bg: "bg-[#e11d48]" },
    { name: "Amber Warm", hex: "#d97706", bg: "bg-[#d97706]" },
    { name: "Ocean Breeze", hex: "#0284c7", bg: "bg-[#0284c7]" },
    { name: "Deep Slate", hex: "#1e293b", bg: "bg-[#1e293b]" },
];

export default function LinkGenerator({ onNavigate }) {
    const [device, setDevice] = useState("mobile"); // mobile | tablet | desktop
    const [themeMode, setThemeMode] = useState("light"); // light | dark | glass
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    const [customizer, setCustomizer] = useState({
        displayName: "",
        businessAddress: "New Bangalore Service Road, No: 1, Near Green Circle, NH 46 Service Rd, Vellore, Tamil Nadu 632004",
        brandColor: "#4f46e5",
        slug: "",
    });

    useEffect(() => {
        fetchMerchantData();
    }, []);

    const fetchMerchantData = async () => {
        try {
            const { data } = await axios.get("/api/merchant");
            const tempBrandName = localStorage.getItem("akiolink_temp_brand_name");
            const tempBrandColor = localStorage.getItem("akiolink_temp_brand_color");
            const tempBrandTheme = localStorage.getItem("akiolink_temp_brand_theme");

            if (tempBrandTheme) {
                setThemeMode(tempBrandTheme);
            }

            if (data.merchant) {
                const businessName = data.merchant.business_name || tempBrandName || "My Store";
                setCustomizer((prev) => ({
                    ...prev,
                    displayName: businessName,
                    brandColor: tempBrandColor || prev.brandColor,
                    slug: businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    businessAddress: data.merchant.business_address || "New Bangalore Service Road, No: 1, Near Green Circle, NH 46 Service Rd, Vellore, Tamil Nadu 632004",
                }));
            }
        } catch (error) {
            const tempBrandName = localStorage.getItem("akiolink_temp_brand_name");
            const tempBrandColor = localStorage.getItem("akiolink_temp_brand_color");
            const tempBrandTheme = localStorage.getItem("akiolink_temp_brand_theme");

            if (tempBrandTheme) {
                setThemeMode(tempBrandTheme);
            }

            setCustomizer((prev) => ({
                ...prev,
                displayName: tempBrandName || "Akiolink Store",
                brandColor: tempBrandColor || "#4f46e5",
                slug: (tempBrandName || "Akiolink Store").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                businessAddress: "New Bangalore Service Road, No: 1, Near Green Circle, NH 46 Service Rd, Vellore, Tamil Nadu 632004",
            }));
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        const url = `${window.location.origin}/${customizer.slug}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleColorSelect = (hex) => {
        setCustomizer((prev) => ({ ...prev, brandColor: hex }));
    };

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setCustomizer((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "displayName") {
                updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            }
            return updated;
        });
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a2231]/10 border-t-[#1a2231]"></div>
            </div>
        );
    }

    // Dynamic styles based on customization
    const previewStyles = {
        themeColor: customizer.brandColor,
    };

    const svelteAppUrl = `/${customizer.slug}?brandName=${encodeURIComponent(customizer.displayName)}&brandColor=${encodeURIComponent(customizer.brandColor)}&brandAddress=${encodeURIComponent(customizer.businessAddress)}&themeMode=${encodeURIComponent(themeMode)}`;

    return (
        <main className="p-5 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a2231] dark:text-white">Store Link Generator</h1>
                        <p className="mt-1 text-sm text-[#667085] dark:text-slate-400">
                            Customize your online customer portal interface and share your generated web link.
                        </p>
                    </div>
                    <button
                        onClick={() => onNavigate?.("/merchant/dashboard")}
                        className="self-start inline-flex items-center gap-2 rounded-xl border border-[#e4e7ec] bg-white px-4 py-2 text-sm font-medium text-[#667085] hover:bg-[#f9fafb] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    
                    {/* Left: Customizer Settings (5 Columns) */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Card 1: Link Sharing */}
                        <div className="rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h3 className="text-base font-bold text-[#1a2231] dark:text-white mb-4 flex items-center gap-2">
                                <Share2 size={18} className="text-[#98a2b3]" />
                                Your Customer Shop Link
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="flex rounded-xl border border-[#d0d5dd] dark:border-slate-700 bg-[#f9fafb] dark:bg-slate-800 overflow-hidden">
                                    <span className="flex items-center px-3.5 bg-slate-100 dark:bg-slate-700 border-r border-[#d0d5dd] dark:border-slate-700 text-xs font-semibold text-[#667085] dark:text-slate-400 select-none">
                                        {window.location.host}/
                                    </span>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={customizer.slug}
                                        onChange={(e) => setCustomizer(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
                                        className="w-full bg-transparent px-3 py-3 text-sm text-[#1a2231] dark:text-white outline-none"
                                        placeholder="shop-url-slug"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a2231] dark:bg-white text-white dark:text-[#1a2231] px-4 py-3 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
                                >
                                    {copied ? (
                                        <>
                                            <Check size={16} className="text-green-500 dark:text-green-600 animate-bounce" />
                                            Shop Link Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={16} />
                                            Copy Link to Share
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Card 2: Customization Properties */}
                        <div className="rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
                            <h3 className="text-base font-bold text-[#1a2231] dark:text-white mb-2 flex items-center gap-2">
                                <Palette size={18} className="text-[#98a2b3]" />
                                Design Customizer
                            </h3>

                            {/* Store Name & Description */}
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#344054] dark:text-slate-300 uppercase tracking-wider">
                                        Merchant Display Name
                                    </label>
                                    <input
                                        type="text"
                                        name="displayName"
                                        value={customizer.displayName}
                                        onChange={handleTextChange}
                                        className={inputClass}
                                        placeholder="e.g. My Cafe & Diner"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#344054] dark:text-slate-300 uppercase tracking-wider">
                                        Business Physical Address
                                    </label>
                                    <textarea
                                        name="businessAddress"
                                        value={customizer.businessAddress}
                                        onChange={handleTextChange}
                                        rows="2"
                                        className={inputClass + " resize-none"}
                                        placeholder="Add physical address..."
                                    ></textarea>
                                </div>
                            </div>

                            {/* Brand Color Presets */}
                            <div className="space-y-3 pt-2 border-t border-[#f2f4f7] dark:border-slate-800">
                                <label className="text-xs font-bold text-[#344054] dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                                    <span>Brand Color Theme</span>
                                    <span className="font-mono text-[11px] text-[#98a2b3]">{customizer.brandColor}</span>
                                </label>
                                
                                <div className="grid grid-cols-6 gap-2">
                                    {colorPresets.map((preset) => (
                                        <button
                                            key={preset.name}
                                            type="button"
                                            onClick={() => handleColorSelect(preset.hex)}
                                            className={`h-9 w-full rounded-xl transition transform hover:scale-105 active:scale-95 relative ${preset.bg} ${
                                                customizer.brandColor === preset.hex
                                                    ? "ring-4 ring-offset-2 ring-[#1a2231] dark:ring-offset-slate-900 dark:ring-white"
                                                    : "border border-black/10 dark:border-white/10"
                                            }`}
                                            title={preset.name}
                                        >
                                            {customizer.brandColor === preset.hex && (
                                                <Check size={14} className="absolute inset-0 m-auto text-white" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Hex Picker */}
                                <div className="mt-3 flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={customizer.brandColor}
                                        onChange={(e) => handleColorSelect(e.target.value)}
                                        className="h-10 w-12 cursor-pointer rounded-xl border border-[#d0d5dd] dark:border-slate-700 bg-transparent p-0.5"
                                    />
                                    <div className="relative flex-1">
                                        <span className="absolute inset-y-0 left-3 flex items-center text-sm font-semibold text-[#98a2b3]">#</span>
                                        <input
                                            type="text"
                                            value={customizer.brandColor.replace("#", "")}
                                            onChange={(e) => handleColorSelect("#" + e.target.value)}
                                            className="w-full rounded-xl border border-[#d0d5dd] dark:border-slate-700 bg-white dark:bg-slate-800 pl-7 pr-4 py-2.5 text-sm text-[#1a2231] dark:text-white outline-none"
                                            maxLength="7"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Theme Templates Selector */}
                            <div className="space-y-3 pt-4 border-t border-[#f2f4f7] dark:border-slate-800">
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
                                            className={`rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all capitalize hover:bg-slate-50 dark:hover:bg-slate-800 ${
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
                        </div>
                    </div>

                    {/* Right: Device Interactive Viewport (7 Columns) */}
                    <div className="lg:col-span-7 flex flex-col items-center">
                        
                        {/* Device Controller Toggle */}
                        <div className="mb-6 flex gap-2 rounded-xl bg-white border border-[#e4e7ec] dark:border-slate-800 p-1.5 shadow-sm dark:bg-slate-900">
                            {[
                                { id: "mobile", icon: <Smartphone size={16} />, label: "Mobile" },
                                { id: "tablet", icon: <TabletIcon size={16} />, label: "Tablet" },
                                { id: "desktop", icon: <Laptop size={16} />, label: "Desktop" },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setDevice(item.id)}
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                                        device === item.id
                                            ? "bg-[#1a2231] text-white shadow-sm dark:bg-white dark:text-[#1a2231]"
                                            : "text-[#667085] hover:text-[#1a2231] dark:text-slate-400 dark:hover:text-slate-200"
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* High-Fidelity Device Layout Frame */}
                        <div className="w-full flex justify-center items-center select-none overflow-hidden py-4">
                            
                            {/* Device Frame: MOBILE */}
                            {device === "mobile" && (
                                <div className="w-[335px] h-[585px] border-[6px] border-slate-950 dark:border-slate-800 rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] relative bg-white dark:bg-slate-950 flex flex-col transition-all duration-300 animate-in zoom-in-95 ring-1 ring-black/5">
                                    {/* Ultra-Thin Ear Speaker slot (iPhone 17 design) */}
                                    <div className="absolute top-[2.5px] left-1/2 -translate-x-1/2 h-[2px] w-12 bg-slate-800 dark:bg-slate-700 rounded-full z-50"></div>
                                    
                                    {/* Screen Content */}
                                    <div className={`flex-1 rounded-[42px] overflow-hidden flex flex-col h-full w-full ${
                                        themeMode === 'dark' ? 'bg-[#0f172a]' : themeMode === 'glass' ? 'bg-gradient-to-tr from-sky-100 via-rose-50 to-indigo-50' : 'bg-[#f9f9f9]'
                                    }`}>
                                        {/* Premium Status Bar with Integrated Dynamic Island */}
                                        <div className={`relative flex items-center justify-between px-5 pt-3.5 pb-2.5 select-none text-[10px] font-semibold tracking-tight ${
                                            themeMode === 'dark' ? 'bg-[#0f172a] text-slate-300 border-b border-slate-800/40' : themeMode === 'glass' ? 'bg-white/20 text-slate-800 border-b border-white/10' : 'bg-[#f9f9f9] text-slate-700 border-b border-slate-200/50'
                                        }`}>
                                            {/* Time */}
                                            <span className="z-10 font-bold">9:41</span>
                                            
                                            {/* iPhone 17 Futuristic Micro Dynamic Island */}
                                            <div className="absolute left-1/2 -translate-x-1/2 top-3 h-3.5 w-11 rounded-full bg-black dark:bg-slate-900 z-20 flex items-center justify-center gap-0.5 shadow-sm border border-white/5">
                                                <div className="h-1 w-1 rounded-full bg-[#1e293b] dark:bg-[#0f172a]"></div>
                                                <div className="h-0.5 w-0.5 rounded-full bg-emerald-500/80 animate-pulse"></div>
                                            </div>
                                            
                                            {/* Network & Battery */}
                                            <div className="flex items-center gap-1 z-10">
                                                <span>5G</span>
                                                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                                                    <path d="M12 21l-12-12c4.4-4.4 11.6-4.4 16 0l-4 4c-2.2-2.2-5.8-2.2-8 0l8 8z"/>
                                                </svg>
                                                <div className="w-4 h-2.5 border border-current rounded-sm p-0.5 flex items-center">
                                                    <div className="bg-current h-full w-full rounded-[1px]"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <iframe
                                            src={svelteAppUrl}
                                            className="w-full h-full border-none bg-transparent"
                                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                            title="Customer Shop Preview Mobile"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Device Frame: TABLET */}
                            {device === "tablet" && (
                                <div className="w-[580px] h-[550px] border-[12px] border-slate-950 dark:border-slate-800 rounded-[38px] shadow-2xl relative bg-white dark:bg-slate-950 flex flex-col transition-all duration-300 animate-in zoom-in-95">
                                    {/* Camera dot */}
                                    <div className="absolute top-[5px] left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-slate-800 z-50"></div>
                                    
                                    {/* Screen Content with Status Bar Spacer */}
                                    <div className={`flex-1 rounded-[24px] overflow-hidden flex flex-col h-full w-full pt-4 ${
                                        themeMode === 'dark' ? 'bg-[#0f172a]' : themeMode === 'glass' ? 'bg-gradient-to-tr from-sky-100 via-rose-50 to-indigo-50' : 'bg-[#f9f9f9]'
                                    }`}>
                                        {/* Premium Tablet Status Bar */}
                                        <div className={`flex items-center justify-between px-6 py-1 select-none text-[10px] font-bold ${
                                            themeMode === 'dark' ? 'bg-[#0f172a] text-slate-300 border-b border-slate-800/60' : themeMode === 'glass' ? 'bg-white/30 text-slate-700 border-b border-white/20' : 'bg-[#f9f9f9] text-slate-600 border-b border-slate-200/60'
                                        }`}>
                                            <span>iPad</span>
                                            <span>9:41 AM</span>
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                                                    <path d="M12 21l-12-12c4.4-4.4 11.6-4.4 16 0l-4 4c-2.2-2.2-5.8-2.2-8 0l8 8z"/>
                                                </svg>
                                                <span>100%</span>
                                            </div>
                                        </div>
                                        <iframe
                                            src={svelteAppUrl}
                                            className="w-full h-full border-none bg-transparent"
                                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                            title="Customer Shop Preview Tablet"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Device Frame: DESKTOP */}
                            {device === "desktop" && (
                                <div className="w-full max-w-[690px] h-[500px] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl bg-white dark:bg-slate-950 flex flex-col transition-all duration-300 overflow-hidden animate-in zoom-in-95">
                                    {/* Browser Title Bar */}
                                    <div className="bg-[#f2f4f7] dark:bg-slate-900 px-4 py-3 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                                        <div className="flex gap-1.5">
                                            <div className="h-3 w-3 rounded-full bg-[#f04438]"></div>
                                            <div className="h-3 w-3 rounded-full bg-[#f79009]"></div>
                                            <div className="h-3 w-3 rounded-full bg-[#12b76a]"></div>
                                        </div>
                                        <div className="flex-1 max-w-sm rounded-lg bg-white dark:bg-slate-800 px-3 py-1 text-center text-xs font-medium text-[#667085] dark:text-slate-400 border border-slate-200 dark:border-slate-700 truncate select-none">
                                            {window.location.host}/{customizer.slug}
                                        </div>
                                    </div>
                                    
                                    {/* Browser Content */}
                                    <div className="flex-1 overflow-hidden flex flex-col h-full w-full">
                                        <iframe
                                            src={svelteAppUrl}
                                            className="w-full h-full border-none bg-transparent"
                                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                            title="Customer Shop Preview Desktop"
                                        />
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>

            </div>
        </main>
    );
}

/* 
 * MOCK SHOPFRONT COMPONENT RENDERED WITHIN PREVIEW WINDOWS
 */
function MockShopfront({ customizer, themeMode, isDesktop = false }) {
    const brandColor = customizer.brandColor;

    // Apply color palette changes with fallback
    const themeBg = themeMode === "dark" 
        ? "bg-slate-950 text-slate-100" 
        : themeMode === "glass"
        ? "bg-gradient-to-tr from-sky-100 via-rose-50 to-indigo-50 text-slate-800"
        : "bg-[#f8fafc] text-slate-800";

    const headerBg = themeMode === "dark"
        ? "bg-slate-900 border-b border-slate-800"
        : themeMode === "glass"
        ? "bg-white/40 backdrop-blur-md border-b border-white/20"
        : "bg-white border-b border-slate-100";

    const cardBg = themeMode === "dark"
        ? "bg-slate-900 border border-slate-800"
        : themeMode === "glass"
        ? "bg-white/50 backdrop-blur-sm border border-white/30"
        : "bg-white border border-slate-100 shadow-sm";

    const textMuted = themeMode === "dark" ? "text-slate-400" : "text-[#667085]";
    const borderTheme = { borderColor: brandColor };
    const textTheme = { color: brandColor };
    const fillTheme = { backgroundColor: brandColor };

    const mockCategories = ["Popular", "Offers", "Mains", "Drinks"];
    const mockProducts = [
        { id: 1, name: "Premium Coffee", desc: "House blend espresso shot", price: "4.99", rating: 4.8 },
        { id: 2, name: "Chocolate Croissant", desc: "Warm, buttery with rich fudge core", price: "3.50", rating: 4.9 },
        { id: 3, name: "Fresh Berry Tart", desc: "Strawberries and cream pastries", price: "5.25", rating: 4.6 }
    ];

    return (
        <div className={`flex flex-col flex-1 h-full font-sans transition-all text-left ${themeBg}`}>
            
            {/* Store Top Banner */}
            <div className={`sticky top-0 z-10 py-3.5 px-4 flex items-center justify-between transition-all ${headerBg}`}>
                <div className="flex items-center gap-2">
                    <div 
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm"
                        style={fillTheme}
                    >
                        {customizer.displayName.charAt(0).toUpperCase() || "S"}
                    </div>
                    <span className="font-bold text-sm tracking-tight truncate max-w-[120px]">
                        {customizer.displayName || "My Shop"}
                    </span>
                </div>

                <div className="flex items-center gap-2.5">
                    <button className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                        <Search size={15} />
                    </button>
                    <button className="relative p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                        <ShoppingBag size={15} />
                        <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full" style={fillTheme}></span>
                    </button>
                </div>
            </div>

            {/* Banner Section */}
            <div className="px-4 py-6 text-center space-y-2 border-b border-black/5 dark:border-white/5 bg-gradient-to-b from-black/5 to-transparent relative overflow-hidden">
                <h2 className="text-lg font-extrabold tracking-tight md:text-xl">
                    {customizer.displayName || "My Shop"}
                </h2>
                <p className={`text-xs max-w-md mx-auto ${textMuted}`}>
                    {customizer.businessAddress || "New Bangalore Service Road, No: 1, Near Green Circle, NH 46 Service Rd, Vellore, Tamil Nadu 632004"}
                </p>
                <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Open & Accepting Orders
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 px-4 py-4 space-y-5">
                
                {/* Categories Row */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {mockCategories.map((cat, idx) => (
                        <span
                            key={cat}
                            className={`rounded-full px-3.5 py-1 text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                                idx === 0
                                    ? "text-white"
                                    : "bg-black/5 dark:bg-white/5 hover:bg-black/10"
                            }`}
                            style={idx === 0 ? fillTheme : null}
                        >
                            {cat}
                        </span>
                    ))}
                </div>

                {/* Product List Grid */}
                <div className={`grid gap-4 ${isDesktop ? "grid-cols-3" : "grid-cols-1"}`}>
                    {mockProducts.map((prod) => (
                        <div key={prod.id} className={`rounded-2xl p-4 flex flex-col justify-between transition-all ${cardBg}`}>
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-bold text-xs truncate">{prod.name}</h4>
                                    <div className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold">
                                        <Star size={10} fill="currentColor" />
                                        <span>{prod.rating}</span>
                                    </div>
                                </div>
                                <p className={`text-[10px] mt-1 line-clamp-2 ${textMuted}`}>{prod.desc}</p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/5 dark:border-white/5">
                                <span className="text-xs font-extrabold">${prod.price}</span>
                                <button
                                    type="button"
                                    className="rounded-lg px-2.5 py-1 text-[10px] font-bold text-white transition-all transform active:scale-95 shadow-sm"
                                    style={fillTheme}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Bottom Sticky Action Footer */}
            <div className={`mt-auto p-4 border-t border-black/5 dark:border-white/5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm`}>
                <button
                    type="button"
                    className="w-full rounded-xl py-2.5 text-xs font-bold text-white text-center transition-all shadow-md"
                    style={fillTheme}
                >
                    View Cart • $0.00
                </button>
            </div>

        </div>
    );
}

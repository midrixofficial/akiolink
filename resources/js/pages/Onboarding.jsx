import { useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, ArrowRight, Store, Check, Briefcase, MapPin } from "lucide-react";

const inputClass =
    "w-full rounded-xl border border-[#d0d5dd] bg-white px-4 py-3 text-sm text-[#1a2231] placeholder-[#98a2b3] outline-none transition focus:border-[#1a2231] focus:ring-2 focus:ring-[#1a2231]/10";

export default function Onboarding({ onNavigate }) {
    const [form, setForm] = useState({
        business_name: "",
        business_address: "",
        name: "", // Required by backend, we'll try to default it if empty, or just send empty and let backend fail if it does, wait backend requires it.
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Pre-fill if there's a stored brand name
        const tempBrandName = localStorage.getItem("akiolink_temp_brand_name");
        
        // Let's get the user name from localStorage so we can fulfill the 'name' requirement
        const userStr = localStorage.getItem("user");
        let userName = "Merchant";
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                userName = user.name || "Merchant";
            } catch (e) {}
        }
        
        setForm(prev => ({
            ...prev,
            business_name: tempBrandName || "",
            name: userName
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await axios.post("/api/merchant/update", form);
            if (typeof onNavigate === "function") {
                onNavigate("/merchant/dashboard");
            } else {
                window.location.href = "/merchant/dashboard";
            }
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Failed to save details. Please try again."
            );
            setLoading(false);
        }
    };

    const perks = [
        "Personalized store URL slug",
        "Automated QR code generation",
        "Instant digital storefront",
        "Ready to accept orders",
    ];

    return (
        <div className="flex min-h-screen bg-[#f4f6fb] font-[Space_Grotesk,ui-sans-serif,system-ui]">

            {/* ── Left Brand Panel ── */}
            <div className="hidden lg:flex lg:w-[46%] xl:w-[42%] flex-col justify-between bg-[#1a2231] p-10 relative overflow-hidden">

                {/* Background dots */}
                <div className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }}
                />

                {/* Decorative blobs */}
                <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

                {/* Logo */}
                <div className="relative flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white font-bold text-lg">
                        A
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">Akiolink</span>
                </div>

                {/* Center content */}
                <div className="relative space-y-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                        <Store size={28} className="text-white" />
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold text-white leading-snug">
                            Welcome aboard!<br />Let's set up your store.
                        </h2>
                        <p className="text-[#8fa0b8] text-sm leading-relaxed max-w-xs">
                            Tell us a little bit about your business so we can configure your digital storefront perfectly.
                        </p>
                    </div>

                    {/* Perks list */}
                    <ul className="space-y-3">
                        {perks.map((perk) => (
                            <li key={perk} className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                                    <Check size={11} className="text-emerald-400" />
                                </span>
                                <span className="text-sm text-white/75">{perk}</span>
                            </li>
                        ))}
                    </ul>

                </div>

                {/* Bottom */}
                <div className="relative text-xs text-[#8fa0b8]">
                    © {new Date().getFullYear()} Akiolink. All rights reserved.
                </div>
            </div>

            {/* ── Right Form Panel ── */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">

                {/* Mobile logo */}
                <div className="mb-8 flex items-center gap-2.5 lg:hidden">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a2231] text-white font-bold text-base">
                        A
                    </div>
                    <span className="text-lg font-bold text-[#1a2231]">Akiolink</span>
                </div>

                <div className="w-full max-w-md">
                    {/* Heading */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[#1a2231]">Business Profile</h1>
                        <p className="mt-1.5 text-sm text-[#667085]">
                            Just a few quick details to get your storefront ready.
                        </p>
                    </div>

                    {/* Form card */}
                    <div className="rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Business Name */}
                            <div>
                                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#344054]">
                                    <Briefcase size={16} className="text-[#98a2b3]" />
                                    Business Name <span className="text-[#f04438]">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="business_name"
                                    value={form.business_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Akiolink Coffee Shop"
                                    className={inputClass}
                                />
                            </div>

                            {/* Business Address */}
                            <div>
                                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#344054]">
                                    <MapPin size={16} className="text-[#98a2b3]" />
                                    Business Address <span className="text-[#98a2b3] font-normal text-xs">(Optional)</span>
                                </label>
                                <textarea
                                    name="business_address"
                                    value={form.business_address}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Enter your store address"
                                    className={inputClass + " resize-none"}
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-start gap-2.5 rounded-xl border border-[#fda29b] bg-[#fef3f2] p-3.5">
                                    <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-[#f04438]" />
                                    <p className="text-sm font-medium text-[#b42318]">{error}</p>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a2231] px-5 py-3 text-sm font-semibold text-white hover:bg-[#344054] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                {loading ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        Continue to Dashboard
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

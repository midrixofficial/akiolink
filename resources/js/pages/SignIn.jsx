import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, AlertCircle, ArrowRight, Store } from "lucide-react";

const inputClass =
    "w-full rounded-xl border border-[#d0d5dd] bg-white px-4 py-3 text-sm text-[#1a2231] placeholder-[#98a2b3] outline-none transition focus:border-[#1a2231] focus:ring-2 focus:ring-[#1a2231]/10";

export default function SignIn({ onNavigate }) {
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const { data } = await axios.post("/api/auth/signin", form);
            localStorage.setItem("auth_token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
            if (typeof onNavigate === "function") {
                onNavigate("/merchant/dashboard");
            } else {
                window.location.href = "/merchant/dashboard";
            }
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.errors?.email?.[0] ||
                "Invalid email or password."
            );
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f4f6fb] font-[Space_Grotesk,ui-sans-serif,system-ui]">

            {/* ── Left Brand Panel ── */}
            <div className="hidden lg:flex lg:w-[46%] xl:w-[42%] flex-col justify-between bg-[#1a2231] p-10 relative overflow-hidden">

                {/* Background pattern dots */}
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
                    {/* Icon */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                        <Store size={28} className="text-white" />
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold text-white leading-snug">
                            Manage your store<br />with confidence.
                        </h2>
                        <p className="text-[#8fa0b8] text-sm leading-relaxed max-w-xs">
                            Track orders, manage products and categories, monitor sales — all from one clean dashboard.
                        </p>
                    </div>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-2">
                        {["Order Tracking", "Product Management", "Sales Overview", "Category Control"].map((f) => (
                            <span key={f} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70">
                                {f}
                            </span>
                        ))}
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Total Orders", value: "1,245" },
                            { label: "Revenue", value: "₹45.2K" },
                        ].map((s) => (
                            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <p className="text-xs text-[#8fa0b8]">{s.label}</p>
                                <p className="mt-1 text-xl font-bold text-white">{s.value}</p>
                            </div>
                        ))}
                    </div>
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
                        <h1 className="text-2xl font-bold text-[#1a2231]">Welcome back</h1>
                        <p className="mt-1.5 text-sm text-[#667085]">
                            Sign in to your merchant account to continue.
                        </p>
                    </div>

                    {/* Form card */}
                    <div className="rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Email */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[#344054]">
                                    Email address <span className="text-[#f04438]">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com"
                                    className={inputClass}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <label className="text-sm font-medium text-[#344054]">
                                        Password <span className="text-[#f04438]">*</span>
                                    </label>
                                    <a href="#" className="text-xs font-medium text-[#1a2231] hover:underline">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your password"
                                        className={inputClass + " pr-11"}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98a2b3] hover:text-[#667085] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
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
                                className="mt-1 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a2231] px-5 py-3 text-sm font-semibold text-white hover:bg-[#344054] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                {loading ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer link */}
                    <p className="mt-5 text-center text-sm text-[#667085]">
                        Don't have an account?{" "}
                        <a href="/merchant/signup" className="font-semibold text-[#1a2231] hover:underline">
                            Create account
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

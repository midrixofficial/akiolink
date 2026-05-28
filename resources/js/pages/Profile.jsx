import { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, ShieldCheck, AlertCircle, Save, ArrowLeft, Lock } from "lucide-react";

const inputClass =
    "w-full rounded-xl border border-[#d0d5dd] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-[#1a2231] dark:text-white placeholder-[#98a2b3] outline-none transition focus:border-[#1a2231] focus:ring-2 focus:ring-[#1a2231]/10 dark:focus:border-slate-400";

function FormField({ label, icon: Icon, children, hint }) {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-[#344054] dark:text-slate-300">
                {Icon && <Icon size={16} className="text-[#98a2b3]" />}
                {label}
            </label>
            {children}
            {hint && <p className="text-xs text-[#98a2b3] dark:text-slate-500">{hint}</p>}
        </div>
    );
}

export default function Profile({ onNavigate, setUser }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [passwordForm, setPasswordForm] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get("/api/auth/me");
            setForm({
                name: data.user.name || "",
                email: data.user.email || "",
                mobile: data.user.mobile || "",
            });
        } catch (error) {
            setMessage({ type: "error", text: "Failed to load profile data." });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const { data } = await axios.post("/api/auth/profile/update", form);
            setMessage({ type: "success", text: "Profile updated successfully!" });
            
            const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
            const updatedUser = { ...savedUser, ...data.user };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            
            if (typeof setUser === "function") {
                setUser(updatedUser);
            }
            
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            setMessage({
                type: "error",
                text: error?.response?.data?.message || "Failed to update profile. Please try again.",
            });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordSaving(true);
        setPasswordMessage({ type: "", text: "" });

        try {
            await axios.post("/api/auth/profile/password", passwordForm);
            setPasswordMessage({ type: "success", text: "Password updated successfully!" });
            setPasswordForm({ current_password: "", password: "", password_confirmation: "" });
            setTimeout(() => setPasswordMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            setPasswordMessage({
                type: "error",
                text: error?.response?.data?.message || "Failed to update password. Please check your inputs.",
            });
        } finally {
            setPasswordSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a2231]/10 border-t-[#1a2231]"></div>
            </div>
        );
    }

    return (
        <main className="p-5 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-4xl">
                
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a2231] dark:text-white">Profile Settings</h1>
                        <p className="mt-1 text-sm text-[#667085] dark:text-slate-400">
                            Update your personal information and contact details.
                        </p>
                    </div>
                    <button
                        onClick={() => onNavigate?.("/merchant/dashboard")}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#e4e7ec] bg-white px-4 py-2 text-sm font-medium text-[#667085] hover:bg-[#f9fafb] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    
                    {/* Left: Avatar Card */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#f4f6fb] text-3xl font-bold text-[#1a2231] dark:bg-white/10 dark:text-white ring-4 ring-[#f4f6fb] dark:ring-white/5">
                                        {form.name.charAt(0).toUpperCase() || "A"}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#12b76a] text-white ring-4 ring-white dark:ring-slate-900">
                                        <ShieldCheck size={18} />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-[#1a2231] dark:text-white">{form.name}</h3>
                                <p className="text-sm text-[#98a2b3]">{form.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form Sections */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Info Form */}
                        <div className="rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h3 className="text-lg font-bold text-[#1a2231] dark:text-white mb-6">Personal Information</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <FormField label="Full Name" icon={User} hint="Your legal name as it appears on documents.">
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter your full name"
                                                className={inputClass}
                                            />
                                        </FormField>
                                    </div>

                                    <FormField label="Email Address" icon={Mail}>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            disabled
                                            className={inputClass + " bg-[#f9fafb] cursor-not-allowed opacity-75 dark:bg-slate-800/50"}
                                        />
                                    </FormField>

                                    <FormField label="Mobile Number" icon={Phone}>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={form.mobile}
                                            onChange={handleChange}
                                            placeholder="+91 98765 43210"
                                            className={inputClass}
                                        />
                                    </FormField>
                                </div>

                                {message.text && (
                                    <div className={`flex items-start gap-3 rounded-xl border p-4 ${
                                        message.type === "success" 
                                            ? "border-[#d1fadf] bg-[#ecfdf3] text-[#027a48] dark:border-green-900/50 dark:bg-green-950/20"
                                            : "border-[#fda29b] bg-[#fef3f2] text-[#b42318] dark:border-red-900/50 dark:bg-red-950/20"
                                    }`}>
                                        <ShieldCheck size={18} className="mt-0.5" />
                                        <p className="text-sm font-medium">{message.text}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-end border-t border-[#f2f4f7] pt-6 dark:border-slate-800">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#1a2231] px-8 py-3 text-sm font-semibold text-white hover:bg-[#344054] disabled:opacity-60 transition-all shadow-sm dark:bg-white dark:text-[#1a2231] dark:hover:bg-[#f2f4f7]"
                                    >
                                        {saving ? "Saving..." : "Update Profile"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Change Password Form */}
                        <div className="rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h3 className="text-lg font-bold text-[#1a2231] dark:text-white mb-6">Change Password</h3>
                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <FormField label="Current Password" icon={Lock}>
                                        <input
                                            type="password"
                                            name="current_password"
                                            value={passwordForm.current_password}
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="••••••••"
                                            className={inputClass}
                                        />
                                    </FormField>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <FormField label="New Password" icon={Lock}>
                                            <input
                                                type="password"
                                                name="password"
                                                value={passwordForm.password}
                                                onChange={handlePasswordChange}
                                                required
                                                placeholder="••••••••"
                                                className={inputClass}
                                            />
                                        </FormField>
                                        <FormField label="Confirm New Password" icon={Lock}>
                                            <input
                                                type="password"
                                                name="password_confirmation"
                                                value={passwordForm.password_confirmation}
                                                onChange={handlePasswordChange}
                                                required
                                                placeholder="••••••••"
                                                className={inputClass}
                                            />
                                        </FormField>
                                    </div>
                                </div>

                                {passwordMessage.text && (
                                    <div className={`flex items-start gap-3 rounded-xl border p-4 ${
                                        passwordMessage.type === "success" 
                                            ? "border-[#d1fadf] bg-[#ecfdf3] text-[#027a48] dark:border-green-900/50 dark:bg-green-950/20"
                                            : "border-[#fda29b] bg-[#fef3f2] text-[#b42318] dark:border-red-900/50 dark:bg-red-950/20"
                                    }`}>
                                        <AlertCircle size={18} className="mt-0.5" />
                                        <p className="text-sm font-medium">{passwordMessage.text}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-end border-t border-[#f2f4f7] pt-6 dark:border-slate-800">
                                    <button
                                        type="submit"
                                        disabled={passwordSaving}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#1a2231] px-8 py-3 text-sm font-semibold text-white hover:bg-[#344054] disabled:opacity-60 transition-all shadow-sm dark:bg-white dark:text-[#1a2231] dark:hover:bg-[#f2f4f7]"
                                    >
                                        {passwordSaving ? "Updating..." : "Change Password"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}

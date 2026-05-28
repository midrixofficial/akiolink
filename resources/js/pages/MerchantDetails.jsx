import { useState, useEffect } from "react";
import axios from "axios";
import { 
    User, 
    Mail, 
    Phone, 
    Store, 
    Briefcase, 
    MapPin, 
    ShieldCheck, 
    ArrowLeft, 
    Save, 
    AlertCircle 
} from "lucide-react";

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

export default function MerchantDetails({ onNavigate }) {
    const [form, setForm] = useState({
        name: "",
        business_name: "",
        business_mobile: "",
        business_email: "",
        business_address: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchMerchantDetails();
    }, []);

    const fetchMerchantDetails = async () => {
        try {
            const { data } = await axios.get("/api/merchant");
            const tempBrandName = localStorage.getItem("akiolink_temp_brand_name");
            if (data.merchant) {
                setForm({
                    name: data.merchant.name || "",
                    business_name: data.merchant.business_name || tempBrandName || "",
                    business_mobile: data.merchant.business_mobile || "",
                    business_email: data.merchant.business_email || "",
                    business_address: data.merchant.business_address || "",
                });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to load merchant details." });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            await axios.post("/api/merchant/update", form);
            setMessage({ type: "success", text: "Merchant details updated successfully!" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            setMessage({
                type: "error",
                text: error?.response?.data?.message || "Failed to update details. Please try again.",
            });
        } finally {
            setSaving(false);
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
                        <h1 className="text-2xl font-bold text-[#1a2231] dark:text-white">Merchant Details</h1>
                        <p className="mt-1 text-sm text-[#667085] dark:text-slate-400">
                            Manage your business information and public profile.
                        </p>
                    </div>
                    <button
                        onClick={() => onNavigate?.("/merchant/dashboard")}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#e4e7ec] bg-white px-4 py-2 text-sm font-medium text-[#667085] hover:bg-[#f9fafb] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    
                    {/* Left: Store Card */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#f4f6fb] text-3xl font-bold text-[#1a2231] dark:bg-white/10 dark:text-white ring-4 ring-[#f4f6fb] dark:ring-white/5">
                                        <Store size={40} className="text-[#1a2231] dark:text-white" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#12b76a] text-white ring-4 ring-white dark:ring-slate-900">
                                        <ShieldCheck size={18} />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-[#1a2231] dark:text-white">
                                    {form.business_name || "My Business"}
                                </h3>
                                <p className="text-sm text-[#98a2b3]">{form.business_email || "No email set"}</p>
                            </div>

                            <div className="mt-8 space-y-4 border-t border-[#f2f4f7] pt-6 dark:border-slate-800">
                                <div className="flex items-center gap-3 text-sm text-[#667085] dark:text-slate-400">
                                    <Phone size={16} className="text-[#98a2b3]" />
                                    <span>{form.business_mobile || "Not set"}</span>
                                </div>
                                <div className="flex items-start gap-3 text-sm text-[#667085] dark:text-slate-400">
                                    <MapPin size={16} className="mt-0.5 text-[#98a2b3]" />
                                    <span className="leading-relaxed">{form.business_address || "No address added yet"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form Sections */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h3 className="text-lg font-bold text-[#1a2231] dark:text-white mb-6">Business Information</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <FormField label="Merchant Name / Contact Person" icon={User} hint="The primary contact name for this merchant.">
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter contact name"
                                                className={inputClass}
                                            />
                                        </FormField>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <FormField label="Business Name" icon={Briefcase}>
                                            <input
                                                type="text"
                                                name="business_name"
                                                value={form.business_name}
                                                onChange={handleChange}
                                                required
                                                placeholder="e.g. Akiolink Solutions"
                                                className={inputClass}
                                            />
                                        </FormField>
                                    </div>

                                    <FormField label="Business Email" icon={Mail}>
                                        <input
                                            type="email"
                                            name="business_email"
                                            value={form.business_email}
                                            onChange={handleChange}
                                            placeholder="business@example.com"
                                            className={inputClass}
                                        />
                                    </FormField>

                                    <FormField label="Business Mobile" icon={Phone}>
                                        <input
                                            type="tel"
                                            name="business_mobile"
                                            value={form.business_mobile}
                                            onChange={handleChange}
                                            placeholder="+91 98765 43210"
                                            className={inputClass}
                                        />
                                    </FormField>

                                    <div className="sm:col-span-2">
                                        <FormField label="Business Address" icon={MapPin}>
                                            <textarea
                                                name="business_address"
                                                value={form.business_address}
                                                onChange={handleChange}
                                                rows="3"
                                                placeholder="Enter full business address"
                                                className={inputClass + " resize-none"}
                                            ></textarea>
                                        </FormField>
                                    </div>
                                </div>

                                {message.text && (
                                    <div className={`flex items-start gap-3 rounded-xl border p-4 ${
                                        message.type === "success" 
                                            ? "border-[#d1fadf] bg-[#ecfdf3] text-[#027a48] dark:border-green-900/50 dark:bg-green-950/20"
                                            : "border-[#fda29b] bg-[#fef3f2] text-[#b42318] dark:border-red-900/50 dark:bg-red-950/20"
                                    }`}>
                                        <AlertCircle size={18} className="mt-0.5" />
                                        <p className="text-sm font-medium">{message.text}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-end border-t border-[#f2f4f7] pt-6 dark:border-slate-800">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#1a2231] px-8 py-3 text-sm font-semibold text-white hover:bg-[#344054] disabled:opacity-60 transition-all shadow-sm dark:bg-white dark:text-[#1a2231] dark:hover:bg-[#f2f4f7]"
                                    >
                                        {saving ? "Saving..." : (
                                            <>
                                                <Save size={16} />
                                                Update Merchant Details
                                            </>
                                        )}
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

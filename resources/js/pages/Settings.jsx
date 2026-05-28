import { useState, useEffect } from "react";
import axios from "axios";
import {
    Settings as SettingsIcon,
    Globe,
    ToggleLeft,
    Clock,
    DollarSign,
    Percent,
    Shield,
    ArrowLeft,
    Save,
    AlertCircle,
    CheckCircle,
    Store,
    Activity,
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

export default function Settings({ onNavigate }) {
    const [activeTab, setActiveTab] = useState("general");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [form, setForm] = useState({
        name: "",
        business_name: "",
        business_mobile: "",
        business_email: "",
        business_address: "",
        store_status: "open",
        auto_accept: true,
        prep_time: 30,
        currency: "INR",
        tax_rate: 0,
        min_order_value: 0,
        delivery_charge: 0,
        timezone: "Asia/Kolkata",
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await axios.get("/api/merchant");
            if (data.merchant) {
                setForm({
                    name: data.merchant.name || "",
                    business_name: data.merchant.business_name || "",
                    business_mobile: data.merchant.business_mobile || "",
                    business_email: data.merchant.business_email || "",
                    business_address: data.merchant.business_address || "",
                    store_status: data.merchant.store_status || "open",
                    auto_accept: data.merchant.auto_accept !== undefined ? Boolean(data.merchant.auto_accept) : true,
                    prep_time: Number(data.merchant.prep_time ?? 30),
                    currency: data.merchant.currency || "INR",
                    tax_rate: Number(data.merchant.tax_rate ?? 0),
                    min_order_value: Number(data.merchant.min_order_value ?? 0),
                    delivery_charge: Number(data.merchant.delivery_charge ?? 0),
                    timezone: data.merchant.timezone || "Asia/Kolkata",
                });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to load store settings." });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            await axios.post("/api/merchant/update", {
                ...form,
                auto_accept: form.auto_accept ? 1 : 0, // Cast to integer for database boolean field compatibility
            });
            setMessage({ type: "success", text: "General settings updated successfully!" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            setMessage({
                type: "error",
                text: error?.response?.data?.message || "Failed to update settings. Please try again.",
            });
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: "general", label: "Store Details", icon: <Store size={16} /> },
        { id: "operations", label: "Operations", icon: <Activity size={16} /> },
        { id: "localization", label: "Localization & Tax", icon: <Globe size={16} /> },
    ];

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
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a2231] dark:text-white">Store Settings</h1>
                        <p className="mt-1 text-sm text-[#667085] dark:text-slate-400">
                            Configure your store's operational status, finance configurations, and general details.
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

                <div className="rounded-2xl border border-[#e4e7ec] bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                    {/* Tabs navigation */}
                    <div className="flex border-b border-[#f2f4f7] dark:border-slate-800 overflow-x-auto bg-[#f9fafb] dark:bg-slate-900/60 p-2 gap-1.5">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? "bg-white text-[#1a2231] shadow-sm dark:bg-slate-800 dark:text-white"
                                        : "text-[#667085] hover:text-[#1a2231] dark:text-slate-400 dark:hover:text-slate-200"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        
                        {/* Tab Content: General Details */}
                        {activeTab === "general" && (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <h3 className="text-base font-bold text-[#1a2231] dark:text-white">General Information</h3>
                                    <p className="text-xs text-[#98a2b3] dark:text-slate-500 mt-0.5">Basic contact details for the merchant store.</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <FormField label="Store Name / Business Name">
                                        <input
                                            type="text"
                                            name="business_name"
                                            value={form.business_name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your store name"
                                            className={inputClass}
                                        />
                                    </FormField>
                                </div>
                                <FormField label="Contact Person / Owner">
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Owner name"
                                        className={inputClass}
                                    />
                                </FormField>
                                <FormField label="Support Email">
                                    <input
                                        type="email"
                                        name="business_email"
                                        value={form.business_email}
                                        onChange={handleChange}
                                        placeholder="support@store.com"
                                        className={inputClass}
                                    />
                                </FormField>
                                <FormField label="Support Mobile">
                                    <input
                                        type="tel"
                                        name="business_mobile"
                                        value={form.business_mobile}
                                        onChange={handleChange}
                                        required
                                        placeholder="Store phone number"
                                        className={inputClass}
                                    />
                                </FormField>
                                <div className="sm:col-span-2">
                                    <FormField label="Store Address">
                                        <textarea
                                            name="business_address"
                                            value={form.business_address}
                                            onChange={handleChange}
                                            rows="3"
                                            placeholder="Physical address"
                                            className={inputClass + " resize-none"}
                                        ></textarea>
                                    </FormField>
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Operations */}
                        {activeTab === "operations" && (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <h3 className="text-base font-bold text-[#1a2231] dark:text-white">Store Operations</h3>
                                    <p className="text-xs text-[#98a2b3] dark:text-slate-500 mt-0.5">Control live operational configurations and status.</p>
                                </div>

                                <FormField label="Store Operational Status" icon={Activity} hint="Open allows customers to place orders immediately.">
                                    <select
                                        name="store_status"
                                        value={form.store_status}
                                        onChange={handleChange}
                                        className={inputClass}
                                    >
                                        <option value="open">🟢 Open (Active)</option>
                                        <option value="closed">🔴 Closed (Taking no orders)</option>
                                    </select>
                                </FormField>

                                <FormField label="Avg. Order Prep Time" icon={Clock} hint="Estimated preparation duration for orders.">
                                    <select
                                        name="prep_time"
                                        value={form.prep_time}
                                        onChange={handleChange}
                                        className={inputClass}
                                    >
                                        <option value="15">15 Minutes</option>
                                        <option value="30">30 Minutes</option>
                                        <option value="45">45 Minutes</option>
                                        <option value="60">60 Minutes</option>
                                    </select>
                                </FormField>

                                <div className="sm:col-span-2 rounded-xl border border-[#e4e7ec] dark:border-slate-800 p-4 bg-[#f9fafb] dark:bg-slate-800/40">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <h4 className="text-sm font-semibold text-[#1a2231] dark:text-white">Order Auto-Acceptance</h4>
                                            <p className="text-xs text-[#667085] dark:text-slate-400">
                                                When enabled, new incoming orders will be automatically approved by the system.
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="auto_accept"
                                                checked={form.auto_accept}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#12b76a]"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Localization */}
                        {activeTab === "localization" && (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <h3 className="text-base font-bold text-[#1a2231] dark:text-white">Localization & Taxation</h3>
                                    <p className="text-xs text-[#98a2b3] dark:text-slate-500 mt-0.5">Financial values, currency, and local regional settings.</p>
                                </div>

                                <FormField label="Store Currency" icon={DollarSign}>
                                    <select
                                        name="currency"
                                        value={form.currency}
                                        onChange={handleChange}
                                        className={inputClass}
                                    >
                                        <option value="INR">INR (₹) Rupees</option>
                                        <option value="USD">USD ($) Dollars</option>
                                        <option value="EUR">EUR (€) Euros</option>
                                        <option value="GBP">GBP (£) Pounds</option>
                                    </select>
                                </FormField>

                                <FormField label="Default Timezone" icon={Globe}>
                                    <select
                                        name="timezone"
                                        value={form.timezone}
                                        onChange={handleChange}
                                        className={inputClass}
                                    >
                                        <option value="Asia/Kolkata">India (IST) - Asia/Kolkata</option>
                                        <option value="UTC">Universal Time Coordinated (UTC)</option>
                                        <option value="America/New_York">New York (EST) - America/New_York</option>
                                        <option value="Europe/London">London (GMT) - Europe/London</option>
                                    </select>
                                </FormField>

                                <FormField label="Tax / GST Rate (%)" icon={Percent}>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        name="tax_rate"
                                        value={form.tax_rate}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="0.00"
                                    />
                                </FormField>

                                <FormField label={`Minimum Order Value (${form.currency === 'INR' ? '₹' : form.currency === 'USD' ? '$' : form.currency === 'EUR' ? '€' : '£'})`}>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="min_order_value"
                                        value={form.min_order_value}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="0.00"
                                    />
                                </FormField>

                                <FormField label={`Flat Delivery Fee (${form.currency === 'INR' ? '₹' : form.currency === 'USD' ? '$' : form.currency === 'EUR' ? '€' : '£'})`}>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="delivery_charge"
                                        value={form.delivery_charge}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="0.00"
                                    />
                                </FormField>
                            </div>
                        )}

                        {/* Status Message */}
                        {message.text && (
                            <div className={`flex items-start gap-3 rounded-xl border p-4 ${
                                message.type === "success" 
                                    ? "border-[#d1fadf] bg-[#ecfdf3] text-[#027a48] dark:border-green-900/50 dark:bg-green-950/20"
                                    : "border-[#fda29b] bg-[#fef3f2] text-[#b42318] dark:border-red-900/50 dark:bg-red-950/20"
                            }`}>
                                {message.type === "success" ? <CheckCircle size={18} className="mt-0.5" /> : <AlertCircle size={18} className="mt-0.5" />}
                                <p className="text-sm font-medium">{message.text}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex items-center justify-end border-t border-[#f2f4f7] pt-6 dark:border-slate-800">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#1a2231] px-8 py-3 text-sm font-semibold text-white hover:bg-[#344054] disabled:opacity-60 transition-all shadow-sm dark:bg-white dark:text-[#1a2231] dark:hover:bg-[#f2f4f7]"
                            >
                                {saving ? "Saving..." : (
                                    <>
                                        <Save size={16} />
                                        Save All Settings
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

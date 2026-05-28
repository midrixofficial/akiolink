import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowLeft, Upload, AlertCircle } from "lucide-react";

const initialForm = {
    name: "",
    description: "",
    image: null,
};

const inputClass =
    "w-full rounded-xl border border-[#d0d5dd] dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-[#1a2231] dark:text-white placeholder-[#98a2b3] outline-none transition focus:border-[#1a2231] focus:ring-2 focus:ring-[#1a2231]/10 dark:focus:border-slate-400";

function FormField({ label, required, hint, children }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-[#344054] dark:text-slate-300">
                {label}
                {required && <span className="ml-1 text-[#f04438]">*</span>}
            </label>
            {children}
            {hint && <p className="mt-1 text-xs text-[#98a2b3] dark:text-slate-500">{hint}</p>}
        </div>
    );
}

function CategoryForm({ mode = "create", categoryId = null, onNavigate }) {
    const isEdit = useMemo(() => mode === "edit", [mode]);

    const [form, setForm] = useState(initialForm);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(isEdit);
    const [errorMessage, setErrorMessage] = useState("");
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (isEdit && categoryId) {
            fetchCategory();
        }
    }, [isEdit, categoryId]);

    const fetchCategory = async () => {
        try {
            const { data } = await axios.get(`/api/categories/${categoryId}`);
            setForm({
                name: data.name || "",
                description: data.description || "",
                image: null,
            });
            setPreviewUrl(data.image_url || null);
        } catch (error) {
            setErrorMessage("Failed to load category details.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name === "image") {
            const file = files?.[0] ?? null;
            setForm((prev) => ({ ...prev, image: file }));
            if (file) {
                setPreviewUrl(URL.createObjectURL(file));
            }
            return;
        }
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setErrorMessage("");

        const payload = new FormData();
        payload.append("name", form.name);
        payload.append("description", form.description);
        if (form.image) payload.append("image", form.image);

        try {
            if (isEdit) {
                payload.append("_method", "PUT");
                await axios.post(`/api/categories/${categoryId}`, payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await axios.post("/api/categories", payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            onNavigate?.("/merchant/category");
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Failed to save category. Please check the form and try again.";
            setErrorMessage(message);
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="p-5 sm:p-6">
                <div className="w-full">
                    <div className="flex items-center justify-center py-16 text-sm text-[#98a2b3]">Loading category...</div>
                </div>
            </main>
        );
    }

    return (
        <main className="p-5 sm:p-6">
            <div className="w-full">
                <div className="rounded-2xl border border-[#e4e7ec] bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#f2f4f7] dark:border-slate-800">
                        <div>
                            <h3 className="text-base font-semibold text-[#1a2231] dark:text-white">
                                {isEdit ? "Edit Category" : "Add New Category"}
                            </h3>
                            <p className="text-xs text-[#98a2b3] dark:text-slate-500 mt-0.5">
                                {isEdit ? "Update category details" : "Fill in the details to create a new category"}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigate?.("/merchant/category")}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#e4e7ec] dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-medium text-[#667085] dark:text-slate-300 hover:bg-[#f2f4f7] dark:hover:bg-slate-700 transition-colors"
                        >
                            <ArrowLeft size={14} />
                            Back
                        </button>
                    </div>

                    <form className="p-5 space-y-4" onSubmit={handleSubmit}>
                        <FormField label="Category Name" required>
                            <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
                        </FormField>

                        <FormField label="Description" hint="Optional – briefly describe this category">
                            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass + " resize-none"} />
                        </FormField>

                        <FormField label="Category Image" hint="Recommended: square image, max 2MB">
                            <div className="mt-0.5">
                                {previewUrl ? (
                                    <div className="relative mb-3 inline-block">
                                        <img src={previewUrl} alt="Preview" className="h-24 w-24 rounded-xl object-cover border border-[#e4e7ec] dark:border-slate-700 shadow-sm" />
                                    </div>
                                ) : null}

                                <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-[#d0d5dd] dark:border-slate-700 bg-[#f9fafb] dark:bg-slate-800 px-4 py-4 text-sm text-[#667085] dark:text-slate-400 hover:border-[#98a2b3] dark:hover:border-slate-500 hover:bg-[#f2f4f7] dark:hover:bg-slate-700/60 transition-colors">
                                    <Upload size={18} className="flex-shrink-0 text-[#98a2b3]" />
                                    <span>{previewUrl ? "Change image" : "Click to upload or drag and drop"}</span>
                                    <input type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
                                </label>
                            </div>
                        </FormField>

                        {errorMessage && (
                            <div className="flex items-start gap-2.5 rounded-xl border border-[#fda29b] bg-[#fef3f2] dark:border-red-900/50 dark:bg-red-950/20 p-3.5">
                                <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-[#f04438]" />
                                <p className="text-sm font-medium text-[#b42318] dark:text-red-400">{errorMessage}</p>
                            </div>
                        )}

                        <div className="flex items-center gap-3 pt-1">
                            <button type="submit" disabled={saving} className="rounded-xl bg-[#1a2231] dark:bg-white px-5 py-2.5 text-sm font-semibold text-white dark:text-[#1a2231] hover:bg-[#344054] dark:hover:bg-[#f2f4f7] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm">
                                {saving ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
                            </button>
                            <button type="button" onClick={() => onNavigate?.("/merchant/category")} className="rounded-xl border border-[#e4e7ec] dark:border-slate-700 px-5 py-2.5 text-sm font-medium text-[#667085] dark:text-slate-300 hover:bg-[#f2f4f7] dark:hover:bg-slate-800 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default CategoryForm;

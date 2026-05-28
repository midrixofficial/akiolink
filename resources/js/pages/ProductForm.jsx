import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowLeft, AlertCircle } from "lucide-react";

const initialForm = {
    category_id: "",
    name: "",
    type: "",
    unit: "",
    price: "",
    stock_quantity: "0",
};

function FormField({ label, children, required }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-[#344054] dark:text-slate-300">
                {label}
                {required && <span className="ml-1 text-[#f04438]">*</span>}
            </label>
            {children}
        </div>
    );
}

const inputClass =
    "w-full rounded-xl border border-[#d0d5dd] dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-[#1a2231] dark:text-white placeholder-[#98a2b3] outline-none transition focus:border-[#1a2231] focus:ring-2 focus:ring-[#1a2231]/10 dark:focus:border-slate-400";

function ProductForm({ mode = "create", productId = null, onNavigate }) {
    const [form, setForm] = useState(initialForm);
    const [categories, setCategories] = useState([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(mode === "edit");
    const [errorMessage, setErrorMessage] = useState("");

    const isEdit = useMemo(() => mode === "edit", [mode]);

    useEffect(() => {
        fetchCategories();
        if (isEdit && productId) fetchProduct();
    }, [isEdit, productId]);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get("/api/categories");
            setCategories(data);
        } catch (error) {
            console.error("Failed to load categories", error);
        }
    };

    const fetchProduct = async () => {
        try {
            const { data } = await axios.get(`/api/products/${productId}`);
            setForm({
                category_id: String(data.category_id || ""),
                name: data.name || "",
                type: data.type || "",
                unit: data.unit || "",
                price: data.price || "",
                stock_quantity: String(data.stock_quantity ?? data.stock ?? 0),
            });
        } catch (error) {
            console.error("Failed to load product", error);
            setErrorMessage("Failed to load product data.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setErrorMessage("");

        try {
            if (isEdit) {
                await axios.put(`/api/products/${productId}`, form);
            } else {
                await axios.post("/api/products", form);
            }
            onNavigate?.("/merchant/product");
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to save product.";
            setErrorMessage(message);
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="p-5 sm:p-6">
                <div className="w-full">
                    <div className="flex items-center justify-center py-16 text-sm text-[#98a2b3]">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#e4e7ec] border-t-[#1a2231] mr-2" />
                        Loading product...
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="p-5 sm:p-6">
            <div className="w-full">
                <div className="rounded-2xl border border-[#e4e7ec] bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">

                    {/* Card Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#f2f4f7] dark:border-slate-800">
                        <div>
                            <h3 className="text-base font-semibold text-[#1a2231] dark:text-white">
                                {isEdit ? "Edit Product" : "Add New Product"}
                            </h3>
                            <p className="text-xs text-[#98a2b3] dark:text-slate-500 mt-0.5">
                                {isEdit ? "Update the product details below" : "Fill in the details to add a new product"}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigate?.("/merchant/product")}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#e4e7ec] dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-medium text-[#667085] dark:text-slate-300 hover:bg-[#f2f4f7] dark:hover:bg-slate-700 transition-colors"
                        >
                            <ArrowLeft size={14} />
                            Back
                        </button>
                    </div>

                    {/* Form Body */}
                    <form className="p-5 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                        <FormField label="Category" required>
                            <select
                                name="category_id"
                                value={form.category_id}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            >
                                <option value="">Select category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </FormField>

                        <FormField label="Product Name" required>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Chicken Burger"
                                className={inputClass}
                            />
                        </FormField>

                        <FormField label="Type" required>
                            <input
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Veg, Non-Veg"
                                className={inputClass}
                            />
                        </FormField>

                        <FormField label="Unit" required>
                            <input
                                name="unit"
                                value={form.unit}
                                onChange={handleChange}
                                required
                                placeholder="e.g. piece, kg, litre"
                                className={inputClass}
                            />
                        </FormField>

                        <FormField label="Price (₹)" required>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                required
                                placeholder="0.00"
                                className={inputClass}
                            />
                        </FormField>

                        <FormField label="Stock Quantity" required>
                            <input
                                type="number"
                                min="0"
                                name="stock_quantity"
                                value={form.stock_quantity}
                                onChange={handleChange}
                                required
                                placeholder="0"
                                className={inputClass}
                            />
                        </FormField>

                        {/* Error message */}
                        {errorMessage && (
                            <div className="md:col-span-2 flex items-start gap-2.5 rounded-xl border border-[#fda29b] bg-[#fef3f2] dark:border-red-900/50 dark:bg-red-950/20 p-3.5">
                                <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-[#f04438]" />
                                <p className="text-sm font-medium text-[#b42318] dark:text-red-400">{errorMessage}</p>
                            </div>
                        )}

                        {/* Submit */}
                        <div className="md:col-span-2 flex items-center gap-3 pt-1">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-[#1a2231] dark:bg-white px-5 py-2.5 text-sm font-semibold text-white dark:text-[#1a2231] hover:bg-[#344054] dark:hover:bg-[#f2f4f7] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                {saving ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Saving...
                                    </span>
                                ) : (
                                    isEdit ? "Update Product" : "Create Product"
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => onNavigate?.("/merchant/product")}
                                className="rounded-xl border border-[#e4e7ec] dark:border-slate-700 px-5 py-2.5 text-sm font-medium text-[#667085] dark:text-slate-300 hover:bg-[#f2f4f7] dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default ProductForm;

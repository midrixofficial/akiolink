import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus } from "lucide-react";

const statusConfig = {
    active:   { label: "Active",   dot: "bg-[#12b76a]", text: "text-[#027a48]",  bg: "bg-[#ecfdf3]" },
    inactive: { label: "Inactive", dot: "bg-[#f04438]", text: "text-[#b42318]",  bg: "bg-[#fef3f2]" },
};

function StatusBadge({ active }) {
    const cfg = active ? statusConfig.active : statusConfig.inactive;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

function Product({ onNavigate }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get("/api/products");
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await axios.delete(`/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error("Failed to delete product", error);
        }
    };

    return (
        <main className="p-5 sm:p-6">
            <div className="mx-auto w-full max-w-7xl">
                <div className="rounded-2xl border border-[#e4e7ec] bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">

                    {/* Card Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#f2f4f7] dark:border-slate-800">
                        <div>
                            <h3 className="text-base font-semibold text-[#1a2231] dark:text-white">Product List</h3>
                            <p className="text-xs text-[#98a2b3] dark:text-slate-500 mt-0.5">
                                {products.length} product{products.length !== 1 ? "s" : ""} total
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigate?.("/merchant/product/create")}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1a2231] dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-[#1a2231] hover:bg-[#344054] dark:hover:bg-[#f2f4f7] transition-colors shadow-sm"
                        >
                            <Plus size={15} />
                            Add Product
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-[#f9fafb] dark:bg-slate-800/60">
                                <tr>
                                    {["Image", "Name", "Category", "Type", "Price", "Stock", "Actions"].map((col) => (
                                        <th key={col} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-[#98a2b3] dark:text-slate-500">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-8 text-center">
                                            <div className="flex items-center justify-center gap-2 text-sm text-[#98a2b3] dark:text-slate-500">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#e4e7ec] border-t-[#1a2231]" />
                                                Loading products...
                                            </div>
                                        </td>
                                    </tr>
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-12 text-center">
                                            <p className="text-sm text-[#98a2b3] dark:text-slate-500">No products found.</p>
                                            <button type="button" onClick={() => onNavigate?.("/merchant/product/create")} className="mt-2 inline-block text-sm font-medium text-[#1a2231] dark:text-white underline underline-offset-2">
                                                Add your first product
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="border-t border-[#f2f4f7] dark:border-slate-800 hover:bg-[#f9fafb] dark:hover:bg-slate-800/40 transition-colors"
                                        >
                                            <td className="px-5 py-3.5">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="h-10 w-10 rounded-xl object-cover border border-[#e4e7ec] dark:border-slate-700"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-xl bg-[#f4f6fb] dark:bg-slate-800 border border-[#e4e7ec] dark:border-slate-700" />
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 text-sm font-semibold text-[#1a2231] dark:text-white">
                                                {product.name}
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-[#667085] dark:text-slate-400">
                                                {product.category?.name || "—"}
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-[#667085] dark:text-slate-400">
                                                {product.type || "—"}
                                            </td>
                                            <td className="px-5 py-3.5 text-sm font-semibold text-[#1a2231] dark:text-white">
                                                ₹{product.price}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-sm font-medium ${
                                                    (product.stock_quantity ?? product.stock ?? 0) > 10
                                                        ? "text-[#027a48]"
                                                        : "text-[#b42318]"
                                                }`}>
                                                    {product.stock_quantity ?? product.stock ?? 0}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => onNavigate?.(`/merchant/product/edit/${product.id}`)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#e4e7ec] dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-[#344054] dark:text-slate-300 hover:bg-[#f2f4f7] dark:hover:bg-slate-700 transition-colors"
                                                    >
                                                        <Pencil size={12} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#fda29b] dark:border-red-900/50 bg-[#fef3f2] dark:bg-red-950/20 px-3 py-1.5 text-xs font-semibold text-[#b42318] dark:text-red-400 hover:bg-[#fee4e2] dark:hover:bg-red-950/40 transition-colors"
                                                    >
                                                        <Trash2 size={12} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Product;

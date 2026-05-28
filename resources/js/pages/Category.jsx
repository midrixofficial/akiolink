import { useEffect, useState } from "react";
import axios from "axios";
import { GripVertical, Trash2, Plus, Pencil } from "lucide-react";

function Category({ onNavigate }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [draggedId, setDraggedId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get("/api/categories");
            setCategories(data);
        } catch (error) {
            console.error("Failed to load categories", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            await axios.delete(`/api/categories/${id}`);
            await fetchCategories();
        } catch (error) {
            console.error("Failed to delete category", error);
        }
    };

    const handleDrop = async (targetId) => {
        if (!draggedId || draggedId === targetId) return;
        const fromIndex = categories.findIndex((item) => item.id === draggedId);
        const toIndex = categories.findIndex((item) => item.id === targetId);
        if (fromIndex < 0 || toIndex < 0) return;

        const reordered = [...categories];
        const [moved] = reordered.splice(fromIndex, 1);
        reordered.splice(toIndex, 0, moved);
        const withOrder = reordered.map((item, index) => ({ ...item, order_by: index + 1 }));
        setCategories(withOrder);
        setDraggedId(null);

        try {
            await axios.post("/api/categories/reorder", {
                categories: withOrder.map((item) => ({ id: item.id, order_by: item.order_by })),
            });
        } catch (error) {
            console.error("Failed to reorder categories", error);
            fetchCategories();
        }
    };

    return (
        <main className="p-5 sm:p-6">
            <div className="mx-auto w-full max-w-7xl">
                <div className="rounded-2xl border border-[#e4e7ec] bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">

                    {/* Card Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#f2f4f7] dark:border-slate-800">
                        <div>
                            <h3 className="text-base font-semibold text-[#1a2231] dark:text-white">
                                Category List
                            </h3>
                            <p className="text-xs text-[#98a2b3] dark:text-slate-500 mt-0.5">
                                Drag rows to reorder categories
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigate?.("/merchant/category/create")}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1a2231] dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-[#1a2231] hover:bg-[#344054] dark:hover:bg-[#f2f4f7] transition-colors shadow-sm"
                        >
                            <Plus size={15} />
                            Add Category
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead className="bg-[#f9fafb] dark:bg-slate-800/60">
                                <tr>
                                    {["", "Order", "Image", "Name", "Description", "Actions"].map((col, i) => (
                                        <th key={i} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-[#98a2b3] dark:text-slate-500">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-8 text-sm text-center text-[#98a2b3] dark:text-slate-500">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#e4e7ec] border-t-[#1a2231]" />
                                                Loading categories...
                                            </div>
                                        </td>
                                    </tr>
                                ) : categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-12 text-center">
                                            <p className="text-sm text-[#98a2b3] dark:text-slate-500">No categories found.</p>
                                            <button type="button" onClick={() => onNavigate?.("/merchant/category/create")} className="mt-2 inline-block text-sm font-medium text-[#1a2231] dark:text-white underline underline-offset-2">
                                                Create your first category
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr
                                            key={category.id}
                                            draggable
                                            onDragStart={() => setDraggedId(category.id)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={() => handleDrop(category.id)}
                                            className="border-t border-[#f2f4f7] dark:border-slate-800 hover:bg-[#f9fafb] dark:hover:bg-slate-800/40 transition-colors group"
                                        >
                                            {/* Drag handle */}
                                            <td className="pl-4 pr-0 py-3.5 w-8">
                                                <GripVertical size={16} className="text-[#d0d5dd] dark:text-slate-600 cursor-grab group-hover:text-[#98a2b3] transition-colors" />
                                            </td>
                                            <td className="px-5 py-3.5 text-sm font-semibold text-[#667085] dark:text-slate-400">
                                                #{category.order_by}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {category.image_url ? (
                                                    <img
                                                        src={category.image_url}
                                                        alt={category.name}
                                                        className="h-10 w-10 rounded-xl object-cover border border-[#e4e7ec] dark:border-slate-700"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4f6fb] dark:bg-slate-800 text-[10px] font-semibold text-[#98a2b3] border border-[#e4e7ec] dark:border-slate-700">
                                                        N/A
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 text-sm font-semibold text-[#1a2231] dark:text-white">
                                                {category.name}
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-[#667085] dark:text-slate-400 max-w-[200px]">
                                                <span className="line-clamp-1">{category.description || "—"}</span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => onNavigate?.(`/merchant/category/edit/${category.id}`)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#e4e7ec] dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-[#344054] dark:text-slate-300 hover:bg-[#f2f4f7] dark:hover:bg-slate-700 transition-colors"
                                                    >
                                                        <Pencil size={13} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#fda29b] dark:border-red-900/50 bg-[#fef3f2] dark:bg-red-950/20 px-3 py-1.5 text-xs font-semibold text-[#b42318] dark:text-red-400 hover:bg-[#fee4e2] dark:hover:bg-red-950/40 transition-colors"
                                                    >
                                                        <Trash2 size={13} />
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

export default Category;

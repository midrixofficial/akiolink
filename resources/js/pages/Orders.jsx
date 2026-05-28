import { useState, useEffect } from "react";
import axios from "axios";
import {
    ShoppingCart,
    Search,
    ChevronLeft,
    ChevronRight,
    Eye,
    X,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    IndianRupee,
    Loader2,
    CheckCircle
} from "lucide-react";

const statusConfig = {
    Completed: { label: "Completed", dot: "bg-[#12b76a]", text: "text-[#027a48]", bg: "bg-[#ecfdf3]" },
    Pending: { label: "Pending", dot: "bg-[#f79009]", text: "text-[#b54708]", bg: "bg-[#fffaeb]" },
    Cancelled: { label: "Cancelled", dot: "bg-[#f04438]", text: "text-[#b42318]", bg: "bg-[#fef3f2]" },
    "On Progress": { label: "On Progress", dot: "bg-[#465fff]", text: "text-[#3641f5]", bg: "bg-[#ecf3ff]" },
    "On Hold": { label: "On Hold", dot: "bg-[#f79009]", text: "text-[#b54708]", bg: "bg-[#fffaeb]" },
};

export default function Orders({ onNavigate }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);

    // Search and filters
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // Order Detail Modal state
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [statusSuccessMsg, setStatusSuccessMsg] = useState("");

    const fetchOrders = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/orders?page=${page}&limit=10`);
            setOrders(res.data.data);
            setCurrentPage(res.data.current_page);
            setLastPage(res.data.last_page);
            setTotalOrders(res.data.total);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    const handleViewOrder = async (orderId) => {
        setSelectedOrderId(orderId);
        setLoadingDetail(true);
        setStatusSuccessMsg("");
        try {
            const res = await axios.get(`/api/orders/${orderId}`);
            setSelectedOrder(res.data);
        } catch (err) {
            console.error("Failed to load order details:", err);
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!selectedOrder) return;
        setUpdatingStatus(true);
        setStatusSuccessMsg("");
        try {
            const res = await axios.post(`/api/orders/${selectedOrder.id}/status`, {
                status: newStatus
            });
            setSelectedOrder({ ...selectedOrder, status: newStatus });
            setStatusSuccessMsg("Status updated successfully!");
            // Update status in local table list
            setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
            setTimeout(() => setStatusSuccessMsg(""), 3000);
        } catch (err) {
            console.error("Failed to update status:", err);
        } finally {
            setUpdatingStatus(false);
        }
    };

    // Filter local list for search query and status filter
    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const closeDetailModal = () => {
        setSelectedOrderId(null);
        setSelectedOrder(null);
    };

    return (
        <main className="p-5 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a2231] dark:text-white">Orders & Transactions</h1>
                        <p className="mt-1 text-sm text-[#667085] dark:text-slate-400">
                            Track client receipts, manage order fulfillment, and update statuses.
                        </p>
                    </div>
                </div>

                {/* Filters Board */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl border border-[#e4e7ec] bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                    {/* Search box */}
                    <div className="relative w-full sm:max-w-xs">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#98a2b3]">
                            <Search size={16} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search Order ID or Client Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-[#d0d5dd] dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 text-sm text-[#1a2231] dark:text-white placeholder-[#98a2b3] outline-none transition focus:border-[#1a2231] focus:ring-2 focus:ring-[#1a2231]/10 dark:focus:border-slate-400"
                        />
                    </div>

                    {/* Status filter selection tabs */}
                    <div className="flex flex-wrap gap-1.5 self-start sm:self-center">
                        {["All", "Pending", "On Progress", "Completed", "On Hold", "Cancelled"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setStatusFilter(tab)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                                    statusFilter === tab
                                        ? "bg-[#1a2231] text-white dark:bg-white dark:text-[#1a2231] shadow-sm"
                                        : "bg-white hover:bg-[#f9fafb] text-[#667085] border border-[#e4e7ec] dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:text-slate-400"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders Data Table */}
                <div className="rounded-2xl border border-[#e4e7ec] bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead className="bg-[#f8fafc] dark:bg-slate-800/50 text-[#667085] dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-[#e4e7ec] dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Items</th>
                                    <th className="px-6 py-4">Total Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e4e7ec] dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-[#98a2b3]">
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 size={16} className="animate-spin text-[#1a2231] dark:text-white" />
                                                <span>Loading database transactions...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-[#98a2b3]">
                                            No matching orders found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => {
                                        const cfg = statusConfig[order.status] || statusConfig["Pending"];
                                        return (
                                            <tr key={order.id} className="hover:bg-[#f9fafb] dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4.5 font-bold text-[#1a2231] dark:text-white">
                                                    {order.order_number}
                                                </td>
                                                <td className="px-6 py-4.5 font-medium text-[#1a2231] dark:text-white">
                                                    {order.customer_name}
                                                </td>
                                                <td className="px-6 py-4.5 text-[#667085] dark:text-slate-400">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4.5 text-[#667085] dark:text-slate-400 font-medium">
                                                    {order.items_count || 1}
                                                </td>
                                                <td className="px-6 py-4.5 font-bold text-[#1a2231] dark:text-white">
                                                    ₹{parseFloat(order.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-4.5">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                                                        {cfg.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4.5 text-right">
                                                    <button
                                                        onClick={() => handleViewOrder(order.id)}
                                                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#e4e7ec] bg-white px-3 py-1.5 text-xs font-semibold text-[#1a2231] hover:bg-[#f9fafb] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors shadow-sm"
                                                    >
                                                        <Eye size={13} />
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bottom Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#e4e7ec] dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/30">
                        <p className="text-xs text-[#667085] dark:text-slate-400 font-medium">
                            Showing page <span className="font-bold text-[#1a2231] dark:text-white">{currentPage}</span> of <span className="font-bold text-[#1a2231] dark:text-white">{lastPage}</span> (<span className="font-bold text-[#1a2231] dark:text-white">{totalOrders}</span> total database entries)
                        </p>
                        
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1 || loading}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#e4e7ec] bg-white text-xs font-bold text-[#667085] hover:bg-[#f9fafb] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
                            >
                                <ChevronLeft size={14} />
                                Prev
                            </button>
                            <button
                                disabled={currentPage === lastPage || loading}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#e4e7ec] bg-white text-xs font-bold text-[#667085] hover:bg-[#f9fafb] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
                            >
                                Next
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* VISUAL OVERLAY / ORDER DETAILS MODAL */}
                {selectedOrderId && (
                    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
                        <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden border border-[#e4e7ec] dark:border-slate-800 transition-all max-h-[90vh] flex flex-col">
                            
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-[#e4e7ec] dark:border-slate-800 p-5">
                                <div>
                                    <h3 className="text-base font-bold text-[#1a2231] dark:text-white">
                                        Order Summary {selectedOrder && `(${selectedOrder.order_number})`}
                                    </h3>
                                    <p className="text-xs text-[#667085] dark:text-slate-400">
                                        Fulfillment and customer address records
                                    </p>
                                </div>
                                <button
                                    onClick={closeDetailModal}
                                    className="rounded-lg p-1 text-[#667085] hover:bg-[#f2f4f7] dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto space-y-6 flex-1">
                                {loadingDetail ? (
                                    <div className="py-12 flex flex-col items-center justify-center gap-2 text-[#98a2b3]">
                                        <Loader2 size={24} className="animate-spin text-[#1a2231] dark:text-white" />
                                        <span className="text-sm font-medium">Fetching details from server...</span>
                                    </div>
                                ) : selectedOrder ? (
                                    <div className="space-y-6">
                                        
                                        {/* Status Update Console */}
                                        <div className="rounded-xl border border-[#e4e7ec] bg-[#f8fafc] dark:bg-slate-800/40 p-4 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            <div>
                                                <span className="text-xs font-bold text-[#667085] dark:text-slate-400 uppercase tracking-wider">
                                                    Current Status
                                                </span>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                                        statusConfig[selectedOrder.status]?.bg || 'bg-slate-100'
                                                    } ${statusConfig[selectedOrder.status]?.text || 'text-slate-800'}`}>
                                                        {selectedOrder.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="block text-[10px] font-bold text-[#667085] dark:text-slate-400 uppercase tracking-wider">
                                                    Update Fulfillment Status
                                                </label>
                                                <select
                                                    value={selectedOrder.status}
                                                    disabled={updatingStatus}
                                                    onChange={(e) => handleUpdateStatus(e.target.value)}
                                                    className="rounded-xl border border-[#d0d5dd] dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-[#1a2231] dark:text-white outline-none focus:ring-1 focus:ring-slate-400"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="On Progress">On Progress</option>
                                                    <option value="On Hold">On Hold</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>

                                        {statusSuccessMsg && (
                                            <div className="flex gap-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/50 p-3 text-xs font-semibold">
                                                <CheckCircle size={14} className="mt-0.5" />
                                                <span>{statusSuccessMsg}</span>
                                            </div>
                                        )}

                                        {/* Grid Info Columns */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Client details card */}
                                            <div className="rounded-xl border border-[#e4e7ec] p-4 space-y-3 dark:border-slate-800">
                                                <h4 className="text-xs font-bold text-[#1a2231] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                                    <User size={13} className="text-[#98a2b3]" />
                                                    Client Info
                                                </h4>
                                                
                                                <div className="space-y-2">
                                                    <div className="text-sm font-semibold text-[#1a2231] dark:text-white">
                                                        {selectedOrder.customer_name}
                                                    </div>
                                                    {selectedOrder.customer_email && (
                                                        <div className="flex items-center gap-2 text-xs text-[#667085] dark:text-slate-400">
                                                            <Mail size={12} />
                                                            {selectedOrder.customer_email}
                                                        </div>
                                                    )}
                                                    {selectedOrder.customer_phone && (
                                                        <div className="flex items-center gap-2 text-xs text-[#667085] dark:text-slate-400">
                                                            <Phone size={12} />
                                                            {selectedOrder.customer_phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Delivery Details card */}
                                            <div className="rounded-xl border border-[#e4e7ec] p-4 space-y-3 dark:border-slate-800">
                                                <h4 className="text-xs font-bold text-[#1a2231] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                                    <MapPin size={13} className="text-[#98a2b3]" />
                                                    Delivery Address
                                                </h4>
                                                <p className="text-xs text-[#667085] dark:text-slate-300 leading-relaxed">
                                                    {selectedOrder.delivery_address || "No address provided (Local Pickup)"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Ordered Products Table */}
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold text-[#1a2231] dark:text-white uppercase tracking-wider">
                                                Ordered Products
                                            </h4>
                                            
                                            <div className="rounded-xl border border-[#e4e7ec] dark:border-slate-800 overflow-hidden">
                                                <table className="w-full text-left text-xs border-collapse">
                                                    <thead className="bg-[#f8fafc] dark:bg-slate-800/50 text-[#667085] dark:text-slate-400 font-bold border-b border-[#e4e7ec] dark:border-slate-800">
                                                        <tr>
                                                            <th className="px-4 py-3">Product Name</th>
                                                            <th className="px-4 py-3 text-right">Price</th>
                                                            <th className="px-4 py-3 text-center">Qty</th>
                                                            <th className="px-4 py-3 text-right">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-[#e4e7ec] dark:divide-slate-800">
                                                        {selectedOrder.items && selectedOrder.items.map((item) => (
                                                            <tr key={item.id}>
                                                                <td className="px-4 py-3 font-semibold text-[#1a2231] dark:text-white">
                                                                    {item.product_name}
                                                                </td>
                                                                <td className="px-4 py-3 text-right text-[#667085] dark:text-slate-400 font-medium">
                                                                    ₹{parseFloat(item.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                                </td>
                                                                <td className="px-4 py-3 text-center text-[#1a2231] dark:text-white font-bold">
                                                                    {item.quantity}
                                                                </td>
                                                                <td className="px-4 py-3 text-right font-bold text-[#1a2231] dark:text-white">
                                                                    ₹{(parseFloat(item.price) * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Total Summary Price */}
                                        <div className="flex justify-end pt-2 border-t border-[#f2f4f7] dark:border-slate-800">
                                            <div className="text-right space-y-1">
                                                <span className="text-[10px] font-bold text-[#667085] dark:text-slate-400 uppercase tracking-wider">
                                                    Grand Total
                                                </span>
                                                <div className="text-2xl font-black text-[#1a2231] dark:text-white flex items-center justify-end gap-1">
                                                    <IndianRupee size={20} className="text-emerald-500" />
                                                    {parseFloat(selectedOrder.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-[#98a2b3]">Failed to load order.</div>
                                )}
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}

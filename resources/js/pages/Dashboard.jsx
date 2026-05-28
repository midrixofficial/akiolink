import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, ShoppingCart, Users, IndianRupee, Package, Calendar, Clock } from "lucide-react";

// Mini sparkline SVG
function Sparkline({ color = "#12b76a", down = false }) {
    const up = [
        "M0,20 C5,18 10,15 15,13 S25,8 30,7 S40,5 45,4 S55,2 60,1",
        "M0,20 C8,17 12,14 18,11 S28,7 35,5 S45,3 52,2 S58,1 60,0",
    ];
    const dn = [
        "M0,1 C5,3 10,6 15,8 S25,12 30,14 S40,16 45,17 S55,19 60,20",
        "M0,2 C8,4 12,7 18,10 S28,13 35,15 S45,17 52,18 S58,19 60,20",
    ];
    const paths = down ? dn : up;
    return (
        <svg width="60" height="22" viewBox="0 0 60 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d={paths[0]} stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.35" />
            <path d={paths[1]} stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
    );
}

// Bar chart placeholder
function BarChart() {
    const bars = [
        { h: 40, active: false },
        { h: 55, active: false },
        { h: 48, active: false },
        { h: 70, active: false },
        { h: 90, active: true },
        { h: 60, active: false },
        { h: 45, active: false },
        { h: 35, active: false },
    ];
    return (
        <div className="flex items-end gap-2 h-24 px-1">
            {bars.map((bar, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div
                        style={{ height: `${bar.h}%` }}
                        className={`w-full rounded-t-md transition-all ${bar.active
                            ? "bg-[#1a2231]"
                            : "bg-[#e4e7ec] dark:bg-slate-700"
                            }`}
                    />
                </div>
            ))}
        </div>
    );
}

const stats = [
    {
        title: "Total Sales",
        value: "₹45,200",
        hint: "+12.4%",
        label: "vs last month",
        up: true,
        icon: <IndianRupee size={18} />,
        color: "#12b76a",
        sparkColor: "#12b76a",
    },
    {
        title: "Orders",
        value: "1,245",
        hint: "+8.1%",
        label: "vs last month",
        up: true,
        icon: <ShoppingCart size={18} />,
        color: "#12b76a",
        sparkColor: "#12b76a",
    },
    {
        title: "Customers",
        value: "892",
        hint: "+5.3%",
        label: "vs last month",
        up: true,
        icon: <Users size={18} />,
        color: "#12b76a",
        sparkColor: "#12b76a",
    },
    {
        title: "Revenue",
        value: "₹1.2L",
        hint: "-2.1%",
        label: "vs last month",
        up: false,
        icon: <Package size={18} />,
        color: "#f04438",
        sparkColor: "#f04438",
    },
];

const recentOrders = [
    { id: "ORD-2341", product: "Chicken Burger", customer: "John Doe", amount: "₹250", status: "Completed" },
    { id: "ORD-2342", product: "Pizza Margherita", customer: "David Roy", amount: "₹450", status: "Pending" },
    { id: "ORD-2343", product: "Pasta Arrabiata", customer: "Sara Khan", amount: "₹320", status: "Completed" },
    { id: "ORD-2344", product: "Caesar Salad", customer: "Mike Lee", amount: "₹180", status: "Cancelled" },
    { id: "ORD-2345", product: "Garlic Bread", customer: "Priya Patel", amount: "₹120", status: "Pending" },
];

const recentActivity = [
    { product: "Chicken Burger", status: "On Progress", id: "#ORD-2341", date: "Today" },
    { product: "Pizza Margherita", status: "On Hold", id: "#ORD-2342", date: "Yesterday" },
    { product: "Pasta Arrabiata", status: "Cancelled", id: "#ORD-2343", date: "May 14" },
    { product: "Caesar Salad", status: "Completed", id: "#ORD-2344", date: "May 13" },
];

const statusConfig = {
    Completed: { label: "Completed", dot: "bg-[#12b76a]", text: "text-[#027a48]", bg: "bg-[#ecfdf3]" },
    Pending: { label: "Pending", dot: "bg-[#f79009]", text: "text-[#b54708]", bg: "bg-[#fffaeb]" },
    Cancelled: { label: "Cancelled", dot: "bg-[#f04438]", text: "text-[#b42318]", bg: "bg-[#fef3f2]" },
    "On Progress": { label: "On Progress", dot: "bg-[#465fff]", text: "text-[#3641f5]", bg: "bg-[#ecf3ff]" },
    "On Hold": { label: "On Hold", dot: "bg-[#f79009]", text: "text-[#b54708]", bg: "bg-[#fffaeb]" },
};

function StatusBadge({ status }) {
    const cfg = statusConfig[status] || statusConfig["Pending"];
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

function Dashboard({ user }) {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedDate = dateTime.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const formattedTime = dateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <main className="p-5 sm:p-6">
            <div className="mx-auto w-full max-w-7xl">

                {/* Welcome */}
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a2231] dark:text-white">
                            Welcome, {user?.name || "Admin"} 👋
                        </h1>
                        <p className="mt-1 text-sm text-[#667085] dark:text-slate-400">
                            Manage orders, track products, and grow your business — all in one place.
                        </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-sm text-[#667085] dark:text-slate-400">
                        <span className="flex items-center gap-3 text-xs font-medium bg-white dark:bg-slate-800 border border-[#e4e7ec] dark:border-slate-700 rounded-lg px-3 py-1.5 shadow-sm">
                            <span className="flex items-center gap-1.5 text-[#667085] dark:text-slate-400">
                                <Calendar size={14} className="text-[#12b76a]" />
                                {formattedDate}
                            </span>
                            <span className="h-3 w-[1px] bg-[#e4e7ec] dark:bg-slate-700"></span>
                            <span className="flex items-center gap-1.5 text-[#667085] dark:text-slate-400">
                                <Clock size={14} className="text-[#465fff]" />
                                {formattedTime}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
                    {stats.map((stat) => (
                        <div
                            key={stat.title}
                            className="rounded-2xl border border-[#e4e7ec] bg-white dark:border-slate-800 dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f6fb] dark:bg-slate-800 text-[#667085] dark:text-slate-400">
                                    {stat.icon}
                                </div>
                                <Sparkline color={stat.sparkColor} down={!stat.up} />
                            </div>

                            <p className="text-xs font-medium text-[#98a2b3] dark:text-slate-500 mb-1">
                                {stat.title}
                            </p>

                            <p className="text-2xl font-bold tracking-tight text-[#1a2231] dark:text-white">
                                {stat.value}
                            </p>

                            <div className="mt-2 flex items-center gap-1.5">
                                {stat.up ? (
                                    <TrendingUp size={13} className="text-[#12b76a]" />
                                ) : (
                                    <TrendingDown size={13} className="text-[#f04438]" />
                                )}
                                <span className={`text-xs font-semibold ${stat.up ? "text-[#027a48]" : "text-[#b42318]"}`}>
                                    {stat.hint}
                                </span>
                                <span className="text-xs text-[#98a2b3]">{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Overview + Activity Row */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                    {/* Overview Chart */}
                    <div className="xl:col-span-2 rounded-2xl border border-[#e4e7ec] bg-white dark:border-slate-800 dark:bg-slate-900 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-semibold text-[#1a2231] dark:text-white">Overview</h3>
                                <p className="text-xs text-[#98a2b3] dark:text-slate-500 mt-0.5">Avg per month</p>
                                <p className="text-2xl font-bold text-[#1a2231] dark:text-white mt-0.5">
                                    1,860
                                    <span className="text-sm font-medium text-[#98a2b3] dark:text-slate-400 ml-1">/ 3K</span>
                                    <span className="ml-2 text-xs font-semibold text-[#12b76a] bg-[#ecfdf3] rounded-full px-2 py-0.5">↑ 50.2%</span>
                                </p>
                            </div>
                            <button className="flex items-center gap-1.5 rounded-xl border border-[#e4e7ec] dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-medium text-[#667085] dark:text-slate-300 hover:bg-[#f2f4f7] dark:hover:bg-slate-700 transition-colors">
                                Last Month
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                        </div>

                        {/* Bar chart */}
                        <BarChart />

                        {/* X-axis labels */}
                        <div className="mt-2 flex justify-between px-1">
                            {["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map((m) => (
                                <span key={m} className="text-[10px] text-[#98a2b3] dark:text-slate-500 flex-1 text-center">
                                    {m}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="rounded-2xl border border-[#e4e7ec] bg-white dark:border-slate-800 dark:bg-slate-900 p-5 shadow-sm">
                        <h3 className="text-base font-semibold text-[#1a2231] dark:text-white mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            {recentActivity.map((item, i) => (
                                <div key={i} className="flex items-start gap-3 pb-3 border-b border-[#f2f4f7] dark:border-slate-800 last:border-0 last:pb-0">
                                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#f4f6fb] dark:bg-slate-800 text-[#667085] dark:text-slate-400">
                                        <Package size={15} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-[#1a2231] dark:text-white truncate">{item.product}</p>
                                        <div className="flex items-center gap-1.5 text-xs text-[#98a2b3] dark:text-slate-500 mb-1">
                                            <span>{item.id}</span>
                                            <span>·</span>
                                            <div className="flex items-center gap-1">
                                                <Calendar size={10} />
                                                <span>{item.date}</span>
                                            </div>
                                        </div>
                                        <StatusBadge status={item.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="mt-5 rounded-2xl border border-[#e4e7ec] bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#f2f4f7] dark:border-slate-800">
                        <h3 className="text-base font-semibold text-[#1a2231] dark:text-white">Recent Orders</h3>
                        <button className="rounded-lg border border-[#e4e7ec] dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-[#667085] dark:text-slate-300 hover:bg-[#f2f4f7] dark:hover:bg-slate-800 transition-colors">
                            View All
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead className="bg-[#f9fafb] dark:bg-slate-800/60">
                                <tr>
                                    {["Order ID", "Product", "Customer", "Amount", "Status"].map((col) => (
                                        <th key={col} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-[#98a2b3] dark:text-slate-500">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order, i) => (
                                    <tr
                                        key={order.id}
                                        className="border-t border-[#f2f4f7] dark:border-slate-800 hover:bg-[#f9fafb] dark:hover:bg-slate-800/40 transition-colors"
                                    >
                                        <td className="px-5 py-3.5 text-sm font-medium text-[#667085] dark:text-slate-400">
                                            {order.id}
                                        </td>
                                        <td className="px-5 py-3.5 text-sm font-medium text-[#1a2231] dark:text-white">
                                            {order.product}
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-[#667085] dark:text-slate-400">
                                            {order.customer}
                                        </td>
                                        <td className="px-5 py-3.5 text-sm font-semibold text-[#1a2231] dark:text-white">
                                            {order.amount}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <StatusBadge status={order.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </main>
    );
}

export default Dashboard;

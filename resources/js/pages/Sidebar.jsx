import {
    LayoutDashboard,
    Tag,
    Package,
    X,
    Settings,
    HelpCircle,
    Store,
    Link,
    ShoppingCart,
} from "lucide-react";

function Sidebar({ sidebarOpen, setSidebarOpen, selectedMenu, onNavigate }) {
    const mainMenus = [
        {
            title: "Dashboard",
            icon: <LayoutDashboard size={18} />,
            href: "/merchant/dashboard",
        },
        {
            title: "Category",
            icon: <Tag size={18} />,
            href: "/merchant/category",
        },
        {
            title: "Product",
            icon: <Package size={18} />,
            href: "/merchant/product",
        },
        {
            title: "Merchant",
            icon: <Store size={18} />,
            href: "/merchant/details",
        },
        {
            title: "Generate Link",
            icon: <Link size={18} />,
            href: "/merchant/generate-link",
        },
        {
            title: "Orders",
            icon: <ShoppingCart size={18} />,
            href: "/merchant/orders",
        },
    ];

    const settingMenus = [
        {
            title: "Settings",
            icon: <Settings size={18} />,
            href: "/merchant/settings",
        },
        {
            title: "Support & Help",
            icon: <HelpCircle size={18} />,
            href: "/merchant/support",
        },
    ];

    const NavItem = ({ menu }) => {
        const isActive = selectedMenu === menu.title;
        return (
            <button
                type="button"
                onClick={() => {
                    if (menu.href !== "#") onNavigate?.(menu.href);
                }}
                className={`
                    group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                    transition-all duration-150
                    ${isActive
                        ? "bg-[#1a2231] text-white shadow-sm"
                        : "text-[#667085] hover:bg-[#f2f4f7] hover:text-[#1a2231] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    }
                `}
            >
                <span className={`flex-shrink-0 ${isActive ? "text-white" : "text-[#98a2b3] group-hover:text-[#1a2231] dark:group-hover:text-white"}`}>
                    {menu.icon}
                </span>
                <span>{menu.title}</span>
            </button>
        );
    };

    return (
        <>
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar overlay"
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`
                    fixed lg:static z-50 top-0 left-0 flex flex-col h-screen
                    bg-white dark:bg-[#1a2231]
                    border-r border-[#e4e7ec] dark:border-slate-800
                    transition-all duration-300 ease-in-out
                    ${sidebarOpen 
                        ? "w-64 translate-x-0 opacity-100" 
                        : "w-0 -translate-x-full lg:translate-x-0 lg:w-0 opacity-0 overflow-hidden"
                    }
                `}
            >
                {/* Logo */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-[#e4e7ec] dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a2231] dark:bg-white text-white dark:text-[#1a2231] text-sm font-bold">
                            A
                        </div>
                        <span className="text-lg font-bold tracking-tight text-[#1a2231] dark:text-white">
                            Akiolink
                        </span>
                    </div>
                    <button
                        className="lg:hidden text-slate-500 hover:text-slate-700"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
                    {/* Main Menu */}
                    <div>
                        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#98a2b3] dark:text-slate-500">
                            Main Menu
                        </p>
                        <nav className="space-y-0.5">
                            {mainMenus.map((menu) => (
                                <NavItem key={menu.title} menu={menu} />
                            ))}
                        </nav>
                    </div>

                    {/* Settings */}
                    <div>
                        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#98a2b3] dark:text-slate-500">
                            Setting
                        </p>
                        <nav className="space-y-0.5">
                            {settingMenus.map((menu) => (
                                <NavItem key={menu.title} menu={menu} />
                            ))}
                        </nav>
                    </div>
                </div>

            </aside>
        </>
    );
}

export default Sidebar;

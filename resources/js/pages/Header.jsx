import {
    Menu,
    ArrowLeft,
    Moon,
    Sun,
    Search,
    Bell,
    ChevronRight,
    User,
    LogOut,
    Settings,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

function Header({ selectedMenu, darkMode, setDarkMode, sidebarOpen, onMenuClick, onNavigate, onLogout, user }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-30 border-b border-[#e4e7ec] bg-white dark:border-slate-800 dark:bg-[#1a2231] px-5 py-3.5">
            <div className="flex w-full items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        className="group flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4e7ec] text-[#667085] hover:bg-[#f2f4f7] dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 transition-all duration-200"
                        onClick={onMenuClick}
                    >
                        <div className={`transition-transform duration-300 ${sidebarOpen ? "rotate-0" : "rotate-180"}`}>
                            {sidebarOpen ? <ArrowLeft size={19} /> : <Menu size={19} />}
                        </div>
                    </button>
                </div>

                {/* Right: Search + actions */}
                <div className="flex items-center gap-2.5">
                    {/* Search */}
                    <div className="hidden md:flex items-center gap-2 rounded-xl border border-[#e4e7ec] bg-[#f9fafb] dark:border-slate-700 dark:bg-slate-800 px-3 py-2 text-sm text-[#98a2b3]">
                        <Search size={15} />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="bg-transparent outline-none placeholder-[#98a2b3] text-[#1a2231] dark:text-white w-40 text-sm"
                        />
                    </div>

                    {/* Notifications */}
                    <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#e4e7ec] bg-white hover:bg-[#f2f4f7] dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
                        <Bell size={17} className="text-[#667085] dark:text-slate-400" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                    </button>

                    {/* Dark mode toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e4e7ec] bg-white hover:bg-[#f2f4f7] dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                    >
                        {darkMode ? (
                            <Sun className="text-yellow-400" size={17} />
                        ) : (
                            <Moon className="text-[#667085]" size={17} />
                        )}
                    </button>

                    {/* Avatar Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a2231] dark:bg-white text-white dark:text-[#1a2231] text-sm font-semibold shadow-sm flex-shrink-0 transition-transform active:scale-95"
                        >
                            {user?.name?.charAt(0).toUpperCase() || "A"}
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-[#e4e7ec] bg-white p-2 shadow-xl outline-none dark:border-slate-800 dark:bg-[#1a2231] ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in duration-150">
                                <div className="px-3 py-2 border-b border-[#f2f4f7] dark:border-slate-800 mb-1">
                                    <p className="text-xs font-medium text-[#98a2b3] uppercase tracking-wider">Account</p>
                                    <p className="text-sm font-semibold text-[#1a2231] dark:text-white truncate">{user?.name || "Admin"}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        onNavigate?.("/merchant/profile");
                                        setDropdownOpen(false);
                                    }}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[#344054] hover:bg-[#f9fafb] dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <User size={16} />
                                    <span>Manage Profile</span>
                                </button>
                                <button
                                    onClick={() => {
                                        onNavigate?.("/merchant/settings");
                                        setDropdownOpen(false);
                                    }}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[#344054] hover:bg-[#f9fafb] dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <Settings size={16} />
                                    <span>Settings</span>
                                </button>
                                <div className="my-1 border-t border-[#f2f4f7] dark:border-slate-800"></div>
                                <button
                                    onClick={() => {
                                        onLogout?.();
                                        setDropdownOpen(false);
                                    }}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[#f04438] hover:bg-[#fff1f0] dark:hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span>Sign out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;

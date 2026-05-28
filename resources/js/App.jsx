import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import Sidebar from "./pages/Sidebar";
import Header from "./pages/Header";
import Dashboard from "./pages/Dashboard";
import Category from "./pages/Category";
import CategoryCreate from "./pages/CategoryCreate";
import CategoryForm from "./pages/CategoryForm";
import Product from "./pages/Product";
import ProductForm from "./pages/ProductForm";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import MerchantDetails from "./pages/MerchantDetails";
import Settings from "./pages/Settings";
import LinkGenerator from "./pages/LinkGenerator";
import Support from "./pages/Support";
import Orders from "./pages/Orders";
import LandingPage from "./pages/LandingPage";

const menuByPath = {
    "/merchant/dashboard": "Dashboard",
    "/merchant/category": "Category",
    "/merchant/category/create": "Category",
    "/merchant/category/edit": "Category",
    "/merchant/product": "Product",
    "/merchant/product/create": "Product",
    "/merchant/profile": "Profile",
    "/merchant/details": "Merchant",
    "/merchant/settings": "Settings",
    "/merchant/generate-link": "Generate Link",
    "/merchant/support": "Support & Help",
    "/merchant/orders": "Orders",
};

export default function App() {
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") return true;
        if (savedTheme === "light") return false;
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const navigate = (path) => {
        if (!path || path === "#" || path === currentPath) return;
        window.history.pushState({}, "", path);
        setCurrentPath(path);
    };

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    useEffect(() => {
        const onPopState = () => setCurrentPath(window.location.pathname);
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    useEffect(() => {
        const isAuthPage = currentPath === "/merchant/signin" || currentPath === "/merchant/signup";
        const isMerchantPage = currentPath.startsWith("/merchant/");
        const token = localStorage.getItem("auth_token");

        if (isMerchantPage && !isAuthPage && !token) {
            navigate("/merchant/signin");
        }

        // Update user state if it changes in localStorage (e.g. after login)
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            if (JSON.stringify(parsed) !== JSON.stringify(user)) {
                setUser(parsed);
            }
        }
    }, [currentPath]);

    if (currentPath === "/") {
        return (
            <LandingPage
                onNavigate={navigate}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                user={user}
            />
        );
    }

    // ── Auth pages (no shell) ──────────────────────────────────────
    if (currentPath === "/merchant/signin") return <SignIn onNavigate={navigate} />;
    if (currentPath === "/merchant/signup") return <SignUp onNavigate={navigate} />;
    if (currentPath === "/merchant/onboarding") return <Onboarding onNavigate={navigate} />;

    // ── Admin shell ────────────────────────────────────────────────
    const selectedMenu = currentPath.startsWith("/merchant/product/edit/")
        ? "Product"
        : currentPath.startsWith("/merchant/category/edit/")
            ? "Category"
            : menuByPath[currentPath] ?? "Dashboard";

    const renderPage = () => {
        if (currentPath === "/merchant/profile") return <Profile onNavigate={navigate} setUser={setUser} />;
        if (currentPath === "/merchant/category/create") return <CategoryCreate onNavigate={navigate} />;
        if (currentPath.startsWith("/merchant/category/edit/")) {
            const categoryId = currentPath.split("/").pop();
            return <CategoryForm mode="edit" categoryId={categoryId} onNavigate={navigate} />;
        }
        if (currentPath === "/merchant/category") return <Category onNavigate={navigate} />;
        if (currentPath === "/merchant/product/create") return <ProductForm mode="create" onNavigate={navigate} />;
        if (currentPath.startsWith("/merchant/product/edit/")) {
            const productId = currentPath.split("/").pop();
            return <ProductForm mode="edit" productId={productId} onNavigate={navigate} />;
        }
        if (currentPath === "/merchant/product") return <Product onNavigate={navigate} />;
        if (currentPath === "/merchant/details") return <MerchantDetails onNavigate={navigate} />;
        if (currentPath === "/merchant/settings") return <Settings onNavigate={navigate} />;
        if (currentPath === "/merchant/generate-link") return <LinkGenerator onNavigate={navigate} />;
        if (currentPath === "/merchant/support") return <Support onNavigate={navigate} />;
        if (currentPath === "/merchant/orders") return <Orders onNavigate={navigate} />;
        return <Dashboard user={user} />;
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#f4f6fb] text-[#1a2231] dark:bg-[#0f1117] dark:text-slate-100">
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    selectedMenu={selectedMenu}
                    onNavigate={navigate}
                />

                <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
                    <Header
                        selectedMenu={selectedMenu}
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                        sidebarOpen={sidebarOpen}
                        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                        onNavigate={navigate}
                        onLogout={handleLogout}
                        user={user}
                    />
                    <div className="flex-1 overflow-y-auto">
                        {/* Breadcrumbs */}
                        <div className="px-5 sm:px-6 pt-5 mx-auto w-full max-w-7xl">
                            <nav className="flex items-center gap-1.5 text-sm">
                                <span className="text-[#98a2b3] dark:text-slate-500 font-medium">Main Menu</span>
                                <ChevronRight size={14} className="text-[#d0d5dd] dark:text-slate-600 flex-shrink-0" />
                                <span className="font-semibold text-[#1a2231] dark:text-white">{selectedMenu}</span>
                            </nav>
                        </div>
                        
                        {renderPage()}
                    </div>
                </div>
        </div>
    );
}

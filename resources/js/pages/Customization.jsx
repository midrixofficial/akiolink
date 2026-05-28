import { useMemo, useState } from "react";

const deviceConfigs = {
    mobile: { label: "Mobile", width: "max-w-[320px]", frame: "h-[560px]" },
    tablet: { label: "Tablet", width: "max-w-[640px]", frame: "h-[560px]" },
    desktop: { label: "Desktop", width: "max-w-full", frame: "h-[560px]" },
};

function Customization() {
    const [device, setDevice] = useState("mobile");
    const [primaryColor, setPrimaryColor] = useState("#1a2231");
    const [secondaryColor, setSecondaryColor] = useState("#0ba5ec");
    const [categoryType, setCategoryType] = useState("image");
    const [storeName, setStoreName] = useState("Akiolink Store");
    const [showStoreName, setShowStoreName] = useState(true);

    const activeDevice = deviceConfigs[device];

    const categoryPreview = useMemo(
        () => ["Pizza", "Burger", "Drinks", "Dessert"],
        []
    );

    return (
        <main className="p-5 sm:p-6">
            <div className="mx-auto w-full max-w-7xl space-y-5">
                <div className="rounded-2xl border border-[#e4e7ec] bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f2f4f7] px-5 py-4 dark:border-slate-800">
                        <div>
                            <h3 className="text-base font-semibold text-[#1a2231] dark:text-white">Customization</h3>
                            <p className="text-xs text-[#98a2b3] dark:text-slate-500 mt-0.5">Customize your storefront style and preview by device</p>
                        </div>

                        <div className="inline-flex rounded-xl border border-[#e4e7ec] bg-[#f9fafb] p-1 dark:border-slate-700 dark:bg-slate-800">
                            {Object.entries(deviceConfigs).map(([key, config]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setDevice(key)}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${device === key
                                            ? "bg-[#1a2231] text-white"
                                            : "text-[#667085] hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700"
                                        }`}
                                >
                                    {config.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
                        <div className="rounded-2xl border border-[#e4e7ec] bg-[#f9fafb] p-4 dark:border-slate-700 dark:bg-slate-800/60">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#98a2b3]">Live Preview</p>
                            <div className={`mx-auto w-full ${activeDevice.width}`}>
                                <div className={`overflow-hidden rounded-2xl border border-[#d0d5dd] bg-white shadow-sm dark:border-slate-700 ${activeDevice.frame}`}>
                                    <div className="px-4 py-3" style={{ backgroundColor: primaryColor }}>
                                        {showStoreName ? (
                                            <h4 className="text-sm font-semibold text-white">{storeName || "Store Name"}</h4>
                                        ) : (
                                            <h4 className="text-sm font-semibold text-white/70">Store name hidden</h4>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <div className="mb-3 h-8 rounded-lg" style={{ backgroundColor: secondaryColor }} />
                                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#98a2b3]">Categories</p>

                                        <div className="grid grid-cols-2 gap-3">
                                            {categoryPreview.map((item) => (
                                                <div key={item} className="rounded-xl border border-[#e4e7ec] p-2.5 dark:border-slate-700">
                                                    {categoryType === "image" ? (
                                                        <div className="mb-2 h-14 rounded-lg bg-[#f2f4f7] dark:bg-slate-700" />
                                                    ) : null}
                                                    <p className="text-xs font-medium text-[#344054] dark:text-slate-200">{item}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#e4e7ec] p-4 dark:border-slate-700">
                            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#98a2b3]">Customization Controls</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-[#344054] dark:text-slate-300">Primary Color</label>
                                    <input
                                        type="color"
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="h-10 w-full rounded-lg border border-[#d0d5dd] dark:border-slate-700"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-[#344054] dark:text-slate-300">Secondary Color</label>
                                    <input
                                        type="color"
                                        value={secondaryColor}
                                        onChange={(e) => setSecondaryColor(e.target.value)}
                                        className="h-10 w-full rounded-lg border border-[#d0d5dd] dark:border-slate-700"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-[#344054] dark:text-slate-300">Category Type</label>
                                    <div className="inline-flex rounded-xl border border-[#e4e7ec] bg-[#f9fafb] p-1 dark:border-slate-700 dark:bg-slate-800">
                                        <button
                                            type="button"
                                            onClick={() => setCategoryType("image")}
                                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${categoryType === "image"
                                                    ? "bg-[#1a2231] text-white"
                                                    : "text-[#667085] hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700"
                                                }`}
                                        >
                                            Image
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCategoryType("text")}
                                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${categoryType === "text"
                                                    ? "bg-[#1a2231] text-white"
                                                    : "text-[#667085] hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700"
                                                }`}
                                        >
                                            Text
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-[#344054] dark:text-slate-300">Store Name</label>
                                    <input
                                        type="text"
                                        value={storeName}
                                        onChange={(e) => setStoreName(e.target.value)}
                                        className="w-full rounded-xl border border-[#d0d5dd] dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-[#1a2231] dark:text-white"
                                        placeholder="Enter store name"
                                    />
                                </div>

                                <label className="flex items-center justify-between rounded-xl border border-[#e4e7ec] px-3.5 py-2.5 dark:border-slate-700">
                                    <span className="text-sm font-medium text-[#344054] dark:text-slate-300">Show Store Name</span>
                                    <input
                                        type="checkbox"
                                        checked={showStoreName}
                                        onChange={(e) => setShowStoreName(e.target.checked)}
                                        className="h-4 w-4"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Customization;

import { useState, useEffect } from "react";
import {
    Heart,
    MessageSquare,
    Trash2,
    CheckCircle,
    ArrowLeft,
    Sparkles,
} from "lucide-react";

const ratingOptions = [
    { value: 1, label: "Poor", emoji: "😡" },
    { value: 2, label: "Fair", emoji: "😕" },
    { value: 3, label: "Average", emoji: "😐" },
    { value: 4, label: "Good", emoji: "🙂" },
    { value: 5, label: "Excellent", emoji: "😍" },
];

const feedbackCategories = [
    "Bug Report",
    "Feature Request",
    "UI/UX Suggestion",
    "Performance",
    "Other",
];

export default function Feedback({ onNavigate }) {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(null);
    const [category, setCategory] = useState("Feature Request");
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [history, setHistory] = useState([]);

    // Load feedback from localStorage on mount
    useEffect(() => {
        const savedFeedback = localStorage.getItem("akiolink_feedback_history");
        if (savedFeedback) {
            setHistory(JSON.parse(savedFeedback));
        } else {
            // Seed a sample feedback item
            const sampleFeedback = [
                {
                    id: 1,
                    rating: 5,
                    category: "UI/UX Suggestion",
                    comment: "The new sidebar user profile addition looks extremely sleek! Dark mode transitions are super smooth.",
                    date: "May 18, 2026",
                },
            ];
            setHistory(sampleFeedback);
            localStorage.setItem("akiolink_feedback_history", JSON.stringify(sampleFeedback));
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const newFeedback = {
            id: Date.now(),
            rating,
            category,
            comment,
            date: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
        };

        // Simulate API delay
        setTimeout(() => {
            const updatedHistory = [newFeedback, ...history];
            setHistory(updatedHistory);
            localStorage.setItem("akiolink_feedback_history", JSON.stringify(updatedHistory));

            setSubmitting(false);
            setSuccessMsg("Thank you for your valuable feedback! We appreciate your support.");
            setComment("");
            setRating(5);
            setCategory("Feature Request");

            setTimeout(() => setSuccessMsg(""), 5000);
        }, 1000);
    };

    const handleDelete = (id) => {
        const updated = history.filter((item) => item.id !== id);
        setHistory(updated);
        localStorage.setItem("akiolink_feedback_history", JSON.stringify(updated));
    };

    const getEmojiForRating = (value) => {
        return ratingOptions.find((opt) => opt.value === value)?.emoji || "🙂";
    };

    const getLabelForRating = (value) => {
        return ratingOptions.find((opt) => opt.value === value)?.label || "Good";
    };

    const inputClass =
        "w-full rounded-xl border border-[#d0d5dd] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-[#1a2231] dark:text-white placeholder-[#98a2b3] outline-none transition focus:border-[#1a2231] focus:ring-2 focus:ring-[#1a2231]/10 dark:focus:border-slate-400";

    return (
        <main className="p-5 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a2231] dark:text-white">Share Feedback</h1>
                        <p className="mt-1 text-sm text-[#667085] dark:text-slate-400">
                            We value your opinion. Help us improve Akiolink by sharing your experiences and ideas.
                        </p>
                    </div>
                    <button
                        onClick={() => onNavigate?.("/merchant/dashboard")}
                        className="self-start inline-flex items-center gap-2 rounded-xl border border-[#e4e7ec] bg-white px-4 py-2 text-sm font-medium text-[#667085] hover:bg-[#f9fafb] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors shadow-sm"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Feedback Form Card */}
                    <div className="rounded-2xl border border-[#e4e7ec] bg-white dark:border-slate-800 dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fdf2fa] dark:bg-pink-950/20 text-[#d444f1] dark:text-pink-400">
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-[#1a2231] dark:text-white">
                                    How was your experience?
                                </h3>
                                <p className="text-xs text-[#98a2b3] mt-0.5">
                                    Select rating, feedback category, and leave a review.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Emoji Rating System */}
                            <div className="space-y-2 text-center sm:text-left">
                                <label className="text-sm font-semibold text-[#344054] dark:text-slate-300">
                                    Satisfaction Level
                                </label>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-4 py-2">
                                    {ratingOptions.map((opt) => {
                                        const isSelected = rating === opt.value;
                                        const isHovered = hoverRating === opt.value;
                                        const isActive = isSelected || isHovered;
                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setRating(opt.value)}
                                                onMouseEnter={() => setHoverRating(opt.value)}
                                                onMouseLeave={() => setHoverRating(null)}
                                                className={`flex flex-col items-center gap-1 rounded-2xl border px-4 py-3 min-w-[76px] transition-all duration-150 ${
                                                    isActive
                                                        ? "border-[#1a2231] bg-[#f9fafb] scale-105 shadow-sm dark:border-white dark:bg-slate-800"
                                                        : "border-[#e4e7ec] bg-white hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900"
                                                }`}
                                            >
                                                <span className={`text-2xl transition-transform duration-100 ${isHovered ? 'scale-110' : ''}`}>
                                                    {opt.emoji}
                                                </span>
                                                <span className={`text-[10px] font-bold tracking-tight uppercase ${isActive ? 'text-[#1a2231] dark:text-white' : 'text-[#98a2b3]'}`}>
                                                    {opt.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Category Selector Chips */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#344054] dark:text-slate-300">
                                    Feedback Category
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {feedbackCategories.map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setCategory(cat)}
                                            className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
                                                category === cat
                                                    ? "bg-[#1a2231] text-white border-[#1a2231] shadow-sm dark:bg-white dark:text-[#1a2231] dark:border-white"
                                                    : "border-[#e4e7ec] text-[#667085] bg-white hover:border-slate-400 dark:border-slate-800 dark:text-slate-400 dark:bg-slate-900"
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Text Area Review */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-[#344054] dark:text-slate-300">
                                        Your Comments
                                    </label>
                                    <span className={`text-xs ${comment.length > 500 ? 'text-red-500' : 'text-[#98a2b3]'}`}>
                                        {comment.length}/500 chars
                                    </span>
                                </div>
                                <textarea
                                    required
                                    rows="4"
                                    maxLength="500"
                                    placeholder="Tell us what you like or how we can improve..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className={inputClass + " resize-none"}
                                ></textarea>
                            </div>

                            {successMsg && (
                                <div className="flex gap-2.5 rounded-xl border border-[#d1fadf] bg-[#ecfdf3] p-4 text-sm font-medium text-[#027a48] dark:border-green-900/50 dark:bg-green-950/20">
                                    <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
                                    <span>{successMsg}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a2231] hover:bg-[#344054] px-6 py-3 text-sm font-semibold text-white transition-all shadow-sm dark:bg-white dark:text-[#1a2231] dark:hover:bg-[#f2f4f7] disabled:opacity-50"
                            >
                                {submitting ? "Submitting..." : (
                                    <>
                                        <MessageSquare size={16} />
                                        Submit Feedback
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Feedback History Card */}
                    <div className="rounded-2xl border border-[#e4e7ec] bg-white dark:border-slate-800 dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b border-[#f2f4f7] pb-4 dark:border-slate-800">
                            <div>
                                <h3 className="text-base font-bold text-[#1a2231] dark:text-white flex items-center gap-2">
                                    <Heart size={18} className="text-[#f04438]" />
                                    Your Feedback History
                                </h3>
                                <p className="text-xs text-[#98a2b3] mt-0.5">
                                    Your recently submitted ratings and comments.
                                </p>
                            </div>
                            <span className="rounded-lg bg-[#f4f6fb] dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-[#667085] dark:text-slate-400">
                                {history.length} items
                            </span>
                        </div>

                        <div className="space-y-4">
                            {history.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-[#e4e7ec] bg-white/50 p-8 text-center dark:border-slate-800">
                                    <p className="text-sm text-[#98a2b3] dark:text-slate-500">
                                        You have not submitted any feedback yet.
                                    </p>
                                </div>
                            ) : (
                                history.map((item) => (
                                    <div
                                        key={item.id}
                                        className="relative group rounded-xl border border-[#e4e7ec] bg-[#f9fafb] p-4.5 dark:border-slate-800 dark:bg-slate-800/20 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex flex-wrap items-center gap-2.5">
                                                <span className="text-2xl" title={getLabelForRating(item.rating)}>
                                                    {getEmojiForRating(item.rating)}
                                                </span>
                                                <div>
                                                    <span className="rounded-full bg-white dark:bg-slate-800 border border-[#e4e7ec] dark:border-slate-700 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#667085] dark:text-slate-300">
                                                        {item.category}
                                                    </span>
                                                    <span className="block sm:inline sm:ml-2.5 text-[11px] text-[#98a2b3]">
                                                        {item.date}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="opacity-0 group-hover:opacity-100 text-[#98a2b3] hover:text-[#f04438] transition-all p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                                title="Delete entry"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <p className="mt-3 text-sm text-[#344054] dark:text-slate-300 leading-relaxed pr-6">
                                            {item.comment}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

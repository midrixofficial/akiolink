import { useState, useEffect } from "react";
import axios from "axios";
import {
    ChevronDown,
    ChevronUp,
    Send,
    CheckCircle,
    ArrowLeft,
    HelpCircle,
    MessageSquare,
    AlertCircle,
    Clock,
    User,
    CornerDownRight
} from "lucide-react";

const faqData = [
    {
        question: "How do I configure my merchant store details?",
        answer: "Go to the Settings page in your sidebar menu. Under 'Store Details', you can set your business name, contact owner, support email, phone number, and physical store address.",
    },
    {
        question: "What is 'Order Auto-Acceptance'?",
        answer: "When enabled under the Settings -> Operations tab, our system automatically accepts all incoming customer orders immediately and notifies you. If disabled, you manually accept/decline each order.",
    },
    {
        question: "How do I reorder category listings?",
        answer: "On the Category page, simply click and drag any row using the grip icon on the left side of the row. The new order is automatically saved in real time.",
    },
];

export default function Support({ onNavigate }) {
    const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(true);

    // Support Ticket Form State
    const [ticket, setTicket] = useState({ subject: "", category: "technical", message: "" });
    const [sending, setSending] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Active Opened Ticket Thread State
    const [activeTicketId, setActiveTicketId] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [sendingReply, setSendingReply] = useState(false);
    const [replyError, setReplyError] = useState("");

    // Load user support tickets
    const fetchTickets = async () => {
        try {
            const res = await axios.get("/api/support/tickets");
            setTickets(res.data);
        } catch (err) {
            console.error("Failed to fetch support tickets:", err);
        } finally {
            setLoadingTickets(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const toggleFaq = (index) => {
        setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
    };

    const handleTicketSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setSuccessMsg("");
        setErrorMsg("");

        try {
            const res = await axios.post("/api/support/tickets", ticket);
            setSuccessMsg("Support ticket submitted successfully!");
            setTicket({ subject: "", category: "technical", message: "" });
            // Add new ticket to list
            setTickets([res.data.ticket, ...tickets]);
        } catch (err) {
            setErrorMsg(err?.response?.data?.message || "Failed to submit ticket. Please try again.");
        } finally {
            setSending(false);
        }
    };

    const handleReplySubmit = async (e, ticketId) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setSendingReply(true);
        setReplyError("");

        try {
            const res = await axios.post(`/api/support/tickets/${ticketId}/reply`, {
                message: replyText
            });

            // Update local ticket replies list
            setTickets(tickets.map(t => {
                if (t.id === ticketId) {
                    return {
                        ...t,
                        replies: [...(t.replies || []), res.data.reply]
                    };
                }
                return t;
            }));

            setReplyText("");
        } catch (err) {
            setReplyError(err?.response?.data?.message || "Failed to submit reply.");
        } finally {
            setSendingReply(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-[#d0d5dd] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-[#1a2231] dark:text-white placeholder-[#98a2b3] outline-none transition focus:border-[#1a2231] focus:ring-2 focus:ring-[#1a2231]/10 dark:focus:border-slate-400";

    return (
        <main className="p-5 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-4xl space-y-8">
                
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a2231] dark:text-white">Support & Help</h1>
                        <p className="mt-1 text-sm text-[#667085] dark:text-slate-400">
                            Find quick answers or open a direct support ticket.
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

                {/* FAQ Accordion Section */}
                <div className="rounded-2xl border border-[#e4e7ec] bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <HelpCircle className="text-[#1a2231] dark:text-white" size={20} />
                        <h2 className="text-lg font-bold text-[#1a2231] dark:text-white">Frequently Asked Questions</h2>
                    </div>
                    
                    <div className="space-y-3">
                        {faqData.map((faq, index) => {
                            const isOpen = expandedFaqIndex === index;
                            return (
                                <div
                                    key={index}
                                    className="rounded-xl border border-[#e4e7ec] bg-[#f8fafc] dark:bg-slate-800/40 dark:border-slate-800 overflow-hidden"
                                >
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-[#f2f4f7] dark:hover:bg-slate-800/80 transition-colors"
                                    >
                                        <span className="text-sm font-bold text-[#1a2231] dark:text-white">
                                            {faq.question}
                                        </span>
                                        <span className="text-[#98a2b3] flex-shrink-0">
                                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </span>
                                    </button>
                                    {isOpen && (
                                        <div className="border-t border-[#e4e7ec] dark:border-slate-800 px-5 py-4 bg-white dark:bg-slate-900/40">
                                            <p className="text-sm leading-relaxed text-[#667085] dark:text-slate-300">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Support Ticket Submission Card */}
                <div className="rounded-2xl border border-[#e4e7ec] bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-5">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="text-[#1a2231] dark:text-white" size={20} />
                        <h2 className="text-lg font-bold text-[#1a2231] dark:text-white">Submit a Support Ticket</h2>
                    </div>
                    <p className="text-sm text-[#667085] dark:text-slate-400">
                        Describe your query or issue, and our team will get back to you directly.
                    </p>

                    <form onSubmit={handleTicketSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-[#667085] dark:text-slate-400">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Brief summary of your issue"
                                    value={ticket.subject}
                                    onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-[#667085] dark:text-slate-400">
                                    Category
                                </label>
                                <select
                                    value={ticket.category}
                                    onChange={(e) => setTicket({ ...ticket, category: e.target.value })}
                                    className={inputClass}
                                >
                                    <option value="technical">Technical Support</option>
                                    <option value="billing">Billing & Orders</option>
                                    <option value="account">Account Access</option>
                                    <option value="features">Feature Request</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#667085] dark:text-slate-400">
                                Describe your issue
                            </label>
                            <textarea
                                required
                                rows="4"
                                placeholder="Provide details about the issue you are facing..."
                                value={ticket.message}
                                onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                                className={inputClass + " resize-none"}
                            ></textarea>
                        </div>

                        {successMsg && (
                            <div className="flex gap-2.5 rounded-xl border border-[#d1fadf] bg-[#ecfdf3] p-3.5 text-xs font-medium text-[#027a48] dark:border-green-900/50 dark:bg-green-950/20">
                                <CheckCircle size={15} className="mt-0.5 flex-shrink-0" />
                                <span>{successMsg}</span>
                            </div>
                        )}

                        {errorMsg && (
                            <div className="flex gap-2.5 rounded-xl border border-[#fda29b] bg-[#fef3f2] p-3.5 text-xs font-medium text-[#b42318] dark:border-red-900/50 dark:bg-red-950/20">
                                <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={sending}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#1a2231] hover:bg-[#344054] px-6 py-3 text-sm font-semibold text-white transition-all shadow-sm dark:bg-white dark:text-[#1a2231] dark:hover:bg-[#f2f4f7] disabled:opacity-50"
                            >
                                {sending ? "Sending..." : (
                                    <>
                                        <Send size={15} />
                                        Submit Ticket
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Ticket History & Conversation thread */}
                <div className="rounded-2xl border border-[#e4e7ec] bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-5">
                    <div className="flex items-center gap-2">
                        <Clock className="text-[#1a2231] dark:text-white" size={20} />
                        <h2 className="text-lg font-bold text-[#1a2231] dark:text-white">Your Support Tickets</h2>
                    </div>

                    {loadingTickets ? (
                        <div className="py-6 text-center text-sm text-[#98a2b3]">Loading your support history...</div>
                    ) : tickets.length === 0 ? (
                        <div className="py-8 text-center text-sm text-[#98a2b3] border border-dashed border-[#e4e7ec] dark:border-slate-800 rounded-xl">
                            You haven't submitted any support tickets yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tickets.map((t) => {
                                const isThreadOpen = activeTicketId === t.id;
                                return (
                                    <div
                                        key={t.id}
                                        className="rounded-xl border border-[#e4e7ec] bg-[#f8fafc] dark:bg-slate-800/40 dark:border-slate-800 overflow-hidden transition-all"
                                    >
                                        {/* Ticket Summary Header */}
                                        <button
                                            onClick={() => {
                                                setActiveTicketId(isThreadOpen ? null : t.id);
                                                setReplyText("");
                                                setReplyError("");
                                            }}
                                            className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 text-left hover:bg-[#f2f4f7] dark:hover:bg-slate-800/80 transition-colors"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-[#1a2231] dark:text-white">
                                                        {t.subject}
                                                    </span>
                                                    <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                                                        {t.category}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-[#98a2b3] dark:text-slate-400">
                                                    Submitted on {new Date(t.created_at).toLocaleDateString()} at {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center gap-3 self-end sm:self-center">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                                                    t.status === 'open' 
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' 
                                                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                                }`}>
                                                    {t.status}
                                                </span>
                                                <span className="text-[#98a2b3]">
                                                    {isThreadOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </span>
                                            </div>
                                        </button>

                                        {/* Ticket Conversation Body & Replies */}
                                        {isThreadOpen && (
                                            <div className="border-t border-[#e4e7ec] dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-5">
                                                
                                                {/* Original Ticket Description */}
                                                <div className="flex gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex-shrink-0">
                                                        <User size={14} />
                                                    </div>
                                                    <div className="space-y-1 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold text-[#1a2231] dark:text-white">You (Original Message)</span>
                                                        </div>
                                                        <p className="text-sm text-[#667085] dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                                            {t.message}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Replies Log */}
                                                {t.replies && t.replies.map((reply) => (
                                                    <div key={reply.id} className="flex gap-3 pl-6">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 flex-shrink-0">
                                                            <CornerDownRight size={14} />
                                                        </div>
                                                        <div className="space-y-1 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl p-4 flex-1 border border-indigo-100/30">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                                                                    {reply.user_id === t.user_id ? "You" : "Support Agent"}
                                                                </span>
                                                                <span className="text-[10px] text-[#98a2b3]">
                                                                    {new Date(reply.created_at).toLocaleDateString()} {new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-[#667085] dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                                                {reply.message}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Reply Editor Form */}
                                                <form onSubmit={(e) => handleReplySubmit(e, t.id)} className="pt-4 border-t border-[#f2f4f7] dark:border-slate-800 space-y-3">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder="Write a reply..."
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                            className="flex-1 rounded-xl border border-[#d0d5dd] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-[#1a2231] dark:text-white placeholder-[#98a2b3] outline-none transition focus:border-[#1a2231] dark:focus:border-slate-400"
                                                        />
                                                        <button
                                                            type="submit"
                                                            disabled={sendingReply || !replyText.trim()}
                                                            className="inline-flex items-center justify-center rounded-xl bg-[#1a2231] hover:bg-[#344054] px-4 py-2.5 text-sm font-semibold text-white transition-all dark:bg-white dark:text-[#1a2231] disabled:opacity-50"
                                                        >
                                                            {sendingReply ? "Sending..." : "Reply"}
                                                        </button>
                                                    </div>
                                                    {replyError && (
                                                        <p className="text-xs text-[#b42318]">{replyError}</p>
                                                    )}
                                                </form>

                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}

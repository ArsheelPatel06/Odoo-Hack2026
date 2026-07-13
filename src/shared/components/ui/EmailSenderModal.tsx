"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Send, Loader2 } from "lucide-react";

type EmailSenderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  htmlContent: string;
  defaultEmail?: string;
  title?: string;
  description?: string;
};

export function EmailSenderModal({
  isOpen,
  onClose,
  subject,
  htmlContent,
  defaultEmail = "",
  title = "Send Email Report",
  description = "Enter an email address to send this report to your inbox."
}: EmailSenderModalProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject,
          html: htmlContent
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      if (data.simulated) {
        toast.success("Email simulated! (Add SMTP_USER and SMTP_PASS to .env to send real emails)");
      } else {
        toast.success("Email sent successfully!");
      }

      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f172a] p-6 text-white text-center">
          <div className="mx-auto w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-slate-300 mt-2">{description}</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Recipient Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. your.name@gmail.com"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">We&apos;ll deliver a beautiful HTML email to this address.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm">
            <div className="flex gap-2 mb-2">
              <span className="font-medium text-slate-700 min-w-[60px]">Subject:</span>
              <span className="text-slate-600 truncate">{subject}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-slate-700 min-w-[60px]">From:</span>
              <span className="text-slate-600 truncate">TransitOps Platform</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isSending}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

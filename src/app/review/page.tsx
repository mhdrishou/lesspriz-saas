"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";

export default function ReviewPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<null | { type: "ok" | "error"; text: string }>(null);

  const submitFeedback = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setIsSending(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, rating }),
      });

      if (!res.ok) {
        throw new Error("Failed to send feedback");
      }

      setStatus({ type: "ok", text: "Thanks for your feedback. Your message was sent successfully." });
      setName("");
      setEmail("");
      setMessage("");
      setRating(5);
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", text: "Could not send feedback right now. Please email mhdrishou@gmail.com directly." });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen hero-gradient px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-4xl glass-card p-8 md:p-12">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted mb-4">Community</p>
        <h1 className="text-4xl font-black tracking-tight mb-4">Leave a Review</h1>
        <p className="text-sm text-muted mb-8">Tell us what you love and what we should improve. Feedback goes directly to <span className="font-bold text-fg">mhdrishou@gmail.com</span>.</p>

        <form onSubmit={submitFeedback} className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-border bg-white/70 px-4 py-3 font-medium outline-none focus:ring-4 ring-accent/10"
            required
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-border bg-white/70 px-4 py-3 font-medium outline-none focus:ring-4 ring-accent/10"
            required
          />
          <div>
            <label className="text-xs font-black uppercase tracking-[0.2em] text-muted">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-2 w-full rounded-2xl border border-border bg-white/70 px-4 py-3 font-medium outline-none"
            >
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Great</option>
              <option value={3}>3 - Good</option>
              <option value={2}>2 - Needs work</option>
              <option value={1}>1 - Poor</option>
            </select>
          </div>
          <textarea
            placeholder="Share your feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="w-full rounded-2xl border border-border bg-white/70 px-4 py-3 font-medium outline-none focus:ring-4 ring-accent/10"
            required
          />
          <Button type="submit" variant="accent" disabled={isSending} className="w-full py-4 text-base">
            {isSending ? "Sending..." : "Send review"}
          </Button>
        </form>

        {status && (
          <p className={`mt-4 text-sm font-semibold ${status.type === "ok" ? "text-green-700" : "text-red-600"}`}>
            {status.text}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="inline-flex text-sm font-bold text-accent hover:opacity-80 glass px-4 py-2 rounded-full">
            Back to home
          </Link>
          <Link href="/contact" className="inline-flex text-sm font-bold text-accent hover:opacity-80 glass px-4 py-2 rounded-full">
            Contact page
          </Link>
        </div>
      </div>
    </main>
  );
}

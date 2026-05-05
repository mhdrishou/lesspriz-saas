import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen hero-gradient px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-4xl glass-card p-8 md:p-12">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted mb-4">Support</p>
        <h1 className="text-4xl font-black tracking-tight mb-6">Contact</h1>
        <div className="space-y-5 text-sm leading-7 text-muted">
          <p>Need help with tracking, alerts, or account access? We would love to hear from you.</p>
          <p>For support and feedback, email us at <a className="font-bold text-fg" href="mailto:mhdrishou@gmail.com">mhdrishou@gmail.com</a>.</p>
          <p>You can also use our review form to send quick feedback anytime.</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/review" className="inline-flex text-sm font-bold text-accent hover:opacity-80 glass px-4 py-2 rounded-full">
            Leave a review
          </Link>
          <Link href="/" className="inline-flex text-sm font-bold text-accent hover:opacity-80 glass px-4 py-2 rounded-full">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen hero-gradient px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-4xl glass-card p-8 md:p-12">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted mb-4">Legal</p>
        <h1 className="text-4xl font-black tracking-tight mb-6">Privacy Policy</h1>
        <div className="space-y-5 text-sm leading-7 text-muted">
          <p>Lesspriz stores your account details and tracked product links to deliver price updates and alerts.</p>
          <p>We do not sell personal data. Donation checkout is processed by PayPal and follows their security policies.</p>
          <p>We only send product and alert-related emails needed for the service.</p>
          <p>If you need data removal support, contact us from the contact page and include your account email.</p>
        </div>
        <Link href="/" className="mt-8 inline-flex text-sm font-bold text-accent hover:opacity-80 glass px-4 py-2 rounded-full">
          Back to home
        </Link>
      </div>
    </main>
  );
}

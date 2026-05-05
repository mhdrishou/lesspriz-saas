import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-4xl border border-border bg-white p-8 md:p-12">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted mb-4">Legal</p>
        <h1 className="text-4xl font-black tracking-tight mb-6">Terms of Service</h1>
        <div className="space-y-5 text-sm leading-7 text-muted">
          <p>Lesspriz provides price monitoring tools on a best-effort basis.</p>
          <p>Prices and availability can change on retailer sites at any time; always verify before purchasing.</p>
          <p>You are responsible for using lawful product links and complying with retailer policies.</p>
          <p>Donations are optional and help keep the service free for all users.</p>
        </div>
        <Link href="/" className="mt-8 inline-flex text-sm font-bold text-accent hover:opacity-80">
          Back to home
        </Link>
      </div>
    </main>
  );
}

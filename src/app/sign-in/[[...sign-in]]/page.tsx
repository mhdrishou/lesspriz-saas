import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center hero-gradient p-6 relative">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-muted hover:text-fg glass px-4 py-2 rounded-full">
        <ArrowLeft className="w-4 h-4" /> Home
      </Link>
      <div className="w-full max-w-md glass-card p-6 md:p-8 rounded-[2rem]">
        <div className="mb-12 text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-muted mb-4">Secure Access</p>
            <h1 className="text-4xl font-black tracking-tighter">Welcome Back</h1>
            <p className="text-muted font-medium mt-2">Log in to your Lesspriz account</p>
        </div>
        <SignIn 
            routing="path"
            path="/sign-in"
            appearance={{
                elements: {
                    rootBox: "mx-auto",
                    card: "shadow-none border border-border rounded-3xl bg-white/70 backdrop-blur-xl",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "rounded-xl border-border hover:bg-bg transition-colors",
                    formButtonPrimary: "bg-fg hover:bg-fg/90 rounded-xl py-3 text-sm font-bold",
                    footerActionLink: "text-accent hover:text-accent/80 font-bold"
                }
            }}
        />
      </div>
    </div>
  );
}

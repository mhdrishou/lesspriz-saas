import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-6 relative">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-muted hover:text-fg transition-colors">
        <ArrowLeft className="w-4 h-4" /> Home
      </Link>
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
            <h1 className="text-4xl font-black tracking-tighter">Get Started</h1>
            <p className="text-muted font-medium mt-2">Create your free Lesspriz account</p>
        </div>
        <SignUp 
            routing="path"
            path="/sign-up"
            appearance={{
                elements: {
                    rootBox: "mx-auto",
                    card: "shadow-2xl border border-border rounded-3xl",
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

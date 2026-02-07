import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Clock,
  Search,
  FileCheck,
  Lock,
  Upload,
  CheckCircle2,
  Github,
  ExternalLink,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white">
      {/* ================= HERO ================= */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-blue-400 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Live on Sepolia Testnet
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
            Prove Your Work<br />
            Existed — Forever
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed">
            Create tamper-proof timestamps for your files using Ethereum.
            Secure ownership without uploading or exposing your data.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link
              href="/timestamp"
              className="group inline-flex h-12 items-center justify-center rounded-lg bg-blue-600 px-8 font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:scale-105"
            >
              <span className="mr-2">Start Timestamping</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/verify"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-8 font-medium text-white transition-all hover:bg-white/10"
            >
              Verify Document
            </Link>
          </div>
        </div>
      </section>

      {/* ================= PROBLEM / SOLUTION ================= */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Digital Files Are Easy to Copy.<br />Ownership Is Hard to Prove.
          </h2>
          <p className="text-zinc-400 leading-relaxed text-lg">
            Emails, cloud timestamps, and local files can be altered or disputed.
            ProofOfWork anchors proof of existence directly on Ethereum,
            creating a permanent and publicly verifiable record without storing
            your actual files.
          </p>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Simple workflow. No uploads. No storage. Just cryptographic proof.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              icon={<Upload className="w-6 h-6 text-blue-400" />}
              title="1. Hash Locally"
              description="Your file is converted into a unique cryptographic hash directly in your browser."
            />
            <StepCard
              icon={<Lock className="w-6 h-6 text-purple-400" />}
              title="2. Store Proof On-Chain"
              description="The hash and timestamp are written to Ethereum, creating a permanent record."
            />
            <StepCard
              icon={<CheckCircle2 className="w-6 h-6 text-emerald-400" />}
              title="3. Verify Anytime"
              description="Anyone can verify authenticity by comparing file hashes against the blockchain."
            />
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-blue-400" />}
              title="Cryptographic Proof"
              description="Files are hashed securely in your browser. Only the fingerprint is stored on-chain."
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6 text-purple-400" />}
              title="Immutable Timestamp"
              description="Ethereum guarantees that timestamps cannot be altered or deleted."
            />
            <FeatureCard
              icon={<Search className="w-6 h-6 text-emerald-400" />}
              title="Instant Verification"
              description="Verify authenticity instantly by matching hashes with blockchain records."
            />
          </div>
        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section className="py-24 border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Built For Creators, Developers & Teams
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-zinc-400">
            <UseCase title="Developers">
              Prove code ownership and project timelines before release.
            </UseCase>
            <UseCase title="Designers">
              Protect artwork, concepts, and visual assets.
            </UseCase>
            <UseCase title="Researchers">
              Establish discovery timelines and authorship proof.
            </UseCase>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-28 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Start Protecting Your Work Today
          </h2>
          <p className="text-zinc-400 mb-10">
            Create permanent proof of existence in seconds. No uploads. No
            intermediaries.
          </p>

          <Link
            href="/timestamp"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-blue-600 px-10 font-medium text-white transition hover:bg-blue-700 hover:scale-105"
          >
            Create Timestamp
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 py-10 text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold">
              P
            </div>
            ProofOfWork
          </div>

          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white flex items-center gap-1">
              <Github className="w-4 h-4" />
              GitHub
            </Link>
            <Link href="#" className="hover:text-white flex items-center gap-1">
              Smart Contract
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 border border-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 border border-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  );
}

function UseCase({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p>{children}</p>
    </div>
  );
}

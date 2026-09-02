"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

type Phase = "idle" | "sending" | "sent" | "problem";

export default function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const expired = params.get("status") === "expired";

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setPhase("sending");
    const { error } = await createClient().auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setPhase(error ? "problem" : "sent");
  }

  if (phase === "sent") {
    return (
      <p className="w-full rounded-[17px] bg-pink-100 p-4 text-[15px] text-ink">
        A sign-in link is on its way to <span className="font-semibold">{email}</span>. Open it on this device.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-3">
      {expired && <p className="text-sm text-ink-soft">That link has already been used or expired. Ask for a fresh one below.</p>}
      <input
        id="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        aria-label="Email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-13 rounded-[17px] border-[1.5px] border-input-line bg-card px-4 text-base text-ink outline-none placeholder:text-ink-faint focus:border-pink-300"
      />
      <Button type="submit" disabled={phase === "sending"}>
        {phase === "sending" ? "Sending…" : "Email me a sign-in link"}
      </Button>
      {phase === "problem" && <p className="text-sm text-ink-soft">Couldn&apos;t send the link just now. Try again in a moment.</p>}
    </form>
  );
}

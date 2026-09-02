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
      <p className="mt-8 rounded-2xl bg-moss-100 p-4 text-ink">
        A sign-in link is on its way to <span className="font-medium">{email}</span>. Open it on
        this device.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
      {expired && (
        <p className="text-sm text-ink-soft">That link has already been used or expired. Ask for a fresh one below.</p>
      )}
      <label className="text-sm text-ink-soft" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-12 rounded-xl border border-line bg-card px-4 text-base outline-none focus:border-moss-500"
      />
      <Button type="submit" disabled={phase === "sending"}>
        {phase === "sending" ? "Sending…" : "Email me a sign-in link"}
      </Button>
      {phase === "problem" && (
        <p className="text-sm text-ink-soft">Couldn&apos;t send the link just now. Try again in a moment.</p>
      )}
    </form>
  );
}

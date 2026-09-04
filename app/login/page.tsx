import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = { title: "Sign in · grow" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-5 px-8 py-10 text-center">
      <h1 className="font-display text-[64px] font-medium leading-none text-ink">grow</h1>
      <p className="max-w-[270px] text-[15px] leading-relaxed text-ink-soft">A private daily log. Small things, a life you can see.</p>
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="pt-4 text-xs text-ink-faint">Nothing decays. Nothing is lost.</p>
    </main>
  );
}

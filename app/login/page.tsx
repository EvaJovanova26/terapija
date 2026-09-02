import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
      <h1 className="text-2xl font-semibold">Baseline</h1>
      <p className="mt-1 text-ink-soft">A quiet place to note the day.</p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}

import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import Sym, { VB } from "@/components/art/Sym";

export const metadata = { title: "Sign in · Blossom" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-5 px-8 py-10 text-center">
      <Sym id="d-garland" vb={VB.garland} width={290} />
      <Sym id="f-100" vb={VB.flower} width={86} />
      <h1 className="font-display text-[44px] font-bold leading-none text-ink">Blossom</h1>
      <p className="max-w-[270px] text-[15px] leading-relaxed text-ink-soft">A private daily log. Every small thing you do grows your garden.</p>
      <Suspense>
        <LoginForm />
      </Suspense>
      <div className="flex items-end gap-4 pt-2 opacity-90">
        <Sym id="d-mushrooms" vb={VB.mushrooms} width={86} />
        <Sym id="d-mushroom" vb={VB.square} width={30} />
        <Sym id="d-butterfly" vb={VB.small} width={34} />
      </div>
    </main>
  );
}

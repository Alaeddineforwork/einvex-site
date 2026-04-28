import { SignIn } from "@clerk/nextjs";

export const metadata = { title: "Sign in — EinveX" };

export default function Page() {
  return (
    <main className="page-shell pt-[60px]">
      <section className="page-container flex min-h-[calc(100vh-60px)] items-center justify-center py-12">
        <SignIn />
      </section>
    </main>
  );
}

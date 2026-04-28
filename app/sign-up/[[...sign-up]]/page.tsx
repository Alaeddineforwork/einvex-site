import { SignUp } from "@clerk/nextjs";

export const metadata = { title: "Create your account — EinveX" };

export default function Page() {
  return (
    <main className="page-shell pt-[60px]">
      <section className="page-container flex min-h-[calc(100vh-60px)] items-center justify-center py-12">
        <SignUp />
      </section>
    </main>
  );
}

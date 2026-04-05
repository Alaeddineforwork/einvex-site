import EarlyAccessForm from "./early-access-form";

export default function EarlyAccessPage() {
  return (
    <main className="page-shell">
      <div className="page-container py-16">
        <div className="mx-auto max-w-3xl surface-card md:p-10">
          <p className="eyebrow">Join Early Access</p>
          <h1 className="page-title">Be among the first to discover EinveX</h1>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            Join our early access list to get updates about the platform, product
            launch, and new ethical investment screening features.
          </p>

          <EarlyAccessForm />
        </div>
      </div>
    </main>
  );
}

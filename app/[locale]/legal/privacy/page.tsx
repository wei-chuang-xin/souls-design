export default function PrivacyPage() {
  return (
    <div className="pt-14">
      <div className="mx-auto max-w-2xl px-6 pt-20 pb-24">
        <h1 className="text-4xl font-bold mb-10">Privacy Policy</h1>
        <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
          <p><strong className="text-white">Last updated:</strong> March 2026</p>
          <h2 className="text-white font-semibold text-base pt-4">What we collect</h2>
          <p>souls.design is a static site. We do not collect, store, or process any personal data. No accounts, no login, no tracking cookies.</p>
          <h2 className="text-white font-semibold text-base pt-4">Analytics</h2>
          <p>We may use privacy-respecting analytics (e.g., Vercel Analytics) to understand aggregate traffic only.</p>
          <h2 className="text-white font-semibold text-base pt-4">Hosting</h2>
          <p>The site is hosted on Vercel. Their privacy policy applies to infrastructure-level data handling.</p>
        </div>
      </div>
    </div>
  )
}

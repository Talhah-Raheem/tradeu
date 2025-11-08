import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-md border border-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: January 2025</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using TradeU, you accept and agree to be bound by the terms and provision of this agreement.
                If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
              <p className="text-gray-700 leading-relaxed">
                TradeU is exclusively for currently enrolled college and university students with valid .edu email addresses.
                Users must be at least 18 years old or have parental consent to use the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Conduct</h2>
              <p className="text-gray-700 leading-relaxed mb-4">Users agree to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate and truthful information in listings</li>
                <li>Respect other users and communicate professionally</li>
                <li>Not post prohibited items (weapons, illegal substances, etc.)</li>
                <li>Meet safety guidelines when conducting transactions</li>
                <li>Not engage in fraudulent or deceptive practices</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Transactions</h2>
              <p className="text-gray-700 leading-relaxed">
                TradeU facilitates connections between buyers and sellers but is not a party to any transaction.
                All transactions are conducted between users. TradeU is not responsible for the quality, safety,
                or legality of items listed, the accuracy of listings, or the ability of users to complete transactions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                TradeU is provided "as is" without warranties of any kind. We are not liable for any damages arising
                from your use of the platform or any transactions conducted through it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use of TradeU after changes
                constitutes acceptance of the modified terms.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-md border border-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: January 2025</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed mb-4">We collect the following types of information:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Account Information:</strong> Name, email address (.edu), profile photo</li>
                <li><strong>Listing Information:</strong> Item descriptions, photos, prices, and location</li>
                <li><strong>Messages:</strong> Communications between users through our platform</li>
                <li><strong>Usage Data:</strong> How you interact with TradeU (pages viewed, features used)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide and improve our marketplace services</li>
                <li>Verify student status and maintain platform security</li>
                <li>Facilitate communication between buyers and sellers</li>
                <li>Send important updates and notifications</li>
                <li>Analyze usage patterns to enhance user experience</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 leading-relaxed">
                We do not sell your personal information. Your information may be visible to other verified students
                on the platform as necessary for the marketplace to function (e.g., your name and profile on listings).
                We may share information with service providers who help us operate the platform, and when required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement reasonable security measures to protect your information. However, no method of transmission
                over the internet is 100% secure. We cannot guarantee absolute security of your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Access and download your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of promotional communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about this Privacy Policy or to exercise your rights, contact us at{' '}
                <a href="mailto:privacy@tradeu.com" className="text-soft-blue-600 hover:underline">
                  privacy@tradeu.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { CheckCircle, XCircle } from 'lucide-react';

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-md border border-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Community Guidelines</h1>
          <p className="text-gray-600 mb-8">
            TradeU is built on trust and respect. These guidelines help keep our campus marketplace safe and welcoming for everyone.
          </p>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Allowed</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-soft-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Textbooks & Course Materials</h3>
                    <p className="text-gray-700">Sell or trade textbooks, study guides, and educational materials</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-soft-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Dorm & Furniture</h3>
                    <p className="text-gray-700">Mini-fridges, desks, lamps, storage solutions, and room decor</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-soft-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Electronics & Tech</h3>
                    <p className="text-gray-700">Laptops, tablets, calculators, headphones, and other gadgets</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-soft-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Clothing & Accessories</h3>
                    <p className="text-gray-700">Apparel, shoes, bags, and accessories in good condition</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-soft-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Sports & Recreation</h3>
                    <p className="text-gray-700">Sports equipment, gym gear, bicycles, and outdoor equipment</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Prohibited</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <XCircle className="h-6 w-6 text-coral-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Weapons & Dangerous Items</h3>
                    <p className="text-gray-700">Firearms, explosives, knives (except kitchen utensils), or anything designed to harm</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-6 w-6 text-coral-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Illegal Substances & Alcohol</h3>
                    <p className="text-gray-700">Drugs, marijuana (even where legal), alcohol, tobacco, or vaping products</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-6 w-6 text-coral-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Counterfeit or Stolen Goods</h3>
                    <p className="text-gray-700">Fake designer items, stolen property, or anything obtained illegally</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-6 w-6 text-coral-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Adult or Offensive Content</h3>
                    <p className="text-gray-700">Sexually explicit material, hate speech, or anything targeting protected groups</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-6 w-6 text-coral-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Animals</h3>
                    <p className="text-gray-700">Live animals or animal parts (except legal pet supplies)</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Be a Good Community Member</h2>
              <div className="bg-soft-blue-50 rounded-xl p-6 border border-soft-blue-200">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-soft-blue-600 mr-2">•</span>
                    <span>Be honest and accurate in your listings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-soft-blue-600 mr-2">•</span>
                    <span>Communicate respectfully with other users</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-soft-blue-600 mr-2">•</span>
                    <span>Follow through on commitments to buy or sell</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-soft-blue-600 mr-2">•</span>
                    <span>Report suspicious activity or violations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-soft-blue-600 mr-2">•</span>
                    <span>Leave honest reviews to help others</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <div className="bg-coral-50 rounded-xl p-6 border border-coral-200">
                <h3 className="font-bold text-coral-900 mb-2">Violations</h3>
                <p className="text-gray-700">
                  Violating these guidelines may result in removal of listings, account suspension, or permanent ban.
                  Serious violations may be reported to campus authorities or law enforcement.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

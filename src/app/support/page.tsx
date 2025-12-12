import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { HelpCircle, Shield, Mail, MessageCircle } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">Support Center</h1>
          <p className="text-lg text-gray-600">We're here to help you navigate TradeU</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
            <HelpCircle className="h-12 w-12 text-soft-blue-600 mb-4" />
            <h2 id="faq" className="text-2xl font-bold text-gray-900 mb-3">FAQs</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How do I verify my student email?</h3>
                <p className="text-gray-600 text-sm">Sign up with your .edu email address and follow the verification link sent to your inbox.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Is TradeU free to use?</h3>
                <p className="text-gray-600 text-sm">Yes! Browsing and listing items is completely free for all students.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How do I message a seller?</h3>
                <p className="text-gray-600 text-sm">Click on any listing and use the "Message Seller" button to start a conversation.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
            <Shield className="h-12 w-12 text-soft-green-600 mb-4" />
            <h2 id="safety" className="text-2xl font-bold text-gray-900 mb-3">Safety Tips</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-soft-green-600 mr-2">✓</span>
                <span>Always meet in public, well-lit areas on campus</span>
              </li>
              <li className="flex items-start">
                <span className="text-soft-green-600 mr-2">✓</span>
                <span>Bring a friend when meeting someone for the first time</span>
              </li>
              <li className="flex items-start">
                <span className="text-soft-green-600 mr-2">✓</span>
                <span>Inspect items carefully before purchasing</span>
              </li>
              <li className="flex items-start">
                <span className="text-soft-green-600 mr-2">✓</span>
                <span>Use secure payment methods and get receipts</span>
              </li>
              <li className="flex items-start">
                <span className="text-soft-green-600 mr-2">✓</span>
                <span>Trust your instincts - if something feels off, walk away</span>
              </li>
            </ul>
          </div>
        </div>

        <div id="contact" className="bg-gradient-to-br from-soft-blue-500 to-soft-blue-600 rounded-2xl p-8 sm:p-12 text-white text-center">
          <Mail className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Our support team is here to assist you with any questions or concerns
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@tradeu.com"
              className="inline-flex items-center justify-center gap-2 bg-white text-soft-blue-600 px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all"
            >
              <Mail className="h-5 w-5" />
              Email Support
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-3 rounded-full font-bold hover:bg-white/20 transition-all"
            >
              <MessageCircle className="h-5 w-5" />
              Live Chat
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

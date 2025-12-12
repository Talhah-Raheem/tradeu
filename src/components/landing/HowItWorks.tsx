import { Search, MessageCircle, Handshake, CheckCircle } from 'lucide-react';

const Step = ({ number, icon: Icon, title, description }: { number: number; icon: React.ElementType; title: string; description: string }) => (
  <div className="relative">
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-soft-blue-500 to-soft-blue-600 flex items-center justify-center shadow-lg">
          <Icon className="h-9 w-9 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-coral-500 flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-sm">{number}</span>
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed max-w-xs">{description}</p>
    </div>
  </div>
);

const HowItWorks = () => (
  <section id="how-it-works" className="mb-24 px-4">
    <div className="text-center mb-16">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
        How It Works
      </h2>
      <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
        Buying and selling on TradeU is simple, safe, and designed for students
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto mb-12">
      <Step
        number={1}
        icon={Search}
        title="Browse or Post"
        description="Search for items you need or list something you want to sell. It's quick and free!"
      />
      <Step
        number={2}
        icon={MessageCircle}
        title="Connect"
        description="Message sellers or buyers directly through our secure platform to discuss details."
      />
      <Step
        number={3}
        icon={Handshake}
        title="Meet Safely"
        description="Arrange to meet on campus in a public place. Safety is our top priority."
      />
      <Step
        number={4}
        icon={CheckCircle}
        title="Complete"
        description="Exchange items and complete the transaction. Leave a review to help the community!"
      />
    </div>

    <div className="text-center">
      <div className="inline-flex items-center gap-2 bg-soft-blue-50 border border-soft-blue-200 rounded-full px-6 py-3">
        <span className="text-soft-blue-700 font-semibold text-sm">💡 Pro Tip:</span>
        <span className="text-gray-700 text-sm">Always meet in well-lit, public areas on campus</span>
      </div>
    </div>
  </section>
);

export default HowItWorks;

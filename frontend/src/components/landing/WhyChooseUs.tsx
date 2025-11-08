import { Shield, Users, DollarSign, Sparkles } from 'lucide-react';

const Feature = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  <div className="text-center group">
    <div className="bg-white/10 backdrop-blur-sm w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 border border-white/20">
      <Icon className="h-9 w-9 text-white" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-white/90 leading-relaxed">{children}</p>
  </div>
);

const WhyChooseUs = () => (
  <section className="relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-16 mb-24 mx-4">
    <div className="absolute inset-0 bg-gradient-to-br from-soft-blue-500 via-soft-blue-600 to-soft-green-600"></div>
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

    <div className="relative z-10">
      <div className="text-center mb-14">
        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
          <Sparkles className="h-4 w-4 text-white" />
          <span className="text-white font-bold text-sm">Trusted by Students</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-white">Why Choose TradeU</h2>
        <p className="text-white/90 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          A marketplace designed for safety, community, and student budgets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 max-w-6xl mx-auto">
        <Feature icon={Shield} title=".edu Verified">
          Only students from your university can join, ensuring a safe and trusted community.
        </Feature>
        <Feature icon={Users} title="Campus Focused">
          Meet up locally and exchange items easily with classmates and peers on campus.
        </Feature>
        <Feature icon={DollarSign} title="Student Prices">
          Find affordable deals and save money on everything you need for college life.
        </Feature>
      </div>
    </div>
  </section>
);

export default WhyChooseUs;

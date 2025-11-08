import { ArrowRight, BookOpen, Armchair, Laptop } from 'lucide-react';
import Link from 'next/link';

interface CategoryCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  bgGradient: string;
  iconBg: string;
  iconColor: string;
  hoverShadow: string;
  href: string;
}

const CategoryCard = ({ icon: Icon, title, description, bgGradient, iconBg, iconColor, hoverShadow, href }: CategoryCardProps) => (
  <Link href={href}>
    <div className={`${bgGradient} p-8 rounded-3xl hover:shadow-xl ${hoverShadow} transition-all duration-300 cursor-pointer group border border-white/50`}>
      <div className={`${iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
        <Icon className={`h-7 w-7 ${iconColor}`} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-700 text-sm mb-5 leading-relaxed">{description}</p>
      <div className="flex items-center text-gray-900 font-bold text-sm group-hover:gap-2 gap-1 transition-all">
        <span>Explore</span>
        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </Link>
);

const Categories = () => (
  <div className="mb-24 px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">Everything you need for campus life, right at your fingertips</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <CategoryCard
        icon={BookOpen}
        title="Textbooks"
        description="Save hundreds on required readings. Buy and sell course materials with ease."
        bgGradient="bg-gradient-to-br from-soft-blue-50 to-soft-blue-100"
        iconBg="bg-white"
        iconColor="text-soft-blue-600"
        hoverShadow="hover:shadow-soft-blue-200"
        href="/listings?category=Textbooks"
      />
      <CategoryCard
        icon={Armchair}
        title="Furniture & Dorm"
        description="Furnish your space on a budget. Quality items from fellow students."
        bgGradient="bg-gradient-to-br from-lilac-50 to-lilac-100"
        iconBg="bg-white"
        iconColor="text-lilac-600"
        hoverShadow="hover:shadow-lilac-200"
        href="/listings?category=Furniture"
      />
      <CategoryCard
        icon={Laptop}
        title="Electronics"
        description="Find laptops, tablets, and tech essentials for your studies and life."
        bgGradient="bg-gradient-to-br from-soft-green-50 to-soft-green-100"
        iconBg="bg-white"
        iconColor="text-soft-green-600"
        hoverShadow="hover:shadow-soft-green-200"
        href="/listings?category=Electronics"
      />
    </div>
  </div>
);

export default Categories;
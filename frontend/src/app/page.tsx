import { Search, Plus, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">TradeU</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-500 hover:text-gray-900">Browse</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Categories</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">About</a>
            </nav>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Post Item
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to TradeU
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            The marketplace made by students, for students. Buy, sell, and trade everything you need for campus life.
          </p>

          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input 
                type="text"
                placeholder="Search for textbooks, furniture, electronics..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📚 Textbooks</h3>
            <p className="text-gray-600">Find affordable textbooks from fellow students</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🪑 Furniture</h3>
            <p className="text-gray-600">Dorm and apartment essentials at student prices</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">💻 Electronics</h3>
            <p className="text-gray-600">Laptops, phones, and gadgets for your studies</p>
          </div>
        </div>

        <section className="bg-white rounded-lg shadow-sm border p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Recent Listings</h3>
            <button className="text-blue-600 hover:text-blue-800">View All</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="bg-gray-200 h-48 rounded-md mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Image Placeholder</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Sample Item {item}</h4>
                <p className="text-gray-600 text-sm mb-2">Short description of the item...</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">$25</span>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 TradeU. Dylan, Talhah, Omar.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

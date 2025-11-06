import { Link } from "react-router-dom";
import { Plane, MapPin, CheckCircle, Lock, TrendingUp, Users, Globe2, Clock, Facebook, Twitter, Instagram, Github } from "lucide-react";

export default function Landing() {
  return (
    <main className="bg-gray-50">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-amber-900/70 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ 
            backgroundImage: "url('/assets/hero-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        ></div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-blue-900/50 to-amber-900/60"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-lg animate-fade-in">
            Your Journey Starts Here
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto drop-shadow-md">
            Plan, save, and track your dream destinations
          </p>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Keep a personal travel bucket list, log places you love, and never lose your wanderlust inspiration again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/signup" 
              className="group bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            >
              Start Your Adventure
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link 
              to="/login" 
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Plan Your Travels</h2>
          <p className="text-xl text-gray-600">Organize, track, and share your dream destinations</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Create Your List</h3>
            <p className="text-gray-600 leading-relaxed">
              Build your personalized bucket list of dream destinations. Add photos, notes, and priorities to each place you want to visit.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Track Progress</h3>
            <p className="text-gray-600 leading-relaxed">
              Mark destinations as visited, add your memories, and watch your travel stats grow. Celebrate every journey completed!
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure & Private</h3>
            <p className="text-gray-600 leading-relaxed">
              Your travel plans are securely stored and accessible only to you. Sync across all your devices seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div className="flex flex-col items-center">
              <TrendingUp className="w-12 h-12 mb-3 opacity-80" />
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Dream Destinations</div>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-12 h-12 mb-3 opacity-80" />
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Happy Travelers</div>
            </div>
            <div className="flex flex-col items-center">
              <Globe2 className="w-12 h-12 mb-3 opacity-80" />
              <div className="text-4xl md:text-5xl font-bold mb-2">195</div>
              <div className="text-blue-100">Countries Covered</div>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-12 h-12 mb-3 opacity-80" />
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Always Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of travelers who are making their travel dreams come true
          </p>
          <Link 
            to="/signup" 
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-5 rounded-full font-bold text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-white">
                <span className="text-xl font-bold">Travelogue</span>
                <Globe2 className="w-8 h-8" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your personal travel companion for planning, tracking, and achieving your dream destinations around the world.
              </p>
              <div className="flex gap-4 pt-2">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                  <Github className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white transition text-sm">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="text-gray-400 hover:text-white transition text-sm">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition text-sm">
                    Features
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    Travel Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    Travel Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    Destination Ideas
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    Travel Tips
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal & Contact */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                    About Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm text-center md:text-left">
                © {new Date().getFullYear()} Travelogue. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-gray-400 hover:text-white transition text-sm flex items-center gap-1">
                  <Globe2 className="w-4 h-4" />
                  English
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                  USD
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

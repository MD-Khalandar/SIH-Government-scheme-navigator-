import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Users, ShieldCheck, FileCheck, MapPin } from 'lucide-react';
import { Button } from '../components';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">SAHAYAK</h1>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-gray-700 hover:text-brand-blue transition">Home</a>
              <a href="#how" className="text-gray-700 hover:text-brand-blue transition">How it Works</a>
              <a href="#benefits" className="text-gray-700 hover:text-brand-blue transition">Benefits</a>
              <a href="#faq" className="text-gray-700 hover:text-brand-blue transition">FAQ</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-gray-700 hover:text-brand-blue transition font-medium">
                Login
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Find the government benefits meant for you.
            </h2>
            <p className="text-lg text-gray-600 mt-6 leading-relaxed">
              Sahayak helps you discover potentially eligible government schemes, understand the benefits, prepare your documents and know what to do next.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/register">
                <Button size="lg" fullWidth className="sm:w-auto">
                  Find My Benefits
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="secondary" fullWidth className="sm:w-auto">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Hero Visual */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="space-y-4">
              {['Your Situation', 'Eligibility Matching', 'Benefits', 'Documents', 'Application'].map((step, idx) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{step}</p>
                    <p className="text-sm text-gray-600">Step {idx + 1} of 5</p>
                  </div>
                  {idx < 4 && <ArrowRight size={20} className="text-brand-blue ml-auto" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="bg-white py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How Sahayak Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, title: 'Tell us about yourself', desc: 'Share your life situation' },
              { icon: MapPin, title: 'We match relevant schemes', desc: 'Find programs for you' },
              { icon: FileCheck, title: 'Check your documents', desc: 'Document readiness check' },
              { icon: ArrowRight, title: 'Take the next step', desc: 'Application guidance' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="bg-blue-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                    <Icon size={28} className="text-brand-blue" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Sahayak */}
      <section id="benefits" className="py-20 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Why Sahayak?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Personalized Discovery', desc: 'Find schemes tailored to your situation' },
              { title: 'Explainable Eligibility', desc: 'Understand exactly why you match' },
              { title: 'Document Readiness', desc: 'Know what documents you need' },
              { title: 'Application Guidance', desc: 'Step-by-step application help' },
              { title: 'Benefit Gap Insights', desc: 'Understand your potential benefits' },
              { title: 'Multilingual Ready', desc: 'Built for diverse citizens' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6">
                <CheckCircle2 size={28} className="text-brand-blue mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Every Citizen */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Built for Every Citizen</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {['Students', 'Farmers', 'Women & Families', 'Job Seekers', 'Entrepreneurs', 'Senior Citizens', 'Persons with Disabilities'].map((citizen, idx) => (
              <div key={idx} className="text-center py-6 border border-gray-200 rounded-lg hover:border-brand-blue transition">
                <p className="font-semibold text-gray-900">{citizen}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4">Sahayak</h4>
              <p className="text-sm">Government Benefits Navigator</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Help</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Sahayak. Demo for SIH. Not affiliated with actual government schemes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

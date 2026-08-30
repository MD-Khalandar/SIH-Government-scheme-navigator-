import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  FileCheck, 
  MapPin, 
  GraduationCap, 
  Tractor, 
  HeartHandshake, 
  Briefcase, 
  Building2, 
  UserCheck, 
  Accessibility,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import stackedPeaks from '../assets/stacked-peaks-haikei.svg';
import './Landing.css';

export const Landing = () => {
  const citizenCategories = [
    { label: 'Students', icon: GraduationCap },
    { label: 'Farmers', icon: Tractor },
    { label: 'Women & Families', icon: HeartHandshake },
    { label: 'Job Seekers', icon: Briefcase },
    { label: 'Entrepreneurs', icon: Building2 },
    { label: 'Senior Citizens', icon: UserCheck },
    { label: 'Persons with Disabilities', icon: Accessibility },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#c2f0c8] text-[#061b0d] font-jakarta selection:bg-[#2fe066] selection:text-[#061b0d] overflow-x-hidden antialiased">
      
      {/* Dynamic Ambient Glow & Pure CSS Mesh Layer */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="ambient-glow-top absolute -top-32 right-[-5%] w-[850px] h-[850px] rounded-full blur-[100px]" />
        <div className="ambient-glow-mid absolute top-[25%] left-[-10%] w-[700px] h-[700px] rounded-full blur-[120px]" />
        <div className="ambient-glow-bottom absolute bottom-[-10%] right-[10%] w-[750px] h-[750px] rounded-full blur-[130px]" />
      </div>

      {/* Floating Glass Navigation */}
      <header className="sticky top-5 z-50 w-full px-6 sm:px-12 lg:px-20 xl:px-28">
        <nav className="glass-nav max-w-7xl mx-auto shadow-lg shadow-[#061b0d]/[0.03] rounded-full px-7 py-3.5 flex items-center justify-between transition-all">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#061b0d] to-[#177e4f] flex items-center justify-center text-[#c9f3ce] font-extrabold text-base shadow-sm group-hover:scale-105 transition-transform duration-300">
              S
            </div>
            <span className="font-extrabold tracking-tight text-xl text-[#061b0d]">
              SAHAYAK
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-[#061b0d]/80">
            <a href="#hero" className="hover:text-[#177e4f] transition-colors">Overview</a>
            <a href="#pathway" className="hover:text-[#177e4f] transition-colors">Pathway</a>
            <a href="#benefits" className="hover:text-[#177e4f] transition-colors">Assurance</a>
            <a href="#citizens" className="hover:text-[#177e4f] transition-colors">Communities</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-[#061b0d] hover:text-[#177e4f] transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link to="/register">
              <button className="px-6 py-2.5 rounded-full bg-[#061b0d] hover:bg-[#177e4f] text-white text-sm font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg">
                Explore Schemes
              </button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative isolate pt-20 pb-36 lg:pt-28 lg:pb-52 w-full px-6 sm:px-12 lg:px-20 xl:px-28 overflow-hidden">
        {/* Full-width Stacked Peaks Vector Landscape */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none -z-20 leading-none">
          <img
            src={stackedPeaks}
            alt=""
            aria-hidden="true"
            className="w-full h-auto max-h-[380px] object-cover object-bottom opacity-40 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#c2f0c8] via-[#c2f0c8]/50 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto space-y-10 relative z-10">
          <div className="glass-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[#177e4f] text-sm font-semibold shadow-sm">
            <Sparkles size={16} className="text-[#177e4f]" />
            <span>Unified Citizen Welfare Gateway</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#061b0d] tracking-tight leading-[1.08] max-w-5xl">
            Welfare discovered <br />
            <span className="font-editorial italic font-semibold text-[#177e4f]">
              with complete clarity.
            </span>
          </h1>

          <div className="grid lg:grid-cols-12 gap-10 items-center pt-2">
            <div className="lg:col-span-7 space-y-8">
              <p className="text-lg sm:text-xl text-[#061b0d]/90 font-medium leading-relaxed max-w-xl">
                Navigate government assistance effortlessly. Discover verified grants, understand your eligibility transparently, and prepare your documentation in minutes.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/register">
                  <button className="group inline-flex items-center gap-3 px-9 py-4 rounded-full bg-[#061b0d] text-white text-base font-semibold hover:bg-[#177e4f] transition-all duration-300 shadow-xl shadow-[#061b0d]/10">
                    <span>Begin Assessment</span>
                    <ArrowRight size={18} className="text-[#4ae278] group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <a 
                  href="#pathway" 
                  className="glass-pill inline-flex items-center gap-2 text-base font-semibold text-[#061b0d] hover:text-[#177e4f] transition-colors px-6 py-4 rounded-full shadow-sm"
                >
                  <span>How It Works</span>
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>

            <div className="glass-panel lg:col-span-5 flex flex-col gap-5 p-8 rounded-[2rem] shadow-lg shadow-[#061b0d]/[0.03]">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#177e4f]/15 text-[#177e4f] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-base font-bold text-[#061b0d]">Zero Tracking</p>
                  <p className="text-sm font-medium text-[#061b0d]/70">No commercial storage of personal traits</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-[#061b0d]/10">
                <div className="w-11 h-11 rounded-2xl bg-[#177e4f]/15 text-[#177e4f] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-base font-bold text-[#061b0d]">Direct State Data</p>
                  <p className="text-sm font-medium text-[#061b0d]/70">Synchronized across central & state gazettes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Process Flow Cards */}
          <div className="mt-20 pt-10 border-t border-[#061b0d]/15">
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-bold uppercase tracking-widest text-[#061b0d]/70">
                Execution Sequence
              </span>
              <span className="glass-pill text-sm font-bold text-[#177e4f] px-3 py-1 rounded-full">
                04 Key Stages
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Identity & Situation', detail: 'Contextual demographic parameters' },
                { title: 'Rule Screening', detail: 'Cross-verification with state gazettes' },
                { title: 'Calculated Entitlements', detail: 'Subsidies, grants & social security' },
                { title: 'Document Verification', detail: 'Checklist readiness verification' }
              ].map((step, idx) => (
                <div 
                  key={step.title} 
                  className="glass-panel-subtle rounded-[1.75rem] p-6 shadow-sm hover:shadow-md hover:bg-white/90 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#061b0d] to-[#177e4f] text-[#c9f3ce] font-extrabold text-sm flex items-center justify-center mb-4 shadow-sm">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-[#061b0d] mb-1.5">{step.title}</h3>
                  <p className="text-sm text-[#061b0d]/80 font-medium leading-relaxed">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pathway Section */}
      <section id="pathway" className="relative py-28 w-full px-6 sm:px-12 lg:px-20 xl:px-28 border-t border-[#061b0d]/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-[#177e4f] block mb-2">
                Architecture
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#061b0d] tracking-tight">
                A clear passage to support.
              </h2>
            </div>
            <span className="text-sm font-bold text-[#061b0d]/60 tracking-wider uppercase">
              End-to-End Workflow
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'Share Context', desc: 'Provide basic demographic criteria without sensitive declarations.' },
              { icon: MapPin, title: 'Eligibility Screening', desc: 'Evaluates parameters against central and departmental mandates.' },
              { icon: FileCheck, title: 'Document Registry', desc: 'Structured checklist of authorized proofs and validating departments.' },
              { icon: ArrowRight, title: 'Direct Access', desc: 'Straight route to designated official sub-domains without middle agents.' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="glass-panel rounded-[2rem] p-8 shadow-sm hover:shadow-lg hover:bg-white transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-13 h-13 bg-[#177e4f]/15 text-[#177e4f] rounded-2xl flex items-center justify-center mb-6 p-3">
                      <Icon size={24} strokeWidth={2.2} />
                    </div>
                    <h3 className="font-bold text-[#061b0d] text-xl mb-3">{item.title}</h3>
                    <p className="text-sm text-[#061b0d]/80 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                  <div className="pt-6 mt-8 border-t border-[#061b0d]/10 text-xs font-bold text-[#177e4f]">
                    PHASE 0{idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Assurance / Principles Section */}
      <section id="benefits" className="relative py-28 w-full px-6 sm:px-12 lg:px-20 xl:px-28 border-t border-[#061b0d]/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-[#177e4f] block mb-2">
                Core Ethos
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#061b0d] tracking-tight">
                Built on public integrity.
              </h2>
            </div>
            <span className="text-sm font-bold text-[#061b0d]/60 tracking-wider uppercase">
              Standards & Governance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Explainable Criteria', 
                tag: 'Transparency',
                desc: 'Full breakdown of every matched rule so citizens know exactly why an application passes or needs supplementary verification.' 
              },
              { 
                title: 'Zero Intermediaries', 
                tag: 'Autonomy',
                desc: 'Direct guidance to nodal portals and designated grievance counters, reducing dependency on commission-based agents.' 
              },
              { 
                title: 'Plain Language', 
                tag: 'Reach',
                desc: 'Complex legal terminology distilled into readable citizen requirements without bureaucratic jargon.' 
              }
            ].map((benefit, idx) => (
              <div 
                key={idx} 
                className="glass-panel rounded-[2.25rem] p-8 shadow-sm hover:shadow-lg hover:bg-white transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-[#177e4f]/15 text-xs font-bold uppercase tracking-wider text-[#177e4f] mb-4">
                    {benefit.tag}
                  </div>
                  <h3 className="text-2xl font-bold text-[#061b0d] mb-3">{benefit.title}</h3>
                  <p className="text-base text-[#061b0d]/80 font-medium leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Communities Directory */}
      <section id="citizens" className="relative py-28 w-full px-6 sm:px-12 lg:px-20 xl:px-28 border-t border-[#061b0d]/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-[#177e4f] block mb-2">
                Demographics
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#061b0d] tracking-tight">
                Serving every demographic.
              </h2>
            </div>
            <span className="text-sm font-bold text-[#061b0d]/60 tracking-wider uppercase">
              Coverage Matrix
            </span>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {citizenCategories.map((citizen, idx) => {
              const Icon = citizen.icon;
              return (
                <div 
                  key={idx}
                  className="glass-panel group inline-flex items-center gap-3.5 px-6 py-4 rounded-full hover:bg-[#061b0d] hover:border-[#061b0d] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="w-9 h-9 rounded-full bg-[#177e4f]/15 group-hover:bg-white/20 text-[#177e4f] group-hover:text-white flex items-center justify-center transition-colors">
                    <Icon size={18} strokeWidth={2.2} />
                  </div>
                  <span className="text-base font-bold text-[#061b0d] group-hover:text-white transition-colors">
                    {citizen.label}
                  </span>
                  <ArrowUpRight size={16} className="text-[#177e4f] group-hover:text-white transition-colors ml-1" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-panel-subtle w-full py-16 px-6 sm:px-12 lg:px-20 xl:px-28 text-sm font-medium text-[#061b0d]/80 border-t border-[#061b0d]/15">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[#061b0d]/15">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#177e4f]" />
            <span className="text-[#061b0d] tracking-wider uppercase font-extrabold text-base">SAHAYAK NAVIGATOR</span>
          </div>

          <div className="flex flex-wrap items-center gap-8 text-sm font-semibold">
            <a href="#hero" className="hover:text-[#177e4f] transition-colors">Overview</a>
            <a href="#pathway" className="hover:text-[#177e4f] transition-colors">Pathway</a>
            <a href="#benefits" className="hover:text-[#177e4f] transition-colors">Assurance</a>
            <a href="#citizens" className="hover:text-[#177e4f] transition-colors">Communities</a>
            <a href="#" className="hover:text-[#177e4f] transition-colors">Privacy Directives</a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-medium text-[#061b0d]/70">
          <p>© 2026 Sahayak. Built for Smart India Hackathon.</p>
          <p className="uppercase tracking-wider text-[#177e4f] font-bold">Verified Information Portal</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
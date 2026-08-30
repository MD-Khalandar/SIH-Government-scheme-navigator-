import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  FileCheck, 
  MapPin, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import stackedPeaks from '../assets/stacked-peaks-haikei.svg';
import './Landing.css';

export const Landing = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#c9f3ce] text-[#061b0d] font-jakarta selection:bg-[#4ae278] selection:text-[#061b0d] overflow-x-hidden antialiased">
      
      {/* Ambient Glow Layers */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 right-[-5%] w-[750px] h-[750px] rounded-full bg-[radial-gradient(circle_at_center,#4ae27835_0%,transparent_70%)] blur-[120px]" />
        <div className="absolute top-[35%] left-[-10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,#177e4f20_0%,transparent_65%)] blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle_at_center,#14341e15_0%,transparent_70%)] blur-[140px]" />
      </div>

      {/* Floating Glass Navigation */}
      <header className="sticky top-4 z-50 w-full px-6 sm:px-12 lg:px-20 xl:px-28">
        <nav className="glass-nav max-w-7xl mx-auto shadow-md shadow-[#061b0d]/[0.03] rounded-full px-8 py-4 flex items-center justify-between transition-all">
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-[#177e4f] flex items-center justify-center text-[#c9f3ce] font-bold text-base shadow-sm group-hover:bg-[#061b0d] transition-colors">
              S
            </div>
            <span className="font-bold tracking-tight text-lg text-[#061b0d]">
              SAHAYAK
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#061b0d]/80">
            <a href="#hero" className="hover:text-[#177e4f] transition-colors">Overview</a>
            <a href="#pathway" className="hover:text-[#177e4f] transition-colors">Pathway</a>
            <a href="#benefits" className="hover:text-[#177e4f] transition-colors">Assurance</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-[#061b0d] hover:text-[#177e4f] transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link to="/register">
              <button className="px-6 py-2.5 rounded-full bg-[#177e4f] hover:bg-[#061b0d] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-sm hover:shadow-md">
                Explore Schemes
              </button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section with Stacked Peaks Asset */}
      <section id="hero" className="relative isolate pt-20 pb-36 lg:pt-28 lg:pb-48 w-full px-6 sm:px-12 lg:px-20 xl:px-28 overflow-hidden">
        
        {/* Full-width Stacked Peaks Vector Landscape */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none -z-20 leading-none">
          <img
            src={stackedPeaks}
            alt=""
            aria-hidden="true"
            className="w-full h-auto max-h-[360px] object-cover object-bottom opacity-35 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#c9f3ce] via-[#c9f3ce]/40 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto space-y-10 relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-[#177e4f]/30 text-[#177e4f] text-sm font-semibold shadow-sm">
            <Sparkles size={16} className="text-[#177e4f]" />
            <span>Unified Citizen Welfare Gateway</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal text-[#061b0d] tracking-tight leading-[1.08] max-w-5xl">
            Welfare discovered <br />
            <span className="font-serif italic font-medium text-[#177e4f]">
              with complete clarity.
            </span>
          </h1>

          <div className="grid lg:grid-cols-12 gap-10 items-center pt-2">
            <div className="lg:col-span-7 space-y-8">
              <p className="text-lg sm:text-xl text-[#061b0d] font-normal leading-relaxed max-w-xl">
                Navigate government assistance effortlessly. Discover verified grants, understand your eligibility transparently, and prepare your documentation in minutes.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/register">
                  <button className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#061b0d] text-[#c9f3ce] text-sm font-bold tracking-wide hover:bg-[#177e4f] hover:text-white transition-all duration-300 shadow-md">
                    <span>Begin Assessment</span>
                    <ArrowRight size={16} className="text-[#4ae278] group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <a 
                  href="#pathway" 
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#061b0d] hover:text-[#177e4f] transition-colors px-6 py-4 rounded-full bg-white/60 hover:bg-white backdrop-blur-md border border-[#061b0d]/10 shadow-sm"
                >
                  <span>How It Works</span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>

            <div className="glass-panel lg:col-span-5 flex flex-col gap-4 p-8 rounded-3xl shadow-md">
              <div className="flex items-center gap-4 text-sm font-bold text-[#061b0d]">
                <div className="w-9 h-9 rounded-xl bg-[#177e4f]/15 text-[#177e4f] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-[#061b0d]">Zero Tracking</p>
                  <p className="text-xs font-normal text-[#0a2e14]/80">No commercial storage of personal traits</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm font-bold text-[#061b0d] pt-3 border-t border-[#061b0d]/10">
                <div className="w-9 h-9 rounded-xl bg-[#177e4f]/15 text-[#177e4f] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-[#061b0d]">Direct State Data</p>
                  <p className="text-xs font-normal text-[#0a2e14]/80">Synchronized across central & state gazettes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Process Flow Cards */}
          <div className="mt-20 pt-10 border-t border-[#061b0d]/15">
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-bold uppercase tracking-widest text-[#061b0d]">
                Execution Sequence
              </span>
              <span className="text-sm font-bold text-[#177e4f]">
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
                  className="rounded-3xl bg-white/65 backdrop-blur-xl border border-white/80 p-6 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-2xl bg-[#177e4f] text-[#c9f3ce] font-bold text-sm flex items-center justify-center mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-[#061b0d] mb-1.5">{step.title}</h3>
                  <p className="text-sm text-[#0a2e14]/85 font-normal leading-relaxed">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pathway Section: Lucid Floating Workflow */}
      <section id="pathway" className="relative py-28 w-full px-6 sm:px-12 lg:px-20 xl:px-28 border-t border-[#061b0d]/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-3xl sm:text-5xl font-normal text-[#061b0d] tracking-tight">
                A clear passage to support.
              </h2>
            </div>
            <span className="text-sm font-bold text-[#061b0d]/70 tracking-wider uppercase">
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
                  className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/80 p-7 shadow-sm hover:shadow-md hover:bg-white/85 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 bg-[#177e4f]/10 text-[#177e4f] rounded-2xl flex items-center justify-center mb-6">
                      <Icon size={22} strokeWidth={2} />
                    </div>
                    <h3 className="font-bold text-[#061b0d] text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-[#0a2e14]/85 leading-relaxed font-normal">{item.desc}</p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-[#061b0d]/10 text-xs font-bold text-[#177e4f]">
                    REF // 0{idx + 1}
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
              <h2 className="text-3xl sm:text-5xl font-normal text-[#061b0d] tracking-tight">
                Built on public integrity.
              </h2>
            </div>
            <span className="text-sm font-bold text-[#061b0d]/70 tracking-wider uppercase">
              Standards & Governance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                idx: '01',
                title: 'Explainable Criteria', 
                tag: 'Transparency',
                desc: 'Full breakdown of every matched rule so citizens know exactly why an application passes or needs supplementary verification.' 
              },
              { 
                idx: '02',
                title: 'Zero Intermediaries', 
                tag: 'Autonomy',
                desc: 'Direct guidance to nodal portals and designated grievance counters, reducing dependency on commission-based agents.' 
              },
              { 
                idx: '03',
                title: 'Plain Language', 
                tag: 'Reach',
                desc: 'Complex legal terminology distilled into readable citizen requirements.' 
              }
            ].map((benefit) => (
              <div 
                key={benefit.idx} 
                className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/80 p-8 shadow-sm hover:shadow-md hover:bg-white/85 transition-all duration-300"
              >
                <div className="text-sm font-bold text-[#177e4f] mb-3">
                  [ {benefit.idx} ]
                </div>
                <h3 className="text-xl font-bold text-[#061b0d] mb-2">{benefit.title}</h3>
                <span className="text-xs font-bold uppercase tracking-widest text-[#177e4f] mb-4 block">
                  {benefit.tag}
                </span>
                <p className="text-sm text-[#061b0d]/85 font-normal leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-16 px-6 sm:px-12 lg:px-20 xl:px-28 text-sm font-medium text-[#061b0d]/80 border-t border-[#061b0d]/15 bg-white/30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[#061b0d]/15">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#177e4f]" />
            <span className="text-[#061b0d] tracking-widest uppercase font-bold text-base">SAHAYAK NAVIGATOR</span>
          </div>

          <div className="flex flex-wrap items-center gap-8 text-sm font-semibold">
            <a href="#hero" className="hover:text-[#177e4f] transition-colors">Overview</a>
            <a href="#pathway" className="hover:text-[#177e4f] transition-colors">Pathway</a>
            <a href="#benefits" className="hover:text-[#177e4f] transition-colors">Assurance</a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-normal text-[#061b0d]/70">
          <p>© 2026 Sahayak. Built for Smart India Hackathon.</p>
          <p className="uppercase tracking-wider text-[#177e4f] font-bold">Verified Information Portal</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
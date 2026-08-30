import React, { useState } from 'react';
import { Navbar, Sidebar } from '../components';
import { ChevronDown, Sparkles } from 'lucide-react';
import './Dashboard.css';

const faqs = [
  {
    id: 1,
    question: 'What is Sahayak?',
    answer: 'Sahayak is an algorithmic benefit navigator designed to match citizen criteria against public welfare programs published across central and state departmental databases.'
  },
  {
    id: 2,
    question: 'Does Sahayak guarantee eligibility?',
    answer: 'No. The platform performs indicative matching according to codified guidelines. Authoritative eligibility decisions remain strictly with the respective department nodal officers.'
  },
  {
    id: 3,
    question: 'Does Sahayak process financial transactions or claim filings directly?',
    answer: 'No. Sahayak provides procedural guidance and directs citizens directly to official state sub-domains, eliminating third-party intermediaries.'
  },
  {
    id: 4,
    question: 'How is user telemetry and evaluation data preserved?',
    answer: 'Data runs locally within client storage for this demonstration session without third-party sharing.'
  }
];

export const Help = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="dashboard-page-canvas flex min-h-screen w-full font-dashboard selection:bg-[#2fe066] selection:text-[#061b0d] relative overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Help & FAQ" />
        <main className="flex-1 overflow-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-10">
          <div className="mx-auto max-w-6xl">
            <div className="dashboard-greeting mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#177e4f]/15 text-[#061b0d] text-xs font-bold uppercase tracking-wider border border-[#177e4f]/25 mb-3">
                <Sparkles size={14} className="text-[#177e4f]" />
                <span>Documentation</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#061b0d] tracking-tight">
                Frequently Asked Questions
              </h1>
            </div>

            <div className="space-y-4 mb-10">
              {faqs.map(faq => (
                <div
                  key={faq.id}
                  className="rounded-[1.5rem] bg-white/55 border border-[#a8d2b5] p-6 transition cursor-pointer shadow-sm shadow-[#177e4f]/5 hover:bg-white/70"
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm sm:text-base font-bold text-[#061b0d]">{faq.question}</h3>
                    <ChevronDown
                      size={18}
                      className={`text-[#177e4f] transition-transform duration-200 flex-shrink-0 ${expandedId === faq.id ? 'rotate-180' : ''}`}
                    />
                  </div>
                  {expandedId === faq.id && (
                    <p className="text-xs sm:text-sm text-[#0a2e14]/75 font-medium mt-4 leading-relaxed border-t border-[#a8d2b5] pt-4">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-[#a8d2b5] bg-white/55 p-6 shadow-sm shadow-[#177e4f]/5">
              <h2 className="text-sm font-bold text-[#061b0d] mb-1">Public Demonstration Notice</h2>
              <p className="text-xs text-[#0a2e14]/75 font-medium leading-relaxed">
                Platform engineered for the Smart India Hackathon. Scheme definitions, rulesets, and calculation matrices illustrate system capabilities and do not represent verified governmental commitments.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Help;
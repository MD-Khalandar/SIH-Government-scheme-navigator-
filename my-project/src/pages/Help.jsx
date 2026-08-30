import React, { useState } from 'react';
import { Navbar, Sidebar } from '../components';
import { ChevronDown } from 'lucide-react';

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
    <div className="flex min-h-screen w-full bg-[#c9f3ce] text-[#14341e] font-sans selection:bg-[#4ae278] selection:text-[#14341e]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Help & FAQ" />
        <main className="flex-1 overflow-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-10">
          <div className="w-full">
            <div className="mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-[#177e4f]">Documentation</span>
              <h1 className="text-3xl sm:text-4xl font-light text-[#14341e] tracking-tight mt-1">Frequently Asked Questions</h1>
            </div>

            <div className="space-y-4 mb-10">
              {faqs.map(faq => (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-white/50 backdrop-blur-md border border-white/70 p-6 transition cursor-pointer hover:bg-white/70"
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm sm:text-base font-normal text-[#14341e]">{faq.question}</h3>
                    <ChevronDown
                      size={18}
                      className={`text-[#177e4f] transition-transform duration-200 flex-shrink-0 ${expandedId === faq.id ? 'rotate-180' : ''}`}
                    />
                  </div>
                  {expandedId === faq.id && (
                    <p className="text-xs sm:text-sm text-[#14341e]/70 font-light mt-4 leading-relaxed border-t border-[#a9c7b1]/30 pt-4">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-3xl bg-white/30 backdrop-blur-sm border border-[#a9c7b1]/40 p-6">
              <h2 className="text-sm font-normal text-[#14341e] mb-1">Public Demonstration Notice</h2>
              <p className="text-xs text-[#14341e]/70 font-light leading-relaxed">
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
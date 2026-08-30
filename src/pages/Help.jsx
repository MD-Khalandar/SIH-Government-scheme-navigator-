import React, { useState } from 'react';
import { Navbar, Sidebar, Card } from '../components';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: 'What is Sahayak?',
    answer: 'Sahayak is a Government Benefits Navigator that helps citizens discover potentially eligible government schemes based on their personal situation.'
  },
  {
    id: 2,
    question: 'Does Sahayak guarantee eligibility?',
    answer: 'No. Sahayak only provides guidance based on the information you provide. Final eligibility is determined by the respective government authorities.'
  },
  {
    id: 3,
    question: 'Does Sahayak submit applications?',
    answer: 'No. Sahayak provides guidance on the application process. You must submit applications directly to the official government portals.'
  },
  {
    id: 4,
    question: 'Is my data stored securely?',
    answer: 'Your data is stored locally in this demo application and is not shared with third parties.'
  },
  {
    id: 5,
    question: 'Can I update my profile later?',
    answer: 'Yes, you can update your profile anytime in the settings. This will help refine your scheme recommendations.'
  }
];

export const Help = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Help & FAQ" />

        <main className="flex-1 bg-brand-bg overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Help & FAQ</h1>

            <div className="space-y-4 mb-12">
              {faqs.map(faq => (
                <Card
                  key={faq.id}
                  className="cursor-pointer"
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${expandedId === faq.id ? 'rotate-180' : ''}`}
                    />
                  </div>
                  {expandedId === faq.id && (
                    <p className="text-gray-600 mt-4">{faq.answer}</p>
                  )}
                </Card>
              ))}
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <h2 className="font-bold text-gray-900 mb-2">Important Disclaimer</h2>
              <p className="text-sm text-gray-700">
                This is a demo application for Smart India Hackathon. The scheme data and eligibility rules are for demonstration purposes only and do not represent actual government policies. Please verify all information with official government sources.
              </p>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Help;

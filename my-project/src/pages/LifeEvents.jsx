import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { lifeEvents } from '../data/mockSchemes';
import { GraduationCap, Briefcase, Wheat, Baby, Home, Rocket, Users, Accessibility, ArrowRight } from 'lucide-react';

const iconMap = { GraduationCap, Briefcase, Wheat, Baby, Home, Rocket, Users, Accessibility };

export const LifeEvents = () => {
  const navigate = useNavigate();
  const { updateLifeEvents } = useProfile();
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleEvent = (eventLabel) => {
    setSelectedEvents(prev =>
      prev.includes(eventLabel) ? prev.filter(e => e !== eventLabel) : [...prev, eventLabel]
    );
  };

  const handleContinue = async () => {
    if (selectedEvents.length === 0) return;
    setLoading(true);
    try {
      await updateLifeEvents(selectedEvents);
      navigate('/app/eligibility-profile');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#c9f3ce] text-[#14341e] font-sans selection:bg-[#4ae278] selection:text-[#14341e] px-6 sm:px-12 lg:px-20 xl:px-28 py-12">
      <div className="w-full">
        <div className="mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#177e4f]">Milestones</span>
          <h1 className="text-3xl sm:text-4xl font-light text-[#14341e] tracking-tight mt-1">What stage reflects your focus?</h1>
          <p className="text-sm sm:text-base text-[#14341e]/70 font-light mt-1">
            Choose circumstances relevant to your household to curate pertinent assistance directives.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {lifeEvents.map((event) => {
            const IconComponent = iconMap[event.icon] || Users;
            const isSelected = selectedEvents.includes(event.label);
            return (
              <div
                key={event.id}
                onClick={() => toggleEvent(event.label)}
                className={`p-6 rounded-3xl cursor-pointer transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[#177e4f] text-white border-[#177e4f] shadow-md'
                    : 'bg-white/50 backdrop-blur-md border-white/80 hover:bg-white/80 text-[#14341e]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  isSelected ? 'bg-white/20 text-[#c9f3ce]' : 'bg-[#177e4f]/10 text-[#177e4f]'
                }`}>
                  <IconComponent size={20} strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-normal mb-1">{event.label}</h3>
                <p className={`text-xs font-light leading-relaxed ${isSelected ? 'text-white/80' : 'text-[#14341e]/60'}`}>
                  {event.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#14341e]/10">
          <button
            onClick={() => navigate('/app/onboarding')}
            className="px-6 py-2.5 rounded-full bg-white/60 hover:bg-white text-xs font-light text-[#14341e] border border-[#a9c7b1]/50 transition"
          >
            Back
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/app/eligibility-profile')}
              className="text-xs text-[#14341e]/60 hover:text-[#177e4f] px-3 py-2 transition"
            >
              Skip
            </button>
            <button
              onClick={handleContinue}
              disabled={selectedEvents.length === 0 || loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#177e4f] disabled:opacity-40 text-white text-xs font-normal hover:bg-[#14341e] transition shadow-sm"
            >
              <span>Continue ({selectedEvents.length})</span>
              <ArrowRight size={14} className="text-[#4ae278]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeEvents;
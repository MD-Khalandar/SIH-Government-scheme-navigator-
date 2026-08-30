import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { lifeEvents } from '../data/mockSchemes';
import { LifeEventCard, Button, Card } from '../components';
import { GraduationCap, Briefcase, Wheat, Baby, Home, Rocket, Users, Accessibility } from 'lucide-react';

const iconMap = {
  GraduationCap, Briefcase, Wheat, Baby, Home, Rocket, Users, Accessibility
};

export const LifeEvents = () => {
  const navigate = useNavigate();
  const { updateLifeEvents } = useProfile();
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleEvent = (eventLabel) => {
    setSelectedEvents(prev =>
      prev.includes(eventLabel)
        ? prev.filter(e => e !== eventLabel)
        : [...prev, eventLabel]
    );
  };

  const handleContinue = async () => {
    if (selectedEvents.length === 0) {
      alert('Please select at least one life event');
      return;
    }

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
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            What's happening in your life?
          </h1>
          <p className="text-lg text-gray-600">
            Choose what you'd like help with. You can select multiple options.
          </p>
        </div>

        {/* Life Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {lifeEvents.map((event) => {
            const IconComponent = iconMap[event.icon];
            return (
              <LifeEventCard
                key={event.id}
                icon={IconComponent}
                label={event.label}
                description={event.description}
                isSelected={selectedEvents.includes(event.label)}
                onClick={() => toggleEvent(event.label)}
              />
            );
          })}
        </div>

        {/* Info Box */}
        <Card className="bg-blue-50 border-blue-200 mb-8">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Your selection helps us find the most relevant government schemes for your situation.
          </p>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/app/onboarding')}
          >
            Back
          </Button>
          <Button
            onClick={handleContinue}
            loading={loading}
            disabled={selectedEvents.length === 0}
            className="ml-auto"
          >
            Continue ({selectedEvents.length} selected)
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/app/eligibility-profile')}
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LifeEvents;

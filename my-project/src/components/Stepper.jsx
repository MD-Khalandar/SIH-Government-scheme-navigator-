import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export const Stepper = ({
  steps = [],
  currentStep = 1,
  orientation = 'horizontal'
}) => {
  const isVertical = orientation === 'vertical';

  if (isVertical) {
    return (
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  index + 1 <= currentStep ? 'bg-green-600' : 'bg-gray-400'
                }`}
              >
                {index + 1 <= currentStep ? <CheckCircle2 size={24} /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-1 h-12 ${index + 1 < currentStep ? 'bg-green-600' : 'bg-gray-300'}`} />
              )}
            </div>
            <div className="flex-1 pt-2">
              <h3 className="font-semibold text-gray-900">{step.title}</h3>
              {step.description && (
                <p className="text-sm text-gray-600">{step.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                index + 1 <= currentStep ? 'bg-brand-blue' : 'bg-gray-300'
              }`}
            >
              {index + 1 <= currentStep ? <CheckCircle2 size={24} /> : index + 1}
            </div>
            <p className="text-xs font-medium text-gray-700 mt-2 text-center">{step.title}</p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 ${
                index + 1 < currentStep ? 'bg-brand-blue' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;

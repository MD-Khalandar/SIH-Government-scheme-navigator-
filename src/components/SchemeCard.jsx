import React from 'react';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import Card from './Card';
import { formatCurrency, getStatusLabel, getStatusColor } from '../utils/formatters';

export const SchemeCard = ({
  scheme,
  eligibility,
  onViewDetails,
  onSave,
  isSaved = false
}) => {
  if (!scheme) return null;

  const matchPercentage = eligibility?.matchPercentage || 0;
  const status = matchPercentage === 100 ? 'fully-matched' : 
                 matchPercentage >= 75 ? 'high-match' :
                 matchPercentage >= 50 ? 'partial-match' : 'low-match';

  return (
    <Card className="hover:shadow-md transition-all cursor-pointer" hover>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-bold text-gray-900">{scheme.name}</h3>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-sm text-gray-600">{scheme.category}</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-600">{scheme.ministry}</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-600">{scheme.state}</span>
          </div>
        </div>

        {/* Benefit */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Potential Benefit</p>
          <p className="text-2xl font-bold text-brand-blue mt-1">
            {formatCurrency(scheme.benefit?.amount)}
            {scheme.benefit?.frequency !== 'one-time' && (
              <span className="text-sm text-gray-600 font-normal ml-2">/{scheme.benefit?.frequency}</span>
            )}
          </p>
        </div>

        {/* Eligibility */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Match Score</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
              {matchPercentage}% Match
            </span>
          </div>
          <div className="space-y-2">
            {eligibility?.matchedRules?.slice(0, 3).map((rule, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700 capitalize">
                  {rule.field.replace(/([A-Z])/g, ' $1')}
                </span>
              </div>
            ))}
            {eligibility?.failedRules?.length > 0 && (
              eligibility.failedRules.slice(0, 2).map((rule, index) => (
                <div key={`failed-${index}`} className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
                  <span className="text-sm text-amber-700 capitalize">
                    {rule.field.replace(/([A-Z])/g, ' $1')} needed
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Documents */}
        {scheme.documents?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Documents Required: {scheme.documents.length}</p>
            <div className="flex flex-wrap gap-2">
              {scheme.documents.slice(0, 3).map((doc, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {doc}
                </span>
              ))}
              {scheme.documents.length > 3 && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  +{scheme.documents.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={onViewDetails}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-brand-navy transition-colors"
          >
            View Details
            <ArrowRight size={16} />
          </button>
          <button
            onClick={onSave}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              isSaved
                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default SchemeCard;

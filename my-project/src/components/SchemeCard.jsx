import React from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Bookmark, BookmarkCheck } from 'lucide-react';
import Card from './Card';
import { formatCurrency, getStatusColor } from '../utils/formatters';

export const SchemeCard = ({
  scheme,
  eligibility,
  onViewDetails,
  onSave,
  isSaved = false
}) => {
  if (!scheme) return null;

  const matchPercentage = eligibility?.matchPercentage || 0;
  const status =
    matchPercentage === 100 ? 'fully-matched' :
    matchPercentage >= 75 ? 'high-match' :
    matchPercentage >= 50 ? 'partial-match' : 'low-match';

  return (
    <Card className="rounded-[28px] border border-[#dfeee3] bg-white/75 p-5 shadow-[0_18px_50px_rgba(20,52,30,0.06)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(20,52,30,0.1)]" hover>
      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-xl font-medium text-[#14341e]">{scheme.name}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#14341e]/65">
              <span>{scheme.category}</span>
              <span className="text-[#14341e]/35">•</span>
              <span>{scheme.ministry}</span>
              <span className="text-[#14341e]/35">•</span>
              <span>{scheme.state}</span>
            </div>
          </div>

          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(status)}`}>
            {matchPercentage}% match
          </span>
        </div>

        <div className="rounded-2xl border border-[#cfe9d5] bg-[#f1fff5] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[#14341e]/60">Potential benefit</p>
          <p className="mt-2 text-2xl font-light text-[#14341e]">
            {formatCurrency(scheme.benefit?.amount)}
            {scheme.benefit?.frequency !== 'one-time' && (
              <span className="ml-2 text-sm text-[#14341e]/65">/{scheme.benefit?.frequency}</span>
            )}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#14341e]">Eligibility snapshot</span>
            <span className="text-xs uppercase tracking-[0.16em] text-[#177e4f]">Live</span>
          </div>

          <div className="space-y-2">
            {eligibility?.matchedRules?.slice(0, 3).map((rule, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-[#14341e]/75">
                <CheckCircle2 size={16} className="text-[#177e4f] flex-shrink-0" />
                <span className="capitalize">{rule.field.replace(/([A-Z])/g, ' $1')}</span>
              </div>
            ))}

            {eligibility?.failedRules?.length > 0 &&
              eligibility.failedRules.slice(0, 2).map((rule, index) => (
                <div key={`failed-${index}`} className="flex items-center gap-2 text-sm text-amber-700">
                  <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
                  <span className="capitalize">{rule.field.replace(/([A-Z])/g, ' $1')} needed</span>
                </div>
              ))}
          </div>
        </div>

        {scheme.documents?.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-[#14341e]">Documents required: {scheme.documents.length}</p>
            <div className="flex flex-wrap gap-2">
              {scheme.documents.slice(0, 3).map((doc, index) => (
                <span key={index} className="rounded-full bg-[#edf7ef] px-2.5 py-1 text-xs text-[#14341e]/70">
                  {doc}
                </span>
              ))}
              {scheme.documents.length > 3 && (
                <span className="rounded-full bg-[#edf7ef] px-2.5 py-1 text-xs text-[#14341e]/70">
                  +{scheme.documents.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 border-t border-[#dfeee3] pt-4">
          <button
            onClick={onViewDetails}
            className="flex-1 rounded-full bg-[#177e4f] px-4 py-2.5 text-sm text-white transition hover:bg-[#14341e]"
          >
            <span className="inline-flex items-center justify-center gap-2">
              View details
              <ArrowRight size={15} className="text-[#caffd5]" />
            </span>
          </button>

          <button
            onClick={onSave}
            className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm transition ${
              isSaved
                ? 'border-[#a8d2b5] bg-[#edf7ef] text-[#177e4f] hover:bg-[#e0f5e7]'
                : 'border-[#cfe9d5] bg-[#f7fbf8] text-[#14341e]/80 hover:bg-white'
            }`}
          >
            {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default SchemeCard;

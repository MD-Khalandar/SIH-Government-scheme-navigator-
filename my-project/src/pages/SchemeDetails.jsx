import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, LoadingState, ProgressBar } from '../components';
import { schemeService } from '../services/schemeService';
import { documentService } from '../services/documentService';
import { applicationService } from '../services/applicationService';
import { formatCurrency } from '../utils/formatters';
import { ArrowLeft, ExternalLink, CheckCircle2 } from 'lucide-react';

export const SchemeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [documentReadiness, setDocumentReadiness] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const loadScheme = async () => {
      setLoading(true);
      try {
        const res = await schemeService.getSchemeById(id);
        setScheme(res.data);
        const saved = await schemeService.isSchemeSaved(Number(id));
        setIsSaved(saved);
        const docsRes = await documentService.getSchemeDocuments(res.data);
        setDocuments(docsRes.data);
        const ready = docsRes.data.filter(d => d.ready).length;
        const readiness = docsRes.data.length > 0 ? (ready / docsRes.data.length) * 100 : 0;
        setDocumentReadiness(readiness);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadScheme();
  }, [id]);

  const handleSave = async () => {
    try {
      const numericId = Number(id);
      if (isSaved) {
        await schemeService.removeSavedScheme(numericId);
        setIsSaved(false);
      } else {
        await schemeService.saveScheme(numericId);
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async () => {
    try {
      await applicationService.createApplication(scheme.id, scheme.name);
      if (scheme.officialUrl) {
        window.open(scheme.officialUrl, '_blank', 'noopener,noreferrer');
      }
      navigate('/app/applications');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full bg-[#c9f3ce]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <div className="flex-1 flex items-center justify-center">
            <LoadingState message="Extracting departmental directive terms..." />
          </div>
        </div>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="flex min-h-screen w-full bg-[#c9f3ce]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/70 p-8 max-w-sm">
              <p className="text-xs text-rose-800 mb-4">{error || 'Scheme directive not localized'}</p>
              <button
                onClick={() => navigate('/app/dashboard')}
                className="px-5 py-2 rounded-full bg-[#177e4f] text-white text-xs transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-[#c9f3ce] text-[#14341e] font-sans selection:bg-[#4ae278] selection:text-[#14341e]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-10">
          <div className="w-full">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs font-light text-[#177e4f] hover:text-[#14341e] transition mb-8"
            >
              <ArrowLeft size={15} />
              <span>Back to Directory</span>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-light text-[#14341e] tracking-tight">{scheme.name}</h1>
                <p className="text-xs sm:text-sm text-[#14341e]/60 font-light mt-1">
                  {scheme.ministry} • {scheme.state}
                </p>
              </div>
              <button
                onClick={handleSave}
                className={`px-5 py-2 rounded-full text-xs transition self-start ${
                  isSaved
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-white/60 text-[#14341e] border border-[#a9c7b1]/40 hover:bg-white'
                }`}
              >
                {isSaved ? 'Remove Bookmark' : 'Bookmark Scheme'}
              </button>
            </div>

            <div className="rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 p-6 sm:p-8 mb-6 shadow-sm">
              <span className="text-xs font-mono uppercase tracking-widest text-[#177e4f]">Entitlement Calculation</span>
              <p className="text-3xl sm:text-4xl font-light text-[#14341e] mt-1">
                {formatCurrency(scheme.benefit?.amount)}
                {scheme.benefit?.frequency !== 'one-time' && (
                  <span className="text-sm font-light text-[#14341e]/60 ml-2">/ {scheme.benefit?.frequency}</span>
                )}
              </p>
            </div>

            <div className="rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 p-6 sm:p-8 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-normal text-[#14341e]">Application Readiness Status</h2>
                <span className="text-xs font-mono text-[#177e4f]">{documents.filter(d => d.ready).length} / {documents.length} verified</span>
              </div>
              <ProgressBar value={documentReadiness} />
            </div>

            <div className="rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 p-6 sm:p-8 mb-6 shadow-sm">
              <h2 className="text-sm font-normal text-[#14341e] mb-2">Scope & Objectives</h2>
              <p className="text-xs sm:text-sm text-[#14341e]/75 font-light leading-relaxed">{scheme.description}</p>
            </div>

            <div className="rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 p-6 sm:p-8 mb-6 shadow-sm">
              <h2 className="text-sm font-normal text-[#14341e] mb-4">Statutory Criteria</h2>
              <div className="space-y-3">
                {(scheme.eligibilityCriteria || scheme.eligibilityRules || []).map((rule, idx) => {
                  const label = typeof rule === 'string' ? rule : rule.field?.replace(/([A-Z])/g, ' $1') || 'Eligibility Requirement';
                  const description = typeof rule === 'string'
                    ? 'Check the official criteria.'
                    : `Condition: ${rule.operator} ${rule.value}`;

                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-[#177e4f] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs sm:text-sm font-normal text-[#14341e] capitalize">{label}</p>
                        <p className="text-xs text-[#14341e]/50 font-light">{description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button
                onClick={handleApply}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#177e4f] text-white text-xs font-normal hover:bg-[#14341e] transition shadow-sm"
              >
                <span>Proceed to Department Desk</span>
                <ExternalLink size={14} className="text-[#4ae278]" />
              </button>
              <button
                onClick={() => navigate('/app/documents')}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/60 hover:bg-white text-xs font-light text-[#14341e] border border-[#a9c7b1]/40 transition"
              >
                Inspect Proofs
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SchemeDetails;
import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, ProgressBar, EmptyState } from '../components';
import { documentService } from '../services/documentService';
import { FileText, CheckCircle2, Sparkles } from 'lucide-react';
import dataAtWorkIllustration from '../assets/undraw_data-at-work_3tbf.svg';
import './Dashboard.css';

export const Documents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const res = await documentService.getDocuments();
      setDocuments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDocument = async (docId) => {
    try {
      const doc = documents.find((d) => d.id === docId);
      await documentService.updateDocumentStatus(docId, !doc.ready);
      loadDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  const readyCount = documents.filter((d) => d.ready).length;
  const readiness = documents.length > 0 ? (readyCount / documents.length) * 100 : 0;

  return (
    <div className="dashboard-page-canvas flex min-h-screen w-full font-dashboard selection:bg-[#2fe066] selection:text-[#061b0d] relative overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Documents" />
        
        <main className="flex-1 overflow-y-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-8 sm:py-10">
          <div className="mx-auto max-w-6xl">
            
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#177e4f]/15 text-[#061b0d] text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles size={13} className="text-[#177e4f]" />
                  <span>Verification Prerequisites</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#061b0d] tracking-tight">
                  Document Checklist
                </h1>
                <p className="text-xs sm:text-sm font-medium text-[#0a2e14] mt-1">
                  Maintain and verify supporting proofs required across matched government schemes.
                </p>
              </div>

              <img
                src={dataAtWorkIllustration}
                alt="Data at work illustration"
                className="h-20 w-auto opacity-90 sm:h-24"
              />
            </div>

            {/* Readiness Card */}
            <div className="documents-glass-card rounded-[2rem] p-6 sm:p-8 mb-8 border border-[#a8d2b5] bg-white/55 shadow-sm shadow-[#177e4f]/5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-extrabold text-[#061b0d]">Prerequisite Readiness</p>
                <span className="text-xs font-bold text-[#177e4f]">
                  {readyCount} of {documents.length} Records Marked Ready
                </span>
              </div>
              <ProgressBar value={readiness} />
            </div>

            {/* Document Items */}
            {documents.length === 0 ? (
              <div className="documents-glass-card rounded-[2rem] p-12 text-center border border-[#a8d2b5] bg-white/55 shadow-sm shadow-[#177e4f]/5">
                <EmptyState
                  icon={FileText}
                  title="No documents populated"
                  description="Documents required by saved or recommended schemes will automatically display here."
                />
              </div>
            ) : (
              <div className="grid gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="document-item-card rounded-2xl p-5 flex items-center justify-between border border-[#a8d2b5] bg-white/60 shadow-sm shadow-[#177e4f]/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#177e4f]/15 text-[#177e4f] flex items-center justify-center flex-shrink-0">
                        <FileText size={18} strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#061b0d]">{doc.name}</p>
                        <p className="text-xs font-semibold text-[#0a2e14]/65 mt-0.5">
                          {doc.ready ? 'Marked Ready for Submission' : 'Pending Citizen Verification'}
                        </p>
                      </div>
                    </div>
                    
                    <label className="flex items-center gap-2 cursor-pointer bg-white/80 px-4 py-2 rounded-full border border-[#061b0d]/15">
                      <input
                        type="checkbox"
                        checked={doc.ready}
                        onChange={() => handleToggleDocument(doc.id)}
                        className="w-4 h-4 rounded text-[#177e4f] focus:ring-[#177e4f] border-[#061b0d]/30"
                      />
                      <span className="text-xs font-bold text-[#061b0d]">Ready</span>
                    </label>
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default Documents;
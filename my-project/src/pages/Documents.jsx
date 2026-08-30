import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, Card, Button, ProgressBar, EmptyState } from '../components';
import { documentService } from '../services/documentService';
import { FileText, CheckCircle2 } from 'lucide-react';

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
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDocument = async (docId) => {
    try {
      const doc = documents.find(d => d.id === docId);
      await documentService.updateDocumentStatus(docId, !doc.ready);
      loadDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  const readyCount = documents.filter(d => d.ready).length;
  const readiness = documents.length > 0 ? (readyCount / documents.length) * 100 : 0;

  return (
    <div className="flex min-h-screen w-full bg-[#c9f3ce] text-[#14341e] font-sans selection:bg-[#4ae278] selection:text-[#14341e]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Documents" />
        <main className="flex-1 overflow-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-10">
          <div className="w-full">
            <div className="mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-[#177e4f]">Verification</span>
              <h1 className="text-3xl sm:text-4xl font-light text-[#14341e] tracking-tight mt-1 mb-6">Document Checklist</h1>
              
              <div className="p-6 rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-normal text-[#14341e]">Document Readiness</p>
                  <span className="text-xs font-mono text-[#177e4f]">{readyCount} of {documents.length} verified</span>
                </div>
                <ProgressBar value={readiness} />
              </div>
            </div>

            {documents.length === 0 ? (
              <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/70 p-12 text-center">
                <EmptyState
                  icon={FileText}
                  title="No documents required"
                  description="Documents requested by selected schemes will populate here automatically"
                />
              </div>
            ) : (
              <div className="grid gap-4">
                {documents.map(doc => (
                  <div key={doc.id} className="rounded-2xl bg-white/50 backdrop-blur-md border border-white/70 p-5 flex items-center justify-between transition hover:bg-white/70">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#177e4f]/10 text-[#177e4f] flex items-center justify-center">
                        <FileText size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-normal text-[#14341e]">{doc.name}</p>
                        <p className="text-xs text-[#14341e]/50 font-light">
                          {doc.ready ? 'Marked Ready' : 'Pending Verification'}
                        </p>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={doc.ready}
                        onChange={() => handleToggleDocument(doc.id)}
                        className="w-4 h-4 rounded text-[#177e4f] focus:ring-[#177e4f] border-[#a9c7b1]"
                      />
                      <span className="text-xs font-light text-[#14341e]/70">Ready</span>
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
import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, Card, Button, ProgressBar, EmptyState } from '../components';
import { documentService } from '../services/documentService';
import { FileText } from 'lucide-react';

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
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Documents" />

        <main className="flex-1 bg-brand-bg overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Document Checklist</h1>
              
              <Card className="bg-blue-50 border-blue-200">
                <p className="font-semibold text-gray-900 mb-3">Document Readiness</p>
                <ProgressBar value={readiness} />
                <p className="text-sm text-gray-600 mt-2">
                  {readyCount} of {documents.length} documents ready
                </p>
              </Card>
            </div>

            {documents.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No documents added"
                description="Documents needed for schemes will appear here"
              />
            ) : (
              <div className="grid gap-4">
                {documents.map(doc => (
                  <Card key={doc.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <FileText size={24} className="text-brand-blue" />
                        <div>
                          <p className="font-semibold text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-600">
                            {doc.ready ? '✓ Ready' : 'Not ready'}
                          </p>
                        </div>
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={doc.ready}
                          onChange={() => handleToggleDocument(doc.id)}
                          className="w-5 h-5 rounded"
                        />
                        <span className="text-sm text-gray-700">Mark as ready</span>
                      </label>
                    </div>
                  </Card>
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

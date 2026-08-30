import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, LoadingState, Button, Card, ProgressBar } from '../components';
import { schemeService } from '../services/schemeService';
import { documentService } from '../services/documentService';
import { applicationService } from '../services/applicationService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ArrowLeft, ExternalLink, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const SchemeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [documentReadiness, setDocumentReadiness] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    loadScheme();
  }, [id]);

  const loadScheme = async () => {
    setLoading(true);
    try {
      const res = await schemeService.getSchemeById(id);
      setScheme(res.data);
      
      // Check if saved
      const saved = await schemeService.isSchemeSaved(parseInt(id));
      setIsSaved(saved);

      // Load documents for this scheme
      const docsRes = await documentService.getSchemeDocuments(res.data);
      setDocuments(docsRes.data);

      // Calculate document readiness
      const ready = docsRes.data.filter(d => d.ready).length;
      const readiness = docsRes.data.length > 0 ? (ready / docsRes.data.length) * 100 : 0;
      setDocumentReadiness(readiness);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (isSaved) {
        await schemeService.removeSavedScheme(parseInt(id));
        setIsSaved(false);
      } else {
        await schemeService.saveScheme(parseInt(id));
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async () => {
    try {
      await applicationService.createApplication(scheme.id, scheme.name);
      navigate(`/app/applications`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <div className="flex-1">
            <LoadingState />
          </div>
        </div>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 font-semibold">{error || 'Scheme not found'}</p>
              <Button onClick={() => navigate('/app/dashboard')} className="mt-4">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 bg-brand-bg overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-brand-blue hover:text-brand-navy font-medium mb-8"
            >
              <ArrowLeft size={20} />
              Back
            </button>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{scheme.name}</h1>
                  <p className="text-gray-600 mt-2">
                    {scheme.ministry} • {scheme.state}
                  </p>
                </div>
                <Button
                  variant={isSaved ? 'danger' : 'secondary'}
                  onClick={handleSave}
                >
                  {isSaved ? 'Remove' : 'Save'}
                </Button>
              </div>
            </div>

            {/* Benefit Card */}
            <Card className="bg-blue-50 border-blue-200 mb-8">
              <div>
                <p className="text-sm text-gray-600">Potential Benefit</p>
                <p className="text-3xl font-bold text-brand-blue mt-2">
                  {formatCurrency(scheme.benefit?.amount)}
                  {scheme.benefit?.frequency !== 'one-time' && (
                    <span className="text-base font-normal text-gray-600 ml-2">
                      / {scheme.benefit?.frequency}
                    </span>
                  )}
                </p>
              </div>
            </Card>

            {/* Document Readiness */}
            <Card className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Application Readiness</h2>
              <ProgressBar value={documentReadiness} />
              <p className="text-sm text-gray-600 mt-2">
                {documents.filter(d => d.ready).length} of {documents.length} documents ready
              </p>
            </Card>

            {/* Description */}
            <Card className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 text-base leading-relaxed">{scheme.description}</p>
            </Card>

            {/* Eligibility */}
            <Card className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Eligibility Requirements</h2>
              <div className="space-y-3">
                {scheme.eligibilityRules?.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {rule.field.replace(/([A-Z])/g, ' $1')}
                      </p>
                      <p className="text-sm text-gray-600">
                        Must be {rule.operator} {rule.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Documents */}
            <Card className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Required Documents</h2>
              <div className="space-y-2">
                {scheme.documents?.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText size={20} className="text-gray-600" />
                    <span className="text-gray-900">{doc}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Application Process */}
            <Card className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Application Process</h2>
              <ol className="space-y-3">
                {scheme.applicationSteps?.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="font-bold text-brand-blue">{idx + 1}.</span>
                    <span className="text-gray-900">{step}</span>
                  </li>
                ))}
              </ol>
            </Card>

            {/* Important Info */}
            <Card className="bg-amber-50 border-amber-200 mb-8">
              <h2 className="font-bold text-gray-900 mb-2">Important Information</h2>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Application Mode: {scheme.applicationMode}</li>
                <li>• Deadline: {formatDate(scheme.deadline)}</li>
                <li>• Last Verified: {formatDate(scheme.lastVerified)}</li>
                <li>• Official Source: {scheme.source}</li>
              </ul>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleApply} fullWidth className="sm:w-auto">
                Open Official Application
                <ExternalLink size={18} />
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/app/documents')}
                fullWidth
                className="sm:w-auto"
              >
                View Documents
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SchemeDetails;

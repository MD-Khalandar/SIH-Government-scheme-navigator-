import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, Card, Button, ProgressBar, EmptyState } from '../components';
import { applicationService } from '../services/applicationService';
import { formatDate } from '../utils/formatters';
import { CheckCircle2 } from 'lucide-react';

export const Applications = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await applicationService.getApplications();
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    'Not Started': 'bg-gray-100 text-gray-800',
    'Documents Pending': 'bg-yellow-100 text-yellow-800',
    'Ready to Apply': 'bg-blue-100 text-blue-800',
    'Applied': 'bg-purple-100 text-purple-800',
    'Under Review': 'bg-blue-100 text-blue-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800'
  };

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Applications" />

        <main className="flex-1 bg-brand-bg overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
              <Button onClick={() => navigate('/app/my-benefits')}>
                Browse Schemes
              </Button>
            </div>

            {applications.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="No applications yet"
                description="Start by browsing available schemes"
                action={() => navigate('/app/my-benefits')}
                actionLabel="Browse Schemes"
              />
            ) : (
              <div className="grid gap-6">
                {applications.map(app => (
                  <Card key={app.id}>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{app.schemeName}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Applied on {formatDate(app.applicationDate)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[app.status] || 'bg-gray-100'}`}>
                          {app.status}
                        </span>
                      </div>
                      
                      <ProgressBar value={app.progress} />
                      
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/app/schemes/${app.schemeId}`)}
                        >
                          View Scheme
                        </Button>
                      </div>
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

export default Applications;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, ProgressBar, EmptyState } from '../components';
import { applicationService } from '../services/applicationService';
import { formatDate } from '../utils/formatters';
import { CheckCircle2, ArrowRight, Sparkles, Clock } from 'lucide-react';
import orderStatusIllustration from '../assets/undraw_order-status_swsl.svg';
import './Dashboard.css';

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
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    'Not Started': 'bg-white/80 text-[#061b0d] border border-[#061b0d]/15',
    'Documents Pending': 'bg-amber-100 text-amber-900 border border-amber-300',
    'Ready to Apply': 'bg-[#c9f3ce] text-[#177e4f] border border-[#177e4f]/30',
    Applied: 'bg-[#177e4f]/15 text-[#177e4f] border border-[#177e4f]/30',
    'Under Review': 'bg-emerald-100 text-[#061b0d] border border-emerald-300',
    Approved: 'bg-[#c9f3ce] text-[#061b0d] border border-[#177e4f]/40',
    Rejected: 'bg-rose-100 text-rose-900 border border-rose-300'
  };

  const totalApplications = applications.length;
  const readyCount = applications.filter((app) => app.status === 'Ready to Apply').length;
  const approvedCount = applications.filter((app) => app.status === 'Approved').length;
  const inProgressCount = applications.filter((app) => ['Applied', 'Under Review', 'Documents Pending'].includes(app.status)).length;

  return (
    <div className="dashboard-page-canvas flex min-h-screen w-full font-dashboard selection:bg-[#2fe066] selection:text-[#061b0d] relative overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Applications" />
        
        <main className="flex-1 overflow-y-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-8 sm:py-10">
          <div className="mx-auto max-w-6xl">
            
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#177e4f]/15 text-[#061b0d] text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles size={13} className="text-[#177e4f]" />
                  <span>Citizen Submission Tracking</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#061b0d] tracking-tight">
                  Application Registry
                </h1>
                <p className="text-xs sm:text-sm font-medium text-[#0a2e14] mt-1">
                  Track verification milestones and stage readiness across applied grants.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={orderStatusIllustration}
                  alt="Application progress illustration"
                  className="h-20 w-auto opacity-90 sm:h-24"
                />
                <button
                  onClick={() => navigate('/app/my-benefits')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#061b0d] hover:bg-[#177e4f] text-[#c9f3ce] hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md"
                >
                  <span>Discover Schemes</span>
                  <ArrowRight size={14} className="text-[#4ae278]" />
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            {!loading && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Tracked', value: totalApplications },
                  { label: 'Ready to Apply', value: readyCount },
                  { label: 'In Progress', value: inProgressCount },
                  { label: 'Sanctioned', value: approvedCount }
                ].map((item) => (
                  <div key={item.label} className="application-stat-pill rounded-2xl p-4 sm:p-5 shadow-xs border border-[#a8d2b5] bg-white/50">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#0a2e14]/70">{item.label}</p>
                    <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#061b0d]">{item.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Application List */}
            {applications.length === 0 ? (
              <div className="applications-glass-card rounded-[2rem] p-12 text-center border border-[#a8d2b5] bg-white/55 shadow-sm shadow-[#177e4f]/5">
                <EmptyState
                  icon={CheckCircle2}
                  title="No active submissions"
                  description="Begin by exploring verified programs and preparing prerequisites."
                  action={() => navigate('/app/my-benefits')}
                  actionLabel="Explore Schemes"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="applications-glass-card rounded-2xl p-6 transition-all border border-[#a8d2b5] bg-white/55 shadow-sm shadow-[#177e4f]/5 hover:border-[#177e4f]/60">
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-[#061b0d]">{app.schemeName}</h3>
                          <p className="text-xs font-semibold text-[#0a2e14]/70 mt-0.5 flex items-center gap-1.5">
                            <Clock size={13} />
                            <span>Submitted on {formatDate(app.applicationDate)}</span>
                          </p>
                        </div>

                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${statusColors[app.status] || 'bg-white/80 text-[#061b0d]'}`}>
                          {app.status}
                        </span>
                      </div>

                      <ProgressBar value={app.progress} />

                      <div className="flex items-center justify-between pt-2 border-t border-[#061b0d]/10">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#0a2e14]">
                          Milestone Readiness: {app.progress || 0}%
                        </p>
                        <button
                          onClick={() => navigate(`/app/schemes/${app.schemeId}`)}
                          className="px-4 py-1.5 rounded-full bg-white/80 hover:bg-[#177e4f] hover:text-white border border-[#061b0d]/15 text-xs font-bold text-[#061b0d] transition-all"
                        >
                          View Roadmap
                        </button>
                      </div>
                    </div>
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

export default Applications;
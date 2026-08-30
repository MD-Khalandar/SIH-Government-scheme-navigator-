import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, Card, Button, ProgressBar, EmptyState } from '../components';
import { applicationService } from '../services/applicationService';
import { formatDate } from '../utils/formatters';
import { CheckCircle2, ArrowRight } from 'lucide-react';

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
    'Not Started': 'bg-white/60 text-[#14341e]/70 border border-[#a9c7b1]/40',
    'Documents Pending': 'bg-amber-100/70 text-amber-900 border border-amber-200',
    'Ready to Apply': 'bg-[#4ae278]/20 text-[#14341e] border border-[#177e4f]/20',
    'Applied': 'bg-[#177e4f]/10 text-[#177e4f] border border-[#177e4f]/20',
    'Under Review': 'bg-emerald-100 text-[#177e4f] border border-emerald-200',
    'Approved': 'bg-[#4ae278]/30 text-[#14341e] border border-[#177e4f]/30',
    'Rejected': 'bg-rose-100 text-rose-800 border border-rose-200'
  };

  return (
    <div className="flex min-h-screen w-full bg-[#c9f3ce] text-[#14341e] font-sans selection:bg-[#4ae278] selection:text-[#14341e]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Applications" />
        <main className="flex-1 overflow-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-10">
          <div className="w-full">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#177e4f]">Registry</span>
                <h1 className="text-3xl sm:text-4xl font-light text-[#14341e] tracking-tight mt-1">My Applications</h1>
              </div>
              <button 
                onClick={() => navigate('/app/my-benefits')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#177e4f] text-white text-xs sm:text-sm font-normal hover:bg-[#14341e] transition duration-200 shadow-sm self-start sm:self-auto"
              >
                <span>Browse Schemes</span>
                <ArrowRight size={14} className="text-[#4ae278]" />
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/70 p-12 text-center">
                <EmptyState
                  icon={CheckCircle2}
                  title="No applications yet"
                  description="Start by browsing available schemes and verifying your eligibility"
                  action={() => navigate('/app/my-benefits')}
                  actionLabel="Browse Schemes"
                />
              </div>
            ) : (
              <div className="grid gap-5">
                {applications.map(app => (
                  <div key={app.id} className="rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 p-6 sm:p-7 shadow-sm transition hover:bg-white/70">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base sm:text-lg font-normal text-[#14341e]">{app.schemeName}</h3>
                          <p className="text-xs text-[#14341e]/60 font-light mt-0.5">
                            Applied on {formatDate(app.applicationDate)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-light ${statusColors[app.status] || 'bg-white/60 text-[#14341e]'}`}>
                          {app.status}
                        </span>
                      </div>
                      
                      <ProgressBar value={app.progress} />

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => navigate(`/app/schemes/${app.schemeId}`)}
                          className="px-4 py-1.5 rounded-full bg-white/60 hover:bg-white text-xs text-[#14341e] border border-[#a9c7b1]/40 transition"
                        >
                          View Scheme
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
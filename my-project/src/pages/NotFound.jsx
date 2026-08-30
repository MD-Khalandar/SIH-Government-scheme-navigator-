import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen w-full bg-[#c9f3ce] text-[#14341e] font-sans flex items-center justify-center px-4 selection:bg-[#4ae278]">
      <div className="text-center max-w-md rounded-3xl bg-white/40 backdrop-blur-xl border border-white/70 p-10 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#177e4f]/10 text-[#177e4f] flex items-center justify-center mx-auto mb-5">
          <AlertCircle size={22} strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-light text-[#14341e] tracking-tight mb-2">Notice Undefined</h1>
        <p className="text-xs sm:text-sm text-[#14341e]/70 font-light mb-8 leading-relaxed">
          The requested registry coordinate could not be localized within this portal environment.
        </p>
        <Link to="/">
          <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#177e4f] hover:bg-[#14341e] text-white text-xs font-normal transition shadow-sm">
            <ArrowLeft size={14} className="text-[#4ae278]" />
            <span>Return to Primary Portal</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
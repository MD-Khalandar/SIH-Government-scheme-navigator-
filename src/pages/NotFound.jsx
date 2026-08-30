import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components';
import { AlertCircle } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="text-center">
        <AlertCircle size={64} className="text-gray-400 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. Let's get you back to your benefits.
        </p>
        <Link to="/">
          <Button>
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

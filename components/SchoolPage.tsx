
import React from 'react';
import type { School } from '../types';

interface SchoolPageProps {
  school: School;
  onBack: () => void;
}

const SchoolPage: React.FC<SchoolPageProps> = ({ school, onBack }) => {
  return (
    <div className="flex flex-col items-center animate-fade-in">
       <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <div className="flex flex-col md:flex-row items-center gap-8">
            <img 
                src={school.logoUrl} 
                alt={`${school.name} Logo`} 
                className="w-48 h-48 rounded-full border-4 border-yellow-400 object-cover shadow-lg"
            />
            <div className="text-center md:text-left">
                <h2 className="text-4xl font-bold text-yellow-400">{school.name}</h2>
                <p className="text-gray-300 mt-2 text-lg">Class Management Portal</p>
                <p className="text-gray-400 mt-4">
                    Welcome to the portal for {school.name}. Here you can manage class schedules, student attendance, and view announcements. This section is currently under development.
                </p>
            </div>
        </div>
       </div>

      <button
        onClick={onBack}
        className="mt-12 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-gray-900 transition-transform hover:scale-105"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Schools
      </button>
    </div>
  );
};

export default SchoolPage;

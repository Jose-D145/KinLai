import React, { useState } from 'react';
import LogoGrid from './components/LogoGrid';
import SchoolPage from './components/SchoolPage';
import type { School } from './types';
import { schools, ASSOCIATION_DATA } from './constants';

const App: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
  };

  const handleBackToGrid = () => {
    setSelectedSchool(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="py-6 text-center">
         <div className="flex justify-center items-center gap-4">
            <img src={ASSOCIATION_DATA.logoUrl} alt="Logo da Associação" className="h-14 w-14 border-2 border-gray-700 rounded-md" />
            <div>
              <h1 className="text-4xl font-bold text-yellow-400 tracking-wider" style={{ fontFamily: 'serif' }}>
                  {ASSOCIATION_DATA.name}
              </h1>
              <p className="text-gray-400">Portal de Gerenciamento das Escolas</p>
            </div>
         </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {selectedSchool ? (
          <SchoolPage school={selectedSchool} onBack={handleBackToGrid} />
        ) : (
          <LogoGrid schools={schools} onSchoolSelect={handleSchoolSelect} />
        )}
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>&copy; 2024 {ASSOCIATION_DATA.name}. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
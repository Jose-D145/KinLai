import React, { useState } from 'react';
import type { School } from '../types';
import { ASSOCIATION_DATA } from '../constants';

interface WhiteLabelPageProps {
  school: School;
  onBack: () => void;
}

const WhiteLabelPage: React.FC<WhiteLabelPageProps> = ({ school, onBack }) => {
  const [activeFunctionality, setActiveFunctionality] = useState(1);

  const functionalityButtons = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col w-full flex-1 animate-fade-in px-4 sm:px-8 pt-6">
      {/* Top Header */}
      <header className="w-full mb-8 pb-4 border-b border-gray-700 flex flex-col">
        {/* Top row: School info and Association name */}
        <div className="flex items-start justify-between w-full">
          {/* Left: School logo and name */}
          <div className="flex items-center gap-4">
            <img 
              src={school.logoUrl} 
              alt={`Logo de ${school.name}`}
              className="w-16 h-16 rounded-md border-2 border-gray-600 object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-yellow-400">{school.name}</h1>
            </div>
          </div>
          {/* Right: Association name */}
          <p className="text-base font-semibold text-yellow-400">{ASSOCIATION_DATA.name}</p>
        </div>
        
        {/* Bottom row: Page Title */}
        <h2 className="w-full text-center text-2xl font-bold text-gray-200 mt-4">
          Controle Administrativo e de Evolução
        </h2>
      </header>
      
      <div className="flex flex-grow gap-8 mb-8">
        {/* Left Menu */}
        <nav className="w-56 flex-shrink-0 flex flex-col">
          <div className="flex-grow flex flex-col justify-center">
            <div className="flex flex-col gap-2">
              {functionalityButtons.map((num) => (
                <button
                  key={num}
                  onClick={() => setActiveFunctionality(num)}
                  className={`w-full p-1 text-center text-sm rounded-2xl transition-colors duration-200 ${
                    activeFunctionality === num
                      ? 'bg-yellow-400 text-black font-semibold shadow-md'
                      : 'bg-yellow-100 text-black hover:bg-yellow-200'
                  }`}
                >
                  Funcionalidade {num}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 p-1 text-center text-sm rounded-2xl transition-colors duration-200 bg-gray-700 hover:bg-gray-600 text-yellow-400 font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8a5 5 0 000-10H6" />
            </svg>
            <span>Início</span>
          </button>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">
            Configuração: Funcionalidade {activeFunctionality}
          </h3>
          <div className="text-gray-400">
            <p>A área de conteúdo para a Funcionalidade {activeFunctionality} será exibida aqui. As configurações serão adicionadas conforme o desenvolvimento do projeto.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WhiteLabelPage;
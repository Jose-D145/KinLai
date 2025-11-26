// D:\ITKFA\src\components\LogoGrid.tsx (FINAL E COMPLETO)

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { School, GridItemType } from '../types';
import { ASSOCIATION_DATA } from '../constants';

interface LogoGridProps {
  schools: School[];
}

// ----------------------------------------------------------------
// DEFINIÇÃO DO COMPONENTE GridCell (Obrigatório)
// ----------------------------------------------------------------
const GridCell: React.FC<{
  item: GridItemType;
  onSelect: (schoolId: string) => void;
}> = ({ item, onSelect }) => {
  
  if ('type' in item) {
    if (item.type === 'association') {
      return (
        <div className="flex items-center justify-center aspect-square bg-gray-800 rounded-lg border border-gray-700">
          <img
            src={ASSOCIATION_DATA.logoUrl}
            alt="Logo da Associação"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
      );
    } 
    return <div className="aspect-square"></div>;
  } 

  const school = item as School;
  return (
    <button
      onClick={() => onSelect(String(school.id))}
      className="group aspect-square bg-gray-800 rounded-lg border border-gray-700 transition-all duration-300 ease-in-out hover:bg-gray-700 hover:border-yellow-500 hover:scale-105 hover:shadow-2xl hover:shadow-black/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900"
      aria-label={school.name}
    >
      <img
        src={school.logoUrl}
        alt={`Logo de ${school.name}`}
        title={school.name}
        className="object-cover w-full h-full rounded-lg transition-transform duration-300 group-hover:scale-110"
      />
    </button>
  );
};

// ----------------------------------------------------------------
// COMPONENTE PRINCIPAL: LogoGrid
// ----------------------------------------------------------------
const LogoGrid: React.FC<LogoGridProps> = ({ schools }) => {
  const navigate = useNavigate();
  const gridItems = useMemo<GridItemType[]>(() => {
    return schools.filter(s => s.logoUrl !== ASSOCIATION_DATA.logoUrl);
  }, [schools]);

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-200">
        Selecione uma Escola
      </h2>
      <p className="text-gray-400 mb-8 max-w-2xl text-center">
        Navegue pela nossa grade de escolas afiliadas. Clique em qualquer logo
        para acessar o portal da escola.
      </p>
      
      {/* CONTAINER PRINCIPAL: Largura e Centramento */}
      <div className="relative w-full max-w-7xl mx-auto px-4"> 
        
        {/* Watermark Logo - Escala Segura (Fixe de Layout) */}
        <img
          src={ASSOCIATION_DATA.logoUrl}
          alt=""
          aria-hidden="true"
          /* Escala conservadora (Default) */
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain opacity-50 pointer-events-none scale-100 lg:scale-125 2xl:scale-150"
        />
        
        {/* Grid ajustado para 7 colunas */}
        <div className="relative z-10 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-4 md:gap-6">
          {gridItems.map((item, index) => (
            <GridCell
              key={'id' in item ? item.id : `cell-${index}`}
              item={item}
              onSelect={schoolId => navigate(`/${schoolId}/login`)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoGrid;
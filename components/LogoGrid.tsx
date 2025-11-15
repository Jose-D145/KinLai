import React, { useMemo } from 'react';
import type { School, GridItemType } from '../types';
import { ASSOCIATION_DATA } from '../constants';

interface LogoGridProps {
  schools: School[];
  onSchoolSelect: (school: School) => void;
}

const GridCell: React.FC<{ item: GridItemType; onSelect: (school: School) => void }> = ({ item, onSelect }) => {
  if ('type' in item) {
    if (item.type === 'association') {
      return (
        <div className="flex items-center justify-center aspect-square bg-gray-800 rounded-lg border border-gray-700">
          <img src={ASSOCIATION_DATA.logoUrl} alt="Logo da Associação" className="object-cover w-full h-full rounded-lg" />
        </div>
      );
    }
    // Empty cell
    return <div className="aspect-square"></div>;
  }

  // School cell
  const school = item as School;
  return (
    <button
      onClick={() => onSelect(school)}
      className="group aspect-square bg-gray-800 rounded-lg border border-gray-700 transition-all duration-300 ease-in-out hover:bg-gray-700 hover:border-yellow-500 hover:scale-105 hover:shadow-2xl hover:shadow-black/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900"
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


const LogoGrid: React.FC<LogoGridProps> = ({ schools, onSchoolSelect }) => {
  
  const gridItems = useMemo<GridItemType[]>(() => {
    const items: GridItemType[] = [];
    const schoolItems = [...schools];
    const gridSize = 25;
    const centerIndex = 12;

    for (let i = 0; i < gridSize; i++) {
        if (i === centerIndex) {
            items.push({ type: 'association' });
        } else {
            const school = schoolItems.shift();
            if (school) {
                items.push(school);
            } else {
                items.push({ type: 'empty' }); // Add empty cells if schools run out
            }
        }
    }
    return items;
  }, [schools]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-200">Selecione uma Escola</h2>
      <p className="text-gray-400 mb-8 max-w-2xl text-center">Clique no logo de uma escola para ver os horários de aulas e informações. O emblema central representa a associação internacional.</p>
      <div className="grid grid-cols-5 gap-4 md:gap-6 w-full max-w-4xl mx-auto">
        {gridItems.map((item, index) => (
          <GridCell key={('id' in item) ? item.id : `cell-${index}`} item={item} onSelect={onSchoolSelect} />
        ))}
      </div>
    </div>
  );
};

export default LogoGrid;
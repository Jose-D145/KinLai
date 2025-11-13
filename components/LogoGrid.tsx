
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
          <img src={ASSOCIATION_DATA.logoUrl} alt="Association Logo" className="object-cover w-full h-full rounded-lg" />
        </div>
      );
    }
    // Empty cell - this will now be filled by 'association' type, but leaving as a fallback.
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
        alt={`${school.name} Logo`}
        title={school.name}
        className="object-cover w-full h-full rounded-lg transition-transform duration-300 group-hover:scale-110"
      />
    </button>
  );
};


const LogoGrid: React.FC<LogoGridProps> = ({ schools, onSchoolSelect }) => {
  
  const gridItems = useMemo<GridItemType[]>(() => {
    const items: GridItemType[] = [];
    const schoolItems = [...schools]; // Make a mutable copy
    const gridSize = 25;
    const centerIndex = 12;

    for (let i = 0; i < gridSize; i++) {
        if (i === centerIndex) {
            items.push({ type: 'association' });
        } else if (schoolItems.length > 0) {
            items.push(schoolItems.shift()!); // Take the next school from the copy
        } else {
            // If no more schools, push a non-interactive association item
            items.push({ type: 'association' });
        }
    }
    return items;
  }, [schools]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-200">Select a School</h2>
      <p className="text-gray-400 mb-8 max-w-2xl text-center">Click on a school's logo to view its class schedule and information. The central emblem represents the international association.</p>
      <div className="grid grid-cols-5 gap-4 md:gap-6 w-full max-w-4xl mx-auto">
        {gridItems.map((item, index) => (
          <GridCell key={('id' in item) ? item.id : `cell-${index}`} item={item} onSelect={onSchoolSelect} />
        ))}
      </div>
    </div>
  );
};

export default LogoGrid;
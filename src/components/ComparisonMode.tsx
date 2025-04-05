
import React from 'react';
import { Card } from '@/components/ui/card';
import ArrayVisualization from './ArrayVisualization';
import { cn } from '@/lib/utils';

interface AlgorithmState {
  name: string;
  array: number[];
  highlights: number[];
  currentStep: number;
  steps: { array: number[], highlights?: number[] }[];
}

interface ComparisonModeProps {
  algorithms: AlgorithmState[];
  isMultiCompare?: boolean;
}

const ComparisonMode: React.FC<ComparisonModeProps> = ({
  algorithms,
  isMultiCompare = false
}) => {
  // Calculate grid columns based on number of algorithms
  const gridCols = isMultiCompare ? 
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : 
    "grid-cols-1 md:grid-cols-2";

  return (
    <div className={`grid ${gridCols} gap-4 h-full`}>
      {algorithms.map((algo, index) => (
        <Card key={index} className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-sm">{algo.name}</h3>
          </div>
          <div className="flex-1">
            <ArrayVisualization 
              array={algo.array} 
              highlights={algo.highlights} 
            />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ComparisonMode;

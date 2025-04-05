
import React from 'react';
import { cn } from '@/lib/utils';

interface ArrayVisualizationProps {
  array: number[];
  highlights?: number[];
  isSorting?: boolean;
}

const ArrayVisualization: React.FC<ArrayVisualizationProps> = ({ 
  array, 
  highlights = [], 
  isSorting = false
}) => {
  // Find the maximum value for scaling
  const maxValue = Math.max(...array, 1);
  
  return (
    <div className="h-80 flex items-end justify-center gap-2 p-4">
      {array.map((value, index) => {
        const isHighlighted = highlights.includes(index);
        const height = (value / maxValue) * 100;
        
        return (
          <div 
            key={index}
            className="relative flex-1"
            style={{ height: '100%' }}
          >
            <div
              className={cn(
                "absolute bottom-0 w-full rounded-t-md transition-all duration-300",
                isHighlighted ? "bg-red-500" : "bg-violet-500",
                isSorting && !isHighlighted && "bg-violet-400"
              )}
              style={{ 
                height: `${Math.max(height, 5)}%`,
              }}
            />
            
            {isHighlighted && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="text-red-500 text-xl">▲</div>
              </div>
            )}
            
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full pt-6 text-xs font-medium">
              {value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ArrayVisualization;

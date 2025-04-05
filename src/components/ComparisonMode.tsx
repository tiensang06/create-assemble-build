
import React from 'react';
import { Card } from '@/components/ui/card';
import ArrayVisualization from './ArrayVisualization';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonModeProps {
  firstArray: number[];
  firstHighlights: number[];
  firstAlgorithm: string;
  secondArray: number[];
  secondHighlights: number[];
  secondAlgorithm: string;
  onSecondAlgorithmChange: (algo: any) => void;
  algorithms: { name: string; fn: any }[];
}

const ComparisonMode: React.FC<ComparisonModeProps> = ({
  firstArray,
  firstHighlights,
  firstAlgorithm,
  secondArray,
  secondHighlights,
  secondAlgorithm,
  onSecondAlgorithmChange,
  algorithms,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <Card className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-sm">{firstAlgorithm}</h3>
        </div>
        <div className="flex-1">
          <ArrayVisualization 
            array={firstArray} 
            highlights={firstHighlights} 
          />
        </div>
      </Card>
      
      <Card className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-sm">{secondAlgorithm}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                Change <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {algorithms.map((algo) => (
                <DropdownMenuItem 
                  key={algo.name}
                  onClick={() => onSecondAlgorithmChange(algo)}
                  className={cn(
                    "cursor-pointer",
                    secondAlgorithm === algo.name && "bg-blue-50 font-medium"
                  )}
                  disabled={firstAlgorithm === algo.name}
                >
                  {algo.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex-1">
          <ArrayVisualization 
            array={secondArray} 
            highlights={secondHighlights} 
          />
        </div>
      </Card>
    </div>
  );
};

export default ComparisonMode;


import React from 'react';
import { Card } from '@/components/ui/card';

interface InstructionsProps {
  algorithm: string;
  currentStep?: number;
  totalSteps?: number;
}

const Instructions: React.FC<InstructionsProps> = ({ 
  algorithm, 
  currentStep = 0, 
  totalSteps = 1 
}) => {
  // Calculate progress percentage
  const progress = Math.min(Math.floor((currentStep / Math.max(totalSteps, 1)) * 100), 100);
  
  // Instructions based on the selected algorithm
  const getInstructions = () => {
    switch (algorithm.toLowerCase()) {
      case 'bubble sort':
        return [
          'Compare adjacent elements, swapping them if they are in the wrong order',
          'Repeat until no more swaps are needed',
          'The largest elements "bubble" to the end with each pass'
        ];
      case 'selection sort':
        return [
          'Find the minimum element in the unsorted part',
          'Swap it with the element at the beginning of the unsorted part',
          'Move the boundary between sorted and unsorted parts one element to the right'
        ];
      case 'insertion sort':
        return [
          'Start with the second element (consider first element as sorted)',
          'Compare with all elements in the sorted part',
          'Shift elements to make space and insert current element at the correct position'
        ];
      case 'quick sort':
        return [
          'Select a pivot element from the array',
          'Partition the array: elements < pivot go left, elements > pivot go right',
          'Recursively apply the above steps to the sub-arrays'
        ];
      case 'shell sort':
        return [
          'Start with a large gap and reduce it in each iteration',
          'Compare elements that are gap positions apart',
          'As the gap reduces, the array becomes nearly sorted making final pass efficient'
        ];
      case 'radix sort':
        return [
          'Sort numbers digit by digit, starting from least significant digit',
          'Use counting sort as a subroutine for each digit position',
          'Process all digits from least to most significant'
        ];
      default:
        return ['Select an algorithm to see step-by-step instructions'];
    }
  };

  // Get the instructions array
  const instructions = getInstructions();
  
  // Determine which step we're on based on progress
  const getCurrentInstructionIndex = () => {
    if (progress <= 0) return -1;
    if (progress >= 100) return instructions.length;
    
    // Map progress percentage to instruction index
    // For example, if we have 3 instructions, 0-33% = step 0, 34-66% = step 1, 67-99% = step 2, 100% = completed
    return Math.min(Math.floor((progress / 100) * instructions.length), instructions.length - 1);
  };
  
  const currentInstructionIndex = getCurrentInstructionIndex();

  return (
    <Card className="p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Instructions</h2>
      
      {progress > 0 && progress < 100 && (
        <div className="mb-4 text-sm text-blue-600">
          Progress: {progress}% complete
        </div>
      )}
      
      {progress >= 100 && (
        <div className="mb-4 text-sm text-green-600 font-medium">
          Sorting completed!
        </div>
      )}
      
      <div className="space-y-2">
        {instructions.map((instruction, index) => (
          <div 
            key={index} 
            className={`flex gap-3 p-2 rounded-md transition-colors ${
              index === currentInstructionIndex 
                ? 'bg-blue-50 border-l-4 border-blue-500' 
                : index < currentInstructionIndex 
                  ? 'text-gray-400 line-through' 
                  : ''
            }`}
          >
            <div className="font-semibold">{index + 1}.</div>
            <div>{instruction}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Instructions;

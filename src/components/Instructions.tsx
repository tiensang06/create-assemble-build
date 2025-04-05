
import React from 'react';
import { Card } from '@/components/ui/card';

interface InstructionsProps {
  algorithm: string;
  currentStep?: number;
  totalSteps?: number;
  isComparisonMode?: boolean;
  algorithmStates?: {
    name: string;
    currentStep: number;
    totalSteps: number;
  }[];
}

const Instructions: React.FC<InstructionsProps> = ({ 
  algorithm, 
  currentStep = 0, 
  totalSteps = 1,
  isComparisonMode = false,
  algorithmStates = []
}) => {
  // Calculate progress percentage for single algorithm mode
  const progress = Math.min(Math.floor((currentStep / Math.max(totalSteps, 1)) * 100), 100);
  
  // Instructions based on the selected algorithm
  const getInstructions = (algoName: string) => {
    switch (algoName.toLowerCase()) {
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

  // Get more detailed execution steps for each algorithm
  const getDetailedSteps = (algoName: string) => {
    switch (algoName.toLowerCase()) {
      case 'bubble sort':
        return [
          'Comparing adjacent elements in the array',
          'Swapping elements if they are in the wrong order',
          'Moving to the next pair of elements',
          'Completing a pass through the array',
          'Beginning next pass with reduced scope (largest elements are already in place)',
          'Finalizing the sort when no more swaps are needed'
        ];
      case 'selection sort':
        return [
          'Setting the first unsorted element as the minimum',
          'Comparing with next elements to find the actual minimum',
          'Updating minimum if a smaller element is found',
          'Completing the search through the unsorted portion',
          'Swapping the minimum with the first unsorted position',
          'Moving the boundary between sorted and unsorted parts',
          'Repeating until array is sorted'
        ];
      case 'insertion sort':
        return [
          'Starting with the second element (first element is already "sorted")',
          'Storing current element as key',
          'Comparing key with previous elements',
          'Shifting elements greater than key to the right',
          'Inserting key at its correct position',
          'Moving to the next unsorted element',
          'Repeating until all elements are in order'
        ];
      case 'quick sort':
        return [
          'Selecting the last element as pivot',
          'Initializing partition index',
          'Comparing array elements with pivot',
          'Moving smaller elements to the left side',
          'Placing pivot in its final sorted position',
          'Recursively sorting the sub-array before pivot',
          'Recursively sorting the sub-array after pivot',
          'Combining results to get the fully sorted array'
        ];
      case 'shell sort':
        return [
          'Calculating the initial gap (usually n/2)',
          'Performing insertion sort on elements that are gap distance apart',
          'Reducing the gap (typically gap = gap/2)',
          'Repeating insertion sort with the new gap',
          'Continuing until gap becomes 1',
          'Performing final insertion sort with gap=1',
          'Completing the sort with array fully ordered'
        ];
      case 'radix sort':
        return [
          'Determining the maximum number to know number of digits',
          'Starting with the least significant digit (rightmost)',
          'Grouping numbers based on the current digit',
          'Reconstructing the array after grouping',
          'Moving to the next digit position (to the left)',
          'Repeating grouping and reconstruction for each digit',
          'Completing sort when all digit positions are processed'
        ];
      default:
        return ['Select an algorithm to see detailed sorting steps'];
    }
  };

  // Determine which step we're on based on progress for a single algorithm
  const getCurrentInstructionIndex = (progress: number, instructionsLength: number) => {
    if (progress <= 0) return -1;
    if (progress >= 100) return instructionsLength;
    
    // Map progress percentage to instruction index
    return Math.min(Math.floor((progress / 100) * instructionsLength), instructionsLength - 1);
  };
  
  // Determine which detailed step we're on for a single algorithm
  const getCurrentDetailedStepIndex = (progress: number, stepsLength: number) => {
    if (progress <= 0) return -1;
    if (progress >= 100) return stepsLength;
    
    // Map progress percentage to detailed step index
    return Math.min(Math.floor((progress / 100) * stepsLength), stepsLength - 1);
  };

  if (isComparisonMode) {
    return (
      <Card className="p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Algorithm Comparison</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {algorithmStates.map((algoState, index) => {
            const algoProgress = Math.min(Math.floor((algoState.currentStep / Math.max(algoState.totalSteps, 1)) * 100), 100);
            const instructions = getInstructions(algoState.name);
            const detailedSteps = getDetailedSteps(algoState.name);
            const currentInstructionIndex = getCurrentInstructionIndex(algoProgress, instructions.length);
            const currentDetailedStepIndex = getCurrentDetailedStepIndex(algoProgress, detailedSteps.length);
            
            return (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="text-md font-semibold mb-2">{algoState.name}</h3>
                
                {algoProgress > 0 && algoProgress < 100 && (
                  <div className="mb-4 text-sm text-blue-600">
                    Progress: {algoProgress}% complete
                  </div>
                )}
                
                {algoProgress >= 100 && (
                  <div className="mb-4 text-sm text-green-600 font-medium">
                    Sorting completed!
                  </div>
                )}
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Current Action:</h4>
                  {currentDetailedStepIndex >= 0 && currentDetailedStepIndex < detailedSteps.length ? (
                    <div className="p-2 bg-amber-50 border-l-4 border-amber-500 text-sm">
                      {detailedSteps[currentDetailedStepIndex]}
                    </div>
                  ) : (
                    <div className="p-2 text-sm text-gray-500">
                      Waiting to start...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  }
  
  // Get the instructions and detailed steps arrays for single algorithm mode
  const instructions = getInstructions(algorithm);
  const detailedSteps = getDetailedSteps(algorithm);
  const currentInstructionIndex = getCurrentInstructionIndex(progress, instructions.length);
  const currentDetailedStepIndex = getCurrentDetailedStepIndex(progress, detailedSteps.length);

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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General algorithm instructions */}
        <div>
          <h3 className="text-md font-medium mb-2">Algorithm Overview</h3>
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
        </div>
        
        {/* Current execution steps */}
        <div>
          <h3 className="text-md font-medium mb-2">Current Actions</h3>
          <div className="space-y-2">
            {detailedSteps.map((step, index) => (
              <div 
                key={index} 
                className={`flex gap-3 p-2 rounded-md transition-colors ${
                  index === currentDetailedStepIndex 
                    ? 'bg-amber-50 border-l-4 border-amber-500' 
                    : index < currentDetailedStepIndex 
                      ? 'text-gray-400 line-through' 
                      : ''
                }`}
              >
                <div className="font-semibold">{index + 1}.</div>
                <div>{step}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Instructions;

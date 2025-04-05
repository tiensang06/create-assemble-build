
import React from 'react';
import { Card } from '@/components/ui/card';

interface InstructionsProps {
  algorithm: string;
}

const Instructions: React.FC<InstructionsProps> = ({ algorithm }) => {
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

  return (
    <Card className="p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Instructions</h2>
      <div className="space-y-2">
        {getInstructions().map((instruction, index) => (
          <div key={index} className="flex gap-3">
            <div className="font-semibold">{index + 1}.</div>
            <div>{instruction}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Instructions;

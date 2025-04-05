
// Common animation interface
interface AnimationStep {
  newArray: number[];
  highlights: number[];
}

// Helper function for array cloning
const clone = (arr: number[]): number[] => [...arr];

// Helper function to swap elements in array
const swap = (arr: number[], i: number, j: number): void => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

// Bubble Sort
export const bubbleSort = (array: number[]): AnimationStep[] => {
  const animations: AnimationStep[] = [];
  const arr = clone(array);
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Highlight the elements being compared
      animations.push({
        newArray: clone(arr),
        highlights: [j, j + 1]
      });
      
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
        
        // Show the swap
        animations.push({
          newArray: clone(arr),
          highlights: [j, j + 1]
        });
      }
    }
  }
  
  // Final state with no highlights
  animations.push({
    newArray: clone(arr),
    highlights: []
  });
  
  return animations;
};

// Selection Sort
export const selectionSort = (array: number[]): AnimationStep[] => {
  const animations: AnimationStep[] = [];
  const arr = clone(array);
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    
    // Find the minimum element
    for (let j = i + 1; j < n; j++) {
      // Highlight the current minimum and the element being compared
      animations.push({
        newArray: clone(arr),
        highlights: [minIndex, j]
      });
      
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    // Highlight the elements to be swapped
    animations.push({
      newArray: clone(arr),
      highlights: [i, minIndex]
    });
    
    // Swap the found minimum element with the first element
    if (minIndex !== i) {
      swap(arr, i, minIndex);
      
      // Show the swap
      animations.push({
        newArray: clone(arr),
        highlights: [i, minIndex]
      });
    }
  }
  
  // Final state with no highlights
  animations.push({
    newArray: clone(arr),
    highlights: []
  });
  
  return animations;
};

// Insertion Sort
export const insertionSort = (array: number[]): AnimationStep[] => {
  const animations: AnimationStep[] = [];
  const arr = clone(array);
  const n = arr.length;
  
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    
    // Highlight the current element to be inserted
    animations.push({
      newArray: clone(arr),
      highlights: [i]
    });
    
    while (j >= 0 && arr[j] > key) {
      // Highlight comparison
      animations.push({
        newArray: clone(arr),
        highlights: [j, j + 1]
      });
      
      // Move elements that are greater than key
      arr[j + 1] = arr[j];
      
      // Show the shift
      animations.push({
        newArray: clone(arr),
        highlights: [j, j + 1]
      });
      
      j--;
    }
    
    arr[j + 1] = key;
    
    // Show the insertion
    animations.push({
      newArray: clone(arr),
      highlights: [j + 1]
    });
  }
  
  // Final state with no highlights
  animations.push({
    newArray: clone(arr),
    highlights: []
  });
  
  return animations;
};

// Quick Sort
export const quickSort = (array: number[]): AnimationStep[] => {
  const animations: AnimationStep[] = [];
  const arr = clone(array);
  
  const quickSortHelper = (start: number, end: number) => {
    if (start >= end) return;
    
    // Choose pivot (last element)
    const pivot = arr[end];
    
    // Highlight pivot
    animations.push({
      newArray: clone(arr),
      highlights: [end]
    });
    
    // Partition
    let pivotIndex = start;
    for (let i = start; i < end; i++) {
      // Highlight comparison
      animations.push({
        newArray: clone(arr),
        highlights: [i, end]
      });
      
      if (arr[i] <= pivot) {
        // Highlight swap
        animations.push({
          newArray: clone(arr),
          highlights: [i, pivotIndex]
        });
        
        // Swap
        swap(arr, i, pivotIndex);
        
        // Show the swap
        animations.push({
          newArray: clone(arr),
          highlights: [i, pivotIndex]
        });
        
        pivotIndex++;
      }
    }
    
    // Highlight swap pivot
    animations.push({
      newArray: clone(arr),
      highlights: [pivotIndex, end]
    });
    
    // Swap the pivot
    swap(arr, pivotIndex, end);
    
    // Show the swap
    animations.push({
      newArray: clone(arr),
      highlights: [pivotIndex, end]
    });
    
    // Recursively sort the sub-arrays
    quickSortHelper(start, pivotIndex - 1);
    quickSortHelper(pivotIndex + 1, end);
  };
  
  quickSortHelper(0, arr.length - 1);
  
  // Final state with no highlights
  animations.push({
    newArray: clone(arr),
    highlights: []
  });
  
  return animations;
};

// Shell Sort
export const shellSort = (array: number[]): AnimationStep[] => {
  const animations: AnimationStep[] = [];
  const arr = clone(array);
  const n = arr.length;
  
  // Start with a big gap, then reduce the gap
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // Do a gapped insertion sort
    for (let i = gap; i < n; i++) {
      // Add the current element to the gap sorted array
      const temp = arr[i];
      
      // Highlight the current element and the gap position
      animations.push({
        newArray: clone(arr),
        highlights: [i, i - gap >= 0 ? i - gap : i]
      });
      
      let j;
      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        // Highlight comparison
        animations.push({
          newArray: clone(arr),
          highlights: [j, j - gap]
        });
        
        // Shift elements
        arr[j] = arr[j - gap];
        
        // Show the shift
        animations.push({
          newArray: clone(arr),
          highlights: [j, j - gap]
        });
      }
      
      // Put temp in its correct location
      arr[j] = temp;
      
      // Show the placement
      animations.push({
        newArray: clone(arr),
        highlights: [j]
      });
    }
  }
  
  // Final state with no highlights
  animations.push({
    newArray: clone(arr),
    highlights: []
  });
  
  return animations;
};

// Radix Sort
export const radixSort = (array: number[]): AnimationStep[] => {
  const animations: AnimationStep[] = [];
  const arr = clone(array);
  
  // Find the max number to know number of digits
  const max = Math.max(...arr);
  
  // Do counting sort for every digit
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    // Highlight all elements for current digit position
    animations.push({
      newArray: clone(arr),
      highlights: arr.map((_, index) => index)
    });
    
    const output = Array(arr.length).fill(0);
    const count = Array(10).fill(0);
    
    // Store count of occurrences in count[]
    for (let i = 0; i < arr.length; i++) {
      // Highlight current element
      animations.push({
        newArray: clone(arr),
        highlights: [i]
      });
      
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
    }
    
    // Change count[i] so that count[i] contains
    // actual position of this digit in output[]
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }
    
    // Build the output array
    for (let i = arr.length - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
      
      // Highlight where the number is being placed
      animations.push({
        newArray: clone(arr),
        highlights: [i, count[digit]]
      });
    }
    
    // Copy the output array to arr[] so that arr[] contains
    // sorted numbers according to current digit
    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i];
      
      // Show the update
      animations.push({
        newArray: clone(arr),
        highlights: [i]
      });
    }
  }
  
  // Final state with no highlights
  animations.push({
    newArray: clone(arr),
    highlights: []
  });
  
  return animations;
};

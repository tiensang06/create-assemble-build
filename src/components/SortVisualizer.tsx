
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ChevronDown, 
  Play, 
  RotateCcw, 
  ArrowRight, 
  RefreshCw, 
  Trash, 
  Shuffle,
  LayoutGrid,
  Columns
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ArrayInput from '@/components/ArrayInput';
import ArrayVisualization from '@/components/ArrayVisualization';
import Instructions from '@/components/Instructions';
import ComparisonMode from '@/components/ComparisonMode';

// Sorting algorithms
import {
  bubbleSort,
  selectionSort,
  insertionSort,
  quickSort,
  shellSort,
  radixSort,
} from '@/lib/sortingAlgorithms';

const algorithms = [
  { name: 'Bubble sort', fn: bubbleSort },
  { name: 'Selection sort', fn: selectionSort },
  { name: 'Insertion sort', fn: insertionSort },
  { name: 'Quick sort', fn: quickSort },
  { name: 'Shell sort', fn: shellSort },
  { name: 'Radix sort', fn: radixSort },
];

interface AlgorithmState {
  name: string;
  array: number[];
  highlights: number[];
  currentStep: number;
  steps: { array: number[], highlights?: number[] }[];
}

const SortVisualizer = () => {
  const [array, setArray] = useState<number[]>([3, 7, 4, 5, 13, 10, 6, 8, 1]);
  const [sortingSteps, setSortingSteps] = useState<{ array: number[], highlights?: number[] }[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [algorithm, setAlgorithm] = useState(algorithms[0]);
  const [isSorting, setIsSorting] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [isMultiCompare, setIsMultiCompare] = useState(false);
  const [algorithmStates, setAlgorithmStates] = useState<AlgorithmState[]>([]);
  
  const sortingInterval = useRef<number | null>(null);

  useEffect(() => {
    // Initialize with the array visualization
    setSortingSteps([{ array: [...array] }]);
    
    // Initialize algorithm states for comparison mode
    const initialStates = algorithms.map(algo => ({
      name: algo.name,
      array: [...array],
      highlights: [],
      currentStep: 0,
      steps: [{ array: [...array], highlights: [] }]
    }));
    setAlgorithmStates(initialStates);
    
    return () => {
      if (sortingInterval.current) {
        window.clearInterval(sortingInterval.current);
      }
    };
  }, []);

  // Update algorithm states when the input array changes
  useEffect(() => {
    if (!isSorting) {
      const updatedStates = algorithms.map(algo => ({
        name: algo.name,
        array: [...array],
        highlights: [],
        currentStep: 0,
        steps: [{ array: [...array], highlights: [] }]
      }));
      setAlgorithmStates(updatedStates);
    }
  }, [array, isSorting]);

  const generateSteps = (algorithm: typeof algorithms[0]) => {
    const steps: { array: number[], highlights?: number[] }[] = [{ array: [...array] }];
    const arrayCopy = [...array];
    const animations = algorithm.fn(arrayCopy);
    
    animations.forEach(({ newArray, highlights }) => {
      steps.push({
        array: [...newArray],
        highlights
      });
    });
    
    return steps;
  };

  const handleStartSorting = () => {
    if (isSorting) return;
    
    setIsSorting(true);
    
    if (isComparisonMode) {
      // Generate steps for all algorithms in comparison mode
      const newAlgorithmStates = algorithms.map(algo => {
        const steps = generateSteps(algo);
        return {
          name: algo.name,
          array: [...array],
          highlights: [],
          currentStep: 0,
          steps
        };
      });
      setAlgorithmStates(newAlgorithmStates);
    } else {
      // Standard mode - just one algorithm
      const steps = generateSteps(algorithm);
      setSortingSteps(steps);
      setCurrentStep(0);
    }
    
    // Calculate the interval based on speed
    const intervalTime = 1000 / (speed * 1);
    
    sortingInterval.current = window.setInterval(() => {
      if (isComparisonMode) {
        // Update all algorithm states in comparison mode
        setAlgorithmStates(prevStates => {
          const allCompleted = prevStates.every(state => 
            state.currentStep >= state.steps.length - 1
          );
          
          if (allCompleted) {
            if (sortingInterval.current) {
              window.clearInterval(sortingInterval.current);
              sortingInterval.current = null;
            }
            setIsSorting(false);
            toast.success("All algorithms completed!");
            return prevStates;
          }
          
          // Update each algorithm's current step
          return prevStates.map(state => {
            const nextStep = state.currentStep + 1;
            if (nextStep >= state.steps.length) {
              return state;
            }
            
            const stepData = state.steps[nextStep];
            return {
              ...state,
              array: stepData.array,
              highlights: stepData.highlights || [],
              currentStep: nextStep
            };
          });
        });
      } else {
        // Standard mode - update just one algorithm
        setCurrentStep(prevStep => {
          const nextStep = prevStep + 1;
          if (nextStep >= sortingSteps.length) {
            if (sortingInterval.current) {
              window.clearInterval(sortingInterval.current);
              sortingInterval.current = null;
            }
            setIsSorting(false);
            toast.success(`${algorithm.name} completed!`);
            return prevStep;
          }
          return nextStep;
        });
      }
    }, intervalTime);
  };

  const handleStopSorting = () => {
    if (sortingInterval.current) {
      window.clearInterval(sortingInterval.current);
      sortingInterval.current = null;
    }
    setIsSorting(false);
  };

  const handleRestart = () => {
    handleStopSorting();
    
    if (isComparisonMode) {
      // Reset all algorithm states
      setAlgorithmStates(prevStates => 
        prevStates.map(state => ({
          ...state,
          array: [...array],
          highlights: [],
          currentStep: 0
        }))
      );
    } else {
      // Reset the single algorithm
      setCurrentStep(0);
    }
  };

  const handleNextStep = () => {
    if (isComparisonMode) {
      // Advance all algorithms by one step
      setAlgorithmStates(prevStates => {
        return prevStates.map(state => {
          if (state.currentStep < state.steps.length - 1) {
            const nextStep = state.currentStep + 1;
            const stepData = state.steps[nextStep];
            
            return {
              ...state,
              array: stepData.array,
              highlights: stepData.highlights || [],
              currentStep: nextStep
            };
          }
          return state;
        });
      });
    } else if (currentStep < sortingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.info("Sorting completed!");
    }
  };

  const handleAlgorithmChange = (algo: typeof algorithms[0]) => {
    if (isSorting) handleStopSorting();
    setAlgorithm(algo);
    const steps = generateSteps(algo);
    setSortingSteps(steps);
    setCurrentStep(0);
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
    if (isSorting && sortingInterval.current) {
      window.clearInterval(sortingInterval.current);
      
      const intervalTime = 1000 / (value[0] * 1);
      
      sortingInterval.current = window.setInterval(() => {
        if (isComparisonMode) {
          // Update all algorithm states in comparison mode
          setAlgorithmStates(prevStates => {
            const allCompleted = prevStates.every(state => 
              state.currentStep >= state.steps.length - 1
            );
            
            if (allCompleted) {
              if (sortingInterval.current) {
                window.clearInterval(sortingInterval.current);
                sortingInterval.current = null;
              }
              setIsSorting(false);
              toast.success("All algorithms completed!");
              return prevStates;
            }
            
            // Update each algorithm's current step
            return prevStates.map(state => {
              const nextStep = state.currentStep + 1;
              if (nextStep >= state.steps.length) {
                return state;
              }
              
              const stepData = state.steps[nextStep];
              return {
                ...state,
                array: stepData.array,
                highlights: stepData.highlights || [],
                currentStep: nextStep
              };
            });
          });
        } else {
          setCurrentStep(prevStep => {
            const nextStep = prevStep + 1;
            if (nextStep >= sortingSteps.length) {
              if (sortingInterval.current) {
                window.clearInterval(sortingInterval.current);
                sortingInterval.current = null;
              }
              setIsSorting(false);
              toast.success(`${algorithm.name} completed!`);
              return prevStep;
            }
            return nextStep;
          });
        }
      }, intervalTime);
    }
  };

  const handleArrayUpdate = (newArray: number[]) => {
    if (isSorting) handleStopSorting();
    setArray(newArray);
    setSortingSteps([{ array: newArray }]);
    
    // Update all algorithm states with the new array
    setAlgorithmStates(prevStates => 
      prevStates.map(state => ({
        ...state,
        array: [...newArray],
        highlights: [],
        currentStep: 0,
        steps: [{ array: [...newArray], highlights: [] }]
      }))
    );
  };

  const handleRandomArray = () => {
    const size = 10;
    const randomArray = Array.from({ length: size }, () => Math.floor(Math.random() * 20) + 1);
    handleArrayUpdate(randomArray);
    toast.info("Random array generated!");
  };

  const toggleComparisonMode = () => {
    setIsComparisonMode(!isComparisonMode);
    setIsMultiCompare(false);
    
    if (!isComparisonMode) {
      // When turning on comparison mode, generate initial states for algorithms
      const initialStates = algorithms.slice(0, 2).map(algo => ({
        name: algo.name,
        array: [...array],
        highlights: [],
        currentStep: 0,
        steps: [{ array: [...array], highlights: [] }]
      }));
      setAlgorithmStates(initialStates);
    }
  };

  const toggleMultiCompareMode = () => {
    if (!isComparisonMode) {
      setIsComparisonMode(true);
    }
    setIsMultiCompare(!isMultiCompare);
    
    // When turning on multi-compare mode, ensure we have all 6 algorithms ready
    const initialStates = algorithms.map(algo => ({
      name: algo.name,
      array: [...array],
      highlights: [],
      currentStep: 0,
      steps: [{ array: [...array], highlights: [] }]
    }));
    setAlgorithmStates(initialStates);
  };

  const currentArray = sortingSteps[currentStep]?.array || array;
  const currentHighlights = sortingSteps[currentStep]?.highlights || [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm mb-6">
        <div className="flex items-center gap-2">
          <div className="text-blue-500 font-bold text-2xl">↕</div>
          <h1 className="text-xl font-bold">Sort Lab</h1>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="relative group">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Algorithms <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {algorithms.map((algo) => (
                  <DropdownMenuItem 
                    key={algo.name}
                    onClick={() => handleAlgorithmChange(algo)}
                    className={cn(
                      "cursor-pointer",
                      algorithm.name === algo.name && "bg-blue-50 font-medium"
                    )}
                  >
                    {algo.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button 
            onClick={toggleComparisonMode}
            variant={isComparisonMode && !isMultiCompare ? "default" : "outline"}
            className="gap-2"
          >
            <Columns size={16} />
            Compare 2
          </Button>
          
          <Button 
            onClick={toggleMultiCompareMode}
            variant={isMultiCompare ? "default" : "outline"}
            className="gap-2"
          >
            <LayoutGrid size={16} />
            Compare All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Input data</h2>
          <ArrayInput 
            array={array} 
            onArrayUpdate={handleArrayUpdate} 
            disabled={isSorting}
          />
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRandomArray}
              disabled={isSorting}
              className="gap-2"
            >
              <Shuffle size={16} />
              Random
            </Button>
            <Button
              onClick={handleStopSorting}
              disabled={!isSorting}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Trash size={16} />
              Clear
            </Button>
            <Button onClick={handleStartSorting} disabled={isSorting} size="sm" className="gap-2">
              Submit <ArrowRight size={16} />
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Card className="p-6 rounded-xl shadow-sm h-full flex flex-col">
            <div className="flex-1">
              {isComparisonMode ? (
                <ComparisonMode
                  algorithms={algorithmStates}
                  isMultiCompare={isMultiCompare}
                />
              ) : (
                <ArrayVisualization 
                  array={currentArray} 
                  highlights={currentHighlights}
                  isSorting={isSorting}
                />
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-between items-center gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Speed</span>
                {[1, 2, 5, 10].map(speedValue => (
                  <Button 
                    key={speedValue}
                    variant={speed === speedValue ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSpeedChange([speedValue])}
                    className="h-8 px-2"
                  >
                    x{speedValue}
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleRestart} 
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <RotateCcw size={16} />
                  Restart
                </Button>
                <Button 
                  onClick={handleStartSorting} 
                  disabled={isSorting}
                  size="sm"
                  className="gap-1"
                >
                  <Play size={16} />
                  Play
                </Button>
                <Button 
                  onClick={handleNextStep}
                  disabled={isSorting || (isComparisonMode ? 
                    algorithmStates.every(state => state.currentStep >= state.steps.length - 1) : 
                    currentStep >= sortingSteps.length - 1)}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  Next
                  <ArrowRight size={16} />
                </Button>
              </div>
              
              <div className="w-full flex items-center gap-4">
                <Slider
                  defaultValue={[0]}
                  max={isComparisonMode ? 
                    Math.max(...algorithmStates.map(state => state.steps.length - 1), 0) : 
                    sortingSteps.length - 1}
                  value={[isComparisonMode ? 
                    Math.min(...algorithmStates.map(state => state.currentStep)) : 
                    currentStep]}
                  step={1}
                  disabled={isSorting}
                  onValueChange={(value) => {
                    if (isComparisonMode) {
                      // Update all algorithms to the same step
                      setAlgorithmStates(prevStates => 
                        prevStates.map(state => {
                          if (value[0] < state.steps.length) {
                            const stepData = state.steps[value[0]];
                            return {
                              ...state,
                              array: stepData.array,
                              highlights: stepData.highlights || [],
                              currentStep: value[0]
                            };
                          }
                          return state;
                        })
                      );
                    } else {
                      setCurrentStep(value[0]);
                    }
                  }}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-16 text-right">
                  {isComparisonMode ? 
                    `${Math.min(...algorithmStates.map(state => state.currentStep))}/${Math.max(...algorithmStates.map(state => state.steps.length - 1), 0)}` : 
                    `${currentStep}/${sortingSteps.length - 1}`}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Instructions algorithm={algorithm.name} />
        </div>
      </div>
    </div>
  );
};

export default SortVisualizer;

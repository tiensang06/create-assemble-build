
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
import { ChevronDown, Play, RotateCcw, ArrowRight, RefreshCw, Trash, Shuffle } from 'lucide-react';
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

const SortVisualizer = () => {
  const [array, setArray] = useState<number[]>([3, 7, 4, 5, 13, 10, 6, 8, 1]);
  const [sortingSteps, setSortingSteps] = useState<{ array: number[], highlights?: number[] }[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [algorithm, setAlgorithm] = useState(algorithms[0]);
  const [isSorting, setIsSorting] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [secondAlgorithm, setSecondAlgorithm] = useState(algorithms[1]);
  const [secondSortingSteps, setSecondSortingSteps] = useState<{ array: number[], highlights?: number[] }[]>([]);
  const [secondCurrentStep, setSecondCurrentStep] = useState(0);
  
  const sortingInterval = useRef<number | null>(null);

  useEffect(() => {
    // Initialize with the array visualization
    setSortingSteps([{ array: [...array] }]);
    setSecondSortingSteps([{ array: [...array] }]);
    
    return () => {
      if (sortingInterval.current) {
        window.clearInterval(sortingInterval.current);
      }
    };
  }, []);

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
    const steps = generateSteps(algorithm);
    setSortingSteps(steps);
    setCurrentStep(0);
    
    if (isComparisonMode) {
      const secondSteps = generateSteps(secondAlgorithm);
      setSecondSortingSteps(secondSteps);
      setSecondCurrentStep(0);
    }
    
    // Calculate the interval based on speed
    const intervalTime = 1000 / (speed * 1);
    
    sortingInterval.current = window.setInterval(() => {
      setCurrentStep(prevStep => {
        const nextStep = prevStep + 1;
        if (nextStep >= steps.length) {
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
      
      if (isComparisonMode) {
        setSecondCurrentStep(prevStep => {
          const nextStep = prevStep + 1;
          if (nextStep >= secondSortingSteps.length) {
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
    setCurrentStep(0);
    setSecondCurrentStep(0);
  };

  const handleNextStep = () => {
    if (currentStep < sortingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      
      if (isComparisonMode && secondCurrentStep < secondSortingSteps.length - 1) {
        setSecondCurrentStep(prev => prev + 1);
      }
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

  const handleSecondAlgorithmChange = (algo: typeof algorithms[0]) => {
    if (isSorting) handleStopSorting();
    setSecondAlgorithm(algo);
    const steps = generateSteps(algo);
    setSecondSortingSteps(steps);
    setSecondCurrentStep(0);
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
    if (isSorting && sortingInterval.current) {
      window.clearInterval(sortingInterval.current);
      
      const intervalTime = 1000 / (value[0] * 1);
      
      sortingInterval.current = window.setInterval(() => {
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
        
        if (isComparisonMode) {
          setSecondCurrentStep(prevStep => {
            const nextStep = prevStep + 1;
            if (nextStep >= secondSortingSteps.length) {
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
    setSecondSortingSteps([{ array: newArray }]);
    setCurrentStep(0);
    setSecondCurrentStep(0);
  };

  const handleRandomArray = () => {
    const size = 10;
    const randomArray = Array.from({ length: size }, () => Math.floor(Math.random() * 20) + 1);
    handleArrayUpdate(randomArray);
    toast.info("Random array generated!");
  };

  const toggleComparisonMode = () => {
    setIsComparisonMode(!isComparisonMode);
    if (!isComparisonMode) {
      // When turning on comparison mode, generate steps for second algorithm
      const steps = generateSteps(secondAlgorithm);
      setSecondSortingSteps(steps);
      setSecondCurrentStep(0);
    }
  };

  const currentArray = sortingSteps[currentStep]?.array || array;
  const currentHighlights = sortingSteps[currentStep]?.highlights || [];
  
  const secondArray = isComparisonMode ? 
    (secondSortingSteps[secondCurrentStep]?.array || array) : [];
  const secondHighlights = isComparisonMode ? 
    (secondSortingSteps[secondCurrentStep]?.highlights || []) : [];

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
            variant={isComparisonMode ? "default" : "outline"}
            className="gap-2"
          >
            <RefreshCw size={16} />
            Comparison Mode
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
                  firstArray={currentArray}
                  firstHighlights={currentHighlights}
                  firstAlgorithm={algorithm.name}
                  secondArray={secondArray}
                  secondHighlights={secondHighlights}
                  secondAlgorithm={secondAlgorithm.name}
                  onSecondAlgorithmChange={handleSecondAlgorithmChange}
                  algorithms={algorithms}
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
                  disabled={isSorting || currentStep >= sortingSteps.length - 1}
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
                  max={sortingSteps.length - 1}
                  value={[currentStep]}
                  step={1}
                  disabled={isSorting}
                  onValueChange={(value) => {
                    setCurrentStep(value[0]);
                  }}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-16 text-right">
                  {currentStep}/{sortingSteps.length - 1}
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


import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

interface ArrayInputProps {
  array: number[];
  onArrayUpdate: (newArray: number[]) => void;
  disabled?: boolean;
}

const ArrayInput: React.FC<ArrayInputProps> = ({ array, onArrayUpdate, disabled = false }) => {
  const [inputValues, setInputValues] = useState<string[]>(array.map(String));

  const handleInputChange = (index: number, value: string) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
    
    // Try to convert to numbers and update parent if all are valid
    const newArray = newInputValues.map(val => {
      const num = parseInt(val);
      return isNaN(num) ? 0 : num;
    });
    
    onArrayUpdate(newArray);
  };

  const handleAddValue = () => {
    if (inputValues.length >= 15) {
      toast.warning("Maximum 15 values allowed");
      return;
    }
    
    const newInputValues = [...inputValues, "0"];
    setInputValues(newInputValues);
    
    const newArray = [...array, 0];
    onArrayUpdate(newArray);
  };

  const handleRemoveValue = (index: number) => {
    if (inputValues.length <= 2) {
      toast.warning("Minimum 2 values required");
      return;
    }
    
    const newInputValues = inputValues.filter((_, i) => i !== index);
    setInputValues(newInputValues);
    
    const newArray = array.filter((_, i) => i !== index);
    onArrayUpdate(newArray);
  };

  return (
    <div className="space-y-2">
      {inputValues.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            type="number"
            value={value}
            onChange={e => handleInputChange(index, e.target.value)}
            className="text-right"
            min="0"
            max="99"
            disabled={disabled}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleRemoveValue(index)}
            disabled={disabled || inputValues.length <= 2}
            className="h-10 w-10"
          >
            <Minus size={16} />
          </Button>
        </div>
      ))}
      
      <Button
        onClick={handleAddValue}
        disabled={disabled || inputValues.length >= 15}
        variant="outline"
        className="w-full mt-2"
      >
        <Plus size={16} className="mr-2" />
        Add value
      </Button>
    </div>
  );
};

export default ArrayInput;

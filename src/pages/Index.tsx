
import React from 'react';
import SortVisualizer from '@/components/SortVisualizer';
import { Toaster } from '@/components/ui/sonner';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <SortVisualizer />
      <Toaster />
    </div>
  );
};

export default Index;

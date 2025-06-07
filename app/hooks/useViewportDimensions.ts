'use client';

import { useState, useEffect } from 'react';

interface ViewportDimensions {
  width: number;
  height: number;
}

export const useViewportDimensions = (): ViewportDimensions => {
  const [dimensions, setDimensions] = useState<ViewportDimensions>({ 
    width: 1920, 
    height: 1080 
  });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return dimensions;
}; 
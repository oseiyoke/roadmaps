'use client';

import { useEffect } from 'react';
import { PhaseData } from '@/app/types/roadmap';
import { calculateProgress } from '@/app/utils/roadmapPositions';

interface UseRoadProgressParams {
  phaseData: Record<number, PhaseData>;
}

export const useRoadProgress = ({ phaseData }: UseRoadProgressParams) => {
  useEffect(() => {
    const progress = calculateProgress(phaseData);
    const roadProgress = document.querySelector('.road-progress') as SVGPathElement;
    
    if (roadProgress) {
      const pathLength = roadProgress.getTotalLength();
      const offset = pathLength - (pathLength * progress / 100);
      roadProgress.style.strokeDasharray = `${pathLength}`;
      roadProgress.style.strokeDashoffset = `${offset}`;
    }
  }, [phaseData]);
}; 
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Milestone as MilestoneType, TaskDot, PhaseData } from '@/app/types/roadmap';
import { calculateRoadmapPositions, PositionCalculationResult } from '@/app/utils/roadmapPositions';

interface UseRoadmapPositionsParams {
  pathRef: React.RefObject<SVGPathElement | null>;
  phaseData: Record<number, PhaseData>;
  circleRadius?: number;
}

interface UseRoadmapPositionsReturn extends PositionCalculationResult {
  currentDot: TaskDot | null;
}

export const useRoadmapPositions = ({
  pathRef,
  phaseData,
  circleRadius = 25
}: UseRoadmapPositionsParams): UseRoadmapPositionsReturn => {
  const [milestonePositions, setMilestonePositions] = useState<MilestoneType[]>([]);
  const [taskDotPositions, setTaskDotPositions] = useState<TaskDot[]>([]);
  const [launchPosition, setLaunchPosition] = useState<{ x: number; y: number } | null>(null);

  // Derive current position from the last in-progress task dot
  const currentDot = useMemo(() => {
    return taskDotPositions.filter(dot => dot.status === 'in-progress').pop() ?? null;
  }, [taskDotPositions]);

  // Compute dynamic positions for milestones and task dots once the path is rendered
  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl || !phaseData || Object.keys(phaseData).length === 0) return;

    const result = calculateRoadmapPositions({
      pathElement: pathEl,
      phaseData,
      circleRadius
    });

    setMilestonePositions(result.milestonePositions);
    setTaskDotPositions(result.taskDotPositions);
    setLaunchPosition(result.launchPosition);
  }, [pathRef, phaseData, circleRadius]);

  return {
    milestonePositions,
    taskDotPositions,
    launchPosition: launchPosition || { x: 0, y: 0 },
    currentDot
  };
}; 
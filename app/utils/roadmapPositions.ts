import { Milestone as MilestoneType, TaskDot, PhaseData } from '@/app/types/roadmap';

export interface PositionCalculationParams {
  pathElement: SVGPathElement;
  phaseData: Record<number, PhaseData>;
  circleRadius: number;
}

export interface PositionCalculationResult {
  milestonePositions: MilestoneType[];
  taskDotPositions: TaskDot[];
  launchPosition: { x: number; y: number };
}

export const calculateRoadmapPositions = ({
  pathElement,
  phaseData,
  circleRadius
}: PositionCalculationParams): PositionCalculationResult => {
  const totalLength = pathElement.getTotalLength();
  const phases = Object.keys(phaseData)
    .map(k => Number(k))
    .sort((a, b) => a - b);

  // Compute segment ratios based on task counts with a floor to ensure minimum spacing
  const taskCounts = phases.map(p => phaseData[p].tasks.length);
  const totalTasksCount = taskCounts.reduce((sum, c) => sum + c, 0) || 1;
  
  // Default equal share per phase
  const defaultRatio = 1 / phases.length;
  // Minimum ratio floor (e.g., half of equal spacing)
  const minRatio = defaultRatio * 0.5;
  // Raw ratios from task counts
  const rawRatios = taskCounts.map(c => c / totalTasksCount);
  // Apply minimum floor and normalize
  const adjusted = rawRatios.map(r => Math.max(r, minRatio));
  const sumAdjusted = adjusted.reduce((sum, r) => sum + r, 0) || 1;
  const ratios = adjusted.map(r => r / sumAdjusted);
  
  // Compute cumulative start ratios
  const cumulativeRatios: number[] = [];
  ratios.reduce((acc, r, idx) => { 
    cumulativeRatios[idx] = acc; 
    return acc + r; 
  }, 0);

  // Add padding between phases to improve spacing
  const margin = circleRadius * 2;
  const effectiveLength = totalLength - margin * (phases.length - 1);

  // Calculate milestone positions
  const milestonePositions = calculateMilestonePositions({
    phases,
    phaseData,
    pathElement,
    cumulativeRatios,
    effectiveLength,
    margin
  });

  // Calculate task dot positions
  const taskDotPositions = calculateTaskDotPositions({
    phases,
    phaseData,
    pathElement,
    cumulativeRatios,
    ratios,
    effectiveLength,
    margin,
    circleRadius
  });

  // Launch position at end of path
  const endPoint = pathElement.getPointAtLength(totalLength);
  const launchPosition = { x: endPoint.x, y: endPoint.y };

  return {
    milestonePositions,
    taskDotPositions,
    launchPosition
  };
};

interface MilestonePositionParams {
  phases: number[];
  phaseData: Record<number, PhaseData>;
  pathElement: SVGPathElement;
  cumulativeRatios: number[];
  effectiveLength: number;
  margin: number;
}

const calculateMilestonePositions = ({
  phases,
  phaseData,
  pathElement,
  cumulativeRatios,
  effectiveLength,
  margin
}: MilestonePositionParams): MilestoneType[] => {
  return phases.map((phase, i) => {
    const startLen = (cumulativeRatios[i] * effectiveLength) + (margin * i);
    const { x, y } = pathElement.getPointAtLength(startLen);
    const data = phaseData[phase];
    const status: MilestoneType['status'] = phaseData[phase].status as MilestoneType['status'];
    
    return { 
      id: phase, 
      x, 
      y, 
      phase, 
      status, 
      critical: data.critical, 
      icon: data.icon 
    };
  });
};

interface TaskDotPositionParams extends MilestonePositionParams {
  ratios: number[];
  circleRadius: number;
}

const calculateTaskDotPositions = ({
  phases,
  phaseData,
  pathElement,
  cumulativeRatios,
  ratios,
  effectiveLength,
  margin,
  circleRadius
}: TaskDotPositionParams): TaskDot[] => {
  const dots: TaskDot[] = [];
  const milestonePositionsForCollision: { x: number; y: number }[] = [];
  
  // First, calculate milestone positions for collision detection
  phases.forEach((phase, pi) => {
    const startLen = (cumulativeRatios[pi] * effectiveLength) + (margin * pi);
    const { x, y } = pathElement.getPointAtLength(startLen);
    milestonePositionsForCollision.push({ x, y });
  });
  
  // Enhanced task dot placement algorithm
  phases.forEach((phase, pi) => {
    const tasks = phaseData[phase].tasks;
    
    // Keep original task order but group by status for better visual flow
    const tasksByStatus = {
      'completed': tasks.filter(t => t.status === 'completed'),
      'in-progress': tasks.filter(t => t.status === 'in-progress'),
      'pending': tasks.filter(t => t.status === 'pending')
    };
    
    // Flatten in status order but preserve original sequence within each status
    const sortedTasks = [
      ...tasksByStatus['completed'],
      ...tasksByStatus['in-progress'],
      ...tasksByStatus['pending']
    ];
    
    const M = sortedTasks.length;
    if (M === 0) return;
    
    const segmentStart = cumulativeRatios[pi] * effectiveLength + margin * pi;
    const segmentLen = ratios[pi] * effectiveLength;
    const milestonePos = milestonePositionsForCollision[pi];
    const milestoneRadius = circleRadius + 10; // Increased buffer around milestone
    const minDotSpacing = 12; // Minimum spacing between dots
    
    // Calculate safe positioning zone within segment
    const safeZoneStart = 0.1; // Start 10% into segment
    const safeZoneEnd = 0.9;   // End 90% into segment
    const safeZoneLength = safeZoneEnd - safeZoneStart;
    
    sortedTasks.forEach((task, ki) => {
      // Distribute tasks within safe zone
      const baseFrac = safeZoneStart + (safeZoneLength * (ki + 1) / (M + 1));
      let currentPos = pathElement.getPointAtLength(segmentStart + segmentLen * baseFrac);
      
      // Check collision with milestone
      const distanceToMilestone = Math.sqrt(
        Math.pow(currentPos.x - milestonePos.x, 2) + Math.pow(currentPos.y - milestonePos.y, 2)
      );
      
      if (distanceToMilestone < milestoneRadius) {
        // Try positions further from milestone
        for (let offset = 0.1; offset <= 0.3; offset += 0.05) {
          const testFrac = Math.min(baseFrac + offset, safeZoneEnd);
          const testPos = pathElement.getPointAtLength(segmentStart + segmentLen * testFrac);
          const testDistance = Math.sqrt(
            Math.pow(testPos.x - milestonePos.x, 2) + Math.pow(testPos.y - milestonePos.y, 2)
          );
          
          if (testDistance >= milestoneRadius) {
            currentPos = testPos;
            break;
          }
        }
      }
      
      // Check collision with existing dots
      let finalPos = currentPos;
      let hasCollision = true;
      let attempts = 0;
      const maxAttempts = 10;
      
      while (hasCollision && attempts < maxAttempts) {
        hasCollision = false;
        
        for (const existingDot of dots) {
          const distanceToDot = Math.sqrt(
            Math.pow(finalPos.x - existingDot.x, 2) + Math.pow(finalPos.y - existingDot.y, 2)
          );
          
          if (distanceToDot < minDotSpacing) {
            hasCollision = true;
            // Move slightly further along the path
            const newFrac = Math.min(baseFrac + (attempts + 1) * 0.03, safeZoneEnd);
            finalPos = pathElement.getPointAtLength(segmentStart + segmentLen * newFrac);
            break;
          }
        }
        attempts++;
      }
      
      dots.push({ 
        x: finalPos.x, 
        y: finalPos.y, 
        status: task.status,
        name: task.name,
        phaseTitle: phaseData[phase].title
      });
    });
  });

  return dots;
};

export const calculateProgress = (phaseData: Record<number, PhaseData>): number => {
  if (!phaseData || Object.keys(phaseData).length === 0) return 0;
  
  let totalTasks = 0;
  let completedTasks = 0;
  
  Object.values(phaseData).forEach(phase => {
    phase.tasks.forEach(task => {
      totalTasks++;
      if (task.status === 'completed') {
        completedTasks++;
      }
    });
  });
  
  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
}; 
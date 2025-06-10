import { line, curveCatmullRom } from 'd3-shape';

export interface RoadCanvasOptions {
  width: number;
  height: number;
  zoom: number;
  curvePoints: { x: number; y: number }[];
}

/**
 * Renders the road path on a canvas element for better performance
 * This replaces the heavy SVG road rendering with a lightweight bitmap
 */
export function renderRoadCanvas(
  canvas: HTMLCanvasElement,
  options: RoadCanvasOptions
): void {
  const { width, height, curvePoints } = options;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size accounting for device pixel ratio
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  
  // Scale context to match device pixel ratio only (not zoom)
  ctx.scale(dpr, dpr);
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Generate the smooth path using d3
  const pathGenerator = line<{ x: number; y: number }>()
    .x(d => d.x)
    .y(d => d.y)
    .curve(curveCatmullRom.alpha(0.7))
    .context(ctx); // d3 supports canvas context
  
  // Save context state
  ctx.save();
  
  // Draw road base shadow
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 86;
  ctx.lineCap = 'round';
  ctx.translate(0, 2);
  ctx.beginPath();
  pathGenerator(curvePoints);
  ctx.stroke();
  ctx.translate(0, -2);
  
  // Draw road base (wider for shoulders)
  ctx.strokeStyle = 'rgba(74, 85, 104, 0.5)'; // gray-800 with opacity
  ctx.lineWidth = 50;
  ctx.beginPath();
  pathGenerator(curvePoints);
  ctx.stroke();
  
  // Draw main road surface
  ctx.strokeStyle = '#2d3748'; // gray-800
  ctx.lineWidth = 84;
  ctx.beginPath();
  pathGenerator(curvePoints);
  ctx.stroke();
  
  // Draw white edge lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 2;
  
  // Top edge
  ctx.save();
  ctx.translate(0, -38);
  ctx.beginPath();
  pathGenerator(curvePoints);
  ctx.stroke();
  ctx.restore();
  
  // Bottom edge
  ctx.save();
  ctx.translate(0, 38);
  ctx.beginPath();
  pathGenerator(curvePoints);
  ctx.stroke();
  ctx.restore();
  
  // Draw center dashed yellow line
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)'; // yellow-400
  ctx.lineWidth = 3;
  ctx.setLineDash([30, 20]);
  ctx.beginPath();
  pathGenerator(curvePoints);
  ctx.stroke();
  ctx.setLineDash([]); // Reset dash
  
  // Draw simple sparkles as dots
  ctx.fillStyle = 'rgba(252, 211, 77, 0.6)'; // yellow-300
  curvePoints
    .filter((_, i) => i % 3 === 0)
    .forEach(point => {
      const offsetX = (Math.random() - 0.5) * 40;
      const offsetY = (Math.random() - 0.5) * 40;
      const size = 0.5 + Math.random() * 1;
      
      ctx.beginPath();
      ctx.arc(
        point.x + offsetX,
        point.y + offsetY,
        size,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
  
  // Restore context
  ctx.restore();
}

/**
 * Creates an off-screen canvas for pre-rendering the road
 * This can be drawn once and reused, significantly improving performance
 */
export function createRoadCanvas(options: RoadCanvasOptions): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  renderRoadCanvas(canvas, options);
  return canvas;
} 
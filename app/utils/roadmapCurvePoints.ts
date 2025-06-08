// Static control points for dynamic roadmap spline
export const roadmapCurvePoints: { x: number; y: number }[] = [
  { x: 50, y: 400 },      // Start more centered, no sharp edge
  { x: 200, y: 380 },     // Gentle start curve
  { x: 400, y: 300 },     // First gentle bend
  { x: 600, y: 200 },     // Rise up
  { x: 800, y: 150 },     // Peak of first hill
  { x: 1000, y: 200 },    // Descend
  { x: 1200, y: 350 },    // Valley
  { x: 1400, y: 450 },    // Deep curve
  { x: 1600, y: 500 },    // Lower point
  { x: 1800, y: 450 },    // Rise again
  { x: 2000, y: 300 },    // Another hill
  { x: 2200, y: 250 },    // Gentle curve
  { x: 2400, y: 300 },    // Midway
  { x: 2600, y: 400 },    // S-curve start
  { x: 2800, y: 500 },    // S-curve middle
  { x: 3000, y: 450 },    // S-curve end
  { x: 3200, y: 350 },    // Straighten out
  { x: 3400, y: 300 },    // Final approach
  { x: 3600, y: 350 },    // End position
]; 
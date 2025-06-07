import { PhaseData } from '@/app/types/roadmap';

export const phaseData: Record<number, PhaseData> = {
  1: {
    title: "Quick Wins & Foundation",
    tagline: "Get the basics running and show immediate value",
    status: "in-progress",
    startDate: "June 9, 2025",
    endDate: "July 7, 2025",
    critical: false,
    tasks: [
      { name: "Set up AWS/cloud infrastructure for hosting", status: "completed" },
      { name: "Deploy Malindi AI assistant (backend and frontend)", status: "completed" },
      { name: "Create basic web interface for CTM", status: "in-progress" },
      { name: "Connect to existing databases (Oracle, NOP)", status: "pending" },
      { name: "Implement basic search functionality", status: "pending" },
      { name: "Set up WhatsApp integration via Wassenger", status: "pending" },
      { name: "Configure OpenAI integration for Malindi", status: "pending" },
      { name: "Basic user authentication and access control", status: "pending" }
    ],
    content: []
  },
  2: {
    title: "Data Unification",
    tagline: "Bring all scattered data into one place",
    status: "pending",
    startDate: "July 8, 2025",
    endDate: "August 4, 2025",
    critical: true,
    tasks: [
      { name: "[CRITICAL PATH] Complete historical data migration from all sources", status: "pending" },
      { name: "Build data reconciliation engine", status: "pending" },
      { name: "Create unified customer profiles", status: "pending" },
      { name: "Implement automated daily data sync", status: "pending" },
      { name: "Set up data quality monitoring", status: "pending" },
      { name: "Build comprehensive audit trail", status: "pending" },
      { name: "Create data backup procedures", status: "pending" }
    ],
    content: []
  },
  3: {
    title: "Real-Time Operations",
    tagline: "See everything as it happens",
    status: "pending",
    startDate: "August 5, 2025",
    endDate: "September 1, 2025",
    critical: true,
    tasks: [
      { name: "Build real-time position dashboard", status: "pending" },
      { name: "[CRITICAL PATH] Integrate with SMS for settlement visibility", status: "pending" },
      { name: "Create automated rate collection system", status: "pending" },
      { name: "Implement liquidity monitoring", status: "pending" },
      { name: "Set up critical alerts (position limits, liquidity warnings)", status: "pending" },
      { name: "Build mobile-responsive interface", status: "pending" },
      { name: "Create role-based dashboards", status: "pending" }
    ],
    content: []
  },
  4: {
    title: "Intelligent Automation",
    tagline: "Let the system handle routine tasks",
    status: "pending",
    startDate: "September 2, 2025",
    endDate: "September 29, 2025",
    critical: false,
    tasks: [
      { name: "Build automated rate distribution engine", status: "pending" },
      { name: "Implement smart trade recording", status: "pending" },
      { name: "Create customer tier management system", status: "pending" },
      { name: "Develop anomaly detection algorithms", status: "pending" },
      { name: "Build automated reporting suite", status: "pending" },
      { name: "Integrate with compliance checks", status: "pending" },
      { name: "Set up automated customer communications", status: "pending" }
    ],
    content: []
  },
  5: {
    title: "Advanced Intelligence",
    tagline: "Predict problems before they happen",
    status: "pending",
    startDate: "September 30, 2025",
    endDate: "October 27, 2025",
    critical: true,
    tasks: [
      { name: "Implement predictive analytics for liquidity", status: "pending" },
      { name: "Build customer behaviour analysis", status: "pending" },
      { name: "Create trade pattern recognition", status: "pending" },
      { name: "Develop margin optimisation tools", status: "pending" },
      { name: "Build knowledge capture system", status: "pending" },
      { name: "Implement performance analytics", status: "pending" },
      { name: "Create training modules", status: "pending" }
    ],
    content: []
  },
  6: {
    title: "Seamless Integration",
    tagline: "Become the central nervous system",
    status: "pending",
    startDate: "October 28, 2025",
    endDate: "November 24, 2025",
    critical: true,
    tasks: [
      { name: "Complete SS integration for support context", status: "pending" },
      { name: "[CRITICAL PATH] Full bi-directional SMS integration", status: "pending" },
      { name: "Enhanced LCS integration for real-time compliance", status: "pending" },
      { name: "Build unified Seamless dashboard", status: "pending" },
      { name: "Implement cross-module workflows", status: "pending" },
      { name: "Create executive reporting suite", status: "pending" },
      { name: "Performance optimisation", status: "pending" }
    ],
    content: []
  },
  7: {
    title: "Seamless Integration",
    tagline: "Become the central nervous system",
    status: "pending",
    startDate: "October 28, 2025",
    endDate: "November 24, 2025",
    critical: true,
    tasks: [
      { name: "Complete SS integration for support context", status: "pending" },
      { name: "[CRITICAL PATH] Full bi-directional SMS integration", status: "pending" },
      { name: "Enhanced LCS integration for real-time compliance", status: "pending" },
      { name: "Build unified Seamless dashboard", status: "pending" },
      { name: "Implement cross-module workflows", status: "pending" },
      { name: "Create executive reporting suite", status: "pending" },
      { name: "Performance optimisation", status: "pending" }
    ],
    content: []
  }
};

// Control points for dynamic roadmap spline
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
  { x: 2400, y: 300 },    // 
  { x: 2600, y: 400 },    // S-curve start
  { x: 2800, y: 500 },    // S-curve middle
  { x: 3000, y: 450 },    // S-curve end
  { x: 3200, y: 350 },    // Straighten out
  { x: 3400, y: 300 },    // Final approach
  { x: 3600, y: 350 },    // End position
]; 
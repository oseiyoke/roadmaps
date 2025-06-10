/**
 * Feature detection utilities for optimizing rendering approach
 */

// Extend Navigator interface for device memory API
interface NavigatorDeviceMemory extends Navigator {
  deviceMemory?: number;
}

export function supportsCanvasOptimizations(): boolean {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return false;
  
  // Check for canvas support
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;
  
  // Check for performance API (indicates modern browser)
  const hasPerformanceAPI = 'performance' in window && 
    'now' in window.performance;
  
  // Check for requestAnimationFrame
  const hasRAF = 'requestAnimationFrame' in window;
  
  // Check device memory (if available)
  const navigatorWithMemory = navigator as NavigatorDeviceMemory;
  const deviceMemory = navigatorWithMemory.deviceMemory;
  const hasLowMemory = deviceMemory !== undefined && deviceMemory < 4;
  
  // Check for Safari specific issues
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const safariVersion = isSafari ? getSafariVersion() : null;
  const isOldSafari = safariVersion && safariVersion < 15;
  
  // Don't use Canvas on very old Safari or low memory devices
  if (isOldSafari || hasLowMemory) return false;
  
  // All checks passed
  return hasPerformanceAPI && hasRAF;
}

function getSafariVersion(): number | null {
  const match = navigator.userAgent.match(/Version\/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Checks if the browser has good filter support
 * Useful for deciding whether to apply visual effects
 */
export function supportsAdvancedFilters(): boolean {
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  
  return CSS.supports('filter', 'blur(1px)') && 
         CSS.supports('backdrop-filter', 'blur(1px)');
}

/**
 * Get the optimal rendering configuration based on device capabilities
 */
export function getOptimalRenderingConfig() {
  const canUseCanvas = supportsCanvasOptimizations();
  const canUseFilters = supportsAdvancedFilters();
  const navigatorWithMemory = navigator as NavigatorDeviceMemory;
  const deviceMemory = navigatorWithMemory.deviceMemory;
  
  return {
    useHybridRendering: canUseCanvas,
    useFilters: canUseFilters,
    // Reduce quality on low-end devices
    sparkleCount: canUseCanvas ? 10 : 5,
    enableParallax: canUseCanvas,
    enableAnimations: canUseCanvas && !(deviceMemory !== undefined && deviceMemory < 2)
  };
} 
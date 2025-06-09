'use client';

import { useEffect, useRef } from 'react';

interface UseParallaxScrollParams {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useParallaxScroll = ({ containerRef }: UseParallaxScrollParams) => {
  const rafRef = useRef<number>(0);
  const lastScrollRef = useRef<number>(0);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;
    
    const updateParallax = () => {
      const scrollLeft = container.scrollLeft;
      
      // Only update if scroll position changed significantly (reduces Safari repaints)
      if (Math.abs(scrollLeft - lastScrollRef.current) < 2) {
        ticking = false;
        return;
      }
      
      lastScrollRef.current = scrollLeft;
      
      // Get landscape layer elements
      const layers = {
        veryFar: document.querySelector('.landscape-layer-very-far') as HTMLElement,
        far: document.querySelector('.landscape-layer-far') as HTMLElement,
        mid: document.querySelector('.landscape-layer-mid') as HTMLElement,
        midNear: document.querySelector('.landscape-layer-mid-near') as HTMLElement,
        near: document.querySelector('.landscape-layer-near') as HTMLElement,
        veryNear: document.querySelector('.landscape-layer-very-near') as HTMLElement,
        cloudsFar: document.querySelector('.clouds-far') as HTMLElement,
        cloudsMid: document.querySelector('.clouds-mid') as HTMLElement,
        cloudsNear: document.querySelector('.clouds-near') as HTMLElement,
      };
      
      // Use transform3d for GPU acceleration and batch updates
      const transforms: { element: HTMLElement | null; transform: string }[] = [
        { element: layers.veryFar, transform: `translate3d(${-scrollLeft * 0.01}px, 0, 0)` },
        { element: layers.far, transform: `translate3d(${-scrollLeft * 0.03}px, 0, 0)` },
        { element: layers.mid, transform: `translate3d(${-scrollLeft * 0.08}px, 0, 0)` },
        { element: layers.midNear, transform: `translate3d(${-scrollLeft * 0.12}px, 0, 0)` },
        { element: layers.near, transform: `translate3d(${-scrollLeft * 0.18}px, 0, 0)` },
        { element: layers.veryNear, transform: `translate3d(${-scrollLeft * 0.25}px, 0, 0)` },
        // Simplified cloud movement without time-based animation
        { element: layers.cloudsFar, transform: `translate3d(${-scrollLeft * 0.01}px, 0, 0)` },
        { element: layers.cloudsMid, transform: `translate3d(${-scrollLeft * 0.03}px, 0, 0)` },
        { element: layers.cloudsNear, transform: `translate3d(${-scrollLeft * 0.06}px, 0, 0)` },
      ];
      
      // Apply all transforms in a single batch
      transforms.forEach(({ element, transform }) => {
        if (element) {
          element.style.transform = transform;
          element.style.willChange = 'transform';
        }
      });
      
      ticking = false;
    };
    
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        rafRef.current = requestAnimationFrame(updateParallax);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [containerRef]);
}; 
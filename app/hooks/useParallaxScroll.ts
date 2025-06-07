'use client';

import { useEffect } from 'react';

interface UseParallaxScrollParams {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useParallaxScroll = ({ containerRef }: UseParallaxScrollParams) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const scrollProgress = scrollLeft / (container.scrollWidth - container.clientWidth);
      
      // Get landscape layer elements
      const landscapeVeryFar = document.querySelector('.landscape-layer-very-far') as HTMLElement;
      const landscapeFar = document.querySelector('.landscape-layer-far') as HTMLElement;
      const landscapeMid = document.querySelector('.landscape-layer-mid') as HTMLElement;
      const landscapeMidNear = document.querySelector('.landscape-layer-mid-near') as HTMLElement;
      const landscapeNear = document.querySelector('.landscape-layer-near') as HTMLElement;
      const landscapeVeryNear = document.querySelector('.landscape-layer-very-near') as HTMLElement;
      const cloudsFar = document.querySelector('.clouds-far') as HTMLElement;
      const cloudsMid = document.querySelector('.clouds-mid') as HTMLElement;
      const cloudsNear = document.querySelector('.clouds-near') as HTMLElement;
      
      // Apply parallax effect to landscape layers with different speeds
      // Slower movement for far layers, faster for near layers to create depth
      const time = Date.now() * 0.0001;
      
      // Landscape layers with progressive speeds
      if (landscapeVeryFar) {
        landscapeVeryFar.style.transform = `translateX(${-scrollLeft * 0.01}px) translateY(${Math.sin(scrollProgress * Math.PI * 0.3) * 10}px)`;
      }
      
      if (landscapeFar) {
        landscapeFar.style.transform = `translateX(${-scrollLeft * 0.03}px) translateY(${Math.sin(scrollProgress * Math.PI * 0.7) * 7}px)`;
      }
      
      if (landscapeMid) {
        landscapeMid.style.transform = `translateX(${-scrollLeft * 0.08}px) translateY(${Math.sin(scrollProgress * Math.PI * 1.2) * 4}px)`;
      }
      
      if (landscapeMidNear) {
        landscapeMidNear.style.transform = `translateX(${-scrollLeft * 0.12}px) translateY(${Math.sin(scrollProgress * Math.PI * 1.7) * 3}px)`;
      }
      
      if (landscapeNear) {
        landscapeNear.style.transform = `translateX(${-scrollLeft * 0.18}px) translateY(${Math.sin(scrollProgress * Math.PI * 2.2) * 2}px)`;
      }
      
      if (landscapeVeryNear) {
        landscapeVeryNear.style.transform = `translateX(${-scrollLeft * 0.25}px) translateY(${Math.sin(scrollProgress * Math.PI * 2.8) * 1}px)`;
      }
      
      // Cloud layers with enhanced movement and gentle auto-drift
      if (cloudsFar) {
        cloudsFar.style.transform = `translateX(${-scrollLeft * 0.01 - time * 5}px) translateY(${Math.sin(time * 0.3) * 4}px)`;
      }
      
      if (cloudsMid) {
        cloudsMid.style.transform = `translateX(${-scrollLeft * 0.03 - time * 8}px) translateY(${Math.sin(time * 0.5) * 3}px)`;
      }
      
      if (cloudsNear) {
        cloudsNear.style.transform = `translateX(${-scrollLeft * 0.06 - time * 12}px) translateY(${Math.sin(time * 0.7) * 2}px)`;
      }
    };

    // Animate clouds continuously
    const animationFrame = () => {
      handleScroll();
      requestAnimationFrame(animationFrame);
    };
    requestAnimationFrame(animationFrame);

    container.addEventListener('scroll', handleScroll);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef]);
}; 
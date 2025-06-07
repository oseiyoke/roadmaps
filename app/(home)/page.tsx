'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    // Check if user has existing roadmaps
    const roadmaps = localStorage.getItem('roadmaps');
    if (roadmaps && JSON.parse(roadmaps).length > 0) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {/* Logo/Brand */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-600">Roadmap Visualizer</h2>
        </div>

        {/* Hero Content */}
        <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 leading-tight">
          Transform your Notion roadmaps
          <br />
          into <span className="text-blue-600">beautiful visualizations</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Connect your Notion databases and watch your project roadmaps come to life with interactive, 
          real-time visualizations that keep everyone aligned.
        </p>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Connect Your Roadmap
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        {/* Trust Indicators */}
        <div className="mt-16 flex items-center justify-center space-x-8 text-sm text-gray-500">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            No sign-up required
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Your data stays local
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Real-time sync
          </div>
        </div>
      </div>
    </div>
  );
} 
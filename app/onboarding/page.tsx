'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NotionSetup from '../components/onboarding/NotionSetup';
import DatabaseSelector from '../components/onboarding/DatabaseSelector';
import RoadmapPreview from '../components/onboarding/RoadmapPreview';

type Step = 'setup' | 'databases' | 'preview';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('setup');
  const [integrationToken, setIntegrationToken] = useState('');
  const [selectedDatabases, setSelectedDatabases] = useState({
    projects: '',
    tasks: '',
    name: ''
  });

  const handleSetupComplete = (token: string) => {
    setIntegrationToken(token);
    setCurrentStep('databases');
  };

  const handleDatabasesComplete = (databases: typeof selectedDatabases) => {
    setSelectedDatabases(databases);
    setCurrentStep('preview');
  };

  const handleOnboardingComplete = () => {
    // Save roadmap to localStorage
    const roadmapId = crypto.randomUUID();
    const roadmap = {
      id: roadmapId,
      name: selectedDatabases.name || 'My Roadmap',
      platform: 'notion',
      notionConfig: {
        accessToken: integrationToken,
        projectsDatabaseId: selectedDatabases.projects,
        tasksDatabaseId: selectedDatabases.tasks,
      },
      createdAt: new Date().toISOString(),
      lastSynced: new Date().toISOString(),
    };

    const existingRoadmaps = localStorage.getItem('roadmaps');
    const roadmaps = existingRoadmaps ? JSON.parse(existingRoadmaps) : [];
    roadmaps.push(roadmap);
    localStorage.setItem('roadmaps', JSON.stringify(roadmaps));
    
    // Initialize user if needed
    const user = localStorage.getItem('roadmap_user');
    if (!user) {
      localStorage.setItem('roadmap_user', JSON.stringify({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        lastVisited: new Date().toISOString()
      }));
    }

    // Redirect to the roadmap view
    router.push(`/roadmap/${roadmapId}`);
  };

  const handleBack = () => {
    if (currentStep === 'databases') setCurrentStep('setup');
    else if (currentStep === 'preview') setCurrentStep('databases');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold">Connect Your Notion Roadmap</h1>
            </div>
            
            {/* Progress */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${currentStep === 'setup' ? 'bg-blue-600' : 'bg-gray-300'}`} />
              <div className={`w-2 h-2 rounded-full ${currentStep === 'databases' ? 'bg-blue-600' : 'bg-gray-300'}`} />
              <div className={`w-2 h-2 rounded-full ${currentStep === 'preview' ? 'bg-blue-600' : 'bg-gray-300'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentStep === 'setup' && (
          <NotionSetup onComplete={handleSetupComplete} />
        )}
        
        {currentStep === 'databases' && (
          <DatabaseSelector 
            token={integrationToken}
            onComplete={handleDatabasesComplete}
            onBack={handleBack}
          />
        )}
        
        {currentStep === 'preview' && (
          <RoadmapPreview
            token={integrationToken}
            databases={selectedDatabases}
            onComplete={handleOnboardingComplete}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
} 
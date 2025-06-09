'use client';

import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { RoadmapConfigContext } from './RoadmapViewer';

interface RoadmapHeaderProps {
  onRefresh?: () => void;
}

interface ExtendedRoadmapConfig {
  id: string;
  name: string;
  platform: string;
  shareId?: string;
  notionConfig?: {
    accessToken: string;
    projectsDatabaseId: string;
    tasksDatabaseId: string;
  };
}

export const RoadmapHeader: React.FC<RoadmapHeaderProps> = ({ onRefresh }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  // Try to get config from context
  let roadmapName = 'Roadmap';
  let shareId: string | undefined;
  try {
    const config = useContext(RoadmapConfigContext);
    if (config) {
      roadmapName = config.name;
      shareId = (config as ExtendedRoadmapConfig).shareId;
    }
  } catch {
    // Context not available, use default
  }
  
  const handleShare = () => {
    if (shareId) {
      const link = `${window.location.origin}/share/${shareId}`;
      setShareLink(link);
      setShowShareModal(true);
    }
  };
  
  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    await navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCloseModal = () => {
    setShowShareModal(false);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from closing when clicking inside
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-b backdrop-blur-sm">
        <div className="px-6 py-2.5">
          <div className="flex items-center justify-between">
            {/* Left side - Back button */}
            <Link
              href="/dashboard"
              className="group inline-flex items-center px-2.5 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Dashboard</span>
            </Link>

            {/* Center - Roadmap name */}
            <h1 className="text-lg font-medium text-gray-800 tracking-tight">{roadmapName}</h1>

            {/* Right side - Actions */}
            <div className="flex items-center gap-1">
              {shareId && (
                <button
                  onClick={handleShare}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-md transition-all"
                  title="Share roadmap"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                </button>
              )}
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-md transition-all"
                  title="Sync with Notion"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={handleCloseModal}>
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Lighter overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
            </div>

            {/* Spacer element to center the modal vertically */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            {/* Modal content */}
            <div 
              className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 relative"
              onClick={handleModalClick}
            >
              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  {/* Better share icon */}
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Share your roadmap
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Anyone with this link can view your roadmap
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-5">
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    readOnly
                    value={shareLink}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md text-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 
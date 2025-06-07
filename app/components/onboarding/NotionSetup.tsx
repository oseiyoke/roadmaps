'use client';

import { useState } from 'react';

interface NotionSetupProps {
  onComplete: (token: string) => void;
}

export default function NotionSetup({ onComplete }: NotionSetupProps) {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onComplete(token.trim());
    }
  };

  const openNotionIntegrations = () => {
    window.open('https://www.notion.so/my-integrations', '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="text-center">
        <h2 className="text-3xl font-semibold mb-3">Let&apos;s connect to Notion</h2>
        <p className="text-lg">Follow these simple steps to connect your Notion workspace</p>
      </div>

      {/* Step by Step Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-lg flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Quick Setup Guide
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div className="ml-3">
                <span className="font-medium">Create a Notion Integration Token</span>
                <button
                  type="button"
                  onClick={openNotionIntegrations}
                  className="mx-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Open Notion Integrations
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div className="ml-3">
                <p className="font-medium">Grant Access to Your Databases</p>
                <p className="text-sm text-gray-700 mt-1">
                  Once you've created the integration, click on the <b>Access</b> tab and grant access to the relevant Notion pages
                </p>
              </div>
            </div>
          </div>

        </div>

      {/* Token Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
            Integration Token
          </label>
          <input
            type="password"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ntn_..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
          <p className="mt-2 text-sm text-gray-600">
            <svg className="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Your token is encrypted and stored locally
          </p>
        </div>

        <button
          type="submit"
          disabled={!token.trim()}
          className="w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </form>

      {/* Help Section */}
      <div className="border-t pt-6">
        <details className="text-sm">
          <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
            Need help finding your databases?
          </summary>
          <div className="mt-3 space-y-2 text-gray-700">
            <p>After connecting, we&apos;ll help you find your roadmap databases. Make sure your Notion workspace has:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>A database for your project phases/milestones</li>
              <li>A database for your tasks</li>
              <li>Tasks linked to their phases using a relation</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
} 
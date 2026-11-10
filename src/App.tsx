/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SurveyView } from './components/SurveyView';
import { DashboardView } from './components/DashboardView';
import { FirebaseGuideView } from './components/FirebaseGuideView';
import { QRCodeModal } from './components/QRCodeModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'survey' | 'dashboard' | 'guide'>('dashboard');
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [surveyUrl, setSurveyUrl] = useState<string>('');

  useEffect(() => {
    // Generate clean link pointing to standalone survey file or app mode
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      // In Vite dev or production, /survey.html is served from /public
      setSurveyUrl(`${origin}/survey.html`);

      // Check URL hash if attendee scanned direct link
      if (window.location.hash === '#survey') {
        setCurrentTab('survey');
      } else if (window.location.hash === '#guide') {
        setCurrentTab('guide');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (typeof window !== 'undefined') {
            window.location.hash = tab === 'dashboard' ? '' : tab;
          }
        }}
        onOpenQR={() => setIsQRModalOpen(true)}
      />

      {/* Main View Area */}
      <div className="flex-1">
        {currentTab === 'survey' && (
          <SurveyView
            onSubmittedSuccess={() => {
              // Optionally transition to dashboard after 3 seconds or keep in success view
            }}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            onOpenQR={() => setIsQRModalOpen(true)}
            surveyUrl={surveyUrl}
          />
        )}

        {currentTab === 'guide' && <FirebaseGuideView />}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 py-4 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>LiveEval © ระบบประเมินความพึงพอใจการอบรม & Live Dashboard สำหรับขึ้นจอโปรเจกเตอร์</span>
          <div className="flex items-center gap-3">
            <a
              href="/survey.html"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              เปิด survey.html โดยตรง
            </a>
            <span>·</span>
            <a
              href="/dashboard.html"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              เปิด dashboard.html โดยตรง
            </a>
          </div>
        </div>
      </footer>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        surveyUrl={surveyUrl}
      />
    </div>
  );
}

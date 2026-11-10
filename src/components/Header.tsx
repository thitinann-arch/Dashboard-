import React from 'react';
import { Smartphone, LayoutDashboard, FileCode2, QrCode } from 'lucide-react';

interface HeaderProps {
  currentTab: 'survey' | 'dashboard' | 'guide';
  onSelectTab: (tab: 'survey' | 'dashboard' | 'guide') => void;
  onOpenQR: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, onOpenQR }) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-xs">
            LE
          </div>
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            LiveEval
          </span>
        </div>

        {/* Zone 2: Navigation Links / Segmented View Switcher */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
          <button
            onClick={() => onSelectTab('survey')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'survey'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>หน้าตอบแบบสอบถาม (Mobile)</span>
          </button>

          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Live Dashboard (จอโปรเจกเตอร์)</span>
          </button>

          <button
            onClick={() => onSelectTab('guide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'guide'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>โค้ด 2 ไฟล์ & ติดตั้ง Firebase</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenQR}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">QR Code ตอบแบบสอบถาม</span>
            <span className="sm:hidden">QR</span>
          </button>
        </div>

      </div>
    </header>
  );
};

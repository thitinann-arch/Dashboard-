import React, { useState } from 'react';
import { Copy, Check, Download, Terminal, Database, Globe, Key, ShieldCheck, Play } from 'lucide-react';
import { storageService } from '../services/storage';

export const FirebaseGuideView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'survey' | 'dashboard'>('survey');
  const [copiedSurvey, setCopiedSurvey] = useState<boolean>(false);
  const [copiedDashboard, setCopiedDashboard] = useState<boolean>(false);
  const [copiedRules, setCopiedRules] = useState<boolean>(false);

  // Live Database URL connection test input
  const [databaseUrlInput, setDatabaseUrlInput] = useState<string>(
    storageService.getFirebaseConfig()?.databaseURL || ''
  );
  const [testStatus, setTestStatus] = useState<string>('');

  const handleCopy = (type: 'survey' | 'dashboard' | 'rules') => {
    let text = '';
    if (type === 'survey') {
      text = surveyHtmlCode;
      setCopiedSurvey(true);
      setTimeout(() => setCopiedSurvey(false), 2000);
    } else if (type === 'dashboard') {
      text = dashboardHtmlCode;
      setCopiedDashboard(true);
      setTimeout(() => setCopiedDashboard(false), 2000);
    } else {
      text = firebaseRulesCode;
      setCopiedRules(true);
      setTimeout(() => setCopiedRules(false), 2000);
    }
    navigator.clipboard.writeText(text);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveFirebaseConfig = async () => {
    if (!databaseUrlInput.trim()) {
      storageService.setFirebaseConfig(null);
      setTestStatus('ล้างการเชื่อมต่อเรียบร้อย (กลับสู่โหมด Local Realtime)');
      return;
    }

    setTestStatus('กำลังตรวจสอบการเชื่อมต่อกับ Firebase...');
    const cleaned = databaseUrlInput.trim().replace(/\/+$/, '');
    storageService.setFirebaseConfig({
      apiKey: '',
      authDomain: '',
      databaseURL: cleaned,
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    });

    const success = await storageService.syncFromFirebase();
    if (success) {
      setTestStatus('✓ เชื่อมต่อ Firebase Realtime Database สำเร็จ! ข้อมูลจะซิงก์สดอัตโนมัติ');
    } else {
      setTestStatus('⚠️ ไม่สามารถเชื่อมต่อได้ ตรวจสอบ URL หรือ Security Rules ใน Firebase Console อีกครั้ง');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      
      {/* Overview Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                โค้ดแยก 2 ไฟล์ & คู่มือติดตั้ง Firebase Realtime Database
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              ระบบนี้ออกแบบมาให้ทำงานได้ทันทีด้วย <strong>HTML + JavaScript + Firebase Realtime Database</strong> ฟรี 100% (Spark Plan) ไม่ต้องลงทะเบียนหรือล็อกอิน และไม่เก็บชื่อผู้ตอบ
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleDownloadFile('survey.html', surveyHtmlCode)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลด survey.html</span>
            </button>
            <button
              onClick={() => handleDownloadFile('dashboard.html', dashboardHtmlCode)}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลด dashboard.html</span>
            </button>
          </div>
        </div>

        {/* Live Firebase Connector Box inside App */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Key className="w-4 h-4 text-amber-500" />
            <span>เชื่อมต่อ Firebase Realtime Database ของคุณเข้ากับหน้านี้โดยตรง (อุปกรณ์ทดสอบ)</span>
          </h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={databaseUrlInput}
              onChange={(e) => setDatabaseUrlInput(e.target.value)}
              placeholder="https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com"
              className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={handleSaveFirebaseConfig}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              <Play className="w-3.5 h-3.5" />
              <span>บันทึก & ทดสอบเชื่อมต่อ</span>
            </button>
          </div>
          {testStatus && (
            <p className="text-xs font-medium mt-2 text-blue-600 dark:text-blue-400">
              {testStatus}
            </p>
          )}
        </div>
      </div>

      {/* Step by Step Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Step 1 & 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>ขั้นตอนที่ 1 - 2: สร้าง Firebase และเปิด Realtime Database</span>
          </div>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">1. สร้าง Firebase Project ฟรี (ไม่มีค่าใช้จ่าย)</p>
              <p>เข้าไปที่ <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">console.firebase.google.com</a> กด <strong>Add project</strong> ตั้งชื่อโปรเจกต์ เช่น <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">training-eval</code> ปิด Google Analytics แล้วกด Create Project</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">2. เปิด Realtime Database</p>
              <p>ไปที่เมนู <strong>Build &gt; Realtime Database</strong> กดปุ่ม <strong>Create Database</strong> เลือกตำแหน่งที่ตั้งใกล้ไทย เช่น <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">asia-southeast1 (Singapore)</code> หรือ <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">us-central1</code></p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900 dark:text-white">3. ตั้งค่า Security Rules (อ่าน/เขียนได้โดยไม่ต้องล็อกอิน)</p>
                <button
                  onClick={() => handleCopy('rules')}
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRules ? 'คัดลอกแล้ว' : 'คัดลอก Rules'}</span>
                </button>
              </div>
              <pre className="p-2.5 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto">
                {firebaseRulesCode}
              </pre>
              <p className="text-[11px] text-slate-500">
                นำโค้ดด้านบนไปวางในแท็บ <strong>Rules</strong> ของ Realtime Database แล้วกด <strong>Publish</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 & 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            <span>ขั้นตอนที่ 3 - 4: ใส่ Config และ Deploy ฟรี</span>
          </div>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">4. นำ firebaseConfig มาใส่ในโค้ด</p>
              <p>ไปที่รูปเฟือง <strong>Project Settings</strong> &gt; เลื่อนลงมาที่ <strong>Your apps</strong> &gt; เลือกไอคอนเว็บ <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">&lt;/&gt;</code> แล้วนำตัวแปร <code className="font-mono text-blue-600 font-bold">firebaseConfig</code> มาแทนที่ในไฟล์ <code className="font-mono">survey.html</code> และ <code className="font-mono">dashboard.html</code></p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
              <p className="font-bold text-slate-900 dark:text-white">5. วิธี Deploy ฟรี (เลือกวิธีที่สะดวกที่สุด)</p>
              
              <div className="space-y-1.5 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                <p><strong>ตัวเลือก A: Netlify Drop (ง่ายสุดใน 10 วินาที):</strong> ลากโฟลเดอร์ที่มีไฟล์ <code className="font-mono">survey.html</code> และ <code className="font-mono">dashboard.html</code> ไปวางที่ <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-blue-600 underline">app.netlify.com/drop</a> จะได้ลิงก์ใช้งานทันที</p>
                <p><strong>ตัวเลือก B: GitHub Pages (ฟรีตลอดชีพ):</strong> อัปโหลด 2 ไฟล์ขึ้น GitHub Repo &gt; Settings &gt; Pages &gt; เปิดใช้งาน</p>
                <p><strong>ตัวเลือก C: Firebase Hosting (รวดเร็วและเป็นทางการ):</strong> รัน <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">firebase init hosting</code> แล้วรัน <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">firebase deploy</code></p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>ทั้งสองไฟล์สามารถเปิดใช้งานบนเว็บหรือเปิดดูไฟล์ Local ในคอมพิวเตอร์พร้อมกันได้ทันที</span>
            </div>
          </div>
        </div>

      </div>

      {/* Code Viewer Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('survey')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'survey'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              📄 ไฟล์ที่ 1: survey.html (หน้าตอบสำหรับมือถือ)
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              📊 ไฟล์ที่ 2: dashboard.html (หน้า Dashboard จอโปรเจกเตอร์)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(activeTab)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {(activeTab === 'survey' ? copiedSurvey : copiedDashboard) ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{(activeTab === 'survey' ? copiedSurvey : copiedDashboard) ? 'คัดลอกแล้ว' : 'คัดลอกโค้ดทั้งหมด'}</span>
            </button>

            <button
              onClick={() =>
                handleDownloadFile(
                  activeTab === 'survey' ? 'survey.html' : 'dashboard.html',
                  activeTab === 'survey' ? surveyHtmlCode : dashboardHtmlCode
                )
              }
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลดไฟล์</span>
            </button>
          </div>
        </div>

        {/* Code Block Container */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>{activeTab === 'survey' ? 'public/survey.html' : 'public/dashboard.html'}</span>
            <span>UTF-8 · Single File Standalone</span>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-[500px] leading-relaxed">
            {activeTab === 'survey' ? surveyHtmlCode : dashboardHtmlCode}
          </pre>
        </div>

      </div>

    </div>
  );
};

const firebaseRulesCode = `{
  "rules": {
    "training_eval": {
      ".read": true,
      ".write": true
    }
  }
}`;

const surveyHtmlCode = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>แบบประเมินความพึงพอใจการอบรม</title>
  <!-- Google Fonts: Prompt for Thai typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Canvas Confetti for Celebration on submit -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>

  <!-- Firebase App & Realtime Database SDK (Compat v9) -->
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>

  <style>
    body { font-family: 'Prompt', sans-serif; -webkit-tap-highlight-color: transparent; }
    .rating-btn { touch-action: manipulation; transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1); }
    .rating-btn:active { transform: scale(0.94); }
    .rating-btn.selected { background-color: #2563eb; color: #ffffff; border-color: #1d4ed8; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.28); }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen pb-12 antialiased">
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
    <div class="max-w-md mx-auto px-4 py-3.5 flex items-center justify-between">
      <div>
        <h1 class="text-base font-bold text-slate-900 tracking-tight">แบบประเมินความพึงพอใจการอบรม</h1>
        <p class="text-xs text-slate-500">ตอบง่าย ใช้เวลาไม่เกิน 1 นาที ไม่ระบุตัวตน</p>
      </div>
      <span id="progress-text" class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">0 / 5 ข้อ</span>
    </div>
    <div class="w-full bg-slate-100 h-1">
      <div id="progress-bar" class="bg-blue-600 h-1 transition-all duration-300" style="width: 0%"></div>
    </div>
  </header>

  <main class="max-w-md mx-auto px-4 pt-4">
    <div id="already-submitted-card" class="hidden bg-white border border-slate-200 rounded-2xl p-6 text-center my-6 shadow-sm">
      <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
      <h2 class="text-xl font-bold text-slate-900 mb-2">คุณได้ส่งแบบประเมินแล้ว</h2>
      <p class="text-sm text-slate-600 mb-6 leading-relaxed">ระบบบันทึกความคิดเห็นของท่านเรียบร้อยแล้ว ขอขอบพระคุณครับ</p>
      <button onclick="allowRetakeForTesting()" class="text-xs text-blue-600 hover:text-blue-700 underline font-medium">
        [ผู้จัด/ผู้ทดสอบ] คลิกที่นี่เพื่อล้างสถานะและทดสอบส่งใหม่
      </button>
    </div>

    <div id="survey-form-container">
      <form id="evaluation-form" onsubmit="handleFormSubmit(event)" class="space-y-4">
        <!-- 5 Questions & Feedback Textarea -->
        <section class="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs question-card" data-qid="q1">
          <h2 class="text-sm font-bold text-slate-900 leading-snug">1. เนื้อหาและหลักสูตรการอบรม</h2>
          <p class="text-xs text-slate-500 mt-0.5 mb-3">เนื้อหาตรงตามวัตถุประสงค์ ทันสมัย และเป็นประโยชน์ต่อการทำงาน</p>
          <div class="grid grid-cols-5 gap-2">
            <button type="button" onclick="selectRating('q1', 1)" class="rating-btn q1-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="1">1<span class="text-[9px] font-normal text-slate-400">น้อยสุด</span></button>
            <button type="button" onclick="selectRating('q1', 2)" class="rating-btn q1-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="2">2<span class="text-[9px] font-normal text-slate-400">น้อย</span></button>
            <button type="button" onclick="selectRating('q1', 3)" class="rating-btn q1-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="3">3<span class="text-[9px] font-normal text-slate-400">ปานกลาง</span></button>
            <button type="button" onclick="selectRating('q1', 4)" class="rating-btn q1-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="4">4<span class="text-[9px] font-normal text-slate-400">มาก</span></button>
            <button type="button" onclick="selectRating('q1', 5)" class="rating-btn q1-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="5">5<span class="text-[9px] font-normal text-slate-400">มากสุด</span></button>
          </div>
        </section>

        <!-- Q2 to Q5 follow identical structure -->
        <section class="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs question-card" data-qid="q2">
          <h2 class="text-sm font-bold text-slate-900 leading-snug">2. ความรู้และเทคนิคการถ่ายทอดของวิทยากร</h2>
          <p class="text-xs text-slate-500 mt-0.5 mb-3">อธิบายชัดเจน ยกตัวอย่างเห็นภาพ เปิดโอกาสให้ซักถามแลกเปลี่ยน</p>
          <div class="grid grid-cols-5 gap-2">
            <button type="button" onclick="selectRating('q2', 1)" class="rating-btn q2-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="1">1</button>
            <button type="button" onclick="selectRating('q2', 2)" class="rating-btn q2-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="2">2</button>
            <button type="button" onclick="selectRating('q2', 3)" class="rating-btn q2-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="3">3</button>
            <button type="button" onclick="selectRating('q2', 4)" class="rating-btn q2-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="4">4</button>
            <button type="button" onclick="selectRating('q2', 5)" class="rating-btn q2-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="5">5</button>
          </div>
        </section>

        <section class="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs question-card" data-qid="q3">
          <h2 class="text-sm font-bold text-slate-900 leading-snug">3. คุณภาพสื่อ เอกสาร และอุปกรณ์ประกอบ</h2>
          <p class="text-xs text-slate-500 mt-0.5 mb-3">เอกสารชัดเจน สไลด์และระบบพร้อมใช้งานสนับสนุนการเรียนรู้</p>
          <div class="grid grid-cols-5 gap-2">
            <button type="button" onclick="selectRating('q3', 1)" class="rating-btn q3-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="1">1</button>
            <button type="button" onclick="selectRating('q3', 2)" class="rating-btn q3-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="2">2</button>
            <button type="button" onclick="selectRating('q3', 3)" class="rating-btn q3-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="3">3</button>
            <button type="button" onclick="selectRating('q3', 4)" class="rating-btn q3-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="4">4</button>
            <button type="button" onclick="selectRating('q3', 5)" class="rating-btn q3-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="5">5</button>
          </div>
        </section>

        <section class="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs question-card" data-qid="q4">
          <h2 class="text-sm font-bold text-slate-900 leading-snug">4. การจัดเวลา สถานที่ และการอำนวยความสะดวก</h2>
          <p class="text-xs text-slate-500 mt-0.5 mb-3">ระยะเวลากระชับ เหมาะสม การดูแลประสานงานและบรรยากาศเอื้อต่อการเรียน</p>
          <div class="grid grid-cols-5 gap-2">
            <button type="button" onclick="selectRating('q4', 1)" class="rating-btn q4-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="1">1</button>
            <button type="button" onclick="selectRating('q4', 2)" class="rating-btn q4-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="2">2</button>
            <button type="button" onclick="selectRating('q4', 3)" class="rating-btn q4-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="3">3</button>
            <button type="button" onclick="selectRating('q4', 4)" class="rating-btn q4-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="4">4</button>
            <button type="button" onclick="selectRating('q4', 5)" class="rating-btn q4-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="5">5</button>
          </div>
        </section>

        <section class="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs question-card" data-qid="q5">
          <h2 class="text-sm font-bold text-slate-900 leading-snug">5. การนำความรู้และทักษะไปประยุกต์ใช้ในการทำงานจริง</h2>
          <p class="text-xs text-slate-500 mt-0.5 mb-3">เกิดแนวคิดใหม่ นำไปต่อยอดแก้ไขปัญหาและเพิ่มประสิทธิภาพการทำงานได้จริง</p>
          <div class="grid grid-cols-5 gap-2">
            <button type="button" onclick="selectRating('q5', 1)" class="rating-btn q5-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="1">1</button>
            <button type="button" onclick="selectRating('q5', 2)" class="rating-btn q5-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="2">2</button>
            <button type="button" onclick="selectRating('q5', 3)" class="rating-btn q5-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="3">3</button>
            <button type="button" onclick="selectRating('q5', 4)" class="rating-btn q5-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="4">4</button>
            <button type="button" onclick="selectRating('q5', 5)" class="rating-btn q5-btn h-14 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-700" data-val="5">5</button>
          </div>
        </section>

        <section class="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <label class="block text-sm font-bold text-slate-900 mb-1">ข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)</label>
          <textarea id="comment-input" rows="3" placeholder="พิมพ์ข้อเสนอแนะเพิ่มเติม..." class="w-full text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"></textarea>
        </section>

        <button type="submit" id="submit-btn" class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-2xl shadow-md transition-all">ส่งแบบประเมินความพึงพอใจ →</button>
      </form>
    </div>
  </main>

  <script>
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
      projectId: "YOUR_PROJECT_ID"
    };

    let database = null;
    if (firebaseConfig.databaseURL && !firebaseConfig.databaseURL.includes("YOUR_PROJECT_ID")) {
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();
    }

    const ratings = { q1: null, q2: null, q3: null, q4: null, q5: null };

    function selectRating(qid, val) {
      ratings[qid] = val;
      document.querySelectorAll('.' + qid + '-btn').forEach(btn => {
        btn.classList.toggle('selected', parseInt(btn.getAttribute('data-val')) === val);
      });
      const count = Object.values(ratings).filter(v => v !== null).length;
      document.getElementById('progress-text').innerText = count + ' / 5 ข้อ';
      document.getElementById('progress-bar').style.width = (count / 5 * 100) + '%';
    }

    async function handleFormSubmit(e) {
      e.preventDefault();
      if (Object.values(ratings).some(v => v === null)) {
        alert('กรุณาให้คะแนนครบทั้ง 5 ข้อครับ');
        return;
      }
      const comment = document.getElementById('comment-input').value;
      const payload = {
        id: 'res-' + Date.now(),
        timestamp: Date.now(),
        ratings,
        comment
      };
      if (database) {
        await database.ref('training_eval/responses/' + payload.id).set(payload);
      }
      localStorage.setItem('liveeval_device_submitted_v1', 'true');
      if (window.confetti) confetti();
      alert('ส่งผลการประเมินเรียบร้อยแล้ว ขอบคุณครับ!');
      location.reload();
    }
  </script>
</body>
</html>`;

const dashboardHtmlCode = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>Live Dashboard - ผลการประเมินความพึงพอใจ</title>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
  <style>body { font-family: 'Prompt', sans-serif; }</style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen p-6">
  <div class="max-w-6xl mx-auto space-y-6">
    <div class="flex items-center justify-between pb-4 border-b border-slate-800">
      <div>
        <h1 class="text-2xl font-bold">Live Dashboard ผลการประเมินความพึงพอใจ</h1>
        <p class="text-xs text-slate-400">อัปเดตอัตโนมัติ Real-Time เมื่อมีผู้ตอบ</p>
      </div>
      <div class="flex gap-2">
        <button onclick="openQRModal()" class="px-4 py-2 bg-blue-600 rounded-lg text-xs font-bold">📱 QR สแกนตอบ</button>
        <button onclick="exportCSV()" class="px-4 py-2 bg-emerald-700 rounded-lg text-xs font-bold">📥 ส่งออก CSV</button>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-slate-800 p-5 rounded-2xl">
        <p class="text-xs text-slate-400">จำนวนผู้ตอบทั้งหมด</p>
        <p id="total-count" class="text-4xl font-extrabold my-1">0</p>
      </div>
      <div class="bg-slate-800 p-5 rounded-2xl md:col-span-2">
        <p class="text-xs text-slate-400">คะแนนเฉลี่ยรวมทั้ง 5 ด้าน</p>
        <div class="flex items-baseline gap-2">
          <span id="mean-score" class="text-5xl font-extrabold">0.00</span>
          <span class="text-slate-400">/ 5.00</span>
          <span id="level-badge" class="ml-4 px-2 py-1 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400">-</span>
        </div>
      </div>
    </div>

    <!-- Mode Selector & Container for Circular Charts -->
    <div class="bg-slate-800 p-6 rounded-2xl space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-700">
        <h2 class="text-base font-bold text-white">คะแนนเฉลี่ยรายข้อ (สเกล 1 - 5)</h2>
        <div class="flex gap-1 bg-slate-900 p-1 rounded-lg">
          <button id="btn-circle" onclick="setMode('circle')" class="px-3 py-1 bg-blue-600 rounded text-xs font-bold text-white">⭕ กราฟวงกลม</button>
          <button id="btn-bar" onclick="setMode('bar')" class="px-3 py-1 text-slate-400 hover:text-white rounded text-xs font-bold">📊 กราฟแท่ง</button>
        </div>
      </div>
      <div id="charts-container" class="space-y-4"></div>
    </div>
  </div>

  <script>
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
      projectId: "YOUR_PROJECT_ID"
    };

    if (firebaseConfig.databaseURL && !firebaseConfig.databaseURL.includes("YOUR_PROJECT_ID")) {
      firebase.initializeApp(firebaseConfig);
      firebase.database().ref('training_eval/responses').on('value', (snap) => {
        const val = snap.val();
        cachedList = val ? Object.values(val) : [];
        renderAll(cachedList);
      });
    }

    let cachedList = [];
    let currentMode = 'circle';

    function setMode(m) {
      currentMode = m;
      document.getElementById('btn-circle').className = m === 'circle' ? 'px-3 py-1 bg-blue-600 rounded text-xs font-bold text-white' : 'px-3 py-1 text-slate-400 hover:text-white rounded text-xs font-bold';
      document.getElementById('btn-bar').className = m === 'bar' ? 'px-3 py-1 bg-blue-600 rounded text-xs font-bold text-white' : 'px-3 py-1 text-slate-400 hover:text-white rounded text-xs font-bold';
      renderAll(cachedList);
    }

    const QUESTIONS = [
      { id: 'q1', title: '1. เนื้อหาและหลักสูตรการอบรม' },
      { id: 'q2', title: '2. วิทยากรและเทคนิคการสอน' },
      { id: 'q3', title: '3. สื่อ เอกสาร และอุปกรณ์' },
      { id: 'q4', title: '4. การจัดเวลาและสถานที่' },
      { id: 'q5', title: '5. การนำไปประยุกต์ใช้จริง' }
    ];

    function renderAll(list) {
      document.getElementById('total-count').innerText = list.length + ' ท่าน';
      if (!list.length) return;
      let sumAll = 0;
      const qMeans = QUESTIONS.map(q => {
        let qSum = 0;
        list.forEach(r => { qSum += r.ratings ? r.ratings[q.id] : 0; });
        const mean = Number((qSum / list.length).toFixed(2));
        sumAll += mean;
        return { ...q, mean };
      });
      const overall = Number((sumAll / 5).toFixed(2));
      document.getElementById('mean-score').innerText = overall;
      document.getElementById('level-badge').innerText = overall >= 4.51 ? 'มากที่สุด' : overall >= 3.51 ? 'มาก' : 'ปานกลาง';

      const container = document.getElementById('charts-container');
      if (currentMode === 'circle') {
        container.innerHTML = qMeans.map((item, idx) => {
          const size = 80;
          const r = 32;
          const circ = 2 * Math.PI * r;
          const pct = Math.min(100, (item.mean / 5) * 100);
          const offset = circ - (pct / 100) * circ;
          return \`
            <div class="p-3 bg-slate-900/60 rounded-xl flex items-center gap-4 border border-slate-700">
              <div class="relative shrink-0" style="width: \${size}px; height: \${size}px;">
                <svg width="\${size}" height="\${size}" class="transform -rotate-90">
                  <circle cx="\${size/2}" cy="\${size/2}" r="\${r}" stroke="#334155" stroke-width="6" fill="none" />
                  <circle cx="\${size/2}" cy="\${size/2}" r="\${r}" stroke="#10b981" stroke-width="6" stroke-dasharray="\${circ}" stroke-dashoffset="\${offset}" stroke-linecap="round" fill="none" />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center font-bold text-sm">\${item.mean}</div>
              </div>
              <div>
                <h4 class="font-bold text-sm text-white">\${item.title}</h4>
                <p class="text-xs text-slate-400 mt-1">คะแนน \${item.mean} / 5.00</p>
              </div>
            </div>
          \`;
        }).join('');
      } else {
        container.innerHTML = qMeans.map(item => \`
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-bold text-slate-200"><span>\${item.title}</span><span>\${item.mean} / 5.00</span></div>
            <div class="w-full bg-slate-700 rounded-full h-3"><div class="bg-blue-600 h-3 rounded-full" style="width: \${(item.mean/5)*100}%"></div></div>
          </div>
        \`).join('');
      }
    }
  </script>
</body>
</html>`;

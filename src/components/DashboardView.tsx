import React, { useState, useEffect } from 'react';
import { SurveyResponse, SurveySummary } from '../types';
import { storageService } from '../services/storage';
import {
  Users,
  Award,
  Download,
  QrCode,
  Maximize2,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  Trash2,
  RefreshCw,
  PieChart,
  BarChart3,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenQR: () => void;
  surveyUrl: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenQR }) => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [summary, setSummary] = useState<SurveySummary>(() => storageService.calculateSummary([]));
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [chartType, setChartType] = useState<'circle' | 'bar'>('circle');

  useEffect(() => {
    const unsubscribe = storageService.subscribe((data) => {
      setResponses(data);
      const computed = storageService.calculateSummary(data);
      setSummary(computed);
      setLastUpdated(new Date().toLocaleTimeString('th-TH'));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleExportCSV = () => {
    storageService.exportCSV(responses);
  };

  const handleSimulateOneSubmission = async () => {
    // Generate realistic attendee submission
    const mockComments = [
      'วิทยากรตอบคำถามได้ละเอียดมาก ชอบการสาธิตแบบ Live Demo',
      'เนื้อหากระชับ เข้าใจง่าย นำไปประยุกต์ใช้งานได้ทันทีครับ',
      'อยากให้มีเวลาทำแล็บทดลองปฏิบัติเพิ่มอีกเล็กน้อยครับ',
      'เอกสารและการดูแลต้อนรับอบอุ่นมากครับ',
      'หลักสูตรยอดเยี่ยม มีประโยชน์มาก แนะนำให้เพื่อนร่วมงานแน่นอน',
    ];
    const randComment = Math.random() > 0.3 ? mockComments[Math.floor(Math.random() * mockComments.length)] : '';
    const q1 = Math.floor(Math.random() * 2) + 4; // 4 or 5
    const q2 = Math.floor(Math.random() * 2) + 4; // 4 or 5
    const q3 = Math.floor(Math.random() * 3) + 3; // 3, 4, 5
    const q4 = Math.floor(Math.random() * 3) + 3; // 3, 4, 5
    const q5 = Math.floor(Math.random() * 2) + 4; // 4 or 5

    await storageService.submitResponse({ q1, q2, q3, q4, q5 }, randComment);
  };

  const handleClearData = () => {
    if (window.confirm('คุณต้องการล้างข้อมูลการประเมินทั้งหมดเพื่อเริ่มเก็บข้อมูลจริงใช่หรือไม่?')) {
      storageService.clearAllData();
    }
  };

  const handleSeedData = () => {
    storageService.loadSampleData();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Action & Projector Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Live Dashboard แสดงผลบนจอโปรเจกเตอร์
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            อัปเดตอัตโนมัติทันทีที่มีผู้ส่งคำตอบ (Real-Time) · อัปเดตล่าสุด: {lastUpdated || 'กำลังเชื่อมต่อ...'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSimulateOneSubmission}
            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-blue-200 dark:border-blue-800"
            title="จำลองคนตอบเพิ่ม 1 คนเพื่อดูการขยับของกราฟสด"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>จำลองตอบ +1</span>
          </button>

          <button
            onClick={onOpenQR}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR สแกนตอบ</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            title="ส่งออกผลคะแนนและข้อเสนอแนะเป็นไฟล์ CSV ภาษาไทย"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด CSV</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs transition-colors"
            title="ขยายเต็มจอ"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Row (Large Projector Presence) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Respondents */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>จำนวนผู้ตอบแบบประเมิน</span>
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="my-2">
            <span className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
              {summary.totalResponses}
            </span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1.5">ท่าน</span>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-2">
            คำนวณแบบนิรนาม ไม่เปิดเผยข้อมูลส่วนบุคคล
          </div>
        </div>

        {/* KPI 2: Overall Score & Likert Level (Spans 2 columns on desktop) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              คะแนนเฉลี่ยความพึงพอใจโดยรวมทั้ง 5 ด้าน
            </span>
            <span
              className={`px-3 py-1 rounded-md text-xs font-extrabold border ${summary.overallLevel.bgClass} ${summary.overallLevel.colorClass} ${summary.overallLevel.borderClass}`}
            >
              ระดับ: {summary.overallLevel.label} ({summary.overallLevel.labelEn})
            </span>
          </div>

          <div className="my-2 flex items-baseline gap-3">
            <span className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
              {summary.overallMean > 0 ? summary.overallMean.toFixed(2) : '0.00'}
            </span>
            <span className="text-xl font-bold text-slate-400">/ 5.00 คะแนน</span>
          </div>

          {/* Criteria Reference */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2 overflow-x-auto gap-2">
            <span>เกณฑ์มาตรฐาน:</span>
            <span>4.51 - 5.00 มากที่สุด</span>
            <span>·</span>
            <span>3.51 - 4.50 มาก</span>
            <span>·</span>
            <span>2.51 - 3.50 ปานกลาง</span>
          </div>
        </div>

        {/* KPI 3: Key Strengths & Growth Areas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>สรุปแนวโน้มความพึงพอใจ</span>
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-bold mb-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>ด้านที่ได้คะแนนสูงสุด</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-medium truncate">
                {summary.highestQuestion ? summary.highestQuestion.question.shortLabel : '-'}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums mt-0.5">
                {summary.highestQuestion ? `เฉลี่ย ${summary.highestQuestion.mean.toFixed(2)} / 5.00` : '-'}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60">
              <div className="flex items-center gap-1 text-blue-700 dark:text-blue-300 font-bold mb-0.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>ด้านที่ควรพัฒนาต่อยอด</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-medium truncate">
                {summary.lowestQuestion ? summary.lowestQuestion.question.shortLabel : '-'}
              </p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold tabular-nums mt-0.5">
                {summary.lowestQuestion ? `เฉลี่ย ${summary.lowestQuestion.mean.toFixed(2)} / 5.00` : '-'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Main Split: Detailed Question Charts (Left 7 cols) & Comments Feed (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Circular Charts / Bar Charts for 5 Questions */}
        <section className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                {chartType === 'circle' ? (
                  <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                )}
                <span>คะแนนเฉลี่ยรายข้อ (สเกล 1 - 5)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {chartType === 'circle'
                  ? 'กราฟวงกลมแสดงค่าเฉลี่ย สัดส่วนคะแนน และการกระจายตัวแบบเรียลไทม์'
                  : 'กราฟแท่งแสดงค่าเฉลี่ยและการกระจายตัวของระดับคะแนนแบบเรียลไทม์'}
              </p>
            </div>

            {/* Mode Selector Segmented Button */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setChartType('circle')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  chartType === 'circle'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>กราฟวงกลม (Circular)</span>
              </button>
              <button
                type="button"
                onClick={() => setChartType('bar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  chartType === 'bar'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>กราฟแท่ง (Bar)</span>
              </button>
            </div>
          </div>

          {/* CIRCULAR CHART MODE */}
          {chartType === 'circle' && (
            <div className="space-y-6">
              {/* Overall Satisfaction Distribution Donut Chart */}
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    สัดส่วนคะแนนภาพรวมทั้งหมด (Overall Score Distribution)
                  </span>
                  <span className="text-slate-400">คำนวณจากทุกข้อรวมกัน</span>
                </div>

                {(() => {
                  const overallDist = summary.questionStats.reduce(
                    (acc, q) => {
                      acc[5] += q.distribution[5];
                      acc[4] += q.distribution[4];
                      acc[3] += q.distribution[3];
                      acc[2] += q.distribution[2];
                      acc[1] += q.distribution[1];
                      return acc;
                    },
                    { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                  );
                  const totalAllVotes =
                    overallDist[5] + overallDist[4] + overallDist[3] + overallDist[2] + overallDist[1];

                  const size = 140;
                  const strokeWidth = 16;
                  const radius = (size - strokeWidth) / 2;
                  const circumference = 2 * Math.PI * radius;

                  const slices = [
                    { label: '5 (มากที่สุด)', count: overallDist[5], color: '#059669', bgClass: 'bg-emerald-500' },
                    { label: '4 (มาก)', count: overallDist[4], color: '#2563eb', bgClass: 'bg-blue-600' },
                    { label: '3 (ปานกลาง)', count: overallDist[3], color: '#d97706', bgClass: 'bg-amber-500' },
                    { label: '2 (น้อย)', count: overallDist[2], color: '#ea580c', bgClass: 'bg-orange-500' },
                    { label: '1 (น้อยที่สุด)', count: overallDist[1], color: '#e11d48', bgClass: 'bg-rose-500' },
                  ];

                  let accumulatedLength = 0;

                  return (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                      {/* Donut SVG */}
                      <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
                        <svg width={size} height={size} className="transform -rotate-90">
                          <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            className="stroke-slate-200 dark:stroke-slate-700/60"
                            strokeWidth={strokeWidth}
                            fill="none"
                          />
                          {totalAllVotes > 0 &&
                            slices.map((slice, i) => {
                              if (slice.count === 0) return null;
                              const fraction = slice.count / totalAllVotes;
                              const sliceLength = fraction * circumference;
                              const offset = -accumulatedLength;
                              accumulatedLength += sliceLength;

                              return (
                                <circle
                                  key={i}
                                  cx={size / 2}
                                  cy={size / 2}
                                  r={radius}
                                  stroke={slice.color}
                                  strokeWidth={strokeWidth}
                                  strokeDasharray={`${sliceLength} ${circumference}`}
                                  strokeDashoffset={offset}
                                  fill="none"
                                  className="transition-all duration-700"
                                />
                              );
                            })}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight leading-none">
                            {totalAllVotes}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                            คะแนนโหวต
                          </span>
                        </div>
                      </div>

                      {/* Legend Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 w-full text-xs">
                        {slices.map((s, idx) => {
                          const pct = totalAllVotes > 0 ? ((s.count / totalAllVotes) * 100).toFixed(1) : '0.0';
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/60"
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${s.bgClass} shrink-0`} />
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{s.label}</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-mono text-[11px] tabular-nums">
                                <span className="font-bold text-slate-900 dark:text-white">{s.count}</span>
                                <span className="text-slate-400">({pct}%)</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 5 Questions as Circular Gauges Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    กราฟวงกลมคะแนนเฉลี่ยรายข้อ (สเกล 1 - 5)
                  </span>
                  <span className="text-slate-400">เป้าหมาย ≥ 4.00</span>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {summary.questionStats.map((item, index) => {
                    const size = 96;
                    const strokeWidth = 8;
                    const radius = (size - strokeWidth) / 2;
                    const circumference = 2 * Math.PI * radius;
                    const percentage = Math.min(100, Math.max(0, (item.mean / 5.0) * 100));
                    const strokeDashoffset = circumference - (percentage / 100) * circumference;

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                      >
                        {/* Circular Gauge Ring */}
                        <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
                          <svg width={size} height={size} className="transform -rotate-90">
                            <circle
                              cx={size / 2}
                              cy={size / 2}
                              r={radius}
                              className="stroke-slate-200 dark:stroke-slate-700/60"
                              strokeWidth={strokeWidth}
                              fill="none"
                            />
                            <circle
                              cx={size / 2}
                              cy={size / 2}
                              r={radius}
                              stroke={item.level.barColor}
                              strokeWidth={strokeWidth}
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                              fill="none"
                              className="transition-all duration-700 ease-out"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums tracking-tight leading-none">
                              {item.mean > 0 ? item.mean.toFixed(2) : '0.00'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium mt-0.5">/ 5.00</span>
                          </div>
                        </div>

                        {/* Question Details and Distribution */}
                        <div className="flex-1 w-full space-y-2 text-center sm:text-left">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                              <span className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                                {index + 1}
                              </span>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                {item.question.title.replace(/^\d+\.\s*/, '')}
                              </h4>
                            </div>

                            <span
                              className={`self-center sm:self-auto px-2 py-0.5 rounded text-[11px] font-bold border ${item.level.bgClass} ${item.level.colorClass} ${item.level.borderClass}`}
                            >
                              {item.level.label}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {item.question.subtitle}
                          </p>

                          {/* Distribution Breakdown Pills */}
                          <div className="grid grid-cols-5 gap-1 pt-1 text-[10px] font-mono">
                            <div className="bg-white dark:bg-slate-900 p-1 rounded-lg text-center border border-slate-200 dark:border-slate-700/60">
                              <span className="text-slate-400 block text-[9px]">ให้ 5</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.distribution[5]}</span>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-1 rounded-lg text-center border border-slate-200 dark:border-slate-700/60">
                              <span className="text-slate-400 block text-[9px]">ให้ 4</span>
                              <span className="font-bold text-blue-600 dark:text-blue-400">{item.distribution[4]}</span>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-1 rounded-lg text-center border border-slate-200 dark:border-slate-700/60">
                              <span className="text-slate-400 block text-[9px]">ให้ 3</span>
                              <span className="font-bold text-amber-600 dark:text-amber-400">{item.distribution[3]}</span>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-1 rounded-lg text-center border border-slate-200 dark:border-slate-700/60">
                              <span className="text-slate-400 block text-[9px]">ให้ 2</span>
                              <span className="font-bold text-orange-600 dark:text-orange-400">{item.distribution[2]}</span>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-1 rounded-lg text-center border border-slate-200 dark:border-slate-700/60">
                              <span className="text-slate-400 block text-[9px]">ให้ 1</span>
                              <span className="font-bold text-rose-600 dark:text-rose-400">{item.distribution[1]}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* BAR CHART MODE */}
          {chartType === 'bar' && (
            <div className="space-y-6">
              {summary.questionStats.map((item, index) => {
                const percentage = Math.min(100, Math.max(0, (item.mean / 5.0) * 100));

                return (
                  <div key={item.id} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                          {index + 1}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.question.title.replace(/^\d+\.\s*/, '')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pl-7 sm:pl-0">
                        <span className="font-extrabold text-base text-slate-900 dark:text-white tabular-nums">
                          {item.mean > 0 ? item.mean.toFixed(2) : '0.00'}
                        </span>
                        <span className="text-slate-400 text-xs">/ 5.00</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold border ${item.level.bgClass} ${item.level.colorClass} ${item.level.borderClass}`}
                        >
                          {item.level.label}
                        </span>
                      </div>
                    </div>

                    {/* Horizontal Bar Chart */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3.5 overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.level.barColor,
                        }}
                      />
                    </div>

                    {/* Distribution Counters */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1 font-mono">
                      <span>ให้ 5: <b className="text-slate-700 dark:text-slate-200">{item.distribution[5]}</b></span>
                      <span>ให้ 4: <b className="text-slate-700 dark:text-slate-200">{item.distribution[4]}</b></span>
                      <span>ให้ 3: <b className="text-slate-700 dark:text-slate-200">{item.distribution[3]}</b></span>
                      <span>ให้ 2: <b className="text-slate-700 dark:text-slate-200">{item.distribution[2]}</b></span>
                      <span>ให้ 1: <b className="text-slate-700 dark:text-slate-200">{item.distribution[1]}</b></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right Column: Live Suggestions & Comments Feed */}
        <section className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  ข้อเสนอแนะล่าสุด
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {summary.recentComments.length} ข้อความ
              </span>
            </div>

            {/* Scrollable Comments List */}
            <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1 flex-1">
              {summary.recentComments.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  ยังไม่มีข้อเสนอแนะเพิ่มเติมจากผู้เข้าอบรม
                </div>
              ) : (
                summary.recentComments.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 rounded-2xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        ผู้ตอบประเมิน (ให้คะแนนเฉลี่ย {c.avgRating}★)
                      </span>
                      <span>{new Date(c.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                      &ldquo;{c.text}&rdquo;
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Facilitator Controls (Seed demo / Clear) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-500">
            <span>จัดการข้อมูลการอบรม:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSeedData}
                className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md font-medium flex items-center gap-1 transition-colors"
                title="โหลดข้อมูลตัวอย่างสำหรับซ้อมพรีเซนต์"
              >
                <RefreshCw className="w-3 h-3" />
                <span>ใส่ข้อมูลตัวอย่าง</span>
              </button>
              <button
                onClick={handleClearData}
                className="px-2.5 py-1 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md font-medium flex items-center gap-1 transition-colors"
                title="ล้างข้อมูลเป็น 0 เพื่อเริ่มเก็บข้อมูลของจริง"
              >
                <Trash2 className="w-3 h-3" />
                <span>ล้างข้อมูลเป็น 0</span>
              </button>
            </div>
          </div>

        </section>

      </div>

    </div>
  );
};

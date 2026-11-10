import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QUESTIONS } from '../types';
import { storageService } from '../services/storage';
import { CheckCircle2, AlertCircle, Sparkles, RotateCcw, Smartphone, ArrowRight } from 'lucide-react';

interface SurveyViewProps {
  onSubmittedSuccess?: () => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ onSubmittedSuccess }) => {
  const [ratings, setRatings] = useState<Record<string, number | null>>({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
  });
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    setHasSubmitted(storageService.checkDeviceHasSubmitted());
  }, []);

  const handleSelectRating = (qId: string, value: number) => {
    setRatings((prev) => ({ ...prev, [qId]: value }));
    setErrorMessage('');
  };

  const answeredCount = Object.values(ratings).filter((v) => v !== null).length;
  const progressPercent = (answeredCount / QUESTIONS.length) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate 5 questions
    const unanswered = QUESTIONS.filter((q) => ratings[q.id] === null);
    if (unanswered.length > 0) {
      setErrorMessage(`กรุณาตอบคะแนนให้ครบทุกข้อ (ยังขาดอีก ${unanswered.length} ข้อ)`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await storageService.submitResponse(
        {
          q1: ratings.q1 as number,
          q2: ratings.q2 as number,
          q3: ratings.q3 as number,
          q4: ratings.q4 as number,
          q5: ratings.q5 as number,
        },
        comment
      );

      // Trigger Confetti
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
      });

      setHasSubmitted(true);
      if (onSubmittedSuccess) {
        onSubmittedSuccess();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for quick testing
  const handleAutoFillDemo = () => {
    setRatings({
      q1: 5,
      q2: 5,
      q3: 4,
      q4: 4,
      q5: 5,
    });
    setComment('วิทยากรมีเทคนิคการสอนยอดเยี่ยมมาก อธิบายประเด็นซับซ้อนให้เข้าใจง่ายครับ');
    setErrorMessage('');
  };

  const handleResetForTesting = () => {
    storageService.clearDeviceSubmitted();
    setHasSubmitted(false);
    setRatings({ q1: null, q2: null, q3: null, q4: null, q5: null });
    setComment('');
    setErrorMessage('');
  };

  // Screen if user already submitted on this device
  if (hasSubmitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            ส่งแบบประเมินเรียบร้อยแล้ว!
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            ระบบได้บันทึกคะแนนและส่งต่อไปยังหน้าจอ <strong>Live Dashboard</strong> ของผู้จัดอบรมแบบเรียลไทม์แล้ว ขอขอบพระคุณสำหรับความคิดเห็นที่มีค่าของท่านครับ
          </p>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 mb-6">
            ระบบป้องกันการส่งซ้ำ: บันทึก 1 สิทธิ์ต่อ 1 เครื่อง เพื่อความแม่นยำของสถิติ
          </div>

          <button
            onClick={handleResetForTesting}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>[ผู้จัด/ผู้ทดสอบ] ล้างสถานะเพื่อทดสอบส่งใหม่อีกครั้ง</span>
          </button>
        </div>
      </div>
    );
  }

  const ratingLabels: Record<number, { label: string; textClass: string; bgSelected: string }> = {
    1: { label: 'น้อยที่สุด', textClass: 'text-rose-600', bgSelected: 'bg-rose-600 text-white border-rose-700' },
    2: { label: 'น้อย', textClass: 'text-orange-600', bgSelected: 'bg-orange-600 text-white border-orange-700' },
    3: { label: 'ปานกลาง', textClass: 'text-amber-600', bgSelected: 'bg-amber-600 text-white border-amber-700' },
    4: { label: 'มาก', textClass: 'text-blue-600', bgSelected: 'bg-blue-600 text-white border-blue-700' },
    5: { label: 'มากที่สุด', textClass: 'text-emerald-600', bgSelected: 'bg-emerald-600 text-white border-emerald-700' },
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-12">
      {/* Top Mobile Bar Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-4 shadow-2xs">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                แบบประเมินความพึงพอใจการอบรม
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                ประเมิน 5 ข้อสเกล 1-5 ไม่ระบุชื่อ
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md">
              {answeredCount} / 5 ข้อ
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Quick test auto-fill */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleAutoFillDemo}
            className="text-[11px] text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 font-medium transition-colors"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>กรอกจำลองด่วนเพื่อทดสอบ</span>
          </button>
        </div>
      </div>

      {/* Scale Legend */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 mb-4 shadow-2xs">
        <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-medium text-slate-500 dark:text-slate-400">
          <div className="p-1 rounded bg-slate-50 dark:bg-slate-800">1 = น้อยสุด</div>
          <div className="p-1 rounded bg-slate-50 dark:bg-slate-800">2 = น้อย</div>
          <div className="p-1 rounded bg-slate-50 dark:bg-slate-800">3 = ปานกลาง</div>
          <div className="p-1 rounded bg-slate-50 dark:bg-slate-800">4 = มาก</div>
          <div className="p-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold">5 = มากสุด</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {QUESTIONS.map((q, idx) => {
          const selectedVal = ratings[q.id];
          return (
            <section
              key={q.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 shadow-2xs transition-all ${
                selectedVal !== null
                  ? 'border-slate-200 dark:border-slate-800'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {q.title.replace(/^\d+\.\s*/, '')}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 pl-7 leading-relaxed">
                  {q.subtitle}
                </p>
              </div>

              {/* 5 Big Touch Buttons */}
              <div className="grid grid-cols-5 gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((val) => {
                  const isSelected = selectedVal === val;
                  const itemInfo = ratingLabels[val];

                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSelectRating(q.id, val)}
                      className={`h-14 sm:h-16 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer select-none active:scale-95 ${
                        isSelected
                          ? `${itemInfo.bgSelected} shadow-md font-bold scale-[1.02]`
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <span className="text-lg font-extrabold">{val}</span>
                      <span
                        className={`text-[9px] font-normal leading-none mt-0.5 ${
                          isSelected ? 'text-white/90' : 'text-slate-400 dark:text-slate-400'
                        }`}
                      >
                        {itemInfo.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Optional Comments */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <label htmlFor="user-comment" className="block text-sm font-bold text-slate-900 dark:text-white mb-1">
            ข้อเสนอแนะเพิ่มเติม / ความประทับใจ (ไม่บังคับ)
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5">
            ความคิดเห็นของท่านจะช่วยให้ผู้จัดปรับปรุงเนื้อหาและวิทยากรให้ดียิ่งขึ้น
          </p>
          <textarea
            id="user-comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="เช่น ชอบตัวอย่าง Workshop ปฏิบัติจริง, อยากให้มีเวลาแลกเปลี่ยนเพิ่มขึ้น..."
            className="w-full text-xs sm:text-sm p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 resize-none transition-all"
          />
        </section>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งแบบประเมินความพึงพอใจ'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-2.5">
            ข้อมูลจะส่งตรงเข้าจอ Live Dashboard แบบ Real-Time ทันที
          </p>
        </div>
      </form>
    </div>
  );
};

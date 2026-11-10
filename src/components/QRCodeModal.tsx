import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Copy, Check, ExternalLink, X } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyUrl: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, surveyUrl }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (surveyUrl && isOpen) {
      QRCode.toDataURL(surveyUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR generation error', err));
    }
  }, [surveyUrl, isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="ปิด"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <QrCode className="w-4 h-4" />
          <span>สแกนด้วยกล้องมือถือ</span>
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          สแกนตอบแบบประเมิน
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
          ผู้เข้าอบรมสามารถเปิดกล้องสมาร์ทโฟนแล้วส่องที่ QR Code เพื่อเข้าสู่หน้าตอบได้ทันที
        </p>

        {/* QR Code Frame */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 dark:border-slate-700 inline-block shadow-inner mb-4">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR Code สำหรับตอบแบบประเมิน"
              className="w-56 h-56 mx-auto rounded-lg"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
              กำลังสร้าง QR Code...
            </div>
          )}
        </div>

        {/* Direct Link Box */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <input
              type="text"
              readOnly
              value={surveyUrl}
              className="px-2 py-1 bg-transparent text-slate-700 dark:text-slate-300 font-mono text-[11px] flex-1 outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 text-xs">
            <a
              href={surveyUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>ทดลองเปิดหน้าตอบในแท็บใหม่</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

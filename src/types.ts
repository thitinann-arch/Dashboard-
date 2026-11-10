export interface SurveyQuestion {
  id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5';
  title: string;
  subtitle: string;
  shortLabel: string;
}

export interface SurveyResponse {
  id: string;
  timestamp: number;
  dateFormatted: string;
  ratings: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
    q5: number;
  };
  comment: string;
  deviceId: string;
}

export interface LikertLevel {
  label: string;
  labelEn: string;
  min: number;
  max: number;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  barColor: string;
  description: string;
}

export interface QuestionStat {
  id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5';
  question: SurveyQuestion;
  mean: number;
  count: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  level: LikertLevel;
}

export interface SurveySummary {
  totalResponses: number;
  overallMean: number;
  overallLevel: LikertLevel;
  questionStats: QuestionStat[];
  highestQuestion: QuestionStat | null;
  lowestQuestion: QuestionStat | null;
  recentComments: Array<{
    id: string;
    text: string;
    timestamp: number;
    avgRating: number;
  }>;
}

export interface FirebaseCustomConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const QUESTIONS: SurveyQuestion[] = [
  {
    id: 'q1',
    title: '1. ความเหมาะสมของเนื้อหาและหลักสูตรการอบรม',
    subtitle: 'เนื้อหาครอบคลุม ตรงตามวัตถุประสงค์ ทันสมัย และเป็นประโยชน์',
    shortLabel: 'เนื้อหาและหลักสูตร',
  },
  {
    id: 'q2',
    title: '2. ความรู้ความสามารถและเทคนิคการถ่ายทอดของวิทยากร',
    subtitle: 'อธิบายชัดเจน เข้าใจง่าย มีปฏิสัมพันธ์และตอบข้อซักถามได้ดี',
    shortLabel: 'วิทยากรและการถ่ายทอด',
  },
  {
    id: 'q3',
    title: '3. คุณภาพสื่อ เอกสาร และอุปกรณ์ประกอบการอบรม',
    subtitle: 'สไลด์ ตัวอย่างประกอบ และระบบเครื่องมือสนับสนุนการเรียนรู้พร้อมใช้งาน',
    shortLabel: 'สื่อและเอกสารประกอบ',
  },
  {
    id: 'q4',
    title: '4. การจัดเวลา สถานที่ และการอำนวยความสะดวก',
    subtitle: 'ระยะเวลากระชับ เหมาะสม สภาพแวดล้อมและสิ่งอำนวยความสะดวกพร้อม',
    shortLabel: 'การจัดเวลาและสถานที่',
  },
  {
    id: 'q5',
    title: '5. การนำความรู้และทักษะไปประยุกต์ใช้ในการทำงานจริง',
    subtitle: 'สามารถนำเทคนิคหรือแนวคิดไปต่อยอดแก้ไขปัญหาและเพิ่มประสิทธิภาพได้ทันที',
    shortLabel: 'การนำไปประยุกต์ใช้จริง',
  },
];

export const LIKERT_LEVELS: LikertLevel[] = [
  {
    label: 'มากที่สุด',
    labelEn: 'Highest',
    min: 4.51,
    max: 5.0,
    colorClass: 'text-emerald-700 dark:text-emerald-300',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderClass: 'border-emerald-200 dark:border-emerald-800',
    barColor: '#059669',
    description: 'ความพึงพอใจระดับสูงสุด ดีเยี่ยมในทุกมิติ',
  },
  {
    label: 'มาก',
    labelEn: 'High',
    min: 3.51,
    max: 4.5,
    colorClass: 'text-blue-700 dark:text-blue-300',
    bgClass: 'bg-blue-50 dark:bg-blue-950/40',
    borderClass: 'border-blue-200 dark:border-blue-800',
    barColor: '#2563eb',
    description: 'ความพึงพอใจระดับดี ได้มาตรฐานน่าพึงพอใจ',
  },
  {
    label: 'ปานกลาง',
    labelEn: 'Moderate',
    min: 2.51,
    max: 3.5,
    colorClass: 'text-amber-700 dark:text-amber-300',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    borderClass: 'border-amber-200 dark:border-amber-800',
    barColor: '#d97706',
    description: 'ความพึงพอใจระดับปานกลาง มีจุดที่สามารถพัฒนาต่อได้',
  },
  {
    label: 'น้อย',
    labelEn: 'Low',
    min: 1.51,
    max: 2.5,
    colorClass: 'text-orange-700 dark:text-orange-300',
    bgClass: 'bg-orange-50 dark:bg-orange-950/40',
    borderClass: 'border-orange-200 dark:border-orange-800',
    barColor: '#ea580c',
    description: 'ความพึงพอใจระดับน้อย ควรได้รับการปรับปรุง',
  },
  {
    label: 'น้อยที่สุด',
    labelEn: 'Lowest',
    min: 1.0,
    max: 1.5,
    colorClass: 'text-rose-700 dark:text-rose-300',
    bgClass: 'bg-rose-50 dark:bg-rose-950/40',
    borderClass: 'border-rose-200 dark:border-rose-800',
    barColor: '#e11d48',
    description: 'ความพึงพอใจระดับน้อยที่สุด จำเป็นต้องปรับปรุงอย่างเร่งด่วน',
  },
];

export function getLikertLevel(score: number): LikertLevel {
  if (score <= 0) {
    return {
      label: 'ยังไม่มีข้อมูล',
      labelEn: 'No data',
      min: 0,
      max: 0,
      colorClass: 'text-slate-500',
      bgClass: 'bg-slate-100 dark:bg-slate-800',
      borderClass: 'border-slate-200 dark:border-slate-700',
      barColor: '#94a3b8',
      description: 'รอผู้เข้าอบรมเริ่มประเมิน',
    };
  }

  const rounded = Number(score.toFixed(2));
  for (const level of LIKERT_LEVELS) {
    if (rounded >= level.min && rounded <= level.max) {
      return level;
    }
  }
  // Fallbacks for rounding boundary edges
  if (rounded > 5.0) return LIKERT_LEVELS[0];
  if (rounded < 1.0) return LIKERT_LEVELS[4];
  return LIKERT_LEVELS[0];
}

import {
  SurveyResponse,
  SurveySummary,
  QUESTIONS,
  getLikertLevel,
  FirebaseCustomConfig,
} from '../types';

const STORAGE_RESPONSES_KEY = 'liveeval_training_responses_v1';
const STORAGE_DEVICE_KEY = 'liveeval_device_submitted_v1';
const STORAGE_FIREBASE_CONFIG_KEY = 'liveeval_firebase_config_v1';
const CHANNEL_NAME = 'liveeval_realtime_sync';

// Sample initial data for realistic preview on first launch
const SAMPLE_RESPONSES: SurveyResponse[] = [
  {
    id: 'res-sample-01',
    timestamp: Date.now() - 1000 * 60 * 35,
    dateFormatted: new Date(Date.now() - 1000 * 60 * 35).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    ratings: { q1: 5, q2: 5, q3: 4, q4: 4, q5: 5 },
    comment: 'วิทยากรมีพลังมาก อธิบายเข้าใจง่าย มี Workshop ปฏิบัติจริงทำให้เห็นภาพชัดเจน',
    deviceId: 'sample-device-1',
  },
  {
    id: 'res-sample-02',
    timestamp: Date.now() - 1000 * 60 * 28,
    dateFormatted: new Date(Date.now() - 1000 * 60 * 28).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    ratings: { q1: 5, q2: 5, q3: 5, q4: 4, q5: 5 },
    comment: 'เนื้อหาอัปเดตทันสมัย นำไปใช้กับโปรเจกต์งานที่ทำอยู่ได้ทันทีครับ',
    deviceId: 'sample-device-2',
  },
  {
    id: 'res-sample-03',
    timestamp: Date.now() - 1000 * 60 * 22,
    dateFormatted: new Date(Date.now() - 1000 * 60 * 22).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    ratings: { q1: 4, q2: 5, q3: 4, q4: 4, q5: 4 },
    comment: 'เอกสารประกอบและสไลด์สรุปเนื้อหาได้กระชับ ดีมากครับ',
    deviceId: 'sample-device-3',
  },
  {
    id: 'res-sample-04',
    timestamp: Date.now() - 1000 * 60 * 18,
    dateFormatted: new Date(Date.now() - 1000 * 60 * 18).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    ratings: { q1: 5, q2: 4, q3: 4, q4: 3, q5: 4 },
    comment: 'อยากให้เพิ่มเวลาในช่วง Q&A หรือช่วงทำแบบฝึกหัดอีกสักนิดครับ ห้องแอร์เย็นไปนิดหน่อย',
    deviceId: 'sample-device-4',
  },
  {
    id: 'res-sample-05',
    timestamp: Date.now() - 1000 * 60 * 12,
    dateFormatted: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    ratings: { q1: 5, q2: 5, q3: 5, q4: 5, q5: 5 },
    comment: 'คุ้มค่าเวลามาก ได้เครื่องมือและแนวทางใหม่ๆ กลับไปใช้เยอะมากครับ',
    deviceId: 'sample-device-5',
  },
  {
    id: 'res-sample-06',
    timestamp: Date.now() - 1000 * 60 * 7,
    dateFormatted: new Date(Date.now() - 1000 * 60 * 7).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    ratings: { q1: 4, q2: 5, q3: 4, q4: 4, q5: 5 },
    comment: 'จัดอบรมหลักสูตรขั้นสูง (Advanced) ต่อเลยนะคะ พร้อมลงทะเบียนทันที',
    deviceId: 'sample-device-6',
  },
];

class StorageService {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(responses: SurveyResponse[]) => void> = new Set();
  private firebaseConfig: FirebaseCustomConfig | null = null;
  private firebasePollInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'UPDATE') {
            const data = this.getLocalResponses();
            this.notifyListeners(data);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel not supported', err);
      }

      // Check stored custom Firebase config
      const savedConfig = localStorage.getItem(STORAGE_FIREBASE_CONFIG_KEY);
      if (savedConfig) {
        try {
          this.firebaseConfig = JSON.parse(savedConfig);
        } catch {
          // ignore
        }
      }
    }
  }

  // Device submission check (prevent double submission)
  public checkDeviceHasSubmitted(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_DEVICE_KEY) === 'true';
  }

  public recordDeviceSubmitted(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_DEVICE_KEY, 'true');
    }
  }

  public clearDeviceSubmitted(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_DEVICE_KEY);
    }
  }

  // Get or generate anonymous device ID
  public getOrCreateDeviceId(): string {
    if (typeof window === 'undefined') return 'server-id';
    let id = localStorage.getItem('liveeval_device_id');
    if (!id) {
      id = 'dev-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
      localStorage.setItem('liveeval_device_id', id);
    }
    return id;
  }

  // Load responses from LocalStorage (initializes with sample if first time)
  public getLocalResponses(): SurveyResponse[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_RESPONSES_KEY);
    if (!raw) {
      // First run: pre-populate with realistic sample responses so dashboard isn't empty
      this.saveLocalResponses(SAMPLE_RESPONSES);
      return SAMPLE_RESPONSES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public saveLocalResponses(responses: SurveyResponse[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_RESPONSES_KEY, JSON.stringify(responses));
  }

  // Submit a new response
  public async submitResponse(
    ratings: { q1: number; q2: number; q3: number; q4: number; q5: number },
    comment: string
  ): Promise<SurveyResponse> {
    const deviceId = this.getOrCreateDeviceId();
    const now = new Date();
    const newEntry: SurveyResponse = {
      id: 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: now.getTime(),
      dateFormatted: now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      ratings,
      comment: comment.trim(),
      deviceId,
    };

    // 1. Save to LocalStorage
    const current = this.getLocalResponses();
    const updated = [newEntry, ...current];
    this.saveLocalResponses(updated);

    // 2. Mark device as submitted
    this.recordDeviceSubmitted();

    // 3. Sync across tabs
    if (this.channel) {
      this.channel.postMessage({ type: 'UPDATE', newEntry });
    }
    this.notifyListeners(updated);

    // 4. If custom Firebase Realtime Database is configured, push to Firebase REST
    if (this.firebaseConfig?.databaseURL) {
      this.pushToFirebase(newEntry).catch((err) => {
        console.warn('Failed to push to remote Firebase DB', err);
      });
    }

    return newEntry;
  }

  // Realtime subscriber
  public subscribe(callback: (responses: SurveyResponse[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.getLocalResponses());

    // If Firebase config exists, initiate syncing
    this.startFirebaseSync();

    return () => {
      this.listeners.delete(callback);
      if (this.listeners.size === 0 && this.firebasePollInterval) {
        clearInterval(this.firebasePollInterval);
        this.firebasePollInterval = null;
      }
    };
  }

  private notifyListeners(data: SurveyResponse[]): void {
    for (const listener of this.listeners) {
      listener(data);
    }
  }

  // Reset or clear all data
  public clearAllData(): void {
    this.saveLocalResponses([]);
    if (this.channel) {
      this.channel.postMessage({ type: 'UPDATE' });
    }
    this.notifyListeners([]);
  }

  // Restore sample demo data
  public loadSampleData(): void {
    this.saveLocalResponses(SAMPLE_RESPONSES);
    if (this.channel) {
      this.channel.postMessage({ type: 'UPDATE' });
    }
    this.notifyListeners(SAMPLE_RESPONSES);
  }

  // Firebase Realtime Database integration
  public getFirebaseConfig(): FirebaseCustomConfig | null {
    return this.firebaseConfig;
  }

  public setFirebaseConfig(config: FirebaseCustomConfig | null): void {
    this.firebaseConfig = config;
    if (typeof window !== 'undefined') {
      if (config) {
        localStorage.setItem(STORAGE_FIREBASE_CONFIG_KEY, JSON.stringify(config));
        this.syncFromFirebase();
      } else {
        localStorage.removeItem(STORAGE_FIREBASE_CONFIG_KEY);
      }
    }
  }

  private cleanDatabaseUrl(url: string): string {
    return url.replace(/\/+$/, '');
  }

  private async pushToFirebase(entry: SurveyResponse): Promise<void> {
    if (!this.firebaseConfig?.databaseURL) return;
    const url = `${this.cleanDatabaseUrl(this.firebaseConfig.databaseURL)}/training_eval/responses/${entry.id}.json`;
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
  }

  public async syncFromFirebase(): Promise<boolean> {
    if (!this.firebaseConfig?.databaseURL) return false;
    try {
      const url = `${this.cleanDatabaseUrl(this.firebaseConfig.databaseURL)}/training_eval/responses.json`;
      const res = await fetch(url);
      if (!res.ok) return false;
      const data = await res.json();
      if (data && typeof data === 'object') {
        const list: SurveyResponse[] = Object.values(data);
        list.sort((a, b) => b.timestamp - a.timestamp);
        this.saveLocalResponses(list);
        this.notifyListeners(list);
        return true;
      }
      return true;
    } catch (err) {
      console.warn('Sync error from Firebase:', err);
      return false;
    }
  }

  private startFirebaseSync(): void {
    if (this.firebaseConfig?.databaseURL && !this.firebasePollInterval) {
      this.syncFromFirebase();
      this.firebasePollInterval = window.setInterval(() => {
        this.syncFromFirebase();
      }, 5000);
    }
  }

  // Statistical Calculation Engine
  public calculateSummary(responses: SurveyResponse[]): SurveySummary {
    const total = responses.length;

    if (total === 0) {
      const emptyStats = QUESTIONS.map((q) => ({
        id: q.id,
        question: q,
        mean: 0,
        count: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        level: getLikertLevel(0),
      }));

      return {
        totalResponses: 0,
        overallMean: 0,
        overallLevel: getLikertLevel(0),
        questionStats: emptyStats,
        highestQuestion: null,
        lowestQuestion: null,
        recentComments: [],
      };
    }

    const questionStats = QUESTIONS.map((q) => {
      const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let sum = 0;

      for (const res of responses) {
        const val = res.ratings[q.id];
        if (val >= 1 && val <= 5) {
          dist[val as 1 | 2 | 3 | 4 | 5]++;
          sum += val;
        }
      }

      const mean = Number((sum / total).toFixed(2));
      return {
        id: q.id,
        question: q,
        mean,
        count: total,
        distribution: dist,
        level: getLikertLevel(mean),
      };
    });

    const overallSum = questionStats.reduce((acc, curr) => acc + curr.mean, 0);
    const overallMean = Number((overallSum / questionStats.length).toFixed(2));
    const overallLevel = getLikertLevel(overallMean);

    // Identify highest and lowest
    const sorted = [...questionStats].sort((a, b) => b.mean - a.mean);
    const highestQuestion = sorted[0];
    const lowestQuestion = sorted[sorted.length - 1];

    // Recent comments
    const recentComments = responses
      .filter((r) => r.comment && r.comment.trim().length > 0)
      .slice(0, 15)
      .map((r) => {
        const avg = (r.ratings.q1 + r.ratings.q2 + r.ratings.q3 + r.ratings.q4 + r.ratings.q5) / 5;
        return {
          id: r.id,
          text: r.comment,
          timestamp: r.timestamp,
          avgRating: Number(avg.toFixed(1)),
        };
      });

    return {
      totalResponses: total,
      overallMean,
      overallLevel,
      questionStats,
      highestQuestion,
      lowestQuestion,
      recentComments,
    };
  }

  // Export to CSV with UTF-8 BOM so Thai characters open cleanly in Microsoft Excel
  public exportCSV(responses: SurveyResponse[]): void {
    if (responses.length === 0) {
      alert('ยังไม่มีข้อมูลสำหรับดาวน์โหลด');
      return;
    }

    const summary = this.calculateSummary(responses);

    const escapeCSV = (str: string | number) => {
      const s = String(str ?? '').replace(/"/g, '""');
      return `"${s}"`;
    };

    // CSV Lines
    const lines: string[] = [];

    // Header info
    lines.push(escapeCSV('รายงานสรุปผลการประเมินความพึงพอใจการอบรม'));
    lines.push(escapeCSV(`วันที่ส่งออกข้อมูล: ${new Date().toLocaleString('th-TH')}`));
    lines.push(escapeCSV(`จำนวนผู้ตอบทั้งหมด: ${summary.totalResponses} ท่าน`));
    lines.push(escapeCSV(`คะแนนเฉลี่ยรวมทั้ง 5 ด้าน: ${summary.overallMean.toFixed(2)} / 5.00`));
    lines.push(escapeCSV(`ระดับความพึงพอใจโดยรวม: ${summary.overallLevel.label} (${summary.overallLevel.labelEn})`));
    lines.push('');

    // Summary Table
    lines.push(escapeCSV('--- สรุปผลรายข้อตามเกณฑ์ 5 ระดับ ---'));
    lines.push(
      [
        escapeCSV('ลำดับ'),
        escapeCSV('หัวข้อการประเมิน'),
        escapeCSV('คะแนนเฉลี่ย'),
        escapeCSV('ระดับความพึงพอใจ'),
        escapeCSV('คะแนน 5 (มากที่สุด)'),
        escapeCSV('คะแนน 4 (มาก)'),
        escapeCSV('คะแนน 3 (ปานกลาง)'),
        escapeCSV('คะแนน 2 (น้อย)'),
        escapeCSV('คะแนน 1 (น้อยที่สุด)'),
      ].join(',')
    );

    summary.questionStats.forEach((stat, index) => {
      lines.push(
        [
          escapeCSV(`ข้อ ${index + 1}`),
          escapeCSV(stat.question.title),
          escapeCSV(stat.mean.toFixed(2)),
          escapeCSV(stat.level.label),
          escapeCSV(stat.distribution[5]),
          escapeCSV(stat.distribution[4]),
          escapeCSV(stat.distribution[3]),
          escapeCSV(stat.distribution[2]),
          escapeCSV(stat.distribution[1]),
        ].join(',')
      );
    });

    lines.push('');
    lines.push(escapeCSV('--- ข้อมูลคำตอบรายบุคคล (Raw Data ไม่ระบุตัวตน) ---'));
    lines.push(
      [
        escapeCSV('รหัสคำตอบ'),
        escapeCSV('เวลาที่บันทึก'),
        escapeCSV('ข้อ 1: เนื้อหาหลักสูตร'),
        escapeCSV('ข้อ 2: วิทยากร'),
        escapeCSV('ข้อ 3: สื่อเอกสาร'),
        escapeCSV('ข้อ 4: สถานที่/การจัดเวลา'),
        escapeCSV('ข้อ 5: การนำไปใช้จริง'),
        escapeCSV('คะแนนเฉลี่ยของผู้ตอบ'),
        escapeCSV('ข้อเสนอแนะเพิ่มเติม'),
      ].join(',')
    );

    responses.forEach((res) => {
      const avg = ((res.ratings.q1 + res.ratings.q2 + res.ratings.q3 + res.ratings.q4 + res.ratings.q5) / 5).toFixed(2);
      const timeStr = new Date(res.timestamp).toLocaleString('th-TH');
      lines.push(
        [
          escapeCSV(res.id),
          escapeCSV(timeStr),
          escapeCSV(res.ratings.q1),
          escapeCSV(res.ratings.q2),
          escapeCSV(res.ratings.q3),
          escapeCSV(res.ratings.q4),
          escapeCSV(res.ratings.q5),
          escapeCSV(avg),
          escapeCSV(res.comment || '-'),
        ].join(',')
      );
    });

    // UTF-8 BOM prefix
    const csvContent = '\uFEFF' + lines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const nowStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `training_evaluation_results_${nowStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const storageService = new StorageService();

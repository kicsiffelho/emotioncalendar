export interface Emotion {
  id: number;
  date: string;
  mood: 'happy' | 'neutral' | 'sad' | 'angry' | 'anxious';
  notes?: string;
  createdAt: Date;
}
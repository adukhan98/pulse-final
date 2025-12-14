export type MoodRating = 1 | 2 | 3 | 4 | 5;

export enum ScreenTimeLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export interface DailyEntry {
  id: string;
  date: string; // ISO Date String YYYY-MM-DD
  mood: MoodRating;
  sleepHours: number;
  exerciseMinutes: number;
  screenTime: ScreenTimeLevel;
  note: string;
  timestamp: number;
}

export type View = 'dashboard' | 'insights';

export interface InsightResult {
  message: string;
  type: 'positive' | 'neutral' | 'negative';
  metric: 'sleep' | 'exercise' | 'screenTime';
}

export interface Suggestion {
  id: string;
  text: string;
  category: 'sleep' | 'movement' | 'mindfulness';
}
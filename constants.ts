import { MoodRating, ScreenTimeLevel, Suggestion } from "./types";

export const MOOD_LABELS: Record<MoodRating, string> = {
  1: "Rough",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Great",
};

// More subtle, sophisticated mood indicators
export const MOOD_COLORS: Record<MoodRating, string> = {
  1: "bg-rose-50 text-rose-600 ring-rose-100",
  2: "bg-orange-50 text-orange-600 ring-orange-100",
  3: "bg-amber-50 text-amber-600 ring-amber-100",
  4: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  5: "bg-cyan-50 text-cyan-600 ring-cyan-100",
};

export const MOOD_GRADIENTS: Record<MoodRating, string> = {
  1: "from-rose-300 to-orange-300 shadow-rose-100",
  2: "from-orange-200 to-amber-200 shadow-orange-100",
  3: "from-stone-300 to-stone-400 shadow-stone-200", // Neutral for "Okay"
  4: "from-emerald-300 to-teal-300 shadow-emerald-100",
  5: "from-sky-300 to-indigo-300 shadow-sky-100",
};

export const SCREEN_TIME_OPTIONS = [
  { value: ScreenTimeLevel.Low, label: "Low", sub: "< 2h", color: "bg-emerald-50 text-emerald-600" },
  { value: ScreenTimeLevel.Medium, label: "Medium", sub: "2-4h", color: "bg-amber-50 text-amber-600" },
  { value: ScreenTimeLevel.High, label: "High", sub: "4h+", color: "bg-rose-50 text-rose-600" },
];

export const SUGGESTIONS: Suggestion[] = [
  { id: '1', text: 'Try going to bed 30 minutes earlier tonight.', category: 'sleep' },
  { id: '2', text: 'A 10-minute walk could help reset your mood.', category: 'movement' },
  { id: '3', text: 'Consider a screen-free 30 minutes before bed.', category: 'sleep' },
  { id: '4', text: 'Drink a glass of water right now.', category: 'mindfulness' },
  { id: '5', text: 'Take 3 deep breaths before your next task.', category: 'mindfulness' },
  { id: '6', text: 'Stretch your legs for 5 minutes.', category: 'movement' },
];

export const INITIAL_SUGGESTION_ID = '1';
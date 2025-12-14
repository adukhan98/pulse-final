import { DailyEntry, ScreenTimeLevel } from "../types";

const STORAGE_KEY = 'pulse_app_data_v1';
const HAS_SEEDED_KEY = 'pulse_app_seeded';

export const getEntries = (): DailyEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load entries", e);
    return [];
  }
};

export const saveEntry = (entry: DailyEntry): DailyEntry[] => {
  const entries = getEntries();
  // Check if entry exists for this date, if so, update it
  const existingIndex = entries.findIndex(e => e.date === entry.date);
  
  let newEntries;
  if (existingIndex >= 0) {
    newEntries = [...entries];
    newEntries[existingIndex] = entry;
  } else {
    newEntries = [entry, ...entries]; // Add to front
  }

  // Sort by date descending
  newEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  return newEntries;
};

export const getTodayEntry = (): DailyEntry | undefined => {
  const today = new Date().toISOString().split('T')[0];
  const entries = getEntries();
  return entries.find(e => e.date === today);
};

// Seed some data for the prototype if it's the first run
export const seedDataIfEmpty = (): DailyEntry[] => {
  if (localStorage.getItem(HAS_SEEDED_KEY)) {
    return getEntries();
  }

  const existing = getEntries();
  if (existing.length > 0) return existing;

  const seeded: DailyEntry[] = [];
  const today = new Date();

  // Generate 10 days of dummy data
  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Create some correlations for the demo
    // More sleep = better mood
    // Exercise = better mood
    const sleep = 5 + Math.floor(Math.random() * 4); // 5-8 hours
    const exercise = Math.random() > 0.4 ? 30 : 0;
    const screenTime = Math.random() > 0.5 ? ScreenTimeLevel.High : ScreenTimeLevel.Low;
    
    let moodBase = 3;
    if (sleep >= 7) moodBase += 1;
    if (exercise > 0) moodBase += 1;
    if (screenTime === ScreenTimeLevel.High) moodBase -= 1;
    
    // Clamp 1-5
    const mood = Math.max(1, Math.min(5, moodBase + (Math.random() > 0.8 ? -1 : 0))) as any;

    seeded.push({
      id: Math.random().toString(36).substr(2, 9),
      date: dateStr,
      mood,
      sleepHours: sleep,
      exerciseMinutes: exercise,
      screenTime,
      note: i === 0 ? "Feeling okay, just a bit tired." : "",
      timestamp: Date.now() - (i * 86400000)
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  localStorage.setItem(HAS_SEEDED_KEY, 'true');
  return seeded;
};
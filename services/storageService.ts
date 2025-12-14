import { DailyEntry, ScreenTimeLevel } from "../types";
import { encryptData, decryptData } from "../utils/encryption";

const getStorageKey = (userId?: string | null) => userId ? `pulse_app_data_${userId}` : 'pulse_app_data_guest';
const getSeededKey = (userId?: string | null) => userId ? `pulse_app_seeded_${userId}` : 'pulse_app_seeded_guest';
const getOnboardingKey = (userId?: string | null) => userId ? `pulse_onboarding_completed_${userId}` : 'pulse_onboarding_completed_guest';

export const checkOnboardingStatus = (userId?: string | null): boolean => {
  return localStorage.getItem(getOnboardingKey(userId)) === 'true';
};

export const completeOnboarding = (userId?: string | null): void => {
  localStorage.setItem(getOnboardingKey(userId), 'true');
};

export const getEntries = (userId?: string | null): DailyEntry[] => {
  try {
    const data = localStorage.getItem(getStorageKey(userId));
    return data ? decryptData(data) || [] : [];
  } catch (e) {
    console.error("Failed to load entries", e);
    return [];
  }
};

export const saveEntry = (entry: DailyEntry, userId?: string | null): DailyEntry[] => {
  const entries = getEntries(userId);
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

  localStorage.setItem(getStorageKey(userId), encryptData(newEntries));
  return newEntries;
};

export const getTodayEntry = (userId?: string | null): DailyEntry | undefined => {
  const today = new Date().toISOString().split('T')[0];
  const entries = getEntries(userId);
  return entries.find(e => e.date === today);
};

// Seed some data for the prototype if it's the first run
export const seedDataIfEmpty = (userId?: string | null): DailyEntry[] => {
  const seededKey = getSeededKey(userId);
  if (localStorage.getItem(seededKey)) {
    return getEntries(userId);
  }

  const existing = getEntries(userId);
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

  localStorage.setItem(getStorageKey(userId), encryptData(seeded));
  localStorage.setItem(seededKey, 'true');
  return seeded;
};
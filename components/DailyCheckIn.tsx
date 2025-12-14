import React, { useState, useEffect } from 'react';
import { DailyEntry, MoodRating, ScreenTimeLevel } from '../types';
import { MOOD_LABELS, MOOD_COLORS, SCREEN_TIME_OPTIONS } from '../constants';
import { Smile, Frown, Meh, Activity, Moon, Smartphone, Check } from 'lucide-react';

interface DailyCheckInProps {
  existingEntry?: DailyEntry;
  onSave: (entry: DailyEntry) => void;
  onCancel: () => void;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ existingEntry, onSave, onCancel }) => {
  const [mood, setMood] = useState<MoodRating | null>(existingEntry?.mood || null);
  const [sleep, setSleep] = useState<number>(existingEntry?.sleepHours || 7);
  const [exercise, setExercise] = useState<number>(existingEntry?.exerciseMinutes || 0);
  const [screenTime, setScreenTime] = useState<ScreenTimeLevel | null>(existingEntry?.screenTime || null);
  const [note, setNote] = useState<string>(existingEntry?.note || '');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood || !screenTime) return;

    const entry: DailyEntry = {
      id: existingEntry?.id || Math.random().toString(36).substr(2, 9),
      date: existingEntry?.date || new Date().toISOString().split('T')[0],
      mood,
      sleepHours: sleep,
      exerciseMinutes: exercise,
      screenTime,
      note,
      timestamp: Date.now(),
    };
    onSave(entry);
  };

  const getMoodIcon = (rating: number) => {
    const size = 32;
    switch (rating) {
      case 1: return <Frown size={size} />;
      case 2: return <Frown size={size} />; // Slightly diff in real app, reusing generic
      case 3: return <Meh size={size} />;
      case 4: return <Smile size={size} />;
      case 5: return <Smile size={size} />; // Reusing generic
      default: return <Meh size={size} />;
    }
  };

  return (
    <div className={`transition-opacity duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'} max-w-lg mx-auto pb-24`}>
      <header className="mb-8 text-center pt-8">
        <h1 className="text-2xl font-semibold text-slate-800">Daily Check-in</h1>
        <p className="text-slate-500">How did today go?</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8 px-4">
        
        {/* Mood Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
             Mood
          </label>
          <div className="flex justify-between gap-1">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setMood(val as MoodRating)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 w-full ${
                  mood === val 
                    ? `${MOOD_COLORS[val as MoodRating]} scale-110 shadow-md ring-2 ring-offset-2 ring-indigo-100` 
                    : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                {getMoodIcon(val)}
                <span className="text-xs font-medium hidden sm:block">{MOOD_LABELS[val as MoodRating]}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Sleep Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
            <Moon size={18} className="text-indigo-500" /> Sleep
          </label>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-slate-800 w-12">{sleep}h</span>
            <input 
              type="range" 
              min="3" 
              max="12" 
              step="0.5"
              value={sleep}
              onChange={(e) => setSleep(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>3h</span>
            <span>12h</span>
          </div>
        </section>

        {/* Exercise Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
            <Activity size={18} className="text-rose-500" /> Movement
          </label>
          <div className="grid grid-cols-3 gap-3">
             {[0, 30, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setExercise(mins)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                    exercise === mins 
                    ? 'bg-rose-100 text-rose-700 border-2 border-rose-200' 
                    : 'bg-slate-50 text-slate-600 border border-transparent hover:bg-slate-100'
                  }`}
                >
                  {mins === 0 ? 'None' : mins === 60 ? '60m+' : `${mins}m`}
                </button>
             ))}
          </div>
        </section>

        {/* Screen Time Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
            <Smartphone size={18} className="text-blue-500" /> Screen Time
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SCREEN_TIME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setScreenTime(opt.value)}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                  screenTime === opt.value
                  ? `${opt.color} border-2 border-current`
                  : 'bg-slate-50 text-slate-600 border border-transparent hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Note Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-4">Note (Optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={140}
            rows={3}
            placeholder="One small thing about today..."
            className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-200 resize-none text-slate-700 placeholder:text-slate-400"
          />
        </section>

        <div className="pt-4 flex flex-col gap-3">
          <button
            type="submit"
            disabled={!mood || !screenTime}
            className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 ${
               mood && screenTime 
               ? 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700' 
               : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Check size={20} /> Save Entry
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 rounded-xl font-medium text-slate-500 hover:bg-slate-100 transition-colors"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default DailyCheckIn;
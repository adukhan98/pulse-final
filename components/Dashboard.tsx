import React, { useState, useEffect } from 'react';
import { DailyEntry, MoodRating, ScreenTimeLevel } from '../types';
import { MOOD_GRADIENTS, SUGGESTIONS, SCREEN_TIME_OPTIONS } from '../constants';
import { ChevronRight, Sparkles, Moon, Activity, Smartphone, ArrowRight, Check, Edit2 } from 'lucide-react';

interface DashboardProps {
  entries: DailyEntry[];
  onSaveEntry: (entry: DailyEntry) => void;
  onViewInsights: () => void;
  onDismissSuggestion: () => void;
  currentSuggestionId: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  entries,
  onSaveEntry,
  onViewInsights,
  currentSuggestionId,
  onDismissSuggestion
}) => {
  const today = new Date().toISOString().split('T')[0];
  const existingEntry = entries.find(e => e.date === today);
  const suggestion = SUGGESTIONS.find(s => s.id === currentSuggestionId) || SUGGESTIONS[0];

  const [mood, setMood] = useState<MoodRating | null>(null);
  const [sleep, setSleep] = useState<number>(7);
  const [exercise, setExercise] = useState<boolean>(false);
  const [screenTime, setScreenTime] = useState<ScreenTimeLevel | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (existingEntry) {
      setMood(existingEntry.mood);
      setSleep(existingEntry.sleepHours);
      setExercise(existingEntry.exerciseMinutes > 0);
      setScreenTime(existingEntry.screenTime);
    }
  }, [existingEntry, isEditMode]);

  const handleSubmit = () => {
    if (!mood || !screenTime) return;

    const entry: DailyEntry = {
      id: existingEntry?.id || Math.random().toString(36).substr(2, 9),
      date: existingEntry?.date || today,
      mood,
      sleepHours: sleep,
      exerciseMinutes: exercise ? 30 : 0,
      screenTime,
      note: existingEntry?.note || '',
      timestamp: Date.now(),
    };
    onSaveEntry(entry);
    setIsEditMode(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const formattedDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // === SUMMARY VIEW (Already Logged) ===
  if (existingEntry && !isEditMode) {
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const entry = entries.find(e => e.date === dStr);
      weekData.push({ date: d, entry });
    }

    return (
      <div className="pt-12 px-6 space-y-8 pb-32 max-w-lg mx-auto">
        <header className="space-y-1 animate-enter text-center">
          <h2 className="text-xs font-semibold text-secondary/80 uppercase tracking-[0.2em]">{formattedDate}</h2>
          <h1 className="text-3xl font-[350] tracking-tight text-primary">Log complete.</h1>
        </header>

        <div className="glass-panel p-8 rounded-[40px] text-center space-y-8 relative overflow-hidden animate-enter-delay transition-all duration-700 hover:shadow-float">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-600/80 rounded-full flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-50/30">
            <Check size={40} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-medium text-primary mb-3">All set for today</h3>
            <p className="text-secondary text-base font-light leading-relaxed max-w-[220px] mx-auto">
              See you tomorrow.
            </p>
          </div>
          <button
            onClick={() => setIsEditMode(true)}
            className="inline-flex items-center gap-2 text-stone-500 font-medium text-xs uppercase tracking-widest px-6 py-3 rounded-full bg-stone-100/50 hover:bg-stone-200/50 transition-all border border-stone-200/50"
          >
            <Edit2 size={12} /> Edit
          </button>
        </div>

        <section className="glass-panel p-6 rounded-[36px] animate-enter-delay transition-all duration-500 ease-out hover:shadow-float" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-center mb-8 px-2">
            <h2 className="text-sm font-semibold text-primary/70">Past 7 Days</h2>
            <button onClick={onViewInsights} className="text-stone-400 text-xs font-bold uppercase tracking-widest flex items-center hover:text-stone-600 transition-colors">
              Insights <ChevronRight size={14} className="ml-1" />
            </button>
          </div>
          <div className="flex justify-between items-end h-20 px-2">
            {weekData.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 h-full justify-end group cursor-default">
                <div
                  className={`w-3 rounded-full transition-all duration-700 ${day.entry
                      ? `h-full bg-gradient-to-t ${MOOD_GRADIENTS[day.entry.mood]} opacity-90 group-hover:scale-x-125 shadow-sm`
                      : 'h-1.5 bg-stone-200/50'
                    }`}
                ></div>
                <span className={`text-[9px] font-bold tracking-widest uppercase ${day.date.toISOString().split('T')[0] === today ? 'text-primary' : 'text-stone-300'}`}>
                  {day.date.toLocaleDateString('en-US', { weekday: 'narrow' })}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Calming Recommendation Card */}
        <section className="relative overflow-hidden rounded-[40px] p-8 text-stone-800 shadow-soft-xl group animate-enter-delay transition-all duration-700 hover:shadow-2xl" style={{ animationDelay: '0.3s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-200 opacity-90"></div>
          <div className="absolute inset-0 bg-white/40"></div>

          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex items-center gap-2 opacity-60">
              <div className="p-1.5 bg-stone-900/5 rounded-full backdrop-blur-md">
                <Sparkles size={14} className="text-stone-600" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-stone-600">Daily Nudge</span>
            </div>

            <p className="text-2xl font-[350] leading-snug tracking-tight text-primary drop-shadow-sm">
              "{suggestion.text}"
            </p>

            <div className="flex gap-4 pt-2">
              <button
                onClick={onDismissSuggestion}
                className="bg-stone-900 text-stone-50 px-8 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
              >
                Okay
              </button>
              <button
                onClick={onDismissSuggestion}
                className="text-stone-400 hover:text-stone-600 px-4 py-3 text-sm font-medium transition-all"
              >
                Pass
              </button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // === CHECK-IN FORM (Main View) ===
  return (
    <div className="pt-12 px-6 space-y-8 pb-32 max-w-lg mx-auto">

      <header className="space-y-2 animate-enter text-center">
        <h2 className="text-xs font-semibold text-secondary/60 uppercase tracking-[0.2em]">{formattedDate}</h2>
        <h1 className="text-3xl font-[350] tracking-tight text-primary">{getGreeting()}.</h1>
      </header>

      {/* Mood Section - Clean Glass */}
      <section className="glass-panel p-8 rounded-[40px] transition-all duration-500 ease-out hover:shadow-float animate-enter-delay">
        <div className="mb-10 text-center">
          <h3 className="text-xl font-medium text-primary mb-2">How do you feel?</h3>
          <p className="text-secondary text-sm font-light">Pause for a moment.</p>
        </div>

        <div className="flex justify-between items-center px-2 relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-stone-200/50 -z-10"></div>

          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              onClick={() => setMood(val as MoodRating)}
              className={`relative w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 ${mood === val
                  ? `bg-gradient-to-br ${MOOD_GRADIENTS[val as MoodRating]} text-white shadow-xl scale-125 ring-4 ring-white`
                  : 'bg-white text-stone-300 shadow-sm hover:scale-110 hover:text-stone-400'
                }`}
            >
              {val}
            </button>
          ))}
        </div>
        <div className="flex justify-between px-4 mt-6 text-[10px] uppercase tracking-widest font-bold text-stone-300">
          <span>Rough</span>
          <span>Great</span>
        </div>
      </section>

      {/* Habits Section - Glass & Soft Controls */}
      <section className="glass-panel p-8 rounded-[40px] space-y-12 animate-enter-delay transition-all duration-500 ease-out hover:shadow-float" style={{ animationDelay: '0.2s' }}>

        {/* Sleep */}
        <div className="space-y-6 group">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-primary font-medium">
              <div className="p-2.5 bg-stone-100 text-stone-600 rounded-full">
                <Moon size={18} strokeWidth={2} />
              </div>
              <span>Sleep</span>
            </div>
            <span className="text-3xl font-[350] tracking-tighter text-primary tabular-nums">{sleep}<span className="text-sm font-light text-secondary ml-1">h</span></span>
          </div>
          <div className="relative h-8 flex items-center">
            <div className="absolute w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-stone-400 rounded-full opacity-50 transition-all duration-300"
                style={{ width: `${(sleep / 12) * 100}%` }}
              ></div>
            </div>
            <input
              type="range"
              min="3"
              max="12"
              step="0.5"
              value={sleep}
              onChange={(e) => setSleep(parseFloat(e.target.value))}
              className="w-full absolute z-10 opacity-0 cursor-pointer h-10"
            />
            <div
              className="absolute h-8 w-8 bg-white shadow-lg border border-stone-100 rounded-full pointer-events-none transition-all duration-300 ease-out flex items-center justify-center"
              style={{ left: `calc(${((sleep - 3) / 9) * 100}% - 16px)` }}
            >
              <div className="w-2 h-2 bg-stone-800 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Exercise Toggle - Minimal & Tactile */}
        <div onClick={() => setExercise(!exercise)} className="cursor-pointer group select-none">
          <div className="flex justify-between items-center bg-stone-50/50 p-2 rounded-[24px] border border-transparent hover:border-stone-100 transition-all duration-300">
            <div className="flex items-center gap-4 pl-2">
              <div className={`p-2.5 rounded-full transition-colors duration-500 ${exercise ? 'bg-orange-100 text-orange-500' : 'bg-stone-100 text-stone-400'}`}>
                <Activity size={20} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-primary">Movement</span>
                <span className="text-xs text-secondary transition-opacity">{exercise ? 'Logged' : 'Tap to log'}</span>
              </div>
            </div>
            <div
              className={`w-16 h-10 rounded-full p-1 transition-colors duration-500 relative ${exercise ? 'bg-stone-800' : 'bg-stone-200'}`}
            >
              <div className={`w-8 h-8 bg-white rounded-full shadow-md transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${exercise ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>

        {/* Screen Time - Soft Pills */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-primary font-medium pl-2">
            <div className="p-2.5 bg-stone-100 text-stone-600 rounded-full">
              <Smartphone size={18} strokeWidth={2} />
            </div>
            <span>Screen Time</span>
          </div>
          <div className="bg-stone-100/50 p-1.5 rounded-[28px] flex relative gap-1">
            {SCREEN_TIME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setScreenTime(opt.value)}
                className={`flex-1 py-4 rounded-[24px] text-sm font-medium transition-all duration-500 flex flex-col items-center gap-1 ${screenTime === opt.value
                    ? 'bg-white text-primary shadow-md scale-[1.02]'
                    : 'text-secondary hover:text-primary hover:bg-white/40'
                  }`}
              >
                <span>{opt.label}</span>
                {/* <span className="text-[9px] opacity-40 font-bold uppercase tracking-widest">{opt.sub}</span> */}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Button */}
      <div className="sticky bottom-16 z-20 animate-enter-delay bg-background/0 backdrop-blur-0 py-4" style={{ animationDelay: '0.3s' }}>
        <button
          onClick={handleSubmit}
          disabled={!mood || !screenTime}
          className={`w-full py-5 rounded-[32px] font-medium text-lg flex items-center justify-center gap-3 shadow-xl transition-all duration-500 ${mood && screenTime
              ? 'bg-stone-900 text-stone-50 hover:scale-[1.02] active:scale-[0.98] shadow-stone-300'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
        >
          <span className="tracking-wide">Log Day</span>
          {mood && screenTime && <ArrowRight size={18} className="opacity-80" />}
        </button>
      </div>

    </div>
  );
};

export default Dashboard;
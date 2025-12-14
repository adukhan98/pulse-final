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
        <div className="pt-10 px-6 space-y-8 pb-32">
          <header className="space-y-1 animate-enter">
            <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest">{formattedDate}</h2>
            <h1 className="text-3xl font-semibold tracking-tight text-primary">All caught up.</h1>
          </header>

          <div className="bg-surface rounded-[32px] p-8 shadow-soft text-center space-y-6 relative overflow-hidden animate-enter-delay transition-all duration-500 ease-out hover:shadow-float hover:-translate-y-1">
             <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm ring-4 ring-green-50/50">
               <Check size={36} strokeWidth={3} />
             </div>
             <div>
               <h3 className="text-xl font-semibold text-primary mb-2">Logged for today</h3>
               <p className="text-secondary text-sm leading-relaxed max-w-[200px] mx-auto">
                 Great job keeping up with your daily rhythm.
               </p>
             </div>
             <button 
                onClick={() => setIsEditMode(true)}
                className="inline-flex items-center gap-2 text-primary font-medium text-sm px-4 py-2 rounded-full bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100 hover:scale-105 active:scale-95"
              >
                <Edit2 size={14} /> Edit Response
             </button>
          </div>

          <section className="bg-surface p-6 rounded-[32px] shadow-soft animate-enter-delay transition-all duration-500 ease-out hover:shadow-float hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-semibold text-secondary">This Week</h2>
              <button onClick={onViewInsights} className="text-indigo-600 text-sm font-medium flex items-center hover:opacity-80 transition-opacity">
                Insights <ChevronRight size={16} />
              </button>
            </div>
            <div className="flex justify-between items-end h-16 px-1">
              {weekData.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 h-full justify-end group cursor-default">
                    <div 
                      className={`w-3.5 rounded-full transition-all duration-500 ${
                        day.entry 
                          ? `h-full bg-gradient-to-t ${MOOD_GRADIENTS[day.entry.mood]} opacity-90 group-hover:scale-x-110 shadow-sm`
                          : 'h-2 bg-slate-100'
                      }`}
                    ></div>
                    <span className={`text-[10px] font-bold tracking-wide uppercase ${day.date.toISOString().split('T')[0] === today ? 'text-primary' : 'text-slate-300'}`}>
                      {day.date.toLocaleDateString('en-US', { weekday: 'narrow' })}
                    </span>
                </div>
              ))}
            </div>
          </section>

          {/* New Aesthetic Recommendation Card - Green/Teal Variant */}
          <section className="relative overflow-hidden rounded-[32px] p-8 text-white shadow-lg shadow-emerald-200/50 group animate-enter-delay transition-all duration-500 hover:shadow-xl hover:scale-[1.02]" style={{ animationDelay: '0.3s' }}>
            {/* Dynamic Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-600 transition-transform duration-700 group-hover:scale-110"></div>
            
            {/* Texture/Noise */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-center gap-2 opacity-90">
                <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-md">
                   <Sparkles size={14} className="text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-white/90">Daily Focus</span>
              </div>
              
              <p className="text-2xl font-medium leading-snug tracking-tight text-white drop-shadow-sm">
                "{suggestion.text}"
              </p>
              
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={onDismissSuggestion}
                  className="bg-white/95 text-teal-900 px-6 py-3 rounded-full text-sm font-bold shadow-sm hover:bg-white transition-all active:scale-95 hover:scale-105 hover:shadow-lg"
                >
                  Complete
                </button>
                <button 
                  onClick={onDismissSuggestion}
                  className="text-white/70 hover:text-white px-4 py-3 text-sm font-medium transition-all hover:scale-105 active:scale-95"
                >
                  Dismiss
                </button>
              </div>
            </div>
            
            {/* Subtle Abstract Glows */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-[50px] pointer-events-none transition-transform duration-700 group-hover:translate-x-4 group-hover:-translate-y-4"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/30 rounded-full blur-[40px] pointer-events-none mix-blend-overlay transition-transform duration-700 group-hover:-translate-x-4 group-hover:translate-y-4"></div>
          </section>
        </div>
    )
  }

  // === CHECK-IN FORM (Main View) ===
  return (
    <div className="pt-10 px-6 space-y-8 pb-32">
      
      <header className="space-y-1 animate-enter">
        <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest">{formattedDate}</h2>
        <h1 className="text-3xl font-semibold tracking-tight text-primary">{getGreeting()}, User.</h1>
      </header>

      {/* Mood Section */}
      <section className="bg-surface p-8 rounded-[32px] shadow-soft transition-all duration-500 ease-out hover:shadow-float hover:-translate-y-1 animate-enter-delay">
        <div className="mb-8">
            <h3 className="text-xl font-semibold text-primary mb-2">How are you feeling?</h3>
            <p className="text-secondary text-sm">Reflect on your current state of mind.</p>
        </div>
        
        <div className="flex justify-between items-center px-1">
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              onClick={() => setMood(val as MoodRating)}
              className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 active:scale-90 ${
                mood === val 
                  ? `bg-gradient-to-br ${MOOD_GRADIENTS[val as MoodRating]} text-white shadow-lg scale-110 ring-4 ring-white` 
                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-500 hover:scale-110'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
        <div className="flex justify-between px-2 mt-4 text-[10px] uppercase tracking-widest font-bold text-slate-300">
            <span>Rough</span>
            <span>Great</span>
        </div>
      </section>

      {/* Habits Section */}
      <section className="bg-surface p-8 rounded-[32px] shadow-soft space-y-10 animate-enter-delay transition-all duration-500 ease-out hover:shadow-float hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full"></div>
          <h3 className="text-xl font-semibold text-primary">Daily Habits</h3>
        </div>

        {/* Sleep */}
        <div className="space-y-4 group">
          <div className="flex justify-between items-end">
             <div className="flex items-center gap-2 text-primary font-medium">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full transition-transform group-hover:scale-110">
                  <Moon size={18} strokeWidth={2.5} /> 
                </div>
                <span>Sleep</span>
             </div>
             <span className="text-2xl font-semibold tracking-tight text-primary tabular-nums">{sleep} <span className="text-sm text-secondary font-normal">hrs</span></span>
          </div>
          <div className="relative h-6 flex items-center">
             <div className="absolute w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-indigo-500 rounded-full opacity-30 transition-all duration-300" 
                    style={{width: `${(sleep / 12) * 100}%`}}
                ></div>
             </div>
             <input 
                type="range" 
                min="3" 
                max="12" 
                step="0.5"
                value={sleep}
                onChange={(e) => setSleep(parseFloat(e.target.value))}
                className="w-full absolute z-10 opacity-0 cursor-pointer h-8"
             />
             <div 
                className="absolute h-6 w-6 bg-white shadow-md border border-slate-100 rounded-full pointer-events-none transition-all duration-200 ease-out group-hover:scale-125 group-active:scale-95"
                style={{left: `calc(${((sleep - 3) / 9) * 100}% - 12px)`}}
             >
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
             </div>
          </div>
        </div>

        {/* Exercise */}
        <div className="flex justify-between items-center group cursor-pointer select-none transition-transform duration-200 active:scale-[0.98]" onClick={() => setExercise(!exercise)}>
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-full transition-all duration-300 group-hover:scale-110 ${exercise ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400'}`}>
                <Activity size={20} strokeWidth={2.5} />
             </div>
             <div className="flex flex-col">
                <span className="font-medium text-primary">Movement</span>
                <span className="text-xs text-secondary transition-opacity">{exercise ? '30+ mins logged' : 'Tap to log activity'}</span>
             </div>
          </div>
          <button 
             className={`w-14 h-8 rounded-full transition-all duration-300 relative shadow-inner group-hover:shadow-md ${exercise ? 'bg-rose-500' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-sm transition-transform duration-300 ${exercise ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Screen Time */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-medium group">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-full transition-transform group-hover:scale-110">
                <Smartphone size={18} strokeWidth={2.5} /> 
             </div>
             <span>Screen Time</span>
          </div>
          <div className="bg-slate-50 p-1.5 rounded-[20px] flex relative">
             {SCREEN_TIME_OPTIONS.map((opt) => (
               <button
                 key={opt.value}
                 onClick={() => setScreenTime(opt.value)}
                 className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all duration-300 flex flex-col items-center gap-0.5 active:scale-95 ${
                   screenTime === opt.value
                     ? 'bg-white text-primary shadow-sm ring-1 ring-black/5 scale-[1.02]'
                     : 'text-secondary hover:text-primary hover:bg-white/50 hover:scale-105'
                 }`}
               >
                 <span>{opt.label}</span>
                 <span className="text-[10px] opacity-60 font-normal">{opt.sub}</span>
               </button>
             ))}
          </div>
        </div>
      </section>

      {/* Submit Button */}
      <div className="sticky bottom-24 z-10 animate-enter-delay" style={{ animationDelay: '0.3s' }}>
        <button
            onClick={handleSubmit}
            disabled={!mood || !screenTime}
            className={`w-full py-5 rounded-[24px] font-bold text-lg flex items-center justify-center gap-3 shadow-float transition-all duration-300 ${
            mood && screenTime
                ? 'bg-primary text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-200/50'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
        >
            Log Today <ArrowRight size={20} strokeWidth={3} />
        </button>
      </div>

    </div>
  );
};

export default Dashboard;
import React, { useMemo } from 'react';
import { DailyEntry, ScreenTimeLevel } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { Moon, Smartphone, Activity, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface InsightsViewProps {
  entries: DailyEntry[];
}

const InsightsView: React.FC<InsightsViewProps> = ({ entries }) => {
  // --- 1. Weekly Data Preparation ---
  const weeklyData = useMemo(() => {
    // Sort by date
    const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    // Get last 7 days
    const last7Days = sorted.slice(-7);
    
    // Fill in missing days for a complete 7-day view if needed, 
    // but for simplicity, we map existing entries to the chart format
    return last7Days.map(e => ({
      ...e,
      day: new Date(e.date).getDate(), // e.g., 30, 03, 06
      fullDate: new Date(e.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    }));
  }, [entries]);

  // --- 2. Statistics & Trends ---
  const stats = useMemo(() => {
    if (entries.length === 0) return { avg: 0, trend: 0 };

    const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const currentWeek = sorted.slice(-7);
    const previousWeek = sorted.slice(-14, -7);

    const currentAvg = currentWeek.reduce((acc, curr) => acc + curr.mood, 0) / (currentWeek.length || 1);
    const prevAvg = previousWeek.reduce((acc, curr) => acc + curr.mood, 0) / (previousWeek.length || 1);

    const diff = currentAvg - prevAvg;
    const percentage = prevAvg ? ((diff / prevAvg) * 100) : 0;

    return {
      avg: currentAvg.toFixed(1),
      trend: Math.round(percentage)
    };
  }, [entries]);

  // --- 3. Pattern Detection Logic ---
  const patterns = useMemo(() => {
    if (entries.length < 3) return [];
    
    const insights = [];

    // Sleep Pattern
    const highSleep = entries.filter(e => e.sleepHours >= 7);
    const lowSleep = entries.filter(e => e.sleepHours < 7);
    const avgMoodHighSleep = highSleep.reduce((acc, c) => acc + c.mood, 0) / (highSleep.length || 1);
    const avgMoodLowSleep = lowSleep.reduce((acc, c) => acc + c.mood, 0) / (lowSleep.length || 1);
    
    if (avgMoodHighSleep > avgMoodLowSleep + 0.3) {
      const diffPercent = Math.round(((avgMoodHighSleep - avgMoodLowSleep) / avgMoodLowSleep) * 100);
      insights.push({
        id: 'sleep',
        title: 'Sleep Pattern',
        icon: <Moon size={20} className="text-indigo-600" />,
        bg: 'bg-indigo-50',
        text: `You tend to feel ${diffPercent}% better on days you sleep more than 7 hours.`
      });
    }

    // Screen Time Pattern
    const highScreen = entries.filter(e => e.screenTime === ScreenTimeLevel.High);
    const lowScreen = entries.filter(e => e.screenTime === ScreenTimeLevel.Low || e.screenTime === ScreenTimeLevel.Medium);
    const avgMoodHighScreen = highScreen.reduce((acc, c) => acc + c.mood, 0) / (highScreen.length || 1);
    const avgMoodLowScreen = lowScreen.reduce((acc, c) => acc + c.mood, 0) / (lowScreen.length || 1);

    if (avgMoodHighScreen < avgMoodLowScreen - 0.3) {
       insights.push({
        id: 'screen',
        title: 'Screen Time',
        icon: <Smartphone size={20} className="text-blue-600" />,
        bg: 'bg-blue-50',
        text: 'Low mood days often follow high screen time evenings.'
      });
    }

    // Exercise Pattern
    const withExercise = entries.filter(e => e.exerciseMinutes > 0);
    const withoutExercise = entries.filter(e => e.exerciseMinutes === 0);
    const avgMoodExercise = withExercise.reduce((acc, c) => acc + c.mood, 0) / (withExercise.length || 1);
    const avgMoodNoExercise = withoutExercise.reduce((acc, c) => acc + c.mood, 0) / (withoutExercise.length || 1);

    if (avgMoodExercise > avgMoodNoExercise + 0.2) {
      insights.push({
        id: 'exercise',
        title: 'Movement',
        icon: <Activity size={20} className="text-rose-600" />,
        bg: 'bg-rose-50',
        text: 'Moving your body correlates with a boost in your daily mood.'
      });
    }

    // Fallback if no specific patterns found yet
    if (insights.length === 0) {
      insights.push({
        id: 'collection',
        title: 'Gathering Data',
        icon: <TrendingUp size={20} className="text-emerald-600" />,
        bg: 'bg-emerald-50',
        text: "Keep tracking! We're learning what makes your best days happen."
      });
    }

    return insights;
  }, [entries]);


  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen pb-32 text-secondary p-8 text-center animate-enter">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <TrendingUp size={24} className="opacity-50" />
        </div>
        <p className="font-medium text-lg text-primary mb-2">No Data Yet</p>
        <p className="text-sm">Log your first day to unlock insights.</p>
      </div>
    );
  }

  return (
    <div className="pb-32 pt-10 px-6 space-y-8 max-w-lg mx-auto">
      <header className="mb-2 animate-enter">
        <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-1">YOUR TRENDS</h2>
        <h1 className="text-3xl font-semibold tracking-tight text-primary">Weekly Insights</h1>
      </header>

      {/* Main Weekly Chart Card */}
      <div className="bg-surface rounded-[32px] p-8 shadow-soft animate-enter-delay transition-all hover:shadow-float">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-sm font-medium text-secondary mb-1">Average Mood</h3>
            <div className="text-4xl font-bold text-primary tracking-tight">{stats.avg}<span className="text-lg text-secondary font-normal">/5</span></div>
          </div>
          
          {stats.trend !== 0 && (
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${stats.trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {stats.trend > 0 ? '+' : ''}{stats.trend}% vs last week
              {stats.trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            </div>
          )}
        </div>

        <div className="h-48 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                dy={10}
              />
              <Tooltip 
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                labelStyle={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}
                itemStyle={{ color: '#0f172a', fontWeight: 600, fontSize: '13px' }}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#fff', stroke: '#10b981', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detected Patterns Section */}
      <div className="animate-enter-delay" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-lg font-semibold text-primary mb-4">Detected Patterns</h2>
        <div className="space-y-4">
          {patterns.map((pattern) => (
            <div key={pattern.id} className="bg-surface p-6 rounded-[24px] shadow-soft flex gap-5 items-start transition-all hover:scale-[1.01] hover:shadow-md">
              <div className={`min-w-[48px] h-12 rounded-2xl ${pattern.bg} flex items-center justify-center shrink-0`}>
                {pattern.icon}
              </div>
              <div className="pt-0.5">
                <h3 className="font-semibold text-primary text-base mb-1">{pattern.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">
                  {pattern.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default InsightsView;
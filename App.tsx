import React, { useState, useEffect } from 'react';
import { View, DailyEntry } from './types';
import { saveEntry, seedDataIfEmpty } from './services/storageService';
import { INITIAL_SUGGESTION_ID } from './constants';
import Dashboard from './components/Dashboard';
import InsightsView from './components/InsightsView';
import { Home, BarChart2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [suggestionId, setSuggestionId] = useState(INITIAL_SUGGESTION_ID);

  useEffect(() => {
    const seededData = seedDataIfEmpty();
    setEntries(seededData);
  }, []);

  const handleSaveEntry = (entry: DailyEntry) => {
    const updatedEntries = saveEntry(entry);
    setEntries(updatedEntries);
    setCurrentView('dashboard');
  };

  const handleDismissSuggestion = () => {
    const nextId = (parseInt(suggestionId) + 1).toString();
    const finalId = parseInt(nextId) > 6 ? '1' : nextId;
    setSuggestionId(finalId);
  };

  return (
    <div className="min-h-screen font-sans text-primary flex justify-center antialiased selection:bg-emerald-100/50">
      
      {/* Parallax Background Layers - Softer, cleaner, more fluid */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Soft top-left gradient (Teal/Slate) */}
        <div 
          className="absolute top-[-25%] left-[-20%] w-[80%] h-[70%] bg-teal-50/80 rounded-full blur-[160px] opacity-70 animate-float" 
          style={{ animationDuration: '18s' }} 
        />
        
        {/* Soft bottom-right gradient (Emerald/Green) */}
        <div 
          className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[60%] bg-emerald-50/80 rounded-full blur-[140px] opacity-70 animate-float" 
          style={{ animationDuration: '24s', animationDelay: '-5s' }} 
        />

        {/* Subtle center-floating accent (Slate/Neutral) for depth */}
        <div 
           className="absolute top-[40%] right-[10%] w-[50%] h-[50%] bg-slate-100/50 rounded-full blur-[150px] opacity-40 animate-float" 
           style={{ animationDuration: '30s', animationDelay: '-12s' }}
        />
      </div>

      <div className="w-full max-w-md min-h-screen relative flex flex-col z-10">
        
        {/* Main Content Area */}
        <main className="flex-1 w-full mx-auto">
          {currentView === 'dashboard' && (
            <Dashboard 
              entries={entries} 
              onSaveEntry={handleSaveEntry}
              onViewInsights={() => setCurrentView('insights')}
              currentSuggestionId={suggestionId}
              onDismissSuggestion={handleDismissSuggestion}
            />
          )}

          {currentView === 'insights' && (
            <InsightsView entries={entries} />
          )}
        </main>

        {/* Floating Dock Navigation */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
            <nav className="bg-white/70 backdrop-blur-2xl border border-white/40 px-8 py-4 rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center gap-12 pointer-events-auto transition-transform hover:scale-[1.02] duration-300 ring-1 ring-black/5">
                <button 
                onClick={() => setCurrentView('dashboard')}
                className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${currentView === 'dashboard' ? 'text-emerald-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
                >
                <Home size={26} strokeWidth={currentView === 'dashboard' ? 2.5 : 2} />
                {currentView === 'dashboard' && <div className="absolute -bottom-2 w-1 h-1 bg-emerald-600 rounded-full"></div>}
                </button>

                <div className="w-px h-6 bg-slate-200/50"></div>

                <button 
                onClick={() => setCurrentView('insights')}
                className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${currentView === 'insights' ? 'text-emerald-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
                >
                <BarChart2 size={26} strokeWidth={currentView === 'insights' ? 2.5 : 2} />
                {currentView === 'insights' && <div className="absolute -bottom-2 w-1 h-1 bg-emerald-600 rounded-full"></div>}
                </button>
            </nav>
        </div>
      </div>
    </div>
  );
};

export default App;
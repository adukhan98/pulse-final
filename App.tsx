import React, { useState, useEffect } from 'react';
import { ClerkProvider, SignedIn, SignedOut, UserButton, useUser, useClerk } from '@clerk/clerk-react';
import { View, DailyEntry } from './types';
import { saveEntry, seedDataIfEmpty, getEntries, checkOnboardingStatus, completeOnboarding } from './services/storageService';
import { INITIAL_SUGGESTION_ID } from './constants';
import Dashboard from './components/Dashboard';
import InsightsView from './components/InsightsView';
import LandingPage from './components/LandingPage';
import OnboardingFlow from './components/OnboardingFlow';
import { Home, BarChart2 } from 'lucide-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

// === GUEST VIEW (Pre-Auth) ===
const GuestView: React.FC = () => {
  const { openSignUp } = useClerk();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleOnboardingComplete = () => {
    // Once onboarding is done, trigger Sign Up
    openSignUp();
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return <LandingPage onStartOnboarding={() => setShowOnboarding(true)} />;
};

// === AUTHENTICATED VIEW ===
const AppContent: React.FC = () => {
  const { user } = useUser();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [suggestionId, setSuggestionId] = useState(INITIAL_SUGGESTION_ID);

  useEffect(() => {
    if (user) {
      // Mark as onboarded mostly for legacy/cleanup, 
      // but the main flow relies on them being signed in now.
      completeOnboarding(user.id);

      // Seed or load data specific to this user
      const data = seedDataIfEmpty(user.id);
      setEntries(data);
    }
  }, [user]);

  const handleSaveEntry = (entry: DailyEntry) => {
    if (!user) return;
    const updatedEntries = saveEntry(entry, user.id);
    setEntries(updatedEntries);
    setCurrentView('dashboard');
  };

  const handleDismissSuggestion = () => {
    const nextId = (parseInt(suggestionId) + 1).toString();
    const finalId = parseInt(nextId) > 6 ? '1' : nextId;
    setSuggestionId(finalId);
  };

  return (
    <div className="min-h-screen font-sans text-primary flex justify-center antialiased bg-background selection:bg-stone-200/50">

      {/* Parallax Background Layers - Ultra Slow & Organic */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-30%] left-[-20%] w-[90%] h-[80%] bg-stone-200/40 rounded-full blur-[180px] opacity-60 animate-float"
          style={{ animationDuration: '35s' }}
        />

        <div
          className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[70%] bg-orange-100/30 rounded-full blur-[160px] opacity-50 animate-float"
          style={{ animationDuration: '45s', animationDelay: '-10s' }}
        />

        <div
          className="absolute top-[30%] right-[10%] w-[60%] h-[60%] bg-stone-100/30 rounded-full blur-[200px] opacity-30 animate-float"
          style={{ animationDuration: '60s', animationDelay: '-25s' }}
        />
      </div>

      <div className="w-full max-w-md min-h-screen relative flex flex-col z-10 transition-all duration-1000 ease-in-out">

        {/* User Profile - Top Right - Minimal */}
        <div className="absolute top-8 right-8 z-50">
          <UserButton afterSignOutUrl="/" appearance={{
            elements: {
              avatarBox: "w-9 h-9 ring-2 ring-white/50 shadow-sm transition-transform hover:scale-105"
            }
          }} />
        </div>

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

        {/* Floating Dock Navigation - Glass Pill */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
          <nav className="bg-white/70 backdrop-blur-2xl px-10 py-5 rounded-full shadow-soft-xl border border-white/50 flex items-center gap-16 pointer-events-auto transition-all hover:scale-[1.02] duration-500 ring-1 ring-white/60">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`relative flex flex-col items-center gap-1 transition-all duration-500 ${currentView === 'dashboard' ? 'text-stone-800 scale-110' : 'text-stone-400 hover:text-stone-600'}`}
            >
              <Home size={26} strokeWidth={currentView === 'dashboard' ? 2 : 2} />
              {currentView === 'dashboard' && <div className="absolute -bottom-3 w-1 h-1 bg-stone-800 rounded-full"></div>}
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-stone-300/30"></div>

            <button
              onClick={() => setCurrentView('insights')}
              className={`relative flex flex-col items-center gap-1 transition-all duration-500 ${currentView === 'insights' ? 'text-stone-800 scale-110' : 'text-stone-400 hover:text-stone-600'}`}
            >
              <BarChart2 size={26} strokeWidth={currentView === 'insights' ? 2 : 2} />
              {currentView === 'insights' && <div className="absolute -bottom-3 w-1 h-1 bg-stone-800 rounded-full"></div>}
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <SignedOut>
        <GuestView />
      </SignedOut>
      <SignedIn>
        <AppContent />
      </SignedIn>
    </ClerkProvider>
  );
};

export default App;
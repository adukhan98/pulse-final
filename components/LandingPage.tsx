import React from 'react';
import { SignInButton } from '@clerk/clerk-react';

interface LandingPageProps {
  onStartOnboarding: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartOnboarding }) => {
  return (
    <div className="min-h-screen font-sans text-primary flex flex-col justify-center items-center antialiased relative overflow-hidden bg-background">

      {/* Background Layers - Breathing & Organic */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-stone-200/40 rounded-full blur-[120px] opacity-60 animate-breathe"
          style={{ animationDuration: '12s' }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-stone-300/30 rounded-full blur-[100px] opacity-60 animate-breathe"
          style={{ animationDuration: '16s', animationDelay: '-5s' }}
        />
      </div>

      <div className="z-10 flex flex-col items-center text-center p-8 max-w-md w-full animate-enter">

        {/* Minimalist Logo Area */}
        <div className="mb-12 relative group cursor-default">
          <div className="absolute inset-0 bg-stone-400/20 blur-2xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="w-24 h-24 rounded-full bg-white/40 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-soft relative z-10">
            <div className="w-3 h-3 bg-stone-800 rounded-full shadow-glow animate-pulse"></div>
          </div>
        </div>

        {/* Typography - Massive & Elegant */}
        <h1 className="text-6xl font-[350] mb-6 tracking-tighter text-primary">
          pulse
        </h1>
        <p className="text-xl text-secondary mb-16 leading-relaxed max-w-[280px] mx-auto font-light">
          A quieter way to understand your days.
        </p>

        {/* Primary Action - Soft Glass Button */}
        <button
          onClick={onStartOnboarding}
          className="group relative px-8 py-4 bg-stone-900 text-stone-50 rounded-full shadow-soft-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 w-full max-w-[200px]"
        >
          <span className="relative z-10 text-lg font-medium tracking-wide">Begin</span>
          <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </button>

        {/* Secondary Action - Minimal Text Link */}
        <div className="mt-8">
          <SignInButton mode="modal">
            <button className="text-stone-400 hover:text-stone-600 font-medium text-xs tracking-widest uppercase transition-colors duration-300">
              Log In
            </button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

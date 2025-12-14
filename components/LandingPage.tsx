import React from 'react';
import { SignInButton } from '@clerk/clerk-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen font-sans text-primary flex flex-col justify-center items-center antialiased relative overflow-hidden bg-[#F5F5F7]">
      
      {/* Background Layers - reused from main app for consistency */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[-25%] left-[-20%] w-[80%] h-[70%] bg-teal-50/80 rounded-full blur-[160px] opacity-70 animate-float" 
          style={{ animationDuration: '18s' }} 
        />
        <div 
          className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[60%] bg-emerald-50/80 rounded-full blur-[140px] opacity-70 animate-float" 
          style={{ animationDuration: '24s', animationDelay: '-5s' }} 
        />
      </div>

      <div className="z-10 flex flex-col items-center text-center p-8 max-w-md w-full animate-enter">
        <div className="w-24 h-24 bg-white rounded-[32px] shadow-soft mb-8 flex items-center justify-center">
            {/* Logo placeholder - Heart/Pulse icon */}
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
            </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 tracking-tight text-slate-900">Pulse</h1>
        <p className="text-xl text-slate-500 mb-12 leading-relaxed">
          Understand how your habits influence your well-being, without the pressure.
        </p>

        <SignInButton mode="modal">
            <button className="bg-slate-900/90 hover:bg-slate-900 text-white font-medium py-4 px-12 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 w-full text-lg">
                Get Started
            </button>
        </SignInButton>

        <p className="mt-8 text-sm text-slate-400">
            Private • Secure • Local
        </p>
      </div>
    </div>
  );
};

export default LandingPage;

import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, Activity, Moon, Smartphone, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface OnboardingFlowProps {
    onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const totalSteps = 6;

    const nextStep = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    const skipToApp = () => {
        onComplete();
    };

    // Mock Data for Charts
    const habitData = [
        { name: 'Sleep', consistent: 80, inconsistent: 40, color: '#6366f1' }, // Indigo
        { name: 'Move', consistent: 65, inconsistent: 30, color: '#f43f5e' },  // Rose
        { name: 'Screen', consistent: 45, inconsistent: 80, color: '#3b82f6' }, // Blue
    ];

    const progressData = [
        { day: 1, mood: 2 },
        { day: 2, mood: 3 },
        { day: 3, mood: 2 },
        { day: 4, mood: 4 },
        { day: 5, mood: 3 },
        { day: 6, mood: 5 },
        { day: 7, mood: 5 },
    ];

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-slate-900">

            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-teal-50/60 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-50/60 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
            </div>

            <div className="w-full max-w-md z-10 flex flex-col h-full max-h-[800px]">

                {/* Progress Bar */}
                <div className="w-full h-1 bg-slate-200 rounded-full mb-8 overflow-hidden">
                    <motion.div
                        className="h-full bg-slate-900"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <section className="flex-1 flex flex-col justify-center relative">
                    <AnimatePresence mode="wait">

                        {/* SCREEN 1: WELCOME */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center space-y-6"
                            >
                                <div className="w-20 h-20 bg-white rounded-[24px] shadow-soft mx-auto flex items-center justify-center mb-4">
                                    <Sparkles className="text-emerald-500" size={32} />
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                    A calmer way to understand your days
                                </h1>
                                <p className="text-lg text-slate-500 leading-relaxed max-w-xs mx-auto">
                                    Track how you feel. Notice what helps. <br />Change one small thing at a time.
                                </p>
                            </motion.div>
                        )}

                        {/* SCREEN 2: MOOD CHECK VISUAL */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex flex-col items-center space-y-8"
                            >
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-bold text-slate-900">Check in once a day</h2>
                                    <p className="text-slate-500">A quick mood rating helps you see patterns.</p>
                                </div>

                                {/* Visual Mock of Mood Scale */}
                                <div className="bg-white p-8 rounded-[32px] shadow-soft w-full max-w-sm flex justify-between items-center relative overflow-hidden">
                                    {/* Line connecting */}
                                    <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-100 -z-10 rounded-full"></div>

                                    {[1, 2, 3, 4, 5].map((val) => (
                                        <div key={val} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${val === 4 ? 'scale-125 bg-emerald-400 text-white shadow-lg ring-4 ring-emerald-50' : 'bg-slate-100 text-slate-300'}`}>
                                            {val}
                                        </div>
                                    ))}

                                    {/* Hand Cursor Animation */}
                                    <motion.div
                                        className="absolute"
                                        initial={{ top: '60%', left: '80%', opacity: 0 }}
                                        animate={{ top: '50%', left: '68%', opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 1 }}
                                    >
                                        <div className="w-8 h-8 bg-slate-900/10 rounded-full animate-ping absolute"></div>
                                    </motion.div>
                                </div>
                                <p className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">Takes 5 Seconds</p>
                            </motion.div>
                        )}

                        {/* SCREEN 3: HABIT CONNECTION */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8 text-center"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-slate-900">Your habits shape how you feel</h2>
                                    <p className="text-slate-500">We help you spot what supports your better days.</p>
                                </div>

                                {/* Abstract Bar Chart */}
                                <div className="bg-white p-6 rounded-[32px] shadow-soft w-full h-64 flex flex-col justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={habitData} barGap={8}>
                                            <Bar dataKey="consistent" radius={[4, 4, 0, 0]}>
                                                {habitData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                                                ))}
                                            </Bar>
                                            <Bar dataKey="inconsistent" radius={[4, 4, 0, 0]}>
                                                {habitData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.2} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <div className="flex justify-between px-4 mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Sleep</span>
                                        <span>Move</span>
                                        <span>Screen</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* SCREEN 4: PROGRESS VISUAL */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8 text-center"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-slate-900">Small changes add up</h2>
                                    <p className="text-slate-500">You’ll start noticing patterns within a week.</p>
                                </div>

                                {/* Smooth Area Chart */}
                                <div className="bg-white p-6 rounded-[32px] shadow-soft w-full h-64 flex flex-col justify-center relative overflow-hidden">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={progressData}>
                                            <defs>
                                                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <Area type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" />
                                        </AreaChart>
                                    </ResponsiveContainer>

                                    {/* Highlight Marker */}
                                    <motion.div
                                        className="absolute right-[15%] top-[20%] bg-white p-2 rounded-lg shadow-lg border border-slate-100 flex gap-2 items-center"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-xs font-bold text-emerald-700">Feeling Great</span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* SCREEN 5: SUGGESTIONS */}
                        {step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8 text-center"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-slate-900">One gentle nudge at a time</h2>
                                    <p className="text-slate-500">We suggest small steps based on what actually helps you.</p>
                                </div>

                                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-8 rounded-[32px] shadow-xl shadow-indigo-200 text-white text-left relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <Sparkles size={100} />
                                    </div>

                                    <div className="relative z-10 space-y-4">
                                        <div className="flex items-center gap-2 opacity-80">
                                            <div className="p-1 bg-white/20 rounded-full">
                                                <Moon size={14} />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest">Rest & Recovery</span>
                                        </div>
                                        <h3 className="text-2xl font-medium leading-normal">
                                            "Try winding down screen use 30 minutes before bed today."
                                        </h3>
                                        <div className="flex gap-3 pt-2">
                                            <div className="h-8 px-4 bg-white text-indigo-600 rounded-full flex items-center text-xs font-bold">
                                                Okay, I'll try
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* SCREEN 6: PERSONALIZATION */}
                        {step === 6 && (
                            <motion.div
                                key="step6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8 text-center"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-slate-900">What would you like to focus on first?</h2>
                                    <p className="text-slate-500">You can change this anytime.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { icon: Moon, label: "Better Sleep" },
                                        { icon: Activity, label: "More Energy" },
                                        { icon: Smartphone, label: "Screen Balance" },
                                        { icon: Sparkles, label: "Mood Clarity" },
                                    ].map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={onComplete}
                                            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group text-left"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
                                                <item.icon size={20} />
                                            </div>
                                            <span className="font-semibold text-slate-700 group-hover:text-emerald-800">{item.label}</span>
                                            <ChevronRight className="ml-auto text-slate-300 group-hover:text-emerald-400" size={20} />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </section>

                {/* CONTROLS */}
                <div className="py-8 flex flex-col gap-4">
                    <button
                        onClick={nextStep}
                        className="w-full py-4 bg-slate-900 text-white rounded-[24px] font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {step === 6 ? 'Start Tracking' : 'Continue'}
                        {step !== 6 && <ArrowRight size={20} />}
                    </button>

                    {step < 5 && (
                        <button onClick={skipToApp} className="text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors">
                            Skip Intro
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default OnboardingFlow;

import React, { useState } from 'react';
import { ArrowRight, Sparkles, Activity, Moon, Smartphone, ChevronRight } from 'lucide-react';
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

    // Mock Data for Charts - Warmer Palette
    const habitData = [
        { name: 'Sleep', consistent: 80, inconsistent: 40, color: '#818CF8' }, // Indigo-400
        { name: 'Move', consistent: 65, inconsistent: 30, color: '#FB7185' },  // Rose-400
        { name: 'Screen', consistent: 45, inconsistent: 80, color: '#2DD4BF' }, // Teal-400
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
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-primary">

            {/* Background Ambience - Warm & Gentle */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-stone-200/50 rounded-full blur-[120px] animate-breathe" style={{ animationDuration: '15s' }}></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-100/40 rounded-full blur-[120px] animate-breathe" style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-md z-10 flex flex-col h-full max-h-[800px] justify-between">

                {/* Header / Progress Dots */}
                <div className="flex justify-between items-center w-full py-8">
                    <div className="flex gap-2">
                        {[...Array(totalSteps)].map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ${i + 1 === step ? 'w-8 bg-stone-800' : 'w-1.5 bg-stone-300'}`}
                            />
                        ))}
                    </div>
                    <button onClick={skipToApp} className="text-secondary text-xs font-medium tracking-widest uppercase hover:text-primary transition-colors">
                        Skip
                    </button>
                </div>

                <section className="flex-1 flex flex-col justify-center relative min-h-[400px]">
                    <AnimatePresence mode="wait">

                        {/* SCREEN 1: WELCOME - Pure & Simple */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="text-center space-y-8"
                            >
                                <div className="w-24 h-24 bg-white/50 backdrop-blur-md border border-white/60 rounded-[32px] shadow-soft mx-auto flex items-center justify-center mb-6">
                                    <Sparkles className="text-stone-600" size={32} />
                                </div>
                                <h1 className="text-4xl font-[350] tracking-tighter text-primary">
                                    Calm clarity.
                                </h1>
                                <p className="text-xl text-secondary leading-relaxed max-w-xs mx-auto font-light">
                                    Understand your days without the noise.
                                </p>
                            </motion.div>
                        )}

                        {/* SCREEN 2: MOOD CHECK - Tactile */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col items-center space-y-12"
                            >
                                <div className="text-center space-y-3">
                                    <h2 className="text-3xl font-[350] tracking-tight">How are you?</h2>
                                    <p className="text-secondary font-light">Just one tap a day.</p>
                                </div>

                                {/* Floating Mood Bar */}
                                <div className="bg-white/40 backdrop-blur-xl border border-white/50 p-4 rounded-full shadow-soft-xl flex gap-4 w-auto relative">
                                    {[1, 2, 3, 4, 5].map((val) => (
                                        <div key={val} className={`w-12 h-12 rounded-full flex items-center justify-center font-medium text-lg transition-all duration-500 cursor-pointer ${val === 4 ? 'scale-110 bg-white shadow-lg text-stone-800' : 'text-stone-400 hover:bg-white/50'}`}>
                                            {val}
                                        </div>
                                    ))}

                                    {/* Mock Cursor Interaction */}
                                    <motion.div
                                        className="absolute w-8 h-8 pointer-events-none"
                                        initial={{ top: '100%', left: '100%', opacity: 0 }}
                                        animate={{ top: '40%', left: '72%', opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 1.5, ease: "circOut" }}
                                    >
                                        <div className="w-4 h-4 bg-stone-800/20 rounded-full blur-[2px]"></div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* SCREEN 3: HABIT CONNECTION - Soft Charts */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 text-center"
                            >
                                <div className="space-y-3">
                                    <h2 className="text-3xl font-[350] tracking-tight">Everything connects.</h2>
                                    <p className="text-secondary font-light">See how sleep & movement shape your mood.</p>
                                </div>

                                <div className="bg-white/40 backdrop-blur-xl border border-white/50 p-8 rounded-[40px] shadow-soft-xl w-full h-72 flex flex-col justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={habitData} barGap={12}>
                                            <Bar dataKey="consistent" radius={[6, 6, 6, 6]}>
                                                {habitData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.9} />
                                                ))}
                                            </Bar>
                                            <Bar dataKey="inconsistent" radius={[6, 6, 6, 6]}>
                                                {habitData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.2} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        )}

                        {/* SCREEN 4: PROGRESS VISUAL - Organic Curves */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 text-center"
                            >
                                <div className="space-y-3">
                                    <h2 className="text-3xl font-[350] tracking-tight">Waves, not straight lines.</h2>
                                    <p className="text-secondary font-light">Observe your natural rhythm.</p>
                                </div>

                                <div className="bg-white/40 backdrop-blur-xl border border-white/50 p-6 rounded-[40px] shadow-soft-xl w-full h-72 flex flex-col justify-center relative overflow-hidden">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={progressData}>
                                            <defs>
                                                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            {/* Smooth Curve */}
                                            <Area type="monotone" dataKey="mood" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" />
                                        </AreaChart>
                                    </ResponsiveContainer>

                                    {/* Glass Floater */}
                                    <motion.div
                                        className="absolute right-[20%] top-[30%] bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/60 text-xs font-semibold text-emerald-800"
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        Upward trend
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* SCREEN 5: SUGGESTIONS - Gentle Cards */}
                        {step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 text-center"
                            >
                                <div className="space-y-3">
                                    <h2 className="text-3xl font-[350] tracking-tight">Gentle nudges.</h2>
                                    <p className="text-secondary font-light">Small ideas for better rest.</p>
                                </div>

                                <div className="bg-gradient-to-br from-stone-800 to-stone-900 p-8 rounded-[36px] shadow-soft-xl text-stone-50 text-left relative overflow-hidden group">
                                    <div className="absolute top-[-20%] right-[-20%] w-[150px] h-[150px] bg-white/5 rounded-full blur-[40px]"></div>

                                    <div className="relative z-10 space-y-6">
                                        <div className="flex items-center gap-2 opacity-60">
                                            <Moon size={16} />
                                            <span className="text-xs font-bold uppercase tracking-widest">Rest</span>
                                        </div>
                                        <h3 className="text-2xl font-light leading-snug">
                                            "Try dimming the lights an hour before sleep."
                                        </h3>
                                        <div className="h-10 px-5 bg-white/10 backdrop-blur-sm rounded-full inline-flex items-center text-sm font-medium border border-white/5">
                                            Okay
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* SCREEN 6: PERSONALIZATION - Clean List */}
                        {step === 6 && (
                            <motion.div
                                key="step6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 text-center"
                            >
                                <div className="space-y-3">
                                    <h2 className="text-3xl font-[350] tracking-tight">Where to start?</h2>
                                    <p className="text-secondary font-light">Choose a focus.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { icon: Moon, label: "Deep Sleep" },
                                        { icon: Activity, label: "Energy & Mood" },
                                        { icon: Smartphone, label: "Digital Balance" },
                                        { icon: Sparkles, label: "Peace of Mind" },
                                    ].map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={onComplete}
                                            className="flex items-center gap-4 p-5 bg-white/40 border border-white/60 hover:bg-white/80 rounded-[24px] shadow-sm hover:shadow-soft transition-all group text-left backdrop-blur-sm"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-white text-stone-400 group-hover:text-stone-800 flex items-center justify-center transition-colors shadow-sm">
                                                <item.icon size={18} />
                                            </div>
                                            <span className="font-medium text-primary text-lg">{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </section>

                {/* Footer Controls */}
                <div className="pt-8 pb-4">
                    <button
                        onClick={nextStep}
                        className="w-full py-5 bg-stone-900 text-stone-50 rounded-[28px] font-medium text-lg shadow-soft hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
                    >
                        <span>{step === 6 ? 'Create Account' : 'Continue'}</span>
                        {step !== 6 && <ArrowRight size={18} opacity={0.8} />}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default OnboardingFlow;

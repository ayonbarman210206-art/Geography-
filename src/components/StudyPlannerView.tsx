import React, { useState } from 'react';
import { UserProgress, Topic } from '../types';
import { DIPA_MOTIVATION_QUOTES } from '../data/motivationQuotes';
import { 
  Calendar, 
  Flame, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Target, 
  Heart, 
  Award,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudyPlannerViewProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  allTopics: Topic[];
  onSelectTopic: (topic: Topic) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  progress,
  onUpdateProgress,
  allTopics,
  onSelectTopic
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'30' | '60' | '90' | '180'>('60');

  // Toggle today's target
  const handleToggleTarget = (key: keyof UserProgress['todayTargets']) => {
    const updated = {
      ...progress.todayTargets,
      [key]: !progress.todayTargets[key]
    };

    onUpdateProgress({
      ...progress,
      todayTargets: updated
    });

    if (!progress.todayTargets[key]) {
      confetti({ particleCount: 20, spread: 40 });
    }
  };

  const completedCount = progress.completedTopicIds.length;
  const remainingCount = allTopics.length - completedCount;

  // Plan calculations
  const days = Number(selectedPlan);
  const topicsPerDay = (remainingCount / days).toFixed(1);

  // Recommended next topics for today
  const uncompletedTopics = allTopics.filter(t => !progress.completedTopicIds.includes(t.id));
  const todaysRecommended = uncompletedTopics.slice(0, Math.ceil(Number(topicsPerDay)));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-700 via-amber-800 to-rose-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-orange-200">
          <Calendar className="w-3.5 h-3.5 text-orange-300" />
          <span>দীপার প্রতিদিনের স্টাডি রুটিন ও স্ট্রিক প্ল্যানার</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          লক্ষ্যভিত্তিক অধ্যয়ন পরিকল্পনা ও ধারাবাহিক অগ্রগতি
        </h1>
        <p className="text-xs sm:text-sm text-orange-100 max-w-2xl font-medium">
          ধারাবাহিকতাই সফলতার চাবিকাঠি। প্রতিদিনের ছোট ছোট টার্গেট পূরণ করে ১৪৭টি অধ্যায়ের এই বিশাল সাম্রাজ্য জয় করো!
        </p>
      </div>

      {/* Streak & Today's Target Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Streak Counter */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 shadow-xs flex flex-col justify-between items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center">
            <Flame className="w-9 h-9 text-orange-600 fill-orange-500 animate-bounce" />
          </div>

          <div>
            <div className="text-3xl font-black text-orange-950 font-mono">
              {progress.studyStreakDays} দিন 🔥
            </div>
            <div className="text-xs font-bold text-orange-800">অব্যাহত স্টাডি স্ট্রিক</div>
          </div>

          <p className="text-[11px] text-slate-600 leading-normal">
            দীপা, তুমি টানা {progress.studyStreakDays} দিন ধরে নিয়মিত ভূগোল পড়াশোনা করছ! এই আগুন কখনোই নিভতে দিয়ো না!
          </p>
        </div>

        {/* Today's Checklist */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white border border-sky-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              আজকের ৫-দফা স্টাডি চেকলিস্ট (Daily Checklist)
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">
              {Object.values(progress.todayTargets).filter(Boolean).length}/৫ সম্পন্ন
            </span>
          </div>

          <div className="space-y-2">
            {[
              { key: 'story' as const, label: '১. অন্তত ১টি অধ্যায়ের গল্পের ছলে ভূগোল (Geo & Dipa সংলাপ) পড়া' },
              { key: 'theory' as const, label: '২. মূল তাত্ত্বিক সংজ্ঞা ও ভূগোলবিদদের মতবাদ পর্যবেক্ষণ' },
              { key: 'practical' as const, label: '৩. ১টি প্র্যাকটিক্যাল ডায়াগ্রাম বা স্কেল ক্যালকুলেশন অনুশীলন' },
              { key: 'mcq' as const, label: '৪. অধ্যায়ের মিনি টেস্ট এমসিকিউ সমাধান করা' },
              { key: 'revision' as const, label: '৫. রাতে ঘুমানোর আগে ৩-টায়ার রিভিশন (৩০ সেকেন্ড সামারি) দেখা' },
            ].map(item => {
              const isDone = progress.todayTargets[item.key];
              return (
                <button
                  key={item.key}
                  onClick={() => handleToggleTarget(item.key)}
                  className={`w-full p-3 rounded-2xl border text-xs sm:text-sm text-left font-medium transition-all flex items-center justify-between ${
                    isDone
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 line-through opacity-80'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-sky-50'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                    isDone ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-300 bg-white'
                  }`}>
                    {isDone && <CheckCircle className="w-3.5 h-3.5" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Customized Roadmap (30, 60, 90, 180 Days) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">কাস্টমাইজড স্টাডি রোডম্যাপ ও টার্গেট</h2>
            <p className="text-xs text-slate-500">Choose your pace: Intensive, Standard or Comprehensive</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
            {[
              { id: '30', label: '৩০ দিন (ক্র্যাশ কোর্স)' },
              { id: '60', label: '৬০ দিন (স্ট্যান্ডার্ড)' },
              { id: '90', label: '৯০ দিন (আদর্শ)' },
              { id: '180', label: '১৮০ দিন (গভীর মাস্টারী)' },
            ].map(plan => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedPlan === plan.id
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-sky-700'
                }`}
              >
                {plan.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plan Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-center">
            <span className="text-xs font-bold text-sky-700 block mb-1">মোট বাকি অধ্যায়</span>
            <span className="text-2xl font-black text-sky-950 font-mono">{remainingCount}টি</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
            <span className="text-xs font-bold text-amber-700 block mb-1">দৈনিক পড়ার লক্ষ্য</span>
            <span className="text-2xl font-black text-amber-950 font-mono">{topicsPerDay}টি / দিন</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
            <span className="text-xs font-bold text-emerald-700 block mb-1">প্রত্যাশিত সমাপ্তি</span>
            <span className="text-2xl font-black text-emerald-950 font-mono">{selectedPlan} দিনের মধ্যে</span>
          </div>
        </div>

        {/* Today's Recommended Topics */}
        {todaysRecommended.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              তোমার আজকের নির্ধারিত অধ্যায়সমূহ:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {todaysRecommended.map(t => (
                <div
                  key={t.id}
                  onClick={() => onSelectTopic(t)}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-sky-700">#{t.number}</span>
                    <span className="text-slate-400">পর্ব 0{t.partId}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{t.titleBn}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{t.titleEn}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dipa Motivation Wall */}
      <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 rounded-3xl p-6 sm:p-8 border border-pink-200/80 shadow-xs space-y-5">
        <div className="flex items-center gap-2 border-b border-pink-200/60 pb-3">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <div>
            <h2 className="text-lg font-bold text-slate-800">দীপার মোটিভেশন ওয়াল (Geo's Inspirational Cards)</h2>
            <p className="text-xs text-slate-500">Heartwarming Words of Encouragement for Dipa</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DIPA_MOTIVATION_QUOTES.map(q => (
            <div key={q.id} className="p-4 sm:p-5 rounded-2xl bg-white border border-pink-100 shadow-2xs space-y-2">
              <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 text-[10px] font-bold">
                {q.contextBn}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed italic">
                "{q.quoteBn}"
              </p>
              <div className="text-right text-xs font-bold text-rose-600">
                — {q.authorBn} 🌍
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

import React, { useRef } from 'react';
import { UserProgress, Topic } from '../types';
import { PARTS_META } from '../data/curriculumMeta';
import { 
  Award, 
  Sparkles, 
  CheckCircle, 
  Printer, 
  Flame, 
  Compass, 
  Star,
  ShieldCheck,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AchievementViewProps {
  progress: UserProgress;
  allTopics: Topic[];
}

export const AchievementView: React.FC<AchievementViewProps> = ({
  progress,
  allTopics
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  const completedCount = progress.completedTopicIds.length;
  const percentage = Math.round((completedCount / allTopics.length) * 100);

  const handlePrint = () => {
    confetti({
      particleCount: 80,
      spread: 90
    });
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-8">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-yellow-800 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-amber-200">
          <Crown className="w-3.5 h-3.5 text-yellow-300" />
          <span>দীপার অর্জনের স্বীকৃতি ও পদক গ্যালারি</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          ভূগোল মহাবিশ্বের বিজয় ট্রফি ও পদক
        </h1>
        <p className="text-xs sm:text-sm text-amber-100 max-w-2xl font-medium">
          তোমার প্রতিটি অধ্যায় জয়ের সাক্ষ্য দিচ্ছে এই পদকগুলো। সম্পূর্ণ সিলেবাস শেষ করে নিজের নামে অর্জন করো গৌরবময় অফিসিয়াল সার্টিফিকেট!
        </p>
      </div>

      {/* Grand Thermometer Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-100 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">সার্বিক অগ্রগতি ব্যারোমিটার</h2>
            <p className="text-xs text-slate-500">Total Completion across all 147 Topics</p>
          </div>

          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-sky-700 font-mono">
              {percentage}%
            </span>
            <span className="text-xs text-slate-400 block font-semibold">
              {completedCount} / 147 সম্পন্ন
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div 
            className="h-full bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 rounded-full transition-all duration-1000 shadow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* 10 Parts Mastery Badges */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          ১০টি পর্বের জ্ঞান পদক (Part Mastery Badges)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PARTS_META.map(part => {
            const partTopics = allTopics.filter(t => t.partId === part.id);
            const partDone = partTopics.filter(t => progress.completedTopicIds.includes(t.id)).length;
            const isFull = partDone === part.totalTopics;

            return (
              <div
                key={part.id}
                className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                  isFull
                    ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="w-10 h-10 rounded-2xl mx-auto flex items-center justify-center text-xl bg-slate-50 border border-slate-100">
                  {part.badgeEmoji}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {part.titleBn.split('(')[0]}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-semibold block">
                    পর্ব 0{part.id} • {partDone}/{part.totalTopics}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(partDone / part.totalTopics) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OFFICIAL CERTIFICATE */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            অফিসিয়াল সার্টিফিকেট অব এক্সিলেন্স (Mastery Certificate)
          </h2>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>সার্টিফিকেট প্রিন্ট / সংরক্ষণ</span>
          </button>
        </div>

        {/* Certificate Canvas */}
        <div 
          ref={certRef}
          className="relative bg-gradient-to-br from-amber-50 via-white to-orange-50 p-8 sm:p-12 rounded-3xl border-8 border-double border-amber-300 shadow-2xl text-center space-y-6 overflow-hidden"
        >
          {/* Corner Decors */}
          <div className="absolute top-3 left-3 text-amber-400 text-xl font-black">⚜️</div>
          <div className="absolute top-3 right-3 text-amber-400 text-xl font-black">⚜️</div>
          <div className="absolute bottom-3 left-3 text-amber-400 text-xl font-black">⚜️</div>
          <div className="absolute bottom-3 right-3 text-amber-400 text-xl font-black">⚜️</div>

          <div className="space-y-2">
            <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-800 text-2xl shadow-inner">
              👑
            </div>
            <div className="text-xs font-black tracking-widest text-amber-800 uppercase">
              DIPA GEOGRAPHY UNIVERSE • CERTIFICATE OF MASTERY
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              ভূগোল মহাবিশ্ব স্কলার স্বীকৃতিপত্র
            </h3>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 font-serif italic">
              অত্র মর্মে পরম গর্বের সাথে প্রত্যয়ন করা যাইতেছে যে—
            </p>

            <div className="text-2xl sm:text-4xl font-extrabold text-sky-900 border-b-2 border-amber-300 pb-2 inline-block px-8 font-serif">
              দীপা (Dipa)
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              দীপা ভূগোল মহাবিশ্বের ১০টি প্রধান পর্বের মোট <strong>১৪৭টি অধ্যায়</strong> (প্রাকৃতিক ভূগোল, আবহাওয়া ও জলবায়ু, সমুদ্রবিজ্ঞান, মানবীয় ও অর্থনৈতিক ভূগোল, বাংলাদেশ ভূগোল, কার্টোগ্রাফি ও জিআইএস, ব্যবহারিক পরিসংখ্যান এবং বিসিএস ক্যাডার প্রস্তুতি) গভীর নিষ্ঠার সাথে অধ্যয়ন করিয়া সফলভাবে <strong>{percentage}% সম্পন্ন</strong> করিয়াছে।
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 border-t border-amber-200/80 grid grid-cols-2 sm:grid-cols-3 items-center gap-4 text-xs">
            <div className="text-left">
              <span className="block font-bold text-slate-800">তারিখ:</span>
              <span className="text-slate-500 font-medium">{new Date().toLocaleDateString('bn-BD')}</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-amber-500 flex items-center justify-center text-[10px] font-bold text-amber-800 uppercase bg-amber-100/50">
                OFFICIAL SEAL
              </div>
            </div>

            <div className="text-right">
              <span className="block font-bold text-slate-800">প্রধান মেন্টর:</span>
              <span className="text-sky-700 font-bold">জিও (Geo) 🌍</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

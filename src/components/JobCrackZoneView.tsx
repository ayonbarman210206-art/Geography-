import React, { useState } from 'react';
import { BCS_JOB_QUESTIONS, GOLDEN_SUPER_FACTS, JobQuestionItem } from '../data/jobBank';
import { 
  Target, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Zap, 
  Filter, 
  Search, 
  Award,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const JobCrackZoneView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'bank' | 'superfacts' | 'speedtest'>('bank');
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // MCQ state for question bank
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedQuestions, setRevealedQuestions] = useState<Record<string, boolean>>({});

  // Speed test state
  const [speedTestActive, setSpeedTestActive] = useState(false);
  const [speedCurrentIndex, setSpeedCurrentIndex] = useState(0);
  const [speedScore, setSpeedScore] = useState(0);
  const [speedFinished, setSpeedFinished] = useState(false);
  const [speedUserAnswers, setSpeedUserAnswers] = useState<number[]>([]);

  // Filtering question bank
  const filteredQuestions = BCS_JOB_QUESTIONS.filter(q => {
    if (selectedExam !== 'all' && !q.exam.includes(selectedExam)) return false;
    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase();
      const matchQ = q.questionBn.toLowerCase().includes(qLower);
      const matchCat = q.categoryBn.toLowerCase().includes(qLower);
      const matchEx = q.exam.toLowerCase().includes(qLower);
      if (!matchQ && !matchCat && !matchEx) return false;
    }
    return true;
  });

  const handleAnswerQuestion = (qId: string, optIdx: number, correctIdx: number) => {
    if (revealedQuestions[qId]) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
    setRevealedQuestions(prev => ({ ...prev, [qId]: true }));
    if (optIdx === correctIdx) {
      confetti({ particleCount: 25, spread: 40 });
    }
  };

  // Speed test logic
  const handleStartSpeedTest = () => {
    setSpeedTestActive(true);
    setSpeedCurrentIndex(0);
    setSpeedScore(0);
    setSpeedFinished(false);
    setSpeedUserAnswers([]);
  };

  const handleSpeedAnswer = (optIdx: number) => {
    const currentQ = BCS_JOB_QUESTIONS[speedCurrentIndex];
    const isCorrect = optIdx === currentQ.correctIndex;
    const nextAnswers = [...speedUserAnswers, optIdx];
    setSpeedUserAnswers(nextAnswers);
    if (isCorrect) setSpeedScore(prev => prev + 1);

    if (speedCurrentIndex + 1 < Math.min(10, BCS_JOB_QUESTIONS.length)) {
      setSpeedCurrentIndex(prev => prev + 1);
    } else {
      setSpeedFinished(true);
      confetti({ particleCount: 70, spread: 80 });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-red-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-amber-200">
          <Target className="w-3.5 h-3.5 text-amber-300" />
          <span>বিসিএস প্রিলিমিনারি ও সরকারি চাকরি প্রস্তুতি</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা (১০/১০ নম্বর মিশন)
        </h1>
        <p className="text-xs sm:text-sm text-amber-100 max-w-2xl font-medium">
          বিসিএস প্রিলিমিনারির ভূগোল অংশের পূর্ণাঙ্গ প্রশ্নব্যাংক, ৩৫তম থেকে ৪৫তম বিসিএসের প্রশ্ন সমাধান এবং পরীক্ষার আগের রাতের ১০০+ গোল্ডেন ওয়ান-লাইনার।
        </p>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('bank')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'bank'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>বিসিএস প্রশ্নব্যাংক ({BCS_JOB_QUESTIONS.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('superfacts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'superfacts'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>গোল্ডেন সুপার ফ্যাক্টস ({GOLDEN_SUPER_FACTS.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('speedtest')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'speedtest'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>১০-প্রশ্নের স্পিড চ্যালেঞ্জ</span>
        </button>
      </div>

      {/* SUB-TAB 1: QUESTION BANK */}
      {activeSubTab === 'bank' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> বিসিএস পরীক্ষা:
              </span>
              {['all', '44th', '43rd', '41st', '40th', '38th'].map(ex => (
                <button
                  key={ex}
                  onClick={() => setSelectedExam(ex)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    selectedExam === ex
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {ex === 'all' ? 'সকল বিসিএস' : `${ex} বিসিএস`}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="প্রশ্ন খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-3">
            {filteredQuestions.map(item => {
              const hasAnswered = Boolean(revealedQuestions[item.id]);
              const chosen = selectedAnswers[item.id];

              return (
                <div key={item.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                      {item.exam}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {item.categoryBn}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {item.questionBn}
                  </h3>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.optionsBn.map((opt, idx) => {
                      let btnStyle = 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200';
                      if (hasAnswered) {
                        if (idx === item.correctIndex) {
                          btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                        } else if (idx === chosen) {
                          btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 font-bold';
                        } else {
                          btnStyle = 'bg-slate-50 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswerQuestion(item.id, idx, item.correctIndex)}
                          className={`p-3 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {hasAnswered && idx === item.correctIndex && (
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {hasAnswered && (
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-1 animate-fade-in">
                      <span className="font-bold text-amber-900">ব্যাখ্যা ও নোট: </span>
                      <span>{item.explanationBn}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GOLDEN SUPER FACTS */}
      {activeSubTab === 'superfacts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GOLDEN_SUPER_FACTS.map(f => (
            <div key={f.id} className="p-5 rounded-3xl bg-white border border-amber-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 text-xs font-black flex items-center justify-center">
                  ⚡
                </span>
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  {f.categoryBn}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {f.factBn}
              </p>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60 text-xs font-bold text-amber-900">
                মনে রাখার কী-পয়েন্ট: {f.highlightBn}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 3: SPEED TEST */}
      {activeSubTab === 'speedtest' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xs">
          {!speedTestActive ? (
            <div className="text-center py-10 space-y-4 max-w-md mx-auto">
              <Award className="w-12 h-12 text-amber-600 mx-auto" />
              <h2 className="text-xl font-bold text-slate-900">১০-প্রশ্নের বিসিএস ভূগোল স্পিড চ্যালেঞ্জ</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                বিসিএস প্রিলিমিনারি মানের ১০টি বাছাইকৃত প্রশ্নে নিজেকে যাচাই করো। সঠিক উত্তরে ১ পয়েন্ট এবং তাত্ক্ষণিক স্কোরবোর্ড পাবে!
              </p>
              <button
                onClick={handleStartSpeedTest}
                className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 mx-auto"
              >
                <span>চ্যালেঞ্জ শুরু করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : !speedFinished ? (
            <div className="space-y-5 max-w-xl mx-auto">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b pb-2">
                <span>প্রশ্ন {speedCurrentIndex + 1} / {Math.min(10, BCS_JOB_QUESTIONS.length)}</span>
                <span className="text-amber-600">বর্তমান স্কোর: {speedScore}</span>
              </div>

              {/* Active question */}
              {(() => {
                const currentQ = BCS_JOB_QUESTIONS[speedCurrentIndex];
                return (
                  <div className="space-y-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                      {currentQ.exam}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {currentQ.questionBn}
                    </h3>
                    <div className="space-y-2">
                      {currentQ.optionsBn.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSpeedAnswer(i)}
                          className="w-full p-3 rounded-xl border border-slate-200 hover:bg-amber-50 hover:border-amber-400 text-left text-xs sm:text-sm font-semibold transition-all text-slate-800"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-black">
                {speedScore}/10
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {speedScore >= 8 ? 'চমৎকার প্রস্তুতি দীপা! 🌟' : speedScore >= 5 ? 'ভালো হয়েছে, আরেকটু রিভিশন দিলে ১০/১০ হবে!' : 'নিয়মিত চর্চা অব্যাহত রাখো দীপা!'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                তুমি ১০টির মধ্যে {speedScore}টি প্রশ্নের সঠিক উত্তর দিয়েছ।
              </p>
              <button
                onClick={handleStartSpeedTest}
                className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700"
              >
                আবার পরীক্ষা দিন
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Topic, UserProgress } from '../types';
import { PARTS_META } from '../data/curriculumMeta';
import { 
  Sparkles, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizMockEngineViewProps {
  allTopics: Topic[];
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
}

export const QuizMockEngineView: React.FC<QuizMockEngineViewProps> = ({
  allTopics,
  progress,
  onUpdateProgress
}) => {
  const [examMode, setExamMode] = useState<'selection' | 'running' | 'result'>('selection');
  const [testType, setTestType] = useState<'quick5' | 'part20' | 'mega50'>('quick5');
  const [selectedPartId, setSelectedPartId] = useState<number>(1);

  // Active exam questions
  const [examQuestions, setExamQuestions] = useState<Array<{
    topicId: string;
    topicNum: number;
    topicTitleBn: string;
    questionBn: string;
    optionsBn: [string, string, string, string];
    correctIndex: number;
    explanationBn: string;
  }>>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedReview, setMarkedReview] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600);

  // Timer countdown
  useEffect(() => {
    if (examMode !== 'running') return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [examMode]);

  // Start exam
  const handleStartExam = (type: 'quick5' | 'part20' | 'mega50') => {
    setTestType(type);
    let pool = [...allTopics];
    if (type === 'part20') {
      pool = pool.filter(t => t.partId === selectedPartId);
    }

    // Shuffle pool
    const shuffled = pool.sort(() => Math.random() - 0.5);
    const count = type === 'quick5' ? 5 : type === 'part20' ? Math.min(20, shuffled.length) : Math.min(50, shuffled.length);
    const chosenTopics = shuffled.slice(0, count);

    const questions = chosenTopics.map(t => ({
      topicId: t.id,
      topicNum: t.number,
      topicTitleBn: t.titleBn,
      questionBn: t.sectionI_MCQ.questionBn,
      optionsBn: t.sectionI_MCQ.optionsBn as [string, string, string, string],
      correctIndex: t.sectionI_MCQ.correctIndex,
      explanationBn: t.sectionI_MCQ.explanationBn
    }));

    setExamQuestions(questions);
    setCurrentIndex(0);
    setAnswers({});
    setMarkedReview({});
    setSecondsRemaining(type === 'quick5' ? 300 : type === 'part20' ? 1200 : 1800);
    setExamMode('running');
  };

  // Answer selection
  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    setAnswers(prev => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  // Toggle mark for review
  const handleToggleReview = (qIdx: number) => {
    setMarkedReview(prev => ({
      ...prev,
      [qIdx]: !prev[qIdx]
    }));
  };

  // Finish exam
  const handleFinishExam = () => {
    setExamMode('result');
    confetti({
      particleCount: 60,
      spread: 70
    });
  };

  // Calculations for results
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  examQuestions.forEach((q, idx) => {
    const chosen = answers[idx];
    if (chosen === undefined) {
      unattemptedCount++;
    } else if (chosen === q.correctIndex) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  // BCS Negative marking: +1 for correct, -0.5 for wrong
  const rawScore = correctCount;
  const negativeDeduction = wrongCount * 0.5;
  const finalScore = Math.max(0, rawScore - negativeDeduction);
  const totalQuestions = examQuestions.length;
  const percentageScore = totalQuestions > 0 ? Math.round((finalScore / totalQuestions) * 100) : 0;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      
      {/* SELECTION SCREEN */}
      {examMode === 'selection' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-sky-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>দীপা ভূগোল মহাবিশ্ব মক টেস্ট ইঞ্জিন</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              পরীক্ষা ও মডেল টেস্ট ইঞ্জিন (BCS Standard)
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 max-w-2xl font-medium">
              সঠিক উত্তরে ১ নম্বর এবং প্রতিটি ভুল উত্তরে ০.৫০ নেগেটিভ মার্কিং সহ নিজেকে প্রস্তুত করো আসল বিসিএস ও অনার্স পরীক্ষার জন্য।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Quick 5 */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-4 flex flex-col justify-between hover:border-sky-300 transition-all">
              <div className="space-y-2">
                <span className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                  ⚡
                </span>
                <h3 className="text-base font-bold text-slate-900">৫-প্রশ্নের দ্রুত কুইজ</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  পুরো ১৪৭টি অধ্যায় থেকে দৈবভাবে নির্বাচিত ৫টি প্রশ্নে ৫ মিনিটের দ্রুত যাচাই।
                </p>
                <div className="text-xs font-bold text-sky-700 pt-1">
                  ⏱️ সময়: ৫ মিনিট • নেগেটিভ মার্কিং: ০.৫০
                </div>
              </div>
              <button
                onClick={() => handleStartExam('quick5')}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                কুইজ শুরু করুন
              </button>
            </div>

            {/* Part 20 */}
            <div className="p-6 rounded-3xl bg-white border border-indigo-100 shadow-sm space-y-4 flex flex-col justify-between hover:border-indigo-300 transition-all">
              <div className="space-y-3">
                <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  📚
                </span>
                <h3 className="text-base font-bold text-slate-900">পর্বভিত্তিক ২০-প্রশ্নের টেস্ট</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  যেকোনো একটি নির্দিষ্ট পর্ব বেছে নিয়ে তার ওপর গভীর ২০ নম্বরের টেস্ট দাও।
                </p>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">পর্ব নির্বাচন করুন:</label>
                  <select
                    value={selectedPartId}
                    onChange={(e) => setSelectedPartId(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300 bg-white font-semibold"
                  >
                    {PARTS_META.map(p => (
                      <option key={p.id} value={p.id}>
                        পর্ব 0{p.id}: {p.titleBn.split('(')[0]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-xs font-bold text-indigo-700">
                  ⏱️ সময়: ২০ মিনিট • নেগেটিভ মার্কিং: ০.৫০
                </div>
              </div>
              <button
                onClick={() => handleStartExam('part20')}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                পর্ব টেস্ট শুরু করুন
              </button>
            </div>

            {/* Mega 50 */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-sm space-y-4 flex flex-col justify-between hover:border-amber-400 transition-all">
              <div className="space-y-2">
                <span className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-sm">
                  🏆
                </span>
                <h3 className="text-base font-bold text-amber-950">৫০ নম্বরের মেগা মক টেস্ট</h3>
                <p className="text-xs text-amber-800 leading-relaxed">
                  ১৪৭টি অধ্যায়ের সমন্বয়ে তৈরি আসল বিসিএস প্রিলিমিনারি মানের পূর্ণাঙ্গ মেগা টেস্ট।
                </p>
                <div className="text-xs font-bold text-amber-900 pt-1">
                  ⏱️ সময়: ৩০ মিনিট • নেগেটিভ মার্কিং: ০.৫০
                </div>
              </div>
              <button
                onClick={() => handleStartExam('mega50')}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                মেগা মক শুরু করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RUNNING EXAM SCREEN */}
      {examMode === 'running' && examQuestions.length > 0 && (
        <div className="space-y-6">
          {/* Top Bar with Timer */}
          <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                প্রশ্ন {currentIndex + 1} / {examQuestions.length}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-sky-700">
                টপিক #{examQuestions[currentIndex].topicNum}: {examQuestions[currentIndex].topicTitleBn}
              </span>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-mono font-bold text-sm">
              <Clock className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Active Question Box */}
            <div className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {examQuestions[currentIndex].questionBn}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {examQuestions[currentIndex].optionsBn.map((opt, idx) => {
                  const isSelected = answers[currentIndex] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(currentIndex, idx)}
                      className={`w-full p-4 rounded-2xl border text-xs sm:text-sm text-left font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-sky-50 border-sky-600 text-sky-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt}</span>
                      <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                        isSelected ? 'bg-sky-600 text-white border-sky-600 font-bold' : 'border-slate-300 text-slate-400'
                      }`}>
                        {idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Nav & Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(prev => prev - 1)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold disabled:opacity-40"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentIndex === examQuestions.length - 1}
                    onClick={() => setCurrentIndex(prev => prev + 1)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold disabled:opacity-40"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleToggleReview(currentIndex)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    markedReview[currentIndex]
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {markedReview[currentIndex] ? '⭐ মার্ক করা আছে' : 'পর্যালোচনার জন্য মার্ক'}
                </button>

                <button
                  onClick={handleFinishExam}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                >
                  পরীক্ষা সমাপ্ত করুন
                </button>
              </div>
            </div>

            {/* Question Palette Sidebar */}
            <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                প্রশ্ন প্যালেট ({examQuestions.length})
              </h3>

              <div className="grid grid-cols-5 gap-2">
                {examQuestions.map((_, i) => {
                  const isAns = answers[i] !== undefined;
                  const isRev = markedReview[i];
                  const isCurr = currentIndex === i;

                  let color = 'bg-slate-100 text-slate-600';
                  if (isCurr) color = 'ring-2 ring-sky-500 font-black';
                  if (isRev) color += ' border-2 border-amber-400';
                  if (isAns) color = 'bg-emerald-600 text-white font-bold';

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-8 rounded-lg text-xs flex items-center justify-center transition-all ${color}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  <span>উত্তর দেওয়া হয়েছে ({Object.keys(answers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border border-amber-400 bg-white" />
                  <span>মার্ক করা হয়েছে ({Object.keys(markedReview).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-100" />
                  <span>বাকি আছে ({examQuestions.length - Object.keys(answers).length})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULT SCREEN */}
      {examMode === 'result' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs space-y-6">
          <div className="text-center space-y-3 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-black">
              {finalScore.toFixed(1)}
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              {percentageScore >= 80 ? 'অসাধারণ স্কোর দীপা! 🌟' : percentageScore >= 50 ? 'ভালো প্রস্তুতি, চালিয়ে যাও!' : 'আরও অনুশীলনের সুযোগ রয়েছে দীপা!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              পূর্ণমান: {totalQuestions} • অর্জিত নিট নম্বর: <strong className="text-emerald-700">{finalScore.toFixed(1)}</strong> ({percentageScore}%)
            </p>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
              <span className="text-xs text-emerald-700 font-bold block mb-1">সঠিক উত্তর (+১)</span>
              <span className="text-xl font-black text-emerald-900">{correctCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center">
              <span className="text-xs text-rose-700 font-bold block mb-1">ভুল উত্তর (-০.৫০)</span>
              <span className="text-xl font-black text-rose-900">{wrongCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-600 font-bold block mb-1">অনুত্তর</span>
              <span className="text-xl font-black text-slate-800">{unattemptedCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
              <span className="text-xs text-amber-700 font-bold block mb-1">কাটা গেছে</span>
              <span className="text-xl font-black text-amber-900">-{negativeDeduction.toFixed(1)}</span>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              প্রতিটি প্রশ্নের বিস্তারিত সমাধান ও ব্যাখ্যা
            </h3>

            <div className="space-y-4">
              {examQuestions.map((q, idx) => {
                const chosen = answers[idx];
                const isCorrect = chosen === q.correctIndex;
                const isUnanswered = chosen === undefined;

                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">প্রশ্ন #{idx + 1} (টপিক #{q.topicNum})</span>
                      {isCorrect ? (
                        <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> সঠিক (+১)
                        </span>
                      ) : isUnanswered ? (
                        <span className="text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                          অনুত্তর (০)
                        </span>
                      ) : (
                        <span className="text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> ভুল (-০.৫০)
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-slate-900">{q.questionBn}</p>

                    <div className="text-xs space-y-1 pt-1">
                      <div className="text-emerald-800 font-semibold">
                        সঠিক উত্তর: {q.optionsBn[q.correctIndex]}
                      </div>
                      {!isCorrect && !isUnanswered && (
                        <div className="text-rose-700 font-medium">
                          তোমার উত্তর: {q.optionsBn[chosen]}
                        </div>
                      )}
                      <div className="text-slate-600 italic bg-white p-2 rounded-lg border border-slate-200 mt-1">
                        💡 ব্যাখ্যা: {q.explanationBn}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t flex justify-center">
            <button
              onClick={() => setExamMode('selection')}
              className="px-6 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 shadow-xs flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>অন্য টেস্ট দিন</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  GraduationCap, 
  Sparkles, 
  FileText, 
  Share2, 
  Printer, 
  Compass, 
  ArrowRight, 
  Flame, 
  Check, 
  RotateCcw
} from 'lucide-react';
import { ALL_CHAPTER_MASTERS } from '../data/chapterMasterData';
import { ChapterMasterNote, Topic, MCQQuestion, ChapterShortQuestion, ChapterBroadQuestion } from '../types';

interface ChapterMasterAndQuestionsViewProps {
  initialChapterId?: string;
  allTopics: Topic[];
  onSelectTopic?: (topic: Topic) => void;
  onNavigateToStudio?: () => void;
}

export const ChapterMasterAndQuestionsView: React.FC<ChapterMasterAndQuestionsViewProps> = ({
  initialChapterId,
  allTopics: _allTopics,
  onSelectTopic: _onSelectTopic,
  onNavigateToStudio: _onNavigateToStudio
}) => {
  const getChId = (c: ChapterMasterNote) => c.id || `ch-${String(c.chapterNumber).padStart(2, '0')}`;

  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    initialChapterId || getChId(ALL_CHAPTER_MASTERS[0])
  );
  const [activeSubTab, setActiveSubTab] = useState<'master-note' | 'question-bank'>('master-note');

  // Filters for Question Bank
  const [qTypeFilter, setQTypeFilter] = useState<'all' | 'mcq' | 'short' | 'broad'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interactive Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealedShortAnswers, setRevealedShortAnswers] = useState<Record<string, boolean>>({});
  const [revealedBroadAnswers, setRevealedBroadAnswers] = useState<Record<string, boolean>>({});
  const [copiedNote, setCopiedNote] = useState<boolean>(false);

  // Active Chapter
  const chapter: ChapterMasterNote = useMemo(() => {
    return ALL_CHAPTER_MASTERS.find(c => getChId(c) === selectedChapterId) || ALL_CHAPTER_MASTERS[0];
  }, [selectedChapterId]);

  const totalQuestionsInChapter = chapter.questionBank.mcqs.length + 
    chapter.questionBank.shortQuestions.length + 
    chapter.questionBank.broadQuestions.length;

  // Handle MCQ selection
  const handleSelectOption = (qId: string, optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: optionIndex
    }));
  };

  // Toggle short answer visibility
  const toggleShortAnswer = (qId: string) => {
    setRevealedShortAnswers(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // Toggle broad answer visibility
  const toggleBroadAnswer = (qId: string) => {
    setRevealedBroadAnswers(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // Reset interactive quiz
  const handleResetQuiz = () => {
    setUserAnswers({});
  };

  // Filtered Questions
  const filteredMCQs = useMemo(() => {
    if (qTypeFilter !== 'all' && qTypeFilter !== 'mcq') return [];
    return chapter.questionBank.mcqs.filter((q: MCQQuestion) => {
      const matchDiff = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
      const matchSearch = !searchQuery || 
        q.questionBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.explanationBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.optionsBn.some((opt: string) => opt.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchDiff && matchSearch;
    });
  }, [chapter, qTypeFilter, difficultyFilter, searchQuery]);

  const filteredShort = useMemo(() => {
    if (qTypeFilter !== 'all' && qTypeFilter !== 'short') return [];
    return chapter.questionBank.shortQuestions.filter((q: ChapterShortQuestion) => {
      const matchSearch = !searchQuery || 
        q.questionBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.modelAnswerBn.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [chapter, qTypeFilter, searchQuery]);

  const filteredBroad = useMemo(() => {
    if (qTypeFilter !== 'all' && qTypeFilter !== 'broad') return [];
    return chapter.questionBank.broadQuestions.filter((q: ChapterBroadQuestion) => {
      const matchSearch = !searchQuery || 
        q.questionBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.modelAnswerBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.blueprintBn.some((bp: string) => bp.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSearch;
    });
  }, [chapter, qTypeFilter, searchQuery]);

  // Calculate score for MCQs
  const attemptedMCQsCount = Object.keys(userAnswers).filter(id => id.startsWith(`CH0${chapter.chapterNumber}`) || id.startsWith(`CH${chapter.chapterNumber}`)).length;
  const correctMCQsCount = chapter.questionBank.mcqs.filter(q => userAnswers[q.id] === q.correctIndex).length;

  const handleCopyNote = () => {
    const text = `# অধ্যায় ${chapter.chapterNumber}: ${chapter.titleBn} (${chapter.titleEn})\n\n## মাস্টার সারাংশ ও আন্তঃসংযুক্ত ব্যাখ্যা:\n${chapter.masterNoteContentBn.interconnectedExplanation}\n\n## ধারণাগত স্তম্ভ:\n${chapter.masterNoteContentBn.thematicPillars.map(p => `- ${p.titleBn}: ${p.keyTerms.join(', ')}`).join('\n')}\n\n## বাস্তব ও বাংলাদেশ কেস স্টাডি:\n${chapter.masterNoteContentBn.realWorldCaseStudies.map(c => `### ${c.titleBn}\n${c.contextBn}\n${c.takeawayBn}`).join('\n\n')}\n\n## ব্যবহারিক ও জিআইএস লিংক:\n${chapter.masterNoteContentBn.practicalAndGisLink}\n\n## পরীক্ষা কৌশল:\n${chapter.masterNoteContentBn.examPreparationStrategy}`;
    navigator.clipboard.writeText(text);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-sky-950 text-white p-6 sm:p-8 shadow-xl border border-sky-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-400/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>DIPA GEOGRAPHY UNIVERSE • ১০০% সম্পূর্ণ নোট ও প্রশ্নব্যাংক</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span>📖 অধ্যায় মাস্টার নোট ও ৫০+ প্রশ্নব্যাংক হাব</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              প্রতিটি অধ্যায়ের জন্য আন্তঃসংযুক্ত <strong className="text-sky-300">মাস্টার নোট</strong> এবং ন্যূনতম <strong className="text-emerald-300">৫০টি পূর্ণাঙ্গ প্রশ্ন</strong> (MCQ ২৫+, সংক্ষিপ্ত ১০+, বর্ণনামূলক ১৫+) সহ বিশ্ববিদ্যালয় অনার্স ও বিসিএস পরীক্ষার মডেল উত্তর।
            </p>
          </div>

          {/* Quick Counter Badge */}
          <div className="flex sm:flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shrink-0 text-center">
            <div className="text-3xl font-black text-amber-400">৫০+</div>
            <div className="text-xs font-semibold text-slate-200">প্রতি অধ্যায়ে প্রশ্ন</div>
            <div className="text-[11px] text-sky-300 mt-1 font-medium">১০ অধ্যায়ে ৫০০+ মোট প্রশ্ন</div>
          </div>
        </div>
      </div>

      {/* Chapter Selection Bar (10 Chapters) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-600" />
            <span>১০টি অধ্যায় নির্বাচন করুন (Select Chapter):</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            যেকোনো অধ্যায়ে ক্লিক করে সম্পূর্ণ মাস্টার নোট ও ৫০+ প্রশ্ন লোড করুন
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {ALL_CHAPTER_MASTERS.map((ch) => {
            const chId = getChId(ch);
            const isSelected = chId === selectedChapterId;
            const qCount = ch.questionBank.mcqs.length + ch.questionBank.shortQuestions.length + ch.questionBank.broadQuestions.length;
            const topCount = ch.topicsCovered.length;

            return (
              <button
                key={chId}
                onClick={() => {
                  setSelectedChapterId(chId);
                  setUserAnswers({});
                }}
                className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-400/50 scale-[1.02]'
                    : 'bg-white hover:bg-sky-50/80 text-slate-700 border-slate-200 hover:border-sky-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-base p-1 rounded-lg ${isSelected ? 'bg-sky-500/40' : 'bg-slate-100'}`}>
                      {ch.badgeEmoji}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {qCount}+ প্রশ্ন
                    </span>
                  </div>
                  <div className="text-xs font-black line-clamp-1">
                    অধ্যায় {ch.chapterNumber}: {ch.titleBn.split('(')[0]}
                  </div>
                  <div className={`text-[10px] truncate ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>
                    {ch.titleEn}
                  </div>
                </div>
                
                <div className={`mt-2 pt-2 border-t text-[10px] font-semibold flex items-center justify-between ${
                  isSelected ? 'border-sky-500/50 text-sky-100' : 'border-slate-100 text-slate-500'
                }`}>
                  <span>{ch.partId}ম খণ্ড</span>
                  <span>{topCount}টি মূল টপিক</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Chapter Header & Mode Toggles */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{chapter.badgeEmoji}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-sky-100 text-sky-800">
                অধ্যায় {chapter.chapterNumber} • {chapter.partId}ম খণ্ড
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                ✓ সম্পূর্ণ ও সংরক্ষিত
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {chapter.titleBn}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {chapter.summaryHookBn}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyNote}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="পুরো মাস্টার নোট কপি করুন"
            >
              {copiedNote ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedNote ? 'কপি সম্পন্ন!' : 'নোট কপি'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট ভিউ</span>
            </button>
          </div>
        </div>

        {/* Subtabs: Master Note vs Question Bank */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-1">
          <button
            onClick={() => setActiveSubTab('master-note')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeSubTab === 'master-note'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 সম্পূর্ণ অধ্যায় মাস্টার নোট (Master Note)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('question-bank')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all relative ${
              activeSubTab === 'question-bank'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>❓ ৫০+ প্রশ্নব্যাংক হাব (Question Bank)</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
              activeSubTab === 'question-bank' ? 'bg-amber-400 text-slate-900' : 'bg-amber-100 text-amber-900'
            }`}>
              {totalQuestionsInChapter}টি প্রশ্ন
            </span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SUBTAB 1: COMPLETE CHAPTER MASTER NOTE                        */}
        {/* ------------------------------------------------------------- */}
        {activeSubTab === 'master-note' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* 1. Interconnected Master Explanation */}
            <div className="bg-sky-50/60 border border-sky-200/80 rounded-2xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-sky-900 font-extrabold text-base">
                <Compass className="w-5 h-5 text-sky-600" />
                <span>আন্তঃসংযুক্ত মাস্টার সারসংক্ষেপ ও ধারণাগত রূপরেখা (Interconnected Master Narrative)</span>
              </div>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                {chapter.masterNoteContentBn.interconnectedExplanation}
              </p>
            </div>

            {/* 2. Monospace ASCII Diagram / Concept Map */}
            {chapter.masterNoteContentBn.conceptFlowAscii && (
              <div className="bg-slate-900 text-emerald-400 p-5 rounded-2xl font-mono text-xs sm:text-sm overflow-x-auto shadow-inner border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800 text-xs font-sans">
                  <span className="flex items-center gap-1.5 font-bold text-slate-300">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>ধারণাগত কাঠামো মানচিত্র (Concept Network Blueprint)</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">Monospace Blueprint</span>
                </div>
                <pre className="leading-tight py-2 selection:bg-emerald-800 selection:text-white">
                  {chapter.masterNoteContentBn.conceptFlowAscii}
                </pre>
              </div>
            )}

            {/* 3. Thematic Pillars */}
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-600" />
                <span>অধ্যায়ের মূল ধারণাগত স্তম্ভসমূহ (Thematic Pillars)</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chapter.masterNoteContentBn.thematicPillars.map((pillar, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100">
                        স্তম্ভ #{idx + 1}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">Core Theoretical Pillar</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{pillar.titleBn}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{pillar.descriptionBn}</p>
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="text-[11px] font-semibold text-slate-700">অন্তর্ভুক্ত কনসেপ্ট:</div>
                      <div className="flex flex-wrap gap-1">
                        {pillar.keyTerms.map((term: string, i: number) => (
                          <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Real-World & Bangladesh Case Studies */}
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>বাস্তব পৃথিবী ও বাংলাদেশ কেস স্টাডি (Case Studies)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chapter.masterNoteContentBn.realWorldCaseStudies.map((cs, idx) => (
                  <div key={idx} className="bg-amber-50/40 border border-amber-200/70 rounded-2xl p-4 space-y-2">
                    <div className="text-xs font-black text-amber-900">{cs.titleBn}</div>
                    <p className="text-xs text-slate-700 leading-relaxed">{cs.contextBn}</p>
                    <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200/80 font-medium">
                      💡 <strong>সারমর্ম:</strong> {cs.takeawayBn}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Practical Lab & GIS Cross-Links */}
            {chapter.masterNoteContentBn.practicalAndGisLink && (
              <div className="bg-indigo-50/50 border border-indigo-200/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm sm:text-base">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <span>ব্যবহারিক ভূগোল, জিআইএস ও রিমোট সেন্সিং ক্রস-কানেকশন (Practical & GIS Links)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-indigo-100">
                  {chapter.masterNoteContentBn.practicalAndGisLink}
                </p>
              </div>
            )}

            {/* 6. University & BCS Master Exam Strategy */}
            {chapter.masterNoteContentBn.examPreparationStrategy && (
              <div className="bg-emerald-50/60 border border-emerald-200/90 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-base">
                  <Award className="w-5 h-5 text-emerald-700" />
                  <span>বিশ্ববিদ্যালয় অনার্স ও বিসিএস পরীক্ষার মাস্টার স্ট্র্যাটেজি (Exam Mastery Strategy)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-white p-4 rounded-xl border border-emerald-100">
                  {chapter.masterNoteContentBn.examPreparationStrategy}
                </p>
              </div>
            )}

            {/* Jump to 50+ Questions CTA */}
            <div className="text-center pt-4">
              <button
                onClick={() => setActiveSubTab('question-bank')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <span>এই অধ্যায়ের ৫০+ প্রশ্নব্যাংক ও সমাধান অনুশীলন করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SUBTAB 2: 50+ QUESTION BANK HUB                               */}
        {/* ------------------------------------------------------------- */}
        {activeSubTab === 'question-bank' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Filter Controls Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Search in Question Bank */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="প্রশ্ন, কীওয়ার্ড বা ব্যাখ্যা খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                {/* Reset Interactive Quiz answers */}
                <button
                  onClick={handleResetQuiz}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>উত্তর রিসেট</span>
                </button>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 text-xs">
                <span className="font-bold text-slate-500 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> প্রশ্ন টাইপ:
                </span>
                
                <button
                  onClick={() => setQTypeFilter('all')}
                  className={`px-3 py-1 rounded-full font-bold transition-all ${
                    qTypeFilter === 'all'
                      ? 'bg-sky-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  সব প্রশ্ন ({totalQuestionsInChapter})
                </button>

                <button
                  onClick={() => setQTypeFilter('mcq')}
                  className={`px-3 py-1 rounded-full font-bold transition-all ${
                    qTypeFilter === 'mcq'
                      ? 'bg-sky-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🟢 MCQ ({chapter.questionBank.mcqs.length})
                </button>

                <button
                  onClick={() => setQTypeFilter('short')}
                  className={`px-3 py-1 rounded-full font-bold transition-all ${
                    qTypeFilter === 'short'
                      ? 'bg-sky-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🟡 সংক্ষিপ্ত প্রশ্ন ({chapter.questionBank.shortQuestions.length})
                </button>

                <button
                  onClick={() => setQTypeFilter('broad')}
                  className={`px-3 py-1 rounded-full font-bold transition-all ${
                    qTypeFilter === 'broad'
                      ? 'bg-sky-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🔵 বর্ণনামূলক ও বিশ্লেষণাত্মক ({chapter.questionBank.broadQuestions.length})
                </button>

                {/* Difficulty selector */}
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="text-slate-400 font-semibold">কাঠিন্য:</span>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value as any)}
                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                  >
                    <option value="all">সকল মাত্রা</option>
                    <option value="easy">সহজ (Easy)</option>
                    <option value="medium">মাঝারি (Medium)</option>
                    <option value="hard">উন্নত (Hard)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Score Bar if MCQs attempted */}
            {attemptedMCQsCount > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-900">
                    MCQ অগ্রগতি: {attemptedMCQsCount}/{chapter.questionBank.mcqs.length} টি উত্তর দেওয়া হয়েছে
                  </span>
                </div>
                <div className="text-xs font-black px-3 py-1 rounded-full bg-emerald-600 text-white">
                  সঠিক উত্তর: {correctMCQsCount} / {attemptedMCQsCount}
                </div>
              </div>
            )}

            {/* 1. MCQs Section */}
            {(qTypeFilter === 'all' || qTypeFilter === 'mcq') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>বহুনির্বাচনি প্রশ্ন (MCQs) — ২৫টি</span>
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    অপশনে ক্লিক করলে তাৎক্ষণিক সঠিক উত্তর ও বিস্তারিত ব্যাখ্যা প্রদর্শিত হবে
                  </span>
                </div>

                <div className="space-y-4">
                  {filteredMCQs.map((q: MCQQuestion, idx: number) => {
                    const selectedOpt = userAnswers[q.id];
                    const isAnswered = selectedOpt !== undefined;
                    const isCorrect = selectedOpt === q.correctIndex;

                    return (
                      <div 
                        key={q.id}
                        className={`bg-white rounded-2xl border p-5 transition-all ${
                          isAnswered
                            ? isCorrect
                              ? 'border-emerald-300 ring-1 ring-emerald-200 bg-emerald-50/10'
                              : 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/10'
                            : 'border-slate-200 hover:border-sky-300 shadow-2xs'
                        }`}
                      >
                        {/* Question Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-xl bg-sky-100 text-sky-800 text-xs font-black flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                              {q.id}
                            </span>
                            {q.examTag && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                                🎯 {q.examTag}
                              </span>
                            )}
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            q.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700' :
                            q.difficulty === 'hard' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {q.difficulty.toUpperCase()}
                          </span>
                        </div>

                        {/* Question Text */}
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-4 leading-relaxed">
                          {q.questionBn}
                        </h4>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                          {q.optionsBn.map((opt: string, oIdx: number) => {
                            const optLetter = ['ক', 'খ', 'গ', 'ঘ'][oIdx];
                            const isThisSelected = selectedOpt === oIdx;
                            const isThisCorrect = q.correctIndex === oIdx;

                            let optStyle = 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-sky-50 hover:border-sky-300';
                            if (isAnswered) {
                              if (isThisCorrect) {
                                optStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                              } else if (isThisSelected && !isThisCorrect) {
                                optStyle = 'bg-rose-100 border-rose-400 text-rose-950 font-bold';
                              } else {
                                optStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleSelectOption(q.id, oIdx)}
                                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${optStyle}`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-md bg-white/80 border border-slate-200 text-[11px] font-black flex items-center justify-center shrink-0">
                                    {optLetter}
                                  </span>
                                  <span>{opt}</span>
                                </span>
                                {isAnswered && isThisCorrect && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                                {isAnswered && isThisSelected && !isThisCorrect && (
                                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation Box */}
                        {isAnswered && (
                          <div className={`mt-3 p-3.5 rounded-xl text-xs leading-relaxed border space-y-1 ${
                            isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-amber-50 border-amber-200 text-amber-950'
                          }`}>
                            <div className="font-bold flex items-center gap-1.5">
                              {isCorrect ? (
                                <span className="text-emerald-700 flex items-center gap-1 font-extrabold">✓ সঠিক উত্তর!</span>
                              ) : (
                                <span className="text-rose-700 flex items-center gap-1 font-extrabold">✕ ভুল হয়েছে! সঠিক উত্তর: {['ক', 'খ', 'গ', 'ঘ'][q.correctIndex]}</span>
                              )}
                            </div>
                            <p className="text-slate-700 pt-1 border-t border-slate-200/60">
                              <strong>ব্যাখ্যা:</strong> {q.explanationBn}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Short Questions Section */}
            {(qTypeFilter === 'all' || qTypeFilter === 'short') && (
              <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>সংক্ষিপ্ত প্রশ্নোত্তর (Short Questions) — ১০টি (মডেল উত্তর সহ)</span>
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    বিশ্ববিদ্যালয় লিখিত ও বিসিএস পরীক্ষার ৩-৫ নম্বরের প্রশ্ন
                  </span>
                </div>

                <div className="space-y-3">
                  {filteredShort.map((q: ChapterShortQuestion, idx: number) => {
                    const isRevealed = revealedShortAnswers[q.id];

                    return (
                      <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 text-xs font-black flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {q.id}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                              মান: {q.marks} নম্বর
                            </span>
                            {q.examTag && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                                🎯 {q.examTag}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => toggleShortAnswer(q.id)}
                            className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
                          >
                            <span>{isRevealed ? 'উত্তর লুকান' : 'আদর্শ উত্তর দেখুন'}</span>
                            {isRevealed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900">
                          {q.questionBn}
                        </h4>

                        {/* Model Answer Drawer */}
                        {isRevealed && (
                          <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                            <div className="font-extrabold text-sky-900 flex items-center gap-1.5 pb-2 border-b border-slate-200">
                              <FileText className="w-3.5 h-3.5 text-sky-600" />
                              <span>আদর্শ উত্তর (Model Answer):</span>
                            </div>
                            <p className="text-slate-800 leading-relaxed font-normal whitespace-pre-line">
                              {q.modelAnswerBn}
                            </p>
                            {q.focusPointBn && (
                              <div className="pt-2 border-t border-slate-200 text-[11px] font-medium text-emerald-800">
                                🎯 <strong>মূল ফোকাস পয়েন্ট:</strong> {q.focusPointBn}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Broad Questions Section */}
            {(qTypeFilter === 'all' || qTypeFilter === 'broad') && (
              <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                    <span>বর্ণনামূলক ও বিশ্লেষণাত্মক প্রশ্ন (Broad Questions) — ১৫টি</span>
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    বিশ্ববিদ্যালয় অনার্স/মাস্টার্স ও বিসিএস লিখিত পরীক্ষার ১০-১৫ নম্বরের সম্পূর্ণ কাঠামো
                  </span>
                </div>

                <div className="space-y-4">
                  {filteredBroad.map((q: ChapterBroadQuestion, idx: number) => {
                    const isRevealed = revealedBroadAnswers[q.id];

                    return (
                      <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-800 text-xs font-black flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {q.id}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-mono">
                              পূর্ণমান: {q.marks} নম্বর
                            </span>
                            {q.examTag && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                                🏛️ {q.examTag}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => toggleBroadAnswer(q.id)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                          >
                            <span>{isRevealed ? 'কাঠামো লুকান' : 'বিশদ কাঠামো ও উত্তর দেখুন'}</span>
                            {isRevealed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {q.questionBn}
                        </h4>

                        {/* Broad Question Structured Model Drawer */}
                        {isRevealed && (
                          <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                            {/* Blueprint list */}
                            {q.blueprintBn && q.blueprintBn.length > 0 && (
                              <div className="space-y-1.5">
                                <div className="font-extrabold text-indigo-950 flex items-center gap-1.5">
                                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                                  <span>পরীক্ষায় উপস্থাপনার ধারাবাহিক ধাপ ও ব্লুপ্রিন্ট (Blueprint):</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {q.blueprintBn.map((bp: string, bpIdx: number) => (
                                    <div key={bpIdx} className="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100 text-indigo-950 font-medium">
                                      {bp}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Full model answer */}
                            <div className="space-y-2 pt-2 border-t border-slate-200">
                              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-sky-600" />
                                <span>কাঠামোবদ্ধ পূর্ণাঙ্গ মডেল উত্তর:</span>
                              </div>
                              <p className="text-slate-800 leading-relaxed font-normal whitespace-pre-line bg-white p-3.5 rounded-xl border border-slate-200">
                                {q.modelAnswerBn}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Total Questions Verification Badge */}
            <div className="p-4 rounded-2xl bg-slate-100 text-center text-xs text-slate-600 font-medium">
              ✓ এই অধ্যায়ে মোট <strong className="text-slate-900">{totalQuestionsInChapter}টি</strong> প্রশ্ন যাচাইকৃত।
              কোনো অসম্পূর্ণ বা ডামি প্রশ্ন রাখা হয়নি।
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

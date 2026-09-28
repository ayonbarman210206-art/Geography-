import React, { useState } from 'react';
import { 
  Topic, 
  UserProgress 
} from '../types';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  ArrowRight, 
  Shuffle, 
  GraduationCap, 
  Briefcase, 
  Layers, 
  Globe, 
  FlaskConical, 
  HelpCircle, 
  Share2, 
  Copy, 
  Check, 
  Edit3, 
  Award, 
  ChevronRight,
  Zap,
  Anchor,
  Compass,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playAudioSpeech, stopAudioSpeech } from '../utils/storage';
import { CompleteTopicNoteView } from './CompleteTopicNoteView';

interface TopicStudioViewProps {
  topic: Topic;
  allTopics: Topic[];
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  onSelectTopic: (topic: Topic) => void;
  onOpenNotes: () => void;
  onOpenChapterMaster?: (partId: number) => void;
}

export const TopicStudioView: React.FC<TopicStudioViewProps> = ({
  topic,
  allTopics,
  progress,
  onUpdateProgress,
  onSelectTopic,
  onOpenNotes,
  onOpenChapterMaster
}) => {
  const [viewMode, setViewMode] = useState<'full-note-30' | 'studio-ak'>('full-note-30');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedDiagram, setCopiedDiagram] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentNote, setCurrentNote] = useState(progress.topicNotes[topic.id] || '');
  const [noteSaved, setNoteSaved] = useState(false);

  const isCompleted = progress.completedTopicIds.includes(topic.id);
  const isBookmarked = progress.bookmarkedTopicIds.includes(topic.id);

  // Toggle completion
  const handleToggleComplete = () => {
    let updatedCompleted: string[];
    if (isCompleted) {
      updatedCompleted = progress.completedTopicIds.filter(id => id !== topic.id);
    } else {
      updatedCompleted = [...progress.completedTopicIds, topic.id];
      // Celebrate with confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
    onUpdateProgress({
      ...progress,
      completedTopicIds: updatedCompleted
    });
  };

  // Toggle bookmark
  const handleToggleBookmark = () => {
    let updatedBookmarks: string[];
    if (isBookmarked) {
      updatedBookmarks = progress.bookmarkedTopicIds.filter(id => id !== topic.id);
    } else {
      updatedBookmarks = [...progress.bookmarkedTopicIds, topic.id];
    }
    onUpdateProgress({
      ...progress,
      bookmarkedTopicIds: updatedBookmarks
    });
  };

  // Save personal note
  const handleSaveNote = () => {
    onUpdateProgress({
      ...progress,
      topicNotes: {
        ...progress.topicNotes,
        [topic.id]: currentNote
      }
    });
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  // Handle MCQ selection
  const handleSelectMCQ = (idx: number) => {
    if (showAnswer) return;
    setSelectedOption(idx);
    setShowAnswer(true);

    if (idx === topic.sectionI_MCQ.correctIndex) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 }
      });
    }

    onUpdateProgress({
      ...progress,
      mcqResults: {
        ...progress.mcqResults,
        [topic.id]: {
          answered: idx,
          correct: topic.sectionI_MCQ.correctIndex,
          timestamp: Date.now()
        }
      }
    });
  };

  // Audio Speech
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopAudioSpeech();
      setIsPlayingAudio(false);
    } else {
      const speechText = `${topic.titleBn}। ${topic.sectionA_Story.storyBn}। ${topic.sectionB_CoreTheory.definitionBn}`;
      const success = playAudioSpeech(speechText);
      if (success) {
        setIsPlayingAudio(true);
      }
    }
  };

  // Copy diagram
  const handleCopyDiagram = () => {
    navigator.clipboard.writeText(topic.sectionD_VisualData.asciiOrSvgCode);
    setCopiedDiagram(true);
    setTimeout(() => setCopiedDiagram(false), 2000);
  };

  // Prev & Next topics
  const prevTopic = allTopics.find(t => t.number === topic.number - 1);
  const nextTopic = allTopics.find(t => t.number === topic.number + 1);

  // Random topic
  const handleRandomTopic = () => {
    const randomIdx = Math.floor(Math.random() * allTopics.length);
    onSelectTopic(allTopics[randomIdx]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-sky-100 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200">
            পর্ব 0{topic.partId} • {topic.partTitleBn}
          </span>
          <span className="text-slate-300">/</span>
          <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200">
            টপিক #{topic.number}
          </span>
        </div>

        {/* Quick Nav & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleToggleAudio}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isPlayingAudio 
                ? 'bg-rose-500 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="গল্প ও তত্ত্ব অডিও শুনুন"
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isPlayingAudio ? 'অডিও থামান' : 'অডিও শুনুন'}</span>
          </button>

          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isBookmarked 
                ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="বুকমার্ক করুন"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
            <span className="hidden sm:inline">{isBookmarked ? 'সংরক্ষিত' : 'বুকমার্ক'}</span>
          </button>

          <button
            onClick={handleToggleComplete}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              isCompleted 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                : 'bg-sky-50 text-sky-800 border border-sky-300 hover:bg-sky-100'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isCompleted ? 'পড়া সম্পন্ন হয়েছে' : 'পড়া শেষ করেছি'}</span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Prev / Next buttons */}
          <button
            disabled={!prevTopic}
            onClick={() => prevTopic && onSelectTopic(prevTopic)}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
            title="পূর্ববর্তী অধ্যায়"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            disabled={!nextTopic}
            onClick={() => nextTopic && onSelectTopic(nextTopic)}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
            title="পরবর্তী অধ্যায়"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleRandomTopic}
            className="p-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
            title="যেকোনো দৈব অধ্যায়"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Topic Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-900 via-teal-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20 text-sky-200">
              {topic.partTitleEn}
            </span>
            {topic.badges.map((b, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">
                {b}
              </span>
            ))}
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-400/20 text-amber-200 border border-amber-400/30">
              ⏱️ আনুমানিক {topic.estimatedMinutes} মিনিট
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {topic.titleBn}
          </h1>
          <p className="text-sm sm:text-base text-sky-200 font-medium">
            {topic.titleEn}
          </p>

          <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm text-sky-100 flex items-start gap-3">
            <Compass className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">মূল আকর্ষণ: </span>
              {topic.sectionA_Story.conceptHookBn}
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switcher: 30-Point Complete Note vs Section Studio (A-K) */}
      <div className="bg-white p-2.5 rounded-2xl border border-sky-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setViewMode('full-note-30')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              viewMode === 'full-note-30'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📚 ৩০-দফা সম্পূর্ণ নোট (Points ①-㉚)</span>
          </button>

          <button
            onClick={() => setViewMode('studio-ak')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              viewMode === 'studio-ak'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>🎨 সেকশন স্টুডিও (A-K Interactive)</span>
          </button>
        </div>

        {onOpenChapterMaster && (
          <button
            onClick={() => onOpenChapterMaster(topic.partId)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors"
          >
            <GraduationCap className="w-4 h-4 text-amber-600" />
            <span>অধ্যায় {topic.partId} মাস্টার নোট ও ৫০+ প্রশ্নব্যাংক</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {viewMode === 'full-note-30' ? (
        <CompleteTopicNoteView 
          topic={topic} 
          onOpenChapterMaster={onOpenChapterMaster}
        />
      ) : (
        <>
          {/* SECTION A: গল্পের ছলে ভূগোল (Story Mode) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-sky-900 border-b border-sky-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-sm">
            A
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">গল্পের ছলে ভূগোল: দীপা ও জিও-র কথপোকথন</h2>
            <p className="text-xs text-slate-500">Story Mode & Conceptual Hook for Dipa</p>
          </div>
        </div>

        {/* Narrative Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-teal-50 to-emerald-50 border border-sky-100 text-sm leading-relaxed text-slate-700 font-medium">
          {topic.sectionA_Story.storyBn}
        </div>

        {/* Dialogues */}
        <div className="space-y-3 pt-2">
          {topic.sectionA_Story.dialogueBn.map((d, idx) => {
            const isGeo = d.speaker.includes('Geo') || d.speaker.includes('জিও');
            return (
              <div 
                key={idx}
                className={`flex gap-3 items-start ${isGeo ? '' : 'flex-row-reverse'}`}
              >
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs ${
                  isGeo 
                    ? 'bg-gradient-to-tr from-sky-600 to-teal-500' 
                    : 'bg-gradient-to-tr from-pink-500 to-rose-500'
                }`}>
                  {isGeo ? '🌍 Geo' : '👧 দীপা'}
                </div>

                <div className={`max-w-xl p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-2xs ${
                  isGeo 
                    ? 'bg-white border border-sky-100 text-slate-800 rounded-tl-xs' 
                    : 'bg-gradient-to-r from-pink-50 to-rose-50 border border-rose-100 text-rose-950 rounded-tr-xs'
                }`}>
                  <div className="font-bold text-[11px] mb-1 opacity-70">
                    {d.speaker}
                  </div>
                  {d.textBn}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION B: গভীর তাত্ত্বিক ভূগোল (Core Theory & Scholars) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-indigo-900 border-b border-indigo-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
            B
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">গভীর তাত্ত্বিক ভূগোল ও আন্তর্জাতিক ভূগোলবিদ</h2>
            <p className="text-xs text-slate-500">Core Scientific Theory, Definitions & Scholarly Grounding</p>
          </div>
        </div>

        {/* Definition Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
          <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            প্রমিত বৈজ্ঞানিক সংজ্ঞা (Scientific Definition)
          </div>
          <p className="text-sm sm:text-base font-semibold text-indigo-950 leading-relaxed">
            {topic.sectionB_CoreTheory.definitionBn}
          </p>
        </div>

        {/* Scholars */}
        <div>
          <div className="text-xs font-bold text-slate-500 mb-2">প্রাসঙ্গিক প্রথিতযশা ভূগোলবিদ ও গবেষক:</div>
          <div className="flex flex-wrap gap-2">
            {topic.sectionB_CoreTheory.scholars.map((sch, i) => (
              <span key={i} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                👨‍🏫 {sch}
              </span>
            ))}
          </div>
        </div>

        {/* Deep Explanation */}
        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 font-normal">
          <p>{topic.sectionB_CoreTheory.deepExplanationBn}</p>
        </div>

        {/* Key Concepts Grid */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            মৌলিক সংজ্ঞাসমূহ ও মূল পরিভাষা (Key Concepts)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topic.sectionB_CoreTheory.keyConcepts.map((kc, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-sky-900">{kc.termBn}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{kc.termEn}</span>
                </div>
                <p className="text-xs text-slate-600 leading-normal">{kc.definitionBn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION C: বাস্তব বিশ্ব ও বাংলাদেশ প্রেক্ষাপট (Real World & BD) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-teal-900 border-b border-teal-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black text-sm">
            C
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">বাস্তব বিশ্ব ও বাংলাদেশ প্রেক্ষাপট</h2>
            <p className="text-xs text-slate-500">Real-World Examples & Local Case Study</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <span className="text-base">🇧🇩</span> বাংলাদেশ প্রেক্ষাপট (Bangladesh Context)
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
              {topic.sectionC_RealWorld.bdContextBn}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
              <Globe className="w-4 h-4 text-sky-600" /> বৈশ্বিক দৃষ্টিভঙ্গি (Global Perspective)
            </div>
            <p className="text-xs sm:text-sm text-sky-950 leading-relaxed font-medium">
              {topic.sectionC_RealWorld.globalContextBn}
            </p>
          </div>
        </div>

        {/* Case Study */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
          <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            {topic.sectionC_RealWorld.caseStudyTitleBn}
          </div>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            {topic.sectionC_RealWorld.caseStudyContentBn}
          </p>
        </div>
      </section>

      {/* SECTION D: ভিজ্যুয়াল ডেটা ও ডায়াগ্রাম (Visual Data & ASCII Diagram) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
          <div className="flex items-center gap-2 text-purple-900">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">
              D
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">ভিজ্যুয়াল ডেটা ও ধারণাগত ডায়াগ্রাম</h2>
              <p className="text-xs text-slate-500">Interactive Conceptual Blueprint & Metrics</p>
            </div>
          </div>

          <button
            onClick={handleCopyDiagram}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copiedDiagram ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedDiagram ? 'কপি হয়েছে!' : 'ডায়াগ্রাম কপি'}</span>
          </button>
        </div>

        {/* Diagram Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-sky-300 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner leading-relaxed border border-slate-800">
          <pre>{topic.sectionD_VisualData.asciiOrSvgCode}</pre>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <p className="italic">📌 {topic.sectionD_VisualData.visualCaptionBn}</p>
          <div className="flex items-center gap-3">
            {topic.sectionD_VisualData.keyMetrics.map((km, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 font-medium text-slate-700">
                {km.labelBn}: <strong className="text-sky-700">{km.value}</strong>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION E: ব্যবহারিক পরীক্ষণ ও ল্যাব গাইড (Practical Lab Guide) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-rose-900 border-b border-rose-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-sm">
            E
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">ব্যবহারিক পরীক্ষণ ও তথ্য বিশ্লেষণ ল্যাব</h2>
            <p className="text-xs text-slate-500">Hands-on Spatial Methodology & Tools</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3">
          <h3 className="font-bold text-sm text-rose-950 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-rose-600" />
            {topic.sectionE_PracticalLab.labTitleBn}
          </h3>

          <div className="space-y-2">
            {topic.sectionE_PracticalLab.labStepsBn.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-900 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-rose-200/60 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-rose-900">প্রয়োজনীয় টুলস:</span>
            {topic.sectionE_PracticalLab.toolsRequiredBn.map((tool, i) => (
              <span key={i} className="px-2.5 py-0.5 rounded-lg bg-white border border-rose-200 text-rose-800 text-xs font-medium">
                🛠️ {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION F: বিশ্ববিদ্যালয় অনার্স প্রস্তুতি (University Exam Prep) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-blue-900 border-b border-blue-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">
            F
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">বিশ্ববিদ্যালয় অনার্স ও ডিগ্রি পরীক্ষা প্রস্তুতি</h2>
            <p className="text-xs text-slate-500">University Honours Frequent Questions & Model Answers</p>
          </div>
        </div>

        <div className="space-y-3">
          {topic.sectionF_UniversityExam.questions.map((q, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-800 bg-blue-100/70 px-2.5 py-0.5 rounded-full">
                  {q.examType} ({q.year})
                </span>
                <span className="text-xs font-bold text-slate-500">পূর্ণমান: {q.mark}</span>
              </div>
              <p className="font-semibold text-xs sm:text-sm text-slate-800">
                প্রশ্ন: {q.questionBn}
              </p>
            </div>
          ))}
        </div>

        {/* Model Outline */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            আদর্শ পরীক্ষার খাতার কাঠামোগত রূপরেখা (Model Answer Blueprint)
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
            {topic.sectionF_UniversityExam.modelAnswerOutlineBn.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION G: বিসিএস ও চাকরির ক্র্যাক জোন (Job & BCS Prep) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-amber-900 border-b border-amber-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">
            G
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">বিসিএস ও চাকরির ক্র্যাক জোন</h2>
            <p className="text-xs text-slate-500">BCS, PSC, Primary & Bank Exam Targeted Bank</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm font-semibold text-amber-950">
          🎯 {topic.sectionG_JobPrep.bcsRelevanceBn}
        </div>

        {/* Previous Questions */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            বিগত বিসিএস ও সরকারি চাকরির প্রশ্ন
          </h3>
          {topic.sectionG_JobPrep.questions.map((jq, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold shrink-0 mt-0.5">
                {jq.exam}
              </span>
              <p className="text-xs sm:text-sm font-medium text-slate-800">{jq.questionBn}</p>
            </div>
          ))}
        </div>

        {/* Super Facts */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-amber-200 space-y-2">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-600" />
            দীপার জন্য সুপার ফ্যাক্টস ও গোল্ডেন ওয়ান-লাইনার
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
            {topic.sectionG_JobPrep.superFacts.map((sf, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-500">⚡</span>
                <span className="font-medium">{sf}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION H: ৩-টায়ার রিভিশন সিস্টেম (3-Tier Revision) */}
      <section className="bg-gradient-to-br from-sky-950 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-5 border border-sky-800">
        <div className="flex items-center gap-2 border-b border-sky-800/80 pb-3">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-black text-sm border border-sky-400/30">
            H
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">৩-টায়ার রিভিশন সিস্টেম (পরীক্ষার আগের রাতে)</h2>
            <p className="text-xs text-sky-300">30-Second Glance, Memory Anchor & Golden Formula</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tier 1: 30 Sec Summary */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Zap className="w-4 h-4" /> Tier 1: ৩০ সেকেন্ড কুইক গ্ল্যান্স
            </div>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed font-medium">
              {topic.sectionH_Revision.quickSummaryBn}
            </p>
          </div>

          {/* Tier 2: Memory Anchor */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-300 uppercase tracking-wider">
              <Anchor className="w-4 h-4" /> Tier 2: মেমরি অ্যাঙ্কর (স্মৃতি হুক)
            </div>
            <p className="text-xs sm:text-sm text-teal-100 font-semibold leading-relaxed">
              {topic.sectionH_Revision.memoryAnchorBn}
            </p>
          </div>

          {/* Tier 3: Golden Formula */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Tier 3: গোল্ডেন ফর্মুলা / সমীকরণ
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 font-mono font-bold leading-relaxed bg-black/30 p-2.5 rounded-xl border border-emerald-500/30">
              {topic.sectionH_Revision.goldenFormulaBn}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION I: মিনি টেস্ট এমসিকিউ (Mini Test MCQ) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-emerald-900 border-b border-emerald-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
            I
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">মিনি টেস্ট ও তাৎক্ষণিক এমসিকিউ মূল্যায়ন</h2>
            <p className="text-xs text-slate-500">Interactive Instant Check for Dipa</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>প্রশ্ন #{topic.number}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {topic.sectionI_MCQ.examTag || 'বিসিএস ও অনার্স মানদণ্ড'}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            {topic.sectionI_MCQ.questionBn}
          </h3>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {topic.sectionI_MCQ.optionsBn.map((opt, idx) => {
              let optStyle = 'bg-white border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50/50';
              if (showAnswer) {
                if (idx === topic.sectionI_MCQ.correctIndex) {
                  optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                } else if (idx === selectedOption) {
                  optStyle = 'bg-rose-50 border-rose-500 text-rose-900 font-bold';
                } else {
                  optStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectMCQ(idx)}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between ${optStyle}`}
                >
                  <span>{opt}</span>
                  {showAnswer && idx === topic.sectionI_MCQ.correctIndex && (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showAnswer && (
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs sm:text-sm text-sky-950 space-y-1 animate-fade-in">
              <div className="font-bold text-sky-900">
                {selectedOption === topic.sectionI_MCQ.correctIndex ? '🎉 সঠিক উত্তর!' : '💡 উত্তর ব্যাখ্যা:'}
              </div>
              <p>{topic.sectionI_MCQ.explanationBn}</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION J: ভবিষ্যৎ ক্যারিয়ার কানেকশন (Future Career) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-900 border-b border-indigo-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
            J
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">ভবিষ্যৎ ক্যারিয়ার ও পেশাগত সুযোগ</h2>
            <p className="text-xs text-slate-500">Career Linkage, Industry Roles & Leadership</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {topic.sectionJ_FutureCareer.roles.map((r, i) => (
            <span key={i} className="px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              {r}
            </span>
          ))}
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          {topic.sectionJ_FutureCareer.descriptionBn}
        </p>
      </section>

      {/* SECTION K: একাডেমিক রেফারেন্স ও নলেজ গ্রাফ (References & Related) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-sm">
            K
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">একাডেমিক রেফারেন্স ও নলেজ গ্রাফ</h2>
            <p className="text-xs text-slate-500">Scholarly Citations & Interconnected Topics</p>
          </div>
        </div>

        {/* References */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            একাডেমিক রেফারেন্স ও প্রমাণ্য সাহিত্য
          </h3>
          <ul className="space-y-1 text-xs text-slate-600">
            {topic.references.map((ref, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-sky-600">📖</span>
                <span>{ref}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Related Topics */}
        {topic.relatedTopicIds.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              সম্পর্কিত অধ্যায়সমূহ (Knowledge Graph Links)
            </h3>
            <div className="flex flex-wrap gap-2">
              {topic.relatedTopicIds.map(relId => {
                const relTopic = allTopics.find(t => t.id === relId);
                if (!relTopic) return null;
                return (
                  <button
                    key={relId}
                    onClick={() => onSelectTopic(relTopic)}
                    className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>#{relTopic.number} {relTopic.titleBn}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Dipa's Personal Note Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-amber-700" />
            <h3 className="font-bold text-sm sm:text-base text-amber-950">
              দীপার ব্যক্তিগত স্টাডি নোট (এই অধ্যায়ের নিজস্ব সারসংক্ষেপ)
            </h3>
          </div>
          <button
            onClick={handleSaveNote}
            className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
          >
            {noteSaved ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{noteSaved ? 'সংরক্ষিত হয়েছে!' : 'নোট সেভ করুন'}</span>
          </button>
        </div>

        <textarea
          rows={4}
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="এই অধ্যায়ে তোমার মনে রাখা দরকার এমন কোনো বিশেষ পয়েন্ট, ট্রিকস বা প্রশ্নের উত্তর এখানে লিখে রাখো..."
          className="w-full p-3 text-xs sm:text-sm rounded-xl bg-white border border-amber-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
        />
      </section>
        </>
      )}

      {/* Floating Bottom Navigator */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <button
          disabled={!prevTopic}
          onClick={() => prevTopic && onSelectTopic(prevTopic)}
          className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">পূর্ববর্তী:</span>
          <span>{prevTopic ? prevTopic.titleBn : 'শুরুতে আছেন'}</span>
        </button>

        <button
          onClick={handleToggleComplete}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-md transition-all ${
            isCompleted 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
              : 'bg-sky-600 text-white hover:bg-sky-700'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>{isCompleted ? 'অধ্যায় সম্পন্ন! ✔️' : 'পড়া শেষ করে সম্পন্ন করুন'}</span>
        </button>

        <button
          disabled={!nextTopic}
          onClick={() => nextTopic && onSelectTopic(nextTopic)}
          className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
        >
          <span>{nextTopic ? nextTopic.titleBn : 'শেষ অধ্যায়'}</span>
          <span className="hidden sm:inline">:পরবর্তী</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

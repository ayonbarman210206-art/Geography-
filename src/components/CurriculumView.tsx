import React, { useState } from 'react';
import { Topic, PartId, UserProgress } from '../types';
import { PARTS_META } from '../data/curriculumMeta';
import { 
  Compass, 
  Search, 
  CheckCircle, 
  Bookmark, 
  Clock, 
  ArrowRight, 
  Filter, 
  Sparkles,
  BookOpen,
  Award
} from 'lucide-react';

interface CurriculumViewProps {
  allTopics: Topic[];
  progress: UserProgress;
  onSelectTopic: (topic: Topic) => void;
  onNavigateToStudio: () => void;
  onOpenChapterMaster?: (partId: number) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  allTopics,
  progress,
  onSelectTopic,
  onNavigateToStudio,
  onOpenChapterMaster
}) => {
  const [selectedPartId, setSelectedPartId] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'unread' | 'bookmarked'>('all');
  const [jumpInput, setJumpInput] = useState('');

  // Filtering topics
  const filteredTopics = allTopics.filter(t => {
    // Part filter
    if (selectedPartId !== 'all' && t.partId !== selectedPartId) {
      return false;
    }

    // Status filter
    const isCompleted = progress.completedTopicIds.includes(t.id);
    const isBookmarked = progress.bookmarkedTopicIds.includes(t.id);
    if (statusFilter === 'completed' && !isCompleted) return false;
    if (statusFilter === 'unread' && isCompleted) return false;
    if (statusFilter === 'bookmarked' && !isBookmarked) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBn = t.titleBn.toLowerCase().includes(q);
      const matchEn = t.titleEn.toLowerCase().includes(q);
      const matchPart = t.partTitleBn.toLowerCase().includes(q);
      const matchNum = String(t.number) === q.trim() || `টপিক ${t.number}`.includes(q.trim());
      if (!matchBn && !matchEn && !matchPart && !matchNum) return false;
    }

    return true;
  });

  // Handle direct topic jump
  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpInput, 10);
    if (!isNaN(num) && num >= 1 && num <= 147) {
      const found = allTopics.find(t => t.number === num);
      if (found) {
        onSelectTopic(found);
        onNavigateToStudio();
      }
    }
  };

  const completedCount = progress.completedTopicIds.length;
  const percentage = Math.round((completedCount / allTopics.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-800 via-teal-800 to-indigo-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="absolute right-0 bottom-0 opacity-15 w-96 h-96 bg-[radial-gradient(circle,_#ffffff_10%,_transparent_20%)] bg-[length:24px_24px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>দীপা ভূগোল মহাবিশ্ব • সম্পূর্ণ ১০টি পর্ব ও ১৪৭টি অধ্যায়</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            স্বাগতম দীপা! ভূগোলের অপার মহাবিশ্বে তোমার রাজকীয় জ্ঞানযাত্রা
          </h1>

          <p className="text-xs sm:text-sm text-sky-100 font-medium leading-relaxed">
            পৃথিবীর উৎপত্তি থেকে শুরু করে জলবায়ু, সমুদ্রস্রোত, জনসংখ্যা, বাংলাদেশ ভূগোল, জিআইএস ও আধুনিক বিসিএস প্রস্তুতি—সবকিছুই সাজানো হয়েছে গল্পের ছলে, গভীর তত্ত্বে ও পরীক্ষার নিখুঁত কৌশলে।
          </p>

          {/* Quick Jump and Stats */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <form onSubmit={handleJump} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="147"
                placeholder="অধ্যায় নম্বর (১-১৪৭)..."
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                className="w-44 px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-sky-200/60 focus:bg-white focus:text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all font-semibold"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs sm:text-sm font-black transition-colors shadow-xs"
              >
                যাও 🚀
              </button>
            </form>

            <div className="flex items-center gap-3 text-xs font-semibold text-sky-200">
              <span>মোট সম্পন্ন: <strong className="text-white font-extrabold">{completedCount} / 147</strong> ({percentage}%)</span>
              <span>•</span>
              <span>বুকমার্ক: <strong className="text-white font-extrabold">{progress.bookmarkedTopicIds.length}টি</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Part Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-sky-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> পর্ব অনুযায়ী ব্রাউজ করুন (১০টি প্রধান পর্ব)
          </span>
          <span className="text-xs text-sky-700 font-bold">
            প্রদর্শিত হচ্ছে: {filteredTopics.length}টি অধ্যায়
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedPartId('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedPartId === 'all'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            সব পর্ব (১৪৭)
          </button>

          {PARTS_META.map(part => {
            const partTopics = allTopics.filter(t => t.partId === part.id);
            const partCompleted = partTopics.filter(t => progress.completedTopicIds.includes(t.id)).length;
            const isSelected = selectedPartId === part.id;

            return (
              <button
                key={part.id}
                onClick={() => setSelectedPartId(part.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-700 text-white shadow-xs'
                    : 'bg-sky-50 text-sky-900 border border-sky-100 hover:bg-sky-100'
                }`}
              >
                <span>{part.badgeEmoji}</span>
                <span>পর্ব 0{part.id}: {part.titleBn.split('(')[0].trim()}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-sky-200/60 text-sky-800'
                }`}>
                  {partCompleted}/{part.totalTopics}
                </span>
              </button>
            );
          })}
        </div>

        {/* Chapter Master Note & 50+ Question Bank Quick Banner */}
        {onOpenChapterMaster && (
          <div className="bg-gradient-to-r from-sky-900 to-indigo-950 text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 font-bold shrink-0">
                📖
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5">
                  <span>{selectedPartId === 'all' ? '১০টি প্রধান অধ্যায়ের পূর্ণাঙ্গ মাস্টার নোট ও ৫০+ প্রশ্নব্যাংক হাব' : `পর্ব 0${selectedPartId}-এর সম্পূর্ণ মাস্টার নোট ও ৫০+ প্রশ্নব্যাংক`}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-400/30">
                    ৫০০+ প্রশ্ন
                  </span>
                </div>
                <p className="text-[11px] text-sky-200">
                  {selectedPartId === 'all' ? 'আন্তঃসংযুক্ত বিশ্লেষণ, ASCII ডায়াগ্রাম, বিশ্ববিদ্যালয় লিখিত ও বিসিএস মডেল উত্তর' : `এই পর্বের সকল টপিকের আন্তঃসংযুক্ত বিশ্লেষণ ও ২৫ MCQ, ১০ সংক্ষিপ্ত, ১৫ বর্ণনামূলক প্রশ্ন`}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenChapterMaster(selectedPartId === 'all' ? 1 : selectedPartId)}
              className="px-4 py-2 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-900 flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              <span>{selectedPartId === 'all' ? 'মাস্টার নোট ও প্রশ্নব্যাংকে প্রবেশ করুন' : `পর্ব 0${selectedPartId} মাস্টার নোট ও প্রশ্ন`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Status Filters & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              সকল
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'completed'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              সম্পন্ন ({progress.completedTopicIds.length})
            </button>
            <button
              onClick={() => setStatusFilter('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'unread'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              বাকি আছে ({allTopics.length - progress.completedTopicIds.length})
            </button>
            <button
              onClick={() => setStatusFilter('bookmarked')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'bookmarked'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              বুকমার্ক ({progress.bookmarkedTopicIds.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="অধ্যায়ের নাম বা কী-ওয়ার্ড..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTopics.map(topic => {
          const isCompleted = progress.completedTopicIds.includes(topic.id);
          const isBookmarked = progress.bookmarkedTopicIds.includes(topic.id);
          const hasNote = Boolean(progress.topicNotes[topic.id]);

          return (
            <div
              key={topic.id}
              onClick={() => {
                onSelectTopic(topic);
                onNavigateToStudio();
              }}
              className={`group relative p-5 rounded-3xl border transition-all cursor-pointer hover:shadow-lg flex flex-col justify-between ${
                isCompleted 
                  ? 'bg-emerald-50/30 border-emerald-200 hover:border-emerald-300' 
                  : 'bg-white border-slate-200/80 hover:border-sky-300'
              }`}
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-sky-100 group-hover:bg-sky-600 group-hover:text-white transition-colors text-sky-800 text-xs font-black flex items-center justify-center">
                      #{topic.number}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      পর্ব 0{topic.partId}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isBookmarked && (
                      <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs" title="বুকমার্ক করা">
                        <Bookmark className="w-3.5 h-3.5 fill-amber-600" />
                      </span>
                    )}
                    {hasNote && (
                      <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs" title="ব্যক্তিগত নোট সংরক্ষিত">
                        📝
                      </span>
                    )}
                    {isCompleted && (
                      <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs" title="সম্পন্ন">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-1">
                    {topic.titleBn}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium line-clamp-1">
                    {topic.titleEn}
                  </p>
                </div>

                {/* Concept snippet */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {topic.sectionB_CoreTheory.definitionBn}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{topic.estimatedMinutes} মি.</span>
                </div>

                <div className="flex items-center gap-1 font-bold text-sky-600 group-hover:translate-x-0.5 transition-transform">
                  <span>অধ্যয়ন করুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTopics.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">কোনো অধ্যায় খুঁজে পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500">আপনার ফিল্টার বা সার্চ কোয়ারি পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
          <button
            onClick={() => {
              setSelectedPartId('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      )}

    </div>
  );
};

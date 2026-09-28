import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  BookOpen, 
  FlaskConical, 
  Target, 
  Award, 
  Calendar, 
  FileText, 
  Sparkles, 
  Flame,
  X,
  Layers,
  GraduationCap
} from 'lucide-react';
import { Topic } from '../types';

export type ActiveTab = 'curriculum' | 'studio' | 'chapter-notes' | 'lab' | 'job' | 'quiz' | 'planner' | 'achievements' | 'notebook';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  completedCount: number;
  totalTopics: number;
  streakDays: number;
  allTopics: Topic[];
  onSelectTopic: (topic: Topic) => void;
  bookmarkedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  completedCount,
  totalTopics,
  streakDays,
  allTopics,
  onSelectTopic,
  bookmarkedCount
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const percentage = Math.round((completedCount / totalTopics) * 100);

  const searchResults = searchQuery.trim() ? allTopics.filter(t => 
    t.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.partTitleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.partTitleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(t.number) === searchQuery.trim() ||
    `টপিক ${t.number}`.includes(searchQuery.trim())
  ).slice(0, 8) : [];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      {/* Top Banner & Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Characters */}
          <div 
            onClick={() => onTabChange('curriculum')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-teal-500 to-emerald-400 p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center text-white">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-sky-700 via-teal-700 to-indigo-800 bg-clip-text text-transparent">
                  DIPA GEOGRAPHY UNIVERSE
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ১৪৭ অধ্যায়
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:flex items-center gap-1 font-medium">
                <span className="text-amber-500">✨ দীপা ও জিও-র সার্বিক ভূগোল বিশ্ব</span>
                <span>•</span>
                <span>বিশ্ববিদ্যালয় অনার্স ও বিসিএস প্রস্তুতি</span>
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 max-w-xs sm:max-w-sm hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="১৪৭টি অধ্যায়ের যেকোনো টপিক বা নম্বর খুঁজুন..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm rounded-xl border border-sky-200 bg-sky-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsSearchOpen(false)}
                />
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-sky-100 py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    টপিক ফলাফল ({searchResults.length})
                  </div>
                  {searchResults.map(topic => (
                    <div
                      key={topic.id}
                      onClick={() => {
                        onSelectTopic(topic);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="px-3 py-2.5 hover:bg-sky-50 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center">
                          {topic.number}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-800">{topic.titleBn}</div>
                          <div className="text-[11px] text-slate-500">{topic.titleEn} • {topic.partTitleBn}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                        {topic.badges[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* User Progress & Badges */}
          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            <div 
              onClick={() => onTabChange('planner')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 cursor-pointer hover:bg-orange-100 transition-colors"
              title="দৈনিক পড়ার স্ট্রিক"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span className="text-xs font-bold text-orange-800">{streakDays} দিন</span>
            </div>

            {/* Overall Progress Gauge */}
            <div 
              onClick={() => onTabChange('achievements')}
              className="flex items-center gap-2 px-3 py-1 rounded-xl bg-sky-50 border border-sky-200 cursor-pointer hover:bg-sky-100 transition-colors"
              title="সিলেবাস সম্পূর্ণতা"
            >
              <div className="w-6 h-6 rounded-full bg-sky-600 text-white text-[10px] font-black flex items-center justify-center">
                {percentage}%
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[11px] font-bold text-sky-900 leading-none">
                  {completedCount}/{totalTopics}
                </div>
                <div className="text-[9px] text-sky-600 font-medium">সম্পন্ন হয়েছে</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 border-t border-slate-100 text-xs font-semibold">
          <button
            onClick={() => onTabChange('curriculum')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'curriculum'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>সিলেবাস মহাবিশ্ব</span>
          </button>

          <button
            onClick={() => onTabChange('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'studio'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>টপিক স্টুডিও</span>
          </button>

          <button
            onClick={() => onTabChange('chapter-notes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'chapter-notes'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>অধ্যায় মাস্টার ও ৫০+ প্রশ্নব্যাংক</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 font-extrabold ml-0.5">
              ৫০০+
            </span>
          </button>

          <button
            onClick={() => onTabChange('lab')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'lab'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>ব্যবহারিক ল্যাব</span>
          </button>

          <button
            onClick={() => onTabChange('job')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'job'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>বিসিএস ক্র্যাক জোন</span>
          </button>

          <button
            onClick={() => onTabChange('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'quiz'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>মক টেস্ট ও কুইজ</span>
          </button>

          <button
            onClick={() => onTabChange('planner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'planner'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>স্টাডি প্ল্যানার</span>
          </button>

          <button
            onClick={() => onTabChange('achievements')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'achievements'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>অর্জন ও সার্টিফিকেট</span>
          </button>

          <button
            onClick={() => onTabChange('notebook')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'notebook'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>দীপার নোটবুক {bookmarkedCount > 0 && `(${bookmarkedCount})`}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

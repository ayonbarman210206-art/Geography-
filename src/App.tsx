import React, { useState, useEffect } from 'react';
import { ALL_TOPICS } from './data/curriculum';
import { Topic, UserProgress } from './types';
import { getInitialProgress, saveProgress } from './utils/storage';
import { Navbar, ActiveTab } from './components/Navbar';
import { CurriculumView } from './components/CurriculumView';
import { TopicStudioView } from './components/TopicStudioView';
import { ChapterMasterAndQuestionsView } from './components/ChapterMasterAndQuestionsView';
import { PracticalLabView } from './components/PracticalLabView';
import { JobCrackZoneView } from './components/JobCrackZoneView';
import { QuizMockEngineView } from './components/QuizMockEngineView';
import { StudyPlannerView } from './components/StudyPlannerView';
import { AchievementView } from './components/AchievementView';
import { NotebookView } from './components/NotebookView';
import { Compass, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(getInitialProgress);
  const [activeTab, setActiveTab] = useState<ActiveTab>('curriculum');
  const [selectedTopic, setSelectedTopic] = useState<Topic>(ALL_TOPICS[0]);
  const [selectedChapterId, setSelectedChapterId] = useState<string>('ch-01');

  // Persist progress to local storage
  const handleUpdateProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  // Scroll to top on tab or topic change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, selectedTopic, selectedChapterId]);

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setActiveTab('studio');
  };

  const handleOpenChapterMaster = (partId: number) => {
    const formatted = `ch-${String(partId).padStart(2, '0')}`;
    setSelectedChapterId(formatted);
    setActiveTab('chapter-notes');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans selection:bg-sky-200 selection:text-sky-900 flex flex-col justify-between">
      
      <div>
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          completedCount={progress.completedTopicIds.length}
          totalTopics={ALL_TOPICS.length}
          streakDays={progress.studyStreakDays}
          allTopics={ALL_TOPICS}
          onSelectTopic={handleSelectTopic}
          bookmarkedCount={progress.bookmarkedTopicIds.length}
        />

        {/* Main Content Area */}
        <main className="transition-all duration-300">
          {activeTab === 'curriculum' && (
            <CurriculumView
              allTopics={ALL_TOPICS}
              progress={progress}
              onSelectTopic={setSelectedTopic}
              onNavigateToStudio={() => setActiveTab('studio')}
              onOpenChapterMaster={handleOpenChapterMaster}
            />
          )}

          {activeTab === 'studio' && (
            <TopicStudioView
              topic={selectedTopic}
              allTopics={ALL_TOPICS}
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
              onSelectTopic={setSelectedTopic}
              onOpenNotes={() => setActiveTab('notebook')}
              onOpenChapterMaster={handleOpenChapterMaster}
            />
          )}

          {activeTab === 'chapter-notes' && (
            <ChapterMasterAndQuestionsView
              initialChapterId={selectedChapterId}
              allTopics={ALL_TOPICS}
              onSelectTopic={handleSelectTopic}
              onNavigateToStudio={() => setActiveTab('studio')}
            />
          )}

          {activeTab === 'lab' && (
            <PracticalLabView />
          )}

          {activeTab === 'job' && (
            <JobCrackZoneView />
          )}

          {activeTab === 'quiz' && (
            <QuizMockEngineView
              allTopics={ALL_TOPICS}
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
            />
          )}

          {activeTab === 'planner' && (
            <StudyPlannerView
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
              allTopics={ALL_TOPICS}
              onSelectTopic={handleSelectTopic}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementView
              progress={progress}
              allTopics={ALL_TOPICS}
            />
          )}

          {activeTab === 'notebook' && (
            <NotebookView
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
              allTopics={ALL_TOPICS}
              onSelectTopic={setSelectedTopic}
              onNavigateToStudio={() => setActiveTab('studio')}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200/80 py-8 px-4 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-sky-800 font-extrabold text-sm tracking-tight">
          <Compass className="w-4 h-4 text-sky-600" />
          <span>DIPA GEOGRAPHY UNIVERSE 🌍</span>
        </div>
        <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
          দীপার জন্য নিবেদিত পূর্ণাঙ্গ ভূগোল শিক্ষা, ব্যবহারিক ল্যাব, বিশ্ববিদ্যালয় অনার্স ও বিসিএস পরীক্ষার ওয়ান-স্টপ ডিজিটাল প্ল্যাটফর্ম।
        </p>
        <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <span>মেন্টর জিও (Geo) এবং দীপার যৌথ যাত্রায় তৈরি</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
        </div>
      </footer>

    </div>
  );
}

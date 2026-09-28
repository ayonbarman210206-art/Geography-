import React, { useState } from 'react';
import { UserProgress, Topic } from '../types';
import { 
  FileText, 
  Search, 
  Trash2, 
  ExternalLink, 
  Download, 
  Edit3, 
  Sparkles,
  BookOpen
} from 'lucide-react';

interface NotebookViewProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  allTopics: Topic[];
  onSelectTopic: (topic: Topic) => void;
  onNavigateToStudio: () => void;
}

export const NotebookView: React.FC<NotebookViewProps> = ({
  progress,
  onUpdateProgress,
  allTopics,
  onSelectTopic,
  onNavigateToStudio
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const noteTopicIds = Object.keys(progress.topicNotes).filter(id => Boolean(progress.topicNotes[id]?.trim()));

  const notesList = noteTopicIds.map(id => {
    const topic = allTopics.find(t => t.id === id);
    return {
      topicId: id,
      topic,
      text: progress.topicNotes[id]
    };
  }).filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchText = item.text.toLowerCase().includes(q);
    const matchTitle = item.topic?.titleBn.toLowerCase().includes(q) || item.topic?.titleEn.toLowerCase().includes(q);
    return matchText || matchTitle;
  });

  const handleDeleteNote = (topicId: string) => {
    const updated = { ...progress.topicNotes };
    delete updated[topicId];
    onUpdateProgress({
      ...progress,
      topicNotes: updated
    });
  };

  const handleStartEdit = (topicId: string, currentText: string) => {
    setEditingTopicId(topicId);
    setEditText(currentText);
  };

  const handleSaveEdit = (topicId: string) => {
    onUpdateProgress({
      ...progress,
      topicNotes: {
        ...progress.topicNotes,
        [topicId]: editText
      }
    });
    setEditingTopicId(null);
  };

  const handleExportNotes = () => {
    const content = notesList.map(n => 
      `========================================\nটপিক #${n.topic?.number}: ${n.topic?.titleBn} (${n.topic?.titleEn})\nপর্ব: ${n.topic?.partTitleBn}\n----------------------------------------\n${n.text}\n\n`
    ).join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `দীপা_ভূগোল_স্টাডি_নোটস_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-purple-200">
          <FileText className="w-3.5 h-3.5 text-purple-300" />
          <span>দীপার নিজস্ব ভূগোল নোটবুক</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">
              ব্যক্তিগত স্টাডি নোট ও রিভিশন খাতা
            </h1>
            <p className="text-xs sm:text-sm text-purple-100 max-w-xl font-medium">
              অধ্যায়ভিত্তিক তোমার গুরুত্বপূর্ণ পয়েন্ট, পরীক্ষার জন্য তৈরি শর্টকার্ট এবং একান্ত নোটগুলো এখানে এক জায়গায় সংরক্ষিত থাকবে।
            </p>
          </div>

          {notesList.length > 0 && (
            <button
              onClick={handleExportNotes}
              className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>নোট ফাইল ডাউনলোড (.txt)</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="নোটের ভেতরের শব্দ বা অধ্যায়ের নাম দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
        <span className="text-xs font-bold text-purple-900">
          মোট সংরক্ষিত নোট: {notesList.length}টি
        </span>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {notesList.map(({ topicId, topic, text }) => {
          if (!topic) return null;
          const isEditing = editingTopicId === topicId;

          return (
            <div key={topicId} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 text-xs font-black flex items-center justify-center">
                    #{topic.number}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{topic.titleBn}</h3>
                    <span className="text-[11px] text-slate-500">{topic.partTitleBn}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onSelectTopic(topic);
                      onNavigateToStudio();
                    }}
                    className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold flex items-center gap-1"
                    title="এই অধ্যায়ে যান"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">অধ্যায় খুলুন</span>
                  </button>

                  <button
                    onClick={() => handleStartEdit(topicId, text)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                    title="নোট সম্পাদনা"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteNote(topicId)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
                    title="নোট মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Note Content */}
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    rows={4}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-purple-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingTopicId(null)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      বাতিল
                    </button>
                    <button
                      onClick={() => handleSaveEdit(topicId)}
                      className="px-4 py-1 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700"
                    >
                      সংরক্ষণ করুন
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-slate-700 font-medium whitespace-pre-wrap leading-relaxed bg-purple-50/40 p-3.5 rounded-2xl border border-purple-100/60">
                  {text}
                </p>
              )}
            </div>
          );
        })}

        {notesList.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">কোনো ব্যক্তিগত নোট সংরক্ষিত নেই</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              যেকোনো অধ্যায় পড়ার সময় নিচের "দীপার ব্যক্তিগত স্টাডি নোট" বক্সে লিখে রাখলে তা স্বয়ংক্রিয়ভাবে এখানে জমা হবে!
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

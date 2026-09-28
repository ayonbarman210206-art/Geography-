import { UserProgress } from '../types';

const STORAGE_KEY = 'dipa_geography_universe_progress_v1';

export const getInitialProgress = (): UserProgress => {
  const todayStr = new Date().toISOString().split('T')[0];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check streak continuity
      const lastDate = parsed.lastStudyDate || '';
      let streak = parsed.studyStreakDays || 1;
      if (lastDate && lastDate !== todayStr) {
        const last = new Date(lastDate);
        const today = new Date(todayStr);
        const diffDays = Math.round((today.getTime() - last.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          // Continuous day!
        } else if (diffDays > 1) {
          // Streak broke or reset
          streak = 1;
        }
      }
      return {
        ...parsed,
        studyStreakDays: streak,
        lastStudyDate: todayStr,
        todayTargets: parsed.todayTargets || {
          story: false,
          theory: false,
          practical: false,
          mcq: false,
          revision: false
        }
      };
    }
  } catch {
    // ignore
  }

  return {
    completedTopicIds: [],
    bookmarkedTopicIds: [],
    favoriteTopicIds: [],
    topicNotes: {},
    mcqResults: {},
    studyStreakDays: 3, // starting friendly encouragement
    lastStudyDate: todayStr,
    todayTargets: {
      story: true,
      theory: false,
      practical: false,
      mcq: false,
      revision: false
    },
    dailyTargetDate: todayStr,
    motivationEnabled: true
  };
};

export const saveProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress to localStorage', err);
  }
};

export const playAudioSpeech = (text: string, lang = 'bn-BD') => {
  if (!('speechSynthesis' in window)) {
    return false;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
  return true;
};

export const stopAudioSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

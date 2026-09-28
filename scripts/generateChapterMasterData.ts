import * as fs from 'fs';
import * as path from 'path';

// This script generates the complete ChapterMasterData containing:
// 1. Complete Chapter Master Note (interconnected explanation, ASCII diagrams, thematic pillars, case studies)
// 2. Minimum 50+ questions per chapter:
//    - 25 MCQs (with options, answer index, detailed explanation, exam tags)
//    - 10 Short Questions (with marks, model answers, focus points)
//    - 15 Broad / Conceptual Questions (with marks, blueprint, model answers)
// Exactly 50 questions per chapter × 10 chapters = 500 questions!

interface MCQ {
  id: string;
  questionBn: string;
  optionsBn: [string, string, string, string];
  correctIndex: number;
  explanationBn: string;
  difficulty: 'easy' | 'medium' | 'hard';
  examTag: string;
}

interface ShortQ {
  id: string;
  questionBn: string;
  marks: number;
  modelAnswerBn: string;
  examTag: string;
  focusPointBn: string;
}

interface BroadQ {
  id: string;
  questionBn: string;
  marks: number;
  blueprintBn: string[];
  modelAnswerBn: string;
  examTag: string;
}

interface Chapter {
  chapterNumber: number;
  partId: number;
  titleBn: string;
  titleEn: string;
  badgeEmoji: string;
  icon: string;
  summaryHookBn: string;
  topicsCovered: string[];
  masterNoteContentBn: {
    interconnectedExplanation: string;
    conceptFlowAscii: string;
    thematicPillars: { titleBn: string; descriptionBn: string; keyTerms: string[] }[];
    realWorldCaseStudies: { titleBn: string; contextBn: string; takeawayBn: string }[];
    practicalAndGisLink: string;
    examPreparationStrategy: string;
  };
  questionBank: {
    mcqs: MCQ[];
    shortQuestions: ShortQ[];
    broadQuestions: BroadQ[];
  };
}

console.log('Building Chapter Master Data definitions...');

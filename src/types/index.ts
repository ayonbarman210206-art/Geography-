export type PartId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface MCQQuestion {
  id: string;
  questionBn: string;
  optionsBn: [string, string, string, string];
  correctIndex: number;
  explanationBn: string;
  difficulty: 'easy' | 'medium' | 'hard';
  examTag?: string; // e.g., 'BCS 43th', 'NTRCA 2021', 'University Honours'
}

export interface UniversityQuestion {
  type: 'short' | 'broad' | 'conceptual' | 'difference';
  questionBn: string;
  marks: number;
  modelAnswerBn: string;
}

export interface TopicDialogue {
  speaker: string;
  textBn: string;
}

export interface TopicKeyConcept {
  termBn: string;
  termEn: string;
  definitionBn: string;
}

export interface TopicUniversityQuestion {
  year: string;
  examType: string;
  mark: number;
  questionBn: string;
}

export interface TopicJobQuestion {
  exam: string;
  year?: string;
  questionBn: string;
}

export interface TopicKeyMetric {
  labelBn: string;
  value: string;
}

export interface Topic {
  id: string; // e.g. "P01-T001"
  number: number; // 1 to 147
  partId: PartId;
  partTitleBn: string;
  partTitleEn: string;
  titleBn: string;
  titleEn: string;
  categoryBn: string;
  categoryEn: string;
  estimatedMinutes: number;
  badges: string[];
  icon: string;

  // Section A: Story with Geo & Dipa
  sectionA_Story: {
    storyBn: string;
    dialogueBn: TopicDialogue[];
    characters: string[];
    conceptHookBn: string;
  };

  // Section B: Core Theory & Scholars
  sectionB_CoreTheory: {
    definitionBn: string;
    scholars: string[];
    deepExplanationBn: string;
    keyConcepts: TopicKeyConcept[];
  };

  // Section C: Real World (Bangladesh & Global)
  sectionC_RealWorld: {
    bdContextBn: string;
    globalContextBn: string;
    caseStudyTitleBn: string;
    caseStudyContentBn: string;
  };

  // Section D: Visual / Diagram Data
  sectionD_VisualData: {
    diagramType: string;
    asciiOrSvgCode: string;
    visualCaptionBn: string;
    keyMetrics: TopicKeyMetric[];
  };

  // Section E: Practical Lab Relevance
  sectionE_PracticalLab: {
    labTitleBn: string;
    labStepsBn: string[];
    toolsRequiredBn: string[];
  };

  // Section F: University Exam Prep
  sectionF_UniversityExam: {
    questions: TopicUniversityQuestion[];
    modelAnswerOutlineBn: string[];
  };

  // Section G: Job Prep (BCS, NTRCA, PSC)
  sectionG_JobPrep: {
    bcsRelevanceBn: string;
    questions: TopicJobQuestion[];
    superFacts: string[];
  };

  // Section H: 3-Tier Revision System
  sectionH_Revision: {
    quickSummaryBn: string;
    memoryAnchorBn: string;
    goldenFormulaBn: string;
  };

  // Section I: Mini Test MCQ
  sectionI_MCQ: MCQQuestion;

  // Section J: Future Career Connections
  sectionJ_FutureCareer: {
    roles: string[];
    descriptionBn: string;
  };

  // Section K: Academic References & Knowledge Graph
  references: string[];
  relatedTopicIds: string[];
}

export interface ChapterShortQuestion {
  id: string;
  questionBn: string;
  marks: number;
  modelAnswerBn: string;
  examTag?: string;
  focusPointBn?: string;
}

export interface ChapterBroadQuestion {
  id: string;
  questionBn: string;
  marks: number;
  blueprintBn: string[];
  modelAnswerBn: string;
  examTag?: string;
}

export interface ThematicPillar {
  titleBn: string;
  descriptionBn: string;
  keyTerms: string[];
}

export interface RealWorldCaseStudy {
  titleBn: string;
  contextBn: string;
  takeawayBn: string;
}

export interface ChapterMasterNote {
  id?: string;
  chapterNumber: number; // 1 to 10
  partId: PartId;
  titleBn: string;
  titleEn: string;
  badgeEmoji: string;
  icon: string;
  summaryHookBn: string;
  topicsCovered: string[];
  totalQuestionsCount?: number;
  topicsIncludedCount?: number;
  
  // Interconnected Master Explanation (Multi-topic synthesis)
  masterNoteContentBn: {
    interconnectedExplanation: string;
    conceptFlowAscii: string;
    thematicPillars: ThematicPillar[];
    realWorldCaseStudies: RealWorldCaseStudy[];
    practicalAndGisLink: string;
    examPreparationStrategy: string;
  };

  // Mandatory 50+ Questions Bank
  questionBank: {
    mcqs: MCQQuestion[]; // Minimum 25 questions
    shortQuestions: ChapterShortQuestion[]; // Minimum 10 questions
    broadQuestions: ChapterBroadQuestion[]; // Minimum 15 questions
  };
}

export interface TopicFullNote30 {
  // ① সহজ পরিচিতি
  overviewIntroBn: string;
  // ② গল্পের মাধ্যমে Introduction
  storyIntroBn: string;
  // ③ Academic Definition
  academicDefinitionBn: string;
  // ④ Detailed Explanation
  detailedExplanationBn: string;
  // ⑤ Key Concepts
  keyConcepts: { termBn: string; termEn: string; definitionBn: string }[];
  // ⑥ Classification
  classificationBn: string[];
  // ⑦ Causes
  causesBn: string[];
  // ⑧ Processes
  processesBn: string[];
  // ⑨ Characteristics
  characteristicsBn: string[];
  // ⑩ Effects / Consequences
  effectsConsequencesBn: string[];
  // ⑪ Advantages / Importance
  advantagesImportanceBn: string[];
  // ⑫ Limitations / Problems
  limitationsProblemsBn: string[];
  // ⑬ Real-World Examples
  realWorldExamplesBn: string;
  // ⑭ Bangladesh Examples
  bangladeshExamplesBn: string;
  // ⑮ World Examples
  worldExamplesBn: string;
  // ⑯ Diagram
  diagramAsciiOrSvg: string;
  diagramCaptionBn: string;
  // ⑰ Map
  mapSpatialContextBn: string;
  // ⑱ Comparison Table
  comparisonTable: {
    headers: [string, string, string];
    rows: [string, string, string][];
  };
  // ⑲ Important Terms
  importantTerms: { bangla: string; english: string; meaning: string }[];
  // ⑳ Important Scholars / Scientists
  scholarsScientists: string[];
  // ㉑ Important Dates
  importantDates: { dateOrEpoch: string; eventBn: string }[];
  // ㉒ Practical Application
  practicalApplicationBn: string;
  // ㉓ Geography Practical Connection
  geographyPracticalConnectionBn: string;
  // ㉔ GIS / Remote Sensing Connection
  gisRemoteSensingConnectionBn: string;
  // ㉕ Exam Importance
  examImportanceBn: {
    universityHonours: string;
    frequentQuestions: string[];
  };
  // ㉖ Competitive Exam Importance
  competitiveExamImportanceBn: {
    bcsNtrcaRelevance: string;
    sampleQuestions: string[];
  };
  // ㉗ Quick Revision
  quickRevisionBn: string;
  // ㉘ One-Liner Facts
  oneLinerFactsBn: string[];
  // ㉙ Memory Tricks
  memoryTricksBn: string;
  // ㉚ References
  references: string[];
}


export interface PartMeta {
  id: PartId;
  code: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  icon: string;
  badgeEmoji: string;
  color: string;
  bgColor: string;
  topicStart: number;
  topicEnd: number;
  totalTopics: number;
}

export interface UserProgress {
  completedTopicIds: string[];
  bookmarkedTopicIds: string[];
  favoriteTopicIds: string[];
  topicNotes: Record<string, string>; // topicId -> note text
  mcqResults: Record<string, { answered: number; correct: number; timestamp: number }>;
  studyStreakDays: number;
  lastStudyDate: string; // YYYY-MM-DD
  todayTargets: {
    story: boolean;
    theory: boolean;
    practical: boolean;
    mcq: boolean;
    revision: boolean;
  };
  dailyTargetDate: string;
  motivationEnabled: boolean;
}

export interface MapFeature {
  id: string;
  nameBn: string;
  nameEn: string;
  category: 'mountain' | 'river' | 'desert' | 'strait' | 'canal' | 'ocean' | 'port' | 'physiography' | 'forest';
  region: 'world' | 'bangladesh' | 'south_asia';
  lat: number;
  lng: number;
  descriptionBn: string;
  superFactBn: string;
  bcsSignificanceBn: string;
  relatedTopicId?: string;
}

export interface JobQuestionItem {
  id: string;
  subject: 'World' | 'Bangladesh' | 'Physical' | 'Human & Economic' | 'Map & GIS';
  exam: 'BCS' | 'NTRCA' | 'Bank' | 'Govt' | 'General';
  year?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionBn: string;
  optionsBn: [string, string, string, string];
  correctIndex: number;
  explanationBn: string;
  relatedTopicNumber?: number;
}

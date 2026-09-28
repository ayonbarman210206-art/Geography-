export interface RawTopicMeta {
  num: number;
  part: number;
  titleEn: string;
  titleBn: string;
  categoryBn: string;
  badge: string;
  icon: string;
  scholars: string;
  definition: string;
  storyIntro: string;
  storyCore: string;
  geoQuote: string;
  mechanism: string[];
  examplesGlobal: string[];
  examplesBd: string[];
  visualType: 'diagram' | 'cross-section' | 'table' | 'flowchart' | 'map';
  visualCaption: string;
  examQuestion: string;
  examAnswer: string;
  jobOneLiners: string[];
  superFact: string;
  formula?: string;
  mcqQ: string;
  mcqOptions: [string, string, string, string];
  mcqCorrect: number;
  mcqExpl: string;
  roles: string[];
  careerTools: string[];
  refs: string[];
  relatedNums: number[];
}

import { TOPICS_1_TO_50 } from './masterChunks/chunk1';
import { TOPICS_51_TO_100 } from './masterChunks/chunk2';
import { TOPICS_101_TO_147 } from './masterChunks/chunk3';

export const MASTER_TOPICS_LIST: RawTopicMeta[] = [
  ...TOPICS_1_TO_50,
  ...TOPICS_51_TO_100,
  ...TOPICS_101_TO_147
];

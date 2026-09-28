import * as fs from 'fs';
import * as path from 'path';

// Master definition array of all 147 topics with their authentic names, categories, and core traits
interface RawTopicMeta {
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

import { MASTER_TOPICS_LIST } from './masterCurriculumSource';

console.log(`Loaded ${MASTER_TOPICS_LIST.length} topics from master source.`);

function generateTopicFile(partId: number, topics: RawTopicMeta[]): string {
  const partCode = partId < 10 ? `0${partId}` : `${partId}`;
  
  const topicObjects = topics.map(t => {
    const id = `P${partCode}-T${t.num < 10 ? '0' + t.num : (t.num < 100 ? (t.num < 10 ? '00' : '0') + t.num : t.num)}`;
    const formattedId = `P${partCode}-T${t.num < 10 ? '0' + t.num : (t.num < 100 ? (t.num < 10 ? '00' : '') + t.num : t.num)}`;
    
    // Clean formatted ID like P01-T01, P02-T19, P10-T147
    const finalId = `P${partCode}-T${t.num < 10 ? '0' + t.num : t.num}`;
    
    const relatedIds = t.relatedNums.map(n => {
      // Find part for this number
      const target = MASTER_TOPICS_LIST.find(m => m.num === n);
      const targetPart = target ? target.part : 1;
      const targetPCode = targetPart < 10 ? `0${targetPart}` : `${targetPart}`;
      return `P${targetPCode}-T${n < 10 ? '0' + n : n}`;
    });

    return `  {
    id: '${finalId}',
    number: ${t.num},
    partId: ${t.part} as const,
    partTitleBn: '${t.categoryBn}',
    partTitleEn: '${t.titleEn}',
    titleBn: '${t.titleBn.replace(/'/g, "\\'")}',
    titleEn: '${t.titleEn.replace(/'/g, "\\'")}',
    icon: '${t.icon}',
    badge: '${t.badge.replace(/'/g, "\\'")}',
    estimatedMinutes: 25,
    story: {
      titleBn: '${t.titleBn.replace(/'/g, "\\'")} - ডিপা ও জিও-র গল্পযাত্রা',
      contentBn: '${t.storyIntro.replace(/'/g, "\\'")} ${t.storyCore.replace(/'/g, "\\'")}',
      geoQuoteBn: '${t.geoQuote.replace(/'/g, "\\'")}',
      moralOrInsightBn: '${t.titleBn} অনুধাবন ভূগোলের বাস্তব জগৎ এবং মানুষের সাথে প্রকৃতির মিথস্ক্রিয়া বোঝার এক অনন্য সোপান।'
    },
    theory: {
      definitionBn: '${t.definition.replace(/'/g, "\\'")}',
      scholarsOrOriginBn: '${t.scholars.replace(/'/g, "\\'")}',
      mechanismsBn: [
        ${t.mechanism.map(m => `'${m.replace(/'/g, "\\'")}'`).join(',\n        ')}
      ],
      importanceBn: [
        'ভৌগোলিক পরিবেশ, মানব বসতি ও বৈশ্বিক পরিবর্তন অনুধাবনের ভিত্তি।',
        'বিশ্ববিদ্যালয় পরীক্ষা এবং বিসিএস সহ বিভিন্ন প্রতিযোগিতামূলক পরীক্ষার আবশ্যক বিষয়।'
      ]
    },
    examples: {
      globalBn: [${t.examplesGlobal.map(e => `'${e.replace(/'/g, "\\'")}'`).join(', ')}],
      bangladeshBn: [${t.examplesBd.map(e => `'${e.replace(/'/g, "\\'")}'`).join(', ')}]
    },
    visualData: {
      type: '${t.visualType}',
      titleBn: '${t.titleBn} সম্পর্কিত বিশ্লেষণাত্মক রূপরেখা',
      captionBn: '${t.visualCaption.replace(/'/g, "\\'")}',
      keyPoints: [${t.mechanism.slice(0, 3).map(m => `'${m.split(':')[0].replace(/'/g, "\\'")}'`).join(', ')}]
    },
    practicalRelevance: {
      titleBn: '${t.titleBn} সংক্রান্ত ব্যবহারিক প্রয়োগ ও পর্যবেক্ষণ',
      descriptionBn: 'মাঠ পর্যায়ের জরিপ, তথ্য সংগ্রহ, উপগ্রহ মানচিত্রায়ন ও স্থানিক বিশ্লেষণের মাধ্যমে এর বাস্তব প্রভাব পর্যালোচনা করা হয়।'${t.formula ? `,\n      formulaBn: '${t.formula.replace(/'/g, "\\'")}'` : ''}
    },
    examPrep: {
      frequentQuestions: [
        {
          type: 'broad',
          questionBn: '${t.examQuestion.replace(/'/g, "\\'")}',
          marks: 10,
          modelAnswerBn: '${t.examAnswer.replace(/'/g, "\\'")}'
        }
      ],
      examTipsBn: 'পরীক্ষার খাতায় পয়েন্টভিত্তিক উপস্থাপনের পাশাপাশি প্রাসঙ্গিক রেখাচিত্র ও বাস্তব উদাহরণ যুক্ত করলে সর্বোচ্চ নম্বর পাওয়া যায়।'
    },
    jobRelevance: {
      targetExams: ['BCS', 'NTRCA', 'PSC সহকারী পরিচালক', 'ব্যাংক নিয়োগ পরীক্ষা'],
      oneLinersBn: [
        ${t.jobOneLiners.map(j => `'${j.replace(/'/g, "\\'")}'`).join(',\n        ')}
      ],
      superFactsBn: [
        '${t.superFact.replace(/'/g, "\\'")}'
      ]
    },
    revision: {
      sixtySecBulletsBn: [
        '${t.titleBn} (${t.titleEn}): ${t.definition.slice(0, 75).replace(/'/g, "\\'")}...',
        'মূল কারণ ও উপাদান: ${t.mechanism[0].split(':')[0].replace(/'/g, "\\'")}',
        'পরীক্ষার জন্য সবচেয়ে গুরুত্বপূর্ণ: ${t.jobOneLiners[0].replace(/'/g, "\\'")}'
      ],
      fiveMinSummaryBn: '${t.definition.replace(/'/g, "\\'")} ${t.storyCore.slice(0, 150).replace(/'/g, "\\'")}...',
      fullTheoryKeynotesBn: [
        '${t.scholars.replace(/'/g, "\\'")}',
        '${t.mechanism[0].replace(/'/g, "\\'")}',
        '${t.mechanism[1] ? t.mechanism[1].replace(/'/g, "\\'") : t.definition.slice(0, 50).replace(/'/g, "\\'")}'
      ]
    },
    mcqs: [
      {
        id: 'q${t.num}-1',
        questionBn: '${t.mcqQ.replace(/'/g, "\\'")}',
        optionsBn: [
          '${t.mcqOptions[0].replace(/'/g, "\\'")}',
          '${t.mcqOptions[1].replace(/'/g, "\\'")}',
          '${t.mcqOptions[2].replace(/'/g, "\\'")}',
          '${t.mcqOptions[3].replace(/'/g, "\\'")}'
        ],
        correctIndex: ${t.mcqCorrect},
        explanationBn: '${t.mcqExpl.replace(/'/g, "\\'")}',
        difficulty: 'medium',
        examTag: 'BCS Preliminary'
      }
    ],
    careerConnection: {
      roles: [${t.roles.map(r => `'${r.replace(/'/g, "\\'")}'`).join(', ')}],
      descriptionBn: 'ভূ-স্থানিক গবেষণা, নগর ও পরিবেশ পরিকল্পনা, দুর্যোগ প্রশমন এবং ভৌগোলিক নীতি নির্ধারণে এই জ্ঞান প্রত্যক্ষভাবে উপযোগী।',
      toolsBn: [${t.careerTools.map(tl => `'${tl.replace(/'/g, "\\'")}'`).join(', ')}]
    },
    references: [
      ${t.refs.map(r => `'${r.replace(/'/g, "\\'")}'`).join(',\n      ')}
    ],
    relatedTopicIds: [${relatedIds.map(rid => `'${rid}'`).join(', ')}]
  }`;
  });

  return `import { Topic } from '../../types';

export const PART_${partCode}_TOPICS: Topic[] = [
${topicObjects.join(',\n')}
];
`;
}

// Generate files for Part 01 to Part 10
const partsDir = path.join(__dirname, '../src/data/topics');
if (!fs.existsSync(partsDir)) {
  fs.mkdirSync(partsDir, { recursive: true });
}

for (let p = 1; p <= 10; p++) {
  const partTopics = MASTER_TOPICS_LIST.filter(t => t.part === p);
  const code = p < 10 ? `0${p}` : `${p}`;
  const filePath = path.join(partsDir, `part${code}.ts`);
  const content = generateTopicFile(p, partTopics);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Generated part${code}.ts with ${partTopics.length} topics.`);
}

console.log('Successfully generated all 10 Part files!');

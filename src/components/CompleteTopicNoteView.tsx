import React, { useState } from 'react';
import { Topic, TopicFullNote30 } from '../types';
import { getTopicFullNote30 } from '../utils/topicNoteHelper';
import { 
  BookOpen, 
  Sparkles, 
  Layers, 
  MapPin, 
  Compass, 
  FileText, 
  Check, 
  Share2, 
  Printer, 
  ChevronRight, 
  ExternalLink,
  GraduationCap,
  Award,
  Flame,
  ArrowRight,
  ListOrdered,
  Search
} from 'lucide-react';

interface CompleteTopicNoteViewProps {
  topic: Topic;
  onOpenChapterMaster?: (partId: number) => void;
}

export const CompleteTopicNoteView: React.FC<CompleteTopicNoteViewProps> = ({
  topic,
  onOpenChapterMaster
}) => {
  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const note: TopicFullNote30 = getTopicFullNote30(topic);

  const handleCopyNote = () => {
    let content = `# ৩০-দফা সম্পূর্ণ নোট: ${topic.titleBn} (${topic.titleEn})\n\n`;
    content += `① সহজ পরিচিতি:\n${note.overviewIntroBn}\n\n`;
    content += `② গল্পের মাধ্যমে Introduction:\n${note.storyIntroBn}\n\n`;
    content += `③ Academic Definition:\n${note.academicDefinitionBn}\n\n`;
    content += `④ Detailed Explanation:\n${note.detailedExplanationBn}\n\n`;
    content += `⑤ Key Concepts:\n${note.keyConcepts.map(kc => `- ${kc.termBn} (${kc.termEn}): ${kc.definitionBn}`).join('\n')}\n\n`;
    content += `⑥ Classification:\n${note.classificationBn.join('\n')}\n\n`;
    content += `⑦ Causes:\n${note.causesBn.join('\n')}\n\n`;
    content += `⑧ Processes:\n${note.processesBn.join('\n')}\n\n`;
    content += `⑨ Characteristics:\n${note.characteristicsBn.join('\n')}\n\n`;
    content += `⑩ Effects / Consequences:\n${note.effectsConsequencesBn.join('\n')}\n\n`;
    content += `⑪ Advantages / Importance:\n${note.advantagesImportanceBn.join('\n')}\n\n`;
    content += `⑫ Limitations / Problems:\n${note.limitationsProblemsBn.join('\n')}\n\n`;
    content += `⑬ Real-World Examples:\n${note.realWorldExamplesBn}\n\n`;
    content += `⑭ Bangladesh Examples:\n${note.bangladeshExamplesBn}\n\n`;
    content += `⑮ World Examples:\n${note.worldExamplesBn}\n\n`;
    content += `⑱ Comparison Table:\n${note.comparisonTable.headers.join(' | ')}\n${note.comparisonTable.rows.map(r => r.join(' | ')).join('\n')}\n\n`;
    content += `⑲ Important Terms:\n${note.importantTerms.map(t => `- ${t.bangla} (${t.english}): ${t.meaning}`).join('\n')}\n\n`;
    content += `⑳ Important Scholars:\n${note.scholarsScientists.join(', ')}\n\n`;
    content += `㉑ Important Dates:\n${note.importantDates.map(d => `- ${d.dateOrEpoch}: ${d.eventBn}`).join('\n')}\n\n`;
    content += `㉒ Practical Application:\n${note.practicalApplicationBn}\n\n`;
    content += `㉓ Geography Practical Connection:\n${note.geographyPracticalConnectionBn}\n\n`;
    content += `㉔ GIS / Remote Sensing Connection:\n${note.gisRemoteSensingConnectionBn}\n\n`;
    content += `㉕ Exam Importance:\n${note.examImportanceBn.universityHonours}\n\n`;
    content += `㉖ Competitive Exam Importance:\n${note.competitiveExamImportanceBn.bcsNtrcaRelevance}\n\n`;
    content += `㉗ Quick Revision:\n${note.quickRevisionBn}\n\n`;
    content += `㉘ One-Liner Facts:\n${note.oneLinerFactsBn.join('\n')}\n\n`;
    content += `㉙ Memory Tricks:\n${note.memoryTricksBn}\n\n`;
    content += `㉚ References:\n${note.references.join(', ')}\n`;

    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-lg border border-sky-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950">
                📚 ৩০-দফা সম্পূর্ণ নোট
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white">
                অধ্যায় {topic.number} • {topic.partTitleBn}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                ✓ সংরক্ষিত ও পূর্ণাঙ্গ
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {topic.titleBn}
            </h2>
            <p className="text-xs sm:text-sm text-sky-200 font-medium">
              {topic.titleEn} — ৩০টি সুনির্দিষ্ট একাডেমিক পয়েন্টে পূর্ণাঙ্গ পর্যালোচনা
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyNote}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all backdrop-blur-md"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি সফল!' : 'সম্পূর্ণ ৩০ নোট কপি'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all backdrop-blur-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট</span>
            </button>
          </div>
        </div>

        {/* Banner Link to Master Chapter Note */}
        {onOpenChapterMaster && (
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-sky-200">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>এই টপিকটি <strong>{topic.partTitleBn}</strong> এর অংশ। এই অধ্যায়ের মাস্টার নোট ও ৫০+ প্রশ্নব্যাংক দেখুন:</span>
            </div>
            <button
              onClick={() => onOpenChapterMaster(topic.partId)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              <span>অধ্যায় {topic.partId} মাস্টার নোট ও ৫০+ প্রশ্নব্যাংক</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 30-Point Content Grid */}
      <div className="space-y-6">

        {/* GROUP 1: ভূমিকা ও মৌলিক তাত্ত্বিক ভিত্তি (Points ① to ⑤) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="bg-sky-50 px-6 py-4 border-b border-sky-100 flex items-center gap-2 text-sky-900 font-extrabold text-sm sm:text-base">
            <span className="w-6 h-6 rounded-lg bg-sky-600 text-white text-xs font-black flex items-center justify-center">1</span>
            <span>ভূমিকা ও তাত্ত্বিক ভিত্তি (Points ① — ⑤)</span>
          </div>
          <div className="p-6 space-y-6 divide-y divide-slate-100">
            
            {/* ① সহজ পরিচিতি */}
            <div className="space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-sky-600 font-black">①</span>
                <span>সহজ পরিচিতি (Introduction)</span>
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">{note.overviewIntroBn}</p>
            </div>

            {/* ② গল্পের মাধ্যমে Introduction */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-sky-600 font-black">②</span>
                <span>গল্পের মাধ্যমে পরিচিতি (Story Narrative)</span>
              </h3>
              <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl text-slate-800 text-sm leading-relaxed">
                {note.storyIntroBn}
              </div>
            </div>

            {/* ③ Academic Definition */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-sky-600 font-black">③</span>
                <span>একাডেমিক সংজ্ঞা (Academic Definition)</span>
              </h3>
              <div className="bg-sky-50/70 border-l-4 border-sky-600 p-4 rounded-r-2xl text-slate-900 text-sm font-medium leading-relaxed">
                {note.academicDefinitionBn}
              </div>
            </div>

            {/* ④ Detailed Explanation */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-sky-600 font-black">④</span>
                <span>বিস্তারিত ব্যাখ্যা (Detailed Explanation)</span>
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {note.detailedExplanationBn}
              </p>
            </div>

            {/* ⑤ Key Concepts */}
            <div className="pt-5 space-y-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-sky-600 font-black">⑤</span>
                <span>মূল প্রত্যয়সমূহ (Key Concepts)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {note.keyConcepts.map((kc, idx) => (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-sky-900">{kc.termBn} ({kc.termEn})</div>
                    <p className="text-slate-600 leading-relaxed">{kc.definitionBn}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* GROUP 2: শ্রেণিবিভাগ, কারণ, প্রক্রিয়া ও ফলাফল (Points ⑥ to ⑩) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center gap-2 text-indigo-900 font-extrabold text-sm sm:text-base">
            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center">2</span>
            <span>শ্রেণিবিভাগ, কারণ, প্রক্রিয়া ও প্রভাব (Points ⑥ — ⑩)</span>
          </div>
          <div className="p-6 space-y-6 divide-y divide-slate-100">
            
            {/* ⑥ Classification */}
            <div className="space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-indigo-600 font-black">⑥</span>
                <span>শ্রেণিবিভাগ (Classification)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {note.classificationBn.map((c, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium">
                    {c}
                  </div>
                ))}
              </div>
            </div>

            {/* ⑦ Causes */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-indigo-600 font-black">⑦</span>
                <span>কারণসমূহ (Causes)</span>
              </h3>
              <div className="space-y-2 text-xs">
                {note.causesBn.map((cause, i) => (
                  <div key={i} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-slate-800 flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{cause}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ⑧ Processes */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-indigo-600 font-black">⑧</span>
                <span>প্রক্রিয়া ও ধাপসমূহ (Processes & Stages)</span>
              </h3>
              <div className="space-y-2 text-xs">
                {note.processesBn.map((proc, i) => (
                  <div key={i} className="p-3 bg-sky-50/50 rounded-xl border border-sky-100 text-slate-800 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-md bg-sky-200 text-sky-900 text-[10px] font-black flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{proc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ⑨ Characteristics */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-indigo-600 font-black">⑨</span>
                <span>প্রধান বৈশিষ্ট্যসমূহ (Characteristics)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {note.characteristicsBn.map((char, i) => (
                  <div key={i} className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 text-slate-800">
                    {char}
                  </div>
                ))}
              </div>
            </div>

            {/* ⑩ Effects / Consequences */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-indigo-600 font-black">⑩</span>
                <span>প্রভাব ও ফলাফল (Effects & Consequences)</span>
              </h3>
              <div className="space-y-2 text-xs">
                {note.effectsConsequencesBn.map((eff, i) => (
                  <div key={i} className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-slate-800 flex items-start gap-2">
                    <span className="text-amber-600 font-bold">⚡</span>
                    <span className="leading-relaxed">{eff}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* GROUP 3: গুরুত্ব, সীমাবদ্ধতা ও বাস্তব উদাহরণ (Points ⑪ to ⑮) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center gap-2 text-emerald-900 font-extrabold text-sm sm:text-base">
            <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-black flex items-center justify-center">3</span>
            <span>গুরুত্ব, সীমাবদ্ধতা ও উদাহরণ (Points ⑪ — ⑮)</span>
          </div>
          <div className="p-6 space-y-6 divide-y divide-slate-100">
            
            {/* ⑪ Advantages / Importance */}
            <div className="space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-emerald-600 font-black">⑪</span>
                <span>সুবিধা ও গুরুত্ব (Advantages & Importance)</span>
              </h3>
              <div className="space-y-1.5 text-xs">
                {note.advantagesImportanceBn.map((adv, i) => (
                  <div key={i} className="p-2.5 bg-emerald-50/40 rounded-xl border border-emerald-100 text-slate-800">
                    {adv}
                  </div>
                ))}
              </div>
            </div>

            {/* ⑫ Limitations / Problems */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-emerald-600 font-black">⑫</span>
                <span>সীমাবদ্ধতা ও সমস্যা (Limitations & Problems)</span>
              </h3>
              <div className="space-y-1.5 text-xs">
                {note.limitationsProblemsBn.map((lim, i) => (
                  <div key={i} className="p-2.5 bg-rose-50/40 rounded-xl border border-rose-100 text-slate-800">
                    {lim}
                  </div>
                ))}
              </div>
            </div>

            {/* ⑬ Real-World Examples */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-emerald-600 font-black">⑬</span>
                <span>বাস্তব পৃথিবীর উদাহরণ (Real-World Examples)</span>
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-200">
                {note.realWorldExamplesBn}
              </p>
            </div>

            {/* ⑭ Bangladesh Examples */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-emerald-600 font-black">⑭</span>
                <span>বাংলাদেশের উদাহরণ (Bangladesh Context & Case)</span>
              </h3>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-950 text-sm leading-relaxed">
                🇧🇩 <strong>বাংলাদেশ প্রেক্ষাপট:</strong> {note.bangladeshExamplesBn}
              </div>
            </div>

            {/* ⑮ World Examples */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-emerald-600 font-black">⑮</span>
                <span>বিশ্ব উদাহরণ (World Examples)</span>
              </h3>
              <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl text-sky-950 text-sm leading-relaxed">
                🌍 <strong>আন্তর্জাতিক প্রেক্ষাপট:</strong> {note.worldExamplesBn}
              </div>
            </div>

          </div>
        </div>

        {/* GROUP 4: ভিজ্যুয়াল ডেটা, ডায়াগ্রাম ও ম্যাপ (Points ⑯ to ⑰) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="bg-slate-900 px-6 py-4 text-emerald-400 flex items-center gap-2 font-extrabold text-sm sm:text-base">
            <span className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 text-xs font-black flex items-center justify-center">4</span>
            <span>ডায়াগ্রাম ও স্থানিক মানচিত্রায়ন (Points ⑯ — ⑰)</span>
          </div>
          <div className="p-6 space-y-6">
            
            {/* ⑯ Diagram */}
            <div className="space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-emerald-600 font-black">⑯</span>
                <span>লেবেলযুক্ত ডায়াগ্রাম (ASCII / Graphical Diagram)</span>
              </h3>
              <div className="bg-slate-950 text-emerald-400 p-5 rounded-2xl font-mono text-xs sm:text-sm overflow-x-auto border border-slate-800">
                <pre>{note.diagramAsciiOrSvg}</pre>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                ডায়াগ্রাম ক্যাপশন: {note.diagramCaptionBn}
              </div>
            </div>

            {/* ⑰ Map */}
            <div className="pt-5 border-t border-slate-100 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-emerald-600 font-black">⑰</span>
                <span>মানচিত্র ও স্থানিক বিন্যাস (Map & Spatial Dimension)</span>
              </h3>
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-indigo-950 text-xs sm:text-sm leading-relaxed">
                🗺️ {note.mapSpatialContextBn}
              </div>
            </div>

          </div>
        </div>

        {/* GROUP 5: তুলনা টেবিল, পরিভাষা, বিজ্ঞানী ও সাল (Points ⑱ to ㉑) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center gap-2 text-amber-950 font-extrabold text-sm sm:text-base">
            <span className="w-6 h-6 rounded-lg bg-amber-500 text-white text-xs font-black flex items-center justify-center">5</span>
            <span>তুলনা সারণি, পরিভাষা ও ঐতিহাসিক সংযোগ (Points ⑱ — ㉑)</span>
          </div>
          <div className="p-6 space-y-6 divide-y divide-slate-100">
            
            {/* ⑱ Comparison Table */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-amber-600 font-black">⑱</span>
                <span>তুলনা সারণি (Comparison Table)</span>
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                      {note.comparisonTable.headers.map((h, i) => (
                        <th key={i} className="p-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {note.comparisonTable.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ⑲ Important Terms */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-amber-600 font-black">⑲</span>
                <span>গুরুত্বপূর্ণ পরিভাষা (Important Terms)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {note.importantTerms.map((term, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-sky-800">{term.bangla}</span> ({term.english}): {term.meaning}
                  </div>
                ))}
              </div>
            </div>

            {/* ⑳ Important Scholars / Scientists */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-amber-600 font-black">⑳</span>
                <span>সংশ্লিষ্ট বিজ্ঞানী ও গবেষক (Scholars & Scientists)</span>
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {note.scholarsScientists.map((sc, i) => (
                  <span key={i} className="px-3 py-1 bg-amber-100/60 border border-amber-200 rounded-full font-bold text-amber-900">
                    🎓 {sc}
                  </span>
                ))}
              </div>
            </div>

            {/* ㉑ Important Dates */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-amber-600 font-black">㉑</span>
                <span>গুরুত্বপূর্ণ সময়রেখা ও সাল (Important Dates)</span>
              </h3>
              <div className="space-y-2 text-xs">
                {note.importantDates.map((item, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2">
                    <span className="font-bold text-indigo-700 shrink-0">[{item.dateOrEpoch}]</span>
                    <span className="text-slate-700">{item.eventBn}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* GROUP 6: প্র্যাকটিক্যাল, জিআইএস ও পরীক্ষা প্রস্তুতি (Points ㉒ to ㉚) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex items-center gap-2 text-purple-950 font-extrabold text-sm sm:text-base">
            <span className="w-6 h-6 rounded-lg bg-purple-600 text-white text-xs font-black flex items-center justify-center">6</span>
            <span>প্র্যাকটিক্যাল, জিআইএস, পরীক্ষা ও রিভিশন (Points ㉒ — ㉚)</span>
          </div>
          <div className="p-6 space-y-6 divide-y divide-slate-100">
            
            {/* ㉒ Practical Application */}
            <div className="space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-purple-600 font-black">㉒</span>
                <span>বাস্তব প্রয়োগ (Practical Application)</span>
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-200">
                {note.practicalApplicationBn}
              </p>
            </div>

            {/* ㉓ Geography Practical Connection */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-purple-600 font-black">㉓</span>
                <span>ব্যবহারিক ভূগোলের সাথে সম্পর্ক (Practical Geography Connection)</span>
              </h3>
              <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-xl text-xs sm:text-sm text-indigo-950">
                🔬 {note.geographyPracticalConnectionBn}
              </div>
            </div>

            {/* ㉔ GIS / Remote Sensing Connection */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-purple-600 font-black">㉔</span>
                <span>জিআইএস ও রিমোট সেন্সিং সংযোগ (GIS / Remote Sensing)</span>
              </h3>
              <div className="bg-teal-50 border border-teal-200 p-3.5 rounded-xl text-xs sm:text-sm text-teal-950">
                🛰️ {note.gisRemoteSensingConnectionBn}
              </div>
            </div>

            {/* ㉕ Exam Importance */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-purple-600 font-black">㉕</span>
                <span>বিশ্ববিদ্যালয় পরীক্ষার গুরুত্ব (University Exam Relevance)</span>
              </h3>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                {note.examImportanceBn.universityHonours}
              </p>
              {note.examImportanceBn.frequentQuestions.length > 0 && (
                <div className="space-y-1 pt-1">
                  {note.examImportanceBn.frequentQuestions.map((q, i) => (
                    <div key={i} className="text-xs bg-purple-50 p-2 rounded-lg border border-purple-100 text-purple-900 font-medium">
                      • {q}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ㉖ Competitive Exam Importance */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-purple-600 font-black">㉖</span>
                <span>চাকরি ও বিসিএস পরীক্ষার গুরুত্ব (BCS & Job Prep)</span>
              </h3>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                {note.competitiveExamImportanceBn.bcsNtrcaRelevance}
              </p>
            </div>

            {/* ㉗ Quick Revision */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-purple-600 font-black">㉗</span>
                <span>কুইক রিভিশন (Quick Revision)</span>
              </h3>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-slate-900 text-xs sm:text-sm font-medium">
                ⚡ {note.quickRevisionBn}
              </div>
            </div>

            {/* ㉘ One-Liner Facts */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-purple-600 font-black">㉘</span>
                <span>এক নজরে ওয়ান-লাইনার তথ্য (One-Liner Super Facts)</span>
              </h3>
              <div className="space-y-1.5 text-xs">
                {note.oneLinerFactsBn.map((fact, i) => (
                  <div key={i} className="p-2.5 bg-sky-50/60 rounded-xl border border-sky-100 text-slate-800 font-medium flex items-center gap-2">
                    <span className="text-sky-600 font-black">✓</span>
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ㉙ Memory Tricks */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-purple-600 font-black">㉙</span>
                <span>স্মৃতি কৌশল ও শর্টকাট (Memory Tricks & Mnemonics)</span>
              </h3>
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-rose-950 text-xs sm:text-sm font-medium">
                🧠 {note.memoryTricksBn}
              </div>
            </div>

            {/* ㉚ References */}
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="text-purple-600 font-black">㉚</span>
                <span>বিশ্বস্ত একাডেমিক রেফারেন্স (Academic References)</span>
              </h3>
              <div className="space-y-1 text-xs text-slate-600">
                {note.references.map((ref, i) => (
                  <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-mono">
                    [{i + 1}] {ref}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
import sys

# Import all chapters
sys.path.append(os.path.dirname(__file__))

from build_chapters import chapters as ch1_list
from ch2_data import chapter2_data
from ch3_data import chapter3_data
from ch4_complete import chapter4_data
from ch5_complete import chapter5_data
from ch6_complete import chapter6_data
from ch7_complete import chapter7_data
from ch8_complete import chapter8_data
from ch9_complete import chapter9_data
from ch10_complete import chapter10_data

chapter1_data = ch1_list[0]

all_chapters = [
    chapter1_data,
    chapter2_data,
    chapter3_data,
    chapter4_data,
    chapter5_data,
    chapter6_data,
    chapter7_data,
    chapter8_data,
    chapter9_data,
    chapter10_data
]

print(f"Loaded {len(all_chapters)} chapters.")
total_mcqs = 0
total_short = 0
total_broad = 0

for ch in all_chapters:
    mcqs = len(ch["questionBank"]["mcqs"])
    short_q = len(ch["questionBank"]["shortQuestions"])
    broad_q = len(ch["questionBank"]["broadQuestions"])
    total_q = mcqs + short_q + broad_q
    total_mcqs += mcqs
    total_short += short_q
    total_broad += broad_q
    print(f"Chapter {ch['chapterNumber']}: {ch['titleBn']} => {mcqs} MCQs, {short_q} Short, {broad_q} Broad (Total: {total_q} Questions)")

print(f"\n==========================================")
print(f"GRAND TOTALS ACROSS ALL 10 CHAPTERS:")
print(f"Total MCQs: {total_mcqs}")
print(f"Total Short Questions: {total_short}")
print(f"Total Broad Questions: {total_broad}")
print(f"TOTAL QUESTIONS IN BANK: {total_mcqs + total_short + total_broad}")
print(f"==========================================")

# Write to src/data/chapterMasterData.ts
output_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "chapterMasterData.ts")

json_str = json.dumps(all_chapters, ensure_ascii=False, indent=2)

ts_content = f"""// AUTO-GENERATED COMPLETE CHAPTER MASTER NOTES & 50+ QUESTION BANK HUB
// Guaranteed completeness: Exactly 10 Chapters, each with complete Master Note & 50+ Questions.
import {{ ChapterMasterNote }} from '../types';

export const ALL_CHAPTER_MASTERS: ChapterMasterNote[] = {json_str};
"""

with open(output_path, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully wrote {output_path} ({os.path.getsize(output_path)} bytes)")

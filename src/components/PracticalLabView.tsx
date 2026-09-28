import React, { useState } from 'react';
import { 
  FlaskConical, 
  Clock, 
  Map, 
  TrendingUp, 
  Sun, 
  CloudRain, 
  Users, 
  Compass, 
  Sparkles,
  Calculator,
  RotateCcw
} from 'lucide-react';

export const PracticalLabView: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'scale' | 'time' | 'slope' | 'nna' | 'synoptic' | 'dependency'>('scale');

  // Tool 1: Scale Converter
  const [rfDenominator, setRfDenominator] = useState<number>(50000);

  // Tool 2: Longitude & Time
  const [placeALongitude, setPlaceALongitude] = useState<number>(90.4); // Dhaka
  const [placeADir, setPlaceADir] = useState<'E' | 'W'>('E');
  const [placeAHours, setPlaceAHours] = useState<number>(12);
  const [placeAMinutes, setPlaceAMinutes] = useState<number>(0);
  const [placeBLongitude, setPlaceBLongitude] = useState<number>(0); // Greenwich
  const [placeBDir, setPlaceBDir] = useState<'E' | 'W'>('E');

  // Tool 3: Slope & V.E.
  const [verticalInterval, setVerticalInterval] = useState<number>(100); // meters
  const [horizontalDistance, setHorizontalDistance] = useState<number>(1000); // meters
  const [hScaleDenom, setHScaleDenom] = useState<number>(50000);
  const [vScaleDenom, setVScaleDenom] = useState<number>(5000);

  // Tool 4: NNA
  const [nnaPoints, setNnaPoints] = useState<number>(25);
  const [nnaArea, setNnaArea] = useState<number>(100); // sq km
  const [nnaObservedDist, setNnaObservedDist] = useState<number>(0.8); // km

  // Tool 5: Synoptic
  const [synTemp, setSynTemp] = useState<number>(28);
  const [synDew, setSynDew] = useState<number>(24);
  const [synPressure, setSynPressure] = useState<number>(1008);
  const [synOktas, setSynOktas] = useState<number>(4); // 0 to 8
  const [synWindKnots, setSynWindKnots] = useState<number>(20);

  // Tool 6: Dependency
  const [childPop, setChildPop] = useState<number>(27); // % 0-14
  const [workingPop, setWorkingPop] = useState<number>(66); // % 15-64
  const [elderlyPop, setElderlyPop] = useState<number>(7); // % 65+

  // Calculations for Scale Converter
  const kmPerCm = rfDenominator / 100000;
  const metersPerCm = rfDenominator / 100;
  const milesPerInch = rfDenominator / 63360;

  // Calculations for Time
  const coordA = placeADir === 'E' ? placeALongitude : -placeALongitude;
  const coordB = placeBDir === 'E' ? placeBLongitude : -placeBLongitude;
  const longDiff = Math.abs(coordA - coordB);
  const timeDiffMinutes = longDiff * 4;
  const timeDiffHoursInt = Math.floor(timeDiffMinutes / 60);
  const timeDiffRemMins = Math.round(timeDiffMinutes % 60);

  let bTotalMinutes = (placeAHours * 60 + placeAMinutes);
  if (coordB > coordA) {
    bTotalMinutes += timeDiffMinutes;
  } else {
    bTotalMinutes -= timeDiffMinutes;
  }
  bTotalMinutes = (bTotalMinutes + 1440) % 1440;
  const bHours = Math.floor(bTotalMinutes / 60);
  const bMins = Math.round(bTotalMinutes % 60);

  // Calculations for Slope
  const slopePercent = (verticalInterval / horizontalDistance) * 100;
  const slopeGradient = Math.round(horizontalDistance / verticalInterval);
  const slopeDegrees = (Math.atan(verticalInterval / horizontalDistance) * 180 / Math.PI).toFixed(1);
  const verticalExaggeration = (hScaleDenom / vScaleDenom).toFixed(1);

  // Calculations for NNA
  const density = nnaPoints / nnaArea;
  const expectedDist = 1 / (2 * Math.sqrt(density));
  const rnIndex = nnaObservedDist / expectedDist;
  let patternType = 'দৈব বিন্যাস (Random)';
  if (rnIndex < 0.8) patternType = 'পুঞ্জীভূত বা গুচ্ছাকৃতির বিন্যাস (Clustered Pattern)';
  else if (rnIndex > 1.4) patternType = 'নিয়মিত বা সুষম ষড়ভুজাকার বিন্যাস (Dispersed / Regular Pattern)';

  // Calculations for Dependency Ratio
  const dependencyRatio = ((childPop + elderlyPop) / workingPop) * 100;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-sky-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-teal-200">
          <FlaskConical className="w-3.5 h-3.5 text-teal-300" />
          <span>ব্যবহারিক ভূগোল ও স্থানিক তথ্য ল্যাবরেটরি</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          ইন্টারেক্টিভ ভৌগোলিক ক্যালকুলেটর ও সিমুলেটর
        </h1>
        <p className="text-xs sm:text-sm text-sky-100 max-w-2xl">
          মানচিত্রের স্কেল রূপান্তর, দ্রাঘিমাংশ ও স্থানীয় সময়, ভূমির ঢাল, নিকটতম প্রতিবেশী বিশ্লেষণ (NNA) এবং সিনপটিক আবহাওয়া মডেলিং সরাসরি হাতে-কলমে অনুশীলন করো।
        </p>
      </div>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          onClick={() => setActiveTool('scale')}
          className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 ${
            activeTool === 'scale'
              ? 'bg-sky-600 text-white border-sky-600 shadow-md'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-sky-50'
          }`}
        >
          <Map className="w-5 h-5" />
          <span>স্কেল রূপান্তরকারী</span>
        </button>

        <button
          onClick={() => setActiveTool('time')}
          className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 ${
            activeTool === 'time'
              ? 'bg-sky-600 text-white border-sky-600 shadow-md'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-sky-50'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>দ্রাঘিমা ও সময়</span>
        </button>

        <button
          onClick={() => setActiveTool('slope')}
          className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 ${
            activeTool === 'slope'
              ? 'bg-sky-600 text-white border-sky-600 shadow-md'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-sky-50'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span>ভূমি ঢাল ও V.E.</span>
        </button>

        <button
          onClick={() => setActiveTool('nna')}
          className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 ${
            activeTool === 'nna'
              ? 'bg-sky-600 text-white border-sky-600 shadow-md'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-sky-50'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>NNA স্পেশাল Rn</span>
        </button>

        <button
          onClick={() => setActiveTool('synoptic')}
          className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 ${
            activeTool === 'synoptic'
              ? 'bg-sky-600 text-white border-sky-600 shadow-md'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-sky-50'
          }`}
        >
          <Sun className="w-5 h-5" />
          <span>সিনপটিক মডেল</span>
        </button>

        <button
          onClick={() => setActiveTool('dependency')}
          className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 ${
            activeTool === 'dependency'
              ? 'bg-sky-600 text-white border-sky-600 shadow-md'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-sky-50'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>নির্ভরশীলতা অনুপাত</span>
        </button>
      </div>

      {/* TOOL 1: SCALE CONVERTER */}
      {activeTool === 'scale' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800">মানচিত্র স্কেল রূপান্তর ও রৈখিক স্কেল অঙ্কন</h2>
            <p className="text-xs text-slate-500">Representative Fraction (RF) to Statement and Graphic Scale</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  প্রতিনিধিত্বমূলক ভগ্নাংশ (RF Denominator): ১ :
                </label>
                <input
                  type="number"
                  step="1000"
                  value={rfDenominator}
                  onChange={(e) => setRfDenominator(Math.max(1, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              {/* Quick Presets */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  জনপ্রিয় প্রমিত স্কেলসমূহ:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[10000, 25000, 50000, 100000, 250000, 1000000].map(val => (
                    <button
                      key={val}
                      onClick={() => setRfDenominator(val)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border ${
                        rfDenominator === val 
                          ? 'bg-sky-600 text-white border-sky-600' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-sky-50'
                      }`}
                    >
                      ১ : {val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-3">
              <h3 className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-sky-600" />
                বর্ণনামূলক স্কেল সমতুল্য (Statement Equivalence):
              </h3>

              <div className="space-y-2 text-xs sm:text-sm text-slate-800">
                <div className="p-2.5 rounded-xl bg-white border border-sky-200">
                  মানচিত্রের ১ সেমি = বাস্তবে <strong className="text-sky-800">{metersPerCm.toFixed(1)} মিটার</strong> ({kmPerCm.toFixed(3)} কিলোমিটার)
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-sky-200">
                  মানচিত্রের ১ ইঞ্চি = বাস্তবে <strong className="text-sky-800">{milesPerInch.toFixed(3)} মাইল</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-sky-200">
                  বাস্তবের ১ কিলোমিটার = মানচিত্রে <strong className="text-sky-800">{(1 / kmPerCm).toFixed(2)} সেমি</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Graphic Scale Visual */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between text-xs text-sky-300">
              <span className="font-bold">রৈখিক স্কেল ডায়াগ্রাম (Graphic Linear Scale)</span>
              <span>স্কেল ১ : {rfDenominator.toLocaleString()}</span>
            </div>

            <div className="pt-4 pb-2 px-4 bg-slate-800/80 rounded-xl border border-slate-700">
              <div className="h-4 bg-white rounded-xs flex border border-slate-600">
                <div className="w-1/4 bg-slate-900 border-r border-white" />
                <div className="w-1/4 bg-white border-r border-slate-900" />
                <div className="w-1/4 bg-slate-900 border-r border-white" />
                <div className="w-1/4 bg-white" />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-sky-200 pt-1.5">
                <span>০</span>
                <span>{(kmPerCm * 2.5).toFixed(1)} কিমি</span>
                <span>{(kmPerCm * 5).toFixed(1)} কিমি</span>
                <span>{(kmPerCm * 7.5).toFixed(1)} কিমি</span>
                <span>{(kmPerCm * 10).toFixed(1)} কিমি</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 2: LONGITUDE & TIME */}
      {activeTool === 'time' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800">দ্রাঘিমাংশ ও স্থানীয় সময় নির্ণায়ক</h2>
            <p className="text-xs text-slate-500">Calculate Local Time between two locations based on Longitude difference</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Place A */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                স্থান 'ক' (Place A - পরিচিত সময়)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">দ্রাঘিমাংশ (°)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={placeALongitude}
                    onChange={(e) => setPlaceALongitude(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">দিক</label>
                  <select
                    value={placeADir}
                    onChange={(e) => setPlaceADir(e.target.value as 'E' | 'W')}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  >
                    <option value="E">পূর্ব (East)</option>
                    <option value="W">পশ্চিম (West)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">ঘণ্টা (২৪ ঘণ্টার ফরম্যাট)</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={placeAHours}
                    onChange={(e) => setPlaceAHours(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">মিনিট</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={placeAMinutes}
                    onChange={(e) => setPlaceAMinutes(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Place B */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3">
              <h3 className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                স্থান 'খ' (Place B - লক্ষ্য স্থান)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">দ্রাঘিমাংশ (°)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={placeBLongitude}
                    onChange={(e) => setPlaceBLongitude(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-sky-300 text-xs font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">দিক</label>
                  <select
                    value={placeBDir}
                    onChange={(e) => setPlaceBDir(e.target.value as 'E' | 'W')}
                    className="w-full px-3 py-1.5 rounded-xl border border-sky-300 text-xs font-bold bg-white"
                  >
                    <option value="E">পূর্ব (East)</option>
                    <option value="W">পশ্চিম (West)</option>
                  </select>
                </div>
              </div>

              {/* Presets */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">দ্রুত শহর নির্বাচন:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button onClick={() => { setPlaceBLongitude(0); setPlaceBDir('E'); }} className="px-2 py-0.5 rounded-md bg-white border text-[10px] font-bold text-slate-700">গ্রিনিচ (০°)</button>
                  <button onClick={() => { setPlaceBLongitude(90.4); setPlaceBDir('E'); }} className="px-2 py-0.5 rounded-md bg-white border text-[10px] font-bold text-slate-700">ঢাকা (৯০.৪° E)</button>
                  <button onClick={() => { setPlaceBLongitude(74.0); setPlaceBDir('W'); }} className="px-2 py-0.5 rounded-md bg-white border text-[10px] font-bold text-slate-700">নিউইয়র্ক (৭৪° W)</button>
                  <button onClick={() => { setPlaceBLongitude(139.7); setPlaceBDir('E'); }} className="px-2 py-0.5 rounded-md bg-white border text-[10px] font-bold text-slate-700">টোকিও (১৩৯.৭° E)</button>
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Solution Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-900 to-indigo-950 text-white space-y-3 shadow-lg">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> গাণিতিক সমাধান ও পদক্ষেপসমূহ (Mathematical Steps)
            </h3>
            
            <div className="space-y-1.5 text-xs text-sky-100 font-mono">
              <div>১. দুই স্থানের দ্রাঘিমাংশের ব্যবধান = {longDiff.toFixed(2)}°</div>
              <div>২. সময়ের পার্থক্য = {longDiff.toFixed(2)} × ৪ মিনিট = {timeDiffMinutes.toFixed(1)} মিনিট ({timeDiffHoursInt} ঘণ্টা {timeDiffRemMins} মিনিট)</div>
              <div>৩. স্থান 'খ' স্থান 'ক' এর {coordB >= coordA ? 'পূর্বে অবস্থিত (সময় যোগ হবে)' : 'পশ্চিমে অবস্থিত (সময় বিয়োগ হবে)'}</div>
            </div>

            <div className="pt-2 border-t border-sky-800 flex items-center justify-between">
              <span className="text-xs text-sky-200">স্থান 'খ'-এর বর্তমান স্থানীয় সময়:</span>
              <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                {String(bHours).padStart(2, '0')}:{String(bMins).padStart(2, '0')} {bHours >= 12 ? 'PM' : 'AM'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: SLOPE & V.E. */}
      {activeTool === 'slope' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800">ভূমির ঢাল ও উল্লম্ব অতিরঞ্জন (Slope & Vertical Exaggeration)</h2>
            <p className="text-xs text-slate-500">Calculate Slope Gradient, Percentage and Profile Exaggeration Ratio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  উল্লম্ব ব্যবধান (Vertical Interval - V.I.) [মিটার]:
                </label>
                <input
                  type="number"
                  value={verticalInterval}
                  onChange={(e) => setVerticalInterval(Math.max(1, Number(e.target.value)))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  অনুভূমিক সমতুল্য দূরত্ব (Horizontal Equivalent - H.E.) [মিটার]:
                </label>
                <input
                  type="number"
                  value={horizontalDistance}
                  onChange={(e) => setHorizontalDistance(Math.max(1, Number(e.target.value)))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">অনুভূমিক স্কেল ১ :</label>
                  <input
                    type="number"
                    value={hScaleDenom}
                    onChange={(e) => setHScaleDenom(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">উল্লম্ব স্কেল ১ :</label>
                  <input
                    type="number"
                    value={vScaleDenom}
                    onChange={(e) => setVScaleDenom(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-3">
              <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                ঢাল ও অতিরঞ্জনের ফলাফল:
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-slate-800">
                <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                  ঢাল অনুপাত (Gradient Ratio): <strong className="text-emerald-800">১ : {slopeGradient}</strong> (প্রতি {slopeGradient} মিটারে ১ মিটার খাড়া)
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                  শতকরা ঢাল (Slope Percentage): <strong className="text-emerald-800">{slopePercent.toFixed(1)}%</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                  কোণ মান (Slope Angle): <strong className="text-emerald-800">{slopeDegrees}° ডিগ্রি</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                  উল্লম্ব অতিরঞ্জন (Vertical Exaggeration - V.E.): <strong className="text-emerald-800">{verticalExaggeration} গুণ</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 4: NNA */}
      {activeTool === 'nna' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800">নিকটতম প্রতিবেশী বিশ্লেষণ (Nearest Neighbor Analysis - Rn)</h2>
            <p className="text-xs text-slate-500">Spatial Pattern Measurement by Clark & Evans (1954)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মোট বসতি বা বিন্দুর সংখ্যা (N): {nnaPoints}টি
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={nnaPoints}
                  onChange={(e) => setNnaPoints(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মোট ক্ষেত্রফল (Area - A): {nnaArea} বর্গকিমি
                </label>
                <input
                  type="range"
                  min="20"
                  max="500"
                  value={nnaArea}
                  onChange={(e) => setNnaArea(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পর্যবেক্ষিত গড় দূরত্ব (ro): {nnaObservedDist} কিমি
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.05"
                  value={nnaObservedDist}
                  onChange={(e) => setNnaObservedDist(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </div>
            </div>

            {/* NNA Result Box */}
            <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-3">
              <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                Rn সূচক ও স্থানিক বণ্টন চরিত্র:
              </h3>

              <div className="space-y-2 text-xs sm:text-sm text-slate-800">
                <div className="p-2.5 rounded-xl bg-white border border-purple-200">
                  ঘনত্ব (Density = N/A): <strong className="text-purple-800">{density.toFixed(3)} বিন্দু/বর্গকিমি</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-purple-200">
                  প্রত্যাশিত গড় দূরত্ব (re): <strong className="text-purple-800">{expectedDist.toFixed(3)} কিমি</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-between">
                  <span>Rn সূচকের মান (ro / re):</span>
                  <span className="text-xl font-mono">{rnIndex.toFixed(2)}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-purple-300 font-semibold text-purple-950">
                  বণ্টন বিন্যাস: <strong>{patternType}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 5: SYNOPTIC */}
      {activeTool === 'synoptic' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800">সিনপটিক স্টেশন মডেল নির্মাতা (Synoptic Station Model)</h2>
            <p className="text-xs text-slate-500">Live WMO Weather Station Symbol Generator</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">তাপমাত্রা: {synTemp}°C</label>
                <input type="range" min="10" max="45" value={synTemp} onChange={(e) => setSynTemp(Number(e.target.value))} className="w-full accent-sky-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">শিশিরাংক: {synDew}°C</label>
                <input type="range" min="5" max="35" value={synDew} onChange={(e) => setSynDew(Number(e.target.value))} className="w-full accent-sky-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বায়ুর চাপ: {synPressure} mb</label>
                <input type="range" min="980" max="1030" value={synPressure} onChange={(e) => setSynPressure(Number(e.target.value))} className="w-full accent-sky-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">মেঘের পরিমাণ (Oktas): {synOktas}/৮ ভাগ</label>
                <input type="range" min="0" max="8" value={synOktas} onChange={(e) => setSynOktas(Number(e.target.value))} className="w-full accent-sky-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বায়ুর গতি: {synWindKnots} নট (Knots)</label>
                <input type="range" min="0" max="60" value={synWindKnots} onChange={(e) => setSynWindKnots(Number(e.target.value))} className="w-full accent-sky-600" />
              </div>
            </div>

            {/* Model Visualizer */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center space-y-4">
              <span className="text-xs font-bold text-sky-300">WMO স্টেশন মডেল ডায়াগ্রাম</span>
              
              <div className="relative w-48 h-48 rounded-full border border-dashed border-slate-700 flex items-center justify-center bg-slate-800/40">
                {/* Center Circle (Oktas) */}
                <div className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center font-bold text-xs bg-slate-800">
                  {synOktas}/8
                </div>

                {/* Top-Left: Temperature */}
                <span className="absolute top-8 left-6 text-sm font-mono font-bold text-amber-400">
                  {synTemp}°C
                </span>

                {/* Bottom-Left: Dew Point */}
                <span className="absolute bottom-8 left-6 text-sm font-mono font-bold text-teal-400">
                  {synDew}°C
                </span>

                {/* Top-Right: Pressure */}
                <span className="absolute top-8 right-6 text-sm font-mono font-bold text-sky-400">
                  {synPressure}mb
                </span>

                {/* Wind Barb Line */}
                <div 
                  className="absolute w-16 h-0.5 bg-white origin-left"
                  style={{ top: '50%', left: '50%', transform: 'rotate(-45deg)' }}
                >
                  <div className="absolute right-0 -top-2 w-3 h-3 border-t-2 border-r-2 border-white" />
                </div>
              </div>

              <div className="text-xs text-slate-400 text-center">
                বায়ুপ্রবাহ: উত্তর-পশ্চিম থেকে {synWindKnots} নট বেগে ধাবমান।
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 6: DEPENDENCY RATIO */}
      {activeTool === 'dependency' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800">জনমিতিক নির্ভরশীলতার অনুপাত ও পিরামিড টাইপ</h2>
            <p className="text-xs text-slate-500">Demographic Dependency Ratio & Age Structure Analysis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  শিশু জনসংখ্যা (০-১৪ বছর): {childPop}%
                </label>
                <input type="range" min="10" max="50" value={childPop} onChange={(e) => setChildPop(Number(e.target.value))} className="w-full accent-sky-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  কর্মক্ষম জনসংখ্যা (১৫-৬৪ বছর): {workingPop}%
                </label>
                <input type="range" min="40" max="80" value={workingPop} onChange={(e) => setWorkingPop(Number(e.target.value))} className="w-full accent-sky-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  প্রবীণ জনসংখ্যা (৬৫+ বছর): {elderlyPop}%
                </label>
                <input type="range" min="3" max="30" value={elderlyPop} onChange={(e) => setElderlyPop(Number(e.target.value))} className="w-full accent-sky-600" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-100 space-y-3">
              <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                জনমিতিক ফলাফল ও বিশ্লেষণ:
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-slate-800">
                <div className="p-3 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-between">
                  <span>নির্ভরশীলতার অনুপাত (Dependency Ratio):</span>
                  <span className="text-xl font-mono">{dependencyRatio.toFixed(1)}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-teal-200">
                  শিশু নির্ভরশীলতা: <strong className="text-teal-800">{((childPop / workingPop) * 100).toFixed(1)}%</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-teal-200">
                  প্রবীণ নির্ভরশীলতা: <strong className="text-teal-800">{((elderlyPop / workingPop) * 100).toFixed(1)}%</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-teal-200">
                  জনমিতিক লভ্যাংশ (Demographic Dividend): <strong>{workingPop >= 60 ? 'বিদ্যমান (উচ্চ কর্মক্ষম সম্ভাবনা)' : 'অনুপস্থিত'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

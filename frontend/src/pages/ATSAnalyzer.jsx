import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

const GaugeMeter = ({ score }) => {
  const angle = (score / 100) * 180 - 90;
  const color = score > 75 ? '#4ade80' : score > 50 ? '#facc15' : '#f87171';

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-64 h-32 overflow-hidden">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Background arc */}
          <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#1f2937" strokeWidth="18" />
          {/* Score arc */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke={color}
            strokeWidth="18"
            strokeDasharray={`${score * 2.82} 282`}
            className="transition-all duration-1500 ease-out"
          />
          {/* Needle */}
          <line
            x1="100" y1="100"
            x2={100 + 75 * Math.cos(((angle - 90) * Math.PI) / 180)}
            y2={100 + 75 * Math.sin(((angle - 90) * Math.PI) / 180)}
            stroke="white" strokeWidth="3" strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="6" fill="white" />
        </svg>
      </div>
      <div className="text-center -mt-4">
        <p className="text-6xl font-bold" style={{ color }}>{score}</p>
        <p className="text-gray-400 font-medium mt-1">ATS Score / 100</p>
      </div>
    </div>
  );
};

const ATSAnalyzer = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        score: 72,
        strengths: [
          'Good skills section present with relevant technologies.',
          'Education section is complete and well-formatted.',
          'Good use of quantifiable metrics found.',
        ],
        weaknesses: [
          'Some bullet points do not start with strong action verbs.',
          'Projects section could be more detailed.',
        ],
        formatting: [
          'Resume length is within the ideal 1-page range.',
          'All critical resume sections are present.',
        ],
      });
    }, 2500);
  };

  const scoreBreakdown = [
    { label: 'Skills Match', score: 85, color: 'emerald' },
    { label: 'Action Verbs', score: 60, color: 'yellow' },
    { label: 'Quantifiable Metrics', score: 75, color: 'indigo' },
    { label: 'Formatting & Sections', score: 90, color: 'sky' },
    { label: 'Content Quality', score: 55, color: 'orange' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FileCheck className="text-emerald-400" /> ATS Score Analyzer
        </h1>
        <p className="text-gray-400 mt-2">Get a detailed ATS compatibility report with section-by-section analysis.</p>
      </div>

      {!result ? (
        <div className="glass rounded-2xl p-12 text-center max-w-lg mx-auto">
          <FileCheck className="w-20 h-20 text-emerald-400/50 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-white mb-2">Ready to Analyze</h2>
          <p className="text-gray-400 mb-8">Upload your resume from the Dashboard first, then click below to run the ATS analysis engine.</p>
          <button
            onClick={runAnalysis}
            disabled={analyzing}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
          >
            {analyzing ? (
              <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Analyzing Resume...</span>
            ) : 'Run ATS Analysis'}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass rounded-2xl p-6">
              <GaugeMeter score={result.score} />
            </div>

            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="text-indigo-400" /> Score Breakdown
              </h2>
              {scoreBreakdown.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-300">{item.label}</span>
                    <span className="text-white font-semibold">{item.score}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ delay: i * 0.1, duration: 0.8, ease: 'easeOut' }}
                      className={`h-2 rounded-full bg-${item.color}-400`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Strengths', items: result.strengths, icon: <CheckCircle2 className="text-emerald-400" />, border: 'border-emerald-500/30', text: 'text-emerald-300' },
              { title: 'Weaknesses', items: result.weaknesses, icon: <AlertTriangle className="text-yellow-400" />, border: 'border-yellow-500/30', text: 'text-yellow-300' },
              { title: 'Formatting', items: result.formatting, icon: <FileCheck className="text-sky-400" />, border: 'border-sky-500/30', text: 'text-sky-300' },
            ].map((section) => (
              <div key={section.title} className={`glass rounded-xl p-6 border ${section.border}`}>
                <h3 className={`font-semibold flex items-center gap-2 mb-4 ${section.text}`}>
                  {section.icon} {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ATSAnalyzer;

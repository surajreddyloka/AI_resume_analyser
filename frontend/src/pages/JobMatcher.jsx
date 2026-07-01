import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, CheckCircle2, XCircle } from 'lucide-react';

const JobMatcher = () => {
  const [jd, setJd] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const analyze = async () => {
    const resumeStr = localStorage.getItem('currentResume');
    if (!resumeStr) {
      alert("No resume found. Please upload a resume on the Dashboard first.");
      return;
    }
    const currentResume = JSON.parse(resumeStr);
    const resumeId = currentResume.id;

    if (!resumeId) {
      alert("Invalid resume data. Please upload your resume again.");
      return;
    }

    setAnalyzing(true);
    try {
      // 1. Create Job with JD
      const jobResponse = await fetch('http://localhost:8000/api/v1/matching/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: "Custom Title",
          company: "Custom Company",
          description: jd
        })
      });
      if (!jobResponse.ok) throw new Error('Failed to create job context');
      const jobData = await jobResponse.json();
      const jobId = jobData.id;

      // 2. Match Resume to Job
      const matchResponse = await fetch(`http://localhost:8000/api/v1/matching/match/${resumeId}/${jobId}`, {
        method: 'POST'
      });
      if (!matchResponse.ok) throw new Error('Failed to match resume to job');
      const matchData = await matchResponse.json();
      
      setResult({
        score: Math.round(matchData.match_score) || 0,
        matched: matchData.match_details?.matched_skills || [],
        missing: matchData.match_details?.missing_skills || []
      });
    } catch (error) {
      console.error(error);
      alert("Failed to analyze job match. Please ensure backend is running.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Job Matcher (Semantic Search)</h1>
        <p className="text-gray-400 mt-2">Paste a Job Description to compare against your resume using vector embeddings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-2xl p-6 flex flex-col h-[600px]">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Search className="text-indigo-400" />
            Job Description
          </h2>
          <textarea 
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste Job Description here..."
            className="flex-1 w-full bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
          />
          <button 
            onClick={analyze}
            disabled={!jd || analyzing}
            className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-3 rounded-xl transition-all flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]"
          >
            {analyzing ? <span className="animate-pulse">Computing Embeddings...</span> : <><Zap size={20} /> Match JD to Resume</>}
          </button>
        </div>

        {result ? (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-8 h-[600px] overflow-y-auto"
          >
            <div className="flex flex-col items-center justify-center py-6 border-b border-gray-800">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="88" fill="none" stroke="#1f2937" strokeWidth="12" />
                  <circle 
                    cx="96" cy="96" r="88" fill="none" stroke="#4ade80" strokeWidth="12" 
                    strokeDasharray={2 * Math.PI * 88} 
                    strokeDashoffset={2 * Math.PI * 88 * (1 - result.score / 100)} 
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-white">{result.score}%</span>
                  <span className="text-sm text-gray-400 mt-1">Match Rate</span>
                </div>
              </div>
            </div>

            <div className="py-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-emerald-400 flex items-center gap-2 mb-3">
                  <CheckCircle2 size={20} /> Skills Found
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.matched.map(s => (
                    <span key={s} className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-rose-400 flex items-center gap-2 mb-3">
                  <XCircle size={20} /> Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missing.map(s => (
                    <span key={s} className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="glass rounded-2xl flex items-center justify-center h-[600px] text-gray-500">
            Results will appear here
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMatcher;

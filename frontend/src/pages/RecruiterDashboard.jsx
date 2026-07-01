import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, TrendingUp, Filter, Star, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import API_BASE from '../config';

const RecruiterDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [skillData, setSkillData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candRes, skillRes] = await Promise.all([
          fetch(`${API_BASE}/api/v1/recruiter/candidates`),
          fetch(`${API_BASE}/api/v1/recruiter/skill-heatmap`)
        ]);
        if (candRes.ok && skillRes.ok) {
          const candData = await candRes.json();
          const skillData = await skillRes.json();
          
          // Map backend format to frontend expected format
          const mappedCandidates = candData.candidates.map(c => ({
            id: c.id,
            name: c.name,
            role: c.role || 'Candidate', // Default since backend might not have role without job matching
            score: c.ats_score || 0, // Using ATS score as overall match since we don't have job context here
            skills: c.skills || [],
            ats: c.ats_score || 0
          }));
          
          setCandidates(mappedCandidates);
          setSkillData(skillData.skills);
          if (mappedCandidates.length > 0) {
            setSelected(mappedCandidates[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load recruiter data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(filter.toLowerCase()))
  );

  if (loading) {
    return <div className="p-8 flex items-center justify-center text-white"><Loader2 className="animate-spin mr-2" /> Loading Recruiter Data...</div>;
  }
  
  if (candidates.length === 0) {
    return <div className="p-8 text-white">No candidates found. Upload a resume first!</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Users className="text-sky-400" /> Recruiter Analytics Dashboard
        </h1>
        <p className="text-gray-400 mt-2">View candidate rankings, skill heatmaps, and shortlist top talent.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Candidates', value: candidates.length, icon: <Users size={22} className="text-sky-400" />, color: 'sky' },
          { label: 'Avg. Match Score', value: `${Math.round(candidates.reduce((a, c) => a + c.score, 0) / candidates.length)}%`, icon: <TrendingUp size={22} className="text-emerald-400" />, color: 'emerald' },
          { label: 'Shortlisted', value: candidates.filter(c => c.score >= 80).length, icon: <Star size={22} className="text-yellow-400" />, color: 'yellow' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center`}>{stat.icon}</div>
            <div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leaderboard */}
        <div className="lg:col-span-1 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Trophy className="text-yellow-400" size={20} /> Candidate Ranking</h2>
          </div>
          <div className="relative mb-4">
            <Filter size={16} className="absolute left-3 top-3 text-gray-500" />
            <input
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Filter by name or skill..."
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div className="space-y-2">
            {filtered.map((c, i) => (
              <motion.button
                key={c.id}
                onClick={() => setSelected(c)}
                whileHover={{ scale: 1.01 }}
                className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-4 ${
                  selected.id === c.id ? 'bg-sky-500/10 border border-sky-500/30' : 'bg-white/5 border border-white/5 hover:bg-white/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}>#{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.role}</p>
                </div>
                <div className={`text-lg font-bold ${c.score >= 80 ? 'text-emerald-400' : c.score >= 65 ? 'text-yellow-400' : 'text-rose-400'}`}>
                  {c.score}%
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Candidate Detail Panel */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div key={selected.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{selected.name}</h2>
                <p className="text-gray-400">{selected.role}</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-emerald-400">{selected.score}%</p>
                <p className="text-xs text-gray-400 mt-1">Overall Match</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {selected.skills.map(s => (
                <span key={s} className="px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm">{s}</span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/50 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">ATS Score</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-white">{selected.ats}</p>
                  <p className="text-gray-500 mb-1">/100</p>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                  <div className="bg-indigo-400 h-1.5 rounded-full" style={{ width: `${selected.ats}%` }} />
                </div>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Semantic Match</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-white">{selected.score}</p>
                  <p className="text-gray-500 mb-1">%</p>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                  <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${selected.score}%` }} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skill Heatmap */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Team Skill Heatmap</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={skillData} layout="vertical">
                <XAxis type="number" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis dataKey="skill" type="category" stroke="#4b5563" tick={{ fill: '#d1d5db', fontSize: 12 }} width={80} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="count" fill="#38bdf8" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;

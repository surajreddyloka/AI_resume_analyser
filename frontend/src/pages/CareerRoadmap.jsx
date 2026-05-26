import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Loader2, Award, BookOpen, Code2, ChevronRight } from 'lucide-react';

const CareerRoadmap = () => {
  const [skills, setSkills] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  const generateRoadmap = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRoadmap({
        missing_skills: ['Docker', 'Kubernetes', 'MLOps', 'LangChain', 'Vector Databases'],
        roadmap: [
          {
            step: 1,
            title: 'Phase 1: Core ML Fundamentals',
            description: 'Solidify your mathematical and algorithmic foundations for machine learning.',
            skills_to_learn: ['Linear Algebra', 'Statistics', 'Scikit-learn', 'Feature Engineering'],
          },
          {
            step: 2,
            title: 'Phase 2: Deep Learning & LLMs',
            description: 'Learn the architectures powering modern AI — Transformers, attention mechanisms, and fine-tuning.',
            skills_to_learn: ['PyTorch', 'Transformers (HuggingFace)', 'Fine-tuning LLMs', 'LangChain'],
          },
          {
            step: 3,
            title: 'Phase 3: MLOps & Production',
            description: 'Learn to deploy, monitor, and scale AI systems in production environments.',
            skills_to_learn: ['Docker', 'Kubernetes', 'MLflow', 'CI/CD for ML', 'Vector Databases'],
          },
          {
            step: 4,
            title: 'Phase 4: Specialization & Portfolio',
            description: 'Build 3–5 high-impact GenAI projects and contribute to open-source to stand out.',
            skills_to_learn: ['RAG Pipelines', 'AI Agents', 'Full-Stack AI Apps', 'Open Source Contribution'],
          },
        ],
        certifications_recommended: [
          'Google Professional ML Engineer',
          'AWS Certified Machine Learning – Specialty',
          'DeepLearning.AI Specializations',
        ],
      });
    }, 2500);
  };

  const phaseColors = ['indigo', 'purple', 'violet', 'fuchsia'];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Compass className="text-violet-400" /> Personalized Career Roadmap
        </h1>
        <p className="text-gray-400 mt-2">
          Tell us where you are and where you want to be. Gemini will generate your personalized AI-driven learning path.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Your Current Skills</label>
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Python, React, SQL, Data Analysis"
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-violet-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Target Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. ML Engineer, GenAI Engineer"
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-violet-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={generateRoadmap}
            disabled={!skills || !role || loading}
            className="bg-violet-500 hover:bg-violet-400 disabled:bg-gray-700 disabled:text-gray-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Generating with Gemini...</> : <><Compass size={18} /> Generate My Roadmap</>}
          </button>
        </div>
      </div>

      {roadmap && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Missing Skills */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Code2 className="text-rose-400" /> Skills to Acquire
            </h2>
            <div className="flex flex-wrap gap-3">
              {roadmap.missing_skills.map((s) => (
                <span key={s} className="px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-violet-500 to-fuchsia-500" />
            <div className="space-y-6">
              {roadmap.roadmap.map((phase, i) => (
                <motion.div
                  key={phase.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="relative pl-20"
                >
                  <div className={`absolute left-4 w-8 h-8 rounded-full bg-${phaseColors[i]}-500 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(139,92,246,0.5)]`}>
                    {phase.step}
                  </div>
                  <div className="glass rounded-2xl p-6 hover:border-violet-500/30 transition-all">
                    <h3 className={`text-xl font-bold text-${phaseColors[i]}-400 mb-2`}>{phase.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{phase.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {phase.skills_to_learn.map((skill) => (
                        <span key={skill} className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
                          <ChevronRight size={14} className={`text-${phaseColors[i]}-400`} /> {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="text-yellow-400" /> Recommended Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roadmap.certifications_recommended.map((cert, i) => (
                <div key={i} className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <Award className="text-yellow-400 flex-shrink-0" size={20} />
                  <span className="text-yellow-200 text-sm font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CareerRoadmap;

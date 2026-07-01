import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Save } from 'lucide-react';

const ResumeEnhancer = () => {
  const [bullet, setBullet] = useState('');
  const [enhancing, setEnhancing] = useState(false);
  const [results, setResults] = useState(null);

  const enhance = async () => {
    setEnhancing(true);
    setResults(null);
    try {
      const response = await fetch('http://localhost:8000/api/v1/ai/enhance-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet })
      });
      if (!response.ok) throw new Error('Failed to enhance bullet');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
      alert('Failed to enhance bullet point. Please ensure backend is running.');
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Sparkles className="text-purple-400" /> AI Bullet Point Enhancer
        </h1>
        <p className="text-gray-400 mt-2">Paste a weak resume bullet point and let Gemini transform it into a powerful, metric-driven statement.</p>
      </div>

      <div className="glass rounded-2xl p-6 mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-2">Original Bullet Point</label>
        <textarea 
          value={bullet}
          onChange={(e) => setBullet(e.target.value)}
          placeholder="e.g. I made a website that was faster..."
          className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-white focus:ring-1 focus:ring-purple-500 resize-none h-32"
        />
        <div className="flex justify-end mt-4">
          <button 
            onClick={enhance}
            disabled={!bullet || enhancing}
            className="bg-purple-500 hover:bg-purple-400 disabled:bg-gray-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
          >
            {enhancing ? 'Enhancing with Gemini...' : 'Enhance Bullet Point'} <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {results && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {Object.entries(results).map(([key, value], i) => (
            <div key={key} className="glass rounded-xl p-6 relative group hover:border-purple-500/50 transition-all cursor-pointer">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10">
                  <Save size={18} />
                </button>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 mb-4 border-b border-purple-500/20 pb-2">
                {key.replace('_', ' ')} Version
              </h3>
              <p className="text-gray-200 leading-relaxed text-sm">
                "{value}"
              </p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ResumeEnhancer;

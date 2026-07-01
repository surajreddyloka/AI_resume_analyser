import React, { useState } from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API_BASE from '../config';

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const displayName = userProfile?.full_name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'there';
  const photoURL = userProfile?.photo_url || currentUser?.photoURL;

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setIsAnalyzed(false); // Reset on new file
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const idToken = currentUser ? await currentUser.getIdToken() : null;
      const headers = {};
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }
      
      const response = await fetch(`${API_BASE}/api/v1/resumes/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }

      const data = await response.json();
      localStorage.setItem('currentResume', JSON.stringify(data));
      
      setUploading(false);
      setIsAnalyzed(true);
      alert('Resume Uploaded & Parsed Successfully!');
    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);
      alert('Failed to process resume. Please ensure the backend is running.');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsAnalyzed(false);
    }
  };

  // Get current resume from local storage for stats
  const currentResumeStr = localStorage.getItem('currentResume');
  const currentResume = currentResumeStr ? JSON.parse(currentResumeStr) : null;
  const atsScore = currentResume?.ats_score || '📊';
  const skillsCount = currentResume?.parsed_data?.skills?.length ?? '🛠️';
  const improvementsCount = currentResume?.ats_feedback?.weaknesses?.length ?? '✨';

  return (
    <div className="p-8 space-y-8 min-h-screen">
      {/* Personalized Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {photoURL ? (
            <img src={photoURL} alt={displayName} className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/40" />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-white">Hello, {displayName} 👋</h1>
            <p className="text-gray-400 mt-0.5 text-sm">Upload your resume to start AI analysis.</p>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 max-w-2xl mx-auto"
      >
        <div 
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${file ? 'border-emerald-500 bg-emerald-500/5' : 'border-gray-600 hover:border-gray-400 hover:bg-white/5'}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('resume-upload').click()}
        >
          <input 
            type="file" 
            id="resume-upload" 
            className="hidden" 
            accept=".pdf,.docx,.doc" 
            onChange={handleFileChange} 
          />
          {file ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-400" />
              <div className="text-xl font-semibold text-white">{file.name}</div>
              <p className="text-sm text-emerald-400/80">Ready for analysis. Click to change file.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <UploadCloud className="w-16 h-16 text-gray-400" />
              <div className="text-xl font-medium text-white">Drag & drop or <span className="text-emerald-400 underline decoration-emerald-400/30 underline-offset-4">browse files</span></div>
              <p className="text-sm text-gray-400">Support PDF and DOCX files up to 10MB</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={uploadFile}
            disabled={!file || uploading}
            className={`px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all ${
              !file ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : uploading ? 'bg-emerald-500/50 text-white cursor-wait'
              : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]'
            }`}
          >
            {uploading ? 'Analyzing with AI...' : 'Analyze Resume'}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        {[
          { title: 'ATS Score', value: isAnalyzed || currentResume ? `${atsScore}/100` : '📊', color: 'emerald' },
          { title: 'Skills Extracted', value: isAnalyzed || currentResume ? skillsCount : '🛠️', color: 'indigo' },
          { title: 'Improvements Found', value: isAnalyzed || currentResume ? improvementsCount : '✨', color: 'purple' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            key={i} 
            className="glass rounded-xl p-6"
          >
            <h3 className="text-gray-400 font-medium">{stat.title}</h3>
            <p className={`text-4xl font-bold mt-2 text-${stat.color}-400`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Volume2, Award, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const MockInterview = () => {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(prev => prev + ' ' + currentTranscript);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
      analyzeResponse();
    } else {
      setTranscript('');
      setFeedback(null);
      recognitionRef.current?.start();
      setRecording(true);
    }
  };

  const analyzeResponse = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setFeedback({
        score: 8.5,
        comments: "Strong answer. You clearly explained the architecture of React and its unidirectional data flow. However, you could improve by mentioning the Virtual DOM in more detail.",
        strengths: ["Clear communication", "Good technical vocabulary"],
        improvements: ["Mention Virtual DOM", "Speak slightly slower"]
      });
    }, 3000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Mic className="text-rose-400" /> AI Mock Interview
          </h1>
          <p className="text-gray-400 mt-2">Practice answering technical questions with real-time voice analysis.</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-8 mb-8 border-t-4 border-t-indigo-500">
        <h2 className="text-sm font-bold uppercase text-indigo-400 mb-2 flex items-center gap-2">
          <Volume2 size={16} /> Question 1 of 5
        </h2>
        <p className="text-2xl text-white font-medium leading-relaxed">
          "Can you explain the difference between state and props in React, and when you would use context API over Redux?"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass rounded-2xl p-6 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-4">
            <h3 className="font-semibold text-white">Your Response</h3>
            <button 
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                recording ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 animate-pulse' : 'bg-emerald-500 hover:bg-emerald-400 text-white'
              }`}
            >
              {recording ? <><Square size={16} /> Stop Recording</> : <><Mic size={16} /> Start Answering</>}
            </button>
          </div>
          
          <div className="flex-1 bg-gray-900/50 rounded-xl p-4 overflow-y-auto">
            {transcript ? (
              <p className="text-gray-300 leading-relaxed">{transcript}</p>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 italic">
                {recording ? 'Listening to your voice...' : 'Click "Start Answering" to begin speaking. Ensure your microphone is allowed.'}
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 h-[400px] overflow-y-auto">
          <h3 className="font-semibold text-white mb-4 border-b border-gray-800 pb-4 flex items-center gap-2">
            <Award className="text-yellow-400" /> AI Evaluation
          </h3>
          
          {analyzing ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-indigo-400 font-medium">Gemini is analyzing your response...</p>
            </div>
          ) : feedback ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-white bg-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                  {feedback.score}
                </div>
                <div>
                  <div className="text-xl font-bold text-white">Score out of 10</div>
                  <div className="text-sm text-gray-400">Technical Accuracy & Delivery</div>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-gray-300 text-sm leading-relaxed">{feedback.comments}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-bold text-emerald-400 mb-2">Strengths</h4>
                  <ul className="space-y-1">
                    {feedback.strengths.map((s,i) => <li key={i} className="text-sm text-gray-300 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>{s}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-rose-400 mb-2">To Improve</h4>
                  <ul className="space-y-1">
                    {feedback.improvements.map((s,i) => <li key={i} className="text-sm text-gray-300 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>{s}</li>)}
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center px-8">
              <AlertCircle size={48} className="mb-4 opacity-50" />
              <p>Complete your recording to receive an AI-generated evaluation of your answer.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockInterview;

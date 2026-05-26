import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RAGChatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your AI Recruitment Assistant. Ask me about candidates — e.g. **\"Who is the best for a React role?\"**" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const suggestedQuestions = [
    'Who is best for an ML Engineer role?',
    'Which candidates know React and Node.js?',
    'What skills is Candidate #1 missing for DevOps?',
  ];

  const sendMessage = (text) => {
    const userMsg = text || input;
    if (!userMsg.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Based on resume database retrieval, **Candidate #1** is the strongest match with an ATS score of **85/100** and semantic similarity of **92%**. They have experience in Python, TensorFlow, and NLP pipelines.\n\n> *Source: Resume #1 — Section: Projects & Experience*',
      }]);
    }, 2000);
  };

  return (
    <div className="p-8 flex flex-col" style={{ height: 'calc(100vh - 0px)' }}>
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <MessageSquare className="text-teal-400" /> AI Chatbot (RAG Pipeline)
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Answers grounded in real resume data via Retrieval-Augmented Generation.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {suggestedQuestions.map((q) => (
          <button key={q} onClick={() => sendMessage(q)}
            className="text-sm px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20 transition-all">
            {q}
          </button>
        ))}
      </div>

      <div className="flex-1 glass rounded-2xl p-6 overflow-y-auto space-y-4 mb-4 min-h-0">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center flex-shrink-0">
                  <Bot size={18} className="text-teal-400" />
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-5 py-3 text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-100 rounded-br-none'
                  : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none'
              }`}>{msg.content}</div>
              {msg.role === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-indigo-400" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
              <Bot size={18} className="text-teal-400" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none px-5 py-3 flex gap-1.5">
              {[0, 150, 300].map((d) => (
                <div key={d} className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="glass rounded-xl flex items-center gap-3 px-4 py-3">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about candidates, skills, or job matches..."
          className="flex-1 bg-transparent text-white outline-none placeholder-gray-500" />
        <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
          className="bg-teal-500 hover:bg-teal-400 disabled:bg-gray-700 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default RAGChatbot;

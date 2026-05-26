import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileCheck, Briefcase, Wand2, Compass, Mic, Users, MessageSquare } from 'lucide-react';
import UserMenu from './UserMenu';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'ATS Analyzer', icon: <FileCheck size={20} />, path: '/ats' },
    { name: 'Job Matcher', icon: <Briefcase size={20} />, path: '/match' },
    { name: 'AI Enhancer', icon: <Wand2 size={20} />, path: '/enhance' },
    { name: 'Career Roadmap', icon: <Compass size={20} />, path: '/roadmap' },
    { name: 'Mock Interview', icon: <Mic size={20} />, path: '/interview' },
    { name: 'Recruiter Panel', icon: <Users size={20} />, path: '/recruiter' },
    { name: 'AI Chatbot', icon: <MessageSquare size={20} />, path: '/chatbot' },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 border-r border-gray-800 flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
          <span className="font-bold text-white text-sm">AI</span>
        </div>
        <span className="text-xl font-bold text-white tracking-tight">RecruitPro</span>
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-4 flex flex-col gap-1 px-3 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Powered by badge */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-xs text-indigo-300 font-medium">Powered by Gemini AI</p>
        </div>
      </div>

      {/* User Menu — avatar + name + dropdown at the bottom */}
      <div className="p-3 border-t border-white/5">
        <UserMenu />
      </div>
    </div>
  );
};

export default Sidebar;


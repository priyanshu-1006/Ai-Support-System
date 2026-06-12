import React from 'react';
import { PlusCircle, MessageSquare, Settings } from 'lucide-react';

export default function Sidebar() {
  const mockHistory = [
    "How to reset password?",
    "What is the warranty period?",
    "Return policy for laptops",
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full hidden md:flex">
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        <h2 className="font-bold text-lg tracking-wide text-blue-400">Gryork AI</h2>
      </div>

      <div className="p-4">
        <button className="flex items-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
          <PlusCircle size={18} />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
          Recent
        </div>
        <div className="space-y-1">
          {mockHistory.map((title, i) => (
            <button
              key={i}
              className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors"
            >
              <MessageSquare size={16} className="text-slate-500" />
              <span className="truncate">{title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors w-full">
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}

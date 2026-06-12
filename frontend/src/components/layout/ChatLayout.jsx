import React from 'react';
import Sidebar from '../chat/Sidebar';
import ChatArea from '../chat/ChatArea';

export default function ChatLayout() {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <ChatArea />
    </div>
  );
}

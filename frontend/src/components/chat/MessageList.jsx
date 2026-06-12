import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

export default function MessageList({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-slate-50">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
          <p>Start a new conversation!</p>
        </div>
      ) : (
        messages.map((msg, idx) => <MessageBubble key={idx} message={msg} />)
      )}
      <div ref={bottomRef} />
    </div>
  );
}

import React, { useState } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

export default function ChatArea() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am the Gryork AI Support Assistant. How can I help you today?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (text) => {
    // Add user message
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Mock API delay
    setTimeout(() => {
      const aiMsg = {
        role: 'assistant',
        content: `I received your message: "${text}". \n\n*Note: This is a mock response because the backend API is not yet connected.*`,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative shadow-inner">
      {/* Header for mobile or title */}
      <div className="h-14 border-b border-slate-200 flex items-center px-6 bg-white shrink-0 shadow-sm z-10">
        <h3 className="font-semibold text-slate-800">Chat Support</h3>
      </div>
      
      <MessageList messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

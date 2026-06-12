import { useEffect, useRef } from 'react';
import { Message } from './Message.jsx';
import { Spinner } from '../ui/Loading.jsx';

export function MessageList({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start a conversation to begin</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <Message
              key={msg.id}
              message={msg}
              isUser={msg.role === 'user'}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-200 rounded-lg p-4">
                <Spinner size="sm" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}

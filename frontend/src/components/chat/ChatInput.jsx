import { useState, useRef } from 'react';
import { Button } from '../ui/Button.jsx';

export function ChatInput({ onSend, isLoading, placeholder = 'Type your message...' }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage('');
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="p-4 glass-panel border-x-0 border-b-0 sticky bottom-0">
      <form onSubmit={handleSend} className="flex gap-3 max-w-4xl mx-auto w-full">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          rows={3}
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="self-end"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  );
}

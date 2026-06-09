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
    <form onSubmit={handleSend} className="border-t border-gray-200 p-4">
      <div className="flex gap-3">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      </div>
    </form>
  );
}

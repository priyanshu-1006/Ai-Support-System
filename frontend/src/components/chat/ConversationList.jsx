import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';
import { Trash2 } from 'lucide-react';

export function ConversationList({ conversations, onNewChat, isLoading, onDeleteChat }) {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
      onDeleteChat(id);
      if (conversationId === id) {
        navigate('/chat');
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full glass-panel border-y-0 border-l-0 rounded-none transition-colors">
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full"
          variant="primary"
          disabled={isLoading}
        >
          + New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            No conversations yet
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conv) => (
              <div key={conv.id} className="group relative">
                <Link
                  to={`/chat/${conv.id}`}
                  className={`block p-3 pr-10 rounded-lg text-sm truncate transition-colors ${
                    conversationId === conv.id
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {conv.title || `Chat ${new Date(conv.createdAt).toLocaleDateString()}`}
                </Link>
                <button
                  onClick={(e) => handleDelete(e, conv.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-all"
                  title="Delete conversation"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-slate-800 p-4 mt-auto">
        <Link
          to="/settings"
          className="block text-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors"
        >
          Settings
        </Link>
      </div>
    </div>
  );
}

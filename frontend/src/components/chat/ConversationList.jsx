import { Link, useParams } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';

export function ConversationList({ conversations, onNewChat, isLoading }) {
  const { conversationId } = useParams();

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-slate-900 transition-colors">
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
              <Link
                key={conv.id}
                to={`/chat/${conv.id}`}
                className={`block p-3 rounded-lg text-sm truncate transition-colors ${
                  conversationId === conv.id
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800'
                }`}
              >
                {conv.title || `Chat ${new Date(conv.createdAt).toLocaleDateString()}`}
              </Link>
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

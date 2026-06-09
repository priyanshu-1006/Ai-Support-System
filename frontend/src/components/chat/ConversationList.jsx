import { Link, useParams } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';

export function ConversationList({ conversations, onNewChat, isLoading }) {
  const { conversationId } = useParams();

  return (
    <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
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
          <div className="p-4 text-center text-gray-500 text-sm">
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
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {conv.title || `Chat ${new Date(conv.createdAt).toLocaleDateString()}`}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-4">
        <Link
          to="/settings"
          className="block text-center text-gray-700 hover:text-gray-900 text-sm font-medium"
        >
          Settings
        </Link>
      </div>
    </div>
  );
}

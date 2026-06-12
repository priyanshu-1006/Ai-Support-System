import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatHistory, useConversation, useSendMessage } from '../hooks/useChatAPI.js';
import { ConversationList } from '../components/chat/ConversationList.jsx';
import { MessageList } from '../components/chat/MessageList.jsx';
import { ChatInput } from '../components/chat/ChatInput.jsx';
import { Spinner } from '../components/ui/Loading.jsx';
import { Alert } from '../components/ui/Alert.jsx';
import { Menu, X } from 'lucide-react';

export function ChatPage() {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const [currentMessages, setCurrentMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch conversation history
  const { data: conversations = [], isLoading: historyLoading } = useChatHistory();

  // Fetch specific conversation
  const {
    data: conversation,
    isLoading: convLoading,
    error: convError,
  } = useConversation(conversationId);

  // Send message mutation
  const { mutate: sendMessage, isPending: isSending, error: sendError } = useSendMessage();

  // Update messages when conversation changes
  useEffect(() => {
    if (conversation?.messages) {
      setCurrentMessages(conversation.messages);
    } else if (!conversationId) {
      setCurrentMessages([]);
    }
  }, [conversation, conversationId]);

  const handleSendMessage = (message) => {
    if (!conversationId) return;

    const userMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    };

    setCurrentMessages((prev) => [...prev, userMessage]);

    sendMessage(
      {
        conversationId,
        message,
        stream: true,
      },
      {
        onSuccess: (response) => {
          const assistantMessage = response.data.data;
          setCurrentMessages((prev) => [
            ...prev.filter((m) => !m.id.startsWith('temp-')),
            assistantMessage,
          ]);
        },
      }
    );
  };

  const handleNewChat = () => {
    setCurrentMessages([]);
    setIsSidebarOpen(false);
    navigate('/chat');
  };

  if (historyLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-73px)] bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-72 transform bg-gray-50 dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-200 dark:border-slate-800">
          <span className="font-semibold text-gray-900 dark:text-white">Conversations</span>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <ConversationList
          conversations={conversations}
          onNewChat={handleNewChat}
          isLoading={historyLoading}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {convError && !conversationId ? null : convError ? (
          <div className="flex items-center justify-center h-full">
            <Alert
              type="error"
              message="Failed to load conversation"
              onClose={() => navigate('/chat')}
            />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-slate-800 px-4 py-4 flex items-center gap-3">
              <button 
                className="md:hidden p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                {conversation?.title || 'New Chat'}
              </h1>
            </div>

            {/* Messages */}
            {convLoading ? (
              <div className="flex items-center justify-center h-full">
                <Spinner size="lg" />
              </div>
            ) : (
              <>
                <MessageList messages={currentMessages} isLoading={isSending} />
                {sendError && (
                  <Alert
                    type="error"
                    message="Failed to send message"
                    duration={5000}
                  />
                )}
                <ChatInput onSend={handleSendMessage} isLoading={isSending} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

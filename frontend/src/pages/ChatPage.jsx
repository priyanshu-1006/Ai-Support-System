import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatHistory, useConversation, useSendMessage } from '../hooks/useChatAPI.js';
import { ConversationList } from '../components/chat/ConversationList.jsx';
import { MessageList } from '../components/chat/MessageList.jsx';
import { ChatInput } from '../components/chat/ChatInput.jsx';
import { Spinner } from '../components/ui/Loading.jsx';
import { Alert } from '../components/ui/Alert.jsx';

export function ChatPage() {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const [currentMessages, setCurrentMessages] = useState([]);

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
    navigate('/chat');
  };

  if (historyLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <ConversationList
        conversations={conversations}
        onNewChat={handleNewChat}
        isLoading={historyLoading}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
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
            <div className="border-b border-gray-200 px-6 py-4">
              <h1 className="text-xl font-semibold text-gray-900">
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

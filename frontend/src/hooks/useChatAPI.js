import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatAPI } from '../api/endpoints.js';

export function useChatHistory(limit = 20, offset = 0) {
  return useQuery({
    queryKey: ['chatHistory', limit, offset],
    queryFn: () => chatAPI.getHistory(limit, offset),
    select: (response) => response.data.data,
  });
}

export function useConversation(conversationId) {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => chatAPI.getConversation(conversationId),
    select: (response) => response.data.data,
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, message, stream }) =>
      chatAPI.sendMessage(conversationId, message, stream),
    onSuccess: (response, variables) => {
      // Invalidate conversation cache
      queryClient.invalidateQueries({
        queryKey: ['conversation', variables.conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ['chatHistory'],
      });
    },
  });
}

export function useMessageFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, feedback, comment }) =>
      chatAPI.feedback(messageId, feedback, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation'] });
    },
  });
}

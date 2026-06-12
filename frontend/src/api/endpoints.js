import api from './client.js';

// Auth endpoints
export const authAPI = {
  signup: (email, password, name) =>
    api.post('/auth/signup', { email, password, name }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  getProfile: () =>
    api.get('/auth/profile'),

  refreshToken: (refreshToken) =>
    api.post('/auth/refresh-token', { refreshToken }),

  logout: () =>
    api.post('/auth/logout'),
};

// Chat endpoints
export const chatAPI = {
  sendMessage: (conversationId, message, stream = true) =>
    api.post('/chat', { conversationId, message, stream }),

  getHistory: (limit = 20, offset = 0) =>
    api.get('/chat/history', { params: { limit, offset } }),

  getConversation: (conversationId) =>
    api.get(`/chat/${conversationId}`),

  feedback: (messageId, feedback, comment = '') =>
    api.post(`/chat/${messageId}/feedback`, { feedback, comment }),

  deleteConversation: (conversationId) =>
    api.delete(`/chat/${conversationId}`),
};

// Document endpoints
export const documentAPI = {
  upload: (file, title = '') => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);

    return api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  list: (limit = 20, offset = 0, status = '', search = '') =>
    api.get('/documents', {
      params: { limit, offset, status, search },
    }),

  getOne: (documentId) =>
    api.get(`/documents/${documentId}`),

  delete: (documentId) =>
    api.delete(`/documents/${documentId}`),
};

// Admin endpoints
export const adminAPI = {
  getUsers: (limit = 20, offset = 0, role = '', search = '') =>
    api.get('/admin/users', {
      params: { limit, offset, role, search },
    }),

  updateUserRole: (userId, role) =>
    api.put(`/admin/users/${userId}`, { role }),

  getAnalyticsOverview: (startDate = '', endDate = '') =>
    api.get('/admin/analytics/overview', {
      params: { startDate, endDate },
    }),

  getConversationMetrics: (startDate = '', endDate = '', granularity = 'daily') =>
    api.get('/admin/analytics/conversations', {
      params: { startDate, endDate, granularity },
    }),

  getPopularQuestions: (limit = 10, days = 30) =>
    api.get('/admin/analytics/questions', {
      params: { limit, days },
    }),

  getModelUsage: () =>
    api.get('/admin/analytics/models'),
};

export default {
  auth: authAPI,
  chat: chatAPI,
  documents: documentAPI,
  admin: adminAPI,
};

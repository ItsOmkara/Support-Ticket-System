import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ticketService = {
  getTickets: (params) => api.get('/tickets/', { params }),
  createTicket: (data) => api.post('/tickets/', data),
  updateTicket: (id, data) => api.patch(`/tickets/${id}/`, data),
  getStats: () => api.get('/tickets/stats/'),
  classifyTicket: (description) => api.post('/tickets/classify/', { description }),
};

export default api;

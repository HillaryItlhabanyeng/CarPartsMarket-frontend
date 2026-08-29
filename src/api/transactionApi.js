import { apiClient } from './client'

export const transactionApi = {
  getAll: () => apiClient.get('/transaction/getAll'),
  getById: (id) => apiClient.get(`/transaction/read/${id}`),
  create: (transaction) => apiClient.post('/transaction/create', transaction),
  update: (transaction) => apiClient.put('/transaction/update', transaction),
  delete: (id) => apiClient.delete(`/transaction/delete/${id}`),
}

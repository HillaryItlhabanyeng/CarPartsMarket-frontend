import { apiClient } from './client'

export const orderApi = {
  getAll: () => apiClient.get('/order/getAll'),
  getById: (id) => apiClient.get(`/order/read/${id}`),
  create: (order) => apiClient.post('/order/create', order),
  update: (order) => apiClient.put('/order/update', order),
  delete: (id) => apiClient.delete(`/order/delete/${id}`),
}

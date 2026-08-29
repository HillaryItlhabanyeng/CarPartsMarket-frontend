import { apiClient } from './client'

export const vehicleApi = {
  getAll: () => apiClient.get('/vehicle/getAll'),
  getById: (id) => apiClient.get(`/vehicle/read/${id}`),
  create: (vehicle) => apiClient.post('/vehicle/create', vehicle),
  update: (vehicle) => apiClient.put('/vehicle/update', vehicle),
  delete: (id) => apiClient.delete(`/vehicle/delete/${id}`),
}

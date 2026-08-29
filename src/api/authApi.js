import { apiClient } from './client'

// Matches AuthController: POST /api/auth/login
export function loginRequest(email, password) {
  return apiClient.post('/auth/login', { email, password })
}

// Matches AuthController: POST /api/auth/register/buyer
export function registerBuyer(data) {
  return apiClient.post('/auth/register/buyer', data)
}

// Matches AuthController: POST /api/auth/register/seller
export function registerSeller(data) {
  return apiClient.post('/auth/register/seller', data)
}

// Matches AuthController: POST /api/auth/register/admin
export function registerAdmin(data) {
  return apiClient.post('/auth/register/admin', data)
}

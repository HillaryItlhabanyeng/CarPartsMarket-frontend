import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Wrap a route element to require authentication, and optionally restrict
 * it to specific roles.
 *
 * Usage:
 *   <Route path="/orders" element={
 *     <ProtectedRoute roles={['buyer', 'seller']}>
 *       <OrdersPage />
 *     </ProtectedRoute>
 *   } />
 */
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role, loading } = useAuth()

  if (loading) return null // or a spinner

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return children
}

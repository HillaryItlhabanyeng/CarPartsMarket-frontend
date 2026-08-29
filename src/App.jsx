import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VehiclePage from './pages/VehiclePage'
import OrderPage from './pages/OrderPage'
import TransactionPage from './pages/TransactionPage'

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Vehicles: open to any logged-in user; tighten roles as needed */}
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <VehiclePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute roles={['buyer', 'seller', 'admin']}>
              <OrderPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute roles={['buyer', 'seller', 'admin']}>
              <TransactionPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </MainLayout>
  )
}

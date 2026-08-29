import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, user, role, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-beige-dark">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl text-clay">
          CarPartMarket
        </Link>

        <div className="flex items-center gap-6 font-body text-sm text-ink">
          <Link to="/vehicles" className="hover:text-clay transition-colors">
            Vehicles
          </Link>
          <Link to="/orders" className="hover:text-clay transition-colors">
            Orders
          </Link>
          <Link to="/transactions" className="hover:text-clay transition-colors">
            Transactions
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-ink-soft capitalize">
                {role} · {user?.email}
              </span>
              <button onClick={handleLogout} className="btn-secondary">
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="hover:text-clay transition-colors">
                Log in
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

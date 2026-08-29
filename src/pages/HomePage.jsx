import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import freewayImage from '../assets/freeway.jpg'

export default function HomePage() {
  const { isAuthenticated, user, role } = useAuth()

  return (
    <div className="-mx-6 md:-mx-6"> 
      <div className="bg-ink text-cream text-center text-sm py-2 px-6">
        Free listing verification for new sellers this month —{' '}
        <Link to="/register" className="underline underline-offset-2 hover:text-clay">
          get started
        </Link>
      </div>

      
      <section
        className="relative min-h-[560px] flex items-center px-6 md:px-16"
        style={{
          backgroundImage: `url(${freewayImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        
        <div className="absolute inset-0 bg-ink/60" />

        <div className="relative max-w-2xl">
          <span className="text-clay font-medium uppercase tracking-wide text-sm">
            Community marketplace
          </span>
          <h1 className="text-5xl md:text-6xl font-bold uppercase text-white leading-[1.05] mt-3 mb-6">
            Car parts, sourced right.
          </h1>
          <p className="text-lg text-beige mb-8 max-w-lg">
            {isAuthenticated
              ? `Welcome back, ${user?.email} (${role}). Pick up right where you left off.`
              : 'Buy and sell vehicles and hard-to-find spares with a community of verified sellers who actually know cars.'}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/vehicles" className="btn-primary text-base px-6 py-3">
              Browse listings
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="border border-cream text-cream font-medium px-6 py-3 rounded-card hover:bg-cream hover:text-ink transition-colors"
              >
                Start selling
              </Link>
            )}
          </div>
        </div>
      </section>

      
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-display mb-4">Shop by category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Vehicles', 'Engine parts', 'Body & exterior', 'Interior'].map((cat) => (
            <Link
              key={cat}
              to="/vehicles"
              className="card text-center py-8 hover:border-clay transition-colors"
            >
              <span className="font-display text-lg">{cat}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
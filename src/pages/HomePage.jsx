import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
// Drop a hero image into src/assets/ and uncomment the two lines below
// import heroImage from '../assets/hero.jpg'

export default function HomePage() {
  const { isAuthenticated, user, role } = useAuth()

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-10 items-center py-8">
        <div>
          <span className="text-sm text-clay font-medium uppercase tracking-wide">
            Community marketplace
          </span>
          <h1 className="text-5xl mt-2 mb-4 leading-tight">
            Quality car parts,{' '}
            <span className="text-clay">sold by people who know cars.</span>
          </h1>
          <p className="text-ink-soft mb-6">
            {isAuthenticated
              ? `Welcome back, ${user?.email} (${role}).`
              : 'Buy and sell vehicles and parts with a community you trust — from daily drivers to hard-to-find spares.'}
          </p>

          <div className="flex gap-4">
            <Link to="/vehicles" className="btn-primary">
              Browse listings
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn-secondary">
                Start selling
              </Link>
            )}
          </div>
        </div>

        {/* Uncomment once you've added an image to src/assets/
        <img
          src={heroImage}
          alt="Car parts marketplace"
          className="w-full rounded-card shadow-sm object-cover aspect-[4/3]"
        />
        */}
        <div className="w-full rounded-card bg-beige aspect-[4/3] flex items-center justify-center text-ink-soft">
          Hero image goes here
        </div>
      </section>

      {/* Category strip */}
      <section>
        <h2 className="text-2xl mb-4">Shop by category</h2>
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

import { useEffect, useState } from 'react'
import { vehicleApi } from '../api/vehicleApi'
import ProductCard from '../components/ProductCard'

const emptyForm = { make: '', model: '', year: '', vin: '', imageUrl: '', price: '' }

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadVehicles()
  }, [])

  async function loadVehicles() {
    setLoading(true)
    try {
      const data = await vehicleApi.getAll()
      setVehicles(data ?? [])
    } catch (err) {
      setError('Could not load vehicles.')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await vehicleApi.create(form)
      setForm(emptyForm)
      setShowForm(false)
      loadVehicles()
    } catch (err) {
      setError('Could not create vehicle.')
    }
  }

  async function handleDelete(id) {
    try {
      await vehicleApi.delete(id)
      loadVehicles()
    } catch (err) {
      setError('Could not delete vehicle.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl">Vehicles</h1>
          <p className="text-ink-soft mt-1">Browse parts and vehicles listed by our sellers.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Close' : '+ Add vehicle'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-xl mb-4">Add a vehicle</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="make">Make</label>
              <input id="make" name="make" className="input-field" value={form.make} onChange={handleChange} required />
            </div>
            <div>
              <label className="label" htmlFor="model">Model</label>
              <input id="model" name="model" className="input-field" value={form.model} onChange={handleChange} required />
            </div>
            <div>
              <label className="label" htmlFor="year">Year</label>
              <input id="year" name="year" className="input-field" value={form.year} onChange={handleChange} required />
            </div>
            <div>
              <label className="label" htmlFor="vin">VIN</label>
              <input id="vin" name="vin" className="input-field" value={form.vin} onChange={handleChange} required />
            </div>
            <div>
              <label className="label" htmlFor="price">Price</label>
              <input id="price" name="price" className="input-field" placeholder="e.g. 4500" value={form.price} onChange={handleChange} />
            </div>
            <div>
              <label className="label" htmlFor="imageUrl">Photo URL</label>
              <input
                id="imageUrl"
                name="imageUrl"
                className="input-field"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2">
              <button type="submit" className="btn-primary">Add vehicle</button>
            </div>
          </form>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
      )}

      {loading ? (
        <p className="text-ink-soft">Loading…</p>
      ) : vehicles.length === 0 ? (
        <p className="text-ink-soft">No vehicles listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <ProductCard
              key={v.vehicleId ?? v.id}
              image={v.imageUrl}
              title={`${v.make} ${v.model}`}
              subtitle={`${v.year} · VIN ${v.vin}`}
              price={v.price ? `R${v.price}` : null}
              onDelete={() => handleDelete(v.vehicleId ?? v.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

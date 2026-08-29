import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerBuyer, registerSeller, registerAdmin } from '../api/authApi'
import { useAuth } from '../context/AuthContext'

const ROLES = [
  { value: 'buyer', label: 'Buyer' },
  { value: 'seller', label: 'Seller' },
  { value: 'admin', label: 'Admin' },
]

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phoneNumber: '',
  buyingPart: '',   // buyer only
  sellingPart: '',  // seller only
  role: '',         // admin only (permission role label)
  permissions: '',  // admin only
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [selectedRole, setSelectedRole] = useState('buyer')
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function buildPayload() {
    // Matches the Name embeddable (firstName/lastName) plus User base fields.
    const base = {
      name: { firstName: form.firstName, lastName: form.lastName },
      email: form.email,
      password: form.password,
      phoneNumber: form.phoneNumber,
    }

    if (selectedRole === 'buyer') {
      return { ...base, buyerName: base.name, buyingPart: form.buyingPart }
    }
    if (selectedRole === 'seller') {
      return { ...base, sellerName: base.name, sellingPart: form.sellingPart }
    }
    // admin
    return { ...base, role: form.role, permissions: form.permissions }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = buildPayload()
      let created
      if (selectedRole === 'buyer') created = await registerBuyer(payload)
      else if (selectedRole === 'seller') created = await registerSeller(payload)
      else created = await registerAdmin(payload)

      // Log the new user straight in and land on the home page.
      setUser({ ...created, role: selectedRole })
      navigate('/')
    } catch (err) {
      setError('Registration failed. Please check your details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-3xl mb-6">Create an account</h1>

        <div className="flex gap-2 mb-6">
          {ROLES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setSelectedRole(r.value)}
              className={
                selectedRole === r.value
                  ? 'btn-primary flex-1'
                  : 'btn-secondary flex-1'
              }
            >
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="firstName">First name</label>
              <input id="firstName" name="firstName" className="input-field" value={form.firstName} onChange={handleChange} required />
            </div>
            <div>
              <label className="label" htmlFor="lastName">Last name</label>
              <input id="lastName" name="lastName" className="input-field" value={form.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="input-field" value={form.email} onChange={handleChange} required />
          </div>

          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="input-field" value={form.password} onChange={handleChange} required />
          </div>

          <div>
            <label className="label" htmlFor="phoneNumber">Phone number</label>
            <input id="phoneNumber" name="phoneNumber" className="input-field" value={form.phoneNumber} onChange={handleChange} required />
          </div>

          {selectedRole === 'buyer' && (
            <div>
              <label className="label" htmlFor="buyingPart">What are you looking to buy?</label>
              <input id="buyingPart" name="buyingPart" className="input-field" value={form.buyingPart} onChange={handleChange} />
            </div>
          )}

          {selectedRole === 'seller' && (
            <div>
              <label className="label" htmlFor="sellingPart">What are you selling?</label>
              <input id="sellingPart" name="sellingPart" className="input-field" value={form.sellingPart} onChange={handleChange} />
            </div>
          )}

          {selectedRole === 'admin' && (
            <>
              <div>
                <label className="label" htmlFor="role">Admin role</label>
                <input id="role" name="role" className="input-field" value={form.role} onChange={handleChange} />
              </div>
              <div>
                <label className="label" htmlFor="permissions">Permissions</label>
                <input id="permissions" name="permissions" className="input-field" value={form.permissions} onChange={handleChange} />
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-ink-soft mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-clay hover:text-clay-dark">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

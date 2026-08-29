import { useEffect, useState } from 'react'
import { orderApi } from '../api/orderApi'

const emptyForm = { buyerId: '', sellerId: '', status: 'PENDING', totalAmount: '' }

export default function OrderPage() {
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    setLoading(true)
    try {
      const data = await orderApi.getAll()
      setOrders(data ?? [])
    } catch (err) {
      setError('Could not load orders.')
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
      await orderApi.create(form)
      setForm(emptyForm)
      loadOrders()
    } catch (err) {
      setError('Could not create order.')
    }
  }

  async function handleDelete(id) {
    try {
      await orderApi.delete(id)
      loadOrders()
    } catch (err) {
      setError('Could not delete order.')
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl">Orders</h1>

      <div className="card">
        <h2 className="text-xl mb-4">Create an order</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="buyerId">Buyer ID</label>
            <input id="buyerId" name="buyerId" className="input-field" value={form.buyerId} onChange={handleChange} required />
          </div>
          <div>
            <label className="label" htmlFor="sellerId">Seller ID</label>
            <input id="sellerId" name="sellerId" className="input-field" value={form.sellerId} onChange={handleChange} required />
          </div>
          <div>
            <label className="label" htmlFor="status">Status</label>
            <select id="status" name="status" className="input-field" value={form.status} onChange={handleChange}>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="totalAmount">Total amount</label>
            <input id="totalAmount" name="totalAmount" className="input-field" value={form.totalAmount} onChange={handleChange} required />
          </div>
          <div className="col-span-2">
            <button type="submit" className="btn-primary">Create order</button>
          </div>
        </form>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      <div className="card">
        <h2 className="text-xl mb-4">All orders</h2>
        {loading ? (
          <p className="text-ink-soft">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="text-ink-soft">No orders yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-beige-dark text-ink-soft">
                <th className="py-2">Order ID</th>
                <th className="py-2">Buyer</th>
                <th className="py-2">Seller</th>
                <th className="py-2">Status</th>
                <th className="py-2">Total</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.orderId ?? o.id} className="border-b border-beige-dark last:border-0">
                  <td className="py-2">{o.orderId ?? o.id}</td>
                  <td className="py-2">{o.buyerId}</td>
                  <td className="py-2">{o.sellerId}</td>
                  <td className="py-2">{o.status}</td>
                  <td className="py-2">{o.totalAmount}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => handleDelete(o.orderId ?? o.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

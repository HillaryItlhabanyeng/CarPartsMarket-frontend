import { useEffect, useState } from 'react'
import { transactionApi } from '../api/transactionApi'

const emptyForm = { orderId: '', amount: '', paymentMethod: '', status: 'PENDING' }

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTransactions()
  }, [])

  async function loadTransactions() {
    setLoading(true)
    try {
      const data = await transactionApi.getAll()
      setTransactions(data ?? [])
    } catch (err) {
      setError('Could not load transactions.')
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
      await transactionApi.create(form)
      setForm(emptyForm)
      loadTransactions()
    } catch (err) {
      setError('Could not create transaction.')
    }
  }

  async function handleDelete(id) {
    try {
      await transactionApi.delete(id)
      loadTransactions()
    } catch (err) {
      setError('Could not delete transaction.')
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl">Transactions</h1>

      <div className="card">
        <h2 className="text-xl mb-4">Record a transaction</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="orderId">Order ID</label>
            <input id="orderId" name="orderId" className="input-field" value={form.orderId} onChange={handleChange} required />
          </div>
          <div>
            <label className="label" htmlFor="amount">Amount</label>
            <input id="amount" name="amount" className="input-field" value={form.amount} onChange={handleChange} required />
          </div>
          <div>
            <label className="label" htmlFor="paymentMethod">Payment method</label>
            <input id="paymentMethod" name="paymentMethod" className="input-field" value={form.paymentMethod} onChange={handleChange} required />
          </div>
          <div>
            <label className="label" htmlFor="status">Status</label>
            <select id="status" name="status" className="input-field" value={form.status} onChange={handleChange}>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
          <div className="col-span-2">
            <button type="submit" className="btn-primary">Record transaction</button>
          </div>
        </form>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      <div className="card">
        <h2 className="text-xl mb-4">All transactions</h2>
        {loading ? (
          <p className="text-ink-soft">Loading…</p>
        ) : transactions.length === 0 ? (
          <p className="text-ink-soft">No transactions yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-beige-dark text-ink-soft">
                <th className="py-2">Transaction ID</th>
                <th className="py-2">Order</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Method</th>
                <th className="py-2">Status</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.transactionId ?? t.id} className="border-b border-beige-dark last:border-0">
                  <td className="py-2">{t.transactionId ?? t.id}</td>
                  <td className="py-2">{t.orderId}</td>
                  <td className="py-2">{t.amount}</td>
                  <td className="py-2">{t.paymentMethod}</td>
                  <td className="py-2">{t.status}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => handleDelete(t.transactionId ?? t.id)}
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

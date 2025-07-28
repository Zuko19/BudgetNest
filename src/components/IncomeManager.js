'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export default function IncomeManager({ currentMonth }) {
  const { user } = useAuth()
  const supabase = createClient()
  const [incomeList, setIncomeList] = useState([])
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      source: '',
      amount: '',
      date: ''
    }
  })

  useEffect(() => {
    if (user) fetchIncome()
  }, [user, currentMonth])

  const fetchIncome = async () => {
    const startDate = `${currentMonth}-01`
    const endDate = `${currentMonth}-31`

    const { data, error } = await supabase
      .from('income')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    if (error) {
      console.error(error)
    } else {
      setIncomeList(data || [])
    }
  }

  const onSubmit = async (formData) => {
    setLoading(true)
    const { error } = await supabase.from('income').insert([
      {
        user_id: user.id,
        source: formData.source,
        amount: parseFloat(formData.amount),
        date: formData.date
      }
    ])

    if (!error) {
      reset()
      fetchIncome()
    } else {
      console.error(error)
    }

    setLoading(false)
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('income').delete().eq('id', id)
    if (!error) fetchIncome()
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-extrabold mb-6 text-gray-900">Income</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Source</label>
          <input
            type="text"
            {...register('source', { required: 'Source is required' })}
            placeholder="e.g., Salary, Freelancing"
            className={`w-full rounded-md border px-4 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent ${
              errors.source ? 'border-red-500 ring-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.source && <p className="text-red-600 mt-1 text-sm">{errors.source.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            step="0.01"
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 0.01, message: 'Must be greater than 0' }
            })}
            placeholder="0.00"
            className={`w-full rounded-md border px-4 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent ${
              errors.amount ? 'border-red-500 ring-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.amount && <p className="text-red-600 mt-1 text-sm">{errors.amount.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
          <input
            type="date"
            {...register('date', { required: 'Date is required' })}
            className={`w-full rounded-md border px-4 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent ${
              errors.date ? 'border-red-500 ring-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.date && <p className="text-red-600 mt-1 text-sm">{errors.date.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-2 focus:outline-none text-white font-semibold rounded-md py-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add Income'}
        </button>
      </form>

      {/* Income list */}
      <div className="mt-10 space-y-4">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Entries</h3>
        {incomeList.length === 0 ? (
          <p className="text-gray-500 text-sm">No income added this month.</p>
        ) : (
          incomeList.map((item) => (
            <div
              key={item.id}
              className="border rounded-md px-4 py-3 flex items-center justify-between hover:bg-gray-50"
            >
              <div>
                <div className="font-semibold text-gray-900">{item.source}</div>
                <div className="text-sm text-gray-600">{item.date}</div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-green-700 font-semibold">₹{parseFloat(item.amount).toFixed(2)}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-800 font-medium text-sm focus:outline-none focus:underline"
                  aria-label={`Delete income entry ${item.source} dated ${item.date}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

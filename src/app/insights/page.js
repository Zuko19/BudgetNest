'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import {
  BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, ResponsiveContainer, Legend,
} from 'recharts'

const COLORS = ['#16a34a', '#22d3ee', '#a3e635', '#ef4444', '#facc15']

export default function InsightsPage() {
  const [barData, setBarData] = useState([])
  const [expenseData, setExpenseData] = useState([])
  const [period, setPeriod] = useState('month') // 'month' | 'week' | 'day'
  const [periodOffset, setPeriodOffset] = useState(0)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      if (!user) return
      const range = getDateRange(period, periodOffset)
      // Fetch income
      const { data: incomes } = await supabase
        .from('income')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', range.start)
        .lte('date', range.end)
      // Fetch expenses
      const { data: expenses } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', range.start)
        .lte('date', range.end)
      setBarData(combineIncomeExpense(incomes || [], expenses || [], period))
      setExpenseData(groupByCategory(expenses || []))
    }
    fetchData()
  }, [user, period, periodOffset])

  const currentLabel = formatPeriodLabel(period, periodOffset)

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 my-8">
      <h2 className="text-2xl font-extrabold mb-6 text-gray-900">Insights</h2>
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        <ArrowButton onClick={() => setPeriodOffset(periodOffset - 1)}>&larr;</ArrowButton>
        <PeriodButton active={period === 'month'} onClick={() => { setPeriod('month'); setPeriodOffset(0); }}>Monthly</PeriodButton>
        <PeriodButton active={period === 'week'} onClick={() => { setPeriod('week'); setPeriodOffset(0); }}>Weekly</PeriodButton>
        <PeriodButton active={period === 'day'} onClick={() => { setPeriod('day'); setPeriodOffset(0); }}>Daily</PeriodButton>
        <ArrowButton onClick={() => setPeriodOffset(periodOffset + 1)}>&rarr;</ArrowButton>
        <span className="ml-3 text-green-700 font-semibold text-lg">{currentLabel}</span>
      </div>

      <div className="flex flex-col gap-8">
        {/* Income vs Expense Bar Chart */}
        <div>
          <h3 className="font-bold text-green-800 mb-2">Income & Expense Over Time</h3>
          <div className="bg-gray-50 rounded p-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#16a34a" name="Income" />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses by Category */}
        <div>
          <h3 className="font-bold text-green-800 mb-2">Expense Breakdown</h3>
          <div className="bg-gray-50 rounded p-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  dataKey="amount"
                  nameKey="label"
                  outerRadius={90}
                  fill="#ef4444"
                  label
                >
                  {expenseData.map((entry, idx) => (
                    <Cell key={entry.label} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

function ArrowButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2 rounded bg-gray-100 text-green-600 font-bold text-xl hover:bg-green-100 transition"
      aria-label="Change period"
      tabIndex={0}
    >
      {children}
    </button>
  )
}

function PeriodButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded font-semibold text-sm transition
        ${active
          ? 'bg-green-600 text-white shadow'
          : 'bg-gray-100 text-gray-800 hover:bg-green-100'
        }`}
    >
      {children}
    </button>
  )
}

// Helpers

function getDateRange(period, offset = 0) {
  const now = new Date()

  if (period === 'month') {
    now.setMonth(now.getMonth() + offset)
    const y = now.getFullYear()
    const m = now.getMonth() + 1
    const month = m < 10 ? `0${m}` : m
    return {
      start: `${y}-${month}-01`,
      end: `${y}-${month}-31`
    }
  }

  if (period === 'week') {
    // Start week always on Monday
    const d = new Date()
    const day = d.getDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
    d.setDate(d.getDate() + diffToMonday + offset * 7)
    const y = d.getFullYear()
    const m = d.getMonth() + 1
    const startDay = d.getDate()
    const endDay = startDay + 6
    return {
      start: formatDate(y, m, startDay),
      end: formatDate(y, m, endDay)
    }
  }

  if (period === 'day') {
    const d = new Date()
    d.setDate(d.getDate() + offset)
    const y = d.getFullYear()
    const m = d.getMonth() + 1
    const day = d.getDate()
    return {
      start: formatDate(y, m, day),
      end: formatDate(y, m, day)
    }
  }

  return { start: '', end: '' }
}

function formatDate(y, m, d) {
  return [
    y,
    m < 10 ? `0${m}` : m,
    d < 10 ? `0${d}` : d
  ].join('-')
}

function combineIncomeExpense(incomes, expenses, period) {
  const groups = {}

  incomes.forEach(item => {
    const label = getLabel(item.date, period)
    if (!groups[label]) groups[label] = { label, income: 0, expense: 0 }
    groups[label].income += Number(item.amount)
  })

  expenses.forEach(item => {
    const label = getLabel(item.date, period)
    if (!groups[label]) groups[label] = { label, income: 0, expense: 0 }
    groups[label].expense += Number(item.amount)
  })

  return Object.values(groups).sort((a, b) => a.label.localeCompare(b.label))
}

function getLabel(dateStr, period) {
  if (!dateStr) return ''
  if (period === 'month') return dateStr.slice(8, 10) // Day of month
  if (period === 'week' || period === 'day') return dateStr // YYYY-MM-DD
  return dateStr
}

function groupByCategory(expenses) {
  const map = new Map()
  for (const item of expenses) {
    const key = item.category
    map.set(key, (map.get(key) || 0) + Number(item.amount))
  }
  return Array.from(map, ([label, amount]) => ({ label, amount }))
}

function formatPeriodLabel(period, offset = 0) {
  const now = new Date()

  if (period === 'month') {
    now.setMonth(now.getMonth() + offset)
    return now.toLocaleString('default', { month: 'long', year: 'numeric' }) // e.g. July 2025
  }

  if (period === 'week') {
    const d = new Date()
    const day = d.getDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
    d.setDate(d.getDate() + diffToMonday + offset * 7)
    const weekStart = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    d.setDate(d.getDate() + 6)
    const weekEnd = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    return `Week of ${weekStart} – ${weekEnd}`
  }

  // Default day
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}


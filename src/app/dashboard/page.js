'use client'
import { useAuth } from '@/contexts/AuthContext'
import IncomeManager from '@/components/IncomeManager'
import ExpenseManager from '@/components/ExpenseManager'

export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) return <p>Not Signed In</p>
  if (!user) {
    // Optionally you can redirect here too, but middleware should handle it.
    return <p className="text-2xl font-bold text-gray-800">You must be logged in to view this page.</p>
  }

  const currentMonth = new Date().toISOString().slice(0, 7)

  return (
    <div className="space-y-8">
      <div className="text-center lg:text-left">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Track your income and expenses with ease.</p>
      </div>
      <IncomeManager currentMonth={currentMonth} />
      <ExpenseManager currentMonth={currentMonth} />
    </div>
  )
}

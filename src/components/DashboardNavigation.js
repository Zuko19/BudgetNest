'use client'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardNavigation() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-white shadow p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="BudgetNest Logo"
            className="h-10 w-10 object-contain"
            loading="lazy"
          />
          <h1 className="text-2xl font-extrabold text-gray-900 select-none">BudgetNest</h1>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium truncate max-w-xs" title={user?.email}>
            {user?.email ?? 'Loading...'}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

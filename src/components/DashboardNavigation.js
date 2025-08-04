'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Menu, X } from 'lucide-react'

export default function DashboardNavigation() {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [menuOpen, setMenuOpen] = useState(false)

  // Only show burger on these routes:
  const burgerRoutes = ['/dashboard', '/insights']
  // If you have separate routes for IncomeManager/ExpenseManager, add them: e.g., '/dashboard/income', etc.
  const showBurger = burgerRoutes.some((p) => pathname.startsWith(p))

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Only show burger menu on specific routes */}
            {showBurger && (
              <button
                className="mr-2 p-2 rounded hover:bg-green-100 focus:outline-none"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-7 w-7 text-green-700" />
              </button>
            )}
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
      {menuOpen && showBurger && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu overlay"
          />
          <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col p-6">
            <div className="flex items-center mb-8">
              <button
                className="mr-3 p-1 rounded hover:bg-green-100"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-7 w-7 text-green-700" />
              </button>
              <img src="/logo.png" className="h-8 w-8" alt="Logo" />
              <span className="ml-2 text-lg font-extrabold text-gray-900">BudgetNest</span>
            </div>
            <nav className="flex-1 flex flex-col space-y-3">
              <NavButton href="/dashboard" active={pathname === '/dashboard'} onClick={() => setMenuOpen(false)}>
                Dashboard
              </NavButton>
              <NavButton href="/insights" active={pathname === '/insights'} onClick={() => setMenuOpen(false)}>
                Insights
              </NavButton>
            </nav>
            <button
              onClick={handleLogout}
              className="mt-auto w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 font-semibold"
            >
              Logout
            </button>
          </aside>
        </>
      )}
    </>
  )
}

function NavButton({ href, active = false, children, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`block px-3 py-2 rounded font-semibold transition ${
        active ? 'bg-green-100 text-green-700' : 'text-gray-800 hover:bg-green-50 hover:text-green-700'
      }`}
      tabIndex={0}
    >
      {children}
    </a>
  )
}

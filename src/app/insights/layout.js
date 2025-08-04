import { AuthProvider } from '@/contexts/AuthContext'
import DashboardNavigation from '@/components/DashboardNavigation'

export default function InsightsLayout({ children }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-emerald-200">
        <DashboardNavigation />
        <main className="container mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}

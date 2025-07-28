'use client'

import { useState, useEffect } from 'react'
import WelcomeScreen from '@/components/WelcomeScreen'
import AuthForm from '@/components/AuthForm'

// Helper hook: controls mounting/unmounting for smooth animations
function useAnimatedModal(isOpen, duration = 250) {
  const [shouldRender, setShouldRender] = useState(isOpen)

  useEffect(() => {
    let timeoutId
    if (isOpen) {
      setShouldRender(true)
    } else {
      timeoutId = setTimeout(() => setShouldRender(false), duration)
    }
    return () => clearTimeout(timeoutId)
  }, [isOpen, duration])

  return shouldRender
}

export default function LoginPage() {
  const [mode, setMode] = useState('welcome') // 'welcome' | 'signin' | 'signup'
  const isModalOpen = mode !== 'welcome'
  const animationDurationMs = 300
  const shouldRenderModal = useAnimatedModal(isModalOpen, animationDurationMs)

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-emerald-200 overflow-hidden">
      {/* Welcome Screen with blur effect when modal is open */}
      <div
        className={`transition-all duration-300 ${
          isModalOpen ? 'filter blur-md pointer-events-none scale-95' : ''
        }`}
      >
        <WelcomeScreen onSignIn={() => setMode('signin')} onSignUp={() => setMode('signup')} />
      </div>

      {/* Animated modal for AuthForm */}
      {shouldRenderModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-10 px-4">
          <div
            className={`
              z-20 max-w-md w-full
              transition-all duration-300
              ${isModalOpen
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-105 translate-y-4 pointer-events-none'}
            `}
          >
            <AuthForm
              isSignUp={mode === 'signup'}
              onClose={() => setMode('welcome')}
            />
          </div>
        </div>
      )}
    </div>
  )
}

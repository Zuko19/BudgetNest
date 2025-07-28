'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthForm({ isSignUp = false, onClose }) {
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const router = useRouter()
  const supabase = createClient()
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  useEffect(() => {
    setServerError('')
    reset() // clear values when switching between Sign in/Sign up
  }, [isSignUp, reset])

  const onSubmit = async (values) => {
    setLoading(true)
    setServerError('')
    try {
      const { error } = isSignUp
        ? await supabase.auth.signUp({ email: values.email, password: values.password })
        : await supabase.auth.signInWithPassword({ email: values.email, password: values.password })
      if (error) throw error
      router.push('/dashboard')
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative bg-white rounded-xl shadow-lg px-8 py-10 sm:px-12">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          aria-label="Close"
          type="button"
        >
          ×
        </button>
      )}

      {/* Logo + Title */}
      <div className="flex items-center mb-8 justify-center">
        <img
          src="/logo.png"
          alt="BudgetNest Logo"
          className="h-12 w-12 mr-3 object-contain"
          loading="lazy"
        />
        <h2 className="text-3xl font-extrabold text-gray-900">
          BudgetNest
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            disabled={loading}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby="email-error"
            className={`w-full rounded-md border px-4 py-2 text-gray-900 placeholder-gray-400 shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-500 ring-red-500' : 'border-gray-300'
              }`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' }
            })}
            disabled={loading}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby="password-error"
            className={`w-full rounded-md border px-4 py-2 text-gray-900 placeholder-gray-400 shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.password ? 'border-red-500 ring-red-500' : 'border-gray-300'
              }`}
            placeholder="Your password"
          />
          {errors.password && (
            <p id="password-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Server Error Message */}
        {serverError && (
          <div className="rounded-md bg-red-50 p-3 text-red-700 text-sm font-medium select-text">
            {serverError}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center rounded-md bg-blue-600 px-4 py-3 text-white font-semibold
            shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (isSignUp ? 'Signing up...' : 'Signing in...') : (isSignUp ? 'Sign up' : 'Sign in')}
        </button>
      </form>

      {/* Toggle button removed – parent controls mode. If you want a toggle here, you can add: */}
      {/* 
      <div className="mt-6 text-center text-sm text-gray-600">
        <button ...>...</button>
      </div>
      */}
    </div>
  )
}

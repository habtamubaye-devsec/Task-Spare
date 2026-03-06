'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '@/store/api/authApi'
import { setToken } from '@/store/slices/authSlice'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { OAuthButtons } from '@/components/auth/OAuthButtons'

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    try {
      const res = await login(formData).unwrap()
      if (res.accessToken) {
        dispatch(setToken(res.accessToken))
        router.push('/dashboard')
      }
    } catch (err: any) {
      setErrorMsg(err.data?.message || 'Invalid credentials. Please try again.')
    }
  }

  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="Simplify your workflow and boost your productivity with TaskIQ. Get started for free."
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="sr-only" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-5 py-3.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-colors text-gray-900 bg-white"
            placeholder="Username or email"
          />
        </div>

        <div className="relative">
          <label className="sr-only" htmlFor="password">Password</label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-5 py-3.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-colors text-gray-900 bg-white pr-12"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm font-semibold text-gray-900 hover:text-teal transition-colors">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-teal py-3.5 rounded-full text-base font-semibold shadow-lg shadow-teal/20"
        >
          {isLoading ? 'Signing in...' : 'Login'}
        </button>

        <OAuthButtons />

        <p className="mt-8 text-center text-sm text-gray-600">
          Not a member?{' '}
          <Link href="/register" className="font-semibold text-teal hover:underline hover:text-teal-dark">
            Register now
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

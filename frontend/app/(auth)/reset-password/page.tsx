'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useResetPasswordMutation } from '@/store/api/authApi'
import { AuthLayout } from '@/components/auth/AuthLayout'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!token) {
      setErrorMsg('Invalid or missing reset token. Please request a new link.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    try {
      await resetPassword({ token, password: formData.password }).unwrap()
      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: any) {
      setErrorMsg(err.data?.message || 'Failed to reset password. The link might be expired or invalid.')
    }
  }

  if (!token) {
    return (
        <AuthLayout
          title="Invalid Link"
          subtitle="It looks like this password reset link is missing or invalid."
        >
          <div className="mt-8 text-center">
            <Link href="/forgot-password" className="btn-teal inline-block px-8 py-3.5 rounded-full text-base font-semibold shadow-lg shadow-teal/20">
              Request new link
            </Link>
          </div>
        </AuthLayout>
      )
  }

  if (success) {
    return (
      <AuthLayout
        title="Password Reset!"
        subtitle="Your password has been successfully reset. You can now log in with your new password."
      >
        <div className="mt-8 p-6 bg-teal-50 rounded-2xl text-center border border-teal/10">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-teal">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg text-gray-900 mb-2">Success</h3>
          <p className="text-gray-600 text-sm">Redirecting to login...</p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Your new password must be different from previously used passwords."
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {errorMsg}
          </div>
        )}

        <div className="relative">
          <label className="sr-only" htmlFor="password">New Password</label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-5 py-3.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-colors text-gray-900 bg-white pr-12"
            placeholder="New Password"
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

        <div className="relative">
          <label className="sr-only" htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-5 py-3.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-colors text-gray-900 bg-white pr-12"
            placeholder="Confirm Password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-teal py-3.5 rounded-full text-base font-semibold shadow-lg shadow-teal/20 mt-4"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </AuthLayout>
  )
}

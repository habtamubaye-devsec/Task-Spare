'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForgotPasswordMutation } from '@/store/api/authApi'
import { AuthLayout } from '@/components/auth/AuthLayout'

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const [email, setEmail] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    try {
      await forgotPassword({ email }).unwrap()
      setSuccess(true)
    } catch (err: any) {
      setErrorMsg(err.data?.message || 'Failed to send reset email. Please try again.')
    }
  }

  if (success) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent a password reset link to your email address."
      >
        <div className="mt-8 p-6 bg-teal-50 rounded-2xl text-center border border-teal/10">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-teal">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg text-gray-900 mb-2">Reset Link Sent</h3>
          <p className="text-gray-600 text-sm mb-6">Didn't receive the email? Check your spam folder or try again.</p>
          <button
            onClick={() => setSuccess(false)}
            className="text-sm font-semibold text-teal hover:underline hover:text-teal-dark"
          >
            Try another email
          </button>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="No worries, we'll send you reset instructions. Enter your email below."
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="sr-only" htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-colors text-gray-900 bg-white"
            placeholder="Email address"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-teal py-3.5 rounded-full text-base font-semibold shadow-lg shadow-teal/20 mt-4"
        >
          {isLoading ? 'Sending...' : 'Reset Password'}
        </button>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to login
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}

'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useLazyVerifyEmailQuery, useResendVerificationMutation } from '@/store/api/authApi'
import { AuthLayout } from '@/components/auth/AuthLayout'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const emailParam = searchParams.get('email')

  const [verifyEmail, { isLoading }] = useLazyVerifyEmailQuery()
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation()

  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'idle'>(
    token ? 'verifying' : 'idle'
  )
  const [errorMsg, setErrorMsg] = useState('')
  const [resendSuccess, setResendSuccess] = useState(false)
  
  // To prevent double firing in React strict mode
  const verifiedRef = useRef(false)

  useEffect(() => {
    if (token && !verifiedRef.current) {
        verifiedRef.current = true
        verifyEmail({ token }).unwrap()
        .then(() => {
          setStatus('success')
        })
        .catch((err) => {
          setStatus('error')
          setErrorMsg(err.data?.message || 'Invalid or expired verification token.')
        })
    }
  }, [token, verifyEmail])

  const handleResend = async () => {
    if (!emailParam) return
    setErrorMsg('')
    setResendSuccess(false)
    try {
      await resendVerification({ email: emailParam }).unwrap()
      setResendSuccess(true)
    } catch (err: any) {
      setErrorMsg(err.data?.message || 'Failed to resend verification email.')
    }
  }

  // State: Default Idle (when just visiting without a token)
  if (!token) {
    return (
      <AuthLayout
        title="Verify your email"
        subtitle="You must verify your email address before you can log in."
      >
        <div className="mt-8 text-center space-y-6">
           <div className="p-6 bg-teal-50 rounded-2xl border border-teal/10">
              <h3 className="font-semibold text-gray-900 mb-2">Check your inbox</h3>
              <p className="text-gray-600 text-sm">
                We sent a verification link upon registration. Please click it to confirm your account.
              </p>
           </div>
           
           {emailParam && (
             <div className="space-y-4">
                <button
                    onClick={handleResend}
                    disabled={isResending}
                    className="w-full btn-teal py-3.5 rounded-full text-base font-semibold shadow-lg shadow-teal/20"
                >
                    {isResending ? 'Resending...' : 'Resend link'}
                </button>
                {resendSuccess && <p className="text-sm text-teal font-medium">Link resent successfully.</p>}
                {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
             </div>
           )}

           <div className="pt-4">
            <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to login
            </Link>
           </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title={
          status === 'verifying' ? 'Verifying...' :
          status === 'success'   ? 'Email Verified!' : 'Verification Failed'
      }
      subtitle={
          status === 'verifying' ? 'Please wait while we verify your email address.' :
          status === 'success'   ? 'Your account has been verified successfully. You can now log in.' : errorMsg
      }
    >
        <div className="mt-8">
            {status === 'verifying' && (
                <div className="flex justify-center p-8">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-teal rounded-full animate-spin"></div>
                </div>
            )}

            {status === 'success' && (
                <div className="p-6 bg-teal-50 rounded-2xl text-center border border-teal/10 mb-8">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-teal">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <Link href="/login" className="btn-teal inline-block px-8 py-3.5 rounded-full text-base font-semibold shadow-lg shadow-teal/20 mt-4">
                        Proceed to Login
                    </Link>
                </div>
            )}

            {status === 'error' && (
                <div className="p-6 bg-red-50 rounded-2xl text-center border border-red-100 mb-8">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-red-500">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    
                    {emailParam ? (
                        <div className="space-y-4">
                           <p className="text-gray-700 text-sm mb-4">You can request a new verification link below.</p>
                           <button
                               onClick={handleResend}
                               disabled={isResending}
                               className="w-full btn-teal py-3.5 rounded-full text-base font-semibold shadow-lg shadow-teal/20"
                           >
                               {isResending ? 'Resending...' : 'Resend new link'}
                           </button>
                           {resendSuccess && <p className="text-sm text-teal font-medium">Link resent successfully.</p>}
                        </div>
                    ) : (
                        <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center justify-center gap-2 mt-6">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to login
                        </Link>
                    )}
                </div>
            )}
        </div>
    </AuthLayout>
  )
}

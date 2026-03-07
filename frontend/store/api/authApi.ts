import { baseApi } from './baseApi'
import type { AuthResponse } from '@/types/auth'

/* ─── Auth API ─── */
/* RTK Query endpoints for all /auth/* routes.
   Covers: OAuth (Google/GitHub), register, login, verify email,
   password reset, token refresh, and logout. */

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ── OAuth ──────────────────────────────────────── */

    // GET /auth/google — redirects to Google consent screen
    googleLogin: builder.query<void, void>({
      query: () => '/auth/google',
    }),

    // GET /auth/google/callback — handled by backend, returns tokens
    googleCallback: builder.query<AuthResponse, void>({
      query: () => '/auth/google/callback',
    }),

    // GET /auth/github — redirects to GitHub consent screen
    githubLogin: builder.query<void, void>({
      query: () => '/auth/github',
    }),

    // GET /auth/github/callback — handled by backend, returns tokens
    githubCallback: builder.query<AuthResponse, void>({
      query: () => '/auth/github/callback',
    }),

    /* ── Registration & Email Verification ──────────── */

    // POST /auth/register
    register: builder.mutation<
      { message: string },
      { name: string; email: string; password: string }
    >({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),

    // GET /auth/verify?token=...
    verifyEmail: builder.query<{ message: string }, { token: string }>({
      query: ({ token }) => `/auth/verify?token=${token}`,
    }),

    // POST /auth/resend-verification
    resendVerification: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (body) => ({
        url: '/auth/resend-verification',
        method: 'POST',
        body,
      }),
    }),

    /* ── Login ──────────────────────────────────────── */

    // POST /auth/login
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    /* ── Password Reset ────────────────────────────── */

    // POST /auth/forgot-password
    forgotPassword: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/reset-password
    resetPassword: builder.mutation<
      { message: string },
      { token: string; password: string }
    >({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    /* ── Token & Session ───────────────────────────── */

    // POST /auth/refresh
    refresh: builder.mutation<AuthResponse, { refreshToken: string }>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
})

export const {
  // OAuth
  useLazyGoogleLoginQuery,
  useLazyGoogleCallbackQuery,
  useLazyGithubLoginQuery,
  useLazyGithubCallbackQuery,
  // Registration & Verification
  useRegisterMutation,
  useLazyVerifyEmailQuery,
  useResendVerificationMutation,
  // Login
  useLoginMutation,
  // Password Reset
  useForgotPasswordMutation,
  useResetPasswordMutation,
  // Token & Session
  useRefreshMutation,
  useLogoutMutation,
} = authApi

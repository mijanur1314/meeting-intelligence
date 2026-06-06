'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import api from '@/lib/axios'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('accessToken', res.data.data.accessToken)
      localStorage.setItem('refreshToken', res.data.data.refreshToken)
      window.location.href = '/'
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.error?.message
        : null
      setErrorMessage(message || 'Login failed. Check your credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border bg-card p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-semibold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Sign in to review meetings and open action items.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email address</label>
              <input
                type="email"
                required
                className="w-full rounded-xl border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                required
                className="w-full rounded-xl border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-full bg-primary px-8 py-3.5 font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 border-t pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-primary hover:text-primary/80">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

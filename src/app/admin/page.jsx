'use client'

import { useState, useEffect } from 'react'
import AdminLogin from '@/components/admin/AdminLogin'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default function AdminPage() {
  const [authState, setAuthState] = useState('checking') // 'checking' | 'unauthenticated' | 'authenticated'

  useEffect(() => {
    fetch('/api/admin/auth')
      .then(r => setAuthState(r.ok ? 'authenticated' : 'unauthenticated'))
      .catch(() => setAuthState('unauthenticated'))
  }, [])

  if (authState === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (authState === 'unauthenticated') {
    return <AdminLogin onSuccess={() => setAuthState('authenticated')} />
  }

  return <AdminDashboard onLogout={() => setAuthState('unauthenticated')} />
}

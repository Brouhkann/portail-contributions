'use client'

import { useState } from 'react'
import { Lock, LogIn, Loader2 } from 'lucide-react'

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!password) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        onSuccess()
      } else {
        const data = await res.json()
        setError(data.error || 'Accès refusé')
        setPassword('')
      }
    } catch {
      setError('Erreur de connexion. Vérifiez votre réseau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-6 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Administration</h1>
          <p className="text-purple-200 text-sm mt-1">Portail de contributions</p>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Mot de passe administrateur
            </label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              placeholder="••••••••••••"
              autoFocus
              autoComplete="current-password"
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95 transition-transform shadow-lg"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Connexion…</>
            ) : (
              <><LogIn className="w-5 h-5" /> Se connecter</>
            )}
          </button>

          <div className="text-center">
            <a href="/" className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
              ← Retour à l'accueil
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

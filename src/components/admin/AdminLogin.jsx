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
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) { onSuccess() }
      else { const d = await res.json(); setError(d.error || 'Accès refusé'); setPassword('') }
    } catch { setError('Erreur réseau.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(160deg, #040f0e 0%, #0a2d28 60%, #155049 100%)' }}>

      {/* Décor lumineux */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(201,162,39,0.8), transparent)' }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(201,162,39,0.15), rgba(201,162,39,0.05))',
              border: '2px solid rgba(201,162,39,0.4)',
              boxShadow: '0 0 40px rgba(201,162,39,0.2)',
            }}>
            <Lock className="w-8 h-8" style={{ color: '#c9a227' }} />
          </div>
          <h1 className="font-cinzel text-gold-400 text-xl font-semibold tracking-[0.2em] uppercase">
            Administration
          </h1>
          <div className="flex items-center gap-2 justify-center mt-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-700" />
            <span className="text-gold-700 text-xs italic">Vases d'Honneur</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-700" />
          </div>
        </div>

        {/* Formulaire */}
        <div className="rounded-2xl p-7"
          style={{
            background: 'linear-gradient(160deg, #0f3d37, #0a2d28)',
            border: '1px solid rgba(201,162,39,0.2)',
            boxShadow: '0 20px 60px rgba(4,15,14,0.8), inset 0 1px 0 rgba(201,162,39,0.1)',
          }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gold-600 text-xs uppercase tracking-widest mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••••••"
                autoFocus
                autoComplete="current-password"
                className="w-full px-4 py-4 rounded-xl input-church text-white text-sm"
              />
            </div>

            {error && (
              <div className="rounded-lg px-4 py-3 text-sm text-red-300"
                style={{ background: 'rgba(185,28,28,0.15)', border: '1px solid rgba(185,28,28,0.3)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading || !password}
              className="btn-gold w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-gold disabled:opacity-50">
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Connexion…</>
              ) : (
                <><LogIn className="w-5 h-5" /> Accéder au tableau de bord</>
              )}
            </button>
          </form>

          <div className="text-center mt-5">
            <a href="/" className="text-gold-800 hover:text-gold-600 text-xs transition-colors tracking-widest uppercase">
              ← Retour au portail
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

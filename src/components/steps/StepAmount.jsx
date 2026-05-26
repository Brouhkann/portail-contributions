'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000]

const METHODS = [
  { id: 'wave',   name: 'Wave',             emoji: '🌊', bg: '#eff8ff', border: '#93c5fd', text: '#1d4ed8' },
  { id: 'mtn',    name: 'MTN Mobile Money', emoji: '📱', bg: '#fefce8', border: '#fde047', text: '#854d0e' },
  { id: 'orange', name: 'Orange Money',     emoji: '🍊', bg: '#fff7ed', border: '#fdba74', text: '#c2410c' },
]

export default function StepAmount({ formData, update, go }) {
  const minAmount = parseInt(process.env.NEXT_PUBLIC_MIN_AMOUNT || '100', 10)
  const [amount, setAmount]   = useState(formData.amount || '')
  const [method, setMethod]   = useState(formData.paymentMethod || '')
  const [error, setError]     = useState('')

  function handleChange(raw) {
    const d = raw.replace(/\D/g, '')
    setAmount(d); update({ amount: d }); setError('')
  }

  function handleQuick(val) {
    const s = val.toString(); setAmount(s); update({ amount: s }); setError('')
  }

  function handleNext() {
    const num = parseInt(amount, 10)
    if (!amount || isNaN(num)) { setError('Veuillez entrer un montant.'); return }
    if (num < minAmount)        { setError(`Minimum : ${minAmount.toLocaleString('fr-FR')} FCFA`); return }
    if (!method)                { setError('Veuillez choisir un moyen de paiement.'); return }
    update({ amount, paymentMethod: method })
    go('paying')
  }

  const numVal      = parseInt(amount, 10)
  const displayAmt  = !isNaN(numVal) && amount ? numVal.toLocaleString('fr-FR') : ''
  const typeLabel   = formData.contributionDetail
    ? `${formData.contributionType} — ${formData.contributionDetail}`
    : formData.contributionType

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => go('type')}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: '#edf7f4', color: '#155049' }}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-cinzel font-semibold tracking-wide text-base uppercase" style={{ color: '#0a2d28' }}>
            Montant &amp; Paiement
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#6b9e96' }}>{typeLabel}</p>
        </div>
      </div>

      <div className="divider-gold mb-5" />

      {/* ── Saisie montant ── */}
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#155049' }}>Montant</p>
        <div className="relative rounded-2xl overflow-hidden"
          style={{ background: '#f8fffe', border: '1.5px solid #d1e9e4' }}>
          <input
            type="number" value={amount}
            onChange={e => handleChange(e.target.value)}
            placeholder="0" inputMode="numeric"
            className="w-full text-5xl font-bold text-center py-6 bg-transparent focus:outline-none"
            style={{ color: '#0a2d28', caretColor: '#c9a227' }}
          />
          <div className="absolute right-4 bottom-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: '#9dc4bc' }}>FCFA</div>
        </div>

        {/* Montant formaté */}
        <div className="h-5 flex items-center justify-center mt-1.5">
          {displayAmt && !error && (
            <p className="text-sm" style={{ color: '#6b9e96' }}>{displayAmt} FCFA</p>
          )}
        </div>

        {/* Montants rapides */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          {QUICK_AMOUNTS.map(val => {
            const sel = amount === val.toString()
            return (
              <button key={val} onClick={() => handleQuick(val)}
                className="py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
                style={{
                  background: sel ? '#fdf8e8' : '#f8fffe',
                  border:     sel ? '2px solid #c9a227' : '1.5px solid #d1e9e4',
                  color:      sel ? '#7a5c14' : '#4a7a72',
                }}>
                {val.toLocaleString('fr-FR')}
              </button>
            )
          })}
        </div>
      </div>

      <div className="divider-gold mb-5" />

      {/* ── Moyen de paiement ── */}
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#155049' }}>
          Moyen de paiement
        </p>
        <div className="space-y-2.5">
          {METHODS.map(m => {
            const sel = method === m.id
            return (
              <button key={m.id}
                onClick={() => { setMethod(m.id); update({ paymentMethod: m.id }); setError('') }}
                className="w-full p-3.5 rounded-xl flex items-center gap-3 transition-all active:scale-[0.98]"
                style={{
                  background:  sel ? m.bg : '#f8fffe',
                  border:      sel ? `2px solid ${m.border}` : '1.5px solid #d1e9e4',
                  boxShadow:   sel ? `0 4px 12px ${m.border}55` : 'none',
                }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: '#ffffff', border: `1.5px solid ${sel ? m.border : '#d1e9e4'}` }}>
                  {m.emoji}
                </div>
                <span className="font-bold text-sm flex-1 text-left" style={{ color: sel ? m.text : '#0a2d28' }}>
                  {m.name}
                </span>
                {sel && (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                    style={{ background: m.text }}>✓</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
      )}

      {/* Bouton valider */}
      <button onClick={handleNext}
        disabled={!amount || !method}
        className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
          amount && method ? 'btn-gold shadow-md' : 'cursor-not-allowed'
        }`}
        style={!amount || !method
          ? { background: '#e8f5f3', color: '#9dc4bc', border: '1.5px solid #d1e9e4' }
          : {}}>
        Procéder au paiement <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

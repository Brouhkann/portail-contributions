'use client'

import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000]

const METHODS = [
  { id: 'wave',   name: 'Wave',             emoji: '🌊', bg: '#eff8ff', border: '#93c5fd', text: '#1d4ed8' },
  { id: 'mtn',    name: 'MTN Mobile Money', emoji: '📱', bg: '#fefce8', border: '#fde047', text: '#854d0e' },
  { id: 'orange', name: 'Orange Money',     emoji: '🍊', bg: '#fff7ed', border: '#fdba74', text: '#c2410c' },
]

function triggerPayment(methodId, amount) {
  const amt = parseInt(amount, 10)
  const links = {
    wave:   `https://pay.wave.com/m/M_ci_w0uiv5NMBefY/c/ci/?amount=${amt}`,
    mtn:    `tel:*133%23`,
    orange: `tel:%23144*11*0749269369%23`,
  }
  const href = links[methodId]
  if (!href) return
  const a = document.createElement('a')
  a.href = href
  if (methodId === 'wave') a.target = '_blank'
  a.rel = 'noopener noreferrer'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

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

  function handleSelectMethod(methodId) {
    const num = parseInt(amount, 10)
    if (!amount || isNaN(num)) { setError('Veuillez d\'abord entrer un montant.'); return }
    if (num < minAmount)       { setError(`Minimum : ${minAmount.toLocaleString('fr-FR')} FCFA`); return }
    setError('')
    setMethod(methodId)
    update({ amount, paymentMethod: methodId })
    triggerPayment(methodId, amount)
    go('confirm')
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
        <div className="grid grid-cols-3 gap-2.5">
          {METHODS.map(m => (
            <button key={m.id}
              onClick={() => handleSelectMethod(m.id)}
              className="flex flex-col items-center gap-2 py-4 px-2 rounded-xl transition-all active:scale-95"
              style={{ background: m.bg, border: `1.5px solid ${m.border}` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: '#ffffff', border: `1.5px solid ${m.border}` }}>
                {m.emoji}
              </div>
              <span className="font-bold text-xs text-center leading-tight" style={{ color: m.text }}>
                {m.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <p className="text-red-500 text-sm mt-1 text-center">{error}</p>
      )}

      <p className="text-center text-xs mt-3" style={{ color: '#9dc4bc' }}>
        Appuyez sur votre opérateur pour lancer le paiement
      </p>
    </div>
  )
}

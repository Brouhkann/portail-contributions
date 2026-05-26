'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000]

export default function StepAmount({ formData, update, go }) {
  const minAmount = parseInt(process.env.NEXT_PUBLIC_MIN_AMOUNT || '100', 10)
  const [amount, setAmount] = useState(formData.amount || '')
  const [error, setError] = useState('')

  function handleChange(raw) { const d = raw.replace(/\D/g,''); setAmount(d); update({ amount: d }); setError('') }
  function handleQuick(val) { const s = val.toString(); setAmount(s); update({ amount: s }); setError('') }
  function handleNext() {
    const num = parseInt(amount, 10)
    if (!amount || isNaN(num)) { setError('Veuillez entrer un montant'); return }
    if (num < minAmount) { setError(`Minimum : ${minAmount.toLocaleString('fr-FR')} FCFA`); return }
    go('payment')
  }
  const numVal = parseInt(amount, 10)
  const displayAmount = !isNaN(numVal) && amount ? numVal.toLocaleString('fr-FR') : ''

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => go('type')}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: '#edf7f4', color: '#155049' }}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-cinzel font-semibold tracking-wide text-base uppercase" style={{ color: '#0a2d28' }}>Montant</h2>
          <p className="text-xs mt-0.5" style={{ color: '#6b9e96' }}>{formData.contributionType}</p>
        </div>
      </div>

      <div className="divider-gold mb-6" />

      <div className="mb-6">
        <div className="relative rounded-2xl overflow-hidden"
          style={{ background: '#f8fffe', border: '1.5px solid #d1e9e4' }}>
          <input type="number" value={amount} onChange={e => handleChange(e.target.value)}
            placeholder="0" inputMode="numeric" autoFocus
            className="w-full text-5xl font-bold text-center py-8 bg-transparent focus:outline-none"
            style={{ color: '#0a2d28', caretColor: '#c9a227' }} />
          <div className="absolute right-4 bottom-4 text-xs font-semibold uppercase tracking-widest" style={{ color: '#9dc4bc' }}>
            FCFA
          </div>
        </div>
        <div className="h-6 flex items-center justify-center mt-2">
          {displayAmount && !error && <p className="text-sm" style={{ color: '#6b9e96' }}>{displayAmount} FCFA</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>

      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#9dc4bc' }}>Montants rapides</p>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_AMOUNTS.map(val => {
            const sel = amount === val.toString()
            return (
              <button key={val} onClick={() => handleQuick(val)}
                className="py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                style={{
                  background: sel ? '#fdf8e8' : '#f8fffe',
                  border: sel ? '2px solid #c9a227' : '1.5px solid #d1e9e4',
                  color: sel ? '#7a5c14' : '#4a7a72',
                }}>
                {val.toLocaleString('fr-FR')}
              </button>
            )
          })}
        </div>
      </div>

      <button onClick={handleNext} disabled={!amount}
        className={`w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${amount ? 'btn-gold shadow-md' : 'cursor-not-allowed'}`}
        style={!amount ? { background: '#e8f5f3', color: '#9dc4bc', border: '1.5px solid #d1e9e4' } : {}}>
        Continuer <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

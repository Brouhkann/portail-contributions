'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000]

export default function StepAmount({ formData, update, go }) {
  const minAmount = parseInt(process.env.NEXT_PUBLIC_MIN_AMOUNT || '100', 10)
  const [amount, setAmount] = useState(formData.amount || '')
  const [error, setError] = useState('')

  function handleChange(raw) {
    const digits = raw.replace(/\D/g, '')
    setAmount(digits); update({ amount: digits }); setError('')
  }

  function handleQuick(val) {
    const s = val.toString(); setAmount(s); update({ amount: s }); setError('')
  }

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
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => go('type')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gold-700 hover:text-gold-400 hover:bg-church-700/50 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-cinzel text-gold-400 font-semibold tracking-wide text-base uppercase">Montant</h2>
          <p className="text-gold-700 text-xs mt-0.5">{formData.contributionType}</p>
        </div>
      </div>

      <div className="divider-gold mb-6" />

      {/* Saisie montant */}
      <div className="mb-6">
        <div className="relative rounded-2xl overflow-hidden"
          style={{ background: 'rgba(15,61,55,0.6)', border: '1px solid rgba(201,162,39,0.2)' }}>
          <input
            type="number"
            value={amount}
            onChange={e => handleChange(e.target.value)}
            placeholder="0"
            inputMode="numeric"
            autoFocus
            className="w-full text-5xl font-bold text-center py-8 bg-transparent text-white focus:outline-none"
            style={{ caretColor: '#c9a227' }}
          />
          <div className="absolute right-4 bottom-4 text-gold-700 text-xs font-medium tracking-widest uppercase">FCFA</div>
        </div>

        <div className="h-6 flex items-center justify-center mt-2">
          {displayAmount && !error && (
            <p className="text-gold-600 text-sm">{displayAmount} FCFA</p>
          )}
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </div>

      {/* Montants rapides */}
      <div className="mb-7">
        <p className="text-gold-800 text-xs uppercase tracking-widest mb-3">Montants rapides</p>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_AMOUNTS.map(val => {
            const isSelected = amount === val.toString()
            return (
              <button key={val} onClick={() => handleQuick(val)}
                className="py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(201,162,39,0.2), rgba(201,162,39,0.1))'
                    : 'rgba(15,61,55,0.5)',
                  border: isSelected ? '1.5px solid rgba(201,162,39,0.6)' : '1px solid rgba(201,162,39,0.1)',
                  color: isSelected ? '#e8c84a' : '#a07c1e',
                }}>
                {val.toLocaleString('fr-FR')}
              </button>
            )
          })}
        </div>
      </div>

      <button onClick={handleNext} disabled={!amount}
        className={`w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
          amount ? 'btn-gold shadow-gold' : 'cursor-not-allowed'
        }`}
        style={!amount ? { background: 'rgba(15,61,55,0.5)', border: '1px solid rgba(201,162,39,0.1)', color: '#2d6b62' } : {}}>
        Continuer <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

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
    setAmount(digits)
    update({ amount: digits })
    setError('')
  }

  function handleQuick(val) {
    const s = val.toString()
    setAmount(s)
    update({ amount: s })
    setError('')
  }

  function handleNext() {
    const num = parseInt(amount, 10)
    if (!amount || isNaN(num)) {
      setError('Veuillez entrer un montant')
      return
    }
    if (num < minAmount) {
      setError(`Montant minimum : ${minAmount.toLocaleString('fr-FR')} FCFA`)
      return
    }
    go('payment')
  }

  const numVal = parseInt(amount, 10)
  const displayAmount = !isNaN(numVal) && amount ? numVal.toLocaleString('fr-FR') : ''

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => go('type')}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Montant</h2>
          <p className="text-sm text-gray-400">{formData.contributionType}</p>
        </div>
      </div>

      {/* Saisie montant */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={e => handleChange(e.target.value)}
            placeholder="0"
            inputMode="numeric"
            autoFocus
            className="w-full text-5xl font-bold text-center py-8 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-purple-300 text-gray-800 bg-gray-50"
          />
          <span className="absolute right-4 bottom-4 text-gray-300 font-medium text-sm">FCFA</span>
        </div>

        <div className="text-center mt-2 h-5">
          {displayAmount && !error && (
            <p className="text-sm text-gray-400">{displayAmount} FCFA</p>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>

      {/* Montants rapides */}
      <div className="mb-7">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2 font-medium">Montants rapides</p>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_AMOUNTS.map(val => (
            <button
              key={val}
              onClick={() => handleQuick(val)}
              className={`py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                amount === val.toString()
                  ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
              }`}
            >
              {val.toLocaleString('fr-FR')}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!amount}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
          amount
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg active:scale-95'
            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
        }`}
      >
        Continuer <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

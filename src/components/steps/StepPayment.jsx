'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

const METHODS = [
  {
    id: 'wave',
    name: 'Wave',
    description: 'Paiement rapide Wave',
    emoji: '🌊',
    gradient: 'from-sky-400 to-blue-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-700',
    shadow: 'shadow-sky-100',
  },
  {
    id: 'mtn',
    name: 'MTN Mobile Money',
    description: 'MTN MoMo',
    emoji: '📱',
    gradient: 'from-yellow-400 to-amber-500',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    shadow: 'shadow-yellow-100',
  },
  {
    id: 'orange',
    name: 'Orange Money',
    description: 'Paiement Orange',
    emoji: '🍊',
    gradient: 'from-orange-400 to-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    shadow: 'shadow-orange-100',
  },
]

export default function StepPayment({ formData, update, go }) {
  const amountFmt = parseInt(formData.amount, 10).toLocaleString('fr-FR')

  function handleSelect(methodId) {
    update({ paymentMethod: methodId })
    go('paying')
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => go('amount')}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Moyen de paiement</h2>
          <p className="text-sm text-gray-400">{formData.contributionType} — {amountFmt} FCFA</p>
        </div>
      </div>

      <div className="bg-purple-50 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
        <span className="text-sm text-purple-600">Montant à envoyer</span>
        <span className="text-xl font-bold text-purple-800">{amountFmt} FCFA</span>
      </div>

      <div className="space-y-3">
        {METHODS.map(m => (
          <button
            key={m.id}
            onClick={() => handleSelect(m.id)}
            className={`w-full p-4 rounded-xl border-2 ${m.border} ${m.bg} flex items-center gap-4 transition-all active:scale-95 hover:shadow-md ${m.shadow}`}
          >
            <div className={`w-14 h-14 bg-gradient-to-br ${m.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
              {m.emoji}
            </div>
            <div className="flex-1 text-left">
              <div className={`font-bold text-base ${m.text}`}>{m.name}</div>
              <div className="text-sm text-gray-400">{m.description}</div>
            </div>
            <ChevronRight className={`w-5 h-5 ${m.text} opacity-60`} />
          </button>
        ))}
      </div>
    </div>
  )
}

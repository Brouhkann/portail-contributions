'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

const METHODS = [
  { id: 'wave',   name: 'Wave',             emoji: '🌊', sub: 'Paiement instantané', bg: '#eff8ff', border: '#93c5fd', text: '#1d4ed8' },
  { id: 'mtn',    name: 'MTN Mobile Money', emoji: '📱', sub: 'MoMo',                bg: '#fefce8', border: '#fde047', text: '#854d0e' },
  { id: 'orange', name: 'Orange Money',     emoji: '🍊', sub: 'Paiement Orange',     bg: '#fff7ed', border: '#fdba74', text: '#c2410c' },
]

export default function StepPayment({ formData, update, go }) {
  const amountFmt = parseInt(formData.amount, 10).toLocaleString('fr-FR')

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => go('amount')}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: '#edf7f4', color: '#155049' }}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-cinzel font-semibold tracking-wide text-base uppercase" style={{ color: '#0a2d28' }}>
            Moyen de paiement
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#6b9e96' }}>{formData.contributionType}</p>
        </div>
      </div>

      <div className="divider-gold mb-5" />

      {/* Badge montant */}
      <div className="rounded-xl px-4 py-3 mb-6 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #fdf8e8, #faefc0)', border: '1.5px solid rgba(201,162,39,0.4)' }}>
        <span className="text-sm font-medium" style={{ color: '#7a5c14' }}>Montant à envoyer</span>
        <span className="text-2xl font-bold" style={{ color: '#0a2d28' }}>
          {amountFmt} <span className="text-sm font-medium" style={{ color: '#a07c1e' }}>FCFA</span>
        </span>
      </div>

      <div className="space-y-3">
        {METHODS.map(m => (
          <button key={m.id}
            onClick={() => { update({ paymentMethod: m.id }); go('paying') }}
            className="w-full p-4 rounded-xl flex items-center gap-4 transition-all active:scale-95 group"
            style={{ background: m.bg, border: `1.5px solid ${m.border}` }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm transition-transform group-hover:scale-105"
              style={{ background: '#ffffff', border: `1.5px solid ${m.border}` }}>
              {m.emoji}
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-base" style={{ color: m.text }}>{m.name}</div>
              <div className="text-xs mt-0.5" style={{ color: '#6b9e96' }}>{m.sub}</div>
            </div>
            <ChevronRight className="w-5 h-5 opacity-40" style={{ color: m.text }} />
          </button>
        ))}
      </div>
    </div>
  )
}

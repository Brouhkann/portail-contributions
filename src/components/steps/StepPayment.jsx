'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

const METHODS = [
  { id: 'wave',   name: 'Wave',              emoji: '🌊', sub: 'Paiement instantané',   ring: 'rgba(56,189,248,0.5)',  bg: 'rgba(14,165,233,0.08)', border: 'rgba(56,189,248,0.3)', text: '#7dd3fc' },
  { id: 'mtn',    name: 'MTN Mobile Money',  emoji: '📱', sub: 'MoMo',                  ring: 'rgba(234,179,8,0.5)',   bg: 'rgba(234,179,8,0.08)',  border: 'rgba(234,179,8,0.35)', text: '#fde047' },
  { id: 'orange', name: 'Orange Money',      emoji: '🍊', sub: 'Paiement Orange',        ring: 'rgba(249,115,22,0.5)', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.3)', text: '#fdba74' },
]

export default function StepPayment({ formData, update, go }) {
  const amountFmt = parseInt(formData.amount, 10).toLocaleString('fr-FR')

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => go('amount')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gold-700 hover:text-gold-400 hover:bg-church-700/50 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-cinzel text-gold-400 font-semibold tracking-wide text-base uppercase">Moyen de paiement</h2>
          <p className="text-gold-700 text-xs mt-0.5">{formData.contributionType}</p>
        </div>
      </div>

      <div className="divider-gold my-4" />

      {/* Badge montant */}
      <div className="rounded-xl px-5 py-3 mb-6 flex items-center justify-between"
        style={{ background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.25)' }}>
        <span className="text-gold-700 text-sm">Montant à envoyer</span>
        <span className="text-gold-400 text-2xl font-bold">{amountFmt} <span className="text-base font-medium text-gold-600">FCFA</span></span>
      </div>

      <div className="space-y-3">
        {METHODS.map(m => (
          <button key={m.id}
            onClick={() => { update({ paymentMethod: m.id }); go('paying') }}
            className="w-full p-4 rounded-xl flex items-center gap-4 transition-all active:scale-95 group"
            style={{ background: m.bg, border: `1px solid ${m.border}` }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-all group-hover:scale-105"
              style={{ background: 'rgba(15,61,55,0.8)', border: `1px solid ${m.border}`, boxShadow: `0 4px 16px ${m.ring}` }}>
              {m.emoji}
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-base" style={{ color: m.text }}>{m.name}</div>
              <div className="text-xs text-gold-800 mt-0.5">{m.sub}</div>
            </div>
            <ChevronRight className="w-5 h-5 opacity-40" style={{ color: m.text }} />
          </button>
        ))}
      </div>
    </div>
  )
}

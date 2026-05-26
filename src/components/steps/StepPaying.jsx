'use client'

import { ExternalLink, ChevronLeft, CheckCircle2 } from 'lucide-react'

function getConfig(method, amount) {
  const wave = process.env.NEXT_PUBLIC_WAVE_PHONE || '0505000800'
  const mtn = process.env.NEXT_PUBLIC_MTN_PHONE || '0505000800'
  const orange = process.env.NEXT_PUBLIC_ORANGE_PHONE || '0749269369'
  const merchant = process.env.NEXT_PUBLIC_WAVE_MERCHANT_ID || ''
  const amt = parseInt(amount, 10)

  const configs = {
    wave: {
      title: 'Wave', emoji: '🌊',
      color: '#38bdf8',
      btnStyle: { background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' },
      link: merchant ? `https://pay.wave.com/m/${merchant}?amount=${amt}` : `https://wave.com`,
      steps: [`Destinataire : ${wave}`, `Montant : ${amt.toLocaleString('fr-FR')} FCFA`, 'Appuyez sur le bouton pour ouvrir Wave'],
      btnText: 'Ouvrir Wave', ussd: null,
    },
    mtn: {
      title: 'MTN Mobile Money', emoji: '📱',
      color: '#facc15',
      btnStyle: { background: 'linear-gradient(135deg, #ca8a04, #a16207)' },
      link: `tel:*133*${mtn}*${amt}%23`,
      steps: [`Numéro : ${mtn}`, `Montant : ${amt.toLocaleString('fr-FR')} FCFA`, 'Appuyez pour composer le code USSD'],
      btnText: `Composer *133*${mtn}*${amt}#`,
      ussd: `*133*${mtn}*${amt}#`,
    },
    orange: {
      title: 'Orange Money', emoji: '🍊',
      color: '#fb923c',
      btnStyle: { background: 'linear-gradient(135deg, #ea580c, #c2410c)' },
      link: `tel:*144*${orange}*${amt}%23`,
      steps: [`Numéro : ${orange}`, `Montant : ${amt.toLocaleString('fr-FR')} FCFA`, 'Appuyez pour composer le code USSD'],
      btnText: `Composer *144*${orange}*${amt}#`,
      ussd: `*144*${orange}*${amt}#`,
    },
  }
  return configs[method] || null
}

export default function StepPaying({ formData, go }) {
  const cfg = getConfig(formData.paymentMethod, formData.amount)
  if (!cfg) return null

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => go('payment')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gold-700 hover:text-gold-400 hover:bg-church-700/50 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-cinzel text-gold-400 font-semibold tracking-wide text-base uppercase">{cfg.title}</h2>
          <p className="text-gold-700 text-xs mt-0.5">{parseInt(formData.amount, 10).toLocaleString('fr-FR')} FCFA</p>
        </div>
      </div>

      <div className="divider-gold mb-5" />

      {/* Instructions */}
      <div className="rounded-xl p-5 mb-4"
        style={{ background: 'rgba(15,61,55,0.6)', border: '1px solid rgba(201,162,39,0.15)' }}>
        <div className="text-4xl text-center mb-4 animate-float">{cfg.emoji}</div>
        <div className="space-y-3">
          {cfg.steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'rgba(201,162,39,0.15)', border: '1px solid rgba(201,162,39,0.3)', color: '#c9a227' }}>
                {i + 1}
              </span>
              <span className="text-sm text-gold-300/80">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Code USSD */}
      {cfg.ussd && (
        <div className="rounded-xl p-3 mb-4 text-center"
          style={{ background: '#040f0e', border: '1px solid rgba(201,162,39,0.2)' }}>
          <code className="font-mono text-lg tracking-widest" style={{ color: '#c9a227' }}>{cfg.ussd}</code>
        </div>
      )}

      {/* Bouton opérateur */}
      <a href={cfg.link}
        className="w-full py-4 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mb-3 transition-all active:scale-95 shadow-lg"
        style={cfg.btnStyle}>
        {cfg.btnText} <ExternalLink className="w-4 h-4" />
      </a>

      {/* Bouton "J'ai payé" */}
      <button onClick={() => go('confirm')}
        className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-all shadow-gold"
        style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white' }}>
        <CheckCircle2 className="w-5 h-5" />
        J'ai effectué le paiement
      </button>

      <p className="text-center text-xs text-gold-800 mt-3">
        Le paiement s'effectue dans l'application de votre opérateur
      </p>
    </div>
  )
}

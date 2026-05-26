'use client'

import { ExternalLink, ChevronLeft, CheckCircle2 } from 'lucide-react'

function getConfig(method, amount) {
  const wave = process.env.NEXT_PUBLIC_WAVE_PHONE || '0505000800'
  const mtn  = process.env.NEXT_PUBLIC_MTN_PHONE  || '0505000800'
  const orange = process.env.NEXT_PUBLIC_ORANGE_PHONE || '0749269369'
  const merchant = process.env.NEXT_PUBLIC_WAVE_MERCHANT_ID || ''
  const amt = parseInt(amount, 10)
  return {
    wave:   { title:'Wave', emoji:'🌊', btnBg:'linear-gradient(135deg,#0ea5e9,#0284c7)', link: merchant?`https://pay.wave.com/m/${merchant}?amount=${amt}`:`https://wave.com`, steps:[`Destinataire : ${wave}`,`Montant : ${amt.toLocaleString('fr-FR')} FCFA`,'Appuyez pour ouvrir Wave'], btnText:'Ouvrir Wave', ussd:null },
    mtn:    { title:'MTN Mobile Money', emoji:'📱', btnBg:'linear-gradient(135deg,#ca8a04,#a16207)', link:`tel:*133*${mtn}*${amt}%23`, steps:[`Numéro : ${mtn}`,`Montant : ${amt.toLocaleString('fr-FR')} FCFA`,'Appuyez pour composer le USSD'], btnText:`Composer *133*${mtn}*${amt}#`, ussd:`*133*${mtn}*${amt}#` },
    orange: { title:'Orange Money', emoji:'🍊', btnBg:'linear-gradient(135deg,#ea580c,#c2410c)', link:`tel:*144*${orange}*${amt}%23`, steps:[`Numéro : ${orange}`,`Montant : ${amt.toLocaleString('fr-FR')} FCFA`,'Appuyez pour composer le USSD'], btnText:`Composer *144*${orange}*${amt}#`, ussd:`*144*${orange}*${amt}#` },
  }[method]
}

export default function StepPaying({ formData, go }) {
  const cfg = getConfig(formData.paymentMethod, formData.amount)
  if (!cfg) return null

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => go('payment')}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: '#edf7f4', color: '#155049' }}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-cinzel font-semibold tracking-wide text-base uppercase" style={{ color: '#0a2d28' }}>{cfg.title}</h2>
          <p className="text-xs mt-0.5" style={{ color: '#6b9e96' }}>{parseInt(formData.amount,10).toLocaleString('fr-FR')} FCFA</p>
        </div>
      </div>

      <div className="divider-gold mb-5" />

      {/* Instructions */}
      <div className="rounded-xl p-5 mb-4" style={{ background: '#f8fffe', border: '1.5px solid #d1e9e4' }}>
        <div className="text-4xl text-center mb-4">{cfg.emoji}</div>
        <div className="space-y-3">
          {cfg.steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: '#fdf8e8', border: '1.5px solid #c9a227', color: '#7a5c14' }}>{i+1}</span>
              <span className="text-sm" style={{ color: '#2d6b62' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* USSD */}
      {cfg.ussd && (
        <div className="rounded-xl p-3 mb-4 text-center" style={{ background: '#0a2d28' }}>
          <code className="font-mono text-lg tracking-widest" style={{ color: '#e8c84a' }}>{cfg.ussd}</code>
        </div>
      )}

      <a href={cfg.link}
        className="w-full py-4 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mb-3 active:scale-95 transition-all shadow-md"
        style={{ background: cfg.btnBg }}>
        {cfg.btnText} <ExternalLink className="w-4 h-4" />
      </a>

      <button onClick={() => go('confirm')}
        className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 active:scale-95 shadow-md"
        style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)', color: 'white' }}>
        <CheckCircle2 className="w-5 h-5" /> J'ai effectué le paiement
      </button>

      <p className="text-center text-xs mt-3" style={{ color: '#9dc4bc' }}>
        Le paiement s'effectue dans l'application de votre opérateur
      </p>
    </div>
  )
}

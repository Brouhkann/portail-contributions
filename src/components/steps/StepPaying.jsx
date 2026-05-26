'use client'

import { ExternalLink, ChevronLeft, CheckCircle2 } from 'lucide-react'

function getPaymentConfig(method, amount) {
  const wavePhone = process.env.NEXT_PUBLIC_WAVE_PHONE || '0700000000'
  const waveMerchant = process.env.NEXT_PUBLIC_WAVE_MERCHANT_ID || ''
  const mtnPhone = process.env.NEXT_PUBLIC_MTN_PHONE || '0700000000'
  const orangePhone = process.env.NEXT_PUBLIC_ORANGE_PHONE || '0700000000'
  const amt = parseInt(amount, 10)

  switch (method) {
    case 'wave':
      return {
        title: 'Paiement Wave',
        emoji: '🌊',
        color: 'sky',
        btnClass: 'bg-sky-500 hover:bg-sky-600 active:bg-sky-700',
        link: waveMerchant
          ? `https://pay.wave.com/m/${waveMerchant}?amount=${amt}`
          : `https://wave.com`,
        instructions: [
          { label: 'Destinataire', value: wavePhone },
          { label: 'Montant', value: `${amt.toLocaleString('fr-FR')} FCFA` },
          { label: 'Action', value: 'Appuyez sur le bouton pour ouvrir Wave' },
        ],
        buttonText: 'Ouvrir Wave',
        ussd: null,
      }
    case 'mtn':
      return {
        title: 'MTN Mobile Money',
        emoji: '📱',
        color: 'yellow',
        btnClass: 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700',
        link: `tel:*133*${mtnPhone}*${amt}%23`,
        instructions: [
          { label: 'Numéro', value: mtnPhone },
          { label: 'Montant', value: `${amt.toLocaleString('fr-FR')} FCFA` },
          { label: 'Code USSD', value: `*133*${mtnPhone}*${amt}#` },
        ],
        buttonText: `Composer *133*${mtnPhone}*${amt}#`,
        ussd: `*133*${mtnPhone}*${amt}#`,
      }
    case 'orange':
      return {
        title: 'Orange Money',
        emoji: '🍊',
        color: 'orange',
        btnClass: 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700',
        link: `tel:*144*${orangePhone}*${amt}%23`,
        instructions: [
          { label: 'Numéro', value: orangePhone },
          { label: 'Montant', value: `${amt.toLocaleString('fr-FR')} FCFA` },
          { label: 'Code USSD', value: `*144*${orangePhone}*${amt}#` },
        ],
        buttonText: `Composer *144*${orangePhone}*${amt}#`,
        ussd: `*144*${orangePhone}*${amt}#`,
      }
    default:
      return null
  }
}

export default function StepPaying({ formData, go }) {
  const config = getPaymentConfig(formData.paymentMethod, formData.amount)
  if (!config) return null

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => go('payment')}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{config.title}</h2>
          <p className="text-sm text-gray-400">
            {parseInt(formData.amount, 10).toLocaleString('fr-FR')} FCFA
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 rounded-2xl p-5 mb-5">
        <div className="text-4xl text-center mb-4">{config.emoji}</div>
        <div className="space-y-3">
          {config.instructions.map(({ label, value }, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm border border-gray-100">
                {i + 1}
              </span>
              <div>
                <span className="text-xs text-gray-400 block">{label}</span>
                <span className="text-sm font-semibold text-gray-700">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code USSD affiché */}
      {config.ussd && (
        <div className="bg-gray-900 rounded-xl p-3 mb-4 text-center">
          <span className="text-green-400 font-mono text-lg tracking-widest">{config.ussd}</span>
        </div>
      )}

      {/* Bouton paiement externe */}
      <a
        href={config.link}
        className={`w-full py-4 ${config.btnClass} text-white rounded-xl font-semibold text-base shadow-lg flex items-center justify-center gap-2 mb-3 transition-colors`}
      >
        {config.buttonText}
        <ExternalLink className="w-4 h-4" />
      </a>

      {/* Bouton "J'ai payé" */}
      <button
        onClick={() => go('confirm')}
        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
      >
        <CheckCircle2 className="w-5 h-5" />
        J'ai effectué le paiement
      </button>

      <p className="text-center text-xs text-gray-300 mt-3">
        Le paiement s'effectue dans l'application de votre opérateur
      </p>
    </div>
  )
}

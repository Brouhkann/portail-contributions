'use client'

import { Plus } from 'lucide-react'

const METHOD_LABELS = { wave: 'Wave', mtn: 'MTN Mobile Money', orange: 'Orange Money' }

export default function StepSuccess({ formData, reset }) {
  const displayName = formData.isAnonymous ? 'ami(e)' : ((formData.name || '').split(' ')[0] || 'ami(e)')

  const rows = [
    { label: 'Type', value: formData.contributionType },
    { label: 'Montant', value: `${parseInt(formData.amount, 10).toLocaleString('fr-FR')} FCFA`, big: true },
    { label: 'Via', value: METHOD_LABELS[formData.paymentMethod] || formData.paymentMethod },
    { label: 'Statut', value: '✓ Enregistré', green: true },
  ]

  return (
    <div className="p-7 text-center">
      {/* Animation de succès */}
      <div className="mb-8">
        <div className="relative w-24 h-24 mx-auto mb-5">
          {/* Halo */}
          <div className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(201,162,39,0.6), transparent)' }} />
          <div className="w-24 h-24 rounded-full flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, rgba(201,162,39,0.15), rgba(201,162,39,0.05))',
              border: '2px solid rgba(201,162,39,0.4)',
              boxShadow: '0 0 40px rgba(201,162,39,0.3)',
            }}>
            <span className="text-5xl animate-float">🙏</span>
          </div>
        </div>

        <h2 className="font-cinzel text-gold-400 text-2xl font-semibold tracking-wide uppercase">
          Merci {displayName} !
        </h2>
        <p className="text-gold-700 text-sm mt-2 leading-relaxed">
          Que Dieu bénisse votre contribution
        </p>

        {/* Étoiles décoratives */}
        <div className="flex justify-center gap-2 mt-3">
          {['✦', '✦', '✦'].map((s, i) => (
            <span key={i} className="text-gold-600 text-xs">{s}</span>
          ))}
        </div>
      </div>

      {/* Récapitulatif */}
      <div className="rounded-xl mb-6 overflow-hidden text-left"
        style={{ background: 'rgba(15,61,55,0.6)', border: '1px solid rgba(201,162,39,0.2)' }}>
        {rows.map(({ label, value, big, green }, i) => (
          <div key={label} className="flex justify-between items-center px-4 py-3"
            style={{ borderBottom: i < rows.length - 1 ? '1px solid rgba(201,162,39,0.08)' : 'none' }}>
            <span className="text-sm text-gold-700">{label}</span>
            <span className={`text-sm font-semibold ${
              big ? 'text-gold-400 text-base' :
              green ? 'text-emerald-400' :
              'text-gold-300'
            }`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Citation biblique */}
      <div className="rounded-xl p-4 mb-7"
        style={{ background: 'rgba(201,162,39,0.06)', border: '1px solid rgba(201,162,39,0.15)' }}>
        <p className="text-gold-300/80 text-sm italic leading-relaxed">
          "Que chacun donne comme il l'a résolu en son cœur, sans tristesse ni contrainte ;
          car Dieu aime celui qui donne avec joie."
        </p>
        <p className="text-gold-700 text-xs mt-2 font-cinzel tracking-wide">2 Corinthiens 9 : 7</p>
      </div>

      <button onClick={reset}
        className="btn-gold w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-gold">
        <Plus className="w-5 h-5" />
        Nouvelle contribution
      </button>
    </div>
  )
}

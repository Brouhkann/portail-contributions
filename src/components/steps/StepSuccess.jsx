'use client'

import { Plus, Share2 } from 'lucide-react'

const METHOD_LABELS = { wave: 'Wave', mtn: 'MTN Mobile Money', orange: 'Orange Money' }

export default function StepSuccess({ formData, reset }) {
  const displayName = formData.isAnonymous
    ? 'ami(e)'
    : ((formData.name || '').split(' ')[0] || 'ami(e)')

  const rows = [
    { label: 'Type', value: formData.contributionType },
    { label: 'Montant', value: `${parseInt(formData.amount, 10).toLocaleString('fr-FR')} FCFA`, big: true },
    { label: 'Via', value: METHOD_LABELS[formData.paymentMethod] || formData.paymentMethod },
    { label: 'Statut', value: '✓ Enregistré', green: true },
  ]

  return (
    <div className="p-7 text-center">
      {/* Illustration */}
      <div className="mb-7">
        <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-100">
          <span className="text-5xl">🙏</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Merci {displayName} !</h2>
        <p className="text-gray-400 mt-2 leading-relaxed">
          Que Dieu bénisse votre contribution généreuse
        </p>
      </div>

      {/* Récapitulatif */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-7 text-left divide-y divide-green-100">
        {rows.map(({ label, value, big, green }) => (
          <div key={label} className="flex justify-between items-center py-2.5">
            <span className="text-sm text-gray-400">{label}</span>
            <span className={`text-sm font-semibold ${
              big ? 'text-green-700 text-base' :
              green ? 'text-green-600' :
              'text-gray-700'
            }`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Citation */}
      <div className="bg-purple-50 rounded-xl p-4 mb-7">
        <p className="text-sm text-purple-600 italic leading-relaxed">
          "Que chacun donne comme il l'a résolu en son cœur, sans tristesse ni contrainte ; car Dieu aime celui qui donne avec joie."
        </p>
        <p className="text-xs text-purple-400 mt-1">2 Corinthiens 9:7</p>
      </div>

      <button
        onClick={reset}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
      >
        <Plus className="w-5 h-5" />
        Nouvelle contribution
      </button>
    </div>
  )
}

'use client'

import { AlertTriangle, CheckCircle2, ChevronLeft } from 'lucide-react'

const METHOD_LABELS = { wave: 'Wave', mtn: 'MTN Mobile Money', orange: 'Orange Money' }

export default function StepConfirm({ formData, go }) {
  const displayName = formData.isAnonymous
    ? 'Anonyme'
    : (formData.name || 'Non renseigné')

  const rows = [
    { label: 'Contributeur', value: displayName },
    { label: 'Type', value: formData.contributionType },
    { label: 'Montant', value: `${parseInt(formData.amount, 10).toLocaleString('fr-FR')} FCFA`, highlight: true },
    { label: 'Via', value: METHOD_LABELS[formData.paymentMethod] || formData.paymentMethod },
  ]

  return (
    <div className="p-6">
      <div className="text-center mb-7">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-9 h-9 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Confirmer le paiement</h2>
        <p className="text-sm text-gray-400 mt-1">
          Vérifiez les détails avant de valider
        </p>
      </div>

      {/* Récapitulatif */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-5 divide-y divide-gray-100">
        {rows.map(({ label, value, highlight }) => (
          <div key={label} className="flex justify-between items-center py-2.5">
            <span className="text-sm text-gray-400">{label}</span>
            <span className={`text-sm font-semibold ${highlight ? 'text-purple-700 text-base' : 'text-gray-800'}`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Avertissement */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex gap-2.5">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 leading-relaxed">
          En confirmant, vous attestez avoir effectué ce paiement.
          Aucune contribution n'est enregistrée sans votre confirmation.
        </p>
      </div>

      <button
        onClick={() => go('upload')}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-5 h-5" />
        Je confirme avoir payé
      </button>

      <button
        onClick={() => go('paying')}
        className="w-full mt-3 py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour au paiement
      </button>
    </div>
  )
}

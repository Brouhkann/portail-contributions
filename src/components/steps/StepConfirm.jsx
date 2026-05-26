'use client'

import { AlertTriangle, CheckCircle2, ChevronLeft } from 'lucide-react'

const METHOD_LABELS = { wave: 'Wave', mtn: 'MTN Mobile Money', orange: 'Orange Money' }

export default function StepConfirm({ formData, go }) {
  const displayName = formData.isAnonymous ? 'Anonyme' : (formData.name || 'Non renseigné')

  const rows = [
    { label: 'Contributeur', value: displayName },
    { label: 'Type', value: formData.contributionType },
    { label: 'Montant', value: `${parseInt(formData.amount, 10).toLocaleString('fr-FR')} FCFA`, highlight: true },
    { label: 'Via', value: METHOD_LABELS[formData.paymentMethod] || formData.paymentMethod },
  ]

  return (
    <div className="p-6">
      <div className="flex flex-col items-center mb-7">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'rgba(21,80,73,0.5)', border: '2px solid rgba(201,162,39,0.3)' }}>
          <CheckCircle2 className="w-8 h-8" style={{ color: '#c9a227' }} />
        </div>
        <h2 className="font-cinzel text-gold-400 font-semibold tracking-wide text-base uppercase text-center">
          Confirmer le paiement
        </h2>
        <p className="text-gold-700 text-xs mt-1 text-center">Vérifiez les détails avant de valider</p>
        <div className="divider-gold w-24 mt-3" />
      </div>

      {/* Récapitulatif */}
      <div className="rounded-xl mb-5 overflow-hidden"
        style={{ background: 'rgba(15,61,55,0.6)', border: '1px solid rgba(201,162,39,0.15)' }}>
        {rows.map(({ label, value, highlight }, i) => (
          <div key={label}
            className="flex justify-between items-center px-4 py-3"
            style={{ borderBottom: i < rows.length - 1 ? '1px solid rgba(201,162,39,0.08)' : 'none' }}>
            <span className="text-sm text-gold-700">{label}</span>
            <span className={`text-sm font-semibold ${highlight ? 'text-gold-400 text-base' : 'text-gold-300'}`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Avertissement */}
      <div className="rounded-xl p-3 mb-6 flex gap-2.5"
        style={{ background: 'rgba(180,83,9,0.1)', border: '1px solid rgba(217,119,6,0.25)' }}>
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#d97706' }} />
        <p className="text-xs leading-relaxed" style={{ color: '#fcd34d' }}>
          En confirmant, vous attestez avoir effectué ce paiement.
          Aucune contribution n'est enregistrée sans votre confirmation.
        </p>
      </div>

      <button onClick={() => go('upload')}
        className="btn-gold w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-gold">
        <CheckCircle2 className="w-5 h-5" />
        Je confirme avoir payé
      </button>

      <button onClick={() => go('paying')}
        className="w-full mt-3 py-3 text-gold-800 hover:text-gold-600 text-sm transition-colors flex items-center justify-center gap-1">
        <ChevronLeft className="w-4 h-4" /> Retour au paiement
      </button>
    </div>
  )
}

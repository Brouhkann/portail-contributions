'use client'

import { AlertTriangle, CheckCircle2, ChevronLeft } from 'lucide-react'

const METHOD_LABELS = { wave: 'Wave', mtn: 'MTN Mobile Money', orange: 'Orange Money' }

export default function StepConfirm({ formData, go }) {
  const displayName = formData.isAnonymous ? 'Anonyme' : (formData.name || 'Non renseigné')
  const rows = [
    { label: 'Contributeur', value: displayName },
    { label: 'Type', value: formData.contributionDetail ? `${formData.contributionType} — ${formData.contributionDetail}` : formData.contributionType },
    { label: 'Montant', value: `${parseInt(formData.amount,10).toLocaleString('fr-FR')} FCFA`, big: true },
    { label: 'Via', value: METHOD_LABELS[formData.paymentMethod] || formData.paymentMethod },
  ]

  return (
    <div className="p-6">
      <div className="flex flex-col items-center mb-6">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ background: '#edf7f4', border: '2px solid rgba(201,162,39,0.4)' }}>
          <CheckCircle2 className="w-7 h-7" style={{ color: '#c9a227' }} />
        </div>
        <h2 className="font-cinzel font-semibold tracking-wide text-base uppercase text-center" style={{ color: '#0a2d28' }}>
          Confirmer le paiement
        </h2>
        <p className="text-xs mt-1 text-center" style={{ color: '#6b9e96' }}>Vérifiez les détails avant de valider</p>
        <div className="divider-gold w-24 mt-3" />
      </div>

      {/* Récapitulatif */}
      <div className="rounded-xl mb-5 overflow-hidden" style={{ border: '1.5px solid #d1e9e4' }}>
        {rows.map(({ label, value, big }, i) => (
          <div key={label} className="flex justify-between items-center px-4 py-3"
            style={{ borderBottom: i < rows.length - 1 ? '1px solid #edf7f4' : 'none', background: i % 2 === 0 ? '#f8fffe' : '#ffffff' }}>
            <span className="text-sm" style={{ color: '#6b9e96' }}>{label}</span>
            <span className={`font-semibold ${big ? 'text-base' : 'text-sm'}`}
              style={{ color: big ? '#0a2d28' : '#155049' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Avertissement */}
      <div className="rounded-xl p-3 mb-6 flex gap-2.5"
        style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#d97706' }} />
        <p className="text-xs leading-relaxed" style={{ color: '#92400e' }}>
          En confirmant, vous attestez avoir effectué ce paiement. Aucune contribution n'est enregistrée sans votre confirmation.
        </p>
      </div>

      <button onClick={() => go('upload')}
        className="btn-gold w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-md">
        <CheckCircle2 className="w-5 h-5" /> Je confirme avoir payé
      </button>

      <button onClick={() => go('paying')}
        className="w-full mt-3 py-3 text-sm flex items-center justify-center gap-1 transition-colors"
        style={{ color: '#9dc4bc' }}>
        <ChevronLeft className="w-4 h-4" /> Retour au paiement
      </button>
    </div>
  )
}

'use client'

import { ChevronLeft } from 'lucide-react'

const METHOD_LABELS = { wave: 'Wave', mtn: 'MTN Mobile Money', orange: 'Orange Money' }

export default function StepSuccess({ formData, reset }) {
  const displayName = formData.isAnonymous ? 'ami(e)' : ((formData.name || '').split(' ')[0] || 'ami(e)')
  const rows = [
    { label: 'Type', value: formData.contributionType },
    { label: 'Montant', value: `${parseInt(formData.amount,10).toLocaleString('fr-FR')} FCFA`, big: true },
    { label: 'Via', value: METHOD_LABELS[formData.paymentMethod] || formData.paymentMethod },
    { label: 'Statut', value: '✓ Enregistré', green: true },
  ]

  return (
    <div className="p-7 text-center">
      {/* Succès */}
      <div className="mb-7">
        <div className="relative w-24 h-24 mx-auto mb-5">
          <div className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(201,162,39,0.5), transparent)' }} />
          <div className="w-24 h-24 rounded-full flex items-center justify-center relative"
            style={{ background: 'linear-gradient(135deg,#fdf8e8,#faefc0)', border: '2px solid rgba(201,162,39,0.5)', boxShadow: '0 4px 20px rgba(201,162,39,0.25)' }}>
            <span className="text-4xl">🙏</span>
          </div>
        </div>
        <h2 className="font-cinzel font-semibold text-2xl tracking-wide uppercase" style={{ color: '#0a2d28' }}>
          Merci {displayName} !
        </h2>
        <p className="text-sm mt-2" style={{ color: '#6b9e96' }}>Que Dieu bénisse votre contribution</p>
        <div className="flex justify-center gap-2 mt-3">
          {['✦','✦','✦'].map((s,i) => <span key={i} className="text-xs" style={{ color: '#c9a227' }}>{s}</span>)}
        </div>
      </div>

      {/* Récap */}
      <div className="rounded-xl mb-6 overflow-hidden text-left" style={{ border: '1.5px solid #d1e9e4' }}>
        {rows.map(({ label, value, big, green }, i) => (
          <div key={label} className="flex justify-between items-center px-4 py-3"
            style={{ borderBottom: i < rows.length-1 ? '1px solid #edf7f4' : 'none', background: i%2===0?'#f8fffe':'#ffffff' }}>
            <span className="text-sm" style={{ color: '#6b9e96' }}>{label}</span>
            <span className={`font-semibold ${big?'text-base':''}`}
              style={{ color: green?'#16a34a': big?'#0a2d28':'#155049' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Citation */}
      <div className="rounded-xl p-4 mb-7 text-left"
        style={{ background: 'linear-gradient(135deg,#fdf8e8,#fffdf5)', border: '1.5px solid rgba(201,162,39,0.3)' }}>
        <p className="text-sm italic leading-relaxed" style={{ color: '#7a5c14' }}>
          "Que chacun donne comme il l'a résolu en son cœur, sans tristesse ni contrainte ;
          car Dieu aime celui qui donne avec joie."
        </p>
        <p className="text-xs mt-2 font-cinzel tracking-wide" style={{ color: '#a07c1e' }}>2 Corinthiens 9 : 7</p>
      </div>

      <button onClick={reset}
        className="btn-gold w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-md">
        <ChevronLeft className="w-5 h-5" /> Retour
      </button>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const TYPES = [
  { label: 'Dîme',    icon: '💰', desc: 'Dîme du mois' },
  { label: 'Offrande', icon: '🙏', desc: 'Offrande du culte' },
  { label: 'Semence',  icon: '🌱', desc: 'Précisez le sujet', needsDetail: true },
]

export default function StepType({ formData, update, go }) {
  const [selected, setSelected] = useState(formData.contributionType || '')
  const [detail, setDetail] = useState(formData.contributionDetail || '')
  const [showDetail, setShowDetail] = useState(formData.contributionType === 'Semence')
  const [error, setError] = useState('')

  function handleSelect(type) {
    setSelected(type.label)
    setError('')

    if (type.needsDetail) {
      // Semence → afficher le champ de détail, ne pas avancer encore
      setShowDetail(true)
      update({ contributionType: type.label, contributionDetail: detail })
    } else {
      // Dîme / Offrande → avancer immédiatement
      setShowDetail(false)
      update({ contributionType: type.label, contributionDetail: '' })
      go('amount')
    }
  }

  function handleConfirmSemence() {
    if (!detail.trim()) { setError('Veuillez préciser le sujet de votre semence.'); return }
    update({ contributionType: 'Semence', contributionDetail: detail.trim() })
    go('amount')
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => go('welcome')}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: '#edf7f4', color: '#155049' }}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-cinzel font-semibold tracking-wide text-base uppercase" style={{ color: '#0a2d28' }}>
            Type de contribution
          </h2>
          {!formData.isAnonymous && formData.name && (
            <p className="text-xs mt-0.5" style={{ color: '#6b9e96' }}>{formData.name.split(' ')[0]}</p>
          )}
        </div>
      </div>

      <div className="divider-gold mb-5" />

      {/* 3 options */}
      <div className="space-y-3 mb-5">
        {TYPES.map((type) => {
          const sel = selected === type.label
          return (
            <button key={type.label} onClick={() => handleSelect(type)}
              className="w-full p-4 rounded-xl flex items-center gap-4 text-left transition-all active:scale-[0.98]"
              style={{
                background: sel ? 'linear-gradient(135deg,#fdf8e8,#faefc0)' : '#f8fffe',
                border: sel ? '2px solid #c9a227' : '1.5px solid #d1e9e4',
                boxShadow: sel ? '0 4px 12px rgba(201,162,39,0.2)' : 'none',
              }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: sel ? 'rgba(201,162,39,0.15)' : '#edf7f4', border: sel ? '1.5px solid rgba(201,162,39,0.4)' : '1.5px solid #d1e9e4' }}>
                {type.icon}
              </div>
              <div className="flex-1">
                <p className="font-bold text-base" style={{ color: sel ? '#7a5c14' : '#0a2d28' }}>{type.label}</p>
                <p className="text-xs mt-0.5" style={{ color: sel ? '#a07c1e' : '#6b9e96' }}>{type.desc}</p>
              </div>
              {/* Flèche uniquement si sélection auto */}
              {!type.needsDetail && (
                <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: sel ? '#c9a227' : '#b8dbd5' }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Champ détail Semence */}
      {showDetail && selected === 'Semence' && (
        <div className="rounded-xl p-4 mb-4"
          style={{ background: 'linear-gradient(135deg,#fdf8e8,#fffdf5)', border: '1.5px solid rgba(201,162,39,0.35)' }}>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#7a5c14' }}>
            Sujet de la semence
          </label>
          <input
            type="text"
            value={detail}
            onChange={e => { setDetail(e.target.value); setError(''); update({ contributionDetail: e.target.value }) }}
            placeholder="Ex : Construction, Guérison, Bénédiction…"
            autoFocus
            className="w-full px-4 py-3 rounded-xl input-church text-sm"
          />
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

          <button onClick={handleConfirmSemence}
            className="btn-gold w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-md mt-3">
            Confirmer <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      <p className="text-center text-xs" style={{ color: '#b8dbd5' }}>
        {selected === 'Semence' ? 'Précisez le sujet et confirmez' : 'Appuyez sur une option pour continuer'}
      </p>
    </div>
  )
}

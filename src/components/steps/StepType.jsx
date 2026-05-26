'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const TYPES = [
  { label: 'Dîme', icon: '💰' },
  { label: 'Offrande', icon: '🙏' },
  { label: 'Construction', icon: '🏗️' },
  { label: 'Projet spécial', icon: '⭐' },
  { label: 'Action sociale', icon: '❤️' },
  { label: 'Remerciement', icon: '🌟' },
  { label: 'Soutien ministère', icon: '📖' },
  { label: 'Autre', icon: '📝' },
]

export default function StepType({ formData, update, go }) {
  const [selected, setSelected] = useState(formData.contributionType || '')

  function handleSelect(label) { setSelected(label); update({ contributionType: label }) }
  function handleNext() { if (selected) go('amount') }

  const displayName = formData.isAnonymous ? null : (formData.name ? formData.name.split(' ')[0] : null)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => go('welcome')}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors text-gold-700 hover:text-gold-400 hover:bg-church-700/50">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-cinzel text-gold-400 font-semibold tracking-wide text-base uppercase">
            Type de contribution
          </h2>
          {displayName && <p className="text-gold-700 text-xs mt-0.5">{displayName}</p>}
        </div>
      </div>

      <div className="divider-gold mb-5" />

      {/* Grille des types */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {TYPES.map(({ label, icon }) => {
          const isSelected = selected === label
          return (
            <button key={label} onClick={() => handleSelect(label)}
              className="p-4 rounded-xl text-left transition-all active:scale-95"
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(201,162,39,0.15), rgba(201,162,39,0.08))'
                  : 'rgba(15,61,55,0.5)',
                border: isSelected
                  ? '1px solid rgba(201,162,39,0.6)'
                  : '1px solid rgba(201,162,39,0.1)',
                boxShadow: isSelected ? '0 4px 16px rgba(201,162,39,0.2)' : 'none',
              }}>
              <div className="text-2xl mb-2">{icon}</div>
              <div className={`text-sm font-semibold leading-tight ${isSelected ? 'text-gold-400' : 'text-gold-600'}`}>
                {label}
              </div>
            </button>
          )
        })}
      </div>

      <button onClick={handleNext} disabled={!selected}
        className={`w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
          selected ? 'btn-gold shadow-gold' : 'cursor-not-allowed text-church-600'
        }`}
        style={!selected ? { background: 'rgba(15,61,55,0.5)', border: '1px solid rgba(201,162,39,0.1)' } : {}}>
        Continuer <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

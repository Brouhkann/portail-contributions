'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const TYPES = [
  { label: 'Dîme', icon: '💰' }, { label: 'Offrande', icon: '🙏' },
  { label: 'Construction', icon: '🏗️' }, { label: 'Projet spécial', icon: '⭐' },
  { label: 'Action sociale', icon: '❤️' }, { label: 'Remerciement', icon: '🌟' },
  { label: 'Soutien ministère', icon: '📖' }, { label: 'Autre', icon: '📝' },
]

export default function StepType({ formData, update, go }) {
  const [selected, setSelected] = useState(formData.contributionType || '')
  function handle(label) { setSelected(label); update({ contributionType: label }) }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => go('welcome')}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
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

      <div className="grid grid-cols-2 gap-3 mb-6">
        {TYPES.map(({ label, icon }) => {
          const sel = selected === label
          return (
            <button key={label} onClick={() => handle(label)}
              className="p-4 rounded-xl text-left transition-all active:scale-95"
              style={{
                background: sel ? 'linear-gradient(135deg, #fdf8e8, #faefc0)' : '#f8fffe',
                border: sel ? '2px solid #c9a227' : '1.5px solid #d1e9e4',
                boxShadow: sel ? '0 4px 12px rgba(201,162,39,0.2)' : 'none',
              }}>
              <div className="text-2xl mb-1.5">{icon}</div>
              <div className="text-sm font-semibold leading-tight" style={{ color: sel ? '#7a5c14' : '#155049' }}>
                {label}
              </div>
            </button>
          )
        })}
      </div>

      <button onClick={() => selected && go('amount')} disabled={!selected}
        className={`w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${selected ? 'btn-gold shadow-md' : 'cursor-not-allowed'}`}
        style={!selected ? { background: '#e8f5f3', color: '#9dc4bc', border: '1.5px solid #d1e9e4' } : {}}>
        Continuer <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

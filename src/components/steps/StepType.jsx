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

  function handleSelect(label) {
    setSelected(label)
    update({ contributionType: label })
  }

  function handleNext() {
    if (selected) go('amount')
  }

  const displayName = formData.isAnonymous
    ? 'Anonyme'
    : (formData.name ? formData.name.split(' ')[0] : null)

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => go('welcome')}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Type de contribution</h2>
          {displayName && <p className="text-sm text-gray-400">{displayName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-7">
        {TYPES.map(({ label, icon }) => {
          const isSelected = selected === label
          return (
            <button
              key={label}
              onClick={() => handleSelect(label)}
              className={`p-4 rounded-xl border-2 text-left transition-all active:scale-95 ${
                isSelected
                  ? 'border-purple-400 bg-purple-50 shadow-md shadow-purple-100'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200'
              }`}
            >
              <div className="text-2xl mb-1.5">{icon}</div>
              <div className={`text-sm font-semibold leading-tight ${isSelected ? 'text-purple-700' : 'text-gray-700'}`}>
                {label}
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={!selected}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
          selected
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg active:scale-95'
            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
        }`}
      >
        Continuer <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

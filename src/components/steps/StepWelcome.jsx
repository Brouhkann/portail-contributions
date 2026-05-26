'use client'

import { useState } from 'react'
import { ChevronRight, UserX } from 'lucide-react'
import { clearUser } from '@/lib/storage'

function InputField({ icon, ...props }) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-700">{icon}</span>
      <input
        {...props}
        className="w-full pl-11 pr-4 py-3.5 rounded-xl input-church text-white text-sm"
      />
    </div>
  )
}

export default function StepWelcome({ formData, update, handleIdentified, isReturning }) {
  const [showForm, setShowForm] = useState(!isReturning)
  const [localName, setLocalName] = useState(formData.name || '')
  const [localPhone, setLocalPhone] = useState(formData.phone || '')
  const [rememberMe, setRememberMe] = useState(true)

  function handleContinue() {
    handleIdentified(formData.name, formData.phone, true, false)
  }

  function handleChangeUser() {
    clearUser()
    setLocalName('')
    setLocalPhone('')
    setShowForm(true)
  }

  function handleSubmit() {
    handleIdentified(localName.trim(), localPhone.trim(), rememberMe, false)
  }

  function handleAnonymous() {
    handleIdentified('', '', false, true)
  }

  if (isReturning && !showForm) {
    const firstName = (formData.name || '').split(' ')[0] || 'ami(e)'
    return (
      <div className="p-7">
        {/* Décoratif */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 animate-pulse-gold"
            style={{ background: 'linear-gradient(135deg, #1c6659, #0f3d37)', border: '2px solid rgba(201,162,39,0.4)' }}>
            <span className="text-2xl">🕯️</span>
          </div>
          <h1 className="font-cinzel text-gold-400 text-xl font-semibold tracking-widest uppercase text-center">
            Contributions
          </h1>
          <div className="divider-gold w-24 mt-2" />
        </div>

        {/* Accueil personnalisé */}
        <div className="rounded-xl p-5 mb-7 text-center"
          style={{ background: 'rgba(21,80,73,0.4)', border: '1px solid rgba(201,162,39,0.2)' }}>
          <p className="text-3xl mb-2">👋</p>
          <p className="text-gold-300 text-lg font-semibold">Bon retour, {firstName} !</p>
          {formData.phone && <p className="text-gold-700 text-sm mt-0.5">{formData.phone}</p>}
        </div>

        <button onClick={handleContinue} className="btn-gold w-full py-4 rounded-xl text-base flex items-center justify-center gap-2 shadow-gold">
          Faire une contribution <ChevronRight className="w-5 h-5" />
        </button>

        <button onClick={handleChangeUser} className="w-full mt-3 py-3 text-gold-800 hover:text-gold-600 text-sm transition-colors">
          Ce n'est pas moi
        </button>
      </div>
    )
  }

  return (
    <div className="p-7">
      {/* En-tête */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'linear-gradient(135deg, #1c6659, #0f3d37)', border: '2px solid rgba(201,162,39,0.4)' }}>
          <span className="text-2xl">🕯️</span>
        </div>
        <h1 className="font-cinzel text-gold-400 text-xl font-semibold tracking-widest uppercase text-center">
          Contributions
        </h1>
        <p className="text-gold-700 text-xs tracking-wide mt-1">Renseignez vos informations (optionnel)</p>
        <div className="divider-gold w-24 mt-2" />
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-gold-600 text-xs uppercase tracking-widest mb-2 font-medium">
            Nom complet <span className="text-gold-800 normal-case tracking-normal">(optionnel)</span>
          </label>
          <InputField
            icon="👤"
            type="text"
            value={localName}
            onChange={e => setLocalName(e.target.value)}
            placeholder="Ex : Jean Kouassi"
            autoComplete="name"
          />
        </div>

        <div>
          <label className="block text-gold-600 text-xs uppercase tracking-widest mb-2 font-medium">
            Téléphone <span className="text-gold-800 normal-case tracking-normal">(optionnel)</span>
          </label>
          <InputField
            icon="📱"
            type="tel"
            value={localPhone}
            onChange={e => setLocalPhone(e.target.value)}
            placeholder="Ex : 0707070707"
            inputMode="numeric"
            autoComplete="tel"
          />
        </div>

        {(localName || localPhone) && (
          <label className="flex items-center gap-3 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer accent-gold-500"
            />
            <span className="text-gold-700 text-sm">Se souvenir de moi sur cet appareil</span>
          </label>
        )}
      </div>

      <button onClick={handleSubmit} className="btn-gold w-full py-4 rounded-xl text-base flex items-center justify-center gap-2 shadow-gold">
        Continuer <ChevronRight className="w-5 h-5" />
      </button>

      <div className="mt-5 text-center">
        <div className="divider-gold mb-4" />
        <button onClick={handleAnonymous}
          className="inline-flex items-center gap-2 text-sm text-gold-800 hover:text-gold-600 transition-colors">
          <UserX className="w-4 h-4" />
          Contribuer anonymement
        </button>
      </div>
    </div>
  )
}

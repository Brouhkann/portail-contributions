'use client'

import { useState } from 'react'
import { User, Phone, ChevronRight, UserX } from 'lucide-react'
import { clearUser } from '@/lib/storage'

export default function StepWelcome({ formData, update, handleIdentified, isReturning }) {
  const [showForm, setShowForm] = useState(!isReturning)
  const [localName, setLocalName] = useState(formData.name || '')
  const [localPhone, setLocalPhone] = useState(formData.phone || '')
  const [rememberMe, setRememberMe] = useState(true)

  function handleContinueAsKnown() {
    handleIdentified(formData.name, formData.phone, true, false)
  }

  function handleChangeUser() {
    clearUser()
    setLocalName('')
    setLocalPhone('')
    update({ name: '', phone: '' })
    setShowForm(true)
  }

  function handleSubmit() {
    handleIdentified(localName.trim(), localPhone.trim(), rememberMe, false)
  }

  function handleAnonymous() {
    handleIdentified('', '', false, true)
  }

  // Écran de bienvenue pour utilisateur reconnu
  if (isReturning && !showForm) {
    const firstName = (formData.name || '').split(' ')[0] || 'ami(e)'
    return (
      <div className="p-7">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏛️</div>
          <h1 className="text-2xl font-bold text-gray-800">Contributions</h1>
          <p className="text-sm text-gray-400 mt-1">Plateforme sécurisée</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-5 mb-6 text-center">
          <div className="text-4xl mb-2">👋</div>
          <p className="text-xl font-bold text-purple-800">Bonjour {firstName} !</p>
          {formData.phone && (
            <p className="text-sm text-purple-500 mt-1">{formData.phone}</p>
          )}
        </div>

        <button
          onClick={handleContinueAsKnown}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          Contribuer <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={handleChangeUser}
          className="w-full mt-3 py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Ce n'est pas moi
        </button>
      </div>
    )
  }

  // Formulaire d'identification
  return (
    <div className="p-7">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🏛️</div>
        <h1 className="text-2xl font-bold text-gray-800">Contributions</h1>
        <p className="text-sm text-gray-400 mt-1">Renseignez vos informations (optionnel)</p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Nom complet <span className="text-gray-300 font-normal">(optionnel)</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-300" />
            <input
              type="text"
              value={localName}
              onChange={e => setLocalName(e.target.value)}
              placeholder="Ex : Jean Kouassi"
              autoComplete="name"
              className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent text-gray-800 placeholder-gray-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Téléphone <span className="text-gray-300 font-normal">(optionnel)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-300" />
            <input
              type="tel"
              value={localPhone}
              onChange={e => setLocalPhone(e.target.value)}
              placeholder="Ex : 0707070707"
              inputMode="numeric"
              autoComplete="tel"
              className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent text-gray-800 placeholder-gray-300"
            />
          </div>
        </div>

        {(localName || localPhone) && (
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="w-5 h-5 rounded accent-purple-600 cursor-pointer"
            />
            <span className="text-sm text-gray-500">Se souvenir de moi sur cet appareil</span>
          </label>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
      >
        Continuer <ChevronRight className="w-5 h-5" />
      </button>

      <div className="mt-4 text-center">
        <button
          onClick={handleAnonymous}
          className="inline-flex items-center gap-1.5 text-sm text-gray-300 hover:text-gray-500 transition-colors"
        >
          <UserX className="w-4 h-4" />
          Contribuer anonymement
        </button>
      </div>
    </div>
  )
}

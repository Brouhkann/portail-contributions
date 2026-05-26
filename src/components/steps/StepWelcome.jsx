'use client'

import { useState } from 'react'
import { ChevronRight, UserX } from 'lucide-react'
import { clearUser } from '@/lib/storage'

export default function StepWelcome({ formData, update, handleIdentified, isReturning }) {
  const [showForm, setShowForm] = useState(!isReturning)
  const [localName, setLocalName] = useState(formData.name || '')
  const [localPhone, setLocalPhone] = useState(formData.phone || '')
  const [rememberMe, setRememberMe] = useState(true)

  function handleContinue() { handleIdentified(formData.name, formData.phone, true, false) }
  function handleChangeUser() { clearUser(); setLocalName(''); setLocalPhone(''); setShowForm(true) }
  function handleSubmit() { handleIdentified(localName.trim(), localPhone.trim(), rememberMe, false) }
  function handleAnonymous() { handleIdentified('', '', false, true) }

  if (isReturning && !showForm) {
    const firstName = (formData.name || '').split(' ')[0] || 'ami(e)'
    return (
      <div className="p-7">
        <div className="text-center mb-7">
          <div className="text-4xl mb-3">🕯️</div>
          <h1 className="font-cinzel font-semibold text-xl tracking-widest uppercase" style={{ color: '#0a2d28' }}>
            Contributions
          </h1>
          <div className="divider-gold w-20 mx-auto mt-2" />
        </div>

        <div className="rounded-2xl p-5 mb-6 text-center"
          style={{ background: 'linear-gradient(135deg, #edf7f4, #f5faf8)', border: '1.5px solid rgba(201,162,39,0.3)' }}>
          <p className="text-3xl mb-2">👋</p>
          <p className="font-semibold text-lg" style={{ color: '#0a2d28' }}>Bon retour, {firstName} !</p>
          {formData.phone && <p className="text-sm mt-0.5" style={{ color: '#6b9e96' }}>{formData.phone}</p>}
        </div>

        <button onClick={handleContinue}
          className="btn-gold w-full py-4 rounded-xl text-base flex items-center justify-center gap-2 shadow-md">
          Faire une contribution <ChevronRight className="w-5 h-5" />
        </button>
        <button onClick={handleChangeUser}
          className="w-full mt-3 py-3 text-sm transition-colors" style={{ color: '#9dc4bc' }}>
          Ce n'est pas moi
        </button>
      </div>
    )
  }

  return (
    <div className="p-7">
      <div className="text-center mb-7">
        <div className="text-4xl mb-3">🕯️</div>
        <h1 className="font-cinzel font-semibold text-xl tracking-widest uppercase" style={{ color: '#0a2d28' }}>
          Contributions
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6b9e96' }}>Renseignez vos informations (optionnel)</p>
        <div className="divider-gold w-20 mx-auto mt-2" />
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#155049' }}>
            Nom complet <span className="normal-case tracking-normal font-normal" style={{ color: '#9dc4bc' }}>(optionnel)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">👤</span>
            <input type="text" value={localName} onChange={e => setLocalName(e.target.value)}
              placeholder="Ex : Jean Kouassi" autoComplete="name"
              className="w-full pl-10 pr-4 py-3.5 rounded-xl input-church text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#155049' }}>
            Téléphone <span className="normal-case tracking-normal font-normal" style={{ color: '#9dc4bc' }}>(optionnel)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">📱</span>
            <input type="tel" value={localPhone} onChange={e => setLocalPhone(e.target.value)}
              placeholder="Ex : 0707070707" inputMode="numeric" autoComplete="tel"
              className="w-full pl-10 pr-4 py-3.5 rounded-xl input-church text-sm" />
          </div>
        </div>

        {(localName || localPhone) && (
          <label className="flex items-center gap-3 cursor-pointer select-none pt-1">
            <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer accent-amber-600" />
            <span className="text-sm" style={{ color: '#4a7a72' }}>Se souvenir de moi sur cet appareil</span>
          </label>
        )}
      </div>

      <button onClick={handleSubmit}
        className="btn-gold w-full py-4 rounded-xl text-base flex items-center justify-center gap-2 shadow-md">
        Continuer <ChevronRight className="w-5 h-5" />
      </button>

      <div className="mt-5 text-center">
        <div className="divider-gold mb-4" />
        <button onClick={handleAnonymous}
          className="inline-flex items-center gap-2 text-sm transition-colors" style={{ color: '#9dc4bc' }}>
          <UserX className="w-4 h-4" /> Contribuer anonymement
        </button>
      </div>
    </div>
  )
}

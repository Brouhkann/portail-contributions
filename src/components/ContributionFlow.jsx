'use client'

import { useState, useEffect } from 'react'
import { loadUser, saveUser } from '@/lib/storage'
import { supabase } from '@/lib/supabase'
import StepWelcome from './steps/StepWelcome'
import StepType from './steps/StepType'
import StepAmount from './steps/StepAmount'
import StepPayment from './steps/StepPayment'
import StepPaying from './steps/StepPaying'
import StepConfirm from './steps/StepConfirm'
import StepUpload from './steps/StepUpload'
import StepSuccess from './steps/StepSuccess'

const ORDERED_STEPS = ['welcome', 'type', 'amount', 'payment', 'paying', 'confirm', 'upload', 'success']

const initialForm = {
  name: '', phone: '', rememberMe: true, isAnonymous: false,
  contributionType: '', amount: '', paymentMethod: '',
}

/* Icône flamme SVG inline — reprend le motif du logo */
function FlameIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 28" fill="none">
      <path d="M12 2C12 2 8 7 8 12c0 2 1 3.5 2 4.5C9.5 15 9 13.5 9 12c0-1.5.5-3 1.5-4C10 10 10 12 11 13.5c.5.8 1 1.5 1 2.5a3 3 0 01-3 3 5 5 0 005 5 5 5 0 005-5c0-3-2-5-3-7-1-2-1-4 0-6-1 1-2 3-2 5 0 1 .5 2 1 2.5C16 12 16 10 15 8c-1-2-3-6-3-6z" fill="url(#flameGrad)" />
      <defs>
        <linearGradient id="flameGrad" x1="12" y1="2" x2="12" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f5e098" />
          <stop offset="0.5" stopColor="#c9a227" />
          <stop offset="1" stopColor="#a07c1e" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function ContributionFlow() {
  const [step, setStep] = useState('welcome')
  const [isReturning, setIsReturning] = useState(false)
  const [formData, setFormData] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    const saved = loadUser()
    if (saved) {
      setFormData(prev => ({ ...prev, name: saved.name || '', phone: saved.phone || '' }))
      setIsReturning(true)
    }
  }, [])

  function update(patch) { setFormData(prev => ({ ...prev, ...patch })) }

  function go(nextStep) {
    setStep(nextStep)
    setSubmitError(null)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleIdentified(name, phone, rememberMe, anonymous) {
    update({ name, phone, rememberMe, isAnonymous: anonymous })
    if (rememberMe && (name || phone)) saveUser(name, phone)
    go('type')
  }

  async function submit(proofImageUrl) {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const { error } = await supabase.from('contributions').insert({
        contributor_name: formData.isAnonymous ? null : (formData.name || null),
        contributor_phone: formData.isAnonymous ? null : (formData.phone || null),
        type_label: formData.contributionType,
        amount: parseInt(formData.amount, 10),
        payment_method: formData.paymentMethod,
        proof_image_url: proofImageUrl || null,
        status: 'confirmed',
      })
      if (error) throw error
      go('success')
    } catch (err) {
      setSubmitError(err.message || 'Erreur lors de l\'enregistrement.')
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setFormData({ ...initialForm, name: formData.name, phone: formData.phone, rememberMe: formData.rememberMe })
    go('welcome')
  }

  const stepIndex = ORDERED_STEPS.indexOf(step)
  const progressPct = step === 'success' ? 100 : Math.round((stepIndex / (ORDERED_STEPS.length - 2)) * 100)

  const commonProps = { formData, update, go, submit, submitting, isReturning, handleIdentified }
  const STEPS = {
    welcome: <StepWelcome {...commonProps} />,
    type: <StepType {...commonProps} />,
    amount: <StepAmount {...commonProps} />,
    payment: <StepPayment {...commonProps} />,
    paying: <StepPaying {...commonProps} />,
    confirm: <StepConfirm {...commonProps} />,
    upload: <StepUpload {...commonProps} />,
    success: <StepSuccess {...commonProps} reset={reset} />,
  }

  return (
    <div className="min-h-screen bg-church-gradient flex flex-col items-center pt-6 px-4 pb-12">
      {/* Particules décoratives */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gold-500/5 blur-3xl" />
        <div className="absolute bottom-32 right-8 w-48 h-48 rounded-full bg-gold-500/4 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-church-700/20 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* En-tête église */}
        <div className="flex items-center justify-between mb-5 px-1">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-church-800 border border-gold-600/40 flex items-center justify-center shadow-gold-sm">
                <FlameIcon size={22} />
              </div>
            </div>
            <div>
              <p className="font-cinzel text-gold-400 font-semibold text-sm tracking-[0.15em] uppercase leading-tight">
                Vases d'Honneur
              </p>
              <p className="text-gold-700 text-xs tracking-[0.1em] italic">Foi Inébranlable</p>
            </div>
          </div>
          {step !== 'success' && stepIndex > 0 && (
            <span className="text-gold-700 text-xs font-medium">{progressPct}%</span>
          )}
        </div>

        {/* Barre de progression dorée */}
        {step !== 'success' && (
          <div className="mb-5 h-0.5 bg-church-700/50 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${Math.max(progressPct, 3)}%`,
                background: 'linear-gradient(90deg, #c9a227, #e8c84a)',
                boxShadow: '0 0 8px rgba(201,162,39,0.6)',
              }}
            />
          </div>
        )}

        {/* Erreur globale */}
        {submitError && (
          <div className="mb-4 bg-crimson/10 border border-crimson/30 rounded-xl p-3 text-sm text-red-300 flex gap-2">
            <span>⚠️</span><span>{submitError}</span>
          </div>
        )}

        {/* Carte principale */}
        <div
          className="rounded-2xl overflow-hidden shadow-church"
          style={{
            background: 'linear-gradient(160deg, #0f3d37 0%, #0a2d28 100%)',
            border: '1px solid rgba(201,162,39,0.18)',
            boxShadow: '0 20px 60px rgba(4,15,14,0.7), inset 0 1px 0 rgba(201,162,39,0.1)',
          }}
        >
          {STEPS[step]}
        </div>

        {/* Lien admin discret */}
        {step === 'welcome' && (
          <div className="text-center mt-6">
            <a href="/admin" className="text-gold-800 hover:text-gold-600 text-xs transition-colors tracking-widest uppercase">
              Administration
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

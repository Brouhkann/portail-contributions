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

function FlameIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 28" fill="none">
      <path d="M12 2C12 2 8 7 8 12c0 2 1 3.5 2 4.5C9.5 15 9 13.5 9 12c0-1.5.5-3 1.5-4C10 10 10 12 11 13.5c.5.8 1 1.5 1 2.5a3 3 0 01-3 3 5 5 0 005 5 5 5 0 005-5c0-3-2-5-3-7-1-2-1-4 0-6-1 1-2 3-2 5 0 1 .5 2 1 2.5C16 12 16 10 15 8c-1-2-3-6-3-6z" fill="url(#fg)" />
      <defs>
        <linearGradient id="fg" x1="12" y1="2" x2="12" y2="27" gradientUnits="userSpaceOnUse">
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
    setSubmitting(true); setSubmitError(null)
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
    } finally { setSubmitting(false) }
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
    <div className="min-h-screen flex flex-col items-center pb-12" style={{ background: 'linear-gradient(160deg, #edf7f4 0%, #f5f9f8 60%, #fffef8 100%)' }}>

      {/* Bandeau header teal foncé */}
      <div className="w-full px-4 py-4 mb-6" style={{ background: 'linear-gradient(135deg, #0a2d28, #155049)' }}>
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201,162,39,0.15)', border: '1.5px solid rgba(201,162,39,0.5)' }}>
              <FlameIcon size={20} />
            </div>
            <div>
              <p className="font-cinzel text-gold-400 font-semibold text-sm tracking-[0.12em] uppercase leading-tight"
                style={{ color: '#e8c84a' }}>
                Vases d'Honneur
              </p>
              <p className="text-xs italic" style={{ color: 'rgba(201,162,39,0.55)', letterSpacing: '0.06em' }}>
                Foi Inébranlable
              </p>
            </div>
          </div>
          {step !== 'success' && stepIndex > 0 && (
            <span className="text-xs font-medium" style={{ color: 'rgba(201,162,39,0.5)' }}>{progressPct}%</span>
          )}
        </div>

        {/* Barre de progression */}
        {step !== 'success' && (
          <div className="max-w-md mx-auto mt-3 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.max(progressPct, 3)}%`, background: 'linear-gradient(90deg, #c9a227, #e8c84a)', boxShadow: '0 0 6px rgba(201,162,39,0.7)' }} />
          </div>
        )}
      </div>

      {/* Carte principale — fond blanc */}
      <div className="w-full max-w-md px-4">
        {submitError && (
          <div className="mb-4 rounded-xl p-3 text-sm flex gap-2"
            style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c' }}>
            <span>⚠️</span><span>{submitError}</span>
          </div>
        )}

        <div className="rounded-2xl overflow-hidden"
          style={{ background: '#ffffff', boxShadow: '0 4px 24px rgba(10,45,40,0.1), 0 1px 4px rgba(10,45,40,0.06)', border: '1px solid rgba(201,162,39,0.15)' }}>
          {STEPS[step]}
        </div>

        {step === 'welcome' && (
          <div className="text-center mt-5">
            <a href="/admin" className="text-xs transition-colors" style={{ color: '#9dc4bc', letterSpacing: '0.1em' }}
              onMouseEnter={e => e.target.style.color = '#155049'}
              onMouseLeave={e => e.target.style.color = '#9dc4bc'}>
              Administration
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

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
  name: '',
  phone: '',
  rememberMe: true,
  isAnonymous: false,
  contributionType: '',
  amount: '',
  paymentMethod: '',
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

  function update(patch) {
    setFormData(prev => ({ ...prev, ...patch }))
  }

  function go(nextStep) {
    setStep(nextStep)
    setSubmitError(null)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleIdentified(name, phone, rememberMe, anonymous) {
    update({ name, phone, rememberMe, isAnonymous: anonymous })
    if (rememberMe && (name || phone)) {
      saveUser(name, phone)
    }
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
      setSubmitError(err.message || 'Erreur lors de l\'enregistrement. Vérifiez votre connexion.')
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
  const churchName = process.env.NEXT_PUBLIC_CHURCH_NAME || 'Notre Église'

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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 flex flex-col items-center pt-6 px-4 pb-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <span className="font-bold text-purple-800 text-sm tracking-wide">{churchName}</span>
          </div>
          {step !== 'success' && stepIndex > 0 && (
            <span className="text-xs text-purple-400 font-medium">{progressPct}%</span>
          )}
        </div>

        {/* Barre de progression */}
        {step !== 'success' && (
          <div className="mb-5 h-1.5 bg-purple-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(progressPct, 4)}%` }}
            />
          </div>
        )}

        {/* Erreur globale */}
        {submitError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex gap-2">
            <span>⚠️</span>
            <span>{submitError}</span>
          </div>
        )}

        {/* Carte principale */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {STEPS[step]}
        </div>

        {/* Lien admin discret */}
        {step === 'welcome' && (
          <div className="text-center mt-6">
            <a href="/admin" className="text-xs text-purple-300 hover:text-purple-500 transition-colors">
              Administration
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

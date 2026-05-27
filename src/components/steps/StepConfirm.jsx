'use client'

import { useState, useRef } from 'react'
import { AlertTriangle, CheckCircle2, ChevronLeft, Camera, X, Loader2 } from 'lucide-react'

const METHOD_LABELS = { wave: 'Wave', mtn: 'MTN Mobile Money', orange: 'Orange Money' }
const MAX_SIZE = 5 * 1024 * 1024
const ACCEPTED = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

export default function StepConfirm({ formData, go, submit, submitting }) {
  const [preview, setPreview]       = useState(null)
  const [file, setFile]             = useState(null)
  const [uploading, setUploading]   = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef()

  const displayName = formData.isAnonymous ? 'Anonyme' : (formData.name || 'Non renseigné')
  const typeLabel   = formData.contributionDetail
    ? `${formData.contributionType} — ${formData.contributionDetail}`
    : formData.contributionType

  const rows = [
    { label: 'Contributeur', value: displayName },
    { label: 'Type',         value: typeLabel },
    { label: 'Montant',      value: `${parseInt(formData.amount, 10).toLocaleString('fr-FR')} FCFA`, big: true },
    { label: 'Via',          value: METHOD_LABELS[formData.paymentMethod] || formData.paymentMethod },
  ]

  function handleFileSelect(e) {
    const f = e.target.files?.[0]; if (!f) return
    setUploadError('')
    if (!ACCEPTED.includes(f.type)) { setUploadError('Format non supporté (JPG, PNG, WebP)'); return }
    if (f.size > MAX_SIZE)          { setUploadError('Fichier trop lourd (max 5 Mo)'); return }
    setFile(f)
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(f)
  }

  function removeImage() {
    setFile(null); setPreview(null); setUploadError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit() {
    if (!file) { await submit(null); return }
    setUploading(true); setUploadError('')
    try {
      const fd = new FormData(); fd.append('file', file)
      const res  = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erreur upload')
      await submit(json.url)
    } catch {
      setUploadError('Échec de l\'upload. La contribution sera enregistrée sans preuve.')
      await submit(null)
    } finally { setUploading(false) }
  }

  const isLoading = submitting || uploading

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => go('amount')}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: '#edf7f4', color: '#155049' }}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-cinzel font-semibold tracking-wide text-base uppercase" style={{ color: '#0a2d28' }}>
            Confirmation
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#6b9e96' }}>Vérifiez et validez votre contribution</p>
        </div>
      </div>

      <div className="divider-gold mb-5" />

      {/* Récapitulatif */}
      <div className="rounded-xl mb-4 overflow-hidden" style={{ border: '1.5px solid #d1e9e4' }}>
        {rows.map(({ label, value, big }, i) => (
          <div key={label} className="flex justify-between items-center px-4 py-3"
            style={{ borderBottom: i < rows.length - 1 ? '1px solid #edf7f4' : 'none', background: i % 2 === 0 ? '#f8fffe' : '#ffffff' }}>
            <span className="text-sm" style={{ color: '#6b9e96' }}>{label}</span>
            <span className={`font-semibold ${big ? 'text-base' : 'text-sm'}`}
              style={{ color: big ? '#0a2d28' : '#155049' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Avertissement */}
      <div className="rounded-xl p-3 mb-5 flex gap-2.5"
        style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#d97706' }} />
        <p className="text-xs leading-relaxed" style={{ color: '#92400e' }}>
          En confirmant, vous attestez avoir effectué ce paiement.
        </p>
      </div>

      {/* Upload preuve */}
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#155049' }}>
          Preuve de paiement <span className="normal-case tracking-normal font-normal" style={{ color: '#9dc4bc' }}>(optionnelle)</span>
        </p>

        {!preview ? (
          <button type="button" onClick={() => fileRef.current?.click()}
            className="rounded-xl py-3 px-4 flex items-center gap-3 transition-all"
            style={{ border: '2px dashed #d1e9e4', background: '#f8fffe' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#c9a227'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#d1e9e4'}>
            <Camera className="w-5 h-5 flex-shrink-0" style={{ color: '#b8dbd5' }} />
            <div className="text-left">
              <span className="text-sm block" style={{ color: '#6b9e96' }}>Joindre une capture d'écran</span>
              <span className="text-xs" style={{ color: '#9dc4bc' }}>JPG, PNG, WebP — max 5 Mo</span>
            </div>
          </button>
        ) : (
          <div className="relative rounded-xl overflow-hidden w-28 h-28"
            style={{ border: '1.5px solid #d1e9e4' }}>
            <img src={preview} alt="Preuve" className="w-full h-full object-cover bg-gray-50" />
            <button onClick={removeImage}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow">
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        )}

        <input ref={fileRef} type="file" accept={ACCEPTED.join(',')} onChange={handleFileSelect} className="hidden" />
        {uploadError && <p className="text-red-500 text-xs mt-2 text-center">{uploadError}</p>}
      </div>

      {/* Bouton confirmer */}
      <button onClick={handleSubmit} disabled={isLoading}
        className="btn-gold w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-md disabled:opacity-50">
        {isLoading
          ? <><Loader2 className="w-5 h-5 animate-spin" /> Enregistrement…</>
          : <><CheckCircle2 className="w-5 h-5" /> Je confirme avoir payé</>}
      </button>

      {/* Bouton annuler */}
      <button onClick={() => go('type')} disabled={isLoading}
        className="w-full mt-3 py-3 rounded-xl text-sm font-medium tracking-wide transition-all disabled:opacity-40"
        style={{ background: 'transparent', border: '1px solid #d1d5db', color: '#9ca3af', letterSpacing: '0.04em' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#9ca3af' }}>
        Annuler
      </button>
    </div>
  )
}

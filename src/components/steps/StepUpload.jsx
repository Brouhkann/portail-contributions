'use client'

import { useState, useRef } from 'react'
import { Camera, X, CheckCircle2, Loader2 } from 'lucide-react'

const MAX_SIZE = 5 * 1024 * 1024
const ACCEPTED = ['image/jpeg','image/png','image/jpg','image/webp']

export default function StepUpload({ submit, submitting }) {
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef()

  function handleFileSelect(e) {
    const f = e.target.files?.[0]; if (!f) return
    setUploadError('')
    if (!ACCEPTED.includes(f.type)) { setUploadError('Format non supporté (JPG, PNG, WebP)'); return }
    if (f.size > MAX_SIZE) { setUploadError('Fichier trop lourd (max 5 Mo)'); return }
    setFile(f)
    const reader = new FileReader(); reader.onload = ev => setPreview(ev.target.result); reader.readAsDataURL(f)
  }

  function removeImage() { setFile(null); setPreview(null); setUploadError(''); if (fileRef.current) fileRef.current.value = '' }

  async function handleSubmit() {
    if (!file) { await submit(null); return }
    setUploading(true); setUploadError('')
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erreur upload')
      await submit(json.url)
    } catch {
      setUploadError('Échec upload. Contribution enregistrée sans preuve.')
      await submit(null)
    } finally { setUploading(false) }
  }

  const isLoading = submitting || uploading

  return (
    <div className="p-6">
      <div className="flex flex-col items-center mb-6">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ background: '#edf7f4', border: '2px solid rgba(201,162,39,0.3)' }}>
          <Camera className="w-7 h-7" style={{ color: '#c9a227' }} />
        </div>
        <h2 className="font-cinzel font-semibold tracking-wide text-base uppercase" style={{ color: '#0a2d28' }}>Preuve de paiement</h2>
        <p className="text-xs mt-1" style={{ color: '#6b9e96' }}>Joignez une capture d'écran (facultatif)</p>
        <div className="divider-gold w-24 mt-3" />
      </div>

      {!preview ? (
        <button type="button" onClick={() => fileRef.current?.click()}
          className="w-full rounded-2xl p-10 text-center mb-5 transition-all"
          style={{ border: '2px dashed #d1e9e4', background: '#f8fffe' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#c9a227'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#d1e9e4'}>
          <Camera className="w-12 h-12 mx-auto mb-3" style={{ color: '#b8dbd5' }} />
          <p className="text-sm font-medium" style={{ color: '#4a7a72' }}>Appuyez pour ajouter</p>
          <p className="text-xs mt-1" style={{ color: '#9dc4bc' }}>JPG, PNG, WebP — max 5 Mo</p>
        </button>
      ) : (
        <div className="relative mb-5 rounded-2xl overflow-hidden"
          style={{ border: '1.5px solid #d1e9e4' }}>
          <img src={preview} alt="Aperçu" className="w-full max-h-64 object-contain bg-gray-50" />
          <button onClick={removeImage}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      <input ref={fileRef} type="file" accept={ACCEPTED.join(',')} onChange={handleFileSelect} className="hidden" />
      {uploadError && <p className="text-red-500 text-sm mb-3 text-center">{uploadError}</p>}

      <button onClick={handleSubmit} disabled={isLoading}
        className="btn-gold w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 mb-3 shadow-md disabled:opacity-50">
        {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Enregistrement…</> :
          <><CheckCircle2 className="w-5 h-5" /> {preview ? 'Valider avec preuve' : 'Valider la contribution'}</>}
      </button>

      {!preview && !isLoading && (
        <button onClick={() => submit(null)}
          className="w-full py-3 text-sm transition-colors" style={{ color: '#9dc4bc' }}>
          Passer cette étape →
        </button>
      )}
    </div>
  )
}

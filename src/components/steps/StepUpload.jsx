'use client'

import { useState, useRef } from 'react'
import { Camera, X, CheckCircle2, Loader2 } from 'lucide-react'

const MAX_SIZE = 5 * 1024 * 1024
const ACCEPTED = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

export default function StepUpload({ submit, submitting }) {
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef()

  function handleFileSelect(e) {
    const f = e.target.files?.[0]
    if (!f) return
    setUploadError('')
    if (!ACCEPTED.includes(f.type)) { setUploadError('Format non supporté (JPG, PNG, WebP)'); return }
    if (f.size > MAX_SIZE) { setUploadError('Fichier trop lourd (max 5 Mo)'); return }
    setFile(f)
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(f)
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
      setUploadError('Échec de l\'upload. Contribution enregistrée sans preuve.')
      await submit(null)
    } finally { setUploading(false) }
  }

  const isLoading = submitting || uploading

  return (
    <div className="p-6">
      <div className="flex flex-col items-center mb-7">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'rgba(21,80,73,0.5)', border: '2px solid rgba(201,162,39,0.3)' }}>
          <Camera className="w-7 h-7" style={{ color: '#c9a227' }} />
        </div>
        <h2 className="font-cinzel text-gold-400 font-semibold tracking-wide text-base uppercase">Preuve de paiement</h2>
        <p className="text-gold-700 text-xs mt-1">Joignez une capture d'écran (facultatif)</p>
        <div className="divider-gold w-24 mt-3" />
      </div>

      {!preview ? (
        <button type="button" onClick={() => fileRef.current?.click()}
          className="w-full rounded-2xl p-10 text-center mb-5 transition-all group"
          style={{ border: '2px dashed rgba(201,162,39,0.25)', background: 'rgba(15,61,55,0.3)' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,162,39,0.5)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,162,39,0.25)'}>
          <Camera className="w-12 h-12 mx-auto mb-3" style={{ color: 'rgba(201,162,39,0.3)' }} />
          <p className="text-sm font-medium text-gold-700">Appuyez pour ajouter</p>
          <p className="text-xs text-gold-800 mt-1">JPG, PNG, WebP — max 5 Mo</p>
        </button>
      ) : (
        <div className="relative mb-5 rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(201,162,39,0.3)' }}>
          <img src={preview} alt="Aperçu" className="w-full max-h-64 object-contain bg-church-950" />
          <button onClick={removeImage}
            className="absolute top-2 right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      <input ref={fileRef} type="file" accept={ACCEPTED.join(',')} onChange={handleFileSelect} className="hidden" />

      {uploadError && <p className="text-red-400 text-sm mb-3 text-center">{uploadError}</p>}

      <button onClick={handleSubmit} disabled={isLoading}
        className="btn-gold w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 mb-3 shadow-gold disabled:opacity-50">
        {isLoading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Enregistrement…</>
        ) : (
          <><CheckCircle2 className="w-5 h-5" /> {preview ? 'Valider avec preuve' : 'Valider la contribution'}</>
        )}
      </button>

      {!preview && !isLoading && (
        <button onClick={() => submit(null)}
          className="w-full py-3 text-sm text-gold-800 hover:text-gold-600 transition-colors">
          Passer cette étape →
        </button>
      )}
    </div>
  )
}

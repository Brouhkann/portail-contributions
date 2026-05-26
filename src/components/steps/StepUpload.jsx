'use client'

import { useState, useRef } from 'react'
import { Camera, X, CheckCircle2, Loader2, Image } from 'lucide-react'

const MAX_SIZE_MB = 5
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

    if (!ACCEPTED.includes(f.type)) {
      setUploadError('Format non supporté. Utilisez JPG, PNG ou WebP.')
      return
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setUploadError(`La taille maximum est ${MAX_SIZE_MB} Mo.`)
      return
    }

    setFile(f)
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(f)
  }

  function removeImage() {
    setFile(null)
    setPreview(null)
    setUploadError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit() {
    if (!file) {
      await submit(null)
      return
    }

    setUploading(true)
    setUploadError('')
    try {
      const fd = new FormData()
      fd.append('file', file)

      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || 'Erreur upload')
      await submit(json.url)
    } catch (err) {
      setUploadError('Échec de l\'upload. La contribution sera enregistrée sans preuve.')
      await submit(null)
    } finally {
      setUploading(false)
    }
  }

  async function handleSkip() {
    await submit(null)
  }

  const isLoading = submitting || uploading

  return (
    <div className="p-6">
      <div className="text-center mb-7">
        <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Camera className="w-7 h-7 text-indigo-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Preuve de paiement</h2>
        <p className="text-sm text-gray-400 mt-1">Joignez une capture d'écran (facultatif)</p>
      </div>

      {/* Zone d'upload */}
      {!preview ? (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-purple-300 hover:bg-purple-50 transition-all mb-5 group"
        >
          <Image className="w-12 h-12 text-gray-200 group-hover:text-purple-300 mx-auto mb-3 transition-colors" />
          <p className="text-sm font-medium text-gray-400 group-hover:text-purple-500 transition-colors">
            Appuyez pour ajouter
          </p>
          <p className="text-xs text-gray-300 mt-1">JPG, PNG, WebP — max {MAX_SIZE_MB} Mo</p>
        </button>
      ) : (
        <div className="relative mb-5 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
          <img src={preview} alt="Aperçu preuve" className="w-full max-h-64 object-contain" />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-md"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      {uploadError && (
        <p className="text-sm text-red-500 mb-3 text-center">{uploadError}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center gap-2 mb-3 disabled:opacity-60 active:scale-95 transition-transform"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Enregistrement…
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            {preview ? 'Valider avec preuve' : 'Valider la contribution'}
          </>
        )}
      </button>

      {!preview && !isLoading && (
        <button
          onClick={handleSkip}
          className="w-full py-3 text-sm text-gray-300 hover:text-gray-500 transition-colors"
        >
          Passer cette étape →
        </button>
      )}
    </div>
  )
}

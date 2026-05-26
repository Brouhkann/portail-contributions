/**
 * Script de vérification de la configuration Supabase
 * Usage : node scripts/verify.mjs
 */
import { createClient } from '@supabase/supabase-js'

const URL = 'https://skfvbefotsgtccxjjavb.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrZnZiZWZvdHNndGNjeGpqYXZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTcyMzcwNywiZXhwIjoyMDk1Mjk5NzA3fQ.ZOKf_HZ5maIa1yZv7NBA0-Ve8huyej92GQhdFpd4sik'

const db = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } })

async function check(label, fn) {
  try {
    const result = await fn()
    console.log(`  ✓ ${label}`)
    return result
  } catch (e) {
    console.log(`  ✗ ${label} — ${e.message}`)
    return null
  }
}

console.log('\n🔍 Vérification de la configuration Supabase...\n')

// 1. Connexion
await check('Connexion Supabase', async () => {
  const { error } = await db.from('contributions').select('id').limit(1)
  if (error && error.code === '42P01') throw new Error('Table "contributions" introuvable — exécutez le schéma SQL')
  if (error) throw error
})

// 2. Bucket storage
await check('Bucket "contribution-proofs"', async () => {
  const { data, error } = await db.storage.getBucket('contribution-proofs')
  if (error) throw error
  if (!data.public) throw new Error('Le bucket n\'est pas public')
})

// 3. Insertion test
await check('Insertion dans contributions', async () => {
  const { error } = await db.from('contributions').insert({
    type_label: '_test_',
    amount: 1,
    payment_method: 'wave',
    status: 'confirmed',
  })
  if (error && error.code === '42P01') throw new Error('Table introuvable')
  if (error) throw error
  // Supprimer la ligne de test
  await db.from('contributions').delete().eq('type_label', '_test_')
})

console.log('\n✅ Configuration vérifiée avec succès !\n')

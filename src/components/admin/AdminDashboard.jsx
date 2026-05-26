'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  LogOut, Download, RefreshCw, Search, BarChart2, List,
  FileSpreadsheet, ExternalLink, TrendingUp, Users, Banknote, Calendar
} from 'lucide-react'

const METHOD_LABELS = { wave: 'Wave', mtn: 'MTN', orange: 'Orange' }
const METHOD_COLORS = {
  wave: 'bg-sky-100 text-sky-700',
  mtn: 'bg-yellow-100 text-yellow-700',
  orange: 'bg-orange-100 text-orange-700',
}

export default function AdminDashboard({ onLogout }) {
  const [contributions, setContributions] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list')
  const [search, setSearch] = useState('')
  const [filterMethod, setFilterMethod] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [page, setPage] = useState(1)

  const LIMIT = 50

  const fetchContributions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        method: filterMethod,
        type: filterType,
        from: filterFrom,
        to: filterTo,
        page: page.toString(),
        limit: LIMIT.toString(),
      })
      const res = await fetch(`/api/admin/contributions?${params}`)
      if (!res.ok) throw new Error('Erreur serveur')
      const { data, count } = await res.json()
      setContributions(data)
      setTotal(count)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [search, filterMethod, filterType, filterFrom, filterTo, page])

  useEffect(() => {
    fetchContributions()
  }, [fetchContributions])

  // Statistiques calculées
  const totalAmount = contributions.reduce((s, c) => s + (c.amount || 0), 0)
  const uniqueTypes = [...new Set(contributions.map(c => c.type_label).filter(Boolean))]

  const byMethod = ['wave', 'mtn', 'orange'].reduce((acc, m) => {
    const items = contributions.filter(c => c.payment_method === m)
    acc[m] = { count: items.length, total: items.reduce((s, c) => s + c.amount, 0) }
    return acc
  }, {})

  const byType = contributions.reduce((acc, c) => {
    const t = c.type_label || 'Autre'
    if (!acc[t]) acc[t] = { count: 0, total: 0 }
    acc[t].count++
    acc[t].total += c.amount
    return acc
  }, {})

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    onLogout()
  }

  function exportCSV() {
    const headers = ['ID', 'Date', 'Heure', 'Nom', 'Téléphone', 'Type', 'Montant (FCFA)', 'Moyen', 'Statut', 'Preuve URL']
    const rows = contributions.map(c => {
      const dt = new Date(c.created_at)
      return [
        c.id,
        dt.toLocaleDateString('fr-FR'),
        dt.toLocaleTimeString('fr-FR'),
        c.contributor_name || 'Anonyme',
        c.contributor_phone || '',
        c.type_label || '',
        c.amount,
        METHOD_LABELS[c.payment_method] || c.payment_method,
        c.status || 'confirmé',
        c.proof_image_url || '',
      ]
    })
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\n')
    downloadBlob('﻿' + csv, `contributions_${today()}.csv`, 'text/csv;charset=utf-8;')
  }

  async function exportExcel() {
    const { utils, writeFile } = await import('xlsx')
    const wsData = [
      ['ID', 'Date', 'Heure', 'Nom', 'Téléphone', 'Type', 'Montant (FCFA)', 'Moyen', 'Statut', 'Preuve URL'],
      ...contributions.map(c => {
        const dt = new Date(c.created_at)
        return [
          c.id,
          dt.toLocaleDateString('fr-FR'),
          dt.toLocaleTimeString('fr-FR'),
          c.contributor_name || 'Anonyme',
          c.contributor_phone || '',
          c.type_label || '',
          c.amount,
          METHOD_LABELS[c.payment_method] || c.payment_method,
          c.status || 'confirmé',
          c.proof_image_url || '',
        ]
      }),
    ]
    const ws = utils.aoa_to_sheet(wsData)
    ws['!cols'] = [{ wch: 36 }, { wch: 12 }, { wch: 10 }, { wch: 20 }, { wch: 14 }, { wch: 18 }, { wch: 14 }, { wch: 10 }, { wch: 12 }, { wch: 50 }]
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Contributions')
    writeFile(wb, `contributions_${today()}.xlsx`)
  }

  function downloadBlob(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  function today() {
    return new Date().toISOString().slice(0, 10)
  }

  function clearFilters() {
    setSearch('')
    setFilterMethod('')
    setFilterType('')
    setFilterFrom('')
    setFilterTo('')
    setPage(1)
  }

  const hasFilters = search || filterMethod || filterType || filterFrom || filterTo

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white sticky top-0 z-10 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold">Administration</h1>
            <p className="text-purple-300 text-xs">{total} contribution{total > 1 ? 's' : ''} au total</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportCSV} title="Export CSV" className="flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 rounded-lg text-sm font-medium transition-colors">
              <Download className="w-4 h-4" /> CSV
            </button>
            <button onClick={exportExcel} title="Export Excel" className="flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 rounded-lg text-sm font-medium transition-colors">
              <FileSpreadsheet className="w-4 h-4" /> Excel
            </button>
            <button onClick={fetchContributions} title="Actualiser" className="w-9 h-9 flex items-center justify-center bg-white/15 hover:bg-white/25 rounded-lg transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleLogout} title="Déconnexion" className="w-9 h-9 flex items-center justify-center bg-red-500/30 hover:bg-red-500/50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {/* Cartes de stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={<Banknote className="w-5 h-5" />} label="Total collecté" value={`${totalAmount.toLocaleString('fr-FR')} FCFA`} color="purple" />
          <StatCard icon={<Users className="w-5 h-5" />} label="Contributions" value={contributions.length.toString()} color="indigo" />
          <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Wave" value={`${byMethod.wave?.total.toLocaleString('fr-FR')} FCFA`} color="sky" />
          <StatCard icon={<Calendar className="w-5 h-5" />} label="MTN + Orange" value={`${((byMethod.mtn?.total || 0) + (byMethod.orange?.total || 0)).toLocaleString('fr-FR')} FCFA`} color="amber" />
        </div>

        {/* Onglets */}
        <div className="flex gap-2">
          {[
            { id: 'list', icon: <List className="w-4 h-4" />, label: 'Liste' },
            { id: 'stats', icon: <BarChart2 className="w-4 h-4" />, label: 'Statistiques' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === tab.id
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {view === 'list' && (
          <>
            {/* Filtres */}
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                <input
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Rechercher par nom, téléphone, type…"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <select value={filterMethod} onChange={e => { setFilterMethod(e.target.value); setPage(1) }} className="py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white">
                  <option value="">Tous les moyens</option>
                  <option value="wave">Wave</option>
                  <option value="mtn">MTN</option>
                  <option value="orange">Orange</option>
                </select>
                <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1) }} className="py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white">
                  <option value="">Tous les types</option>
                  {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input type="date" value={filterFrom} onChange={e => { setFilterFrom(e.target.value); setPage(1) }} className="py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="Du" />
                <input type="date" value={filterTo} onChange={e => { setFilterTo(e.target.value); setPage(1) }} className="py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="Au" />
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-purple-500 hover:underline">
                  Effacer les filtres
                </button>
              )}
            </div>

            {/* Tableau */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="py-20 text-center text-gray-300">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" />
                  <p className="text-sm">Chargement…</p>
                </div>
              ) : contributions.length === 0 ? (
                <div className="py-20 text-center text-gray-300">
                  <p className="text-sm">Aucune contribution trouvée</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          {['Date', 'Contributeur', 'Type', 'Montant', 'Moyen', 'Preuve'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {contributions.map(c => (
                          <ContributionRow key={c.id} c={c} />
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {total > LIMIT && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
                      <span>Page {page} — {contributions.length} / {total}</span>
                      <div className="flex gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50">Préc.</button>
                        <button onClick={() => setPage(p => p + 1)} disabled={contributions.length < LIMIT} className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50">Suiv.</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {view === 'stats' && (
          <StatsView byType={byType} byMethod={byMethod} totalAmount={totalAmount} />
        )}
      </div>
    </div>
  )
}

function ContributionRow({ c }) {
  const [showImg, setShowImg] = useState(false)
  const dt = new Date(c.created_at)
  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 whitespace-nowrap text-gray-500">
          <div className="text-xs">{dt.toLocaleDateString('fr-FR')}</div>
          <div className="text-xs text-gray-300">{dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
        </td>
        <td className="px-4 py-3">
          <div className="font-medium text-gray-800">{c.contributor_name || <span className="text-gray-300 italic">Anonyme</span>}</div>
          {c.contributor_phone && <div className="text-xs text-gray-400">{c.contributor_phone}</div>}
        </td>
        <td className="px-4 py-3 text-gray-600">{c.type_label}</td>
        <td className="px-4 py-3 font-bold text-gray-800 whitespace-nowrap">
          {c.amount?.toLocaleString('fr-FR')} <span className="text-gray-400 font-normal text-xs">FCFA</span>
        </td>
        <td className="px-4 py-3">
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${METHOD_COLORS[c.payment_method] || 'bg-gray-100 text-gray-500'}`}>
            {METHOD_LABELS[c.payment_method] || c.payment_method}
          </span>
        </td>
        <td className="px-4 py-3">
          {c.proof_image_url ? (
            <button onClick={() => setShowImg(v => !v)} className="text-purple-500 hover:underline text-xs flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> {showImg ? 'Masquer' : 'Voir'}
            </button>
          ) : (
            <span className="text-gray-200 text-xs">—</span>
          )}
        </td>
      </tr>
      {showImg && c.proof_image_url && (
        <tr>
          <td colSpan={6} className="px-4 pb-4">
            <img src={c.proof_image_url} alt="Preuve" className="max-w-xs max-h-48 rounded-lg border border-gray-200 object-contain" />
          </td>
        </tr>
      )}
    </>
  )
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    purple: 'bg-purple-50 border-purple-100 text-purple-700',
    indigo: 'bg-indigo-50 border-indigo-100 text-indigo-700',
    sky: 'bg-sky-50 border-sky-100 text-sky-700',
    amber: 'bg-amber-50 border-amber-100 text-amber-700',
  }
  return (
    <div className={`${colors[color]} border rounded-xl p-4`}>
      <div className="opacity-60 mb-2">{icon}</div>
      <p className="text-xs opacity-60 mb-0.5">{label}</p>
      <p className="font-bold text-sm leading-tight">{value}</p>
    </div>
  )
}

function StatsView({ byType, byMethod, totalAmount }) {
  const methodStyle = { wave: '#0ea5e9', mtn: '#f59e0b', orange: '#f97316' }
  const methodNames = { wave: 'Wave', mtn: 'MTN Mobile Money', orange: 'Orange Money' }

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {/* Par moyen */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-purple-400" /> Par moyen de paiement
        </h3>
        <div className="space-y-4">
          {['wave', 'mtn', 'orange'].map(m => {
            const d = byMethod[m] || { count: 0, total: 0 }
            const pct = totalAmount > 0 ? (d.total / totalAmount) * 100 : 0
            return (
              <div key={m}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 font-medium">{methodNames[m]} <span className="text-gray-300">({d.count})</span></span>
                  <span className="font-bold text-gray-700">{d.total.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: methodStyle[m] }} />
                </div>
                <p className="text-xs text-gray-300 mt-0.5">{pct.toFixed(1)}%</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Par type */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
          <List className="w-4 h-4 text-purple-400" /> Par type de contribution
        </h3>
        <div className="space-y-4">
          {Object.entries(byType)
            .sort((a, b) => b[1].total - a[1].total)
            .map(([type, d]) => {
              const pct = totalAmount > 0 ? (d.total / totalAmount) * 100 : 0
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600 font-medium">{type} <span className="text-gray-300">({d.count})</span></span>
                    <span className="font-bold text-gray-700">{d.total.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-300 mt-0.5">{pct.toFixed(1)}%</p>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

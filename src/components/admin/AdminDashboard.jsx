'use client'

import { useState, useEffect, useCallback } from 'react'
import { LogOut, Download, RefreshCw, Search, BarChart2, List, FileSpreadsheet, ExternalLink, TrendingUp, Users, Banknote } from 'lucide-react'

const METHOD_LABELS = { wave: 'Wave', mtn: 'MTN', orange: 'Orange' }
const METHOD_COLORS = {
  wave:   { bg: 'rgba(14,165,233,0.15)',  border: 'rgba(56,189,248,0.3)',  text: '#7dd3fc' },
  mtn:    { bg: 'rgba(234,179,8,0.15)',   border: 'rgba(234,179,8,0.35)',  text: '#fde047' },
  orange: { bg: 'rgba(249,115,22,0.15)',  border: 'rgba(249,115,22,0.3)',  text: '#fdba74' },
}
const LIMIT = 50

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

  const fetch_ = useCallback(async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams({ search, method: filterMethod, type: filterType, from: filterFrom, to: filterTo, page: page.toString(), limit: LIMIT.toString() })
      const res = await fetch(`/api/admin/contributions?${p}`)
      if (!res.ok) throw new Error()
      const { data, count } = await res.json()
      setContributions(data); setTotal(count)
    } catch { } finally { setLoading(false) }
  }, [search, filterMethod, filterType, filterFrom, filterTo, page])

  useEffect(() => { fetch_() }, [fetch_])

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
    acc[t].count++; acc[t].total += c.amount
    return acc
  }, {})

  async function handleLogout() { await fetch('/api/admin/auth', { method: 'DELETE' }); onLogout() }

  function today() { return new Date().toISOString().slice(0, 10) }

  function exportCSV() {
    const headers = ['ID', 'Date', 'Heure', 'Nom', 'Téléphone', 'Type', 'Montant (FCFA)', 'Moyen', 'Statut', 'Preuve URL']
    const rows = contributions.map(c => {
      const dt = new Date(c.created_at)
      return [c.id, dt.toLocaleDateString('fr-FR'), dt.toLocaleTimeString('fr-FR'), c.contributor_name || 'Anonyme', c.contributor_phone || '', c.type_label || '', c.amount, METHOD_LABELS[c.payment_method] || c.payment_method, c.status || 'confirmé', c.proof_image_url || '']
    })
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\n')
    dl('﻿' + csv, `contributions_${today()}.csv`, 'text/csv;charset=utf-8;')
  }

  async function exportExcel() {
    const { utils, writeFile } = await import('xlsx')
    const wsData = [
      ['ID', 'Date', 'Heure', 'Nom', 'Téléphone', 'Type', 'Montant (FCFA)', 'Moyen', 'Statut', 'Preuve URL'],
      ...contributions.map(c => {
        const dt = new Date(c.created_at)
        return [c.id, dt.toLocaleDateString('fr-FR'), dt.toLocaleTimeString('fr-FR'), c.contributor_name || 'Anonyme', c.contributor_phone || '', c.type_label || '', c.amount, METHOD_LABELS[c.payment_method] || c.payment_method, c.status || 'confirmé', c.proof_image_url || '']
      }),
    ]
    const ws = utils.aoa_to_sheet(wsData)
    ws['!cols'] = [{ wch: 36 }, { wch: 12 }, { wch: 10 }, { wch: 20 }, { wch: 14 }, { wch: 18 }, { wch: 14 }, { wch: 10 }, { wch: 12 }, { wch: 50 }]
    const wb = utils.book_new(); utils.book_append_sheet(wb, ws, 'Contributions')
    writeFile(wb, `contributions_${today()}.xlsx`)
  }

  function dl(content, name, mime) {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = name; a.click()
    URL.revokeObjectURL(url)
  }

  const headerStyle = { background: 'linear-gradient(135deg, #0a2d28, #155049)', borderBottom: '1px solid rgba(201,162,39,0.2)' }

  return (
    <div className="min-h-screen" style={{ background: '#061815' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 py-4" style={headerStyle}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.3)' }}>
              <img src="/logos/vh.png" alt="VH" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <h1 className="font-cinzel text-gold-400 text-sm font-semibold tracking-widest uppercase">Administration</h1>
              <p className="text-gold-800 text-xs">{total} contribution{total > 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[
              { label: 'CSV', icon: <Download className="w-3.5 h-3.5" />, action: exportCSV },
              { label: 'Excel', icon: <FileSpreadsheet className="w-3.5 h-3.5" />, action: exportExcel },
            ].map(btn => (
              <button key={btn.label} onClick={btn.action}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gold-500 transition-colors hover:text-gold-300"
                style={{ background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.2)' }}>
                {btn.icon} {btn.label}
              </button>
            ))}
            <button onClick={fetch_}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors text-gold-700 hover:text-gold-400"
              style={{ background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.15)' }}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors text-red-400 hover:text-red-300"
              style={{ background: 'rgba(185,28,28,0.1)', border: '1px solid rgba(185,28,28,0.2)' }}>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {/* Cartes stats */}
        <div className="space-y-3">
          {/* Ligne 1 : totaux globaux */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Banknote className="w-5 h-5" />, label: 'Total collecté', value: `${totalAmount.toLocaleString('fr-FR')} FCFA`, accent: '#c9a227' },
              { icon: <Users className="w-5 h-5" />,   label: 'Contributions',  value: `${contributions.length} déclaration${contributions.length > 1 ? 's' : ''}`, accent: '#60a5fa' },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-4"
                style={{ background: 'rgba(15,61,55,0.6)', border: `1px solid ${s.accent}22` }}>
                <div className="mb-2" style={{ color: s.accent + 'aa' }}>{s.icon}</div>
                <p className="text-gold-800 text-xs mb-0.5">{s.label}</p>
                <p className="font-bold text-sm text-gold-300">{s.value}</p>
              </div>
            ))}
          </div>
          {/* Ligne 2 : détail par opérateur */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Wave',   total: byMethod.wave?.total   || 0, count: byMethod.wave?.count   || 0, accent: '#38bdf8', logo: '/logos/wave.png' },
              { label: 'MTN',    total: byMethod.mtn?.total    || 0, count: byMethod.mtn?.count    || 0, accent: '#fde047', logo: '/logos/mtn.png'  },
              { label: 'Orange', total: byMethod.orange?.total || 0, count: byMethod.orange?.count || 0, accent: '#fb923c', logo: '/logos/orange.png' },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-3"
                style={{ background: 'rgba(15,61,55,0.6)', border: `1px solid ${s.accent}22` }}>
                <div className="flex items-center gap-2 mb-2">
                  <img src={s.logo} alt={s.label} className="w-6 h-6 rounded object-contain bg-white p-0.5" />
                  <span className="text-xs font-semibold" style={{ color: s.accent }}>{s.label}</span>
                </div>
                <p className="font-bold text-sm text-gold-300">{s.total.toLocaleString('fr-FR')} <span className="text-gold-800 font-normal text-xs">FCFA</span></p>
                <p className="text-gold-800 text-xs mt-0.5">{s.count} paiement{s.count > 1 ? 's' : ''}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Onglets */}
        <div className="flex gap-2">
          {[{ id: 'list', icon: <List className="w-4 h-4" />, label: 'Liste' }, { id: 'stats', icon: <BarChart2 className="w-4 h-4" />, label: 'Statistiques' }].map(tab => (
            <button key={tab.id} onClick={() => setView(tab.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={view === tab.id
                ? { background: 'linear-gradient(135deg, #c9a227, #a07c1e)', color: '#0a2d28' }
                : { background: 'rgba(15,61,55,0.5)', color: '#a07c1e', border: '1px solid rgba(201,162,39,0.15)' }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {view === 'list' && (
          <>
            {/* Filtres */}
            <div className="rounded-xl p-4 space-y-3"
              style={{ background: 'rgba(15,61,55,0.5)', border: '1px solid rgba(201,162,39,0.12)' }}>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4" style={{ color: 'rgba(201,162,39,0.4)' }} />
                <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Rechercher par nom, téléphone, type…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg input-church text-sm text-white" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  <select key="m" value={filterMethod} onChange={e => { setFilterMethod(e.target.value); setPage(1) }} className="py-2 px-3 rounded-lg input-church text-sm text-gold-300 bg-transparent w-full">
                    <option value="">Tous les moyens</option>
                    <option value="wave">Wave</option><option value="mtn">MTN</option><option value="orange">Orange</option>
                  </select>,
                  <select key="t" value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1) }} className="py-2 px-3 rounded-lg input-church text-sm text-gold-300 bg-transparent w-full">
                    <option value="">Tous les types</option>
                    {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>,
                  <input key="f" type="date" value={filterFrom} onChange={e => { setFilterFrom(e.target.value); setPage(1) }} className="py-2 px-3 rounded-lg input-church text-sm text-gold-300 w-full" />,
                  <input key="to" type="date" value={filterTo} onChange={e => { setFilterTo(e.target.value); setPage(1) }} className="py-2 px-3 rounded-lg input-church text-sm text-gold-300 w-full" />,
                ]}
              </div>
            </div>

            {/* Tableau */}
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(15,61,55,0.4)', border: '1px solid rgba(201,162,39,0.12)' }}>
              {loading ? (
                <div className="py-20 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-gold-700" />
                  <p className="text-gold-800 text-sm">Chargement…</p>
                </div>
              ) : contributions.length === 0 ? (
                <div className="py-20 text-center text-gold-800 text-sm">Aucune contribution trouvée</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead style={{ borderBottom: '1px solid rgba(201,162,39,0.15)', background: 'rgba(21,80,73,0.3)' }}>
                        <tr>
                          {['Date', 'Contributeur', 'Type', 'Montant', 'Moyen', 'Preuve'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest" style={{ color: '#7a5c14' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {contributions.map(c => <ContributionRow key={c.id} c={c} />)}
                      </tbody>
                    </table>
                  </div>
                  {total > LIMIT && (
                    <div className="flex items-center justify-between px-4 py-3 text-sm" style={{ borderTop: '1px solid rgba(201,162,39,0.1)' }}>
                      <span className="text-gold-800">Page {page} — {contributions.length} / {total}</span>
                      <div className="flex gap-2">
                        {[{ label: 'Préc.', action: () => setPage(p => Math.max(1, p - 1)), disabled: page === 1 },
                          { label: 'Suiv.', action: () => setPage(p => p + 1), disabled: contributions.length < LIMIT }].map(b => (
                          <button key={b.label} onClick={b.action} disabled={b.disabled}
                            className="px-3 py-1.5 rounded-lg text-gold-600 disabled:opacity-30 transition-colors hover:text-gold-400"
                            style={{ background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.2)' }}>
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {view === 'stats' && <StatsView byType={byType} byMethod={byMethod} totalAmount={totalAmount} />}
      </div>
    </div>
  )
}

function ContributionRow({ c }) {
  const [showImg, setShowImg] = useState(false)
  const dt = new Date(c.created_at)
  const mc = METHOD_COLORS[c.payment_method] || { bg: 'rgba(100,100,100,0.1)', border: 'rgba(100,100,100,0.2)', text: '#aaa' }
  return (
    <>
      <tr className="transition-colors" style={{ borderBottom: '1px solid rgba(201,162,39,0.06)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(21,80,73,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-xs text-gold-500">{dt.toLocaleDateString('fr-FR')}</div>
          <div className="text-xs text-gold-800">{dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
        </td>
        <td className="px-4 py-3">
          <div className="font-medium text-gold-300 text-sm">{c.contributor_name || <span className="text-gold-800 italic">Anonyme</span>}</div>
          {c.contributor_phone && <div className="text-xs text-gold-700">{c.contributor_phone}</div>}
        </td>
        <td className="px-4 py-3 text-gold-600 text-sm">{c.type_label}</td>
        <td className="px-4 py-3 whitespace-nowrap">
          <span className="font-bold text-gold-400">{c.amount?.toLocaleString('fr-FR')}</span>
          <span className="text-gold-800 text-xs ml-1">FCFA</span>
        </td>
        <td className="px-4 py-3">
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: mc.bg, border: `1px solid ${mc.border}`, color: mc.text }}>
            {METHOD_LABELS[c.payment_method] || c.payment_method}
          </span>
        </td>
        <td className="px-4 py-3">
          {c.proof_image_url ? (
            <button onClick={() => setShowImg(v => !v)}
              className="text-xs flex items-center gap-1 transition-colors hover:text-gold-400"
              style={{ color: '#c9a227' }}>
              <ExternalLink className="w-3 h-3" /> {showImg ? 'Masquer' : 'Voir'}
            </button>
          ) : <span className="text-gold-900 text-xs">—</span>}
        </td>
      </tr>
      {showImg && c.proof_image_url && (
        <tr style={{ background: 'rgba(15,61,55,0.3)' }}>
          <td colSpan={6} className="px-4 pb-4">
            <img src={c.proof_image_url} alt="Preuve" className="max-w-xs max-h-48 rounded-xl object-contain"
              style={{ border: '1px solid rgba(201,162,39,0.2)' }} />
          </td>
        </tr>
      )}
    </>
  )
}

function StatsView({ byType, byMethod, totalAmount }) {
  const methodStyle = { wave: '#0ea5e9', mtn: '#ca8a04', orange: '#ea580c' }
  const methodNames = { wave: 'Wave', mtn: 'MTN Mobile Money', orange: 'Orange Money' }
  const cardStyle = { background: 'rgba(15,61,55,0.5)', border: '1px solid rgba(201,162,39,0.12)' }

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="rounded-xl p-5" style={cardStyle}>
        <h3 className="font-cinzel text-gold-500 text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
          <BarChart2 className="w-4 h-4" /> Par moyen de paiement
        </h3>
        <div className="space-y-5">
          {['wave', 'mtn', 'orange'].map(m => {
            const d = byMethod[m] || { count: 0, total: 0 }
            const pct = totalAmount > 0 ? (d.total / totalAmount) * 100 : 0
            return (
              <div key={m}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gold-600">{methodNames[m]} <span className="text-gold-800">({d.count})</span></span>
                  <span className="font-bold text-gold-400">{d.total.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(15,61,55,0.8)' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: methodStyle[m], boxShadow: `0 0 8px ${methodStyle[m]}60` }} />
                </div>
                <p className="text-gold-900 text-xs mt-1">{pct.toFixed(1)}%</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl p-5" style={cardStyle}>
        <h3 className="font-cinzel text-gold-500 text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
          <List className="w-4 h-4" /> Par type de contribution
        </h3>
        <div className="space-y-5">
          {Object.entries(byType).sort((a, b) => b[1].total - a[1].total).map(([type, d]) => {
            const pct = totalAmount > 0 ? (d.total / totalAmount) * 100 : 0
            return (
              <div key={type}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gold-600">{type} <span className="text-gold-800">({d.count})</span></span>
                  <span className="font-bold text-gold-400">{d.total.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(15,61,55,0.8)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #c9a227, #e8c84a)', boxShadow: '0 0 8px rgba(201,162,39,0.4)' }} />
                </div>
                <p className="text-gold-900 text-xs mt-1">{pct.toFixed(1)}%</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

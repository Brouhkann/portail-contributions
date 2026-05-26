const USER_KEY = 'eglise_contributor'
const REMEMBER_KEY = 'eglise_remember'

function isBrowser() {
  return typeof window !== 'undefined'
}

export function saveUser(name, phone) {
  if (!isBrowser()) return
  const data = { name: name || '', phone: phone || '', savedAt: Date.now() }
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(data))
    localStorage.setItem(REMEMBER_KEY, '1')
  } catch {
    // localStorage peut être indisponible (mode privé strict)
  }
}

export function loadUser() {
  if (!isBrowser()) return null
  try {
    if (!localStorage.getItem(REMEMBER_KEY)) return null
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearUser() {
  if (!isBrowser()) return
  try {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(REMEMBER_KEY)
  } catch {
    //
  }
}

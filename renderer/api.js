// ═══════════ API fetch + cache ═══════════
window.API = (function () {
  const BASE = 'https://wilds.mhdb.io'
  const cache = {}

  function getLocale() {
    return localStorage.getItem('hc-locale') || 'fr'
  }

  async function fetch_(endpoint) {
    const locale = getLocale()
    const key = locale + endpoint
    if (cache[key]) return cache[key]

    const res = await fetch(`${BASE}/${locale}${endpoint}`)
    if (!res.ok) throw new Error(`API error ${res.status}`)
    const data = await res.json()
    cache[key] = data
    return data
  }

  function clearCache() {
    for (const k in cache) delete cache[k]
  }

  return { fetch: fetch_, clearCache, getLocale }
})()

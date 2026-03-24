// ═══════════ App orchestrator ═══════════
;(function () {
  // --- State ---
  const state = {
    tab: 'monsters',
    subTab: null,
    searchTerm: '',
    currentData: []
  }

  // --- DOM refs ---
  const $ = (s) => document.querySelector(s)
  const $$ = (s) => document.querySelectorAll(s)
  const H = window.Helpers

  const dom = {
    grid: $('#card-grid'),
    loading: $('#loading'),
    error: $('#error-msg'),
    search: $('#search-input'),
    title: $('#page-title'),
    subTabs: $('#sub-tabs'),
    listView: $('#list-view'),
    detailView: $('#detail-view'),
    detailContent: $('#detail-content'),
    backBtn: $('#back-btn'),
    localeSelect: $('#locale-select')
  }

  // --- Tab titles ---
  const TITLES = {
    monsters: 'Monstres',
    weapons: 'Armes',
    equipment: 'Equipements',
    skills: 'Talents',
    locations: 'Lieux'
  }

  // --- Tab → API detail endpoints ---
  const DETAIL_ENDPOINTS = {
    monster: '/monsters/',
    weapon: '/weapons/',
    armor: '/armor/sets/',
    charm: '/charms/',
    decoration: '/decorations/',
    skill: '/skills/',
    location: '/locations/'
  }

  // --- Loading / Error ---
  function setLoading(on) {
    if (on) { H.show(dom.loading); H.hide(dom.error); dom.grid.innerHTML = '' }
    else H.hide(dom.loading)
  }

  function showError(msg) {
    dom.error.textContent = msg
    H.show(dom.error)
  }

  // --- Filter ---
  function filterItems(items) {
    if (!state.searchTerm) return items
    return items.filter(i => (i.name || '').toLowerCase().includes(state.searchTerm))
  }

  // --- Bind card clicks ---
  function bindCardClicks() {
    dom.grid.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => loadDetail(card.dataset.type, card.dataset.id))
    })
  }

  // --- Render current list (filtered) ---
  function renderCurrentList() {
    const items = filterItems(state.currentData)
    if (!items.length) {
      dom.grid.innerHTML = '<div class="empty-state">Aucun résultat</div>'
      return
    }

    const tab = window.Tabs[state.tab]
    if (tab) {
      tab.renderCards(items, dom.grid, bindCardClicks, state.subTab)
    }
  }

  // --- Sub-tab change ---
  function onSubTabChange(newSub) {
    state.subTab = newSub
    loadTab()
  }

  // --- Load tab ---
  async function loadTab() {
    setLoading(true)
    H.hide(dom.subTabs)
    dom.title.textContent = TITLES[state.tab] || ''

    const tab = window.Tabs[state.tab]
    if (!tab) { setLoading(false); return }

    try {
      // Sub-tabs
      if (tab.renderSubTabs) {
        if (!state.subTab) state.subTab = tab.defaultSubTab()
        tab.renderSubTabs(dom.subTabs, state.subTab, onSubTabChange)
      }

      // Load data
      state.currentData = await tab.load(state.subTab)
      setLoading(false)
      renderCurrentList()
    } catch (err) {
      setLoading(false)
      showError(`Erreur de chargement : ${err.message}`)
    }
  }

  // --- Load detail ---
  async function loadDetail(type, id) {
    H.hide(dom.listView)
    H.show(dom.detailView)
    dom.detailContent.innerHTML = '<div class="loading"><div class="spinner"></div><span>Chargement...</span></div>'

    try {
      const endpoint = DETAIL_ENDPOINTS[type]
      if (!endpoint) throw new Error('Type inconnu: ' + type)
      const data = await window.API.fetch(endpoint + id)

      // Route to correct tab's detail renderer
      const tab = window.Tabs[state.tab]
      if (tab && tab.renderDetail) {
        tab.renderDetail(data, dom.detailContent, state.subTab)
      }
    } catch (err) {
      dom.detailContent.innerHTML = `<div class="error-msg">Erreur : ${err.message}</div>`
    }
  }

  // --- Sidebar navigation ---
  $$('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      $$('.nav-item').forEach(i => i.classList.remove('active'))
      item.classList.add('active')
      state.tab = item.dataset.tab
      state.subTab = null
      state.searchTerm = ''
      dom.search.value = ''
      H.hide(dom.detailView)
      H.show(dom.listView)
      loadTab()
    })
  })

  // --- Back button ---
  dom.backBtn.addEventListener('click', () => {
    H.hide(dom.detailView)
    H.show(dom.listView)
  })

  // --- Search ---
  dom.search.addEventListener('input', (e) => {
    state.searchTerm = e.target.value.toLowerCase()
    renderCurrentList()
  })

  // --- Locale ---
  dom.localeSelect.value = window.API.getLocale()
  dom.localeSelect.addEventListener('change', (e) => {
    localStorage.setItem('hc-locale', e.target.value)
    window.API.clearCache()
    loadTab()
  })

  // --- Expose navigation for cross-tab links ---
  window.App = { loadDetail }

  // --- Init ---
  loadTab()
})()

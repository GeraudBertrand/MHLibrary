// ═══════════ Locations tab ═══════════
window.Tabs = window.Tabs || {}

window.Tabs.locations = {
  // Cache des SVG chargés (évite de refetch)
  _svgCache: {},

  async load() {
    const data = await window.API.fetch('/locations')
    return data.sort((a, b) => a.name.localeCompare(b.name))
  },

  renderCards(items, grid, onCardClick) {
    const H = window.Helpers
    grid.innerHTML = items.map(l => {
      const icon = H.locationIcon(l.id)
      return `<div class="card" data-id="${l.id}" data-type="location">
        <img class="card-icon location-icon" src="${icon}" alt="" onerror="this.style.display='none'" />
        <div class="card-info">
          <div class="card-name">${l.name}</div>
          <div class="card-sub">${l.camps ? l.camps.length + ' camps' : ''} — ${l.zoneCount || '?'} zones</div>
        </div>
      </div>`
    }).join('')
    onCardClick()
  },

  renderDetail(l, container) {
    const H = window.Helpers
    const C = window.Constants
    const icon = H.locationIcon(l.id)
    const maps = C.LOCATION_MAPS[l.id] || []
    const campIcon = '../assets/icons/utils/camp.png'

    let html = `
      <div class="detail-header">
        <img class="detail-icon location" src="${icon}" alt="" onerror="this.style.display='none'" />
        <div>
          <h2 class="detail-title">${l.name}</h2>
          <div class="detail-subtitle">${l.zoneCount || '?'} zones</div>
        </div>
      </div>`

    // ── Map viewer ──
    if (maps.length) {
      html += `<div class="detail-section">
        <h3 class="section-title">Carte</h3>
        <div class="map-viewer" id="map-viewer">
          <div class="map-floor-tabs">${maps.map((m, i) =>
            `<button class="map-floor-tab ${i === 0 ? 'active' : ''}" data-floor="${i}">${C.MAP_FLOOR_LABELS[i] || 'Niveau ' + (i + 1)}</button>`
          ).join('')}</div>
          <div class="map-container" id="map-container">
            <div class="map-wrap">
              <img class="map-image" id="map-image" src="../assets/maps/${maps[0].img}" alt="Carte" />
              <svg class="map-svg-overlay" id="map-svg" preserveAspectRatio="xMidYMid meet"></svg>
              <div class="map-tooltip" id="map-tooltip"></div>
            </div>
          </div>
        </div>
      </div>`
    }

    // ── Camps ──
    if (l.camps?.length) {
      const sorted = [...l.camps].sort((a, b) => (a.zone || 0) - (b.zone || 0))
      html += `<div class="detail-section">
        <h3 class="section-title">Campements</h3>
        <div class="camp-grid">${sorted.map(c => {
          const risk = c.risk || 'safe'
          const riskLabel = C.CAMP_RISK_LABELS[risk] || risk
          const riskColor = C.CAMP_RISK_COLORS[risk] || '#888'
          return `<div class="camp-card">
            <div class="camp-icon-wrap">
              <img class="camp-icon-img" src="${campIcon}" alt="camp" />
            </div>
            <div class="camp-info">
              <div class="camp-name">${c.name}</div>
              <div class="camp-meta">
                <span>Zone ${c.zone || '?'}</span>
                ${c.floor != null ? `<span>· Étage ${c.floor}</span>` : ''}
                <span class="camp-risk" style="color:${riskColor}">· ${riskLabel}</span>
              </div>
            </div>
          </div>`
        }).join('')}</div>
      </div>`
    }

    container.innerHTML = html

    // ── Bind map interactivity ──
    if (maps.length) {
      this._initMapViewer(container, maps)
    }
  },

  // ── Charge un SVG Illustrator et extrait les polygones/paths de zones ──
  async _loadSVGZones(svgFile) {
    if (!svgFile) return null

    // Check cache
    if (this._svgCache[svgFile]) return this._svgCache[svgFile]

    try {
      const resp = await fetch(`../assets/maps/${svgFile}`)
      if (!resp.ok) return null
      const text = await resp.text()

      // Parse le SVG
      const parser = new DOMParser()
      const doc = parser.parseFromString(text, 'image/svg+xml')
      const svgEl = doc.querySelector('svg')
      if (!svgEl) return null

      // Récupère le viewBox original (dimensions Illustrator)
      const viewBox = svgEl.getAttribute('viewBox') || '0 0 1000 1000'

      // Trouve toutes les zones : éléments avec id contenant "Zone_" ou "zone-" ou "zone_"
      const zones = []
      const allElements = doc.querySelectorAll('polygon, path, rect, ellipse, circle')

      allElements.forEach(el => {
        // Cherche un ID de zone sur l'élément ou ses parents
        let zoneId = this._extractZoneId(el)
        if (!zoneId) {
          // Remonte dans les parents (groupes Illustrator)
          let parent = el.parentElement
          while (parent && parent !== svgEl) {
            zoneId = this._extractZoneId(parent)
            if (zoneId) break
            parent = parent.parentElement
          }
        }
        if (!zoneId) return

        // Extrait le path/polygon data
        const tagName = el.tagName.toLowerCase()
        let pathData = null

        if (tagName === 'polygon') {
          pathData = { type: 'polygon', points: el.getAttribute('points') }
        } else if (tagName === 'path') {
          pathData = { type: 'path', d: el.getAttribute('d') }
        } else if (tagName === 'rect') {
          const x = parseFloat(el.getAttribute('x') || 0)
          const y = parseFloat(el.getAttribute('y') || 0)
          const w = parseFloat(el.getAttribute('width') || 0)
          const h = parseFloat(el.getAttribute('height') || 0)
          pathData = { type: 'polygon', points: `${x},${y} ${x+w},${y} ${x+w},${y+h} ${x},${y+h}` }
        } else if (tagName === 'ellipse') {
          pathData = { type: 'ellipse', cx: el.getAttribute('cx'), cy: el.getAttribute('cy'), rx: el.getAttribute('rx'), ry: el.getAttribute('ry') }
        } else if (tagName === 'circle') {
          const r = el.getAttribute('r')
          pathData = { type: 'ellipse', cx: el.getAttribute('cx'), cy: el.getAttribute('cy'), rx: r, ry: r }
        }

        if (pathData) {
          zones.push({ id: zoneId, ...pathData })
        }
      })

      const result = { viewBox, zones }
      this._svgCache[svgFile] = result
      return result
    } catch (e) {
      console.warn('Erreur chargement SVG zones:', svgFile, e)
      return null
    }
  },

  // Extrait le numéro de zone depuis un id/data-name
  // Supporte: "Zone_13", "Zone 13", "zone-13", "zone_13", "13"
  _extractZoneId(el) {
    const id = el.getAttribute('id') || ''
    const dataName = el.getAttribute('data-name') || ''
    const label = el.getAttribute('inkscape:label') || ''

    for (const str of [id, dataName, label]) {
      // "Zone_13", "Zone 13", "zone-13"
      const match = str.match(/[Zz]one[\s_-]+(\d+)/)
      if (match) return match[1]
      // Juste un nombre
      if (/^\d+$/.test(str.trim())) return str.trim()
    }
    return null
  },

  _initMapViewer(container, maps) {
    const viewer = container.querySelector('#map-viewer')
    if (!viewer) return

    const tabs = viewer.querySelectorAll('.map-floor-tab')
    const img = viewer.querySelector('#map-image')
    const svg = viewer.querySelector('#map-svg')
    const tooltip = viewer.querySelector('#map-tooltip')

    const loadFloor = async (floor) => {
      const mapData = maps[floor]
      if (!mapData) return

      // Change l'image
      img.src = `../assets/maps/${mapData.img}`

      // Charge le SVG de zones (si disponible)
      svg.innerHTML = ''
      const zoneData = await this._loadSVGZones(mapData.zones)

      if (zoneData && zoneData.zones.length) {
        // Utilise le viewBox du SVG Illustrator pour un mapping parfait
        svg.setAttribute('viewBox', zoneData.viewBox)

        // Injecte les zones
        zoneData.zones.forEach(z => {
          let el
          if (z.type === 'polygon') {
            el = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
            el.setAttribute('points', z.points)
          } else if (z.type === 'path') {
            el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            el.setAttribute('d', z.d)
          } else if (z.type === 'ellipse') {
            el = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse')
            el.setAttribute('cx', z.cx)
            el.setAttribute('cy', z.cy)
            el.setAttribute('rx', z.rx)
            el.setAttribute('ry', z.ry)
          }

          if (el) {
            el.setAttribute('class', 'map-zone')
            el.setAttribute('data-zone', z.id)
            svg.appendChild(el)
          }
        })

        // Labels au centroid de chaque zone
        zoneData.zones.forEach(z => {
          const c = this._computeCentroid(z)
          if (!c) return
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
          text.setAttribute('x', c.x)
          text.setAttribute('y', c.y)
          text.setAttribute('class', 'map-zone-label')
          text.textContent = z.id
          svg.appendChild(text)
        })

        // Hover events
        this._bindZoneEvents(svg, tooltip, viewer)
      }
    }

    // Initial floor
    loadFloor(0)

    // Floor tab switching
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'))
        tab.classList.add('active')
        loadFloor(parseInt(tab.dataset.floor))
      })
    })
  },

  _bindZoneEvents(svg, tooltip, viewer) {
    svg.querySelectorAll('.map-zone').forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.classList.add('hovered')
        tooltip.textContent = 'Zone ' + el.dataset.zone
        tooltip.classList.add('visible')
      })
      el.addEventListener('mousemove', (e) => {
        const rect = viewer.querySelector('.map-container').getBoundingClientRect()
        tooltip.style.left = (e.clientX - rect.left + 12) + 'px'
        tooltip.style.top = (e.clientY - rect.top - 30) + 'px'
      })
      el.addEventListener('mouseleave', () => {
        el.classList.remove('hovered')
        tooltip.classList.remove('visible')
      })
    })
  },

  // Calcule le centroid selon le type de forme
  _computeCentroid(zone) {
    if (zone.type === 'ellipse') {
      return { x: parseFloat(zone.cx), y: parseFloat(zone.cy) }
    }

    if (zone.type === 'polygon' && zone.points) {
      const pts = zone.points.trim().split(/\s+/).map(p => {
        const [x, y] = p.split(',').map(Number)
        return { x, y }
      })
      if (!pts.length) return null
      return {
        x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
        y: pts.reduce((s, p) => s + p.y, 0) / pts.length
      }
    }

    if (zone.type === 'path' && zone.d) {
      // Parse les coordonnées du path (approximation via les nombres)
      const nums = zone.d.match(/-?[\d.]+/g)
      if (!nums || nums.length < 2) return null
      const coords = []
      for (let i = 0; i < nums.length - 1; i += 2) {
        coords.push({ x: parseFloat(nums[i]), y: parseFloat(nums[i + 1]) })
      }
      if (!coords.length) return null
      return {
        x: coords.reduce((s, p) => s + p.x, 0) / coords.length,
        y: coords.reduce((s, p) => s + p.y, 0) / coords.length
      }
    }

    return null
  }
}

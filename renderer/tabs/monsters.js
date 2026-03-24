// ═══════════ Monsters tab ═══════════
window.Tabs = window.Tabs || {}

window.Tabs.monsters = {
  async load() {
    const data = await window.API.fetch('/monsters')
    return data.sort((a, b) => a.name.localeCompare(b.name))
  },

  renderCards(items, grid, onCardClick) {
    const H = window.Helpers
    grid.innerHTML = items.map(m => {
      const icon = H.monsterIcon(m.id)
      const desc = (m.description || '').length > 30 ? (m.description.slice(0, 30) + '…') : (m.description || '')
      return `<div class="card monster-card" data-id="${m.id}" data-type="monster">
        <div class="monster-card-top">
          <img class="card-icon monster-icon" src="${icon}" alt="" onerror="this.style.display='none'" />
          <div class="card-name">${m.name}</div>
        </div>
        <div class="monster-card-desc">${desc}</div>
      </div>`
    }).join('')
    onCardClick()
  },

  renderDetail(m, container) {
    const H = window.Helpers
    const C = window.Constants
    const icon = H.monsterIcon(m.id)

    let html = `
      <div class="detail-header">
        <img class="detail-icon monster" src="${icon}" alt="" onerror="this.style.display='none'" />
        <div>
          <h2 class="detail-title">${m.name}</h2>
          <div class="detail-subtitle">${m.species || ''} ${m.type ? '— ' + m.type : ''}</div>
        </div>
      </div>`

    // ── Weaknesses — 2-column grid with pip gauges ──
    if (m.weaknesses?.length) {
      const elemW = m.weaknesses.filter(w => w.kind === 'element')
      const statusW = m.weaknesses.filter(w => w.kind === 'status')
      const effectW = m.weaknesses.filter(w => w.kind === 'effect')
      const maxPips = 3

      const renderWeaknessRows = (list) => {
        return list.map(w => {
          const name = H.weaknessLabel(w)
          const key = w.element || w.status || w.effect || ''
          const color = `var(--element-${key}, var(--accent-gold))`
          return `<div class="weakness-row">
            <span class="weakness-name">${name}</span>
            ${H.pipsHTML(w.level || 0, maxPips, color)}
          </div>`
        }).join('')
      }

      html += `<div class="detail-section">
        <h3 class="section-title">Faiblesses</h3>
        <div class="weakness-grid">`

      if (elemW.length) {
        html += `<div class="weakness-column">
          <h4 class="weakness-group-title">Éléments</h4>
          ${renderWeaknessRows(elemW)}
        </div>`
      }
      if (statusW.length) {
        html += `<div class="weakness-column">
          <h4 class="weakness-group-title">Statuts</h4>
          ${renderWeaknessRows(statusW)}
        </div>`
      }
      if (effectW.length) {
        html += `<div class="weakness-column">
          <h4 class="weakness-group-title">Effets</h4>
          ${renderWeaknessRows(effectW)}
        </div>`
      }

      html += `</div></div>`
    }

    // ── Resistances — 2-column grid ──
    if (m.resistances?.length) {
      const elemR = m.resistances.filter(r => r.kind === 'element')
      const effectR = m.resistances.filter(r => r.kind === 'effect' || (!r.kind && r.effect))

      html += `<div class="detail-section">
        <h3 class="section-title">Résistances</h3>
        <div class="weakness-grid">
          ${elemR.length ? `<div class="weakness-column">
            <h4 class="weakness-group-title">Éléments</h4>
            ${elemR.map(r => `<div class="weakness-row">
              <span class="weakness-name">${H.weaknessLabel(r)}</span>
              <span class="badge" style="background:var(--element-${r.element || ''}, var(--bg-active))">${r.condition || 'Résistant'}</span>
            </div>`).join('')}
          </div>` : ''}
          ${effectR.length ? `<div class="weakness-column">
            <h4 class="weakness-group-title">Effets</h4>
            ${effectR.map(r => `<div class="weakness-row">
              <span class="weakness-name">${H.weaknessLabel(r)}</span>
              <span class="badge">${r.condition || 'Résistant'}</span>
            </div>`).join('')}
          </div>` : ''}
        </div>
      </div>`
    }

    // ── Rewards — grouped by item, single table ──
    if (m.rewards?.length) {
      // Flatten all conditions with their item name
      const rows = []
      m.rewards.forEach(r => {
        const itemName = r.item?.name || '?'
        ;(r.conditions || []).forEach(c => {
          rows.push({ itemName, kind: c.kind, part: c.part, quantity: c.quantity, chance: c.chance })
        })
      })

      // Group by itemName
      const grouped = {}
      rows.forEach(r => {
        if (!grouped[r.itemName]) grouped[r.itemName] = []
        grouped[r.itemName].push(r)
      })

      html += `<div class="detail-section">
        <h3 class="section-title">Récompenses</h3>
        <table class="reward-table reward-table-full">
          <thead>
            <tr>
              <th>Objet</th>
              <th>Zone de récolte</th>
              <th>Partie</th>
              <th>Qté</th>
              <th>Taux</th>
            </tr>
          </thead>
          <tbody>`

      Object.entries(grouped).forEach(([itemName, conditions]) => {
        conditions.forEach((c, i) => {
          html += `<tr>
            ${i === 0 ? `<td rowspan="${conditions.length}" class="reward-item-cell">${itemName}</td>` : ''}
            <td>${H.rewardKindLabel(c.kind)}</td>
            <td>${H.partLabel(c.part)}</td>
            <td>x${c.quantity || 1}</td>
            <td class="reward-chance">${c.chance || '?'}%</td>
          </tr>`
        })
      })

      html += `</tbody></table></div>`
    }

    // ── Locations ──
    if (m.locations?.length) {
      html += `<div class="detail-section">
        <h3 class="section-title">Habitats</h3>
        ${m.locations.map(l => {
          const locIcon = H.locationIcon(l.id)
          return `<button class="habitat-link" data-location-id="${l.id}">
            ${locIcon ? `<img class="habitat-icon" src="${locIcon}" alt="" onerror="this.style.display='none'" />` : ''}
            <span>${l.name || l}</span>
          </button>`
        }).join('')}
      </div>`
    }

    container.innerHTML = html

    // Bind location navigation
    container.querySelectorAll('.habitat-link').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.locationId
        if (id && window.App?.loadDetail) {
          window.App.loadDetail('location', id)
        }
      })
    })
  }
}

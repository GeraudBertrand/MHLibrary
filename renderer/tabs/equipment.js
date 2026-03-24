// ═══════════ Equipment tab (armor, charms, decorations) ═══════════
window.Tabs = window.Tabs || {}

window.Tabs.equipment = {
  defaultSubTab() {
    return window.Constants.EQUIPMENT_TABS[0].id
  },

  async load(subTab) {
    let data
    if (subTab === 'armor') data = await window.API.fetch('/armor/sets')
    else if (subTab === 'charms') data = await window.API.fetch('/charms')
    else data = await window.API.fetch('/decorations')
    return data.sort((a, b) => {
      const nameA = a.name || a.ranks?.[0]?.name || a.pieces?.[0]?.name || ''
      const nameB = b.name || b.ranks?.[0]?.name || b.pieces?.[0]?.name || ''
      return nameA.localeCompare(nameB)
    })
  },

  renderSubTabs(subTabsEl, currentSubTab, onSubTabClick) {
    const H = window.Helpers
    H.show(subTabsEl)
    subTabsEl.innerHTML = window.Constants.EQUIPMENT_TABS.map(t => {
      const active = currentSubTab === t.id ? 'active' : ''
      return `<div class="sub-tab ${active}" data-sub="${t.id}"><span>${t.label}</span></div>`
    }).join('')

    subTabsEl.querySelectorAll('.sub-tab').forEach(tab => {
      tab.addEventListener('click', () => onSubTabClick(tab.dataset.sub))
    })
  },

  renderCards(items, grid, onCardClick, subTab) {
    if (subTab === 'armor') this._renderArmorCards(items, grid, onCardClick)
    else if (subTab === 'charms') this._renderCharmCards(items, grid, onCardClick)
    else this._renderDecorationCards(items, grid, onCardClick)
  },

  _renderArmorCards(items, grid, onCardClick) {
    const H = window.Helpers
    const icon = H.armorPieceIcon('head')
    grid.innerHTML = items.map(a => {
      const name = a.name || a.pieces?.[0]?.name || 'Armure'
      const rarity = a.rarity || a.pieces?.[a.pieces.length - 1]?.rarity
      return `<div class="card" data-id="${a.id}" data-type="armor">
        <img class="card-icon" src="${icon}" alt="" onerror="this.style.display='none'" />
        <div class="card-info">
          <div class="card-name">${name}</div>
          <div class="card-sub">${(a.pieces || []).length} pièces</div>
          <div class="card-rarity" style="color:${H.rarityColor(rarity)}">Rareté ${rarity || '?'}</div>
        </div>
      </div>`
    }).join('')
    onCardClick()
  },

  _renderCharmCards(items, grid, onCardClick) {
    const H = window.Helpers
    const icon = H.charmIcon()
    grid.innerHTML = items.map(c => {
      // Use first rank name, last rank rarity
      const name = c.name || c.ranks?.[0]?.name || 'Talisman'
      const rarity = c.rarity || c.ranks?.[c.ranks.length - 1]?.rarity
      return `<div class="card" data-id="${c.id}" data-type="charm">
        <img class="card-icon" src="${icon}" alt="" onerror="this.style.display='none'" />
        <div class="card-info">
          <div class="card-name">${name}</div>
          <div class="card-rarity" style="color:${H.rarityColor(rarity)}">Rareté ${rarity || '?'}</div>
        </div>
      </div>`
    }).join('')
    onCardClick()
  },

  _renderDecorationCards(items, grid, onCardClick) {
    const H = window.Helpers
    const icon = H.decorationIcon()
    grid.innerHTML = items.map(d => {
      return `<div class="card" data-id="${d.id}" data-type="decoration">
        <img class="card-icon" src="${icon}" alt="" onerror="this.style.display='none'" />
        <div class="card-info">
          <div class="card-name">${d.name}</div>
          <div class="card-sub">Slot ${d.slot || '?'}</div>
          <div class="card-rarity" style="color:${H.rarityColor(d.rarity)}">Rareté ${d.rarity || '?'}</div>
        </div>
      </div>`
    }).join('')
    onCardClick()
  },

  renderDetail(data, container, subTab) {
    if (subTab === 'armor') this._renderArmorDetail(data, container)
    else if (subTab === 'charms') this._renderCharmDetail(data, container)
    else this._renderDecorationDetail(data, container)
  },

  _renderArmorDetail(a, container) {
    const H = window.Helpers
    const icon = H.armorPieceIcon('head')
    const name = a.name || a.pieces?.[0]?.name || 'Armure'
    const rarity = a.rarity || a.pieces?.[a.pieces.length - 1]?.rarity

    let html = `
      <div class="detail-header">
        <img class="detail-icon" src="${icon}" alt="" />
        <div>
          <h2 class="detail-title">${name}</h2>
          <div class="detail-subtitle" style="color:${H.rarityColor(rarity)}">Rareté ${rarity || '?'}</div>
        </div>
      </div>`

    if (a.bonus) {
      html += `<div class="detail-section">
        <h3 class="section-title">Bonus de set</h3>
        <table class="info-table">
          ${(a.bonus.ranks || []).map(r =>
            `<tr><th>${r.pieces} pièces</th><td>${r.skill?.name || r.description || '?'}</td></tr>`
          ).join('')}
        </table>
      </div>`
    }

    if (a.pieces?.length) {
      html += `<div class="detail-section">
        <h3 class="section-title">Pièces</h3>
        <div class="armor-pieces">${a.pieces.map(p => {
          const pIcon = H.armorPieceIcon(p.kind)
          const maxDef = 200
          const maxRes = 15
          return `<div class="armor-piece-card">
            <h4><img src="${pIcon}" alt="" />${p.name}</h4>
            <div class="piece-stat gauge-stat">
              <span>Défense</span>
              <span class="gauge-value">${p.defense?.base || '?'}</span>
              <div class="stat-gauge" style="--gauge-pct:${Math.min(100, ((p.defense?.base || 0) / maxDef) * 100)}%;--gauge-color:var(--gauge-physical)"></div>
            </div>
            ${p.resistances ? Object.entries(p.resistances).map(([k, v]) => {
              const pct = Math.min(100, Math.max(0, ((v + maxRes) / (maxRes * 2)) * 100))
              return `<div class="piece-stat gauge-stat">
                <span>${H.resistanceLabel(k)}</span>
                <span class="gauge-value">${v > 0 ? '+' : ''}${v}</span>
                <div class="stat-gauge" style="--gauge-pct:${pct}%;--gauge-color:var(--gauge-${k})"></div>
              </div>`
            }).join('') : ''}
            ${p.slots?.length ? `<div class="piece-stat"><span>Slots</span><span>${H.slotsHTML(p.slots)}</span></div>` : ''}
            ${p.skills?.length ? `<div style="margin-top:8px;">${p.skills.map(s =>
              `<span class="badge">${s.name || s.skill?.name || '?'} Nv.${s.level || '?'}</span>`
            ).join('')}</div>` : ''}
          </div>`
        }).join('')}</div>
      </div>`
    }

    container.innerHTML = html
  },

  _renderCharmDetail(c, container) {
    const H = window.Helpers
    const icon = H.charmIcon()
    const name = c.name || c.ranks?.[0]?.name || 'Talisman'
    const rarity = c.rarity || c.ranks?.[c.ranks.length - 1]?.rarity

    let html = `
      <div class="detail-header">
        <img class="detail-icon" src="${icon}" alt="" />
        <div>
          <h2 class="detail-title">${name}</h2>
          <div class="detail-subtitle" style="color:${H.rarityColor(rarity)}">Rareté ${rarity || '?'}</div>
        </div>
      </div>`

    if (c.ranks?.length) {
      html += `<div class="detail-section">
        <h3 class="section-title">Niveaux</h3>
        <table class="info-table">
          ${c.ranks.map(r => `<tr>
            <th>Niveau ${r.level || '?'}</th>
            <td>${(r.skills || []).map(s => `${s.name || s.skill?.name || '?'} Nv.${s.level || '?'}`).join(', ')}</td>
          </tr>`).join('')}
        </table>
      </div>`
    }

    if (c.crafting?.length) {
      html += `<div class="detail-section">
        <h3 class="section-title">Fabrication</h3>
        <ul class="material-list">${c.crafting.map(cr =>
          (cr.materials || []).map(m =>
            `<li><span>${m.item?.name || '?'}</span> x${m.quantity}</li>`
          ).join('')
        ).join('')}</ul>
      </div>`
    }

    container.innerHTML = html
  },

  _renderDecorationDetail(d, container) {
    const H = window.Helpers
    const icon = H.decorationIcon()

    let html = `
      <div class="detail-header">
        <img class="detail-icon" src="${icon}" alt="" />
        <div>
          <h2 class="detail-title">${d.name}</h2>
          <div class="detail-subtitle" style="color:${H.rarityColor(d.rarity)}">Rareté ${d.rarity} — Slot ${d.slot || '?'}</div>
        </div>
      </div>`

    if (d.skills?.length) {
      html += `<div class="detail-section">
        <h3 class="section-title">Talents</h3>
        <table class="info-table">${d.skills.map(s =>
          `<tr><th>${s.name || s.skill?.name || '?'}</th><td>Nv. ${s.level || '?'}</td></tr>`
        ).join('')}</table>
      </div>`
    }

    container.innerHTML = html
  }
}

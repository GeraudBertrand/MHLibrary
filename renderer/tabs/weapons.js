// ═══════════ Weapons tab ═══════════
window.Tabs = window.Tabs || {}

window.Tabs.weapons = {
  defaultSubTab() {
    return window.Constants.WEAPON_KINDS[0].id
  },

  async load(subTab) {
    return await window.API.fetch(`/weapons?q={"kind":"${subTab}"}`)
  },

  renderSubTabs(subTabsEl, currentSubTab, onSubTabClick) {
    const H = window.Helpers
    H.show(subTabsEl)
    subTabsEl.innerHTML = window.Constants.WEAPON_KINDS.map(w => {
      const icon = H.weaponIcon(w.id)
      const active = currentSubTab === w.id ? 'active' : ''
      return `<div class="sub-tab ${active}" data-sub="${w.id}">
        <img src="${icon}" alt="" onerror="this.style.display='none'" />
        <span>${w.label}</span>
      </div>`
    }).join('')

    subTabsEl.querySelectorAll('.sub-tab').forEach(tab => {
      tab.addEventListener('click', () => onSubTabClick(tab.dataset.sub))
    })
  },

  renderCards(items, grid, onCardClick, subTab) {
    const H = window.Helpers
    const icon = H.weaponIcon(subTab)
    grid.innerHTML = items.map(w => {
      return `<div class="card" data-id="${w.id}" data-type="weapon">
        <img class="card-icon" src="${icon}" alt="" onerror="this.style.display='none'" />
        <div class="card-info">
          <div class="card-name">${w.name}</div>
          <div class="card-sub">Attaque: ${w.damage?.display || '?'}</div>
          <div class="card-rarity" style="color:${H.rarityColor(w.rarity)}">Rareté ${w.rarity || '?'}</div>
        </div>
      </div>`
    }).join('')
    onCardClick()
  },

  renderDetail(w, container) {
    const H = window.Helpers
    const C = window.Constants
    const icon = H.weaponIcon(w.kind)

    let html = `
      <div class="detail-header">
        <img class="detail-icon" src="${icon}" alt="" onerror="this.style.display='none'" />
        <div>
          <h2 class="detail-title">${w.name}</h2>
          <div class="detail-subtitle" style="color:${H.rarityColor(w.rarity)}">
            Rareté ${w.rarity || '?'}
            ${w.series ? `<span class="weapon-series">· Série ${w.series.name}</span>` : ''}
          </div>
          ${w.description ? `<div class="weapon-description">${w.description}</div>` : ''}
        </div>
      </div>`

    // ── Stats table (with specials inline) ──
    const specialsHTML = (w.specials || []).map(s => {
      const elemLabel = C.WEAKNESS_LABELS[s.element] || s.element || '?'
      const color = `var(--element-${s.element}, var(--accent-gold))`
      return `<span class="attack-special" style="color:${color}">+ ${elemLabel} ${s.damage?.display || '?'}${s.hidden ? ' (caché)' : ''}</span>`
    }).join(' ')

    html += `<div class="detail-section">
      <h3 class="section-title">Statistiques</h3>
      <table class="info-table">
        <tr><th>Attaque</th><td>${w.damage?.display || '?'} <span class="text-muted">(raw: ${w.damage?.raw || '?'})</span> ${specialsHTML}</td></tr>
        <tr><th>Affinité</th><td class="${w.affinity > 0 ? 'text-positive' : w.affinity < 0 ? 'text-negative' : ''}">${w.affinity > 0 ? '+' : ''}${w.affinity}%</td></tr>
        ${w.defenseBonus ? `<tr><th>Bonus défense</th><td>+${w.defenseBonus}</td></tr>` : ''}
        ${w.elderseal ? `<tr><th>Aînéceau</th><td>${w.elderseal}</td></tr>` : ''}
        <tr><th>Slots</th><td>${H.slotsHTML(w.slots)}</td></tr>
      </table>
    </div>`

    // ── Sharpness ──
    if (w.sharpness) {
      const colors = { red: '#d03030', orange: '#e08030', yellow: '#e0c020', green: '#60b030', blue: '#3080d0', white: '#e0e0e0', purple: '#a050d0' }
      const total = Object.values(w.sharpness).reduce((s, v) => s + v, 0) || 1
      html += `<div class="detail-section">
        <h3 class="section-title">Tranchant</h3>
        <div class="sharpness-bar">${Object.entries(w.sharpness).map(([color, val]) =>
          val ? `<div class="sharpness-segment" style="width:${(val / total) * 100}%;background:${colors[color] || '#888'}" title="${color}: ${val}"></div>` : ''
        ).join('')}</div>
        ${w.handicraft?.length ? `<div class="sharpness-note">Handicraft: +${w.handicraft.join(', +')}</div>` : ''}
      </div>`
    }

    // ── Gunlance shell ──
    if (w.shell) {
      const shellLabel = C.SHELL_LABELS[w.shell] || w.shell
      html += `<div class="detail-section">
        <h3 class="section-title">Obus</h3>
        <div class="shell-display">
          <span class="shell-type">${shellLabel}</span>
          <span class="shell-level">Nv. ${w.shellLevel || '?'}</span>
        </div>
      </div>`
    }

    // ── Hunting Horn melody ──
    if (w.melody?.songs?.length) {
      html += `<div class="detail-section">
        <h3 class="section-title">Mélodie</h3>
        <div class="melody-grid">${w.melody.songs.map(s =>
          `<div class="melody-card">
            <span class="melody-note">♪</span>
            <span class="melody-name">${s.name}</span>
          </div>`
        ).join('')}</div>
      </div>`
    }

    // ── Echo bubble ──
    if (w.echoBubble) {
      html += `<div class="detail-section">
        <h3 class="section-title">Bulle d'écho</h3>
        <div class="echo-display">
          <span class="echo-kind echo-${w.echoBubble.kind || ''}">${w.echoBubble.name || '?'}</span>
        </div>
      </div>`
    }

    // ── Bowgun ammo ──
    if (w.ammo?.length) {
      html += `<div class="detail-section">
        <h3 class="section-title">Munitions</h3>
        <div class="ammo-grid">${w.ammo.map(a => {
          const label = C.AMMO_LABELS[a.kind] || a.kind
          const color = C.AMMO_COLORS[a.kind] || '#b8a070'
          return `<div class="ammo-card">
            <div class="ammo-header" style="border-left:4px solid ${color}">
              <span class="ammo-name">${label} Nv.${a.level || '?'}</span>
              <span class="ammo-capacity">x${a.capacity || '?'}</span>
            </div>
          </div>`
        }).join('')}</div>
      </div>`
    }

    // ── Bow coatings ──
    if (w.coatings?.length) {
      html += `<div class="detail-section">
        <h3 class="section-title">Revêtements</h3>
        <div class="coatings-grid">${w.coatings.map(c => {
          const label = C.COATING_LABELS[c] || c
          const color = C.AMMO_COLORS[c] || '#b8a070'
          return `<span class="coating-badge" style="border-color:${color};color:${color}">${label}</span>`
        }).join('')}</div>
      </div>`
    }

    // ── Skills ──
    if (w.skills?.length) {
      html += `<div class="detail-section">
        <h3 class="section-title">Talents</h3>
        <div class="weapon-skills">${w.skills.map(s => {
          const name = s.skill?.name || s.name || '?'
          const desc = s.description || s.skill?.description || ''
          return `<div class="weapon-skill-card">
            <div class="weapon-skill-name">${name} <span class="text-muted">Nv. ${s.level || '?'}</span></div>
            ${desc ? `<div class="weapon-skill-desc">${desc}</div>` : ''}
          </div>`
        }).join('')}</div>
      </div>`
    }

    // ── Crafting ──
    if (w.crafting) {
      const cr = w.crafting
      html += `<div class="detail-section">
        <h3 class="section-title">Fabrication</h3>`

      // Arbre d'amélioration (tableau 3 colonnes)
      if (cr.previous || cr.branches?.length) {
        const prevRows = cr.previous ? 1 : 0
        const branchRows = cr.branches?.length || 0
        const totalRows = Math.max(1, prevRows, branchRows)

        html += `<table class="craft-tree-table">
          <thead><tr>
            <th>Précédent</th>
            <th></th>
            <th>Actuel</th>
            <th></th>
            <th>Suivant</th>
          </tr></thead>
          <tbody>`

        for (let i = 0; i < totalRows; i++) {
          html += `<tr>`
          // Colonne précédent
          if (i === 0) {
            html += `<td rowspan="${totalRows}" class="craft-cell">${cr.previous ? `<button class="craft-node craft-prev craft-link" data-weapon-id="${cr.previous.id}">${cr.previous.name}</button>` : '<span class="text-muted">—</span>'}</td>`
            html += `<td rowspan="${totalRows}" class="craft-arrow">${cr.previous ? '→' : ''}</td>`
            html += `<td rowspan="${totalRows}" class="craft-cell"><div class="craft-node craft-current">${w.name}</div></td>`
            html += `<td rowspan="${totalRows}" class="craft-arrow">${branchRows ? '→' : ''}</td>`
          }
          // Colonne branches
          if (i < branchRows) {
            html += `<td class="craft-cell"><button class="craft-node craft-branch craft-link" data-weapon-id="${cr.branches[i].id}">${cr.branches[i].name}</button></td>`
          } else if (i === 0 && !branchRows) {
            html += `<td rowspan="${totalRows}" class="craft-cell"><span class="text-muted">—</span></td>`
          }
          html += `</tr>`
        }

        html += `</tbody></table>`
      }

      // Matériaux de fabrication
      if (cr.craftingMaterials?.length) {
        html += `<div class="craft-block">
          <h4>Fabrication</h4>
          <ul class="material-list">${cr.craftingMaterials.map(m =>
            `<li><span>${m.item?.name || '?'}</span> x${m.quantity}</li>`
          ).join('')}</ul>
          ${cr.craftingZennyCost ? `<div class="craft-cost">${cr.craftingZennyCost}z</div>` : ''}
        </div>`
      }

      // Matériaux d'amélioration
      if (cr.upgradeMaterials?.length) {
        html += `<div class="craft-block">
          <h4>Amélioration</h4>
          <ul class="material-list">${cr.upgradeMaterials.map(m =>
            `<li><span>${m.item?.name || '?'}</span> x${m.quantity}</li>`
          ).join('')}</ul>
          ${cr.upgradeZennyCost ? `<div class="craft-cost">${cr.upgradeZennyCost}z</div>` : ''}
        </div>`
      }

      html += `</div>`
    }

    container.innerHTML = html

    // Bind craft tree navigation
    container.querySelectorAll('.craft-link').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.weaponId
        if (id && window.App?.loadDetail) {
          window.App.loadDetail('weapon', id)
        }
      })
    })
  }
}

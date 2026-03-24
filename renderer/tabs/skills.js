// ═══════════ Skills tab ═══════════
window.Tabs = window.Tabs || {}

window.Tabs.skills = {
  async load() {
    const data = await window.API.fetch('/skills')
    return data.sort((a, b) => a.name.localeCompare(b.name))
  },

  renderCards(items, grid, onCardClick) {
    grid.innerHTML = items.map(s => {
      const maxLevel = s.ranks ? s.ranks.length : '?'
      return `<div class="card" data-id="${s.id}" data-type="skill">
        <div class="card-info">
          <div class="card-name">${s.name}</div>
          <div class="card-sub">Niveaux : ${maxLevel}</div>
        </div>
      </div>`
    }).join('')
    onCardClick()
  },

  renderDetail(s, container) {
    let html = `
      <div class="detail-header">
        <div>
          <h2 class="detail-title">${s.name}</h2>
          <div class="detail-subtitle">${s.description || ''}</div>
        </div>
      </div>`

    if (s.ranks?.length) {
      const maxLevel = s.ranks.length
      html += `<div class="detail-section">
        <h3 class="section-title">Niveaux</h3>
        <table class="info-table">${s.ranks.map(r => `
          <tr>
            <th>
              <div>Nv. ${r.level || '?'}</div>
              <div class="skill-level">${Array.from({ length: maxLevel }, (_, i) =>
                `<span class="skill-pip ${i < (r.level || 0) ? 'filled' : ''}"></span>`
              ).join('')}</div>
            </th>
            <td>${r.description || '—'}</td>
          </tr>
        `).join('')}</table>
      </div>`
    }

    container.innerHTML = html
  }
}

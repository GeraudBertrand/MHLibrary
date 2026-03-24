// ═══════════ Shared helpers ═══════════
window.Helpers = (function () {
  const C = window.Constants

  function rarityColor(r) {
    return `var(--rarity-${Math.min(r || 1, 10)})`
  }

  function slotsHTML(slots) {
    if (!slots || !slots.length) return '<span style="color:var(--text-muted)">—</span>'
    return `<div class="slots-display">${slots.map(s =>
      `<span class="slot-gem">${s.rank || s}</span>`
    ).join('')}</div>`
  }

  function elementBadge(el) {
    if (!el) return ''
    const cls = el.type ? `badge-${el.type}` : ''
    return `<span class="badge ${cls}">${el.type || ''} ${el.damage || ''}</span>`
  }

  // ── Icon helpers ──
  function weaponIcon(kind) {
    return `../assets/icons/weapons/${kind}.svg`
  }

  function armorPieceIcon(piece) {
    const name = C.ARMOR_PIECE_MAP[piece] || 'set'
    return `../assets/icons/armor/${name}.svg`
  }

  function monsterIcon(id) {
    const file = C.MONSTER_ICONS[id]
    if (!file) return ''
    return `../assets/icons/monsters/${file}.png`
  }

  function charmIcon() {
    return '../assets/icons/charms/charm.svg'
  }

  function decorationIcon() {
    return '../assets/icons/decorations/decoration.svg'
  }

  function locationIcon(id) {
    const file = C.LOCATION_ICONS[id]
    if (!file) return ''
    return `../assets/icons/locations/${file}.png`
  }

  // ── Label helpers ──
  function resistanceLabel(key) {
    return C.ELEMENT_LABELS[key] || key
  }

  function weaknessLabel(w) {
    const key = w.element || w.status || w.effect
    return C.WEAKNESS_LABELS[key] || key || '?'
  }

  function rewardKindLabel(kind) {
    return C.REWARD_KIND_LABELS[kind] || kind || '?'
  }

  function partLabel(part) {
    return C.PART_LABELS[part] || part || ''
  }

  // ── Pip gauge HTML ──
  function pipsHTML(level, max, colorClass) {
    return `<div class="skill-level">${Array.from({ length: max }, (_, i) =>
      `<span class="skill-pip ${i < level ? 'filled' : ''}" ${colorClass ? `style="--pip-color:${colorClass}"` : ''}></span>`
    ).join('')}</div>`
  }

  // ── DOM helpers ──
  function show(el) { el.classList.remove('hidden') }
  function hide(el) { el.classList.add('hidden') }

  return {
    rarityColor, slotsHTML, elementBadge,
    weaponIcon, armorPieceIcon, monsterIcon, charmIcon, decorationIcon, locationIcon,
    resistanceLabel, weaknessLabel, pipsHTML, rewardKindLabel, partLabel, show, hide
  }
})()

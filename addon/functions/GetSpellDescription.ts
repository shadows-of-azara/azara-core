export function GetSpellDescription(id) {
    let hiddenTooltip: WoWAPI.GameTooltip = _G['HiddenSpellTooltip']
    hiddenTooltip.SetHyperlink(`spell:${id}`)
    hiddenTooltip.SetSpellByID(id)

    let tooltip: WoWAPI.GameTooltip = _G['HiddenSpellTooltipTextLeft4']
    return tooltip.GetText()
}

export function InitializeTooltip() {
    CreateFrame("GameTooltip", "HiddenSpellTooltip", null, "GameTooltipTemplate").SetOwner(UIParent, "ANCHOR_NONE")
}
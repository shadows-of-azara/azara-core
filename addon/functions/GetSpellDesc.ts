export function InitializeTooltip() {
    CreateFrame("GameTooltip", "SpellTooltip", null, "GameTooltipTemplate").SetOwner(UIParent, "ANCHOR_NONE")
}

export function GetSpellDesc(id: uint32) {
    let spellTooltip: WoWAPI.GameTooltip = _G['SpellTooltip']
    spellTooltip.ClearLines()
    spellTooltip.SetHyperlink(`spell:${id}`)

    const spellDescription: string = _G[`${spellTooltip.GetName()}TextLeft${spellTooltip.NumLines()}`]?.GetText();

    if (spellDescription) {
        return spellDescription;
    }
}
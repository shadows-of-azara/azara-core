export function GetSpellDescription(id) {
    let hiddenTooltip: WoWAPI.GameTooltip = _G['HiddenSpellTooltip']
    hiddenTooltip.SetHyperlink(`spell:${id}`)
    hiddenTooltip.SetSpellByID(id)

    for (let i = 4; i <= 10; i++) {
        let loopTooltip: WoWAPI.GameTooltip = _G[`HiddenSpellTooltipTextLeft${i}`];

        if (!loopTooltip.GetText().startsWith("Requires")) {
            return loopTooltip.GetText();
        }
    }
}

export function InitializeTooltip() {
    CreateFrame("GameTooltip", "HiddenSpellTooltip", null, "GameTooltipTemplate").SetOwner(UIParent, "ANCHOR_NONE")
}
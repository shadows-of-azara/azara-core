import { ABILITIES, ABILITIES_DYNAMIC } from "../../shared/packets/definitions"
import { ABILITY_DYNAMIC, ABILITY_PACKET } from "../../shared/packets/implementations/abilities"

export function Abilities() {
    createFrame()
    SendAddonMessage('reloaded', "reloaded", 'WHISPER', GetUnitName("player", false))
}

let learnedAbilities = []
let row = 0
let column = 0
let selectedSpell = 0
let status = 0

let abilityFrame = CreateFrame("Frame", "AbilityFrame", UIParent)
let infoFrame = CreateFrame("Frame", "AbilityInfo", abilityFrame)
let listFrame = CreateFrame("ScrollFrame", "AbilityList", abilityFrame, "UIPanelScrollFrameTemplate")
let listContent = CreateFrame("Frame", "AbilityListContent", listFrame)
let selectedAbilityName = infoFrame.CreateFontString("AbilityName", "OVERLAY")
let selectedAbilityDescription = infoFrame.CreateFontString("AbilityName", "OVERLAY")
let selectedAbility = CreateFrame("Frame", "CurrentAbility", infoFrame)
let abilityButton = CreateFrame("Button", "AbilityButton", infoFrame, "UIPanelButtonTemplate")
let countText = infoFrame.CreateFontString("AbilityName", "OVERLAY")
let hiddenTooltip = CreateFrame("GameTooltip", "HiddenSpellTooltip", null, "GameTooltipTemplate")
hiddenTooltip.SetOwner(UIParent, "ANCHOR_NONE")

OnCustomPacket(ABILITIES, packet => {
    let ability = new ABILITY_PACKET();
    ability.Read(packet)

    learnedAbilities.push(ability.getSpell())
    let spell = ability.getSpell()

    let name = GetSpellInfo(spell)[0]
    let desc = GetSpellDescription(spell)
    let icon = GetSpellInfo(spell)[2]

    addAbility(name, desc, icon, spell)
})

OnCustomPacket(ABILITIES_DYNAMIC, packet => {
    let ability_dynamic = new ABILITY_DYNAMIC();
    ability_dynamic.Read(packet)

    let count = ability_dynamic.getCount()

    countText.SetText(`Active Abilities: ` + count)

    if (ability_dynamic.getStatus() == 1) {
        abilityButton.SetText("Unlearn")
        status = 1
    } else {
        abilityButton.SetText("Learn")
        status = 0
    }
})

function GetSpellDescription(id) {
    hiddenTooltip.SetHyperlink(`spell:${id}`)
    hiddenTooltip.SetSpellByID(id)
    let tooltip: WoWAPI.GameTooltip = _G['HiddenSpellTooltipTextLeft4']

    return tooltip.GetText()
}

function addAbility(name, description, icon, spell) {
    let ability = CreateFrame("Button", "AbilityCard", listContent)
    ability.SetPoint("TOPLEFT", listContent, "TOPLEFT", (column * 110) + 20, -row * 128)
    ability.SetSize(64, 64)
    ability.SetBackdrop({
        bgFile: icon,
        edgeFile: "Interface\\Tooltips\\UI-Tooltip-Border",
        tile: false,
        tileSize: 0,
        edgeSize: 12,
        insets: { left: 3, right: 3, top: 3, bottom: 3 }
    })
    ability.SetScript("OnClick", () => {
        selectAbility(name, description, icon, spell)
    })

    let abilityName = ability.CreateFontString("AbilityName", "OVERLAY")
    abilityName.SetPoint("CENTER", ability, "BOTTOM", 0, -20)
    abilityName.SetFont("Fonts\\FRIZQT__.TTF", 16, "OUTLINE")
    abilityName.SetWidth(100)
    abilityName.SetText(name)
    abilityName.SetTextColor(1, 0.82, 0)
    abilityName.SetWordWrap(true)

    if (column == 5) {
        column = 0
        row++
    } else {
        column++
    }

    let selectAbility = function (name, description, icon, spell) {
        selectedAbilityName.SetText(name)
        selectedAbilityName.Show()
        selectedAbilityDescription.SetText(description)
        selectedAbilityDescription.Show()
        selectedAbility.SetBackdrop({
            bgFile: icon,
            edgeFile: "Interface\\Tooltips\\UI-Tooltip-Border",
            tile: false,
            tileSize: 0,
            edgeSize: 12,
            insets: { left: 3, right: 3, top: 3, bottom: 3 }
        })
        selectedAbility.Show()
        abilityButton.Show()
        countText.Show()
        selectedSpell = spell

        SendAddonMessage('selected', spell, 'WHISPER', GetUnitName("player", false))
    }
}

function createFrame() {
    abilityFrame.SetSize(800, 500)
    abilityFrame.SetPoint("CENTER")
    abilityFrame.SetBackdrop({
        bgFile: "Interface\\AchievementFrame\\UI-Achievement-AchievementBackground",
        edgeFile: "Interface\\Tooltips\\UI-Tooltip-Border",
        tile: false,
        tileSize: 0,
        edgeSize: 20,
        insets: { left: 4, right: 4, top: 4, bottom: 4 }
    })
    abilityFrame.Hide()

    UISpecialFrames.push("AbilityFrame")

    let title = CreateFrame("Frame", "AbilityFrameTitle", abilityFrame)
    title.SetSize(800, 28)
    title.SetPoint("TOPLEFT")
    title.SetBackdrop({
        bgFile: "Interface\\RAIDFRAME\\UI-RaidFrame-GroupBg",
        edgeFile: "Interface\\Tooltips\\UI-Tooltip-Border",
        tile: false,
        tileSize: 0,
        edgeSize: 16,
        insets: { left: 4, right: 4, top: 4, bottom: 4 }
    })

    let titleText = title.CreateFontString("AbilityName", "OVERLAY")
    titleText.SetPoint("CENTER", title, "CENTER", 0, 0)
    titleText.SetFont("Fonts\\FRIZQT__.TTF", 16, "OUTLINE")
    titleText.SetWidth(600)
    titleText.SetText("Spellbook")
    titleText.SetTextColor(1, 0.82, 0)

    let closeButton = CreateFrame("Button", "AbilityCloseButton", abilityFrame, "UIPanelCloseButton")
    closeButton.SetPoint("TOPRIGHT", 3, 2)
    closeButton.SetSize(32, 32)
    closeButton.SetScript("OnClick", () => {
        abilityFrame.Hide()
        PlaySound(88);
    })

    infoFrame.SetSize(800, 175)
    infoFrame.SetPoint("TOP")
    infoFrame.SetBackdrop({
        bgFile: "Interface\\RAIDFRAME\\UI-RaidFrame-GroupBg",
        tile: false,
        tileSize: 0,
        insets: { left: 6, right: 6, top: 28, bottom: 0 }
    })
    infoFrame.SetBackdropColor(1, 1, 1, 0.5)

    listFrame.SetSize(650, 300)
    listFrame.SetPoint("BOTTOM", 0, 20)
    listFrame.SetBackdrop({
        bgFile: "Interface\\RAIDFRAME\\UI-RaidFrame-GroupBg",
        tile: false,
        tileSize: 0,
        insets: { left: 0, right: 0, top: 0, bottom: 0 }
    })
    listFrame.SetBackdropColor(1, 1, 1, 0)

    listContent.SetSize(650, 300)
    listContent.SetPoint("TOP", listFrame, "TOP", 0, 0)
    listFrame.SetScrollChild(listContent)

    selectedAbility.SetSize(64, 64)
    selectedAbility.SetPoint("LEFT", infoFrame, "LEFT", 95, 20)
    selectedAbility.SetBackdrop({
        bgFile: `Interface\\ICONS\\spell_frost_frostbolt02`,
        edgeFile: "Interface\\Tooltips\\UI-Tooltip-Border",
        tile: false,
        tileSize: 0,
        edgeSize: 12,
        insets: { left: 3, right: 3, top: 3, bottom: 3 }
    })
    selectedAbility.Hide()

    selectedAbilityName.SetPoint("LEFT", infoFrame, "LEFT", 175, 20)
    selectedAbilityName.SetFont("Fonts\\FRIZQT__.TTF", 48, "OUTLINE")
    selectedAbilityName.SetWidth(600)
    selectedAbilityName.SetText("Example")
    selectedAbilityName.SetTextColor(1, 0.82, 0)
    selectedAbilityName.SetJustifyH("LEFT")
    selectedAbilityName.Hide()

    selectedAbilityDescription.SetPoint("LEFT", infoFrame, "LEFT", 100, -50)
    selectedAbilityDescription.SetFont("Fonts\\FRIZQT__.TTF", 16, "0")
    selectedAbilityDescription.SetWidth(400)
    selectedAbilityDescription.SetHeight(300)
    selectedAbilityDescription.SetText("Launch a bolt of frost at the enemy dealing damage and slowing movement speed.")
    selectedAbilityDescription.SetTextColor(1, 0.82, 0)
    selectedAbilityDescription.SetJustifyH("LEFT")
    selectedAbilityDescription.SetWordWrap(true)
    selectedAbilityDescription.Hide()

    abilityButton.SetSize(100, 35)
    abilityButton.SetPoint("RIGHT", infoFrame, "RIGHT", -125, 10)
    abilityButton.SetText("Learn")
    abilityButton.Hide()

    countText.SetPoint("RIGHT", infoFrame, "RIGHT", 125, -40)
    countText.SetFont("Fonts\\FRIZQT__.TTF", 16, "OUTLINE")
    countText.SetWidth(600)
    countText.SetTextColor(1, 0.82, 0)
    countText.Hide()
}

abilityButton.SetScript("OnClick", () => {
    let packet = new ABILITY_PACKET()
    packet.setSpell(selectedSpell)
    packet.Write().Send();
})
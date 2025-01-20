import { SPELLBOOK, SPELLBOOK_DYNAMIC } from "../../shared/packets/definitions"
import { SPELLBOOK_DYNAMIC_PACKET, SPELLBOOK_PACKET } from "../../shared/packets/spellbook"
import { GetSpellDescription } from "../functions/GetSpellDescription"

export function Spellbook() {
    Init()
    SendAddonMessage("reloaded", "reloaded", "WHISPER", GetUnitName("player", false))
}

let limit = 6

let row = 0
let column = 0
let currentAbility = 0
let status = 0

let spellFrame = CreateFrame("Frame", "SpellFrame", UIParent)
let infoFrame = CreateFrame("Frame", "SpellInfoFrame", spellFrame)
let listFrame = CreateFrame("ScrollFrame", "SpellListFrame", spellFrame, "UIPanelScrollFrameTemplate")
let listContent = CreateFrame("Frame", "SpellListContentFrame", listFrame)
let selectedAbilityName = infoFrame.CreateFontString("AbilityName", "OVERLAY")
let selectedAbilityDescription = infoFrame.CreateFontString("AbilityDesc", "OVERLAY")
let selectedAbility = CreateFrame("Frame", "CurrentAbilityFrame", infoFrame)
let abilityButton = CreateFrame("Button", "AbilityButton", infoFrame, "UIPanelButtonTemplate")
let countText = infoFrame.CreateFontString("AbilityCount", "OVERLAY")

let abilities = []

OnCustomPacket(SPELLBOOK, packet => {
    let parsed = new SPELLBOOK_PACKET()
    parsed.Read(packet)

    let spell = parsed.getAbility()

    let name = GetSpellInfo(spell)[0]
    let desc = GetSpellDescription(spell)
    let icon = GetSpellInfo(spell)[2]

    if (!abilities.includes(spell)) {
        abilities.push(spell)
        createAbility(name, desc, icon, spell)
    }
})

OnCustomPacket(SPELLBOOK_DYNAMIC, packet => {
    let parsed = new SPELLBOOK_DYNAMIC_PACKET()
    parsed.Read(packet)

    let count = parsed.getCount()

    countText.SetText(`Remaining Abilities: ${limit - count}`)

    if (count == limit) {
        countText.SetTextColor(255, 0, 0)
    } else {
        countText.SetTextColor(1, 0.82, 0)
    }

    if (parsed.getStatus() == 1) {
        abilityButton.SetText("Unlearn")
        abilityButton.Enable()
        status = 1
    } else {
        abilityButton.SetText("Learn")
        status = 0

        if (count == limit) {
            abilityButton.Disable()
        }
    }
})

function createAbility(name, description, icon, spell) {
    let abilityFrame = CreateFrame("Button", "AbilityFrame", listContent)
    abilityFrame.SetPoint("TOPLEFT", listContent, "TOPLEFT", (column * 110) + 20, -row * 128)
    abilityFrame.SetSize(64, 64)
    abilityFrame.SetBackdrop({
        bgFile: icon,
        edgeFile: "Interface\\Tooltips\\UI-Tooltip-Border",
        tile: false,
        tileSize: 0,
        edgeSize: 12,
        insets: { left: 3, right: 3, top: 3, bottom: 3 }
    })
    abilityFrame.SetScript("OnClick", () => {
        selectAbility(name, description, icon, spell)
    })

    let abilityName = spellFrame.CreateFontString("AbilityName", "OVERLAY")
    abilityName.SetPoint("CENTER", abilityFrame, "BOTTOM", 0, -20)
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
}

function selectAbility(name, description, icon, ability) {
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
    currentAbility = ability

    SendAddonMessage('selected', ability, 'WHISPER', GetUnitName("player", false))
}

function Init() {
    spellFrame.SetSize(800, 500)
    spellFrame.SetPoint("CENTER")
    spellFrame.SetBackdrop({
        bgFile: "Interface\\AchievementFrame\\UI-Achievement-AchievementBackground",
        edgeFile: "Interface\\Tooltips\\UI-Tooltip-Border",
        tile: false,
        tileSize: 0,
        edgeSize: 20,
        insets: { left: 4, right: 4, top: 4, bottom: 4 }
    })
    spellFrame.Hide()

    UISpecialFrames.push("SpellFrame")

    let title = CreateFrame("Frame", "SpellTitleFrame", spellFrame)
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

    let titleText = title.CreateFontString("SpellTitle", "OVERLAY")
    titleText.SetPoint("CENTER", title, "CENTER", 0, 0)
    titleText.SetFont("Fonts\\FRIZQT__.TTF", 16, "OUTLINE")
    titleText.SetWidth(600)
    titleText.SetText("Spellbook")
    titleText.SetTextColor(1, 0.82, 0)

    let closeButton = CreateFrame("Button", "SpellCloseButton", spellFrame, "UIPanelCloseButton")
    closeButton.SetPoint("TOPRIGHT", 3, 2)
    closeButton.SetSize(32, 32)
    closeButton.SetScript("OnClick", () => {
        spellFrame.Hide()
        PlaySound(88)
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
    selectedAbilityName.SetTextColor(1, 0.82, 0)
    selectedAbilityName.SetJustifyH("LEFT")
    selectedAbilityName.Hide()

    selectedAbilityDescription.SetPoint("LEFT", infoFrame, "LEFT", 100, -50)
    selectedAbilityDescription.SetFont("Fonts\\FRIZQT__.TTF", 16, "0")
    selectedAbilityDescription.SetWidth(400)
    selectedAbilityDescription.SetHeight(300)
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
    let packet = new SPELLBOOK_PACKET()
    packet.setAbility(currentAbility)
    packet.Write().Send()
})
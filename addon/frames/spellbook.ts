import { SPELLBOOK, SPELLBOOK_DYNAMIC } from "../../shared/packets/definitions"
import { SPELLBOOK_DYNAMIC_PACKET, SPELLBOOK_PACKET } from "../../shared/packets/implementations/spellbook"
import { GetSpellDescription } from "../functions/GetSpellDescription"

export function Spellbook() {
    initialize()
    SendAddonMessage("reloaded", "reloaded", "WHISPER", GetUnitName("player", false))
}

let row = 0
let column = 0
let currentSpell = 0
let status = 0

let spellFrame = CreateFrame("Frame", "SpellFrame", UIParent)
let infoFrame = CreateFrame("Frame", "SpellInfoFrame", spellFrame)
let listFrame = CreateFrame("ScrollFrame", "SpellListFrame", spellFrame, "UIPanelScrollFrameTemplate")
let listContent = CreateFrame("Frame", "SpellListContentFrame", listFrame)
let selectedSpellName = infoFrame.CreateFontString("SpellName", "OVERLAY")
let selectedSpellDescription = infoFrame.CreateFontString("SpellDesc", "OVERLAY")
let selectedSpell = CreateFrame("Frame", "CurrentSpellFrame", infoFrame)
let spellButton = CreateFrame("Button", "SpellButton", infoFrame, "UIPanelButtonTemplate")
let countText = infoFrame.CreateFontString("SpellCount", "OVERLAY")

OnCustomPacket(SPELLBOOK, packet => {
    let parsed = new SPELLBOOK_PACKET()
    parsed.Read(packet)

    let spell = parsed.getSpell()

    let name = GetSpellInfo(spell)[0]
    let desc = GetSpellDescription(spell)
    let icon = GetSpellInfo(spell)[2]

    createSpell(name, desc, icon, spell)
})

OnCustomPacket(SPELLBOOK_DYNAMIC, packet => {
    let parsed = new SPELLBOOK_DYNAMIC_PACKET()
    parsed.Read(packet)

    let count = parsed.getCount()

    countText.SetText(`Remaining Abilities: ${6 - count}`)

    if (parsed.getStatus() == 1) {
        spellButton.SetText("Unlearn")
        status = 1
    } else {
        spellButton.SetText("Learn")
        status = 0
    }
})

function createSpell(name, description, icon, spell) {
    let spellFrame = CreateFrame("Button", "SpellCard", listContent)
    spellFrame.SetPoint("TOPLEFT", listContent, "TOPLEFT", (column * 110) + 20, -row * 128)
    spellFrame.SetSize(64, 64)
    spellFrame.SetBackdrop({
        bgFile: icon,
        edgeFile: "Interface\\Tooltips\\UI-Tooltip-Border",
        tile: false,
        tileSize: 0,
        edgeSize: 12,
        insets: { left: 3, right: 3, top: 3, bottom: 3 }
    })
    spellFrame.SetScript("OnClick", () => {
        selectSpell(name, description, icon, spell)
    })

    let spellName = spellFrame.CreateFontString("SpellName", "OVERLAY")
    spellName.SetPoint("CENTER", spellFrame, "BOTTOM", 0, -20)
    spellName.SetFont("Fonts\\FRIZQT__.TTF", 16, "OUTLINE")
    spellName.SetWidth(100)
    spellName.SetText(name)
    spellName.SetTextColor(1, 0.82, 0)
    spellName.SetWordWrap(true)

    if (column == 5) {
        column = 0
        row++
    } else {
        column++
    }
}

function selectSpell(name, description, icon, spell) {
    selectedSpellName.SetText(name)
    selectedSpellName.Show()
    selectedSpellDescription.SetText(description)
    selectedSpellDescription.Show()
    selectedSpell.SetBackdrop({
        bgFile: icon,
        edgeFile: "Interface\\Tooltips\\UI-Tooltip-Border",
        tile: false,
        tileSize: 0,
        edgeSize: 12,
        insets: { left: 3, right: 3, top: 3, bottom: 3 }
    })
    selectedSpell.Show()
    spellButton.Show()
    countText.Show()
    currentSpell = spell

    SendAddonMessage('selected', spell, 'WHISPER', GetUnitName("player", false))
}

function initialize() {
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

    let title = CreateFrame("Frame", "SpellFrameTitle", spellFrame)
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

    let titleText = title.CreateFontString("SpellName", "OVERLAY")
    titleText.SetPoint("CENTER", title, "CENTER", 0, 0)
    titleText.SetFont("Fonts\\FRIZQT__.TTF", 16, "OUTLINE")
    titleText.SetWidth(600)
    titleText.SetText("Spellbook")
    titleText.SetTextColor(1, 0.82, 0)

    let closeButton = CreateFrame("Button", "AbilityCloseButton", spellFrame, "UIPanelCloseButton")
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

    selectedSpell.SetSize(64, 64)
    selectedSpell.SetPoint("LEFT", infoFrame, "LEFT", 95, 20)
    selectedSpell.SetBackdrop({
        bgFile: `Interface\\ICONS\\spell_frost_frostbolt02`,
        edgeFile: "Interface\\Tooltips\\UI-Tooltip-Border",
        tile: false,
        tileSize: 0,
        edgeSize: 12,
        insets: { left: 3, right: 3, top: 3, bottom: 3 }
    })
    selectedSpell.Hide()

    selectedSpellName.SetPoint("LEFT", infoFrame, "LEFT", 175, 20)
    selectedSpellName.SetFont("Fonts\\FRIZQT__.TTF", 48, "OUTLINE")
    selectedSpellName.SetWidth(600)
    selectedSpellName.SetTextColor(1, 0.82, 0)
    selectedSpellName.SetJustifyH("LEFT")
    selectedSpellName.Hide()

    selectedSpellDescription.SetPoint("LEFT", infoFrame, "LEFT", 100, -50)
    selectedSpellDescription.SetFont("Fonts\\FRIZQT__.TTF", 16, "0")
    selectedSpellDescription.SetWidth(400)
    selectedSpellDescription.SetHeight(300)
    selectedSpellDescription.SetTextColor(1, 0.82, 0)
    selectedSpellDescription.SetJustifyH("LEFT")
    selectedSpellDescription.SetWordWrap(true)
    selectedSpellDescription.Hide()

    spellButton.SetSize(100, 35)
    spellButton.SetPoint("RIGHT", infoFrame, "RIGHT", -125, 10)
    spellButton.SetText("Learn")
    spellButton.Hide()

    countText.SetPoint("RIGHT", infoFrame, "RIGHT", 125, -40)
    countText.SetFont("Fonts\\FRIZQT__.TTF", 16, "OUTLINE")
    countText.SetWidth(600)
    countText.SetTextColor(1, 0.82, 0)
    countText.Hide()
}

spellButton.SetScript("OnClick", () => {
    let packet = new SPELLBOOK_PACKET()
    packet.setSpell(currentSpell)
    packet.Write().Send()
})
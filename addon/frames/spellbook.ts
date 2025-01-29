import { SPELLBOOK } from "../../shared/packets/definitions"
import { SPELLBOOK_PACKET } from "../../shared/packets/spellbook"
import { GetSpellDesc } from "../functions/GetSpellDesc"
import { Ability } from "../objects/ability"

export function Spellbook() {
    Init()
    SendAddonMessage("reloaded", "reloaded", "WHISPER", GetUnitName("player", false))
}

let limit = 6
let count = 0

let row = 0
let column = 0

let currentAbility: Ability

let abilities: TSArray<WoWAPI.Frame> = []
let filteredAbilities: TSArray<WoWAPI.Frame> = []

let spellFrame = CreateFrame("Frame", "SpellFrame", UIParent)
let infoFrame = CreateFrame("Frame", "SpellInfoFrame", spellFrame)
let listFrame = CreateFrame("ScrollFrame", "SpellListFrame", spellFrame, "UIPanelScrollFrameTemplate")
let listContent = CreateFrame("Frame", "SpellListContentFrame", listFrame)
let selectedAbilityName = infoFrame.CreateFontString("AbilityName", "OVERLAY")
let selectedAbilityDesc = infoFrame.CreateFontString("AbilityDesc", "OVERLAY")
let selectedAbility = CreateFrame("Frame", "CurrentAbilityFrame", infoFrame)
let abilityButton = CreateFrame("Button", "AbilityButton", infoFrame, "UIPanelButtonTemplate")
let countText = infoFrame.CreateFontString("AbilityCount", "OVERLAY")

OnCustomPacket(SPELLBOOK, packet => {
    let parsed = new SPELLBOOK_PACKET()
    parsed.Read(packet)
    parsed.getAbilities().forEach(spell => {
        let ability = new Ability()

        ability.setName(GetSpellInfo(spell)[0])
        ability.setDesc(GetSpellDesc(spell))
        ability.setIcon(GetSpellInfo(spell)[2])
        ability.setSpell(spell)

        abilities.push(createAbility(ability))
    })

    count = parsed.getCount()
})

Events.ChatInfo.OnChatMsgAddon(spellFrame, (opcode, message, channel, sender) => {
    let status = 0

    if (sender == GetUnitName("player", false)) {
        if (opcode.startsWith("abilityStatus")) {
            status = parseInt(message.replace("status ", ""))
            if (status == 1) {
                abilityButton.SetText("Unlearn")
                abilityButton.Enable()
            } else {
                abilityButton.SetText("Learn")
            }
        }

        if (opcode.startsWith("abilityCount")) {
            count = parseInt(message.replace("count ", ""))
            countText.SetText(`Remaining Abilities: ${limit - count}`)

            if (count == limit) {
                countText.SetTextColor(255, 0, 0)
            } else {
                countText.SetTextColor(1, 0.82, 0)
            }
        }

        if (opcode.startsWith("abilityLearned")) {
            let ability = new Ability()
            let spell = parseInt(message.replace("abilityLearned ", ""))

            ability.setName(GetSpellInfo(spell)[0])
            ability.setDesc(GetSpellDesc(spell))
            ability.setIcon(GetSpellInfo(spell)[2])
            ability.setSpell(spell)

            abilities.push(createAbility(ability))
        }
    }
})

function createAbility(ability: Ability) {
    let name = ability.getName()
    let icon = ability.getIcon()
    let spell = ability.getSpell()

    let abilityFrame = CreateFrame("Button", `AbilityFrame${name}`, listContent)
    abilityFrame.SetID(spell)
    abilityFrame.SetPoint("TOPLEFT", listContent, "TOPLEFT", (column * 110) + 20, -row * 128)
    abilityFrame.SetSize(64, 64)
    abilityFrame.RegisterForDrag("LeftButton")
    abilityFrame.SetBackdrop({
        bgFile: icon,
        edgeFile: "Interface\\Tooltips\\UI-Tooltip-Border",
        tile: false,
        tileSize: 0,
        edgeSize: 12,
        insets: { left: 3, right: 3, top: 3, bottom: 3 }
    })
    abilityFrame.SetScript("OnClick", () => {
        selectAbility(ability)
    })
    abilityFrame.SetScript("OnDragStart", () => {
        PickupSpell(name)
    })

    // Do we want a tooltip? //
    /**
    abilityFrame.SetScript("OnEnter", () => {
        GameTooltip.SetOwner(abilityFrame, "ANCHOR_RIGHT")
        GameTooltip.SetHyperlink(`spell:${spell}`)
        GameTooltip.SetSpellByID(spell)
    })
    abilityFrame.SetScript("OnLeave", () => {
        GameTooltip.SetOwner(UIParent, "ANCHOR_NONE")
    })
    */

    let abilityName = spellFrame.CreateFontString("AbilityName", "OVERLAY")
    abilityName.SetPoint("CENTER", abilityFrame, "BOTTOM", 0, -20)
    abilityName.SetFont("Fonts\\FRIZQT__.TTF", 16, "OUTLINE")
    abilityName.SetWidth(100)
    abilityName.SetText(name)
    abilityName.SetTextColor(1, 0.82, 0)
    abilityName.SetWordWrap(true)
    abilityName.SetParent(abilityFrame)

    if (column == 5) {
        column = 0
        row++
    } else {
        column++
    }

    return abilityFrame
}

function selectAbility(ability: Ability) {
    let name = ability.getName()
    let desc = ability.getDesc()
    let icon = ability.getIcon()
    let spell = ability.getSpell()

    selectedAbilityName.SetText(name)
    selectedAbilityName.Show()
    selectedAbilityDesc.SetText(desc)
    selectedAbilityDesc.Show()
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

    if (count == limit) {
        abilityButton.Disable()
    }

    SendAddonMessage('abilitySelected', `${spell}`, 'WHISPER', GetUnitName("player", false))
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

    selectedAbilityDesc.SetPoint("LEFT", infoFrame, "LEFT", 100, -50)
    selectedAbilityDesc.SetFont("Fonts\\FRIZQT__.TTF", 16, "0")
    selectedAbilityDesc.SetWidth(400)
    selectedAbilityDesc.SetHeight(300)
    selectedAbilityDesc.SetTextColor(1, 0.82, 0)
    selectedAbilityDesc.SetJustifyH("LEFT")
    selectedAbilityDesc.SetWordWrap(true)
    selectedAbilityDesc.Hide()

    abilityButton.SetSize(100, 35)
    abilityButton.SetPoint("RIGHT", infoFrame, "RIGHT", -125, 10)
    abilityButton.SetText("Learn")
    abilityButton.Hide()

    countText.SetPoint("RIGHT", infoFrame, "RIGHT", 125, -40)
    countText.SetFont("Fonts\\FRIZQT__.TTF", 16, "OUTLINE")
    countText.SetWidth(600)
    countText.SetTextColor(1, 0.82, 0)
    countText.Hide()

    let searchBox = CreateFrame("EditBox", "SearchBox", listContent, "InputBoxTemplate")
    searchBox.SetSize(200, 32)
    searchBox.SetPoint("BOTTOM", 0, 0)
    searchBox.SetAutoFocus(false)
    searchBox.SetScript("OnTextChanged", () => {
        let keyword = searchBox.GetText().toLowerCase()
        filteredAbilities = abilities.filter((ability) =>
            ability.GetName().replace("AbilityFrame", "").toLowerCase().includes(keyword)
        )

        filter()
    })

    let searchTitle = searchBox.CreateFontString("SearchTitle", "OVERLAY")
    searchTitle.SetPoint("LEFT", searchBox, "LEFT", 0, 20)
    searchTitle.SetFont("Fonts\\FRIZQT__.TTF", 14, "OUTLINE")
    searchTitle.SetWidth(600)
    searchTitle.SetJustifyH("LEFT")
    searchTitle.SetText("Search Abilities")

    let clearButton = CreateFrame("Button", "ClearButton", searchBox, "UIPanelButtonTemplate")
    clearButton.SetSize(20, 22)
    clearButton.SetPoint("LEFT", searchBox, "RIGHT", -4, 1)
    clearButton.SetText("X")
    clearButton.SetScript("OnClick", () => {
        searchBox.SetText("")
        searchBox.ClearFocus()
        filteredAbilities = abilities

        filter()
    })
}

function filter() {
    column = 0
    row = 0

    abilities.forEach((frame) => {
        frame.Hide()
        filteredAbilities.forEach(filtered => {
            if (filtered.GetID() == frame.GetID()) {
                frame.Show()
                frame.SetPoint("TOPLEFT", listContent, "TOPLEFT", (column * 110) + 20, -row * 128)
                if (column == 5) {
                    column = 0
                    row++
                } else {
                    column++
                }
            }
        })
    })
}

abilityButton.SetScript("OnClick", () => {
    SendAddonMessage("abilityState", `${currentAbility.getSpell()}`, "WHISPER", GetUnitName("player", false))
})
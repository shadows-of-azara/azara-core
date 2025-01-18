let abilityFrame = CreateFrame("Frame", "Abilites", UIParent)

export function Abilities() {
    createFrame()
}

function createFrame() {
    abilityFrame.SetSize(800, 500)
    abilityFrame.SetPoint("CENTER")
    abilityFrame.SetBackdrop({
        bgFile: "Interface\\AchievementFrame\\UI-Achievement-AchievementBackground",
        edgeFile: "Interface\\Tooltips\\ChatBubble-Backdrop",
        tile: false,
        tileSize: 0,
        edgeSize: 8,
        insets: { left: 4, right: 4, top: 4, bottom: 4 }
    })
    abilityFrame.SetBackdropColor(1, 1, 1, 1)

    let infoFrame = CreateFrame("Frame", "AbilityInfo", abilityFrame)

    infoFrame.SetSize(800, 200)
    infoFrame.SetPoint("TOP")
    infoFrame.SetBackdrop({
        bgFile: "Interface\\RAIDFRAME\\UI-RaidFrame-GroupBg",
        tile: false,
        tileSize: 0,
        insets: { left: 0, right: 0, top: 0, bottom: 0 }
    })
    infoFrame.SetBackdropColor(1, 1, 1, 0.5)

    let listFrame = CreateFrame("Frame", "AbilityList", abilityFrame)

    listFrame.SetSize(800, 300)
    listFrame.SetPoint("BOTTOM", 15, 0)
    listFrame.SetBackdrop({
        bgFile: "Interface\\RAIDFRAME\\UI-RaidFrame-GroupBg",
        tile: false,
        tileSize: 0,
        insets: { left: 0, right: 0, top: 0, bottom: 0 }
    })
    listFrame.SetBackdropColor(1, 1, 1, 0)

    let row = 0
    let column = 0

    let createAbility = function (name, icon) {
        let ability = CreateFrame("Frame", "AbilityCard", listFrame)
        ability.SetSize(128, 128)
        ability.SetPoint("TOPLEFT", listFrame, "TOPLEFT", column * 100, -row * 135)


        let abilityName = ability.CreateFontString("AbilityName", "OVERLAY")
        abilityName.SetPoint("CENTER", ability, "BOTTOM", 0, -20)
        abilityName.SetFont("Fonts\\FRIZQT__.TTF", 16, "OUTLINE")
        abilityName.SetWidth(120)
        abilityName.SetText(name)
        abilityName.SetTextColor(1, 0.82, 0)

        let abilityIcon = CreateFrame("Frame", "AbilityIcon", ability)
        ability.SetSize(64, 64)
        ability.SetPoint("TOP")
        ability.SetBackdrop({
            bgFile: `Interface\\ICONS\\${icon}`,
            edgeFile: "Interface\\Tooltips\\UI-Tooltip-Border",
            tile: false,
            tileSize: 0,
            edgeSize: 12,
            insets: { left: 3, right: 3, top: 3, bottom: 3 }
        })

        if (column == 7) {
            column = 0
            row++
        } else {
            column++
        }

        console.log("Row: " + row)
        console.log("Column: " + column)
    }
    

    createAbility("Fireball", "spell_fire_flamebolt")
    createAbility("Frostbolt", "spell_frost_frostbolt02")
    createAbility("Arcane Missiles", "spell_nature_starfall")
    createAbility("Ice Lance", "spell_frost_frostblast")
    createAbility("Pyroblast", "spell_fire_fireball02")
    createAbility("Blink", "spell_arcane_blink")
    createAbility("Fireball", "spell_fire_flamebolt")
    createAbility("Frostbolt", "spell_frost_frostbolt02")
    createAbility("Arcane Missiles", "spell_nature_starfall")
    createAbility("Ice Lance", "spell_frost_frostblast")
    createAbility("Pyroblast", "spell_fire_fireball02")
    createAbility("Blink", "spell_arcane_blink")
    createAbility("Fireball", "spell_fire_flamebolt")
    createAbility("Frostbolt", "spell_frost_frostbolt02")
    createAbility("Arcane Missiles", "spell_nature_starfall")
    
}
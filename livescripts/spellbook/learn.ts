import { Spellbook } from "./table"

export function Learn(events: TSEvents) {
    // When a player starts learning a new ability
    events.Spell.OnCheckCast(TAG("azara-core", "LEARN_ABILITY"), (spell, result) => {
        const player = ToPlayer(spell.GetCaster())
        const ability = GetSpellInfo(spell.GetSpellInfo().GetEffect(0).GetMiscValue())
        const category = spell.GetSpellInfo().GetEffect(1).GetMiscValue()
        const skillCost = spell.GetSpellInfo().GetEffect(1).GetMiscValueB()

        if (!player) {
            return
        }

        if (!ability) {
            return
        }

        // Check if player has learned the category
        if (player.HasSkill(category)) {
            // Check if player is high enough skill
            if (player.GetSkillValue(category) >= skillCost) {
                // Check if player already has the ability
                if (Spellbook.HasAbility(player, ability.GetEntry())) {
                    // Already learned
                    result.set(SpellCastResult.FAILED_LEARNED)
                } else {
                    return
                }
            } else {
                // Player isn't high enough skill
                result.set(SpellCastResult.FAILED_CUSTOM_ERROR)
                player.SendAreaTriggerMessage(`|cffff0000Your skill level in that ability category is not high enough.|r`)
            }
        } else {
            // Player hasn't learned the category
            result.set(SpellCastResult.FAILED_CUSTOM_ERROR)
            player.SendAreaTriggerMessage("|cffff0000You have not learned how to use these types of abilities|r")
        }
    })

    // When a player learns a new ability
    events.Spell.OnAfterCast(TAG("azara-core", "LEARN_ABILITY"), spell => {
        const player = ToPlayer(spell.GetCaster())
        const ability = GetSpellInfo(spell.GetSpellInfo().GetEffect(0).GetMiscValue())
        const category = spell.GetSpellInfo().GetEffect(1).GetMiscValue()
        const skillCost = spell.GetSpellInfo().GetEffect(1).GetMiscValueB()

        if (!player) {
            return
        }

        if (!ability) {
            return
        }

        // Check if player has learned the category
        if (player.HasSkill(category)) {
            // Check if player is high enough skill
            if (player.GetSkillValue(category) >= skillCost) {
                // Check if player already has the ability
                if (!Spellbook.HasAbility(player, ability.GetEntry())) {
                    // Teach the player the ability
                    Spellbook.Learn(player, ability.GetEntry())
                    player.SendAddonMessage("abilityLearned", `${ability.GetEntry()}`, 0, player)
                } else {
                    return
                }
            } else {
                return
            }
        } else {
            return
        }
    })
}
import { Spellbook } from "./table"

export function Learn(events: TSEvents) {
    // When a player starts learning a new ability
    events.Spell.OnCheckCast(TAG("azara-core", "LEARN_ABILITY"), (spell, result) => {
        const player = ToPlayer(spell.GetCaster())

        if (!player) {
            return
        }

        let ability = spell.GetSpellInfo().GetEffect(0).GetMiscValue()

        // Check if player already has the ability
        if (Spellbook.HasAbility(player, ability)) {
            // Already learned
            result.set(SpellCastResult.FAILED_LEARNED)
        } else {
            return
        }
    })

    // When a player learns a new ability
    events.Spell.OnAfterCast(TAG("azara-core", "LEARN_ABILITY"), spell => {
        const player = ToPlayer(spell.GetCaster())

        if (!player) {
            return
        }

        let ability = spell.GetSpellInfo().GetEffect(0).GetMiscValue()

        // Check if player already has the ability
        if (!Spellbook.HasAbility(player, ability)) {
            // Teach the player the ability
            Spellbook.Learn(player, ability)

            player.SendAddonMessage("abilityLearned", `${ability}`, 0, player)
        } else {
            return
        }
    })
}
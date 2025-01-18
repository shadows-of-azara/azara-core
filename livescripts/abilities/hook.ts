import { Learned_Abilities } from "./learned-abilities"

export function AbilityHook(events: TSEvents) {
    events.Spell.OnAfterCast(TAG('magic-core', 'LEARN_ABILITY'), (spell) => {
        const player = ToPlayer(spell.GetCaster())
        if (!player) {
            return
        }

        let ability = spell.GetSpellInfo().GetEffect(0).GetMiscValue()

        if(!Learned_Abilities.HasAbility(player, ability)) {
            Learned_Abilities.Learn(player, ability)
        }
    })
}
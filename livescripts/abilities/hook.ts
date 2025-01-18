import { LearnedAbilities } from "./learned-abilities"

export function AbilityHook(events: TSEvents) {
    events.Spell.OnAfterCast(TAG('magic-core', 'LEARN_ABILITY'), (spell) => {
        const player = ToPlayer(spell.GetCaster())
        if (!player) {
            return
        }

        let ability = spell.GetSpellInfo().GetEffect(0).GetMiscValue()

        if(!LearnedAbilities.HasAbility(player, ability)) {
            LearnedAbilities.Learn(player, ability)
        }
    })
}
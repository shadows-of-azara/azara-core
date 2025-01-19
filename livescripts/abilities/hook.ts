import { ABILITY_PACKET } from "../../shared/packets/implementations/abilities"
import { Learned_Abilities } from "./learned-abilities"

export function AbilityHook(events: TSEvents) {
    events.Spell.OnAfterCast(TAG('azara-core', 'LEARN_ABILITY'), (spell) => {
        const player = ToPlayer(spell.GetCaster())
        if (!player) {
            return
        }

        let ability = spell.GetSpellInfo().GetEffect(0).GetMiscValue()

        Learned_Abilities.Learn(player, ability)

        let packet = new ABILITY_PACKET();
        packet.setSpell(ability)
        packet.Write().SendToPlayer(player)
    })
}
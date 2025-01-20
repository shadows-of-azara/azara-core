import { SPELLBOOK_PACKET } from "../../shared/packets/implementations/spellbook"
import { Spellbook } from "./table"

export function Learn(events: TSEvents) {
    // When a player learns a new ability
    events.Spell.OnAfterCast(TAG("azara-core", "LEARN_SPELL"), spell => {
        const player = ToPlayer(spell.GetCaster())

        if (!player) {
            return
        }

        let spellID = spell.GetSpellInfo().GetEffect(0).GetMiscValue()

        Spellbook.Learn(player, spellID)

        let packet = new SPELLBOOK_PACKET()
        packet.setSpell(spellID)
        packet.Write().SendToPlayer(player)
    })
}
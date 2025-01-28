import { SPELLBOOK_PACKET } from "../../shared/packets/spellbook"
import { Spellbook } from "./table"

let limit: uint8 = 6

export function Packets(events: TSEvents) {
    // When a player logs in
    events.Player.OnLogin(player => {
        if (!player) {
            return
        }

        loadAbilities(player)
    })

    events.Player.OnWhisper((sender, player, message) => {
        function update(ability: uint32) {
            player.SendAddonMessage("abilityStatus", `${Spellbook.IsActive(player, ability)}`, 0, player)
            player.SendAddonMessage("abilityCount", `${Spellbook.GetActiveCount(player)}`, 0, player)
        }

        // When the UI is reloaded
        if (sender == player && message.get().startsWith("reloaded")) {
            loadAbilities(player)
        }

        // When an ability is selected in the spellbook
        if (sender == player && message.get().startsWith("abilitySelected")) {
            let ability = parseInt(message.get().replace("abilitySelected	", ""))

            update(ability)
        }

        // When an ability is learned or unlearned
        if (sender == player && message.get().startsWith("abilityState")) {
            let ability = parseInt(message.get().replace("abilityState	", ""))
            let count = Spellbook.GetActiveCount(player)

            if (count < limit) {
                // Player has slots remaining
                if (!Spellbook.IsActive(player, ability)) {
                    Spellbook.ActivateAbility(player, ability)
                    player.LearnSpell(ability)
                } else {
                    Spellbook.DeactivateAbility(player, ability)
                    player.RemoveSpell(ability, false, false)
                }
            } else {
                Spellbook.DeactivateAbility(player, ability)
                player.RemoveSpell(ability, false, false)
            }

            update(ability)
        }
    })
}

function loadAbilities(player: TSPlayer) {
    const query = QueryCharacters(`SELECT player, ability, active FROM spellbook WHERE player = ${player.GetGUID()}`)

    let abilities: TSArray<uint32> = []
    let count = Spellbook.GetActiveCount(player)

    while (query.GetRow()) {
        abilities.push(query.GetUInt32(1))
    }

    if (abilities.length > 0) {
        let packet = new SPELLBOOK_PACKET()
        packet.setAbilities(abilities)
        packet.setCount(count)
        packet.Write().SendToPlayer(player)
    }
}
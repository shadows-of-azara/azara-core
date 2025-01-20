import { SPELLBOOK } from "../../shared/packets/definitions"
import { SPELLBOOK_DYNAMIC_PACKET, SPELLBOOK_PACKET } from "../../shared/packets/spellbook"
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
        // When the UI is reloaded
        if (sender == player && message.get().startsWith('reloaded')) {
            loadAbilities(player)
        }

        // When an ability is selected in the spellbook
        if (sender == player && message.get().startsWith('selected')) {
            let ability = parseInt(message.get().replace("selected	", ""))

            let packet = new SPELLBOOK_DYNAMIC_PACKET()
            packet.setStatus(Spellbook.IsActive(player, ability))
            packet.setCount(Spellbook.GetActiveCount(player))
            packet.Write().SendToPlayer(player)
        }
    })

    // When an ability is learned or unlearned
    events.CustomPacket.OnReceive(SPELLBOOK, (opcode, packet, player) => {
        if (!player) {
            return
        }

        let count = Spellbook.GetActiveCount(player)

        let parsed = new SPELLBOOK_PACKET()
        parsed.Read(packet)
        let ability = parsed.getAbility()

        let packetDynamic = new SPELLBOOK_DYNAMIC_PACKET()

        let update = function () {
            let count = Spellbook.GetActiveCount(player)

            packetDynamic.setCount(count)
            packetDynamic.setStatus(Spellbook.IsActive(player, ability))
            packetDynamic.Write().SendToPlayer(player)
        }

        if (count < limit) {
            // Player has slots remaining
            if (!Spellbook.IsActive(player, ability)) {
                Spellbook.ActivateAbility(player, ability)
                player.LearnSpell(ability)

                update()
            } else {
                Spellbook.DeactivateAbility(player, ability)
                player.RemoveSpell(ability, false, false)

                update()
            }
        } else {
            Spellbook.DeactivateAbility(player, ability)
            player.RemoveSpell(ability, false, false)

            update()
        }
    })
}

function loadAbilities(player: TSPlayer) {
    let abilities: TSArray<uint32> = []

    const res = QueryCharacters(`SELECT player, ability, active FROM spellbook WHERE player = ${player.GetGUID()}`)

    while (res.GetRow()) {
        abilities.push(res.GetUInt32(1))
    }

    if (abilities.length > 0) {
        abilities.forEach(ability => {
            let packet = new SPELLBOOK_PACKET()
            packet.setAbility(ability)
            packet.setCount(Spellbook.GetActiveCount(player))
            packet.Write().SendToPlayer(player)
        })

        let packetDynamic = new SPELLBOOK_DYNAMIC_PACKET()
        let count = Spellbook.GetActiveCount(player)

        packetDynamic.setCount(count)
        packetDynamic.Write().SendToPlayer(player)
    }
}
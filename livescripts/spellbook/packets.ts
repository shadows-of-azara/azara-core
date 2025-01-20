import { SPELLBOOK } from "../../shared/packets/definitions"
import { SPELLBOOK_DYNAMIC_PACKET, SPELLBOOK_PACKET } from "../../shared/packets/implementations/spellbook"
import { Spellbook } from "./table"

export function Packets(events: TSEvents) {
    // When a player logs in
    events.Player.OnLogin(player => {
        if (!player) {
            return
        }

        loadSpells(player)
    })

    events.Player.OnWhisper((sender, player, message) => {
        // When the UI is reloaded
        if (sender == player && message.get().startsWith('reloaded')) {
            loadSpells(player)
        }

        // When an ability is selected in the spellbook
        if (sender == player && message.get().startsWith('selected')) {
            let spell = parseInt(message.get().replace("selected	", ""))

            let packet = new SPELLBOOK_DYNAMIC_PACKET()
            packet.setStatus(Spellbook.HasSpell(player, spell))
            packet.setCount(Spellbook.ActiveCount(player))
            packet.Write().SendToPlayer(player)
        }
    })

    // When an ability is learned or unlearned
    events.CustomPacket.OnReceive(SPELLBOOK, (opcode, packet, player) => {
        if (!player) {
            return
        }

        let count = Spellbook.ActiveCount(player)

        let parsed = new SPELLBOOK_PACKET()
        parsed.Read(packet)
        let spell = parsed.getSpell()

        let packetDynamic = new SPELLBOOK_DYNAMIC_PACKET()

        let update = function () {
            let count = Spellbook.ActiveCount(player)

            packetDynamic.setCount(count)
            packetDynamic.setStatus(Spellbook.HasSpell(player, spell))
            packetDynamic.Write().SendToPlayer(player)
        }

        if (count < 6) {
            // Player has slots remaining
            if (!Spellbook.HasSpell(player, spell)) {
                Spellbook.Activate(player, spell)
                player.LearnSpell(spell)

                update()
            } else {
                Spellbook.Deactivate(player, spell)
                player.RemoveSpell(spell, false, false)

                update()
            }
        } else {
            Spellbook.Deactivate(player, spell)
            player.RemoveSpell(spell, false, false)

            update()
        }
    })
}

function loadSpells(player: TSPlayer) {
    let spells: TSArray<uint32> = []

    const res = QueryCharacters(`SELECT player, spell, active FROM spellbook WHERE player = ${player.GetGUID()}`)

    while (res.GetRow()) {
        spells.push(res.GetUInt32(1))
    }

    if (spells.length > 0) {
        spells.forEach(spell => {
            let packet = new SPELLBOOK_PACKET()
            packet.setSpell(spell)
            packet.setCount(Spellbook.ActiveCount(player))
            packet.Write().SendToPlayer(player)
        })

        let packetDynamic = new SPELLBOOK_DYNAMIC_PACKET()
        let count = Spellbook.ActiveCount(player)

        packetDynamic.setCount(count)
        packetDynamic.Write().SendToPlayer(player)
    }
}
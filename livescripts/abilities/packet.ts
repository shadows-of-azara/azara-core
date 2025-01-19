import { ABILITIES } from "../../shared/packets/definitions";
import { ABILITY_PACKET } from "../../shared/packets/implementations/abilities"
import { Learned_Abilities } from "./learned-abilities";

export function AbilityPackets(events: TSEvents) {
    events.Player.OnLogin((player) => {
        if (!player) {
            return
        }

        let spells: TSArray<uint32> = [];

        const res = QueryCharacters(`SELECT player, spell, active FROM learned_abilities WHERE player = ${player.GetGUID()}`);

        while (res.GetRow()) {
            spells.push(res.GetUInt32(1))
        }

        if (spells.length > 0) {
            spells.forEach((spell) => {
                let packet = new ABILITY_PACKET();
                packet.setSpell(spell)
                packet.Write().SendToPlayer(player)
            })
        }
    })

    events.Player.OnWhisper((sender, receiver, message, type, lang) => {
        if (sender == receiver && message.get().startsWith('reloaded')) {
            let spells: TSArray<uint32> = [];

            const res = QueryCharacters(`SELECT player, spell, active FROM learned_abilities WHERE player = ${receiver.GetGUID()}`);

            while (res.GetRow()) {
                spells.push(res.GetUInt32(1))
            }

            if (spells.length > 0) {
                spells.forEach((spell) => {
                    let packet = new ABILITY_PACKET();
                    packet.setSpell(spell)
                    packet.Write().SendToPlayer(receiver)
                })
            }
        }
    });

    events.CustomPacket.OnReceive(ABILITIES, (opcode, packet, player) => {
        if (!player) {
            return
        }

        let parsed = new ABILITY_PACKET();
        parsed.Read(packet)
        let spell = parsed.getSpell()

        if (!Learned_Abilities.HasAbility(player, spell)) {
            Learned_Abilities.Activate(player, spell)
        } else {
            Learned_Abilities.Deactivate(player, spell)
        }
    })
}
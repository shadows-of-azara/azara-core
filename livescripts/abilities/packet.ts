import { ABILITIES } from "../../shared/packets/definitions";
import { ABILITY_DYNAMIC, ABILITY_PACKET } from "../../shared/packets/implementations/abilities"
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
                packet.setActiveCount(Learned_Abilities.ActiveCount(player))
                packet.Write().SendToPlayer(player)
            })

            let ability_dynamic = new ABILITY_DYNAMIC()
            let count = Learned_Abilities.ActiveCount(player)

            ability_dynamic.setCount(count)
            ability_dynamic.Write().SendToPlayer(player)
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
                    packet.setActiveCount(Learned_Abilities.ActiveCount(receiver))
                    packet.Write().SendToPlayer(receiver)
                })

                let ability_dynamic = new ABILITY_DYNAMIC()
                let count = Learned_Abilities.ActiveCount(receiver)

                ability_dynamic.setCount(count)
                ability_dynamic.Write().SendToPlayer(receiver)
            }
        }

        if (sender == receiver && message.get().startsWith('selected')) {
            let spell = parseInt(message.get().replace("selected	", ""))

            let packet = new ABILITY_DYNAMIC();
            packet.setStatus(Learned_Abilities.HasAbility(receiver, spell))
            packet.setCount(Learned_Abilities.ActiveCount(receiver))
            packet.Write().SendToPlayer(receiver)
        }
    });

    events.CustomPacket.OnReceive(ABILITIES, (opcode, packet, player) => {
        if (!player) {
            return
        }

        let count = Learned_Abilities.ActiveCount(player)

        let parsed = new ABILITY_PACKET();
        parsed.Read(packet)
        let spell = parsed.getSpell()

        let ability_dynamic = new ABILITY_DYNAMIC()

        if (count < 1) {
            if (!Learned_Abilities.HasAbility(player, spell)) {
                Learned_Abilities.Activate(player, spell)
                player.LearnSpell(spell)

                let count = Learned_Abilities.ActiveCount(player)

                ability_dynamic.setCount(count)
                ability_dynamic.setStatus(Learned_Abilities.HasAbility(player, spell))
                ability_dynamic.Write().SendToPlayer(player)

            }

        } else {
            Learned_Abilities.Deactivate(player, spell)
            player.RemoveSpell(spell, false, false)

            let count = Learned_Abilities.ActiveCount(player)

            ability_dynamic.setCount(count)
            ability_dynamic.setStatus(Learned_Abilities.HasAbility(player, spell))
            ability_dynamic.Write().SendToPlayer(player)

        }
    })
}
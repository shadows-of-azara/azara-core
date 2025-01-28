import { SPELLBOOK } from "./definitions"

export class SPELLBOOK_PACKET {
    private abilities: TSArray<uint32> = []
    private count: uint32 = 0

    getAbilities(): TSArray<uint32> { return this.abilities }

    setAbilities(abilities: TSArray<uint32>) {
        this.abilities = abilities
    }

    getCount(): uint32 { return this.count }

    setCount(count: uint32) {
        this.count = count
    }

    Read(packet: TSPacketRead) {
        this.count = packet.ReadUInt32()
        let size = packet.ReadUInt32()

        for (let i = 0; i < size; i++) {
            this.abilities.push(packet.ReadUInt32())
        }
    }

    Write(): TSPacketWrite {
        let packet = CreateCustomPacket(SPELLBOOK, 0)

        packet.WriteUInt32(this.count)
        packet.WriteUInt32(this.abilities.length)

        this.abilities.forEach(ability => {
            packet.WriteUInt32(ability)
        })

        return packet
    }
}
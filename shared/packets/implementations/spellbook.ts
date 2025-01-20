import { SPELLBOOK, SPELLBOOK_DYNAMIC } from "../definitions"

export class SPELLBOOK_PACKET {
    private spell: uint32 = 0
    private count: uint32 = 0

    getSpell(): uint32 { return this.spell }

    setSpell(spell: uint32) {
        this.spell = spell
    }

    setCount(count: uint32) {
        this.count = count
    }

    Read(packet: TSPacketRead) {
        this.spell = packet.ReadUInt32()
        this.count = packet.ReadUInt32()
    }

    Write(): TSPacketWrite {
        let packet = CreateCustomPacket(SPELLBOOK, 0)
        packet.WriteUInt32(this.spell)
        packet.WriteUInt32(this.count)
        return packet
    }
}

export class SPELLBOOK_DYNAMIC_PACKET {
    private count: uint32 = 0
    private status: uint32 = 0

    getCount(): uint32 { return this.count }

    setCount(count: uint32) { this.count = count }

    getStatus(): uint32 { return this.status }

    setStatus(status: uint32) { this.status = status }

    Read(packet: TSPacketRead) {
        this.count = packet.ReadUInt32()
        this.status = packet.ReadUInt32()
    }

    Write(): TSPacketWrite {
        let packet = CreateCustomPacket(SPELLBOOK_DYNAMIC, 0)
        packet.WriteUInt32(this.count)
        packet.WriteUInt32(this.status)
        return packet
    }
}
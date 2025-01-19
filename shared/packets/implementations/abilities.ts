import { ABILITIES, ABILITIES_DYNAMIC } from "../definitions";

export class ABILITY_PACKET {
    private spell: uint32 = 0;
    private count: uint32 = 0;

    constructor() { }

    setSpell(ability: uint32) {
        this.spell = ability;
    }

    getSpell(): uint32 { return this.spell; }

    setActiveCount(count: uint32) {
        this.count = count;
    }

    getActiveCount(): uint32 { return this.count; }

    Read(packet: TSPacketRead) {
        this.spell = packet.ReadUInt32();
        this.count = packet.ReadUInt32();
    }

    Write(): TSPacketWrite {
        let packet = CreateCustomPacket(ABILITIES, 0);
        packet.WriteUInt32(this.spell)
        packet.WriteUInt32(this.count)
        return packet
    }
}

export class ABILITY_DYNAMIC {
    private count: uint32 = 0;
    private active: uint32 = 0;

    constructor() { }

    setCount(count: uint32) { this.count = count }

    setStatus(active: uint32) { this.active = active }

    getCount(): uint32 { return this.count }

    getStatus(): uint32 { return this.active }

    Read(packet: TSPacketRead) {
        this.count = packet.ReadUInt32();
        this.active = packet.ReadUInt32();
    }

    Write(): TSPacketWrite {
        let packet = CreateCustomPacket(ABILITIES_DYNAMIC, 0);
        packet.WriteUInt32(this.count)
        packet.WriteUInt32(this.active)
        return packet
    }
}
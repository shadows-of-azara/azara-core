import { ABILITIES } from "../definitions";

export class ABILITY_PACKET {
    private spell: uint32 = 0;

    constructor() {}

    setSpell(ability: uint32) {
        this.spell = ability;
    }

    getSpell(): uint32 { return this.spell; }

    Read(packet: TSPacketRead) {
        this.spell = packet.ReadUInt32();
    }

    Write(): TSPacketWrite {
        let packet = CreateCustomPacket(ABILITIES, 0);
        packet.WriteUInt32(this.spell)
        return packet
    }
}
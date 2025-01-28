export class Ability {
    private name: string;
    private desc: string;
    private icon: string;
    private spell: uint32;

    getName(): string { return this.name }

    setName(name: string) {
        this.name = name
    }

    getDesc(): string { return this.desc }

    setDesc(desc: string) {
        this.desc = desc
    }

    getIcon(): string { return this.icon }

    setIcon(icon: string) {
        this.icon = icon
    }

    getSpell(): uint32 { return this.spell }

    setSpell(spell: uint32) {
        this.spell = spell
    }
}
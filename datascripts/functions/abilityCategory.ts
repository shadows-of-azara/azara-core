import { DBC, std } from "wow/wotlk";
import { SkillLine } from "wow/wotlk/std/SkillLines/SkillLine";
import { Spell } from "wow/wotlk/std/Spell/Spell";
import { PLAYER_CLASS } from "./playerClass";
import { Ids } from "wow/wotlk/std/Misc/Ids";

export class Category {
    private name: string
    private desc: string
    private icon: string
    private learnOnCreate?: boolean

    private skill: SkillLine
    private spell: Spell

    constructor(name: string, desc: string, icon: string, learnOnCreate?: boolean) {
        this.name = name
        this.desc = desc
        this.icon = icon
        this.skill = this.createSkill(name, desc, icon)
        this.spell = this.createSpell(name, icon)

        if (learnOnCreate) this.enableSkill()
    }

    private createSkill(name: string, desc: string, icon: string) {
        const SKILL = std.SkillLines.create("azara-core", `${name.replace(/[:\s]+/g, '-').toLowerCase()}-skill`)
            .Name.enGB.set(name)
            .Description.enGB.set(desc)
            .Icon.setPath(icon)
            .Category.CLASS.set()

        return SKILL
    }

    private createSpell(name: string, icon: string) {
        const SPELL = std.Spells.create("azara-core", `${name.replace(/[:\s]+/g, '-').toLowerCase()}-spell`)
            .Name.enGB.set(name)
            .Icon.setPath(icon)
            .Range.set(1)
            .Effects.addMod(eff => eff
                .Type.WEAPON.set()
            )
            .Effects.addMod(eff => eff
                .Type.PROFICIENCY.set()
            )
            .Attributes.IS_PASSIVE.set(true)
            .Attributes.IS_HIDDEN_IN_SPELLBOOK.set(true)

        DBC.SkillLineAbility.add(Ids.SkillLineAbility.id())
            .SkillLine.set(this.skill.ID)
            .Spell.set(SPELL.ID)
            .AcquireMethod.set(2)

        DBC.SkillRaceClassInfo.add(Ids.SkillRaceClassInfo.id())
            .SkillID.set(this.skill.ID)
            .RaceMask.set(13)
            .ClassMask.set(PLAYER_CLASS.Mask)
            .Flags.set(128)

        return SPELL
    }

    private enableSkill() {
        this.skill.enableAutolearn(PLAYER_CLASS.Mask)
        this.spell.AutoLearn.add(1, PLAYER_CLASS.Mask)

        return this
    }

    GetSkill(): number { return this.skill.ID }

    GetSpell(): number { return this.spell.ID }

}

export const AbilityCategory = {
    One_Handed: new Category(
        "One Handed",
        "Weapons that can be wielded in one hand, allowing for greater versatility and the use of a shield or a second weapon. These weapons are often faster and rely on consistent attacks.",
        "inv_sword_04",
        true
    ),

    Two_Handed: new Category(
        "Two Handed",
        "Powerful weapons requiring both hands to wield, offering high damage per strike. They are slower but deliver devastating blows in combat.",
        "inv_axe_09"
    ),

    Abjuration: new Category(
        "Abjuration",
        "A school of magic focused on protective spells, shielding allies, and negating harmful effects. Essential for defense and survivability in combat.",
        "spell_holy_devotionaura"
    ),

    Air: new Category(
        "Air",
        "Spells and abilities harnessing the power of wind and storms, often used for mobility, shock damage, and disruption. Air magic is unpredictable but swift.",
        "spell_nature_cyclone"
    ),

    Conjuration: new Category(
        "Conjuration",
        "Magic specializing in summoning creatures, objects, and energy constructs. Conjurers bring forth allies and resources to aid in battle.",
        "spell_arcane_portalstormwind"
    ),

    Earth: new Category(
        "Earth",
        "Abilities related to the stability and resilience of the land, often focusing on defense, endurance, and seismic attacks. Earth magic is strong and enduring.",
        "spell_nature_strengthofearthtotem02"
    ),

    Evocation: new Category(
        "Evocation",
        "A school of magic dedicated to raw energy manipulation, creating powerful bursts of elemental force. Evokers unleash destructive fire, ice, and arcane power.",
        "spell_fire_fireball02"
    ),

    Fire: new Category(
        "Fire",
        "The magic of flames and combustion, dealing intense damage over time and in bursts. Fire-based abilities are aggressive and relentless in battle.",
        "spell_fire_flamebolt"
    ),

    Necromancy: new Category(
        "Necromancy",
        "Dark magic that manipulates life and death, often used to summon undead minions or drain the life force of enemies. Necromancers wield forbidden knowledge.",
        "spell_shadow_requiem"
    ),

    Ranged: new Category(
        "Ranged",
        "Weapons and abilities designed for long-distance combat, including bows, guns, and magical projectiles. Ranged attacks allow for strategic positioning and precision.",
        "inv_weapon_bow_07"
    ),

    Shield: new Category(
        "Shield",
        "Defensive equipment used to block attacks and protect the wearer. Shields are crucial for tanking and reducing incoming damage in battle.",
        "inv_shield_06"
    ),

    Water: new Category(
        "Water",
        "Magic harnessing the power of water for healing, control, and freezing enemies. Water spells provide adaptability and sustain in combat.",
        "spell_frost_frostbolt02"
    ),

}

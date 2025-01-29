import { MaskCon } from "wow/data/cell/cells/MaskCell";
import { std } from "wow/wotlk";
import { RaceMask } from "wow/wotlk/std/Race/RaceType";
import { SkillLine } from "wow/wotlk/std/SkillLines/SkillLine";
import { Spell } from "wow/wotlk/std/Spell/Spell";
import { PLAYER_CLASS } from "./playerClass";

class Category {
    private name: string
    private desc: string
    private icon: string
    private spell: Spell

    skill: SkillLine

    constructor(name: string, desc: string, icon: string,) {
        this.name = name
        this.desc = desc
        this.icon = icon
        this.spell = this.createSpell(name, icon)
        this.skill = this.createSkill(name, desc, icon)

        this.enableSkill()
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
                .Type.PROFICIENCY.set()
            )
            .Attributes.set(["IS_PASSIVE", "IS_HIDDEN_IN_SPELLBOOK"])

        return SPELL
    }

    private enableSkill() {
        this.skill.enableAutolearn(PLAYER_CLASS.Mask)
        this.spell.AutoLearn.add(1, PLAYER_CLASS.Mask)
    }

    GetID(): uint32 { return this.skill.ID }
}

export enum AbilityCategory {
    BASIC_ATTACK = new Category(
        "Basic Attack",
        "These are your fundamental attacks, used frequently in combat. They typically require little to no cooldown and serve as the foundation of your damage output.",
        "ability_meleedamage"
    ).GetID(),

    HEAVY_ATTACK = new Category(
        "Heavy Attack",
        "Powerful, high-impact attacks that deal significantly more damage than basic attacks. They often have a longer wind-up time or cooldown but are useful for breaking through enemy defenses.",
        "trade_engineering"
    ).GetID(),

    DAMAGE_OVER_TIME = new Category(
        "Damage Over Time",
        "These abilities inflict sustained damage over a period, making them effective for prolonged engagements. They are useful for whittling down enemies or applying pressure in combat.",
        "spell_shadow_abominationexplosion"
    ).GetID(),

    COOLDOWN = new Category(
        "Cooldown",
        "Abilities in this category have a longer recharge time but offer significant effects. They are often used strategically to maximize damage, survivability, or utility.",
        "trade_engineering"
    ).GetID(),

    INTERRUPT = new Category(
        "Interrupt",
        "Used to disrupt enemy abilities, interrupts can stop spellcasting or delay powerful attacks. They are essential for countering enemy spellcasters and preventing devastating abilities.",
        "trade_engineering"
    ).GetID(),

    CROWD_CONTROL = new Category(
        "Crowd Control",
        "Abilities that impair enemy movement, actions, or effectiveness in combat. They include stuns, slows, roots, and other effects that help control engagements.",
        "trade_engineering"
    ).GetID(),

    TAUNT = new Category(
        "Taunt",
        "Forcing enemies to attack the caster, taunts are crucial for tanking roles. They help maintain threat and protect allies by keeping enemies focused on the intended target.",
        "trade_engineering"
    ).GetID(),

    HEAL = new Category(
        "Heal",
        "Restores health to yourself or allies, helping sustain them in combat. Healing abilities are essential for keeping your group alive during challenging encounters.",
        "trade_engineering"
    ).GetID(),

    HEAL_OVER_TIME = new Category(
        "Heal Over Time",
        "Instead of instantly restoring health, these abilities gradually heal a target over time. They are useful for maintaining health without requiring constant casting.",
        "trade_engineering"
    ).GetID(),

    GROUP_HEAL = new Category(
        "Group Heal",
        "Healing multiple allies at once, these abilities are key in group combat. They are vital for supporting multiple teammates during intense battles.",
        "trade_engineering"
    ).GetID(),

    BUFF = new Category(
        "Buff",
        "Enhances a target’s abilities, stats, or survivability for a duration. Buffs can provide increased damage, defense, or other useful effects.",
        "trade_engineering"
    ).GetID(),

    DEBUFF = new Category(
        "Debuff",
        "Weakens enemies by reducing their effectiveness, such as lowering their damage or defense. Debuffs help gain an advantage by making enemies more vulnerable.",
        "trade_engineering"
    ).GetID(),

    COMBAT_UTILITY = new Category(
        "Combat Utility",
        "Abilities that provide situational advantages in combat, such as mobility boosts, resistances, or temporary immunities. These skills enhance versatility and tactical play.",
        "trade_engineering"
    ).GetID(),

    RESTING_UTILITY = new Category(
        "Resting Utility",
        "Abilities that aid in non-combat situations, like health regeneration, mana recovery, or convenience-based effects. They are useful between battles to prepare for the next encounter.",
        "trade_engineering"
    ).GetID(),

    SUMMON = new Category(
        "Summon",
        "Allows the user to call forth creatures, constructs, or magical entities for assistance. Summons can aid in combat, provide buffs, or serve as distractions.",
        "trade_engineering"
    ).GetID()
}
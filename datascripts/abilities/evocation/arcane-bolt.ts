import { std } from "wow/wotlk";
import { createAbility } from "../../functions/createAbility";
import { AbilityCategory } from "../../functions/abilityCategory";

// Create 25% Mana Restore Spell //
const MANA_RESTORE = std.Spells.create("azara-core", "mana-restore")
    .Name.enGB.set("Mana Restore")
    .Description.enGB.set("Restores $s1 mana.")
    .Attributes.set(["IS_ABILITY", "IS_PASSIVE", "IS_HIDDEN_IN_SPELLBOOK"])
    .SchoolMask.set(["PHYSICAL"])
    .Power.Type.MANA.set()
    .Effects.addMod(x => x
        .Type.ENERGIZE.set()
        .PowerType.MANA.set()
        .ChainAmplitude.set(1)
        .ImplicitTargetA.UNIT_CASTER.set()
    )

// Create Spell //
const SPELL = std.Spells.create("azara-core", "arcane-bolt-ability")

SPELL.Name.enGB.set("Arcane Bolt")
    .Description.enGB.set("Sends a magical bolt at the enemy, causing $s1 Arcane damage. Restores 25% of mana cost if the spell critically hits the target.")
    .Icon.setPath("Spell_Arcane_Starfire")
    .PreventionType.SILENCE.set()
    .FacingCasterFlags.set(["SPELL_FACING_FLAG_INFRONT"])
    .Attributes.set(["NOT_SHAPESHIFTED"])
    .InterruptFlags.set(["ON_MOVEMENT", "ON_PUSHBACK", "ON_INTERRUPT_CAST", "ON_INTERRUPT"])
    .SchoolMask.set(["PHYSICAL", "ARCANE"])
    .Visual.set(271)
    .DefenseType.set(1)
    .Speed.set(20)
    .CastTime.setSimple(1700)
    .Cooldown.GlobalTime.set(1500)
    .Cooldown.GlobalCategory.set(133)
    .Power.Type.MANA.set()
    .Power.CostPercent.set(10)
    .Range.setSimple(0, 30)
    .Effects.addMod(x => x
        .Type.SCHOOL_DAMAGE.set()
        .DamageBase.set(12)
        .DamageDieSides.set(5)
        .DamagePerLevel.set(0.4000000059604645)
        .BonusMultiplier.set(0.14000000059604645)
        .ImplicitTargetA.UNIT_TARGET_ENEMY.set()
    )
    // Restores 25% of Ability cost on crit. //
    .InlineScripts.OnDamageLate((spell, damage, info, type, crit) => {
        const caster = ToUnit(spell.GetCaster());
        const cost = spell.GetPowerCost();
        if (!spell || !info || !caster || !cost)
            return;

        if (!crit)
            return;

        const value = Math.round(cost * 0.25);

        caster.CastCustomSpell(caster, GetID("Spell", "azara-core", "mana-restore"), true, value)
    })

export const ARCANE_BOLT = createAbility(SPELL.ID, AbilityCategory.Evocation, 10)
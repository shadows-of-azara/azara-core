import { std } from "wow/wotlk";
import { createAbility } from "../../functions/createAbility";

// Create Aura //
const SHOCKED_AURA = std.Spells.create("azara-core", "shocked-aura")
    .Name.enGB.set("Shocked!")
    .AuraDescription.enGB.set("Air and Water spells hit you easier.")
    .Icon.setPath("Spell_Nature_SlowingTotem")
    .Duration.setSimple(10000)
    .Range.setSimple(0,30)
    .Proc.Chance.set(100)
    .Effects.addMod(x => x
        .Type.APPLY_AURA.set()
        .Aura.DUMMY.set()
        .ImplicitTargetA.UNIT_TARGET_ENEMY.set()
    )

// Create Spell //
const SPELL = std.Spells.create("azara-core", "spark")
    .Name.enGB.set("Spark")
    .Description.enGB.set("Blasts an enemy with lightning, inflicting Nature damage and Shocking the enemy for 10 seconds. Shocked enemies are easier to hit with Air and Water spells.")
    .Icon.setPath("Spell_Nature_Lightning")
    .PreventionType.SILENCE.set()
    .FacingCasterFlags.set(["SPELL_FACING_FLAG_INFRONT"])
    .Attributes.set(["NOT_SHAPESHIFTED"])
    .InterruptFlags.set(["ON_MOVEMENT", "ON_PUSHBACK", "ON_INTERRUPT_CAST", "ON_INTERRUPT"])
    .SchoolMask.set(["PHYSICAL", "NATURE"])
    .Visual.set(173)
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
    // Apply Shocked Aura //
    .InlineScripts.OnHit(spell => {
        const caster = ToUnit(spell.GetCaster());
        const target = ToUnit(spell.GetTarget());
        if (!spell || !caster || !target)
            return;
        if (Math.random() < 0.5)

        caster.CastSpell(target, GetID("Spell", "azara-core", "shocked-aura"), true)
    })
export const SPARK = createAbility(SPELL.ID)
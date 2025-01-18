@CharactersTable
export class LearnedAbilities extends DBEntry {
    constructor(player: TSGUID, spell: uint32) {
        super();
        this.player = player;
        this.spell = spell;
    }

    @DBPrimaryKey
    player: TSGUID = CreateGUID(0, 0);

    @DBPrimaryKey
    spell: uint32 = 0;

    @DBField
    active: uint8 = 0;

    static get(player: TSPlayer, spell: uint32): LearnedAbilities {
        return player.GetObject('Abilities', LoadDBEntry(new LearnedAbilities(player.GetGUID(), spell)));
    }

    static HasAbility(player: TSPlayer, spell: uint32) {
        const ability = LearnedAbilities.get(player, spell)

        return ability.active
    }

    static Learn(player: TSPlayer, spell: uint32) {
        const ability = LearnedAbilities.get(player, spell)

        ability.spell = spell

        ability.Save()
    }

    static Deactivate(player: TSPlayer, spell: uint32) {
        const ability = LearnedAbilities.get(player, spell)

        ability.active = 0;

        ability.Save()
    }

    static Activate(player: TSPlayer, spell: uint32) {
        const ability = LearnedAbilities.get(player, spell)

        ability.active = 1;

        ability.Save()
    }
}
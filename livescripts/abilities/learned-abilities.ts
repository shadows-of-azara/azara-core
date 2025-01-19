@CharactersTable
export class Learned_Abilities extends DBArrayEntry {
    constructor(player: TSGUID, spell: uint32) {
        super();
        this.player = player;
        this.spell = spell;
    }

    @DBPrimaryKey
    player: TSGUID = CreateGUID(0, 0);

    @DBField
    spell: uint32 = 0;

    @DBField
    active: uint8 = 0;

    static get(player: TSPlayer): DBContainer<Learned_Abilities> {
        return player.GetObject('Learned_Abilities', LoadDBArrayEntry(Learned_Abilities, player.GetGUID()))
    }

    static Learn(player: TSPlayer, ability: uint32) {
        let entry = Learned_Abilities.get(player)

        let array = entry.find(x => x.player == player.GetGUID() && x.spell == ability)

        if (!array) {
            entry.Add(new Learned_Abilities(player.GetGUID(), ability))

            entry.Save()
        } else {
            return
        }
    }

    static HasAbility(player: TSPlayer, ability: uint32) {
        let entry = Learned_Abilities.get(player)

        let array = entry.find(x => x.player == player.GetGUID() && x.spell == ability)

        return array.active
    }

    static Deactivate(player: TSPlayer, ability: uint32) {
        let entry = Learned_Abilities.get(player)

        let array = entry.find(x => x.player == player.GetGUID() && x.spell == ability)

        if (array) {
            array.active = 0;
            array.MarkDirty();

            entry.Save()
        } else {
            return
        }
    }

    static Activate(player: TSPlayer, ability: uint32) {
        let entry = Learned_Abilities.get(player)

        let array = entry.find(x => x.player == player.GetGUID() && x.spell == ability)

        if (array) {
            array.active = 1;
            array.MarkDirty();

            entry.Save()
        } else {
            return
        }
    }

    static ActiveCount(player: TSPlayer) {
        let entry = Learned_Abilities.get(player)

        let array = entry.ToArray().filter(x => x.player == player.GetGUID() && x.active == 1)

        return array.length
    }
}
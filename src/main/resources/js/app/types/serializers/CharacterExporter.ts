import {OnlyWarCharacter} from "../character/Character";
import {ItemType} from "../character/items/Item";
import {Weapon} from "../character/items/Weapon";
import {Armor} from "../character/items/Armor";
/**
 * Created by Damien on 9/18/2016.
 */

export class CharacterExporter {
    public export(character:OnlyWarCharacter) {
        return {
            name: character.name,
            player: character.player,
            regiment: {
                name : character.regiment.name
            },
            specialty : {
                name : character.specialty.name
            },
            demeanor: character.demeanor,
            description: character.description,
            characteristics: Array.from(character.characteristics.entries()).reduce((previous, current)=> {
                previous[current[0].name] = current[1].total;
                return previous;
            }, {}),
            skills: character.skills.reduce((previous, current)=> {
                let skillIdentifier = current.identifier.name + (current.identifier.specialization ? " (" + current.identifier.specialization + ")" : "");
                previous[skillIdentifier] = current.rank;
                return previous;
            }, {}),
            talents: character.talents.map(e=> {
                return e.name + (e.specialization ? " (" + e.specialization + ")" : "");
            }),
            weapons: Array.from(character.kit.entries()).filter(e=> {
                return e[0].type == ItemType.Weapon
            }).map(e => {
                return {
                    weapon: {
                        name: e[0].name,
                        type: (<Weapon>e[0]).weaponType,
                        damage: (<Weapon>e[0]).damage,
                        class: (<Weapon>e[0]).class,
                        pen: (<Weapon>e[0]).penetration,
                        range: (<Weapon>e[0]).range,
                        rof: (<Weapon>e[0]).rateOfFire,
                        clip: (<Weapon>e[0]).clip,
                        reload: (<Weapon>e[0]).reload,
                        special: (<Weapon>e[0]).special.join(", ")
                    },
                    count: e[1]
                }
            }),
            armor: Array.from(character.kit.entries()).filter(e=> {
                return e[0].type == ItemType.Armor
            }).reduce((existing, next)=> {
                (<Armor>next[0]).locations.forEach(r=> {
                    if (!existing[r]) {
                        existing[r] = {
                            rating: 0,
                            type: ""
                        };
                    }
                    if ((<Armor>next[0]).ap > existing[r].rating) {
                        existing[r].rating = (<Armor>next[0]).ap;
                        existing[r].type = next[0].name;
                    }
                });
                return existing;
            }, {}),
            gear: Array.from(character.kit.entries()).filter(e=> {
                return e[0].type == ItemType.Other;
            }).map(e=> {
                return e[0].craftsmanship != "Common" ? e[0].craftsmanship + " Craftsmanship " : "" +
                e[0].name + " x " + e[1];
            }),
            wounds: {
                total: character.wounds.total
            },
            movement: {
                half: character.speeds.half,
                full: character.speeds.full,
                charge: character.speeds.charge,
                run: character.speeds.run
            },
            fatePoints: {
                total: character.fatePoints
            },
            psychicPowers: {
                psyRating: character.powers.psyRating,
                powers: character.powers.powers
            },
            comrade: {},
            experience: {
                toSpend: character.experience.available,
                totalSpend: character.experience.total - character.experience.available
            },
            aptitudes: character.aptitudes

        }
    }
}
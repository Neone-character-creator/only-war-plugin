package model

import model.equipment.Item

/**
  * Created by Damien on 3/10/2016.
  */
class Specialty(val name: String,
                val characteristicBonus: (Characteristic, Int),
                val aptitudes: Seq[Aptitude],
                val startingSkills: Seq[Seq[String]],
                val startingTalents: Seq[Seq[Talent]],
                val specialistEquipment: Seq[Seq[Item]],
                val startingSkillChoices: Seq[Choice[String]],
                val startingTalentChoices: Seq[Choice[Talent]],
                val startingEquipmentOptions: Seq[Choice[Map[Item, Int]]],
                val startingWoundModifier: Int
               )
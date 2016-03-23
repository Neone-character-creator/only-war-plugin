package model

import io.github.thisisnozaku.charactercreator.plugins.Character
import model.equipment.Item

/**
  * Created by Damien on 3/10/2016.
  */
class OnlyWarCharacter(val characterName:String,
                       val playerName:String,
                       val regiment:Regiment,
                       val specialty:Specialty,
                       val demeanor:String,
                       val description:String,
                       val talents: Seq[Talent],
                       val characteristics : Map[Characteristic, Int],
                       val wounds:Int,
                       val fatigue:Int,
                       val insanityPoints:Int,
                       val mentalDisorders:Seq[String],
                       val corruptionPoints:Int,
                       val malignancies: Seq[String],
                       val mutations: Seq[String],
                       val fullMove:Int,
                       val totalFatePoints: Int,
                       val currentFatePoints: Int,
                       val equipment: Seq[Item],
                       val psyRating: Int,
                       val psychicPowers: Seq[Power],
                       val comrade: Comrade,
                       val availableXp: Int,
                       val totalXp: Int,
                       val aptitudes: Seq[Aptitude]
                      ) extends Character

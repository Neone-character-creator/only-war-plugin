package model.equipment

/**
  * Created by Damien on 3/12/2016.
  */
class Weapon(
              override val name: String,
              override val description: String,
              val weaponClass: String,
              val range: String,
              val rof: String,
              val damage: String,
              val penetrations: String,
              val clip: String,
              val reload: String,
              val special: Seq[String],
              val weight: String,
              override val availability: String,
              val craftsmanship: String = "Common") extends Item(name, description, availability)
package model.equipment

/**
  * Created by Damien on 3/12/2016.
  */
case class Armor(
                  override val name: String,
                  override val description: String,
                  override val availability: String,
                  val locations: Seq[String],
                  val armorPoints: Int,
                  val weight: String,
                  val craftsmanship: String = "Common"
                ) extends Item(name, description, availability)

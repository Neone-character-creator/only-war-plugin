import model.Characteristic
import play.api.libs.json._

implicit val characteristicReader : Reads[Characteristic] = (
  (__).read[String].map(Characteristic(_))
  )

val ratings = Json.parse(
  """[
  "Weapon Skill",
  "Ballistic Skill",
  "Strength",
  "Toughness",
  "Agility",
  "Intelligence",
  "Perception",
  "Willpower",
  "Fellowship"
  ]"""
).as[Seq[Characteristic]]
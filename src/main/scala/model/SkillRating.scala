package model

import java.io.{File, FileInputStream}

import play.api.libs.json._
import play.api.libs.functional.syntax._

/**
  * Created by Damien on 3/10/2016.
  */
case class SkillRating(val description: String, val modifier: Int)

object SkillRatings {
  implicit val ratingReader: Reads[SkillRating] = (
      (__ \ "name").read[String] and
      (__ \ "modifier").read[Int]
    ) (SkillRating.apply _)

  private val ratings = Json.parse(new FileInputStream(new File("Character/skillratings.json"))).validate[Seq[SkillRating]].asOpt.get.map(s => s.description -> s) toMap

  def apply(name: String): SkillRating = {
    ratings(name)
  }
}
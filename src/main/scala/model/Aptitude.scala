package model

import java.io.{FileInputStream, File, FileReader}

import play.api.libs.json._

/**
  * Created by Damien on 3/10/2016.
  */
sealed case class Aptitude(val name: String) {

}

object Aptitudes {
  implicit val characteristicReader: Reads[Aptitude] = (
    (__).read[String].map(Aptitude(_))
    )
  private val aptitudes = Json.parse(new FileInputStream(new File("Character/aptitudes.json"))).validate[Seq[Aptitude]].asOpt.get.map(s => s.name -> s) toMap

  def apply(name: String): Aptitude = {
    aptitudes(name)
  }
}
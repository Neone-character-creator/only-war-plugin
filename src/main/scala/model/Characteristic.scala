package model

import java.io.{File, FileInputStream}

import play.api.libs.json._

/**
  * Created by Damien on 3/10/2016.
  */
case class Characteristic(val name: String)

object Characteristics {
  implicit val characteristicReader: Reads[Characteristic] = (
    (__).read[String].map(Characteristic(_))
    )

  private val characteristics = Json.parse(new FileInputStream(new File("characteristic.json"))).validate[Seq[Characteristic]].asOpt.get.map(c => c.name -> c) toMap

  def apply(name: String): Characteristic = {
    characteristics(name)
  }
}
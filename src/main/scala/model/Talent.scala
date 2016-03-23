package model

/**
  * Created by Damien on 3/10/2016.
  */
class Talent(val name:String,
             val prerequisites: Seq[String],
             val aptitudes: Seq[String],
             val description:String)
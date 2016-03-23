package model

/**
  * Created by Damien on 3/10/2016.
  */
class Power(val name: String,
            val xpCost: Int,
            val prerequsites: Seq[String],
            val action: String,
            val focusPower: String,
            val range: String,
            val sustained: Boolean,
            val subtypes: Seq[String],
            val description: String
           )
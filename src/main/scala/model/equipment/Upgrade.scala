package model.equipment

/**
  * Created by Damien on 3/12/2016.
  */
class Upgrade(override val name:String,
              override val description:String,
              val weight: String,
              override val availability: String) extends Item(name, description, availability){

}

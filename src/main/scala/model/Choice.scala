package model

/**
  * Represents a set of options and rules for selecting them.
  *
  * numberOfSelections allows customized rules for determining the number of options that can be
  * chosen.
  *
  * options is the allowed choices and the number of times each of them can be selected.
  *
  * @param numberOfSelections how many choices can be selected
  * @param options            the options that can be selected from and how many times each one can be selected
  * @tparam T the type of the options and the type of the elements in the returned Seq
  */
class Choice[T](val numberOfSelections: Seq[Int], val options: Map[T, Seq[Int]]) {

  def this(numberOfSelections: Range, duplicatesAllowed: Boolean, options: T*) = {
    this(List(numberOfSelections), duplicatesAllowed, options map (o => o -> 1) toMap)
  }

  /**
    * Select the given elements.
    *
    * This method serves as validation for the chosen options, ensuring that a valid number are chosen,
    * that no duplicates are selected if disallowed and that all the choices exist within the allowed
    * options.
    *
    * @param choices
    * @return the choices, if valid
    * @throws IllegalArgumentException if the choices are not
    */
  def choose(choices: T*): Seq[T] = {
    val selections: Map[T, Int] = choices.distinct.map(c => c -> choices.count(o => o == (c))).toMap
    require(numberOfSelections.contains(choices.size) && (selections.keys.forall(s => options(s).contains(selections(s)))))
    choices
  }
}

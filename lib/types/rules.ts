// If we satisfy all the conditions, we get any/all of the consequences

interface Rule {
  antecedent: Condition[];
  consequent: Consequent[];


}

interface Condition {

}

/*
E.g., to show

q v ( q -> p)
  q

  q -> p
    p
    



*/

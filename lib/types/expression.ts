export const enum ExpType {
  Var,
  Func,
  True,
  False,
  Not,
  And,
  Or,
  Implies,
  Iff,
  Forall,
  Exists
}

export interface Var {
  readonly type: ExpType.Var;
  readonly name: string;
}

export interface Func {
  readonly type: ExpType.Func;
  readonly name: Var;
  readonly body: Expression | null;
}

export interface True {
  readonly type: ExpType.True;
}
export interface False {
  readonly type: ExpType.False;
}

export interface Not {
  readonly type: ExpType.Not;
  readonly body: Expression;
}

export interface And {
  readonly type: ExpType.And;
  readonly left: Expression;
  readonly right: Expression;
}

export interface Or {
  readonly type: ExpType.Or;
  readonly left: Expression;
  readonly right: Expression;
}

export interface Implies {
  readonly type: ExpType.Implies;
  readonly left: Expression; // antecedent
  readonly right: Expression; // consequent
}

export interface Iff {
  readonly type: ExpType.Iff;
  readonly left: Expression;
  readonly right: Expression;
}

export interface Forall {
  readonly type: ExpType.Forall;
  readonly variable: Var;
  readonly body: Expression;
}

export interface Exists {
  readonly type: ExpType.Exists;
  readonly variable: Var;
  readonly body: Expression;
}

export type Expression = Var | Func | True | False | Not | And | Or | Implies | Iff | Forall | Exists;

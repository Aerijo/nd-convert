import * as e from '../types/expression';
import { Expression, ExpType } from '../types/expression';

const Fitch = {
  true: "T",
  false: "F",
  not: "\\lnot",
  and: "\\land",
  or: "\\lor",
  implies: "\\rightarrow",
  iff: "\\leftrightarrow",
  forall: "\\forall",
  exists: "\\exists",
  universal_group: ".",
  left_group: "(",
  right_group: ")",
  left_group_alt: "[",
  right_group_alt: "]",
  block: {
    open: "\\open",
    close: "\\close"
  }
}

export function expressionToString (node: Expression): string {
  switch (node.type) {
    case ExpType.Var:     return varToString(node);
    case ExpType.Func:    return funcToString(node);
    case ExpType.True:    return Fitch.true;
    case ExpType.False:   return Fitch.false;
    case ExpType.Not:     return notToString(node);
    case ExpType.And:     return andToString(node);
    case ExpType.Or:      return orToString(node);
    case ExpType.Implies: return impliesToString(node);
    case ExpType.Iff:     return iffToString(node);
    case ExpType.Forall:  return forallToString(node)
    case ExpType.Exists:  return existsToString(node);
  }
}

export function varToString (node: e.Var): string {
  return node.name.length <= 1 ? node.name : "\\mathit{" + node.name + "}";
}

function funcToString (node: e.Func): string {
  let name = varToString(node.name);

  let body = "";
  if (node.body !== null) {
    body = Fitch.left_group + expressionToString(node.body) + Fitch.right_group;
  }

  return name + body;
}

function notToString (node: e.Not): string {
  return Fitch.not + " " + subExpToString(node.body);
}

function andToString (node: e.And): string {
  return subExpToString(node.left) + " " + Fitch.and + " " + subExpToString(node.right);
}

function orToString (node: e.Or): string {
  return subExpToString(node.left) + " " + Fitch.or + " " + subExpToString(node.right);
}

function impliesToString (node: e.Implies): string {
  let left = "";
  let right = "";

  if (node.left.type === ExpType.And || node.left.type === ExpType.Or) {
    left = expressionToString(node.left);
  } else {
    left = subExpToString(node.left);
  }

  if (node.right.type === ExpType.And || node.right.type === ExpType.Or) {
    right = expressionToString(node.right);
  } else {
    right = subExpToString(node.right);
  }

  return left + " " + Fitch.implies + " " + right;
}

function iffToString (node: e.Iff): string {
  let left = "";
  let right = "";

  if (node.left.type === ExpType.And || node.left.type === ExpType.Or) {
    left = expressionToString(node.left);
  } else {
    left = subExpToString(node.left);
  }

  if (node.right.type === ExpType.And || node.right.type === ExpType.Or) {
    right = expressionToString(node.right);
  } else {
    right = subExpToString(node.right);
  }

  return left + " " + Fitch.iff + " " + right;
}

function forallToString (node: e.Forall): string {
  let varName = varToString(node.variable);
  let body = expressionToString(node.body);
  return Fitch.forall + " " + varName + " " + Fitch.universal_group + " " + body;
}

function existsToString (node: e.Exists): string {
  let varName = varToString(node.variable);
  let body = expressionToString(node.body);
  return Fitch.exists + " " + varName + " " + Fitch.universal_group + " " + body;
}


function isAtomicTerm (node: Expression): boolean {
  switch (node.type) {
    case ExpType.Var:
    case ExpType.Func:
    case ExpType.True:
    case ExpType.False:
    case ExpType.Not:
      return true;
    default:
      return false;
  }
}

function subExpToString (node: Expression): string {
  if (isAtomicTerm(node)) {
    return expressionToString(node);
  } else {
    return Fitch.left_group + expressionToString(node) + Fitch.right_group;
  }
}

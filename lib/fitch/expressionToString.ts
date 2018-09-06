import { SyntaxNode } from 'tree-sitter';
import { nextChild, possibleNextChild, getTargetChild } from '../util';

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


export function getExpressionString (node: SyntaxNode): string {
  if (node.type !== "expression") {
    throw new Error("Expected an expression!");
  }

  if (node.hasError()) {
    throw new Error("Error in expression!");
  }

  let childNode = nextChild(node).node;
  return termToString(childNode);
}



function termToString (node: SyntaxNode): string {
  switch (node.type) {
    case "variable":
      return variableToString(node);
    case "function":
      return functionToString(node);
    case "true":
      return Fitch.true;
    case "false":
      return Fitch.false;
    case "not":
      return notToString(node);
    case "and":
    case "or":
      return andOrToString(node);
    case "implies":
      return impliesToString(node);
    case "iff":
      return impliesToString(node);
    case "forall":
    case "exists":
      return allExistsToString(node);
    default:
      throw new Error("Unexpected node " + node.type);
  }
}

export function variableToString (node: SyntaxNode): string {
  return node.text.length <= 1 ? node.text : "\\mathit{" + node.text + "}";
}


function functionToString (node: SyntaxNode): string {
  let name = "";
  let body = "";

  const nameChild = nextChild(node);
  name = variableToString(nameChild.node);

  const bodyChild = possibleNextChild(node, nameChild.ind+1);
  if (bodyChild !== null) {
    body = Fitch.left_group + termToString(bodyChild.node) + Fitch.right_group;
  }

  return name + body;
}

function notToString (node: SyntaxNode): string {
  let body = "";

  const bodyChild = nextChild(node);
  body = subtermToString(bodyChild.node);

  return Fitch.not + " " + body;
}

function andOrToString (node: SyntaxNode): string {
  if (node.type !== "and" && node.type !== "or") { throw new Error(); } // TODO: Replace SyntaxNode with proper types
  let operator = Fitch[node.type];
  let left = "";
  let right = "";

  const leftChild = nextChild(node);
  const rightChild = nextChild(node, leftChild.ind+1);

  left = subtermToString(leftChild.node);
  right = subtermToString(rightChild.node);

  return left + " " + operator + " " + right;
}

function impliesToString (node: SyntaxNode): string {
  let left = "";
  let right = "";

  const leftChild = nextChild(node);
  const rightChild = nextChild(node, leftChild.ind+1);

  if (leftChild.node.type === "and" || leftChild.node.type === "or") {
    left = termToString(leftChild.node);
  } else {
    left = subtermToString(leftChild.node);
  }

  if (rightChild.node.type === "and" || rightChild.node.type === "or") {
    right = termToString(rightChild.node);
  } else {
    right = subtermToString(rightChild.node);
  }

  return left + " " + Fitch.implies + " " + right;
}

function iffToString (node: SyntaxNode): string {
  let left = "";
  let right = "";

  const leftChild = nextChild(node);
  const rightChild = nextChild(node, leftChild.ind+1);

  if (leftChild.node.type === "and" || leftChild.node.type === "or") {
    left = termToString(leftChild.node);
  } else {
    left = subtermToString(leftChild.node);
  }

  if (rightChild.node.type === "and" || rightChild.node.type === "or") {
    right = termToString(rightChild.node);
  } else {
    right = subtermToString(rightChild.node);
  }

  return left + " " + Fitch.iff + " " + right;
}

function allExistsToString (node: SyntaxNode): string {
  if (node.type !== "forall" && node.type !== "exists") { throw new Error(); }
  let operator = Fitch[node.type];
  let name = "";
  let body = "";

  const nameChild = nextChild(node);
  const bodyChild = nextChild(node, nameChild.ind+1);

  name = subtermToString(nameChild.node);
  body = termToString(bodyChild.node);

  return operator + " " + name + " " + Fitch.universal_group + " " + body;
}


function isAtomicTerm (node: SyntaxNode): boolean {
  switch (node.type) {
    case "variable":
    case "function":
    case "true":
    case "false":
    case "not":
      return true;
    default:
      return false;
  }
}

function subtermToString (node: SyntaxNode): string {
  if (isAtomicTerm(node)) {
    return termToString(node);
  } else {
    return Fitch.left_group + termToString(node) + Fitch.right_group;
  }
}

import { SyntaxNode } from 'tree-sitter';
import { nextChild, possibleNextChild, getTargetChild } from '../util';

import * as e from '../types/expression';
import { Expression, ExpType } from '../types/expression';


export function getExpression (node: SyntaxNode): Expression {
  if (node.type !== "expression") {
    throw new Error("Expected expression node!");
  }

  if (node.hasError()) {
    throw new Error("Error in expression!");
  }

  let childNode = nextChild(node).node;

  return nodeToExpression(childNode);
}

function nodeToExpression (node: SyntaxNode): Expression {
  switch (node.type) {
    case "variable":
      return varToExpression(node);
    case "function":
      return funcToExpression(node);
    case "true":
      return {
        type: ExpType.True
      };
    case "false":
      return {
        type: ExpType.False
      };
    case "not":
      return notToExpression(node);
    case "and":
      return andToExpression(node);
    case "or":
      return orToExpression(node);
    case "implies":
      return impliesToExpression(node);
    case "iff":
      return iffToExpression(node);
    case "forall":
      return forallToExpression(node);
    case "exists":
      return existsToExpression(node);
    default:
      throw new Error("Unexpected node " + node.type);
  }
}

function varToExpression (node: SyntaxNode): e.Var {
  return {
    type: ExpType.Var,
    name: node.text
  }
}

function funcToExpression (node: SyntaxNode): e.Func {
  const nameChild = getTargetChild(node, "function_name");
  if (nameChild === null) {
    throw new Error("Cannot find function name!");
  }

  let body = null;
  const bodyChild = possibleNextChild(node, nameChild.ind+1);
  if (bodyChild !== null) {
    body = nodeToExpression(bodyChild.node);
  }

  return {
    type: ExpType.Func,
    name: varToExpression(nameChild.node),
    body: body
  }
}

function notToExpression (node: SyntaxNode): e.Not {
  const bodyChild = nextChild(node);
  return {
    type: ExpType.Not,
    body: nodeToExpression(bodyChild.node)
  }
}

function andToExpression (node: SyntaxNode): e.And {
  const leftChild = nextChild(node);
  const rightChild = nextChild(node, leftChild.ind+1);
  return {
    type: ExpType.And,
    left: nodeToExpression(leftChild.node),
    right: nodeToExpression(rightChild.node)
  }
}

function orToExpression (node: SyntaxNode): e.Or {
  const leftChild = nextChild(node);
  const rightChild = nextChild(node, leftChild.ind+1);
  return {
    type: ExpType.Or,
    left: nodeToExpression(leftChild.node),
    right: nodeToExpression(rightChild.node)
  }
}

function impliesToExpression (node: SyntaxNode): e.Implies {
  const leftChild = nextChild(node);
  const rightChild = nextChild(node, leftChild.ind+1);
  return {
    type: ExpType.Implies,
    left: nodeToExpression(leftChild.node),
    right: nodeToExpression(rightChild.node)
  }
}

function iffToExpression (node: SyntaxNode): e.Iff {
  const leftChild = nextChild(node);
  const rightChild = nextChild(node, leftChild.ind+1);
  return {
    type: ExpType.Iff,
    left: nodeToExpression(leftChild.node),
    right: nodeToExpression(rightChild.node)
  }
}

function forallToExpression (node: SyntaxNode): e.Forall {
  const varChild = getTargetChild(node, "variable");
  if (varChild === null) {
    throw new Error("Could not find introduced forall var!");
  }
  const bodyChild = nextChild(node, varChild.ind+1);
  return {
    type: ExpType.Forall,
    variable: varToExpression(varChild.node),
    body: nodeToExpression(bodyChild.node)
  }
}

function existsToExpression (node: SyntaxNode): e.Exists {
  const varChild = getTargetChild(node, "variable");
  if (varChild === null) {
    throw new Error("Could not find introduced exists var!");
  }
  const bodyChild = nextChild(node, varChild.ind+1);
  return {
    type: ExpType.Exists,
    variable: varToExpression(varChild.node),
    body: nodeToExpression(bodyChild.node)
  }
}

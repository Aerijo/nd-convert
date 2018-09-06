import { SyntaxNode } from 'tree-sitter';

function getTargetChild (node: SyntaxNode, target: string, i=0): { node: SyntaxNode, ind: number } | null {
  while (i < node.namedChildren.length) {
    if (node.namedChildren[i].type === target) {
      return {
        node: node.namedChildren[i],
        ind: i
      };
    }
    i += 1;
  }
  return null;
}

function nextChild (node: SyntaxNode, i=0): { node: SyntaxNode, ind: number } {
  while (i < node.namedChildren.length) {
    if (node.namedChildren[i].type !== "comment") {
      return {
        node: node.namedChildren[i],
        ind: i
      };
    }
    i += 1;
  }
  throw new Error("Could not find expected next node!");
}

function possibleNextChild (node: SyntaxNode, i=0): { node: SyntaxNode, ind: number } | null {
  while (i < node.namedChildren.length) {
    if (node.namedChildren[i].type !== "comment") {
      return {
        node: node.namedChildren[i],
        ind: i
      };
    }
    i += 1;
  }
  return null;
}

export { getTargetChild, nextChild, possibleNextChild };

import * as fs from 'fs';
import * as path from 'path';

import * as Parser from 'tree-sitter';

import { getExpression } from './fitch/syntaxTreeToExpression';
import { getProofString } from './fitch/proofToString';

const LangND = require("tree-sitter-nd");

function getAbsolutePath (filePath: string): string {
  if (filePath.length > 0 && filePath[0] === '~') {
    const home = process.env.HOME;
    if (typeof home !== "undefined") {
      filePath = path.join(home, filePath.slice(1));
    }
  }

  return path.resolve(process.cwd(), filePath);
}

function getText (filePath: string): string {
  return fs.readFileSync(filePath, { encoding: "utf-8" });
}

function getParseTree (text: string): Parser.Tree {
  const parser = new Parser();
  parser.setLanguage(LangND);

  const tree: Parser.Tree = parser.parse(text);

  return tree;
}

function main (): void {
  let inputPath: string = process.argv[2];
  if (!inputPath) {
    inputPath = "./examples/e1.txt";
  }

  const absPath = getAbsolutePath(inputPath);
  const text = getText(absPath);
  const tree = getParseTree(text);

  // console.log(tree.rootNode.toString());
  // console.log(tree.rootNode.tree);

  // console.log("\n");
  let node = tree.rootNode;

  // console.log(getProofString(node));

  while (node.type !== "expression") {
    node = node.namedChildren[0];
  }

  console.log(getExpression(node));


}

if (require.main === module) {
  main();
}

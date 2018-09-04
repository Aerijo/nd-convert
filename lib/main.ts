import * as fs from 'fs';
import * as path from 'path';

import * as Parser from 'tree-sitter';

const LangND = require("tree-sitter-nd");

function getAbsolutePath (filePath: string): string {
  if (filePath.length > 0 && filePath[0] === "~") {
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


const inputPath: string = process.argv[2];
const absPath = getAbsolutePath(inputPath);
const text = getText(absPath);
const tree = getParseTree(text);

console.log(tree.rootNode.toString());

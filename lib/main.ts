import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

import * as Parser from 'tree-sitter';

const LangND = require("tree-sitter-nd");

function getAbsolutePath (filePath: string): string {
  if (filePath.length > 0 && filePath[0] === "~") {
    const home: string | undefined = process.env.HOME;
    if (typeof home !== "undefined") {
      filePath = path.join(home, filePath.slice(1));
    }
  }

  const absPath = path.resolve(process.cwd(), filePath);

  return absPath;
}

function getParseTree (text: string): Parser.Tree {
  const parser = new Parser();
  parser.setLanguage(LangND);

  const tree: Parser.Tree = parser.parse(text);

  return tree;
}


const inputPath: string = process.argv[2];

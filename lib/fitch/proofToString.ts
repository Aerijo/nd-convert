import { SyntaxNode } from 'tree-sitter';
import { nextChild, possibleNextChild, getTargetChild } from '../util';

import { getExpressionString, variableToString } from './expressionToString';

const Fitch = {
  environment: {
    open: "\\begin{nd}",
    close: "\\end{nd}"
  },
  guard: {
    open: "[",
    close: "]"
  },
  block: {
    open: "\\open",
    close: "\\close"
  },
  hypo: "\\hypo",
  have: "\\have"
}

interface Options {
  padLength: number;
  initialPadding: number;
}

// This information may be used for the justification checker
class State {
  line: number = 1;
  depth: number = 0;
}

class Have {
  state: State;
  expression: SyntaxNode;

  constructor (state: State, exp: SyntaxNode) {
    this.state = { line: state.line, depth: state.depth };
    this.expression = exp;
  }

  toString (): string {
    let body = getExpressionString(this.expression);
    return `${Fitch.have} {${this.state.line}} { ${body} }`
  }
}

class Hypo {
  state: State;
  expression: SyntaxNode;

  constructor (state: State, exp: SyntaxNode) {
    this.state = { line: state.line, depth: state.depth };
    this.expression = exp;
  }

  toString (): string {
    let body = getExpressionString(this.expression);
    return `${Fitch.hypo} {${this.state.line}} { ${body} }`
  }
}

class Open {
  state: State;
  guards: string[];

  constructor (state: State, guards?: string[]) {
    this.state = { line: state.line, depth: state.depth };
    this.guards = guards || [];
  }

  toString (): string {
    let guards = "";
    if (this.guards.length > 0) {
      guards = Fitch.guard.open + this.guards.join(", ") + Fitch.guard.close;
    }
    return Fitch.block.open + guards;
  }
}

class Close {
  state: State;

  constructor (state: State) {
    this.state = { line: state.line, depth: state.depth };
  }

  toString (): string {
    return Fitch.block.close;
  }
}

type Line = Have | Hypo | Open | Close;


export function getProofString (node: SyntaxNode): string {
  let proof = "";

  if (node.type !== "proof") {
    throw new Error("Expected proof node!");
  }

  if (node.hasError()) {
    throw new Error("Error in proof!");
  }

  const blockChild = getTargetChild(node, "block");
  if (blockChild === null) {
    throw new Error("Missing proof body!");
  }

  const defaultOptions: Options = {
    padLength: 4,
    initialPadding: 1
  }

  const startState = new State();

  const lines = getBlockLines(blockChild.node, new State(), defaultOptions);

  return Fitch.environment.open + "\n" + buildStringFromLines(lines, defaultOptions) + Fitch.environment.close;
}

function getBlockLines (node: SyntaxNode, state: State, options: Options, lines: Line[]=[]): Line[] {
  for (let child of node.namedChildren) {
    switch (child.type) {
      case "guard":
        addGuard(lines, child);
        break;
      case "hypothesis":
        addHypothesis(lines, child, state, options);
        break;
      case "expression":
        lines.push(new Have(state, child));
        state.line += 1;
        break;
      case "block":
        lines.push(new Open(state));
        state.depth += 1;

        getBlockLines(child, state, options, lines);

        state.depth -= 1;
        lines.push(new Close(state));
        break;
    }
  }

  return lines;
}

function addHypothesis (lines: Line[], node: SyntaxNode, state: State, options: Options): void {
  for (let child of node.namedChildren) {
    if (child.type !== "expression") continue;

    let hypo = new Hypo(state, child);
    lines.push(hypo);

    state.line += 1;
  }
}

function addGuard (lines: Line[], node: SyntaxNode): void {
  let prevOpen = lines[lines.length-1];
  if (!(prevOpen instanceof Open)) {
    throw new Error("Expected opening for guard!");
  }

  debugger;
  let guards: string[] = [];
  for (let child of node.namedChildren) {
    if (child.type === "variable") {
      guards.push(variableToString(child));
    }
  }

  prevOpen.guards = prevOpen.guards.concat(guards);
}

function buildStringFromLines (lines: Line[], options: Options): string {
  const padUnit = " ".repeat(options.padLength)
  let padding = padUnit.repeat(options.initialPadding);

  let result = "";
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let body = line.toString();

    if (line instanceof Open) {
      body = padding + body;
      padding = padding + padUnit;
    } else if (line instanceof Close) {
      padding = padding.slice(0, padding.length - options.padLength);
      body = padding + body;
    } else {
      body = padding + body;
    }

    result += body + "\n";
  }

  return result;
}

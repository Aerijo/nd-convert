import { Expression } from '../types/expression';

// Tree-like structure that holds the rules sequentially
interface Block {
  assumptions: Line[];
  statements: (Line | Block)[];
}

// A single line in a proof. Holds information about the expression, and the justifying blocks / lines
interface Line {
  expression: Expression;
  justification: (Line | Block)[] | null;
}

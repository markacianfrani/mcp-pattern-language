import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const instructionsDir = join(process.cwd(), 'instructions');

// Read testing instructions
const testingGeneral = readFileSync(join(instructionsDir, 'testing', 'general.md'), 'utf8');
const testingInstructions = {
  general: testingGeneral,
  typescript: readFileSync(join(instructionsDir, 'testing', 'typescript.md'), 'utf8'),
  python: readFileSync(join(instructionsDir, 'testing', 'python.md'), 'utf8'),
};

// Read UI instructions
const uiInstructions = readFileSync(join(instructionsDir, 'ui', 'general.md'), 'utf8');

// Generate TypeScript code
const output = `// This file is auto-generated. Do not edit directly.

export type TestingInstructions = {
  general: string;
  typescript: string;
  python: string;
};

export const TESTING_INSTRUCTIONS: TestingInstructions = ${JSON.stringify(testingInstructions)};

export const UI_INSTRUCTIONS = ${JSON.stringify(uiInstructions)};
`;

// Write to src directory
console.log(output); 
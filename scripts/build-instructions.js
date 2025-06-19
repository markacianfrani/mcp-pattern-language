import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const instructionsDir = join(process.cwd(), 'instructions');

// Read all markdown files and create a map
const generalInstructions = readFileSync(join(instructionsDir, 'General.md'), 'utf8');

const testingInstructions = {
  typescript: readFileSync(join(instructionsDir, 'testing', 'typescript.md'), 'utf8'),
  python: readFileSync(join(instructionsDir, 'testing', 'python.md'), 'utf8'),
};

// Generate TypeScript code
const output = `// This file is auto-generated. Do not edit directly.

export const GENERAL_INSTRUCTIONS = ${JSON.stringify(generalInstructions)};

export type TestingInstructions = {
  [K in "typescript" | "python"]: string;
};

export const TESTING_INSTRUCTIONS: TestingInstructions = ${JSON.stringify(testingInstructions)};
`;

// Write to src directory
console.log(output); 
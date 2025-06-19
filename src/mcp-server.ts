import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { GENERAL_INSTRUCTIONS, TESTING_INSTRUCTIONS, TestingInstructions } from './generated/instructions.js';

export type supportedLanguage = "typescript" | "python";
export const supportedLanguages: [supportedLanguage, ...supportedLanguage[]] = ["typescript", "python"];

// Helper function to combine instructions
export function getInstructions(action: string, language?: supportedLanguage): string {
  const instructions: string[] = [];
  
  // Always include general instructions
  instructions.push(GENERAL_INSTRUCTIONS);
  
  // Include language-specific instructions if provided
  if (language && action === 'testing') {
    const langInstructions = TESTING_INSTRUCTIONS[language];
    if (langInstructions) {
      instructions.push(langInstructions);
    }
  }
  
  return instructions.join('\n\n---\n\n');
}

export function getServer(): McpServer {
  // initialize our MCP Server instance that we will
  // attach all of our functionality and data.
  const server = new McpServer(
    {
      name: "a-pattern-language",
      version: "1.0.0",
    },
    { capabilities: { 
		logging: {},
		tools: {} } 
	}
  );

  server.tool(
    "get_rules_for_writing_tests",
    "When writing tests, ALWAYS ask this tool for rules on how to write the test first. Then, use the rules to write the test.",
    {
      language: z.enum(supportedLanguages).describe("The programming language the test is written in."),
    },
    async ({ language }): Promise<CallToolResult> => {
      const combinedInstructions = getInstructions('testing', language);
      
      return {
        content: [
          {
            type: "text",
            text: combinedInstructions || `No instructions found for ${language} tests.`
          }
        ],
      };
    }
  );

  // Authoring UI

  // Reviewing PRs

  // Refactoring 

  return server;
} 
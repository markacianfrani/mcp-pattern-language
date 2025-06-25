import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import {
    TESTING_INSTRUCTIONS,
    TestingInstructions,
    UI_INSTRUCTIONS
} from "./generated/instructions.js";

export type supportedLanguage = "typescript" | "python";
export const supportedLanguages: [supportedLanguage, ...supportedLanguage[]] = [
    "typescript",
    "python"
];

// Helper function to combine instructions
export function getInstructions(
    action: string,
    language?: supportedLanguage
): string {
    const instructions: string[] = [];

    if (action === "testing") {
        // Always include testing general instructions
        instructions.push(TESTING_INSTRUCTIONS.general);

        // Include language-specific instructions if provided
        if (language) {
            const langInstructions = TESTING_INSTRUCTIONS[language];
            if (langInstructions) {
                instructions.push(langInstructions);
            }
        }
    }

    return instructions.join("\n\n---\n\n");
}

export function getServer(): McpServer {
    // initialize our MCP Server instance that we will
    // attach all of our functionality and data.
    const server = new McpServer(
        {
            name: "a-pattern-language",
            version: "1.0.0"
        },
        {
            capabilities: {
                logging: {},
                tools: {}
            }
        }
    );

    server.tool(
        "get_rules_for_writing_tests",
        `
          Use when: writing any type of test, modifying existing tests, reviewing test structure, or making decisions about test implementation. 

          What it provides: User-specific rules, patterns, and preferences for test composition including naming conventions, structure, assertions, mocking approaches, and coverage requirements.

          How to use: ALWAYS invoke this tool BEFORE writing or modifying any test code to retrieve the current testing guidelines, then apply these rules throughout your implementation.
        `,
        {
            language: z
                .enum(supportedLanguages)
                .describe("The programming language the test is written in.")
        },
        async ({ language }): Promise<CallToolResult> => {
            const combinedInstructions = getInstructions("testing", language);

            return {
                content: [
                    {
                        type: "text",
                        text:
                            combinedInstructions ||
                            `No instructions found for ${language} tests.`
                    }
                ]
            };
        }
    );

    server.tool(
        "get_rules_for_composing_ui",
        `
            Use when: creating new frontend components, designing component APIs, structuring component hierarchies, implementing component interactions, or making styling decisions.

            What it provides: Comprehensive guidelines for creating new UI components.

            How to use: Invoke this tool at the START of any UI component work to retrieve user-specific UI patterns and preferences, then follow these guidelines throughout the component lifecycle.
        `,

        {},
        async (): Promise<CallToolResult> => {
            return {
                content: [
                    {
                        type: "text",
                        text: UI_INSTRUCTIONS
                    }
                ]
            };
        }
    );

    // Reviewing PRs

    // Refactoring

    return server;
}

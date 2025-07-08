import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import {
    TESTING_INSTRUCTIONS,
    TestingInstructions,
    UI_INSTRUCTIONS
} from "./generated/instructions.js";
import { ResourcesProvider } from "./resources-provider.js";
import path from "path";
import fs from "fs/promises";

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
                tools: {},
                resources: {},
                prompts: {}
            }
        }
    );

    // Initialize resources provider
    const resourcesPath = path.join(process.cwd(), "resources");
    const resourcesProvider = new ResourcesProvider(resourcesPath);

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

    // Register the pr-review resource
    server.registerResource(
        "pr-review",
        `file://${path.join(resourcesPath, "pr-review.md")}`,
        {
            title: "PR Review",
            description: "Helps with reviewing branches and pull requests.",
            mimeType: "text/markdown"
        },
        async (uri: URL) => {
            return await resourcesProvider.readResource(uri.href);
        }
    );

    // Register PR review prompt
    server.registerPrompt(
        "pr-review",
        {
            title: "PR Review",
            description: "Helps with reviewing branches and pull requests.",
            argsSchema: {}
        },
        async () => {
            const prReviewPath = path.join(resourcesPath, "pr-review.md");
            const prReviewContent = await fs.readFile(prReviewPath, "utf8");
            
            return {
                messages: [
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: prReviewContent
                        }
                    }
                ]
            };
        }
    );


    // Refactoring

    return server;
}

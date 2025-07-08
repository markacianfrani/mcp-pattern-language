import fs from "fs/promises";
import path from "path";
import { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";

export class ResourcesProvider {
    private resourcesPath: string;

    constructor(resourcesPath: string) {
        this.resourcesPath = resourcesPath;
    }

    async readResource(uri: string): Promise<ReadResourceResult> {
        try {
            if (!uri.startsWith("file://")) {
                throw new Error("Invalid URI scheme");
            }

            const filePath = uri.slice(7);

            const relativePath = path.relative(this.resourcesPath, filePath);
            if (
                relativePath.startsWith("..") ||
                path.isAbsolute(relativePath)
            ) {
                throw new Error(
                    "Access denied: File is outside of resources directory"
                );
            }

            const contents = await fs.readFile(filePath, "utf8");

            return {
                contents: [
                    {
                        uri,
                        mimeType: filePath.endsWith(".md")
                            ? "text/markdown"
                            : "text/plain",
                        text: contents
                    }
                ]
            };
        } catch (error) {
            console.error("Error reading resource:", error);
            throw error;
        }
    }
}
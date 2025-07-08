# My Rules

An MCP server for all my rules, prompts, etc etc. Allows agents to call rules on demand. 

> There's no point filling 4 paragraphs of instructions for how to write tests if your current session isn't going to write a test.

Spiritually similar to Cursor's rules.

## Usage

### Claude Code

```
claude mcp add --transport http rules https://mcp.cianfrani.dev/mcp
```

### Cursor

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=rules&config=eyJjb21tYW5kIjoibnB4IG1jcC1yZW1vdGUgaHR0cHM6Ly9tY3AuY2lhbmZyYW5pLmRldi9tY3AifQ%3D%3D)

### Claude Desktop 

```json
{
    "rules": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.cianfrani.dev/mcp"
      ]
    }
}
```

## What's It Do? 

Allows coding agents to lookup rules on demand within the context of their current task. 

```
> write a test for @calc.py
  ⎿  Read calc.py (26 lines)

⏺ rules:get_rules_for_writing_tests (MCP)(language: "python")
  ⎿  - Before testing a protected method, ask "Can this logic be adequately tested through the public interface?". If yes, don't test the protected method directly.
     If no, continue testing the protected method.
     - Remember to write tests using the Arrange, Act, Assert pattern.
     … +12 lines (ctrl+r to expand)

⏺ Write(test_calc.py)
```

## Why? 

- It's really annoying trying to carry all these little notes between projects/IDEs.
- I don't want to have to manually invoke rules. 

## How's It Work? 

Clearly-defined tool descriptions allow the agent to fetch rules on demand, only if they appear to be relevant. 


## What Doesn't work? 

- Patterns must be associated with a specific action. For example, "writing tests", "authoring UI", "reviewing a PR". 
- The agent ultimately decides if it's going to call the tool. Sometimes it does. Sometimes it doesn't. 


## Tools 


1. `get_rules_for_writing_tests`
   - Use when: writing any type of test, 
   - Inputs:
     - `language` (string)
2. `get_rules_for_composing_ui`
  - Use when: creating new frontend components

## Prompts

> In Claude Code, invoke prompts as slash commands. 

1. `pr-review`
  - Use when: you want feedback on a unit of work 
  - /pr-review
  - See [resources/pr-review.md](./resources/pr-review.md) for the full template.

## Resources

- [Deploying this shit on netlify](https://developers.netlify.com/guides/write-mcps-on-netlify/)

## Dev 
1. Start the server

```
npm run dev
```

2. Open MCP inspector
```
npm run inspect
```
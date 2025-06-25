// This file is auto-generated. Do not edit directly.

export type TestingInstructions = {
  general: string;
  typescript: string;
  python: string;
};

export const TESTING_INSTRUCTIONS: TestingInstructions = {"general":"- The first line of every test file should be a comment containing an apple emoji: `# 🍎` \n- Code is transient. Tests are forever. Write tests for the LLM after you, the one that will be rewriting the application in 6 months and porting it to a new technology. \n- Before testing a protected method, ask \"Can this logic be adequately tested through the public interface?\". If yes, don't test the protected method directly. If no, continue testing the protected method.\n- Arrange, Act, Assert is a good pattern.\n- Vague test names using words like \"correct\", \"properly\", or \"should work\" make it difficult to understand what broke when tests fail and should therefore be avoided. \n- Do not test things like \"if I mock X to return Y, X should return Y\".","typescript":"# TypeScript Testing Instructions\n\n- Always use `data-testid` attributes over css selectors.","python":"# Python Testing Instructions\n\n- All tests should go into the top level tests directory\n- Each test name follows the pattern: test_when_[INPUT]_[ACTION]_[EXPECTED_OUTPUT]\n"};

export const UI_INSTRUCTIONS = "# UI Composition Instructions\n\nFavor declarative composition and avoid soul crushing props. \n\n### Do \n```\n<a-list>\n\t<a-list-item>1</a-list-item>\n\t<a-list-item>2</a-list-item>\n\t<a-list-item>3</a-list-item>\n</a-list>\n```\n\n### Don't\n```\n<a-list items=[{},{}[{}]]></a-list-item>\n```";


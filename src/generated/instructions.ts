// This file is auto-generated. Do not edit directly.

export const GENERAL_INSTRUCTIONS = "- The first line of every test file should be a comment containing an apple emoji: `# 🍎` \n- Before testing a protected method, ask \"Can this logic be adequately tested through the public interface?\". If yes, don't test the protected method directly. If no, continue testing the protected method.\n- Remember to write tests using the Arrange, Act, Assert pattern.\n- Vague test names using words like \"correct\", \"properly\", or \"should work\" make it difficult to understand what broke when tests fail and should therefore be avoided. ";

export type TestingInstructions = {
  [K in "typescript" | "python"]: string;
};

export const TESTING_INSTRUCTIONS: TestingInstructions = {"typescript":"# TypeScript Testing Instructions\n\n- Always use `data-testid` attributes over css selectors.","python":"# Python Testing Instructions\n\n- All tests should go into the top level tests directory\n- Each test name follows the pattern: test_when_[INPUT]_[ACTION]_[EXPECTED_OUTPUT]\n"};


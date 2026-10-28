# Rule: No Automated Browser Testing & No Browser Subagents

1. **Strict Prohibition on Browser Automation**:
   - The agent MUST NEVER call `browser_subagent` or open any browser windows.
   - Do NOT run automated browser UI/UAT testing, screenshot capturing, or visual verification loops.
   - The user will conduct all manual and visual testing directly in their own browser.

2. **Direct Task Execution**:
   - Focus directly and exclusively on implementing the specific code, layout, scripts, and tasks requested.
   - Verify code using fast, lightweight non-interactive tools (such as `tsc --noEmit` or unit test runners) only when necessary, and avoid redundant verification steps that waste tokens or time.

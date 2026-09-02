---
name: gitpush
description: Automatically check repository git status, stage changed files, commit with a concise conventional message, and push to origin.
---

# /gitpush Skill Workflow

When the user runs `/gitpush` or asks to commit and push changes:

1. **Check Status**:
   Run `git status -s` to inspect all modified and untracked files.
2. **Review Changes**:
   Ensure temporary files or unwanted files (e.g., local `.env.local` with secrets) are not being inadvertently committed.
3. **Stage Files**:
   Run `git add -A`.
4. **Create Commit**:
   - If the user provided a message, use it.
   - Otherwise, generate a descriptive conventional commit message based on the recent changes (e.g., `feat: integrate firebase client and server actions`).
5. **Push to Remote**:
   Run `git push origin HEAD` or `git push`.
6. **Report Confirmation**:
   Output the commit hash and branch pushed to the user.

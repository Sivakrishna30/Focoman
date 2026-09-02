---
name: deploy
description: Pre-validate TypeScript build, check Firebase target project, and deploy hosting and firestore rules to Firebase (focoman.web.app).
---

# /deploy Skill Workflow

When the user runs `/deploy` or asks to deploy the project to Firebase:

1. **Pre-Deployment Typecheck**:
   Run TypeScript validation in `apps/web`:
   ```bash
   node_modules/.bin/tsc --noEmit --project tsconfig.json
   ```
   If there are errors, stop and report them to the user immediately.

2. **Verify Target Project**:
   Ensure the active Firebase project is `focoman`:
   ```bash
   npx firebase use
   ```

3. **Execute Deployment**:
   Deploy hosting assets and Firestore rules:
   ```bash
   npx firebase deploy
   ```

4. **Verify Live URL**:
   Provide the live deployed URLs:
   - Hosting: `https://focoman.web.app` / `https://focoman.firebaseapp.com`
   - Console: `https://console.firebase.google.com/project/focoman`

---
title: Playwright E2E Testing
description: Configure Playwright for end-to-end testing
weight: 12
lastmod: 2022-11-20T10:23:30-09:00
draft: false
vimeo: 773632607
emoji: 🎭
video_length: 2:56
quiz: true
---

<quiz-modal options="Runs in the browser:uses async/await:runs tests in parallel:can help reduce bugs" answer="Runs in the browser" prize="5">
  <h6>What is the main way End-to-End testing differs from unit testing?</h6>
</quiz-modal>

Playwright docs: https://playwright.dev/docs/intro

To initialize playwrigh in your repo:

```bash
yarn create playwright
```

Updates to the playwright.config.ts file:

```ts
const config = {
  // only change the following properties
  webServer: {
    command: "yarn dev",
    port: 1337, // should match the port you gave in our vite.config file
    reuseExisitingServer: true,
  },
  fullyParallel: false,
  projects: [
    {
      name: "Google Chrome",
      use: {
        channel: "chrome",
      },
    },
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 5"],
      },
    },
  ],
};
```

Installing the `detect-port` package:

```bash
yarn add -D detect-port
```

e2e/utils.ts:

```ts
import { execSync } from "child_process";
import detect from "detect-port";

export async function setupE2eTest() {
  await startSupabase();
  reseedDb();
}

async function startSupabase() {
  const port = await detect(64321);
  if (port !== 64321) {
    return;
  }
  console.warn("Supabase not detected - Starting it now");
  execSync("npx supabase start");
}

function reseedDb() {
  execSync(
    "PGPASSWORD=postgres psql -U postgres -h 127.0.0.1 -p 64322 -f supabase/clear-db-data.sql",
    // for Windows:
    // "SET PGPASSWORD=postgres&&psql -U postgres -h 127.0.0.1 -p 54322 -f supabase/clear-db-data.sql"
    { stdio: "ignore" }
  );
}
```

clear-db-data.sql

```sql
truncate table auth.users cascade
```

Playwright VS Code plugin: https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright

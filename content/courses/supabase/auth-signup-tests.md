---
title: Signup Flow Tests
description: Setup end-to-end tests for the signup flow
weight: 30
lastmod: 2022-11-20T10:23:30-09:00
draft: false
vimeo: 773628737
emoji: 🐵
video_length: 1:24
chapter_start: User Auth
---

Experiment with the live site: https://supaship.io

Sign-up-flow e2e tests in source code: https://github.com/fireship-io/supaship.io/blob/course-end-point/e2e/sign-up-flow.spec.ts

e2e/sign-up-flow.spec.ts:

```ts
import { test, expect } from "@playwright/test";
import { login, setupE2eTest, signUp } from "./utils";

test.describe("User auth", () => {
  const userEmail = "test@test.io";
  const userPassword = "test123456";
  const userName = "testuser";
  test.beforeEach(setupE2eTest);
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:1337");
  });
  test("new user can signup", async ({ browser, page }) => {
    await signUp(page, userEmail, userPassword, userName);
  });

  test("after signing up, user can login from another machine", async ({
    browser,
    page,
  }) => {
    await signUp(page, userEmail, userPassword, userName);
    const newMachine = await browser.newPage();
    await newMachine.goto("http://localhost:1337");
    await login(newMachine, userEmail, userPassword, userName);
  });

  test("after signing up, user is logged in on a new tab", async ({
    context,
    page,
  }) => {
    await signUp(page, userEmail, userPassword, userName);
    const newTab = await context.newPage();
    await newTab.goto("http://localhost:1337");
    const logoutButton = newTab.locator("button", { hasText: "Logout" });
    await expect(logoutButton).toHaveCount(1);
  });

  test('user without a username gets redirected to "/welcome"', async ({
    page,
  }) => {
    await signUp(page, userEmail, userPassword, userName, true);
    await page.goto("http://localhost:1337");
    const welcomeNotice = page.locator("h2", {
      hasText: "Welcome to Supaship!",
    });
    await expect(welcomeNotice).toHaveCount(1);
  });

  test('a user with a username get sent back home if they visit "/welcome"', async ({
    page,
  }) => {
    await signUp(page, userEmail, userPassword, userName);
    await page.goto("http://localhost:1337/welcome");
    const welcomeNotice = page.locator("h2", {
      hasText: "Welcome to Supaship!",
    });
    await expect(welcomeNotice).toHaveCount(0);
    const logoutButton = page.locator("button", { hasText: "Logout" });
    await expect(logoutButton).toHaveCount(1);
  });

  test('a logged out user goes to "/" if they visit "/welcome"', async ({
    page,
  }) => {
    await page.goto("http://localhost:1337/welcome");
    await page.waitForNavigation({
      url: "http://localhost:1337/",
      timeout: 2000,
    });
    const welcomeNotice = page.locator("h2", {
      hasText: "Welcome to Supaship!",
    });
    await expect(welcomeNotice).toHaveCount(0);
  });

  test.describe("username validation", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("http://localhost:1337");
      await signUp(page, userEmail, userPassword, userName, true);
    });
    test("it should not allow an empty username", async ({ page }) => {
      const userNameInput = page.locator("input[name='username']");
      const submitButton = page.locator("button", { hasText: "Submit" });
      const validation = page.locator("p.validation-feedback");
      await userNameInput.fill("");
      await expect(submitButton).toBeDisabled();
      await page.keyboard.press("Enter");
      const welcomeHeader = page.locator("h2", {
        hasText: "Welcome to Supaship!",
      });
      await expect(welcomeHeader).toHaveCount(1);
    });

    test("it should not allow spaces in the username", async ({ page }) => {
      const userNameInput = page.locator("input[name='username']");
      const submitButton = page.locator("button", { hasText: "Submit" });
      const validation = page.locator("p.validation-feedback");
      await userNameInput.fill("hello world");
      await expect(submitButton).toBeDisabled();
      await page.keyboard.press("Enter");
      const welcomeHeader = page.locator("h2", {
        hasText: "Welcome to Supaship!",
      });
      await expect(welcomeHeader).toHaveCount(1);
      await expect(validation).toHaveText(
        "Username can only contain letters, numbers, and underscores"
      );
    });
    test("it should not allow usernames longer than 15 characters", async ({
      page,
    }) => {
      const userNameInput = page.locator("input[name='username']");
      const submitButton = page.locator("button", { hasText: "Submit" });
      const validation = page.locator("p.validation-feedback");
      await userNameInput.fill("asdfhkdasfljfjdakdlsjflakdsjflkasdjflak");
      await expect(submitButton).toBeDisabled();
      await page.keyboard.press("Enter");
      const welcomeHeader = page.locator("h2", {
        hasText: "Welcome to Supaship!",
      });
      await expect(welcomeHeader).toHaveCount(1);
      await expect(validation).toHaveText(
        "Username must be less than 15 characters long"
      );
    });

    test("it should not allow usernames less than 3 characters", async ({
      page,
    }) => {
      const userNameInput = page.locator("input[name='username']");
      const submitButton = page.locator("button", { hasText: "Submit" });
      const validation = page.locator("p.validation-feedback");
      await userNameInput.fill("asd");
      await expect(submitButton).toBeDisabled();
      await page.keyboard.press("Enter");
      const welcomeHeader = page.locator("h2", {
        hasText: "Welcome to Supaship!",
      });
      await expect(welcomeHeader).toHaveCount(1);
      await expect(validation).toHaveText(
        "Username must be at least 4 characters long"
      );
    });
  });

  test("it should not allow duplicate usernames", async ({ page }) => {
    await signUp(page, userEmail, userPassword, userName);
    const logoutButton = page.locator("button", { hasText: "Logout" });
    await logoutButton.click();
    const signInButton = page.locator("button", { hasText: "Login" });
    await expect(signInButton).toHaveCount(2);
    await signUp(page, `${userEmail}io`, userPassword, userName, true);
    const userNameInput = page.locator("input[name='username']");
    const submitButton = page.locator("button", { hasText: "Submit" });
    const validation = page.locator("p.validation-feedback");
    await userNameInput.fill(userName);
    // potential for eager name validation here later
    await expect(submitButton).toBeEnabled();
    await page.keyboard.press("Enter");
    const welcomeHeader = page.locator("h2", {
      hasText: "Welcome to Supaship!",
    });
    await expect(welcomeHeader).toHaveCount(1);
    await expect(validation).toHaveText(`Username "testuser" is already taken`);
  });
});
```

e2e/utils.ts:

```ts
import { execSync } from "child_process";
import detect from "detect-port";
import { Page, expect } from "@playwright/test";

export async function setupE2eTest() {
  await startSupabase();
  reseedDb();
}

async function startSupabase() {
  const port = await detect(54321);
  if (port !== 21) {
    return;
  }
  console.warn("Supabase not detected - Starting it now");
  execSync("npx supabase start");
}

function reseedDb() {
  execSync(
    "PGPASSWORD=postgres psql -U postgres -h 127.0.0.1 -p 54322 -f supabase/clear-db-data.sql",
    // for Windows:
    // "SET PGPASSWORD=postgres&&psql -U postgres -h 127.0.0.1 -p 54322 -f supabase/clear-db-data.sql"
    { stdio: "ignore" }
  );
}

export async function signUp(
  page: Page,
  email: string,
  password: string,
  userName: string,
  skipUserName = false
) {
  const signUpButton = page.locator("button", { hasText: "Sign Up" }).first();
  await signUpButton.click();
  const emailInput = page.locator('input[name="email"]');
  await emailInput.fill(email);
  const passwordInput = page.locator('input[name="password"]');
  await passwordInput.fill(password);
  await page.keyboard.press("Enter");
  const welcomeNotice = page.locator("h2", { hasText: "Welcome to Supaship!" });
  await expect(welcomeNotice).toHaveCount(1);
  if (skipUserName) {
    return;
  }
  const usernameInput = page.locator('input[name="username"]');
  await usernameInput.fill(userName);
  const submitButton = page.locator("button", { hasText: "Submit" });
  await expect(submitButton).toBeEnabled();
  await page.keyboard.press("Enter");
  const logoutButton = page.locator("button", { hasText: "Logout" });
  await expect(logoutButton).toHaveCount(1);
}

export async function login(
  page: Page,
  email: string,
  password: string,
  username: string,
  loginButtonSelector = "button"
) {
  const signUpButton = page
    .locator(loginButtonSelector, { hasText: "Login" })
    .first();
  await signUpButton.click();
  const emailInput = page.locator('input[name="email"]');
  await emailInput.fill(email);
  const passwordInput = page.locator('input[name="password"]');
  await passwordInput.fill(password);
  await page.keyboard.press("Enter");
  const logoutButton = page.locator("button", { hasText: "Logout" });
  await expect(logoutButton).toHaveCount(1);
  const usernameMention = page.locator("h2", { hasText: username });
  await expect(usernameMention).toHaveCount(1);
}

export async function createPost(page: Page, title: string, contents: string) {
  page.goto("http://localhost:1337/1");
  const postTitleInput = page.locator(`input[name="title"]`);
  const postContentsInput = page.locator(`textarea[name="contents"]`);
  const postSubmitButton = page.locator(`button[type="submit"]`);
  await postTitleInput.fill(title);
  await postContentsInput.fill(contents);
  await postSubmitButton.click();
  const post = page.locator("h3", { hasText: title });
  await expect(post).toHaveCount(1);
  return post;
}
```

---
title: Testing
description: Test-driven development made easy
weight: 12
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027462516
emoji: 🔬
video_length: 5:18
quiz: true
---

<quiz-modal options="true:false" answer="false" prize="3">
  <h5>In Deno, you can only write tests in a dedicated file like, main_test.ts</h5>
</quiz-modal>


## Deno Testing Examples

{{< file "ts" "main_test.ts" >}}
```typescript
import { expect } from "jsr:@std/expect";
import { assertEquals, assertNotMatch, assertExists, assertMatch, assertGreater } from "@std/assert";

// Function to Test
function multiply(a: number, b: number) {
    return a * b;
}


// Basic Assertions
Deno.test(function multiplyTest() {
    assertEquals(multiply(2, 2), 4);
    assertEquals(multiply(2, 3), 6);
});

// Jest-style expect
Deno.test("multiply test", () => {
    expect(multiply(2, 3)).toBe(6);
});

// Async Test
Deno.test("mock API call", async () => {
    const mockApi = () => Promise.resolve("mock data");
    const result = await mockApi();
    assertEquals(result, "mock data");
});

// Multi-step Test
Deno.test("database lib", async (t) => {
    // Setup Logic
    const db = new Map()

    await t.step("db exists", () => {
        assertExists(db)
    });

    await t.step("insert user", () => {
        db.set('user', 'jeff');

        assertGreater(db.size, 0)
        assertMatch(db.get('user'), /jeff/)
        assertNotMatch(db.get('user'), /Bob/)

    });

});
```
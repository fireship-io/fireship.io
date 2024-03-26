---
title: User Auth
description: Implement email/password user authentication
weight: 23
lastmod: 2024-03-22T10:23:30-09:00
draft: false
vimeo: 927648917
emoji: 🫂
video_length: 2:10
---

### Code


Create a React server component for the login page:

{{< file "react" "app/user/page.tsx" >}}
```tsx
import LoginForm from "./LoginForm";

export default function Login() {
    return (
      <div>
        <h1>Login</h1>
        <LoginForm />
      </div>
    );
  }
```

Create a client component for the main login form:

{{< file "react" "app/user/LoginForm.tsx" >}}
```tsx
"use client";

import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);

    const randomEmail = `${Math.random().toString(36).substring(7)}@example.com`;
    const password = "Password69420";

    const { data, error } = await supabase.auth.signUp({
      email: randomEmail,
      password,
    });

    if (error) {
      console.error(error);
    } else {
      console.log("User created and logged in:", data);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleSignUp}
      disabled={loading}
    >
      {loading ? "Signing up..." : "Sign up with random email and password"}
    </button>
  );
}
```


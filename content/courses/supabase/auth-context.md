---
title: User Context
description: Use React context to access user data
weight: 32
lastmod: 2022-11-20T10:23:30-09:00
draft: false
vimeo: 773629204
emoji: 🌲
video_length: 1:19
---

After this lesson, your App.tsx should look like this:

```tsx
import { createContext } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import MessageBoard from "./MessageBoard";
import AllPosts from "./AllPosts";
import PostView from "./PostView";
import Welcome, { welcomeLoader } from "./Welcome";
import NavBar from "./NavBar";
import { SupashipUserInfo, useSession } from "./use-session";

const router = createBrowserRouter([
  /* routing hasn't changed */
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

export const UserContext = createContext<SupashipUserInfo>({
  session: null,
  profile: null,
});

function Layout() {
  const supashipUserInfo = useSession();
  return (
    <>
      <UserContext.Provider value={supashipUserInfo}>
        <NavBar />
        <Outlet />
      </UserContext.Provider>
    </>
  );
}
```

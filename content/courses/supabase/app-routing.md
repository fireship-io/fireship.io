---
title: Routing and Layout
description: Design the layout and routing structure with React Router
weight: 20
lastmod: 2022-11-20T10:23:30-09:00
draft: false
vimeo: 773633416
emoji: 🚆
video_length: 1:33
quiz: true
chapter_start: App Architecture
---

React Router docs: https://reactrouter.com/en/main

Command to install react router:

```bash
yarn add react-router-dom
```

Routes for our app:

```ts
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <MessageBoard />,
        children: [
          {
            path: ":pageNumber",
            element: <AllPosts />,
          },
          {
            path: "post/:postId",
            element: <PostView />,
          },
        ],
      },
      {
        path: "welcome",
        element: <Welcome />,
        loader: welcomeLoader,
      },
    ],
  },
]);
```

Our starting NavBar component:

```tsx
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <>
      <nav className="nav-bar">
        <Link className="nav-logo-link" to="/">
          <img
            id="logo"
            className="nav-logo"
            src="https://supaship.io/supaship_logo_with_text.svg"
            alt="logo"
          />
        </Link>

        <ul className="nav-right-list">
          <li className="nav-message-board-list-item">
            <Link to="/1" className="nav-message-board-link">
              message board
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
```
---
title: Login Screen
description: Build the UI for login and signup
weight: 33
lastmod: 2022-11-20T10:23:30-09:00
draft: false
vimeo: 773629294
emoji: 🤳
video_length: 3:07
---

## Login Components

Updated NavBar.tsx:

```tsx
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./App";
import Login from "./Login";
import UserMenu from "./UserMenu";

export default function NavBar() {
  const { session } = useContext(UserContext);
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
          <li className="nav-auth-item">
            {session?.user ? <UserMenu /> : <Login />} // see a bit further down
            for the UserMenu.tsx file!
          </li>
        </ul>
      </nav>
    </>
  );
}
```

Updated MessageBoard.tsx:

```tsx
export default function MessageBoard() {
  const userProfile = useContext(UserContext);
  return (
    <div className="message-board-container">
      <Link to="/1">
        <h2 className="message-board-header-link">Message Board</h2>
      </Link>
      {userProfile.session ? (
        <></>
      ) : (
        <h2
          className="message-board-login-message"
          data-e2e="message-board-login"
        >
          Yo Dawg. you gotta <Login /> to join in the discussion.
        </h2>
      )}
      <Outlet />
    </div>
  );
}
```

Dialog.tsx:

```tsx
import { useEffect, useRef, useState } from "react";

export interface DialogProps {
  allowClose?: boolean;
  contents: React.ReactNode;
  open: boolean;
  dialogStateChange?: (open: boolean) => void;
}

export default function Dialog({
  allowClose = true,
  contents,
  open,
  dialogStateChange = () => {},
}: DialogProps) {
  const [showModal, setShowModal] = useState(open);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open !== showModal) {
      setShowModal(open);
    }
  }, [open]);

  function updateDialogState(open: boolean) {
    setShowModal(open);
    dialogStateChange(open);
  }

  return showModal ? (
    <>
      <div className="dialog-container"></div>
      <div
        onClick={({ target }) => {
          if (!allowClose || dialog.current?.contains(target as any)) {
            return;
          }
          updateDialogState(false);
        }}
        onKeyDown={({ key }) => {
          if (!allowClose || key !== "Escape") {
            return;
          }
          updateDialogState(false);
        }}
        className="dialog-backdrop"
      >
        <div className="dialog-placement">
          <div className="relative group">
            <div className="dialog-accent-border group-hover:opacity-100 group-hover:duration-2000"></div>
            <div ref={dialog} className="dialog-content-container">
              {contents}
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
}
```

Login.tsx:

```tsx
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./App";
import Dialog from "./Dialog";
import { supaClient } from "./supa-client";

export default function Login() {
  const [showModal, setShowModal] = useState(false);
  const [authMode, setAuthMode] = useState<"sign_in" | "sign_up">("sign_in");
  const { session } = useContext(UserContext);

  useEffect(() => {
    if (session?.user) {
      setShowModal(false);
    }
  }, [session]);

  return (
    <>
      <div className="flex m-4 place-items-center">
        <button
          className="login-button"
          onClick={() => {
            setAuthMode("sign_in");
            setShowModal(true);
          }}
        >
          login
        </button>{" "}
        <span className="p-2"> or </span>{" "}
        <button
          className="login-button"
          onClick={() => {
            setAuthMode("sign_up");
            setShowModal(true);
          }}
        >
          sign up
        </button>
      </div>
      <Dialog
        open={showModal}
        dialogStateChange={(open) => setShowModal(open)}
        contents={
          <>
            <Auth
              supabaseClient={supaClient}
              appearance={{
                theme: ThemeSupa,
                className: {
                  container: "login-form-container",
                  label: "login-form-label",
                  button: "login-form-button",
                  input: "login-form-input",
                },
              }}
              view={authMode}
            />
            <button onClick={() => setShowModal(false)}>Close</button>
          </>
        }
      />
    </>
  );
}
```

UserMenu.tsx:

```tsx
import { useContext } from "react";
import { UserContext } from "./App";
import { supaClient } from "./supa-client";

export default function UserMenu() {
  const { profile } = useContext(UserContext);

  return (
    <>
      <div className="flex flex-col">
        <h2>Welcome {profile?.username || "dawg"}.</h2>
        <button
          onClick={() => supaClient.auth.signOut()}
          className="user-menu-logout-button"
        >
          Logout
        </button>
      </div>
    </>
  );
}
```

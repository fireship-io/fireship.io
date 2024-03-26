---
title: Next.js Setup
description: Create a new Next.js project
weight: 21
lastmod: 2024-03-22T10:23:30-09:00
draft: false
vimeo: 927649061
emoji: ⚛️
video_length: 3:07
---

### Commands

Refer to the [Next.js documentation](https://nextjs.org/docs/getting-started/installation)

```bash
npx create-next-app my-app

cd my-app

# optional styling libraries
npm i -D @tailwindcss/typography daisyui

# install Stripe
npm i stripe @stripe/stripe-js

npm run dev
```


### Code

Add Environment Variables to your `.env.local` file.

{{< file "cog" ".env.local" >}}
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_
STRIPE_SECRET_KEY=sk_test_
STRIPE_WEBHOOK_SECRET=whsec_
```

Remove the Next.js boilerplate.

{{< file "react" "app/page.tsx" >}}
```tsx
export default function Home() {
  return (
    <main>

    </main>
  );
}
```

Optionally, update your Tailwdind configuration to include the DaisyUI and Tailwind Typography plugins for rapid styling.

{{< file "tailwind" "tailwind.config.ts" >}}
```typescript
import type { Config } from "tailwindcss";
import daisyui from 'daisyui';
import tailwindTypography from '@tailwindcss/typography';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {

  },
  plugins: [
    tailwindTypography,
    daisyui,
  ],
};
export default config;
```
---
title: Server Actions
description: Create functions that run on the server
weight: 44
lastmod: 2023-05-04T11:11:30-09:00
draft: false
youtube: O94ESaJtHtM
emoji: 🧑‍🚀
video_length: 7:31
---

Next.js [Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions) allow us to create one-off functions alongside components that run on the server. They can often be a simpler alternative to API routes for data mutations. 

## Opt-in

Next actions are not fully-stable yet, so you must opt-in via the`next.config.js` file.

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
```

## Form Mutation Example

Handle form submissions and automatically re-render the UI without a full page load. 

{{< file "react" "dogs/[id]/edit/page.tsx" >}}
```tsx
import kv from "@vercel/kv";
import { revalidatePath } from "next/cache";

interface Dog {
  name: string;
  image: string;
  breed: string;
}

export default async function DogEditPage({
  params,
}: {
  params: { id: string };
}) {

  // Fetch data
  const key = `dogs:${params.id}`;
  const dog = await kv.get<Dog>(key);

  async function upDog(formData: FormData) {
    "use server";

    // Mutate data
    await kv.set(key, {
      name: formData.get("title"),
      image: formData.get("image"),
      breed: formData.get("breed"),
    });

    // Revalidate
    revalidatePath(`/dogs/${params.id}/edit`);
    
  }

  return (
      <div className={styles.cardBody}>
        <h2>Edit {dog?.name}</h2>

        <form action={myAction}>
          <label>Name</label>
          <input name="title" type="text" defaultValue={dog?.name} />
          <label>Image</label>
          <input name="image" type="text" defaultValue={dog?.image} />
          <label>Breed</label>
          <input name="breed" type="text" defaultValue={dog?.breed} />
          <button type="submit">Save and Continue</button>

        </form>
      </div>
  );
}
```

## Skeleton UI Example

Create a skeleton UI in the `loading.tsx` file. 

{{< file "react" "loading.tsx" >}}
```tsx
import styles from "./page.module.scss";

export default function Loading() {
  return (
    <div className={styles.card}>
      <div className={`${styles.cardImg} ${styles.skeleton}`}></div>
      <div className={styles.cardBody}>
        <h2 className={`${styles.cardTitle} ${styles.skeleton}`}></h2>
        <p className={`${styles.cardIntro} ${styles.skeleton}`}></p>
      </div>
    </div>
  );
}

```

{{< file "scss" "page.module.scss" >}}
```css
.card {
	display: flex;
	flex-direction: column;
	flex-basis: 300px;
	flex-shrink: 0;
	flex-grow: 0;
	max-width: 100%;
	background-color: #FFF;
	box-shadow: 0 5px 10px 0 rgba(#000, .15);
	border-radius: 10px;
	overflow: hidden;
	margin: 1rem;
	max-width: 300px;
}

.cardImg {
	aspect-ratio: 16/9;
	position: relative;
	overflow: hidden;
	img {
		position: absolute;
		width: 100%;
	}
}

.cardBody {
	padding: 1.5rem;
}

.cardTitle {
	font-size: 1.25rem;
	line-height: 1.33;
	font-weight: 700;
	&.skeleton { 
		min-height: 28px;
		border-radius: 4px;
	}
}

.cardIntro {
	margin-top: .75rem;
	line-height: 1.5;
	&.skeleton { 
		min-height: 72px;
		border-radius: 4px;
	}
}

// THE LOADING EFFECT
.skeleton {
	background-color: #e2e5e7;
	background-image:			
			linear-gradient(
				90deg, 
				rgba(#fff, 0), 
				rgba(#fff, 0.5),
				rgba(#fff, 0)
			);
	background-size: 40px 100%; 
	background-repeat: no-repeat; 
	background-position: left -40px top 0; 
	animation: shine 1s ease infinite; 
}

@keyframes shine {
	to {
		background-position: right -40px top 0;
	}
}

```

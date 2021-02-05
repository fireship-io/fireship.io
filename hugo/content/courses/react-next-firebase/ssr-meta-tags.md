---
title: Metatags for SEO
description: Generate dynamic metatags for search engine optimization and social linkbots  
weight: 37
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 508686644
emoji: 🏷️
video_length: 2:01
---

## Metatags Component

{{< file "js" "components/Metatags.js" >}}
```javascript
import Head from 'next/head';

export default function Metatags({
  title = 'The Full Next.js + Firebase Course',
  description = 'A complete Next.js + Firebase course by Fireship.io',
  image = 'https://fireship.io/courses/react-next-firebase/img/featured.png',
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@fireship_dev" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}
```
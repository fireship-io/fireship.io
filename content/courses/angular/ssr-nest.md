---
title: Angular Universal with NestJS
description: Add server-side rendering to Angular with Nest.js
weight: 52
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 359196566
emoji: 🦅
video_length: 2:56
---

Create a server module using Angular Universal with the NestJS schematic.

[Nest Universal Schematic](https://github.com/nestjs/ng-universal)

## Steps 

### Add Universal and Nest

{{< file "terminal" "command line" >}}
```text
ng add @nestjs/ng-universal

npm run build:ssr
npm run serve:ssr
```

{{< file "ngts" "server/main.ts" >}}
```typescript
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 8080); // <-- update this line
}
bootstrap();
```
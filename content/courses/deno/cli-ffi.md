---
title: FFI
description: Run native code from non-JS languages
weight: 21
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027117812
emoji: 📖
video_length: 3:31
---


## String Uppercase in C

{{< file "c" "example.c" >}}
```c
#include <stdio.h>
#include <ctype.h>

void toUpperCase(char *str) {
    for (int i = 0; str[i] != '\0'; i++) {
        str[i] = toupper(str[i]);
    }
}

// gcc -shared -o lib.dll example.c
```


## FFI in Deno

{{< file "ts" "ffi.ts" >}}
```typescript
const libName = "lib.dll"

const lib = Deno.dlopen(libName, {
  toUpperCase: {
    parameters: ["pointer"],
    result: "void",
  },
});


function toCString(str: string): Uint8Array {
    const encoder = new TextEncoder();
    const buffer = encoder.encode(str + "\0"); // Null-terminated string
    return buffer;
  }
  

export function toUpperCaseWithC(str: string): string {
  const buffer = toCString(str);
  const ptr = Deno.UnsafePointer.of(buffer);
  lib.symbols.toUpperCase(ptr);

  // Decode and return the modified string
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}
```
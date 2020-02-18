---
title: Modules
lastmod: 2020-02-18T09:12:30-08:00
draft: false
description: Learn how to import and export JS code as a module or package. 
weight: 9
emoji: 📦
free: true
featured_img: courses/javascript/img/modules-featured.png
---

{{< youtube qgRUr-YUk1Q >}}

A [module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) is just a file that exports some JavaScript code. 

First, a file exports (package) something useful...

{{< file "js" "awesome-pacakge.js" >}}
```js
export default '🧁';
```

Second, a different file uses this code by importing it. 

{{< file "js" "my-app.js" >}}

```js
import cupcake from '../path/to/awesome-package.js';
```

Pretty simple! But there more you should know.

## Default Exports

A module can specify at most 1 default export. 

```js
export default '🧁';
```

This allows the consumer to name the module whatever it prefers when importing. 

```js
// wait, that's not pizza...
import pizza from '../path/to/awesome-package';
```

This is ideal for modules that export a single class or function. 

## Named Exports

Some modules might offer a collection of independent helper functions, like RxJS or Lodash. A better option for such packages is *named exports*. 

```js
export const cupcake = '🧁';
export const pizza = '🍕';
```

If the consumer only wants pizza, they can import it by name - this is called [treeshaking](https://webpack.js.org/guides/tree-shaking/) or dead code elimination. 

```js
import { pizza } from '../path/to/awesome-package'; 
```

### How to change the name of an import?

If you don't like the exported name, you can change it with the `as` keyword. 

```js
import { pizza as awesomePizza } from '../path/to/awesome-package'; 

console.log(awesomePizza);
```

### How to export a list of variables?

A module may have many variables to export and this can get messy. Use an export list to make your code more succinct and organized.  

```js
const cupcake = '🧁';
const pizza = '🍕';

export { 
    cupcake,
    pizza
}
```

## Additional Resources

- Samantha Ming's [Module Cheatsheet](https://www.samanthaming.com/tidbits/79-module-cheatsheet/)
---
title: Improving long relative paths import
draft: false
author: Jorge Dacosta
type: lessons
description: Learn how to improve long relative paths when you're creating a slightly larger Angular application.
tags:
    - typescript
    - sass
    - angular
---

The purpose of this snippet is to show how to improve [imports of TypeScript modules](https://www.typescriptlang.org/docs/handbook/module-resolution.html) and **Sass** classes while we work on slightly bigger **Angular** apps.

# The nested paths headache

Working in larger or enterprise applications can be a big problem when you need to import a feature module or a style sheet file. See the imports below 😬:

{{< file "ngts" "post-details.component.ts" >}}
{{< highlight typescript >}}
import { SeoService } from '../../../../core/seo.service.ts';
import { PostsService } from '../../../services/posts.service.ts';

//...
{{< /highlight >}}

{{< file "scss" "post-details.component.scss" >}}
{{< highlight scss >}}
@import "../../../../theme/fonts";
@import "../../../../theme/breadcrumb";
{{< /highlight >}}

Does not look good! This can become a problem if you change the file location because you will have to rewrite each path that references this module or the scss class.

# Solving the problem 💪

### Typescript 
*Typescript* provides a great way to solve this kind of problems allowing us to customize a single global namespaces for our Feature Modules. To eliminate long relative paths let's add some options to our `tsconfig.json` located on root of our Angular app:

* `baseUrl` - Setting baseUrl informs the compiler where to find modules.
* Add `path` settings inside `CompilerOptions` - It will be an object which keys are path aliases that you will be able to use in your code, and the values are arrays of paths the alias will be resolved to.

{{% box icon="bug" class="box-red" %}}
Be careful with name collisions, I recommend prefix everything with the name of your app. 
{{% /box %}} 

{{< file "file" "tsconfig.json">}}
{{< highlight file >}}
{
    "CompilerOptions": {
        "baseUrl": "src",
        "paths": {
            "@core/*": ["app/core/*"]
            "@services/*": ["app/services/*"]
        }
    }
    # ...
}
{{< /highlight >}}

* Applying Nested Path Correction

{{< file "ngts" "post-details.component.ts" >}}
{{< highlight typescript >}}
import { SeoService } from '@core/seo.service.ts';
import { PostsService } from '@services/posts.service.ts';

//...
{{< /highlight >}}

### Sass
To solve scss classes imports, let's add options to our `angular.json`:

{{< file "file" "tsconfig.json">}}
{{< highlight file >}}
//... (ommited)
    "styles": [
        "src/styles.scss"
    ],
    "stylePreprocessorOptions": {       //👈 include this!
        "includePaths": [
            "styles/theme"
        ]
    },
{{< /highlight >}}

And with that simple change, our Sass code will now look like this:

{{< file "scss" "post-details.component.scss" >}}
{{< highlight scss >}}
@import "fonts";
@import "breadcrumb";
{{< /highlight >}}

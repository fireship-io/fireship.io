# 🖥️ _Eirbware_'s teaching website (prototype)

This website aims to host several formats of online teaching posts about
computer science dev tools.

This repository is here to develop a prototype website which would then be
managed by the [Eirbware](https://github.com/Eirbware) engineering school club.
It has been started from a fork of the open-source [_`fireship.io`_
website](https://github.com/fireship-io/fireship.io).

## 📃 Easily-editable open content

The content is intended to be easily addable and editable thanks to the Hugo
framework. Then, any student can straightforwardly contribute in the writing of
the course with pull requests.

### Content Overview

For this proof of concept, a given set of course formats are proposed to be put
in place. The website's sections are set-up in the purpose of showing their
advantages.

#### Standard Courses

A _standard course_ (`/courses/<a-course>/` section) is a tutorial about a
topic which contains the following pages:

- A _cover page_ (`/courses/<a-course>/_index.md` file) with a short
description of the considered problems and the notions which will be discovered
to solve them. The links to the related pages (see below) are indexed there.
- The _chapter pages_ are each focused on a precise subtopic to deal with it
with a short-but-meaningful text. The user, if he is logged in, can also mark
each chapter as read to see its progress.  
   All the chapter pages are in their _chapter group_ by being ordered
according to their [weight front-matter
parameter](https://gohugo.io/content-management/front-matter/#weight). The
_chapter group_ is then defined in a front-matter parameter in the markdown
file of its first page. Then, a table of content is displayed in the tutorial
pages.  
For naming the chapters' permalinks, the following naming convention is
proposed for the markdown file names: `/courses/<a-course>/<a-chapter-group-keyword>-<a-chapter>.md`.
- Out of the table of content, in the `/memo/` subsection, a standard course is
also attached by one or several _cheat-sheet page(s)_ with a straightforward
access of the useful content for a user who has already understood the general
topic.

All the published standard courses are listed in a fancy `/courses/` page. They
are also labeled with tags to enhance their referencing.

#### Tip posts

For useful tips which can be explained shortly, one-page posts
can be written in the `/tips/` section.

#### Didactic challenges

These pages are more experimental and contains practical exercises, e.g. for
users to learn a programming language. Their development needs frontend code
with an application layer that can be developed with svelte components in the
`app` directory.

### Contribute

To edit or add new content, all that users have to do is writing in Markdown
files in the `./content` folder. For each kind of content (see [the previous
section](#content-overview)), an archetype folder with many useful placeholders
in its markdown files can be generated thanks to the handy Hugo command below:

```sh
# in the repository's root
hugo new content ./content/<the-section-you-want>/<title-of-your-post>
```

For instance, an entire file tree in a new directory in the `/content` one can
be created with the command below:

```sh
# in the repository's root
hugo new content ./content/courses/<title-of-the-tutorial>
```

According to the path of each markdown page, the good layout is inferred and
then everyone can make content of a given kind from a same structure.

To get all the layout features that the Markdown syntax can enable, writers
might also want to read the placeholders of the course that the command above
generates and also check those doc pages :
[Built-in front-matter fields](https://gohugo.io/content-management/front-matter/#fields),
[Built-in shortcodes](https://gohugo.io/content-management/shortcodes/#embedded-shortcodes)

They might also need to read [this
page](https://gohugo.io/content-management/organization/) to know more about
how to correctly organize markdown files in the `./content` directory.

## Render the website

### Install dependencies

First, install [Hugo Extended](https://gohugo.io/getting-started/installing/)
ver `0.129.0` or greater.

Then, in the cloned repository's root, run the following command:

```bash
npm install
```

#### Connect with a playground backend

By writing the following credentials in the `app/.env.local` file, the application
features will be functional :

```.env
VITE_SUPABASE_URL=https://ewgpcyjmrccjopdjtqed.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3Z3BjeWptcmNjam9wZGp0cWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAyNjk1NzIsImV4cCI6MjAzNTg0NTU3Mn0._KFUPaMoOUwv-NYtPer1_lmLm_RCKrDdk-csP60hu0U
```

### Build for production

The layout uses Svelte components defined in the `app` directory, and these
components use `.scss` sheets in the `style` directory. Then, the files in both
theses folders must be built by the Vite framework with the command below

```bash
npm run vbuild
```

Then, the markdown content can be rendered in the deployable site in the
`public` directory by running this command

```bash
hugo
```

Both the commands above are bundled in the **production building command** below

```bash
npm run build
```

### Development rendering

#### Edit content only

First, build once the Svelte components in the `static` directory by running the
vite building command:

```bash
npm run vbuild
```

Then the website can be rendered with watching over the content by running the
Hugo dev server:

```bash
npm run hugo
```

If you want your draft pages to be rendered, then run

```bash
npm run hugo-dev
```

Check it on `http://localhost:6969/`.

#### Edit components and layout

Both the layout and the Hugo website can be concurrently built with watching
engines for development over as well the Markdown content as the
layout/application layer. To do that

```bash
npm run start
```

To do that with the draft pages rendered by Hugo, run

```bash
npm run dev
```

Check it on on `http://localhost:6969/`.

## Developing Components

Create a Svelte file in the `app/components` directory. It must have a custom
element tag.

```svelte
<svelte:options tag="hi-mom" />

<script>
  export let greeting: string;
</script>

<h1>Hi Mom! {greeting}</h1>
```

Export the component from `app/main.ts`:

```ts
export * from "./components/hi-mom.svelte";
```

Now use it in anywhere in your HTML or Markdown.

```html
<hi-mom greeting="i made a web component"></hi-mom>
```

**Note:** A weird caveat with Svelte web components is that all styles must be
encapsulated. You can use Tailwind, BUT only with `@apply` in the component.
Global styles will not work.

- `npm run svelte-dev`: Runs components in isolation. Serves `app/index.html`
as a playground for components.
- `npm run check`: Checks _typescript_ and _svelte_ syntax (scss checks has
been removed in cause of the unremovable and polluting `unknownAtRules`
warnings.

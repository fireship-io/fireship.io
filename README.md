# 🖥️ *Eirbware*'s teaching website (prototype)

This website aims to host several formats of online teaching posts about computer science dev tools.

This repository is here to develop a prototype website which would then be managed by the [Eirbware](https://github.com/Eirbware) engineering school club. It has been started from a fork of the open-source [*`fireshio.io`* website](https://github.com/fireship-io/fireship.io). .

## 📃 Easily-editable open content

The content is intended to be easily addable and editable thanks to the Hugo framework. Then, any student can straightforwardly
contribute in the writing of the course with pull requests.

### Content Overview

For this proof of concept, a given set of course formats are proposed to be put in place. The website's sections are set-up
in the purpose of showing their advantages.

#### Standard Courses

A *standard course* (`/courses/<a-course>/` section) is a tutorial about a topic which contains the following pages:

- A *cover page* (`/courses/<a-course>/_index.md` file) with a short description of the considered problems and the notions
  which will be discovered to solve them. The links to the related pages (see below) are indexed there.
- The *chapter pages* are each focused on a precise subtopic to deal with it
  with a short-but-meaningful text. The user, if he is logged in, can also mark each
  chapter as read to see its advancing bar.  
  All the chapter pages are in their *chapter group* thanks to their [slug](https://gohugo.io/content-management/organization/#slug)'s
  first keyword
(`/courses/<a-course>/<a-chapter-group-keyword>-<a-chapter>.md`) so a table of
content is displayed in the tutorial
- Out of the table of content, a standard course is also attached by a *cheat-sheet page* with a straightforward access of the useful content for a user who
  has already understood the general topic.

All the published standard courses are listed in a fancy `/courses/` page. They
are also labeled with tags to enhance their [referencing](#referencing).

#### Tip posts

For useful tips which can be explained shortly, one-page posts
can be written in the `/tips/` section. These posts can also be
published in answer to an interesting anonymous question, which
can be send from a *prompt box* on the website.

#### Didactic challenges

These pages are more experimental and contains practical exercises, e.g. for
users to learn a programming language. Their development needs frontend code
with an application layer that can be developed with svelte components in the `app` directory.

### Contribute

To edit or add new content, all that users have to do is writing in Markdown files
in the `/content` folder. For each kind of page (see [the previous section](#content-overview)), a template page with many useful placeholders can be generated thanks to the handy Hugo command below:

```sh
hugo new content /<the-section-you-want>/**<your-page>.md
```

According to the path of your new page, the good page kind is inferred and then
everyone can start one page of a given kind from a same content structure.

To get all the layout features that the Markdown syntax can enable,
writers might also want to check theses doc pages :
[Built-in front-matter fields](https://gohugo.io/content-management/front-matter/#fields),
[Built-in shortcodes](https://gohugo.io/content-management/shortcodes/#embedded-shortcodes)

## Render the website

### Install dependencies

First, install [Hugo Extended](https://gohugo.io/getting-started/installing/) ver `0.127.0` or greater.

Then, in the cloned repository's root, run the following command:

```bash
npm install
```

### Build for production

The layout uses Svelte components defined in the `app` directory, and these components  use `.scss` sheets in the `style` directory. Then, the files in both theses folders must be built by the Vite framework with the command below

```bash
npm run vbuild 
```

Then, the markdown content can be rendered in the deployable site in the `public` directory by running this command

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
engines for development as well over the Markdown content  as on the layout or
the application layer. To do that

```bash
npm run start
```

To do that with the draft pages rendered by Hugo, run

```bash
npm run dev
```

Check it on on `http://localhost:6969/`.

## Developing Components

Create a Svelte file in the `app/components` directory. It must have a custom element tag.

```svelte
<svelte:options tag="hi-mom" />

<script>
    export let greeting: string;
</script>

<h1>Hi Mom! {greeting}</h1> 
```

Export the component from `app/main.ts`:

```ts
export * from './components/hi-mom.svelte';
```

Now use it in anywhere in your HTML or Markdown.

```html
<hi-mom greeting="i made a web component"></hi-mom>
```

**Note:** A weird caveat with Svelte web components is that all styles must be encapsulated. You can use Tailwind, BUT only with `@apply` in the component. Global styles will not work.

- `npm run svelte-dev`: Runs components in isolation. Serves `app/index.html` as a playground for components.

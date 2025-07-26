# Fireship

The [Fireship PRO](https://fireship.io) course platform frontend built with Svelte, Tailwind, Hugo, Firebase, & Flamethrower. 

## Contributing

All static content is managed with Hugo in the `content` dir. You can easily fix typos by modifying the markdown directly in GitHub. 

### How to Run it

#### 1) Fork the repo

#### 2) Clone your repo

```console
git clone https://github.com/<Username>/fireship.io
```

#### 3) Install Hugo Extended (ver `0.101.0` or greater)

You can either build it from [source](https://gohugo.io/installation/windows/#build-from-source), or install it from a package manager

#### **Mac**

There are two sources where you can install [Hugo Extended](https://gohugo.io/getting-started/installing/), `Homebrew` and `MacPorts`

#### Homebrew:

```console
brew install hugo
```

#### MacPorts

```console
sudo port install hugo
```

#### **Linux**

The options on Linux to install [Hugo Extended](https://gohugo.io/getting-started/installing/) are `Snap` and `Homebrew`

#### Snap

```console
sudo snap install hugo
```

#### Homebrew

```console
brew install hugo
```

#### **Windows**

You can install [Hugo Extended](https://gohugo.io/getting-started/installing/) on windows from `Chocoloaty`, `Scoop`, or `Winget`

#### Chocolaty

```console
choco install hugo-extended
```

#### Scoop

```console
scoop install hugo-extended
```

#### Winget

```console
winget install Hugo.Hugo.Extended
```

#### 4) Install the npm packages and run it!

```console
npm install
npm start
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

## Commands

- `npm start`: Main dev server. Runs everything you need. 
- `npm run dev`: Runs components in isolation. Serves `app/index.html` as a playground for components. 
- `npm run hugo`: Only runs static site. 
- `npm run build`: Build for production

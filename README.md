# [Fireship.io](https://fireship.io/)

Content [designed](https://fireship.io/mission/) to increase developer happiness 😁 and productivity 🚀.

## Project Tour

The monorepo is organized into five sub-projects. 

1. `hugo` - Static Site Generator. This is where the content lives.
2. `design` - Theme & CSS.
3. `components` - Angular Elements Web Components.
4. `functions` - Firebase Cloud Functions Serverless Backend.
5. `cypress` - End-to-End & Integration Specs.

## Running the Site


First, install [Hugo](https://gohugo.io/getting-started/installing/).

```shell
git clone <fireship-repo>

npm install

npm run dev
```

Visit `localhost:1313` and you should be live. You do not need the web components for general content development, but they can be built with:

```shell
cd components && npm install
npm run build
```

## Contributing

Edit and fix the site's content in `hugo/content/`. Feel free to submit PRs for small issues. For large issues or features open an issue first. 

First, fork this repo on Github.

```shell
git clone <your-forked-repo>
npm install
npm run dev

git checkout -b my-fix
# fix some code...

git commit -m "fix: corrected a typo"
git push origin my-fix
```

Lastly, open a pull request on Github. Once merged, your changes will automatically be deployed to the live site via the CI/CD pipeline. 

### Keeping Your Fork in Sync

As features are added and fixes are made to the original repo (usually referred to as the 'upstream') your fork will become out of date. You can keep your fork up to date by doing the following:

#### One-Time Setup

Run from your terminal

```shell
npm run link-upstream
```

This should add the official repo as a remote called: 'upstream'. You can see all remotes by entering:

```shell
git remote -v
```

In a typical setup, you should see your fork on Github listed as origin, and the `fireship-io` original as upstream:

```
origin          https://github.com/ZackDeRose/fireship.io (fetch)
origin          https://github.com/ZackDeRose/fireship.io (push)
upstream        https://github.com/fireship-io/fireship.io (fetch)
upstream        https://github.com/fireship-io/fireship.io (push)
```

#### Keeping In Sync With the Original

Whenever you believe your fork may be out of sync, just run from your terminal

```shell
npm run sync
```

This will update your local master branch to match the original repo's master branch! It will then push those changes to your fork on GitHub, essentially keeping all 3 in sync!

### Reset project

If you want to re-install this project and continue contributing, just run the next command in the terminal

```shell
npm run reset
```

This will remove `package-lock.json` and `node_modules`, then runs `npm install` followed by `npm run dev`.

### Contribute a Post

Read the [style guide](https://fireship.io/style-guide/) for some tips before contributing. 

```shell
cd hugo
hugo new -k bundle lessons/angularfire-google-oauth
hugo new snippets/my-cool-snippet.md
```

### Add Your Bio

First time? Add your bio and a social links to `content/contributors`. 

## Web Component Development

Interactive features are built with Angular Elements web components in `components/`.

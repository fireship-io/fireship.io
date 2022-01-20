# [Fireship.io](https://fireship.io/)

Content [designed](https://fireship.io/mission/) to increase developer happiness 😁 and productivity 🚀.

## Project Tour

The monorepo is organized into five sub-projects: 

1. `hugo` - Static Site Generator. This is where the content lives
2. `design` - Theme & CSS
3. `components` - Angular Elements Web Components
4. `functions` - Firebase Cloud Functions Serverless Backend
5. `cypress` - End-to-End & Integration Specs



## Contributing

Edit and fix the site's content in `hugo/content/`. Feel free to submit PRs for small issues. For large issues or features, open an issue first. 

### Option 1 - Simple Typo Fixes

For small issues, like a typo or broken link, use Github's inline file editor or web editor (open by pressing <kbd>.</kbd> in your fork's code tab) to make the fix and submit a pull request. 

### Option 2 - Work on your own Fork

For more complex contributions, like guest posts and new features, you should work on the project on your local system. 

First, fork this repo on GitHub.

```shell
git clone <your-forked-repo>
npm install
npm run dev

git checkout -b my-fix
# fix some code...

git commit -m "fix: corrected a typo"
git push origin my-fix
```

Lastly, open a pull request on GitHub. Once merged, your changes will automatically be deployed to the live site via the CI/CD pipeline. 

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


## Contribute a Post

Read the [style guide](https://fireship.io/style-guide/) for some tips before contributing. 

```shell
cd hugo
hugo new -k bundle lessons/angularfire-google-oauth
hugo new snippets/my-cool-snippet.md
```

### Add Your Bio

First time? Add your bio and social links to `content/contributors`. 

## Web Component Development

Interactive features are built with Angular Elements web components in `components/`

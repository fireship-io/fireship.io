<img src="https://i.imgur.com/BljQEd9.png">

Content [designed](https://fireship.io/mission/) to increase developer happiness 😁 and productivity.


Project Tour
============

For the ease of use for people view this, this mono-repo has been categorized into the following "sub-projects"

### Sub Projects:

1. `components` [(dir)](https://github.com/fireship-io/fireship.io/tree/master/components) - Angular elements; Web components
2. `cypress` [(dir)](https://github.com/fireship-io/fireship.io/tree/master/cypress) - End-to-end & Integration specs
3. `design` [(dir)](https://github.com/fireship-io/fireship.io/tree/master/design) - Theme & CSS
4. `functions` [(dir)](https://github.com/fireship-io/fireship.io/tree/master/functions) - Firebase cloud functions; Server-less backend
5. `hugo` [(dir)](https://github.com/fireship-io/fireship.io/tree/master/hugo) - Static site generator. This is the home of the main content

Contributing
============

*To edit and/or fix the content for the site, head to `hugo/content/`* [(dir)](https://github.com/fireship-io/fireship.io/tree/master/hugo)

To contribute to the project, you can choose from the following options:

### Option 1 - Simple Typo Fixes

For small issues such as typos, grammar issues, broken links, etc., you can use GitHubs inline file editor and/or web editor to make a fix.

From there you would submit a pull request

### Option 2 - Work on your own Fork

For anything that is more complex *(or you just prefer it this way)* you can work on the project on your local system. 

**First**, fork this repo on GitHub.

**Second**, do the following:

*If you are editing the website*</br>
```shell
git clone <your-forked-repo>
npm install
npm run dev

git checkout -b my-fix # "my-fix" would be the name of what you are fixing, for example: "README-edits. Also the name of the branch"

# fix some code...

git commit -m "fix: corrected a typo" # Please try your best to follow this format
git push origin my-fix #"my-fix" would be what you put in the checkout
```

*If you are editing anything else*</br>
```shell
git clone <your-forked-repo>

git checkout -b my-fix # "my-fix" would be the name of what you are fixing, for example: "README-edits. Also the name of the branch"
# fix some code...

git commit -m "fix: corrected a typo" # Please try your best to follow this format
git push origin my-fix #"my-fix" would be what you put in the checkout
```

**Lastly**, open a pull request on GitHub. Once merged, your changes will automatically be deployed to the live site via the CI/CD pipeline. 

Running the Site
================

**First**, install [Hugo](https://gohugo.io/getting-started/installing/).

**Second**, clone this repo

```shell
git clone <fireship-repo>
```

**Lastly**, run the website

```shell
npm install
npm run dev
```

To visit the webpage, go to `localhost:1313` and you should be live. 

You do not *need* the web components for general content development, but if needed, they can be built with:

```shell
cd components && npm install
npm run build
```


Contribute a Post
=================

Before you contribute a post, make sure that you read the **[style guide](https://fireship.io/style-guide/)** before posting for some very helpful tips along with some steps you may need to follow

To add your post to the website, enter the following commands:</br>
```shell
cd hugo
hugo new -k bundle lessons/angularfire-google-oauth
hugo new snippets/my-cool-snippet.md
```

### Add Your Bio

First time adding a contribution?

Make sure to add your bio in `hugo/content/contributors` [(dir)](https://github.com/fireship-io/fireship.io/tree/master/hugo/content/contributors) & your PFP in `hugo/static/img/contributors` [(dir)](https://github.com/fireship-io/fireship.io/tree/master/hugo/static/img/contributors)

Web Component Development
=========================

Any interactive features on the website are built with Angular Elements web components in `components/` [(dir)](https://github.com/fireship-io/fireship.io/tree/master/components) 
---
title: "Style Guide"
lastmod: 2019-01-06T06:14:45-07:00
publishdate: 2019-01-06T06:14:45-07:00
author: Jeff Delaney
draft: false
description: Style Guide for Contributing Content to Fireship.io
---

This guide is for authors and developers who contribute content to Fireship.io.

## Things to Know

Here are a few tips to keep in mind before working on this project:

- Feel free to pull request typos or obvious minor fixes (no issues or discussion necessary). 
- Discuss your article ideas on Slack first. 
- Content is managed with [Hugo](https://gohugo.io) and located under `hugo/content`. 
- If you contribute I want to make it worth-your-while (see tier below)

### Contribution Tier

I like to give away things you can hold in your hand. Here's what you can expect: 

- Small fixes or typos === 🔥 Sticker. 
- Guest post or major code improvements === 👕 T-shirt. 
- Course collaboration === 💰 Paid freelance job or revenue share. 

## How to Fix, Improve, and Create Content via GitHub

First, fork the main repo on GitHub, then clone it to your local machine. You must have Hugo and Node installed. 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
git clone <your-forked-repo>
npm install
npm run dev

git checkout -b my-fix
{{< /highlight >}}

After making your fix or adding new content, submit a pull request on GitHub. 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
git commit -m "fix: corrected a typo"
git push origin my-fix
{{< /highlight >}}


## Writing in Markdown

Content is written in [markdown](https://gohugo.io/content-management/formats/#learn-markdown). Posts should only use h2 and h3 tags.

{{< file "md" "some-cool-post.md" >}}
```markdown

## Step 1: Do Something

some overview text

### Specific Details

[link](/style-guide/) to somewhere useful
```

Images for lessons are saved in the relative image dir, `lessons/<lesson>/img/` and use the Hugo figure shortcode. 

{{< file "md" "some-cool-post.md" >}}
```markdown
{{</* figure src="img/my-images.png" alt="cool image" */>}}
```

## Add Contributor Bio

Thank you for contributing 🙏. Make sure you add details to the contributors section and save your avatar image to the `static/img/contributors` dir. 

{{< file "md" "michael-jordan.md" >}}
```markdown
---
title: Michael Jordan
draft: false

featured_img: /img/contributors/your-avatar.png

youtube: 
linkedin: 
medium: 
twitter:
github:
portfolio: 
---

I used to play baseball...

```




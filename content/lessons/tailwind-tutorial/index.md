---
title: Tailwind Tips & Tricks
lastmod: 2021-10-19T08:11:26-07:00
publishdate: 2021-10-19T08:11:26-07:00
author: Jeff Delaney
draft: false
description: Tips & Tricks for learning Tailwind CSS
tags: 
  - css
  - tailwind
  - react

youtube: pfaSUYaSgRo
github: https://github.com/fireship-io/tailwind-dashboard
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

The following tutorial will get you up and running with [Tailwind CSS](https://tailwindcss.com/), empowering you to build a beautiful, responsive, and animated websites quickly. We will build a side navigation menu inspired by Discord.

## Setup

### Install the Tailwind VS Code extension

Install the [Tailwind VS Code](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension.

### Use a JS Framework

Feel free to use the JS framework of your choice. This tutorial uses [Create React App](https://tailwindcss.com/docs/guides/create-react-app).

## Discord-Inspired Icon Navbar

### Make the App a Flexible Container

Create a [flexbox](https://youtu.be/K74l26pE4YA) row by simply adding the flex utility to the parent element.

{{< file "js" "App.js" >}}
```javascript
function App() {
  return (
    <div className="flex">
    </div>
  );
}
```

### Position the Sidebar

Combine Tailwind utility classes to position the sidebar. When hovering over each class in VS Code, it will display its true CSS values. 

{{< file "js" "SideBar.js" >}}
```javascript
const SideBar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-16 m-0
                    flex flex-col 
                    bg-gray-900 text-white shadow-lg">
    </div>
  );
};
```

### Add Icon Buttons

To quickly add an icon button to the navbar, install react-icons. 

{{< file "terminal" "command line" >}}
```bash
npm install react-icons
```

{{< file "js" "SideBar.js" >}}
```javascript
import { BsPlus, BsFillLightningFill } from 'react-icons/bs';
import { FaFire, FaPoo } from 'react-icons/fa';

const SideBar = () => {
  return (
    <div className="...">
      <SideBarIcon icon={<FaFire size="28" />} />
      <SideBarIcon icon={<BsPlus size="32" />} />
      <SideBarIcon icon={<BsFillLightningFill size="20" />} />
      <SideBarIcon icon={<FaPoo size="20" />} />
    </div>
  );
};

const SideBarIcon = ({ icon }) => (
  <div className="sidebar-icon group">
    {icon}
  </div>
);
```

### Use Apply to Create Custom Classes

The `@apply` directive allows you to compose custom CSS classes by combining Tailwind classes. It can be useful in situations where extracting a JS component does not make sense. 

{{< file "css" "index.css" >}}
```css
@layer components {

    .sidebar-icon {
        @apply relative flex items-center justify-center 
               h-12 w-12 mt-2 mb-2 mx-auto shadow-lg
               bg-gray-800 text-green-500
               hover:bg-green-600 hover:text-white
               rounded-3xl hover:rounded-xl
               transition-all duration-300 ease-linear
               cursor-pointer;
    }
}
```

## Animated Tooltips

### Create Tooltip Container 

Each icon button has a tooltip as a child that is invisible by default. 

{{< file "js" "SideBar.js" >}}
```javascript
const SideBarIcon = ({ icon, text = 'tooltip 💡' }) => (
  <div className="sidebar-icon">
    {icon}

    <span class="sidebar-tooltip">{text}</span>
  </div>
);
```

{{< file "css" "index.css" >}}
```css
    .sidebar-tooltip {
        @apply absolute w-auto p-2 m-2 min-w-max left-14
        rounded-md shadow-md
        text-white bg-gray-900 
        text-xs font-bold
        transition-all duration-100 scale-0 origin-left;
      }
```


### Animated with Group

Create groups to animate a child when the state of the parent changes.

The tailwind `group` class does not work within `@apply`. It must be used inline. 

{{< file "js" "SideBar.js" >}}
```javascript
const SideBarIcon = ({ icon, text = 'tooltip 💡' }) => (
  <div className="sidebar-icon group">
    {icon}

    <span class="sidebar-tooltip group-hover:scale-100">{text}</span>
  </div>
);
```
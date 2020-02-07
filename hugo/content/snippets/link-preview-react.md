---
title: Link Preview React
lastmod: 2019-07-23T10:43:06-07:00
publishdate: 2019-07-23T10:43:06-07:00
author: Jeff Delaney
draft: false
description: Build a Link Preview Component in React
type: lessons
# pro: true
tags: 
    - react
    - cloud-functions

vimeo: 
github: https://github.com/fireship-io/198-web-scraper-link-preview
# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3

# chapters:

---

{{< box emoji="👀" >}}
This tutorial is an extension of the [Web Scraping Guide](/lessons/web-scraping-guide/). You must have the HTTP Cloud Function running locally or deployed to production to fetch link data from third-party websites.  
{{< /box >}}


## Link Preview Component

The component below demonstrates a basic **link preview** implementation in react. Submitting the form with URLs included in the text will be rendered in page with a title, image, and description based on the sites metatag's.

The component starts with an empty array for the link data state, then makes an HTTP fetch to Cloud Function endpoint. The expected response is the link data scrapped securely from the third-party URLs submitted via the HTML form.  

{{< figure src="/img/snippets/react-link-preview.png" alt="Link preview result in React" >}}


{{< file "js" "App.js" >}}
{{< highlight jsx >}}
import React, { useState } from 'react';
import './App.css';

function App() {

  return (
    <div className="App">
      <LinkPreview />
    </div>
  );
}

function LinkPreview() {

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);

  const handleSubmit = async(evt) => {
    setLoading(true)
    evt.preventDefault();
    console.log(`Submitting ${text}`);

    const res = await fetch('http://localhost:5000/fireship-lessons/us-central1/scraper', { 
        method: 'POST', 
        body: JSON.stringify({ text }) 
    });

    const data = await res.json();

    setLinks(data);
    setLoading(false)
  }

  return (
    <div>
      <h1>Form</h1>
      Try this: <pre>some example text https://fireship.io and https://fireship.io/courses/javascript/</pre>

      <form onSubmit={handleSubmit}>
        <textarea rows="4" cols="50" 
          type="text" 
          value={text}
          onChange={e => setText(e.target.value)}>

        </textarea>
        <br />
        <input type="submit" value="Submit" />
        </form>

        <h2>Preview</h2>
        <p>{text}</p>

        {loading &&  <h3>Fetching link previews... 🤔🤔🤔</h3> }


        { links.map(obj => <PreviewCard key={obj.url} linkData={obj} />) }


    </div>
  )
}

function PreviewCard({ linkData }) {
  return (
    <a className="preview" href={linkData.url}>
      <img src={linkData.image} />
      <div>
        <h4>{linkData.title}</h4>
        <p>{linkData.description}</p>
      </div>
    </a>
  )
}

export default App;

{{< /highlight >}}

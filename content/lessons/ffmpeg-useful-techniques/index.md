---
title: Programmatic Video Editing with FFmpeg
lastmod: 2023-03-01T13:08:58-07:00
publishdate: 2023-03-01T13:08:58-07:00
author: Jeff Delaney
draft: false
description: Useful techniques for editing videos with FFmpeg
tags: 
 - linux

youtube: 26Mayv5JPz0
---

As a YouTuber, one of my biggest time sucks is video editing, so I recently wrote several video editing scripts with [FFmpeg](https://ffmpeg.org/) to increse my productivity. It is a popular command line tool that can convert, transform,  and filter nearly any multimedia format (over 100+ codecs supported). 

In the following lesson, we'll look at a collection of useful techniques for working with FFmpeg that you can use to build your own video editing utilities or apps. 

## Useful FFmpeg Techniques

### Convert a File to a Different Format

The most basic thing you can do with FFmpeg is convert a file to a different format. Use the ffmpeg command-line tool with the following syntax:

```bash
ffmpeg -i in.mov out.mp4
```

It knows how to target the proper codec based on the file extension, like `.mp4`, `.mov`, `.avi`, etc. However, you can specify a format if needed. 

```bash
ffmpeg -i in.avi -f mp4 out.mp4
```

### Extract Audio from a Video File

The `-vn` option tells FFmpeg to disable video processing and extract only the audio stream. The `-acodec` copy option tells FFmpeg to copy the audio codec directly from the input file to the output file, without reencoding it. This helps to preserve the original quality of the audio.

```bash
ffmpeg -i in.mp4 -vn -acodec copy out.mp3
```


### Create a High-Quality Animated Gif

Gif files can get huge if you're not careful, so it's important to scale down your video before doing a conversion. 

```bash
ffmpeg -i in.mp4 -vf "scale=320:-1,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" out.gif
```

This command looks crazy, let's break it down:

The `scale` filter resizes the video to a width of 320 pixels, while maintaining the original aspect ratio. 

The `split` filter splits the video stream into two branches, one to generate the palette and the other to apply it.

The [palettegen](https://ffmpeg.org/ffmpeg-filters.html#palettegen-1) filter creates a color palette based on the input video and and outputs the palette as a video stream, which is passed to the paletteuse filter along with the original video stream.  

Additional ideas for Gif optimization are discussed here by [Giphy Engineering](https://engineering.giphy.com/how-to-make-gifs-with-ffmpeg/). 

### Add Subtitles to a Video 

This example assumes you have an existing SRT or WebVTT file with capations and timestamps for your video. First, use FFmpeg to covert it to ASS format (Advanced SubStation Alpha). 

```bash
ffmpeg -i in.srt smart.ass
```

Now simply run it with the `ass` filter and you've got captions overlayed on your video. 

```bash
ffmpeg -i in.mp4 -vf ass=smart.ass out.mp4
```

### Using FFmpeg in Firebase Cloud Functions

FFmpeg is available in the Firebase Cloud Functions runtime. You can invoke it directly using Node.js, but it is generally easier to install [fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg), which is a wrapper for Node.js.

```bash
npm install fluent-ffmpeg
```

Once installed, you can can start using it like so:

```javascript
const ffmpeg = require('fluent-ffmpeg');

exports.convertVideo = functions.https.onRequest((req, res) => {
  const inputPath = 'some-file-path';

  ffmpeg(inputPath)
    .clone()
    .size('64x64')
    .save('/tmp/mini.mp4')
    .on('end', () => {
      res.sendFile('/tmp/mini.mp4');
    })
    .run();
});
```
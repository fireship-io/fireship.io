import { strictEqual } from 'assert';

function replaceURLs(text) {
  const pattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
  const regex = new RegExp(pattern);
  return text.replace(regex, '<a href="$&" target="_blank">$&</a>');
}

function replaceEmojis(text: string) {
  // TODO expand map
  const emojiMap = {
    ':+1:': '👍',
    ':rocket': '🚀',
    ':fire:': '🔥',
    ':smile:' : '😊',
    ':smiley:' : '😊',
    ':beers:': '🍻',
    ':exploding_head:': '🤯',
    ':frowning_face:': '☹️'
  };

  // const triple = /:::/g;
  // const clean = text.replace(triple, ': :');
  const re = /:[a-zA-Z0-9-_+]*:/g;
  return text.replace(re, (match) => emojiMap[match] || '');
}

function wrap(string, start, end) {
  return [
    start,
    string,
    end
  ].join('');
}

function escape(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const symbols = {
  '```': ['<div class="highlight"><pre><code>', '</code></pre></div>'],
  '`': ['<code>', '</code>'],
  '*': ['<strong>', '</strong>'],
  '_': ['<em>', '</em>']
};


export function slackdown(text) {
  if (!text) { return ''; }

  let asHtml = escape(text);
  asHtml = replaceEmojis(text);

  for (const sym in symbols) {
    const split = asHtml.split(sym);

    // Loops odds
    for (let i = 1; i <= split.length; i += 2) {
      const target = split[i];
      if (target) {
        split[i] = wrap(target, symbols[sym][0], symbols[sym][1]);
      }
    }

    asHtml = split.join('');
  }


  asHtml = replaceURLs(asHtml);
  return asHtml;
}

export function trim(str) {
  return str ? str.trim() : str;
}

# OG Cover — Dynamic Social Share Cover Image Generator

[中文文档](README-zh.md)

Hit a URL, get a 1200×630 PNG cover (2x rendered as 2400×1260 by default),
ready to use as Open Graph / Twitter Card social images.

| Light (default) | Dark |
|---|---|
| ![light example](https://og-cover-phi.vercel.app/api/og?title=Intelligent%20Agents&tag=slides) | ![dark example](https://og-cover-phi.vercel.app/api/og?title=Intelligent%20Agents&tag=slides&theme=dark) |

## Features

- ⚡ **Vercel Edge Runtime**: millisecond responses from edge nodes worldwide, no server needed
- 🀄 **Bilingual**: English titles take the fast path; Chinese titles auto-load Noto Sans SC (woff subset, cached in memory)
- 🔍 **2x HD rendering**: outputs 2400×1260 by default, sharper text when downscaled by social platforms
- 🎨 **Two themes**: `theme=dark` / `theme=light` (default light)
- 🆓 **Zero cost**: fits comfortably in the Vercel Hobby free tier for personal blogs

## Deploy your own instance

### Option 1: One-click fork deploy (recommended)

1. Fork this repo
2. Open [Vercel](https://vercel.com/new) and import your fork
3. Keep the defaults and deploy
4. (Optional) Set a nicer short domain: Vercel Dashboard → project → Settings → Domains

No environment variables or API keys needed.

### Option 2: Manual deploy

```bash
git clone https://github.com/<your-username>/og-cover.git
cd og-cover
npm install -g vercel   # if you don't have the Vercel CLI yet
vercel                  # follow the prompts to log in and deploy
```

### Disable Deployment Protection (important)

New Vercel projects enable Deployment Protection by default, which puts image URLs
behind an SSO login wall so social crawlers can't fetch them. Turn it off:

Project → **Settings** → **Deployment Protection** → set to **Off** (or preview-only)

## API parameters

| Param   | Description                              | Default                     |
|---------|------------------------------------------|-----------------------------|
| `title` | Main title (≤90 chars, EN/CN supported)  | `Untitled`                  |
| `tag`   | Small tag on top (auto-uppercased)       | `tortrixx.github.io/slides` |
| `theme` | `light` / `dark`                         | `light`                     |
| `scale` | Render scale 1–3, higher = sharper but larger file | `2`                  |

Examples:

```text
# English title + dark theme
/api/og?title=Intelligent%20Agents&tag=slides&theme=dark

# Chinese title (auto-loads Noto Sans SC)
/api/og?title=智能代理入门&tag=演讲文稿

# 1x standard resolution (smallest file)
/api/og?title=Hello&scale=1
```

## Use it on your site

Add meta tags to each page (replace `title`, URL-encode it):

```html
<meta property="og:image" content="https://your-domain/api/og?title=Intelligent%20Agents&tag=slides" />
<meta name="twitter:card" content="summary_large_image" />
```

Share the link on Twitter / Telegram / Discord / Slack and the preview card shows up.

Validators:
- Twitter: https://cards-dev.twitter.com/validator
- Facebook: https://developers.facebook.com/tools/debug/

## Customize the style

Edit the `THEMES` object in `api/og.js` — the layout is plain React style objects:

```js
const THEMES = {
  dark:  { bg: '#0f172a', fg: '#ffffff', accent: '#7dd3fc', ring: '#1e293b' },
  light: { bg: '#f8fafc', fg: '#0f172a', accent: '#0284c7', ring: '#e2e8f0' },
};
```

Add a new entry to `THEMES` and call it with `?theme=name`.

## Local development

```bash
npm install
npx vercel dev
# open http://localhost:3000/api/og?title=Hello
```

## Gotchas

1. **`api/*.jsx` is not recognized as a function route in framework-less Vercel projects**
   (build succeeds but returns 404). Use `.js` + `React.createElement`,
   or switch to the Next.js framework.
2. **Satori renders blank with fontsource's woff2 subset fonts**
   (HTTP 200 with 0 bytes). Use the woff version instead:
   `.../files/noto-sans-sc-chinese-simplified-700-normal.woff`
3. **No system CJK fallback fonts in Edge Runtime**:
   Chinese renders as tofu boxes without a loaded font. This project
   lazy-loads the font only when CJK characters are detected, so English
   titles stay on the fast path.

## Tech stack

- [@vercel/og](https://www.npmjs.com/package/@vercel/og) — OG image generation
- [satori](https://github.com/vercel/satori) — HTML/CSS to SVG engine
- Vercel Edge Runtime — hosting

## License

MIT

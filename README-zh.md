# OG Cover — 动态社交分享封面图生成器

[English](README.md)

访问一个 URL，就返回一张 1200×630（默认 2x 渲染为 2400×1260）的 PNG 封面图，
可直接用作网站的 Open Graph / Twitter Card 分享图。

| 浅色（默认） | 深色 |
|---|---|
| ![浅色示例](https://og-cover-phi.vercel.app/api/og?title=Intelligent%20Agents&tag=slides) | ![深色示例](https://og-cover-phi.vercel.app/api/og?title=Intelligent%20Agents&tag=slides&theme=dark) |

## 特性

- ⚡ **Vercel Edge Runtime**：全球边缘节点，毫秒级响应，无需服务器
- 🀄 **中英双语**：英文标题走高速路径；中文标题自动加载思源黑体（woff 子集，内存缓存）
- 🔍 **2x 高清渲染**：默认输出 2400×1260，社交平台缩略显示时文字更锐利
- 🎨 **深浅两套主题**：`theme=dark` / `theme=light`（默认 light）
- 🆓 **零成本**：Vercel Hobby 免费额度完全够个人博客用

## 快速部署你自己的实例

### 方式一：一键 Fork 部署（推荐）

1. Fork 本仓库
2. 打开 [Vercel](https://vercel.com/new)，Import 你 Fork 的仓库
3. 一路默认点下去，部署完成
4. （可选）把项目域名换成你喜欢的短域名：Vercel Dashboard → 项目 → Settings → Domains

全程不需要填任何环境变量、API Key。

### 方式二：手动部署

```bash
git clone https://github.com/<你的用户名>/og-cover.git
cd og-cover
npm install -g vercel   # 如果还没装 Vercel CLI
vercel                  # 按提示登录并部署
```

### 关闭访问保护（重要）

Vercel 新项目默认开启 Deployment Protection，图片 URL 会被 SSO 登录墙挡住，
导致社交平台爬虫抓不到图。关闭方法：

项目 → **Settings** → **Deployment Protection** → 设为 **Off**（或仅对 Preview 生效）

## API 参数

| 参数    | 说明                          | 默认值                      |
|---------|-------------------------------|-----------------------------|
| `title` | 主标题（≤90 字，中英都行）     | `Untitled`                  |
| `tag`   | 顶部小标签（自动大写）          | `tortrixx.github.io/slides` |
| `theme` | `light` / `dark`              | `light`                     |
| `scale` | 渲染倍数 1–3，越大越清晰文件也越大 | `2`                      |

示例：

```text
# 英文标题 + 深色主题
/api/og?title=Intelligent%20Agents&tag=slides&theme=dark

# 中文标题（自动加载思源黑体）
/api/og?title=智能代理入门&tag=演讲文稿

# 1x 标准分辨率（文件最小）
/api/og?title=Hello&scale=1
```

## 在你的网站里用

给每个页面加 meta 标签（`title` 换成各自标题，URL 记得 encode）：

```html
<meta property="og:image" content="https://你的域名/api/og?title=Intelligent%20Agents&tag=slides" />
<meta name="twitter:card" content="summary_large_image" />
```

之后把链接发到 Twitter / Telegram / Discord / Slack，就会自动带上这张预览图。

调试分享效果：
- Twitter：https://cards-dev.twitter.com/validator
- Facebook：https://developers.facebook.com/tools/debug/

## 自定义样式

改 `api/og.js` 里的 `THEMES` 对象即可换配色，布局是普通的 React style 对象：

```js
const THEMES = {
  dark:  { bg: '#0f172a', fg: '#ffffff', accent: '#7dd3fc', ring: '#1e293b' },
  light: { bg: '#f8fafc', fg: '#0f172a', accent: '#0284c7', ring: '#e2e8f0' },
};
```

想加新主题：在 `THEMES` 里加一项，前端用 `?theme=名字` 调用。

## 本地开发

```bash
npm install
npx vercel dev
# 打开 http://localhost:3000/api/og?title=Hello
```

## 踩坑记录

1. **`api/*.jsx` 在无框架 Vercel 项目里不会被识别为函数路由**
   （构建成功但访问 404）。必须用 `.js` + `React.createElement` 手写，
   或者上 Next.js 框架。
2. **satori 对 fontsource 的 woff2 子集文件渲染空白**
   （200 返回但 0 字节）。换 woff 版就正常：
   `.../files/noto-sans-sc-chinese-simplified-700-normal.woff`
3. **中文标题记得配字体**：Edge Runtime 没有系统级的中文 fallback 字体，
   不加载字体中文会显示为方框。本项目用正则检测 CJK 字符后才懒加载字体，
   英文标题不受影响。

## 技术栈

- [@vercel/og](https://www.npmjs.com/package/@vercel/og) — OG 图片生成
- [satori](https://github.com/vercel/satori) — HTML/CSS 转 SVG 引擎
- Vercel Edge Runtime — 部署运行

## License

MIT

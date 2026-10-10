import { ImageResponse } from '@vercel/og';
import React from 'react';

export const config = { runtime: 'edge' };

// 思源黑体简体子集（700，woff）：只有标题含中文时才加载，英文标题走高速路径
// 注意：fontsource 的 woff2 子集版会导致 satori 渲染空白，必须用 woff 版
const FONT_URL =
  'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-sc@latest/files/noto-sans-sc-chinese-simplified-700-normal.woff';
const CJK_RE = /[぀-ヿ㐀-䶿一-鿿豈-﫿＀-￯]/;

let fontCache = null;
async function getCjkFont() {
  if (!fontCache) {
    fontCache = await fetch(FONT_URL).then((r) => r.arrayBuffer());
  }
  return fontCache;
}

const THEMES = {
  dark: { bg: '#0f172a', fg: '#ffffff', accent: '#7dd3fc', ring: '#1e293b' },
  light: { bg: '#f8fafc', fg: '#0f172a', accent: '#0284c7', ring: '#e2e8f0' },
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') || 'Untitled').slice(0, 90);
  const tag = (searchParams.get('tag') || 'tortrixx.github.io/slides').slice(0, 60);
  const theme = THEMES[searchParams.get('theme')] || THEMES.light;
  // 2x 渲染：在 1200×630 显示尺寸下更锐利；可用 scale=1/3 覆盖
  const k = Math.min(3, Math.max(1, parseInt(searchParams.get('scale') || '2', 10) || 2));

  const W = 1200 * k;
  const H = 630 * k;

  const needsCjk = CJK_RE.test(title) || CJK_RE.test(tag);
  const options = { width: W, height: H };
  if (needsCjk) {
    options.fonts = [
      { name: 'Noto Sans SC', data: await getCjkFont(), weight: 700, style: 'normal' },
    ];
  }

  const el = React.createElement;
  const fontFamily = needsCjk ? "'Noto Sans SC', system-ui, sans-serif" : 'system-ui, sans-serif';

  return new ImageResponse(
    el(
      'div',
      {
        style: {
          width: `${W}px`,
          height: `${H}px`,
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: theme.bg,
          color: theme.fg,
          fontFamily,
        },
      },
      // 背景装饰圆环
      el('div', {
        style: {
          position: 'absolute',
          right: `${-160 * k}px`,
          top: `${-160 * k}px`,
          width: `${480 * k}px`,
          height: `${480 * k}px`,
          borderRadius: '50%',
          border: `${28 * k}px solid ${theme.ring}`,
        },
      }),
      el('div', {
        style: {
          position: 'absolute',
          right: `${120 * k}px`,
          bottom: `${-200 * k}px`,
          width: `${380 * k}px`,
          height: `${380 * k}px`,
          borderRadius: '50%',
          border: `${20 * k}px solid ${theme.ring}`,
        },
      }),
      // 内容
      el(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: `${90 * k}px`,
            width: '100%',
            height: '100%',
          },
        },
        el(
          'div',
          {
            style: {
              fontSize: 30 * k,
              color: theme.accent,
              fontWeight: 700,
              letterSpacing: 4 * k,
              marginBottom: 28 * k,
            },
          },
          tag.toUpperCase()
        ),
        el('div', { style: { fontSize: 76 * k, fontWeight: 800, lineHeight: 1.2 } }, title),
        el('div', {
          style: {
            marginTop: 48 * k,
            width: 96 * k,
            height: 6 * k,
            background: theme.accent,
            borderRadius: 3 * k,
          },
        })
      )
    ),
    options
  );
}

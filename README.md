# N2 Nutrition — Lebanon, TN

Static site (plain HTML/CSS/JS, no build step). Everything that gets published lives in `site/`.

## Deploy (GitHub → Cloudflare Pages)

1. Push this folder to a GitHub repo.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
3. Build settings: **Framework preset:** None · **Build command:** *(blank)* · **Build output directory:** `site`
4. After the first deploy, add the custom domain and update the `canonical` / `og:image` / JSON-LD URLs in `site/index.html` (they currently assume `https://n2nutritiontn.com`).

## Preview locally

```bash
cd site && python -m http.server 8090
```

## Where things are

| What | File |
| --- | --- |
| Page content, menu items, FAQ, reviews | `site/index.html` |
| Colors, fonts, layout (`:root` tokens at top) | `site/css/style.css` |
| Hero video loader, tabs, carousel, open/closed status | `site/js/main.js` |
| Hero videos | `site/assets/video/hero-desktop.mp4` (3-panel, 1920×1080) · `hero-mobile.mp4` (portrait, 720×1280) |

Open/closed hours live in `site/js/main.js` (`hours`) and the JSON-LD block in `index.html`.

## Notes

- The Jotform link on their Facebook/Instagram is a **job application**, so it's used on the "Now hiring" band, not as an order button.
- Menu items come from the Instagram "Menu" highlight and the pinned "Fall at N2" post. The "Loaded Teas" base menu slide wasn't captured; only the seasonal Loaded flavors are listed.
- To swap hero footage, re-encode and replace the two mp4s in `site/assets/video/` (keep names) and regenerate the poster JPGs in `site/assets/img/`.

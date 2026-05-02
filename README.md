# 🍕 Taner Talas | FORNO Project

## 🇬🇧 English

A fictional pizza restaurant website built as a portfolio project. Retro American diner aesthetic — dark background, fire red and mustard yellow accents.

🔗 **Live Demo:** `index.html` [https://tanertalas.github.io/FORNO/](https://tanertalas.github.io/FORNO/)

---

### Stack

- **Tailwind CSS v4** — CLI build, `@theme` config, no CDN
- **Vanilla HTML + JS** — no framework, no bundler
- **GSAP + ScrollTrigger** — scroll-triggered animations, pizza carousel
- **Lenis** — smooth scroll integrated with GSAP
- **Web Components** — for repeating UI blocks

---

### Running locally

```bash
npm install
npm run dev   # Tailwind watch mode
```

Open `index.html` or `menu.html` directly in browser, or use Live Server.

---

### Design decisions

- Tailwind v4's `@theme {}` block replaces `tailwind.config.js` — all custom tokens (colors, fonts, durations, easings) live in `assets/css/shared.css`
- JS files load with `defer`, no module bundling
- GSAP imported from npm, only used plugins imported to keep bundle lean
- `prefers-reduced-motion` respected across all animations

---

## 🇹🇷 Türkçe

Portföy projesi olarak geliştirilen kurgusal bir pizza restoranı sitesi. Retro Amerikan diner estetiği — koyu zemin, ateş kırmızısı ve hardal sarısı aksan.

🔗 **Canlı Site**: `index.html` [https://tanertalas.github.io/FORNO/](https://tanertalas.github.io/FORNO/)

---

### Kullanılan Teknolojiler

- **Tailwind CSS v4** — CLI build, `@theme` config, CDN yok
- **Vanilla HTML + JS** — framework yok, bundler yok
- **GSAP + ScrollTrigger** — scroll animasyonları, pizza carousel
- **Lenis** — GSAP ile entegre smooth scroll
- **Web Components** — tekrar eden UI blokları için

---

### Yerel Ortamda Çalıştırma

```bash
npm install
npm run dev   # Tailwind watch mode
```


---

### Tasarım Kararları

- Tailwind v4'te `@theme {}` bloğu `tailwind.config.js`'nin yerini alıyor — tüm özel tokenlar (renkler, fontlar, süreler, easing'ler) `assets/css/shared.css` içinde
- JS dosyaları `defer` ile yükleniyor, modül bundle'ı yok
- GSAP npm'den import ediliyor, sadece kullanılan plugin'ler dahil ediliyor
- Tüm animasyonlar `prefers-reduced-motion`'ı destekliyor

# Yellow Target Intro

An interactive entrance into the mathematical model behind Venturi Carpet
Technology: cone interfaces, moisture gradients, transport resistance and root
pruning points.

## Open the experience

- [Interactive Yellow Target site](https://yellow-target-explorer.nicknickk555.chatgpt.site)
- [GitHub Pages entrance](https://nicknickk555.github.io/mogra/)

The GitHub Pages entrance uses the root [`index.html`](./index.html) and opens
the complete interactive model.

## What is included

- **Yellow Target Intro** — a three-stage portal from Cone Interface through
  Ruby Target to Moisture Explorer.
- **Moisture Gradient & Pruning Point** — an interactive calculator with three
  fill scenarios and a live pruning-point result.
- **Mathematical model** — resistance balance, moisture transport equations,
  threshold conditions and geometry analysis.
- **Practical appendix** — filling scenarios and application guidelines.

## Local development

Requires Node.js 22.13 or later.

```bash
pnpm install
pnpm run dev
```

Production validation:

```bash
pnpm run build
```

## Project structure

- `app/page.tsx` — Yellow Target Intro.
- `app/explorer/page.tsx` — mathematical explorer and calculator.
- `app/components/MoistureChart.tsx` — live gradient model and chart.
- `index.html` — GitHub Pages entrance.

---

Venturi Carpet Technology — the cone forms the target, not a storage pocket.

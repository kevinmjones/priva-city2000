# Arch Apps

Simple, functional tools. No bloat.

Collection of single-purpose apps: Measuring App (AR), Unit Conversion, Level, Translation, and Star Gaze.

## 🛡️ Priva-city 2000

An isometric, SimCity-2000-style browser game where the city is an **enterprise** and you
are its Chief Privacy / AI Governance Officer. Place governance controls, raise **Trust**,
cut **Risk**, survive regulatory events on the REG WIRE, and pass the **EU AI Act audit**.

- Play: [`/game/`](game/) — live at `https://kevinmjones.github.io/priva-city2000/game/`
- 100% static: vanilla `<canvas>`, **zero runtime dependencies**, no backend, no third-party calls.
- Saves to `localStorage`. Source: `game/index.html`, `game/game.css`, `game/game.js`.

## Development

This is a static site deployed via GitHub Pages. No build step required.

```
git clone https://github.com/kevinmjones/priva-city2000.git
cd priva-city2000
# Open index.html in your browser or serve locally:
python3 -m http.server 8000
```

## Deployment

Push to `main` — GitHub Actions deploys to Pages automatically.

## License

MIT

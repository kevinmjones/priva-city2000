# Priva-city 2000 — Art Asset Pack

SimCity-2000-style isometric pixel-art sprites. 64×80 px transparent PNG (buildings);
64×48 px (tiles); 32×32 px (icons). Anchor point for building sprites: (32, 62) — the
centre of the isometric tile diamond.

---

## Ground Tiles — `tiles/`

Used as district ground texture. 64×48 px, transparent outside the diamond.

| File | District ID | Color |
|------|-------------|-------|
| `tiles/hr-district.png`       | `hr`   | Blue `#3b78d8` |
| `tiles/customer-district.png` | `cust` | Teal `#1fa99a` |
| `tiles/ai-district.png`       | `ai`   | Purple `#8a6bf0` |
| `tiles/neutral.png`           | —      | Dark `#2a3650` (empty / road) |

---

## Control Buildings — `controls/`

One sprite per control type. Use the `id` column to match `CONTROLS[*].id` in `game.js`.
64×80 px, transparent. Building anchor at (32, 62).

| File | Control ID | Rooftop feature | Color |
|------|------------|-----------------|-------|
| `controls/inventory.png` | `inventory` | Satellite dish  | `#3fb0ff` |
| `controls/access.png`    | `access`    | Gold padlock    | `#ffd34d` |
| `controls/consent.png`   | `consent`   | Green checkmark | `#54d68a` |
| `controls/dsar.png`      | `dsar`      | Envelope        | `#ff9d5c` |
| `controls/vendor.png`    | `vendor`    | Chain-link nodes| `#c0a3ff` |
| `controls/dpia.png`      | `dpia`      | Clipboard       | `#7bd0ff` |
| `controls/registry.png`  | `registry`  | Server rack     | `#b388ff` |
| `controls/incident.png`  | `incident`  | Red cross       | `#ff7a90` |

---

## Gap Buildings — `gaps/`

Two variants per gap type: `warning` (unresolved — dark, cracked, ⚠ marker) and
`resolved` (governed — green-tinted, ✓ marker). Match `GAPS` keys in `game.js`.

| Prefix | Gap ID | Label |
|--------|--------|-------|
| `gaps/unmapped-{warning,resolved}.png`  | `unmapped`  | Unmapped data store |
| `gaps/access-{warning,resolved}.png`    | `access`    | No access controls |
| `gaps/consent-{warning,resolved}.png`   | `consent`   | Missing consent |
| `gaps/dsar-{warning,resolved}.png`      | `dsar`      | No rights-request path |
| `gaps/vendor-{warning,resolved}.png`    | `vendor`    | Vendor without DPA |
| `gaps/breach-{warning,resolved}.png`    | `breach`    | Breach-exposed |
| `gaps/dpia-{warning,resolved}.png`      | `dpia`      | AI system without DPIA |
| `gaps/shadowai-{warning,resolved}.png`  | `shadowai`  | Shadow / undocumented AI |

---

## Palette Icons — `icons/`

32×32 px rounded-square icons to replace emoji in the build palette and toolbar.

| File | Purpose |
|------|---------|
| `icons/inventory.png` | Palette card — Data Inventory & Mapping |
| `icons/access.png`    | Palette card — Access Control |
| `icons/consent.png`   | Palette card — Consent Manager |
| `icons/dsar.png`      | Palette card — DSAR / Rights Desk |
| `icons/vendor.png`    | Palette card — Vendor Risk Office |
| `icons/dpia.png`      | Palette card — DPIA / Assessment Center |
| `icons/registry.png`  | Palette card — AI Model Registry |
| `icons/incident.png`  | Palette card — Incident Response (DPO) |
| `icons/heatmap.png`   | Toolbar — 🌡️ Heatmap toggle |
| `icons/bulldoze.png`  | Toolbar — Bulldoze / Remove tool |

---

## Contact Sheet

`contact-sheet.png` — full-set preview showing all sprites, suitable for board review.

---

## Generation

Sprites are produced by `generate_sprites.py` at the repo root using Python 3 + Pillow.
Re-run to regenerate the full pack:

```bash
pip install Pillow
python3 generate_sprites.py
```

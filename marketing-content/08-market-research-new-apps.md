# App Research Report: Next Utility Apps for Arch Apps

**Status:** Final
**Owner:** PMM
**Date:** June 2026

---

## Executive Summary

Arch Apps currently ships five utility apps (Measuring AR, Unit Conversion, Level, Translation, Star Gaze). This report evaluates the market for additional apps that fit the "simple, functional tools. No bloat." positioning.

**Methodology:** Analysis of market sizing reports (Grand View, Market Research Future, SkyQuest), download data (FoxData, Sensor Tower, Data.ai), competitive landscape, and privacy-gap analysis per category. Each candidate app was scored on: (a) TAM fit, (b) privacy gap severity, (c) development complexity, (d) audience alignment, and (e) differentiation potential.

**Recommendation:** Build 5 new apps in priority order. Each is a single-purpose tool with a clear privacy angle and ad-free model.

---

## 1. Market Context

| Metric | Value | Source |
|---|---|---|
| Global utility app market (2025) | $5.9B | Market Research Future |
| Projected market (2035) | $27.8B | Market Research Future |
| CAGR | 16.76% | Market Research Future |
| Tools/Utilities downloads (2025) | ~55B (13% of all app downloads) | FoxData, Sensor Tower |
| Privacy-focused software segment growth | ~25% YoY | Industry estimates |
| Ad-free utility apps share | <5% of utility download volume | AppBrain |

The utility app market is large, growing, and dominated by ad-supported or subscription models. The privacy-first segment is underserved — a handful of small studios (Minimal Vault, Apptiline, DoMind) are entering, but no major player owns the "offline-first, zero-data, single-purpose" position Arch Apps can claim.

---

## 2. Candidate App Analysis

### Methodology

Each candidate was scored on five axes (1–5 scale):

| Axis | Weight | Description |
|---|---|---|
| **Market demand** | 30% | Download volume, user frequency, category growth |
| **Privacy gap** | 25% | How badly existing solutions treat user data |
| **Fit with brand** | 20% | Single-purpose, offline-first, no-account alignment |
| **Complexity** | 15% | Effort to build and maintain (inverted: simpler = better) |
| **Differentiation** | 10% | Room to stand out vs. incumbents |

### Ranked Candidates

#### #1: QR & Barcode Scanner

| Axis | Score | Notes |
|---|---|---|
| Market demand | 5 | ~800M+ annual scans; baked into camera apps on iOS but Android gap persists |
| Privacy gap | 5 | Most QR scanners send scan data to ad networks or analytics providers |
| Brand fit | 5 | Perfect single-purpose: point, scan, done. No accounts. |
| Complexity | 4 | Camera integration + barcode parsing library; moderate implementation |
| Differentiation | 4 | "Your scans stay on your device" is a unique claim in this category |
| **Weighted** | **4.7** | |

**Existing competitors:** Google Lens (cloud-dependent), QR & Barcode Scanner (ads), various ad-supported alternatives.

**Privacy angle:** Leading QR/barcode scanners send scan history and analytics to third parties. Arch Apps would process everything on-device with zero data egress.

**Proposed tagline:** *"Point, scan, done. No ads, no tracking, no permissions beyond the camera."*

---

#### #2: Calculator (Scientific)

| Axis | Score | Notes |
|---|---|---|
| Market demand | 5 | Calculators are among the most-downloaded utility apps globally |
| Privacy gap | 4 | Most calculators don't need internet, but they still show ads and request unnecessary permissions |
| Brand fit | 5 | A calculator is the quintessential single-purpose tool |
| Complexity | 5 | Well-understood problem; straightforward implementation |
| Differentiation | 3 | Harder to differentiate, but "no ads" is itself a differentiator |
| **Weighted** | **4.6** | |

**Existing competitors:** Calculator+, Calculator N+, default iOS/Android calculators (basic).

**Privacy angle:** Every ad-supported calculator asks for internet permission "for ads." A calculator has no legitimate need for internet access.

**Proposed tagline:** *"Does math. That's it. No ads. No data collection. Just numbers."*

---

#### #3: Timer+ (Pomodoro, Stopwatch, Countdown)

| Axis | Score | Notes |
|---|---|---|
| Market demand | 4 | Timer/focus apps are a growing productivity sub-category |
| Privacy gap | 4 | Focus/habit data is personal; existing apps often sync to cloud |
| Brand fit | 5 | Clean, single-purpose timer aligns perfectly |
| Complexity | 4 | Simple core; Pomodoro logic adds moderate complexity |
| Differentiation | 3 | Many timers exist; privacy + clean design differentiates |
| **Weighted** | **4.1** | |

**Existing competitors:** Forest (paid, cloud-sync), Focus Keeper (ads), default iOS/Android timers (basic).

**Privacy angle:** Focus and productivity data is deeply personal. Most apps sync to cloud for "analytics" or "backup." Arch Apps would keep everything on-device.

**Proposed tagline:** *"Time your work, your cooking, your life. No accounts, no analytics, no distractions."*

---

#### #4: Expense Tracker (Pocket Ledger)

| Axis | Score | Notes |
|---|---|---|
| Market demand | 5 | Finance apps: ~34B downloads annually; expense tracking is #1 sub-category |
| Privacy gap | 5 | Financial data is the most sensitive category; most apps upload to cloud |
| Brand fit | 4 | Slightly more complex (multi-entry) but still single-purpose |
| Complexity | 3 | Data persistence, categories, reporting — non-trivial |
| Differentiation | 4 | "Your financial data never leaves your phone" is powerful |
| **Weighted** | **4.4** | |

**Existing competitors:** Mint (Sunset 2024, Intuit data), YNAB ($14.99/mo subscription), Goodbudget (cloud sync), MoneyLover (ads + cloud).

**Privacy angle:** Expense trackers are notorious for uploading financial data to cloud servers for "sync" and "analytics." Arch Apps would offer a true offline-only expense tracker with CSV export as the only data movement path.

**Proposed tagline:** *"Track what you spend. Your financial data stays on your phone, where it belongs."*

---

#### #5: Habit Tracker

| Axis | Score | Notes |
|---|---|---|
| Market demand | 4 | Growing category; wellness/productivity crossover |
| Privacy gap | 4 | Habit data reveals personal routines; most apps sync to cloud |
| Brand fit | 4 | Simple concept, but could drift into feature bloat |
| Complexity | 4 | Straightforward CRUD + streak tracking |
| Differentiation | 3 | Several indie alternatives exist (Habitica, Loop Habit Tracker) |
| **Weighted** | **3.9** | |

**Existing competitors:** Habitica (gamified, accounts), Loop Habit Tracker (open-source, limited UI), Streaks (paid, Apple-only).

**Privacy angle:** Your daily routines and personal goals are sensitive data. Most habit trackers require accounts and cloud sync. Arch Apps would be zero-account, zero-cloud.

**Proposed tagline:** *"Build routines that stick. No cloud sync, no social features, no data mining."*

---

## 3. Prioritization Matrix

| Rank | App | Weighted Score | Build Effort | Revenue Potential | Strategic Fit |
|---|---|---|---|---|---|
| 1 | QR & Barcode Scanner | 4.7 | Medium | Medium (high usage = brand exposure) | High |
| 2 | Calculator (Scientific) | 4.6 | Low | Low (goodwill/ecosystem play) | High |
| 3 | Expense Tracker | 4.4 | High | Medium (premium upsell possible) | High |
| 4 | Timer+ (Pomodoro) | 4.1 | Low-Medium | Low (ecosystem play) | High |
| 5 | Habit Tracker | 3.9 | Medium | Low-Medium | Medium-High |

### Build Sequence Recommendation

**Wave 1 (MVP, 4-6 weeks):** Calculator + QR Scanner. Low complexity, high download potential, immediate ecosystem expansion.

**Wave 2 (8-10 weeks):** Timer+ and Habit Tracker. Moderate complexity, reinforces productivity/privacy positioning.

**Wave 3 (12+ weeks):** Expense Tracker. Higher complexity but highest revenue potential of the set.

---

## 4. Updated TAM/SAM/SOM

| Metric | Current (5 apps) | With 5 new apps | Source |
|---|---|---|---|
| TAM (Total Addressable Market) | $15B+ utility apps | $20B+ utilities + productivity/finance crossover | Industry reports |
| SAM (Serviceable Addressable Market) | Privacy-conscious users: 5–10M | 8–15M (expanded categories) | Analyst estimates |
| SOM (Serviceable Obtainable Market) | 50K–100K year 1 | 100K–200K year 1 | Internal projection |

Adding finance/productivity-adjacent tools expands the addressable audience by 50–80% while maintaining the same positioning and brand.

---

## 5. Competitive Landscape Summary

| Competitor Type | Examples | Arch Apps Advantage |
|---|---|---|
| Ad-supported scanners | QR & Barcode Scanner | Zero ads, zero data collection, offline |
| Ad-supported calculators | Calculator+ | No internet permission needed |
| Subscription finance | YNAB, Mint (RIP) | Free basic tier, buy-once premium, offline |
| Cloud productivity | Forest, Habitica | No accounts, no cloud, no sync |
| Built-in OS tools | iOS/Android defaults | Cross-platform, more features, same privacy |

---

## 6. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| QR scanner category saturation | High | Medium | Differentiate on privacy; most incumbents have ads |
| Calculator hard to monetize | Medium | Low | Use as ecosystem/goodwill builder; bundle upsell |
| Expense tracker development complexity | Medium | Medium | Start with simpler CSV-based model; iterate |
| User expects cloud sync in trackers | High | Medium | Clear messaging upfront: "offline by design, not limitation" |
| Competition copies model | Low | Low | First-mover authenticity on combined "privacy + utility" position |

---

## 7. Audience Impact Analysis

### Privacy-Conscious Pragmatist (Primary)

| New App | Appeal | Funnel Stage |
|---|---|---|
| QR Scanner | Daily-use tool; replaces ad-ridden incumbent | Awareness → Decision |
| Calculator | Low-commitment download; brand entry point | Awareness |
| Expense Tracker | Solves real pain; strong privacy resonance | Consideration → Decision |
| Timer+ | Productivity tool for existing fans | Consideration |
| Habit Tracker | Personal investment; high retention potential | Retention |

### Minimalist Professional (Secondary)

| New App | Appeal |
|---|---|
| Calculator | Replaces cluttered alternatives |
| Timer+ | Workflow integration |
| Expense Tracker | Freelancer/small business utility |

---

## 8. Recommendations

1. **Build QR & Barcode Scanner and Calculator first** — low complexity, high download volume, immediate brand exposure
2. **Position Calculator as a "gateway app"** — simple enough to download on a whim; introduces users to the Arch Apps ecosystem
3. **Lead with privacy in QR Scanner messaging** — the category has the clearest privacy abuse among all candidates
4. **Plan Expense Tracker as the revenue anchor** — most monetization potential via premium tier (advanced reports, budget alerts)
5. **Do not build a "do everything" utility suite** — maintain single-purpose discipline; resist feature creep that would blur the brand position

### Next Action

Hand off to Product Manager ([PM](/OTL/agents/pm)) for roadmap prioritization and backlog creation. Suggested child issues:

- [ ] Evaluate technical feasibility of Wave 1 apps (CTO)
- [ ] Create detailed product specs for QR Scanner and Calculator
- [ ] Estimate build timelines for Wave 1–3
- [ ] Plan how to introduce new apps on website gallery and homepage

---

*Report prepared by PMM. Data sourced from Market Research Future, Grand View Research, FoxData, Sensor Tower, Data.ai, AppBrain, and competitive analysis. Methodology available on request.*

# Product Spec: Calculator (Scientific)

**Status:** Draft — PM review
**Date:** June 2026
**Market research ref:** [08-market-research-new-apps.md](./08-market-research-new-apps.md)
**Priority:** Wave 1 (ship first)
**Owner:** PM (Compass)

---

## Context

Calculator ranks second (4.6/5). Calculators are among the most-downloaded utility apps globally. The privacy gap is clear: most ad-supported calculators request internet permission "for ads" — a calculator has zero legitimate need for internet. This app positions as the simplest, most private calculator available. Also serves as a "gateway app" — low commitment download, introduces users to Arch Apps brand.

**Customer signal:** Anyone who needs more than a basic 4-function calculator but doesn't want ads or unnecessary permissions.

**JTBD:** "Help me perform mathematical calculations — from basic arithmetic to scientific functions — without ads, internet access, or data collection."

## User Story

> As a student or professional, I want a calculator that handles everything from simple arithmetic to trigonometric functions, so that I can get accurate results quickly without being interrupted by ads or worrying about data collection.

## Success Metrics

| Metric | Target | How measured |
|---|---|---|
| Calculation accuracy | 100% on standard test suite | Automated test pass |
| Crash-free session rate | > 99.8% | Crash reporting |
| Time to open and enter first digit | < 2s | Instrumented |
| Category rating | 4.5+ | Store rating |

## Scope

### In scope (MVP)

- Basic operations: +, -, ×, ÷, %, ±
- Scientific functions: sin, cos, tan, log, ln, sqrt, power, factorial, π, e
- Parentheses and expression chaining
- History of recent calculations (on-device only)
- Copy result to clipboard
- Button haptic feedback (iOS) / vibration (Android)
- Portrait mode only (landscape = v1.1)
- No network permission — works fully offline
- Dark mode (follows system)

### Out of scope (v1.1+)

- Graphing calculator
- Unit conversion (covered by existing Unit Conversion app)
- Expression history sync
- Custom themes/skins
- Widget support

## Acceptance Criteria (groomed for estimation)

1. Basic operations display correct results for all standard integer and decimal inputs
2. Scientific functions return accurate results to 8 decimal places
3. Expression chaining: `2 + 3 × 4` = 14 (standard precedence: × before +)
4. Parentheses: `(2 + 3) × 4` = 20
5. History: last 50 calculations saved, scrollable, tap to reuse result
6. History entries show expression and result; swipe to clear individual entries
7. "Copy result" copies numeric value (not expression) to clipboard with toast
8. No network requests made at any point; airplane mode verified
9. No permissions requested beyond what the OS grants by default
10. Calculator state survives app backgrounding/foregrounding
11. Error handling: division by zero shows "Undefined" (not crash)
12. Error handling: overflow shows "Error"
13. Accessibility: all buttons have visible labels and Voiceover/TalkBack support
14. Memory functions: M+, M−, MR, MC (basic memory store/recall)

## Open Questions / Tradeoffs

| Question | Options | Recommendation |
|---|---|---|
| Expression display style? | Natural display (fractions, exponents) vs. linear text | Start with linear text; natural display adds significant complexity |
| RPN mode? | Add as toggle vs. skip | Skip for MVP — niche audience |
| History persistence? | Session-only vs. persistent SQLite | Persist last 50 entries locally |

## Dependencies

- None beyond standard platform UI framework
- No backend infrastructure required
- Straightforward implementation — lowest complexity across all 5 candidates

---

**Reviewed by:** [CTO](/OTL/agents/cto) for technical feasibility — **PASSED.** See [OTL-30](/OTL/issues/OTL-30) for full assessment. Recommended: React Native + Expo with math.js. Zero platform risk. ~10 days implementation (single dev).
**Approved by:** PM

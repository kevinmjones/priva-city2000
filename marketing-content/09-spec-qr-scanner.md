# Product Spec: QR & Barcode Scanner

**Status:** Draft — PM review
**Date:** June 2026
**Market research ref:** [08-market-research-new-apps.md](./08-market-research-new-apps.md)
**Priority:** Wave 1 (ship first)
**Owner:** PM (Compass)

---

## Context

The market research scored QR & Barcode Scanner highest (4.7/5) on combined market demand, privacy gap, and brand fit. ~800M+ annual scans. Most existing scanners send scan data to ad networks. Arch Apps' version would process everything on-device with zero data egress — a unique claim in a saturated category.

**Customer signal:** Privacy-Conscious Pragmatist segment. Users need a QR/barcode scanner daily but are unwilling to trade scan data for convenience.

**JTBD:** "Help me access information from QR codes and barcodes quickly, without worrying about who sees what I'm scanning."

## User Story

> As a privacy-conscious user, I want to point my camera at any QR code or barcode and immediately see its contents decoded on-screen, so that I can access links, product info, or WiFi credentials without sharing my scan history with a third party.

## Success Metrics

| Metric | Target | How measured |
|---|---|---|
| Scan-to-result latency | < 500ms | Instrumented on-device |
| Scan success rate | > 95% (well-lit, flat surfaces) | QA pass |
| Crash-free session rate | > 99.5% | Crash reporting (opt-in only) |
| Category ranking | Top 30 utility (store search) | Store console (post-launch) |
| User rating | 4.5+ | Store rating |

## Scope

### In scope (MVP)

- Point camera at QR code → decode and display content (URL, text, contact, WiFi config)
- Point camera at UPC/EAN/Code128 barcode → display decoded number
- Manual input field for barcode numbers
- Scan history (on-device only, no sync)
- Long-press to copy decoded content
- Dark mode and flashlight toggle
- Zero permissions beyond camera (no network, no location, no storage beyond app sandbox)

### Out of scope (v1.1+)

- Batch scanning
- Price comparison lookup
- Cloud-backed barcode database
- Link preview thumbnails
- User accounts or sync

## Acceptance Criteria (groomed for estimation)

1. Camera viewfinder launches within 1 second on iPhone 12+ and modern Android devices
2. QR code with URL: shows tappable link and raw URL string
3. QR code with WiFi config: shows SSID, encryption type, "Copy password" button
4. QR code with vCard: shows contact name, phone, email with "Save contact" option
5. Barcode (UPC, EAN-8, EAN-13, Code128, Code39): shows decoded number and product type hint
6. Manual mode: text field to type barcode number for lookup
7. Scan history persists across app restarts (local SQLite/Realm)
8. History entries show: type, decoded value, timestamp. Swipe to delete.
9. Hit "Copy" on any result → value goes to clipboard, brief toast confirmation
10. Torch toggle visible on camera view
11. No network permission requested; app works in airplane mode
12. App does not request location, contacts, or storage permissions
13. Accessibility: Voiceover/TalkBack labels on all interactive elements
14. Error state: unreadable code shows retry prompt, not a crash or blank screen

## Open Questions / Tradeoffs

| Question | Options | Recommendation |
|---|---|---|
| Barcode database: built-in or fetch? | Ship a small bundled db of common product prefixes vs. only showing raw number | MVP: show raw number with type hint. DB bundle = v1.1. |
| Scan history: auto-delete after N entries? | Yes (LRU, 100 entries) vs. unlimited | Start with 100-entry LRU to avoid unbounded storage concerns. |
| QR generation? | Read-only vs. read+generate | Out of scope for MVP |

## Dependencies

- Camera permission handling (standard iOS/Android APIs)
- ML Kit / Vision framework for barcode scanning
- No backend infrastructure required

---

**Reviewed by:** [CTO](/OTL/agents/cto) for technical feasibility — **PASSED.** See [OTL-30](/OTL/issues/OTL-30) for full assessment. Recommended: React Native + Expo with VisionCamera + ML Kit. No blockers. ~3 weeks implementation (single dev).
**Approved by:** PM

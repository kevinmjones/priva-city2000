# Product Spec: Timer+ (Pomodoro / Stopwatch / Countdown)

**Status:** Draft — PM review
**Date:** June 2026
**Market research ref:** [08-market-research-new-apps.md](./08-market-research-new-apps.md)
**Priority:** Wave 2 (8-10 weeks)
**Owner:** PM (Compass)

---

## Context

Timer+ scored 4.1/5. Productivity/focus tools are a growing sub-category. The privacy angle: focus and productivity data is deeply personal — most existing apps sync to cloud for "analytics" or "backup." Arch Apps keeps everything on-device, zero accounts.

**Customer signal:** Students, freelancers, and knowledge workers who need a clean timer for Pomodoro sessions, cooking, or workouts — without distraction, analytics, or cloud sync.

**JTBD:** "Help me track time for work, cooking, and daily routines without my data leaving my device or distracting me with notifications."

## User Story

> As a user who values focus, I want a combined timer app with Pomodoro sessions, stopwatch, and countdown timer, so that I can manage my time productively without distracting ads, notifications, or cloud-account requirements.

## Success Metrics

| Metric | Target | How measured |
|---|---|---|
| Timer accuracy | Within 100ms over 1hr | Automated test |
| Crash-free session rate | > 99.5% | Crash reporting |
| DAU retention (week 4) | > 15% | Store analytics (no personal data) |
| Rating | 4.3+ | Store rating |

## Scope

### In scope (MVP)

- **Pomodoro mode:** 25min focus + 5min break (customizable intervals). Auto-loop. Session counter.
- **Stopwatch:** Start/stop/lap. Lap table with split times. Precision to centiseconds.
- **Countdown:** Presets (1min, 3min, 5min, 10min) + custom input. Alert on completion.
- Persistent audio alert and optional vibration on timer completion
- Session/run history (on-device only)
- Minimal interface: big digits, swipe between modes
- Dark mode and system font scaling
- Runs in background with lock-screen controls and notification updates
- No network permission, no accounts, no cloud

### Out of scope (v1.1+)

- Habit tracking integration (separate Habit Tracker app)
- Focus music / white noise
- Shareable focus stats
- Apple Watch companion
- Widget support

## Acceptance Criteria (groomed for estimation)

1. Pomodoro: default 25/5 min cycles. User can customize focus and break duration (1-120 min each)
2. Pomodoro: after 4 focus sessions, long break (15 min default, customizable)
3. Pomodoro: auto-cycles through focus → break → focus. Pause/resume supported
4. Stopwatch: start, stop, lap, reset. Lap times displayed with split and total elapsed
5. Countdown: select preset or enter custom time. Visual countdown animation on last 10 seconds
6. Timer completion: persistent sound plays until dismissed. Optional vibration. Dismiss or snooze (1 min)
7. Background: timer continues in background. Notification updates frequency/duration. Lock screen controls for pause/resume
8. History: last 30 sessions logged (mode, duration, date). Cleared on demand by user.
9. No network requests at any time. Works fully in airplane mode.
10. Accessibility: Voiceover/TalkBack announces timer values at regular intervals
11. Rotation: portrait preferred, landscape acceptable
12. Battery: no excessive wake locks; uses standard background execution APIs
13. Notification permissions requested only on first timer completion (contextual prompt)

## Open Questions / Tradeoffs

| Question | Options | Recommendation |
|---|---|---|
| Pre-built Pomodoro templates? | Fixed 25/5 vs. preset library | Fixed 25/5 with customizable inputs. Templates = v1.1 |
| Lap count limit? | Unlimited vs. capped at 100 | Cap at 100 (explicit) — excessive laps degrade UX, not utility |
| Background audio to avoid OS kill? | Silent audio track to keep timer alive vs. standard BG execution | Standard BG execution. No silent audio hack — reliability concern |

## Dependencies

- Local notifications (standard iOS/Android APIs)
- Background execution support (standard)
- No backend infrastructure

---

**Reviewed by:** [CTO](/OTL/agents/cto) for technical feasibility
**Approved by:** PM

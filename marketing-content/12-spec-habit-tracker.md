# Product Spec: Habit Tracker

**Status:** Draft — PM review
**Date:** June 2026
**Market research ref:** [08-market-research-new-apps.md](./08-market-research-new-apps.md)
**Priority:** Wave 2 (8-10 weeks)
**Owner:** PM (Compass)

---

## Context

Habit Tracker scored 3.9/5. Growing wellness/productivity crossover category. The privacy angle: daily routines and goals reveal deeply personal patterns. Most habit trackers require accounts and cloud sync. Arch Apps would be zero-account, zero-cloud, zero-distraction.

**Customer signal:** Users who want to build and maintain daily habits but don't want their personal goals stored on someone else's server or tied to social features.

**JTBD:** "Help me build and maintain daily habits with a simple check-in tool, without my routine data being stored in the cloud or tied to social features."

## User Story

> As someone trying to build better habits, I want a simple daily check-in tool to track my streaks and progress, so that I stay motivated without my personal goals being uploaded to a server or tied to social features.

## Success Metrics

| Metric | Target | How measured |
|---|---|---|
| Week-1 → week-4 retention | > 25% | Store analytics |
| Habits created per user (30 days) | > 3 | On-device analytics (opt-in) |
| Crash-free session rate | > 99.5% | Crash reporting |
| Rating | 4.2+ | Store rating |

## Scope

### In scope (MVP)

- Create habits with name, optional note, and frequency (daily / weekly / custom days)
- Daily check-in: tap to mark complete. Visual streak counter.
- Calendar view: see which days a habit was done (month overview)
- Multiple habits: list view with today's status
- Streak tracking: current streak + longest streak per habit
- Widget: today's check-in list on home screen (v1.0 if feasible, else v1.1)
- No accounts, no cloud sync, no social features
- Dark mode
- Export data as JSON (user-initiated only)

### Out of scope (v1.1+)

- Reminders/notifications
- Habit templates library
- Detailed statistics/charts
- Cloud backup or sync
- Social accountability / sharing

## Acceptance Criteria (groomed for estimation)

1. Create habit: enters name (required), optional note, frequency picker. Saved immediately.
2. Edit habit: tap existing habit to change name, note, or frequency
3. Delete habit: swipe to delete with confirmation dialog. Deleting a habit resets its streak.
4. Daily check-in: tap today's circle → fills. Tap again → unfills. In-app haptic feedback.
5. Streak display: each habit shows "🔥 7 days" current streak and "Best: 14 days" below
6. Calendar view: month grid with filled/unfilled dots for each habit. Swipe between months.
7. Today's list: habits sorted by creation order. At-a-glance see what's done and what's pending.
8. Widget: shows today's habits with check/uncheck. At least 2 sizes (small: next habit, medium: all).
9. No network requests at any point. Fully functional offline.
10. Data export: "Export as JSON" button → share sheet with generated file. Contains habit names, dates completed.
11. No delete/reset confirmation on streak loss for missed days — streaks decay naturally
12. Accessibility: Voiceover/TalkBack reads habit name and streak status on each cell

## Open Questions / Tradeoffs

| Question | Options | Recommendation |
|---|---|---|
| Streak: skip a day? | Allow "skip" (preserves streak) vs. natural decay | Natural decay — honesty is the point of the tool |
| Widget update frequency? | Real-time vs. app-open refresh | App-open refresh (no background processes) — privacy first |
| Maximum habits? | Unlimited vs. cap at 20 | Cap at 20 for MVP (prevents UX clutter, reduces storage concerns) |

## Dependencies

- Widget support (standard iOS/Android APIs)
- Local storage (SQLite)
- No backend infrastructure

---

**Reviewed by:** [CTO](/OTL/agents/cto) for technical feasibility
**Approved by:** PM

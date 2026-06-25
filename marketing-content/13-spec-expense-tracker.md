# Product Spec: Expense Tracker (Pocket Ledger)

**Status:** Draft — PM review
**Date:** June 2026
**Market research ref:** [08-market-research-new-apps.md](./08-market-research-new-apps.md)
**Priority:** Wave 3 (12+ weeks)
**Owner:** PM (Compass)

---

## Context

Expense Tracker scored 4.4/5 — second-highest weighted score but highest build complexity. Finance apps generate ~34B downloads annually. The privacy gap is severe: most expense trackers upload financial data to cloud servers for "sync" and "analytics." Arch Apps' offer: true offline-only expense tracking with CSV export as the only data movement path. Highest revenue potential of the 5 candidates via premium tier (advanced reports, budget alerts).

**Customer signal:** Freelancers, small business owners, and privacy-conscious savers who need to track expenses without uploading their financial life to a cloud service.

**JTBD:** "Help me track my spending and manage my budget without my financial data ever leaving my phone."

## User Story

> As someone who wants to control my spending, I want to log expenses, categorize them, and see where my money goes — all without uploading my financial data to any server.

## Success Metrics

| Metric | Target | How measured |
|---|---|---|
| Week-1 retention | > 30% | Store analytics (no personal data) |
| Revenue (premium tier) | > $500/mo year 1 | In-app purchase revenue |
| Crash-free session rate | > 99.5% | Crash reporting |
| Rating | 4.3+ | Store rating |

## Scope

### In scope (MVP)

- **Add expense:** amount, category (predefined list + custom), date, optional note. Saves instantly.
- **Add income:** same flow as expense, with category tags.
- **Categories:** predefined set (Food, Transport, Housing, Utilities, Entertainment, Health, Shopping, Other) + custom.
- **Transaction list:** chronological feed. Filterable by category, date range, type (expense/income).
- **Summary view:** current month: total income, total expenses, net balance. Bar/line chart.
- **CSV export:** all transactions as CSV via share sheet. Date, amount, category, type, note.
- **No accounts, no cloud sync, no backup.** Data lives in app sandbox.
- **Dark mode.** System font scaling.
- **Premium tier** (one-time IAP): advanced reports (3-month trends, category breakdown), budget alerts (monthly cap per category), multiple accounts/wallets.

### Out of scope (v1.1+)

- Bank feed integration / Plaid
- OCR receipt scanning
- Recurring transaction auto-detection
- Multi-currency support
- Encrypted cloud backup (opt-in)

## Acceptance Criteria (groomed for estimation)

1. Add expense: amount, category (picker), date (defaults to today), optional note. Save → appears in transaction list.
2. Add income: same flow with income/expense toggle. Income appears positively in net balance.
3. Predefined categories: 8 default. User can add custom categories (max 20 total).
4. Transaction list: reverse chronological. Each row shows: date, category icon, amount, note preview.
5. Filter: category dropdown, date range (calendar picker), type (all/expense/income). Filters stack.
6. Summary view: current month shows "Income: $X", "Expenses: $Y", "Net: $X-Y". Bar chart comparing daily expenses.
7. Edit transaction: tap → edit amount, category, date, note. Confirm saves.
8. Delete transaction: swipe or tap → delete. Confirmation dialog.
9. CSV export: generates file with headers Date,Type,Category,Amount,Note. Shares via OS share sheet.
10. No network requests at any time. Full functionality in airplane mode.
11. Premium IAP: unlocks "Reports" tab (3-month trends, category pie chart), budget caps per category, multiple wallets.
12. Budget: user sets monthly cap per category. When approaching (80%) and exceeding, in-app badge/alert on that category.
13. Multiple wallets (premium): create named wallets (e.g., "Cash", "Main Account"). Assign transactions to wallet. View balance per wallet.

## Open Questions / Tradeoffs

| Question | Options | Recommendation |
|---|---|---|
| Premium pricing? | $4.99 vs. $6.99 one-time | $5.99 one-time IAP — aligns with Arch Apps' "buy once" model, not subscription |
| Reports complexity? | Simple charts (native charts) vs. custom rendering | Native charts for MVP — custom rendering = higher complexity, defer if charting library unavailable |
| CSV vs. OFX/QIF export? | CSV only vs. banking-standard formats | CSV for MVP. OFX/QIF = v1.1 (niche demand) |
| Data migration path for future cloud backup? | Design schema now for eventual optional sync vs. purely local | Purely local for MVP. If cloud opt-in added later, export/import via CSV is the migration path |

## Dependencies

- In-app purchase setup (StoreKit / Google Play Billing)
- Chart rendering library (or native OS chart APIs)
- No backend infrastructure
- Higher testing burden due to financial data accuracy

---

**Reviewed by:** [CTO](/OTL/agents/cto) for technical feasibility — note: IAP integration adds platform-specific complexity
**Approved by:** PM

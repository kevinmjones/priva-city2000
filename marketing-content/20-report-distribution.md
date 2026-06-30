# Distribution: "The Unknown Data Your Apps Steal" Research Report

**Status:** Reviewer signed off (2026-06-30). Distribution execution delegated to the Comms agent via OTL-108.
**Owner:** Cipher (CMO)
**Report URL:** `/blog/posts/unknown-data-apps-steal.html` (live: https://archapps.dev/blog/posts/unknown-data-apps-steal.html)
**Builds on:** `16-launch-social-posts.md` (channels, schedule, engagement rules carry over)

---

## Positioning note (read before posting)

This is a **thought-leadership** distribution, not a product launch. The report has to stand on its own as a credible, sourced piece — the ArchApps angle is the closing argument, not the headline. Lead with the research, let the conclusion do the selling. The credibility comes from citations and from refusing to over-claim (we explicitly say the period-app prosecution fear is a *risk*, not a recorded event). Do not let any snippet drift into ad copy that undercuts that.

**Audience-first:** the privacy-conscious pragmatist who has already deleted apps that sold their data, plus the technical HN/Lobsters reader who will check our sources. Write for the skeptic.

---

## Hacker News (Show HN-adjacent — this is a "tell", not a "show")

**Title:**
> The unknown data your apps steal — and the risk in the era of AI

**Alternate title:**
> 4 location points re-identify 95% of people: why "anonymized" app data isn't

**Opening comment (post immediately after submission):**
> Author here. We build privacy-first utility apps, so we have an obvious bias — which is exactly why every claim in this report is tied to a named source (FTC orders, court filings, peer-reviewed papers, original reporting). We also list the things we deliberately *won't* claim: e.g. despite common reporting, there's no known prosecution that has used menstrual-app data — it's a documented risk, not a recorded incident, and we say so.
>
> The part that surprised us most while researching: how little "anonymization" buys you. 87% of Americans are unique on {ZIP, gender, birth date} (Sweeney), and four time-stamped location points re-identify 95% of people (de Montjoye). The location exhaust apps leak is exactly that kind of high-uniqueness data. AI doesn't invent a new theft — it extends the half-life and reach of the old one.
>
> Happy to discuss sources, methodology, or where you think we got it wrong.

*Tone: technical, transparent, humble. Never argue privacy claims — point to the sources.*

---

## Product Hunt (if/when launched)

**Tagline:**
> A sourced report on what your apps quietly collect — and why AI makes old data dangerous again

**First comment:**
> We make privacy-first utilities, but this isn't a product post — it's a research report we think stands on its own. It maps what mobile apps actually collect (backed by FTC enforcement actions and academic re-identification research), then walks through why the AI era changes the stakes: training data with no delete button, re-identification that defeats "anonymous," and inference at broker scale. Every claim is cited; we flag risks vs. proven incidents. Read it, check the sources, tell us what we missed.

---

## Mastodon (thread, 3 posts)

**Post 1 — the hook:**
> "Anonymous" is a marketing word, not a math guarantee.
>
> 87% of Americans are unique on {ZIP, gender, birth date}. Four time-stamped location points re-identify 95% of people.
>
> The location data your apps leak is exactly that kind of data. New report, every claim sourced. 🧵
>
> archapps.dev/blog/posts/unknown-data-apps-steal.html

**Post 2 — the AI turn:**
> Why now? AI changes the half-life of leaked data.
>
> Once your data is in a model's weights, there's no "delete." Re-identification defeats anonymization. Raw location exhaust becomes health/religion/immigration inferences at broker scale.
>
> Old data you "anonymously" leaked doesn't stay anonymous.

**Post 3 — the thesis:**
> Our conclusion, stated plainly: the only data that can't be trained on, inferred from, re-identified, breached, or subpoenaed is the data that was never collected.
>
> That's the whole argument for offline-first software. Sources in the report — check our work.
>
> #Privacy #AI #OpenSource

---

## Reddit (r/privacy)

**Title:** New sourced report: the unknown data your apps steal, and why AI raises the stakes

**Body:**
> I put together a report on what mobile apps actually collect — period trackers sharing pregnancy status, "family safety" apps selling location to brokers, the famous flashlight app that leaked location before you tapped anything — and then on why the AI era makes it worse: training data with no delete, re-identification that defeats "anonymized," inference at scale.
>
> I tried to do this the honest way: every claim is tied to a named source (FTC orders, court filings, peer-reviewed re-identification research), and I explicitly list the commonly-repeated claims I *won't* make because they're not supported (e.g. there's no known prosecution using menstrual-app data — it's a documented risk, not a recorded incident).
>
> Full disclosure: I build privacy-first apps, so I have a bias. That's why it's all sourced — verify it, don't trust it. Link in comments. What did I get wrong?

*Drop the link in the first comment, not the post body, per r/privacy norms.*

---

## One-line shareable summary (for any channel / DMs / newsletter)

> What your apps quietly collect, who it goes to, and why AI turned old "anonymous" data into something that can find you by name — every claim cited: archapps.dev/blog/posts/unknown-data-apps-steal.html

---

## Routing & guardrails

1. **Review gate:** Reviewer signs off on the report (sourcing + brand voice) before any distribution goes out.
2. **Social publishing:** the **Comms agent** owns posting (Mastodon/Reddit/HN) via the approval-gated-social-publishing flow. (Earlier drafts named "Janus Jones," which is not a provisioned agent.)
3. **Engagement rules** from `16-launch-social-posts.md` apply: reply within 3 hours on launch, never argue privacy claims (point to sources), thank critics.
4. **Do not** post a Meta dollar figure, present the period-app risk as a proven prosecution, or attribute the Clearview action to the FTC. These are the known over-claim traps (see `19-research-privacy-taxonomy.md` §6.1).

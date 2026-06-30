# Research Brief: Privacy-Violating App Categories + New ArchApps Ideas

**Status:** Final
**Owner:** CTO (OTL-104)
**Date:** June 2026
**Feeds:** OTL-104 (website face-lift / site copy) · OTL-105 (public research report)
**Builds on:** `08-market-research-new-apps.md` (does not duplicate it — that report ranks the apps we *build*; this brief maps the apps we *replace*).

---

## 0. How to consume this brief

This document has three consumable layers. Downstream tasks should pull the layer they need:

| Consumer | Pull this |
|---|---|
| **OTL-105 (report)** | §1 Category taxonomy + §2 AI-era risk + §6 Sources. These are the body of the public report. |
| **OTL-104 (site copy)** | §3 Reusable privacy-harm taxonomy (the harm vocabulary/badges) + §4 New app ideas (gallery + roadmap cards) + the "Replaces" mappings. |
| **PM / roadmap** | §4 New app ideas (each has a category it replaces, a one-line why, and rough complexity) + §5 Recommendation. |

**Sourcing discipline.** Every factual claim is tied to a named source in §6. We deliberately flag claims that are *risks* vs *realized incidents*, and we list (§6.1) commonly-repeated claims that are **wrong** and must not be published. The credibility of OTL-105 depends on not over-claiming.

---

## 1. Category taxonomy — the top offending categories

We grouped offenders by the three scope buckets in the brief: (A) **send data to third parties without user knowledge**, (B) **charge for / gate basic functionality**, (C) **require accounts or internet for things that should work offline**. Most bad actors do all three; we file each category under its dominant harm.

For each category: **example offending apps → what data → who it's shared with → what it's used for → source**.

### Category 1 — Period / fertility / health trackers
- **Examples:** Flo, Premom (Easy Healthcare), and (privacy-warning-flagged) Clue, Glow/Eve, Maya, Ovia.
- **Data collected:** Menstrual-cycle dates, symptoms, sexual activity, **the fact of a pregnancy**; Premom also exfiltrated **precise geolocation, IMEI, and device/advertising IDs**.
- **Shared with:** Flo sent identifiable health events to **Facebook, Google, AppsFlyer, Flurry, Fabric**. Premom shared with **Google, AppsFlyer**, and China-based analytics SDKs **Jiguang** and **Umeng** (Alibaba-owned).
- **Used for:** Ad targeting and marketing analytics — i.e., the *fact of a pregnancy* became an ad-targeting signal.
- **Enforcement:** FTC settled with Flo (2021); a class action (*Frasco v. Flo*) produced a combined ~$59.5M in settlements (Google $48M, Flo $8M, Flurry $3.5M) and a **2025 jury found Meta liable under California's wiretap law (CIPA)**. FTC barred Premom from sharing health data for ads (2023, Health Breach Notification Rule, $200K). [S1, S2, S3]
- **Why it matters now:** Post-*Dobbs*, Mozilla flagged 18 of 25 reproductive-health apps with a *Privacy Not Included* warning over vague law-enforcement-disclosure policies. (Frame as a documented *risk* — see §6.1; no prosecution is known to have used period-app data.) [S4]

### Category 2 — "Family safety" / location-sharing apps
- **Examples:** Life360; "Find My Kids"-style trackers.
- **Data collected:** Precise, continuous raw GPS location from tens of millions of users (Life360: ~33M).
- **Shared with:** Life360 sold precise location to data brokers including **X-Mode, Cuebiq, Allstate's Arity, and SafeGraph** (~a dozen partners; ~$16M of data-sale revenue in 2020).
- **Used for:** Resale into the location-data economy — ad targeting, "audience" building, insurance/driving analytics.
- **Source:** The Markup investigation (2021); Life360 later said it would stop selling precise data to most brokers. [S5]

### Category 3 — Location-data brokers & the SDKs that feed them
- **Examples (brokers):** X-Mode/Outlogic, Gravy Analytics/Venntel, Mobilewalla, InMarket, Kochava, SafeGraph. **Examples (carrier apps):** Muslim Pro and many "free" apps embedding broker SDKs.
- **Data collected:** Precise device location (Kochava: to within ~10 ft) from hundreds of millions to ~1 billion devices; Gravy curated **>17 billion location signals from ~1 billion devices daily**.
- **Shared with / sold to:** Advertisers, hedge funds, and **government agencies** — DHS/CBP/ICE bought bulk phone-location data from Venntel/Babel Street to sidestep warrants; X-Mode sold U.S. location data to **defense contractors**. Muslim Pro sent granular GPS to X-Mode undisclosed.
- **Used for:** Ad segments derived from where you go — including **women who visited pregnancy centers** (Mobilewalla) and segments by religion, gender identity, and visits to clinics/shelters/places of worship (Kochava).
- **Enforcement:** FTC's **first-ever ban on selling sensitive location data** hit X-Mode/Outlogic (Jan 2024); actions followed against InMarket, Mobilewalla, Gravy/Venntel (2024) and a Kochava settlement (May 2026). A Jan 2025 Gravy breach exposed location points near the White House, military bases, and places of worship. [S6, S7, S8, S9]

### Category 4 — "Free" single-purpose utilities that over-collect (flashlight, QR, cleaner, weather)
- **Examples:** Brightest Flashlight Free; The Weather Channel app (IBM); "cleaner/booster" apps; ad-laden QR scanners.
- **Data collected:** The textbook case — **Brightest Flashlight** transmitted **precise location + a unique device ID** to ad networks *the instant the app opened, before consent, even if the user tapped "Refuse."* The **Weather Channel** app collected precise location under a "personalized forecast" prompt.
- **Shared with:** Ad networks (flashlight); a dozen-plus ad sites **and hedge funds** (Weather Channel).
- **Used for:** Ad targeting and resale; weather-app location even fed consumer-behavior analysis for investors.
- **Enforcement:** FTC settled with Brightest Flashlight (2013/2014); the LA City Attorney sued IBM over the Weather Channel app (2019), settled 2020. **Note:** documented QR-scanner abuses are *adware/malware* (Sophos, Malwarebytes), not proven data-resale — so we frame QR as a "needless-permissions + ad-SDK" risk, the exact gap our QR Scanner already fills. [S10, S11, S12]

### Category 5 — "Free privacy" tools that betray the premise (free VPNs, antivirus/cleaners)
- **Examples:** Avast Free Antivirus (+ Jumpshot); Facebook's Onavo "Protect" VPN; assorted free VPNs.
- **Data collected:** Avast's free antivirus collected **detailed browsing histories** — every search, click, Maps GPS lookup, YouTube view. Onavo monitored users' activity in *other* apps.
- **Shared with / sold to:** Avast subsidiary **Jumpshot** sold the data ("Every search. Every click. Every buy.") to 100+ clients including **Home Depot, Google, Microsoft, Pepsi, McKinsey**. Onavo fed Facebook competitive intelligence.
- **Used for:** Resale to advertisers/market-research; corporate competitive surveillance.
- **Enforcement:** FTC **banned Avast from selling browsing data + $16.5M** (2024); Apple removed Onavo (2018), Facebook shut it down (2019). [S13, S14]

### Category 6 — Apps gating basic functionality behind accounts, subscriptions, or cloud
- **Pattern, not a single app:** calculators/timers/flashlights demanding internet permission "for ads"; note/scanner/habit apps forcing account creation and cloud sync for features that are inherently local; finance apps (Mint sunset → Intuit; YNAB at $14.99/mo) uploading the most sensitive data category "to sync."
- **Why it's a privacy harm, not just an annoyance:** Every forced account is an identity anchor; every forced cloud sync is a copy of your data on someone else's server, subject to breach, subpoena, policy change, and (increasingly) model training. This is the **bucket-B/C** harm that motivates ArchApps' "offline by design, no account, no internet permission" stance. [S15 — Mozilla on inaccurate Play "Data Safety" labels]

### Taxonomy summary table (drop-in for OTL-105)

| # | Category | Worst-case data | Goes to | Purpose | Anchor cite |
|---|---|---|---|---|---|
| 1 | Period/health trackers | Cycle + pregnancy status | Facebook, Google, AppsFlyer, Flurry, CN SDKs | Ad targeting | FTC Flo/Premom [S1–S3] |
| 2 | Family-safety location | Continuous precise GPS | X-Mode, Cuebiq, Arity, SafeGraph | Resale | Markup [S5] |
| 3 | Location brokers + SDKs | Precise location, ~1B devices | Advertisers, hedge funds, govt, military | Profiling segments | FTC X-Mode/Gravy/Mobilewalla [S6–S9] |
| 4 | "Free" over-collecting utilities | Location + device ID pre-consent | Ad networks, hedge funds | Ad targeting/resale | FTC Flashlight; LA v. IBM [S10–S12] |
| 5 | Fake-privacy VPN/antivirus | Full browsing history | Jumpshot's 100+ buyers | Resale, competitive intel | FTC Avast [S13–S14] |
| 6 | Account/cloud-gated basics | Whatever the app touches | The vendor's cloud (then breach/subpoena/training) | Lock-in + exposure | Mozilla labels [S15] |

---

## 2. AI-era risk angle (seeds OTL-105)

The data harvested by the categories above was already harmful in the ad-targeting era. AI changes the **half-life and reach** of that harm in four ways. The throughline: *data you "anonymously" leaked years ago does not stay anonymous, and does not stay yours.*

**(a) It becomes training data.** Web- and app-sourced personal data is now bulk-ingested to train models. LAION-5B (~5B scraped image-text pairs behind Stable Diffusion) was found to contain a person's **private post-op medical photos** and thousands like them, plus thousands of suspected CSAM instances (Stanford). The NYT's suit against OpenAI shows even *published* text is reproduced near-verbatim. Once your data is in a model's weights, there is no "delete." [S16, S17, S18]

**(b) Re-identification defeats "anonymized."** "Anonymous" is a marketing word, not a math guarantee. Foundational results: **87% of Americans** are uniquely identified by {ZIP, gender, birth date} (Sweeney); **four time-stamped location points re-identify 95%** of people in a 1.5M-person mobility dataset, and four points re-identify 90% in credit-card records (de Montjoye); the "anonymous" Netflix Prize ratings of 500K users were de-anonymized with IMDb. The location exhaust from Categories 2–4 is exactly this kind of high-uniqueness data. [S19, S20, S21]

**(c) AI turns raw exhaust into sensitive inferences at scale.** Brokers already build ML "audience segments" — Mobilewalla segmented **women who visited pregnancy centers**; Kochava built segments by religion, gender identity, and clinic/shelter/worship visits. Modern models make this cheaper, broader, and predictive: from where-you-went, infer health status, sexuality, religion, immigration status, and political affiliation — traits the user never disclosed. A single broker holds ~1,500 attributes on ~500M people (Acxiom); one FTC-studied broker held **>700 billion aggregated data elements**. [S9, S22, S23]

**(d) Scraping + face recognition closes the loop to your physical identity.** Clearview AI scraped **billions of public photos** (claimed 30B+ images) into a faceprint database sold to police; it was banned under Illinois BIPA and fined by EU/UK regulators. Combine a faceprint with re-identified location history and broker attributes and you have cross-linked, real-world, real-name profiles — assembled from data each app swore was "anonymous." [S24]

**The ArchApps thesis, stated for the report:** the only data that can't be trained on, inferred from, re-identified, breached, or subpoenaed is the data that **was never collected**. Offline-first, zero-egress, no-account design isn't a feature — in the AI era it's the only durable privacy guarantee.

---

## 3. Reusable privacy-harm taxonomy (for site badges / report framing)

A compact, reusable vocabulary so the site and report describe harms consistently. Each ArchApps page can show which harms it **avoids**; the report can score offenders against the same axes.

| Harm axis | Offender behavior | ArchApps stance |
|---|---|---|
| **Data egress** | Sends data off-device to third parties | Zero network egress (offline-first) |
| **Identity anchoring** | Forces account / login | No account, ever |
| **Cross-app tracking** | Reads/sends advertising ID (IDFA/GAID) | No ad IDs, no SDKs |
| **Sensitive inference** | Location/health → profiling segments | Nothing to infer from |
| **Functionality gating** | Paywalls or cloud-gates basic features | Core features free + local |
| **Permission overreach** | Asks for permissions unrelated to function | Minimum viable permissions |
| **Retention/afterlife** | Cloud copy → breach/subpoena/training | Data dies with the device/uninstall |

Suggested site badge set (subset of the above, plain-language): **No accounts · No tracking · No ads · Works offline · Nothing leaves your device.**

---

## 4. New app ideas (5+) — mapped to the category each replaces

These extend `08-market-research-new-apps.md`. That report already greenlit **QR Scanner, Calculator, Timer+, Habit Tracker, Expense Tracker** (Waves 1–3, now on the roadmap). The ideas below are a proposed **Wave 4 candidate set**, each chosen because it directly replaces a documented offender from §1 — which gives every one of them a built-in, citable "why now" story.

| # | Proposed app | Replaces (category) | One-line why | Rough complexity |
|---|---|---|---|---|
| 1 | **Flashlight** | Cat 4 — over-collecting utilities (Brightest Flashlight, FTC) | The most famous privacy-abuse app in history needs an honest twin: a flashlight that asks for *zero* permissions and ships with literally no network code. The ultimate proof-of-ethos. | **Trivial** |
| 2 | **Cycle Tracker** | Cat 1 — period/health trackers (Flo/Premom, FTC) | A 100%-on-device period/fertility tracker: no account, no cloud, no third-party SDK, nothing to subpoena post-*Dobbs*. The single strongest privacy narrative we can own. | **Medium-High** |
| 3 | **Local Weather** | Cat 4 — weather apps (Weather Channel/IBM) | Forecast from coarse, on-device-resolved location with a public weather API and **no location resale, no profile, no hedge-fund pipe**. | **Medium** |
| 4 | **Doc/Receipt Scanner** | Cat 4/6 — cloud scanner apps (ad-laden, ex-malware) | On-device document/receipt capture → PDF, with automatic **EXIF/metadata stripping** and export as the only egress path. Pairs naturally with our QR Scanner and Expense Tracker. | **Medium** |
| 5 | **Photo Metadata Scrubber** | Cat 3 — location-leak surface | One-tap removal of GPS coordinates and EXIF/IPTC metadata from photos *before* you share them — kills the exact location signal that feeds re-identification (§2b). Tiny, viral, deeply on-brand. | **Low** |
| 6 | **Secure Notes / Notepad** | Cat 6 — account/cloud-gated basics (cloud note apps) | A plaintext/markdown notepad that is local-only with optional on-device encryption — no account, no sync, no "your notes, our servers." | **Low-Medium** |
| 7 *(stretch)* | **Nearby / Family Locator** | Cat 2 — family-safety location (Life360) | A privacy-respecting location-share for families using end-to-end encryption and **no broker resale** — the explicit anti-Life360. High complexity/ongoing infra; flagged as a stretch because it needs a server and breaks our pure offline model. | **High** |

**Recommended priority for Wave 4:** ship **Flashlight** + **Photo Metadata Scrubber** first (both trivial-to-low, both with razor-sharp privacy stories), then **Cycle Tracker** (highest narrative value, our flagship privacy app), then **Local Weather** and **Doc Scanner**. Hold **Nearby/Family Locator** as a deliberate decision — it requires servers and would be our first app that isn't pure-offline, so it needs an explicit architecture call (E2EE relay, zero-knowledge) before committing.

Each idea above is concrete enough to drop onto `gallery.html` / `roadmap.html` as a card and into the PM backlog as an epic. Specs would follow the pattern of `09`–`13`.

---

## 5. Recommendation

1. **Publish OTL-105 around §1 + §2**, leading with the strongest, most bulletproof anchors: Avast/Jumpshot (FTC 2024, $16.5M), Flo (FTC 2021 + 2025 Meta CIPA verdict), X-Mode (FTC 2024, first-ever location ban), Brightest Flashlight (the textbook case). Avoid the three false claims in §6.1.
2. **Wire §3's harm vocabulary into the site (OTL-104)** as per-app "what we *don't* do" badges — it turns abstract "privacy-first" into specific, verifiable claims tied to real-world abuses.
3. **Adopt the Wave 4 candidate set (§4)** into the roadmap, with Flashlight + Metadata Scrubber as quick wins and Cycle Tracker as the flagship narrative app.
4. **Make the "Replaces X" mapping a first-class site pattern** — every new app card names the documented offender it replaces and links to the report. This is differentiated, honest, and impossible for ad-supported incumbents to copy.

---

## 6. Sources

All claims attributed to named sources. FTC press pages are primary; where FTC blocks automated fetch, facts were cross-verified against Federal Register, The Markup, Bloomberg Law, HIPAA Journal, and academic mirrors.

- **[S1]** FTC, *Developer of popular women's fertility-tracking app settles FTC allegations* (Flo), Jan 2021 / finalized Jun 2021.
- **[S2]** *Frasco v. Flo Health* — ~$59.5M combined settlements (Google $48M, Flo $8M, Flurry $3.5M); 2025 SF jury found Meta liable under CIPA. (HIPAA Journal; National Law Review; Labaton.) *Meta damages not yet set — do not cite a Meta dollar figure.*
- **[S3]** FTC, *Ovulation-tracking app Premom barred from sharing health data for advertising*, May 2023 (Health Breach Notification Rule; $200K; named Jiguang/Umeng SDKs).
- **[S4]** Mozilla Foundation, *Privacy Not Included* reproductive-health review (18 of 25 flagged), Aug 2022.
- **[S5]** The Markup (Keegan & Ng), *The popular family-safety app Life360 is selling precise location data*, Dec 2021.
- **[S6]** FTC, *Order prohibits data broker X-Mode Social / Outlogic from selling sensitive location data*, Jan 2024 (first-ever).
- **[S7]** FTC, *Action against Gravy Analytics / Venntel*, Dec 2024 (>17B signals from ~1B devices daily); Gravy breach, TechCrunch Jan 2025.
- **[S8]** FTC, *Action against Mobilewalla*, Dec 2024 (>500M ad IDs + precise location; pregnancy-center segment).
- **[S9]** FTC v. Kochava (filed 2022; settlement May 2026 banning sensitive-location sales). Bloomberg Law, 2026.
- **[S10]** FTC, *Android Flashlight App Developer Settles FTC Charges* (Brightest Flashlight / Goldenshores), Dec 2013 / final order Apr 2014.
- **[S11]** LA City Attorney v. TWC Product & Technology (IBM / The Weather Channel app), filed Jan 2019; settled Aug 2020 (Fortune; 9to5Mac; orig. NYT reporting Dec 2018).
- **[S12]** SophosLabs (Mar 2018) and Malwarebytes (Feb 2021) on malicious QR-reader apps — *adware/malware, not data-resale.*
- **[S13]** Vice/Motherboard, *Avast antivirus sells user browsing data* (Jumpshot; named buyers), Jan 2020.
- **[S14]** FTC, *Order will ban Avast from selling browsing data … $16.5M*, Feb 2024 / final Jun 2024; Onavo: TechCrunch 2018–2019.
- **[S15]** Mozilla, *See No Evil* — ~80% of Google Play Data Safety labels false/misleading, 2023.
- **[S16]** *NYT v. OpenAI/Microsoft*, filed Dec 2023 (Harvard Law Review, 2024).
- **[S17]** Stanford Internet Observatory — CSAM in LAION-5B (3,226 suspected); dataset taken offline, 2023.
- **[S18]** Private medical photos found in LAION-5B, 2022 (Ars Technica / PetaPixel).
- **[S19]** Latanya Sweeney, *Simple Demographics Often Identify People Uniquely* (87%), CMU, 2000.
- **[S20]** de Montjoye et al., *Unique in the Crowd* (4 points → 95%), Scientific Reports, 2013; *credit-card* study (4 points → 90%), Science, 2015.
- **[S21]** Narayanan & Shmatikov, Netflix Prize de-anonymization, IEEE S&P 2008.
- **[S22]** Natasha Singer, *You for Sale: … the Consumer Genome* (Acxiom: ~1,500 points on ~500M consumers), NYT, 2012.
- **[S23]** FTC, *Data Brokers: A Call for Transparency and Accountability*, May 2014 (>700B aggregated data elements at one broker; 3B new records/month).
- **[S24]** Clearview AI — ACLU/BIPA settlement May 2022 (banned from selling faceprints to most private entities); Italian Garante €20M; UK ICO actions. *Not an FTC action.*

### 6.1 Do NOT publish these (commonly-repeated but wrong)

- **The 2022 Nebraska abortion case** used **Facebook Messenger messages obtained by warrant — not period-app data.** Do not present it as a period-tracker case.
- **No documented prosecution is known to have used menstrual/fertility-app data.** It is a real, documented *risk* (and a real subpoena-compliance reality), not a realized incident. Frame it that way.
- **Clearview AI was not sanctioned by the FTC.** US action came via Illinois BIPA (ACLU) + class action; fines came from the EU (Garante) and UK (ICO).
- **Acxiom's "1,500 data points" pairs with ~500 million people**, not the often-repeated 700 million.
- Treat vendor self-reported scale numbers (Oracle/Epsilon/Mobilewalla daily counts) and commercial-review-site claims (free-VPN ownership studies) as **claims**, not audited facts.

---

*Prepared by CTO for OTL-104. Research sourced via Mozilla, FTC, The Markup, Vice/Motherboard, academic literature (Sweeney; de Montjoye; Narayanan & Shmatikov), and major journalism. Reliability flags retained intentionally so downstream copy does not over-claim.*
</content>
</invoke>

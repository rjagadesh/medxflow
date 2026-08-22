// Blog / resources content. Each post is targeted at a specific long-tail RCM
// search a new domain can realistically rank for, and links internally to the
// relevant product page. Rendered by Blog.jsx and prerendered (Article + FAQ
// JSON-LD) by scripts/prerender.mjs.

export const POSTS = [
  {
    slug: "how-much-does-rcm-automation-cost",
    snippet: "RCM automation is usually priced one of four ways: per completed workflow outcome, per claim, a percentage of collections (commonly 4 to 9 percent), or a flat monthly platform fee. Per-outcome and per-claim pricing tend to be the most predictable, and the honest test is whether the rate sits below the loaded cost of doing the same work in-house or offshore.",
    title: "How Much Does RCM Automation Cost? A Straight Answer",
    description: "What RCM automation actually costs in 2026 - the four pricing models, what drives the price, and how to compare it against your current in-house or offshore cost.",
    date: "2026-08-21",
    category: "Pricing",
    readMins: 7,
    keywords: ["RCM automation cost", "how much does RCM automation cost", "RCM software pricing", "revenue cycle automation pricing"],
    related: { label: "Estimate your savings with the ROI calculator", href: "/roi-calculator/" },
    intro: "Pricing for revenue cycle automation is frustratingly opaque - most vendors will not publish a number until they have you on a call. The reality is simpler than it looks: there are only four common models, and once you know them you can compare any two vendors on the same footing. Here is how RCM automation is priced, what moves the number, and the one benchmark that actually tells you whether a price is fair.",
    sections: [
      { h: "The four ways RCM automation is priced", p: [
        "Almost every vendor uses one of four models: per completed workflow outcome, per claim, a percentage of collections, or a flat monthly platform fee. Some blend them. The model matters more than the headline rate, because it determines whether your cost scales with value or just with volume.",
      ] },
      { h: "Per completed outcome (or per claim)", p: [
        "You pay for finished work - an eligibility check completed, a claim submitted, a denial worked. This is the most transparent model: you can tie every dollar to an output, and the cost rises only as the work rises. Per-claim pricing (common for tasks like EOB-to-ERA conversion) works the same way, often in the range of a few cents to a couple of dollars per claim depending on complexity.",
      ] },
      { h: "Percentage of collections", p: [
        "The traditional medical-billing model: the vendor takes a cut of what they collect, commonly 4 to 9 percent for small and mid-size practices (larger volumes negotiate lower). It aligns incentives, but it is the least predictable, and as your revenue grows you pay more for the same work. Watch for percentage pricing dressed up as automation - you are often still paying a services rate.",
      ] },
      { h: "Flat monthly platform fee", p: [
        "A fixed subscription, sometimes tiered by provider count or volume, sometimes with per-seat add-ons. Predictable and easy to budget, but check what is actually included: seats, integrations, support and overage can turn a clean monthly number into a variable bill.",
      ] },
      { h: "The only benchmark that matters", p: [
        "Ignore the sticker and ask one question: does this cost less than doing the same work yourself? Add up the fully-loaded cost of the staff doing that work today (salary plus benefits and overhead, in-house or offshore) and compare it to the vendor's price for automating it. If the automation does not sit clearly below your loaded labor cost, it is not saving you money, whatever the model.",
      ] },
      { h: "Pricing red flags to watch", list: [
        "A percentage of collections marketed as AI automation - you may be paying services pricing for software work.",
        "Per-seat fees on top of a platform fee, which punish you for adding staff.",
        "Long lock-in with no clear go-live date or performance guarantee.",
        "Opaque overage or integration charges that only appear after signing.",
        "No willingness to price against your actual three-month volumes.",
      ] },
    ],
    faq: [
      { q: "How much does RCM automation cost per claim?", a: "It varies by task and complexity, but per-claim automation typically ranges from a few cents to a couple of dollars per claim. Simpler, high-volume tasks like remittance posting sit at the low end; complex work like denial appeals costs more." },
      { q: "Is percentage-of-collections or flat-fee pricing better?", a: "Flat-fee and per-outcome pricing are more predictable and do not increase your cost as revenue grows. Percentage-of-collections aligns incentives but becomes expensive at scale. The best test is which one lands below your current loaded labor cost." },
      { q: "How do I compare RCM automation vendors on price?", a: "Normalize them to the same model. Convert each quote to a cost per completed unit of work, then compare that against the fully-loaded cost of doing it in-house or offshore today. A free ROI calculator makes this quick." },
    ],
  },
  {
    slug: "why-are-medical-claims-denied",
    snippet: "Medical claims are denied for a small set of recurring reasons: eligibility and registration errors, missing or invalid prior authorization, missing or incorrect information, medical-necessity and coding mismatches, duplicate claims, non-covered services, and untimely filing. Most are avoidable because they originate at the front of the revenue cycle, before the claim is submitted.",
    title: "Why Are Medical Claims Denied? The 12 Most Common Reasons",
    description: "The 12 most common reasons medical claims are denied - eligibility, prior authorization, coding, medical necessity, timely filing and more - and how to prevent each one before submission.",
    date: "2026-08-21",
    category: "Denial Management",
    readMins: 8,
    keywords: ["why are medical claims denied", "reasons claims are denied", "common claim denial reasons", "medical claim denials"],
    related: { label: "See MedXFlow Denial Management", href: "/products/denial-management/" },
    intro: "A denied claim is earned revenue stuck in limbo, and roughly two-thirds of denials are never reworked. The good news is that denials are not random - they cluster around a handful of causes, and most of them happen before the claim ever leaves your practice. Fix the top few and you fix the majority. Here are the twelve most common reasons claims get denied, and how to stop each one.",
    sections: [
      { h: "The 12 most common denial reasons", list: [
        "Eligibility or coverage inactive - the patient's plan was not active on the date of service.",
        "Registration or demographic errors - wrong member ID, name, date of birth or subscriber details.",
        "Missing or invalid prior authorization - the service required an auth that was not obtained or had expired.",
        "Missing or incorrect information - absent modifiers, invalid NPI, incomplete claim fields.",
        "Medical necessity - the diagnosis does not support the procedure billed.",
        "Coding errors - unbundling, mutually exclusive codes, or NCCI/MUE edits.",
        "Non-covered service - the plan simply does not cover the service.",
        "Duplicate claim - the same claim was submitted more than once.",
        "Coordination of benefits - the wrong payer was billed first.",
        "Untimely filing - the claim arrived after the payer's deadline.",
        "Bundling - the service is considered part of another paid service.",
        "Authorization or referral mismatch - the auth or referral does not match the code or provider billed.",
      ] },
      { h: "Why most denials are preventable", p: [
        "Notice how many of these begin at the front desk: eligibility, registration, prior authorization and coordination of benefits are all decided before the visit. Industry analysis consistently finds that the large majority of denials are avoidable, because they stem from front-end data and process gaps rather than the clinical work itself.",
      ] },
      { h: "How to prevent them", p: [
        "Verify eligibility at scheduling and again 24 to 48 hours before the visit. Keep a payer-specific list of what needs prior authorization and confirm the auth is on the claim. Scrub coding for medical-necessity and NCCI edits before submission. Then work the denials that do happen fast, and record the root cause so the same one does not recur.",
        "This is exactly the work AI agents are suited to: catching eligibility, auth and coding issues at the point they are cheapest to fix, and triaging the denials that slip through by reason code.",
      ] },
    ],
    faq: [
      { q: "What is the most common reason claims are denied?", a: "Front-end issues lead: eligibility and registration errors, followed closely by missing prior authorization. These are also the most preventable, because they are decided before the claim is submitted." },
      { q: "What percentage of denials are preventable?", a: "Industry analysis estimates that around 85 percent of denials are avoidable, since most originate from eligibility, registration, prior authorization and coding gaps at the front of the revenue cycle." },
      { q: "What is the difference between a rejection and a denial?", a: "A rejection happens at the clearinghouse or payer front end before adjudication, usually for a formatting or data error, and can be corrected and resubmitted. A denial happens after adjudication, when the payer decides not to pay, and generally requires an appeal." },
    ],
  },
  {
    slug: "medical-billing-ar-days-benchmark",
    snippet: "In medical billing, days in accounts receivable (A/R) measures how long it takes to collect. Under 40 days is generally healthy, best-in-class practices run 30 to 35, and over 50 days signals a problem. Aged A/R over 90 days should stay under about 15 to 20 percent of total A/R.",
    title: "Medical Billing AR Days Benchmark: What Good Looks Like in 2026",
    description: "Days in A/R benchmarks for medical billing in 2026 - what is healthy, what is at-risk, how it varies by specialty, and how to bring your A/R days down.",
    date: "2026-08-22",
    category: "AR Management",
    readMins: 6,
    keywords: ["AR days benchmark", "days in AR medical billing", "accounts receivable days healthcare", "good AR days"],
    related: { label: "See MedXFlow Reporting & Analytics", href: "/products/reporting-analytics/" },
    intro: "Days in accounts receivable is the single clearest read on how fast your practice turns care into cash. It is easy to calculate and easy to benchmark, and a rising number is usually the first sign that follow-up or denials are slipping. Here is what a healthy A/R days figure looks like, how it varies, and how to move it.",
    sections: [
      { h: "How A/R days is calculated", p: [
        "Days in A/R equals your total accounts receivable divided by average daily charges (total charges over a period divided by the number of days in it). It tells you, on average, how many days of revenue are sitting uncollected. Track it monthly and watch the trend, not just the number.",
      ] },
      { h: "Healthy vs at-risk benchmarks", list: [
        "Under 40 days: healthy for most practices.",
        "30 to 35 days: best-in-class.",
        "40 to 50 days: watch closely, follow-up may be slipping.",
        "Over 50 days: a problem, usually denials or A/R follow-up falling behind.",
        "A/R over 90 days: keep under roughly 15 to 20 percent of total A/R.",
      ] },
      { h: "How it varies by specialty", p: [
        "Benchmarks shift with payer mix and claim complexity. Practices weighted toward government payers or surgical and specialty claims (with more prior authorization and higher dollar values) tend to run higher A/R days than high-volume, low-complexity primary care. Compare yourself to your own trend and to peers in your specialty, not to a single universal number.",
      ] },
      { h: "How to bring A/R days down", p: [
        "The levers are front-loaded: verify eligibility and secure authorizations before the visit so claims go out clean, submit quickly, and work A/R by payer and dollar value the moment claims age. Catch underpayments against contracted rates, and route denials to resolution instead of letting them sit. Automating the follow-up is where practices claw back the most, because nothing stalls.",
      ] },
    ],
    faq: [
      { q: "What is a good days in A/R for medical billing?", a: "Under 40 days is generally healthy, and best-in-class practices run 30 to 35 days. Above 50 days usually points to a follow-up or denial problem." },
      { q: "How do you calculate days in A/R?", a: "Divide total accounts receivable by average daily charges (total charges for a period divided by the number of days in that period). The result is the average number of days revenue sits uncollected." },
      { q: "What percentage of A/R should be over 90 days?", a: "Aim to keep A/R aged over 90 days under roughly 15 to 20 percent of total A/R. A higher share signals that older claims are not being worked to resolution." },
    ],
  },
  {
    slug: "x12-278-prior-authorization-explained",
    snippet: "The X12 278 is the EDI transaction for electronic prior authorization: the 278 request asks a payer to authorize a service, and the 278 response returns the decision. It can automate what is usually a manual portal-and-phone process, but payer adoption is uneven, which is why many authorizations still require portal or fax work.",
    title: "X12 278 Explained: Automating Prior Authorization Service Reviews",
    description: "What the X12 278 prior authorization transaction is, how the request and response work, why adoption lags, and how AI bridges the gap where payers do not support it.",
    date: "2026-08-22",
    category: "Technical / EDI",
    readMins: 7,
    keywords: ["X12 278", "278 prior authorization", "electronic prior authorization EDI", "278 transaction"],
    related: { label: "See MedXFlow Pre-Authorization", href: "/products/pre-authorization/" },
    intro: "Prior authorization is one of the most manual, painful steps in the revenue cycle, and the EDI standard meant to fix it - the X12 278 - is also the least consistently adopted. If you are automating prior auth, understanding the 278 (and its limits) tells you exactly where clean automation ends and where you still need portal or phone work.",
    sections: [
      { h: "What the 278 is", p: [
        "The X12 278 is the standard EDI transaction for a health care services review - in practice, prior authorization and referrals. It is the authorization counterpart to the 270/271 (eligibility) and 837 (claims): a structured, machine-readable request and response instead of a portal form.",
      ] },
      { h: "Request and response", p: [
        "The 278 request carries the patient, provider, service and diagnosis details the payer needs to make a decision. The 278 response returns the outcome: certified (approved), pended (needs more information), or not certified (denied), often with an authorization number when approved. Some payers support real-time 278; others process it in batch.",
      ] },
      { h: "Why adoption lags", p: [
        "Unlike eligibility, where 270/271 is near-universal, 278 support is patchy. Many payers require clinical documentation that does not fit neatly into the transaction, or route certain services through their own portals. That is why, even in 2026, a large share of authorizations still involve a portal login or a phone call.",
      ] },
      { h: "Where FHIR and Da Vinci fit", p: [
        "Newer standards are pushing electronic prior auth forward: the HL7 Da Vinci prior-authorization work (built on FHIR APIs) aims to make auth requirements and submissions programmatic, including attaching clinical documentation. It is promising and gaining regulatory momentum, but it coexists with 278 and portals rather than having replaced them.",
      ] },
      { h: "How AI bridges the gap", p: [
        "Because the landscape is mixed, reliable prior-auth automation cannot depend on 278 alone. The practical approach is to use the 278 where a payer supports it, and use AI agents to work the payer portals and follow up where it does not - determining what needs auth, submitting with the right documentation, and tracking to a decision, whatever channel the payer uses.",
      ] },
    ],
    faq: [
      { q: "What is the X12 278 transaction?", a: "It is the EDI standard for a health care services review - prior authorization and referrals. The 278 request asks a payer to authorize a service, and the 278 response returns the decision, often with an authorization number." },
      { q: "Why do payers still require portals if the 278 exists?", a: "Adoption of the 278 is uneven. Many payers require clinical documentation that does not fit the transaction well, or route certain services through their own portals, so a large share of authorizations still involve portal or phone work." },
      { q: "How is prior authorization automated end to end?", a: "By combining the 278 where payers support it with AI agents that handle the rest: detecting what needs authorization, submitting with documentation, working payer portals where there is no 278, and tracking each request to a decision." },
    ],
  },
  {
    slug: "ai-agents-provider-credentialing",
    snippet: "AI agents support provider credentialing by preparing and submitting payer enrollment and credentialing applications, keeping CAQH and PECOS profiles current, tracking each application to approval, and monitoring re-credentialing and expirable dates - so new providers become billable faster and no claim is filed under a lapsed credential.",
    title: "How AI Agents Support Provider Credentialing and Payer Enrollment",
    description:
      "How AI agents speed up provider credentialing and payer enrollment - preparing applications, tracking status, keeping CAQH current, and monitoring re-credentialing so providers stay billable.",
    date: "2026-08-20",
    category: "Credentialing",
    readMins: 8,
    keywords: ["provider credentialing", "credentialing automation", "payer enrollment", "AI agents credentialing", "medical credentialing software"],
    related: { label: "See MedXFlow Credentialing & Provider Enrollment", href: "/products/credentialing/" },
    intro:
      "Credentialing is the least visible part of the revenue cycle and one of the most expensive to get wrong. Until a payer has enrolled and credentialed a provider, every claim for that provider can be delayed, denied or paid out of network, and the clock on that lost revenue starts the day the provider is ready to see patients. Credentialing is also slow, paperwork-heavy and easy to let slip, which makes it a natural fit for AI agents. Here is what the work actually involves and where an agent takes the load off your team.",
    sections: [
      {
        h: "What provider credentialing actually involves",
        p: [
          "Credentialing is the process of verifying a provider's qualifications - education, training, licensure, board certification, work history and malpractice history - and enrolling them with each payer so their claims can be paid. It is not one task but a sequence: gathering and verifying documents, completing a CAQH profile, submitting an application to every payer, and then following that application until the payer issues an effective date.",
          "It also does not end at approval. Licenses, DEA registrations, board certifications and the payer credential itself all expire, and each payer requires re-credentialing on its own cycle, typically every two to three years. Miss one of those dates and a provider who was billing yesterday can be non-par today.",
        ],
      },
      {
        h: "Where the delays and revenue leaks come from",
        p: [
          "Credentialing a new provider commonly takes 90 to 120 days, and most of that time is spent waiting on and chasing payers, not doing anything a person needs to think about. Every week of delay is a week the provider is seeing patients whose claims cannot be cleanly billed.",
          "The leaks are predictable: applications held up by an incomplete or out-of-date CAQH profile, a single missing document, a payer that never responded and was never followed up, or an expirable that lapsed because no one was watching the calendar. None of these are hard problems. They are attention problems, which is exactly what an agent is good at.",
        ],
      },
      {
        h: "How AI agents support credentialing",
        p: [
          "An AI credentialing agent carries the repetitive, deadline-driven work end to end, and hands the judgment calls to your team. In practice that means five things:",
          "Intake and profile building: the agent collects a provider's licenses, education, work history and identifiers once, into a single reusable profile, validates the provider's NPI against the CMS NPPES registry as a primary source, and flags anything missing before it becomes a rejection.",
          "Application preparation and submission: it prepares and submits enrollment and credentialing applications across your full payer mix - commercial, Medicare and Medicaid - reusing the profile rather than re-keying the same data into every form.",
          "Status tracking and follow-up: every application is tracked to approval, with the agent checking payer portals and chasing status instead of a coordinator sitting on hold.",
          "CAQH and PECOS upkeep: it keeps CAQH, PECOS and payer profiles complete and attested, so applications are not held up by stale data or a missed re-attestation.",
          "Re-credentialing and expirables: it monitors licenses, DEA, board certifications and each payer's re-credentialing cycle, and surfaces anything approaching its deadline well before it lapses.",
        ],
      },
      {
        h: "Credentialing and payer enrollment are not the same thing",
        p: [
          "The two terms are often used interchangeably, but they are distinct steps. Credentialing is the verification of the provider's qualifications. Payer enrollment (sometimes called provider enrollment) is registering that verified provider with a specific payer so claims can be submitted and paid. A provider can be credentialed and still not be enrolled with a given plan, which is a common reason claims are unexpectedly denied or paid out of network. An agent tracks both, per payer, so there are no gaps.",
        ],
      },
      {
        h: "What stays with your team",
        p: [
          "Credentialing carries real compliance weight, so the agent does not act unsupervised. It prepares, submits, tracks and alerts, while your credentialing specialists review exceptions, make judgment calls on unusual histories, and own the relationship with difficult payers. Every action the agent takes is documented and auditable, which also makes payer audits and delegated-credentialing reviews far less painful.",
        ],
      },
      {
        h: "Why credentialing belongs in the revenue cycle",
        p: [
          "Credentialing sits at the very front of the revenue cycle, before scheduling, eligibility or claims. If it is slow or lapses, everything downstream inherits the problem: clean claims get denied, cash slips, and a provider's ramp-up is wasted. Automating credentialing is how a practice makes sure the rest of its revenue cycle work is not undermined at the source.",
          "This is the same model MedXFlow uses across the revenue cycle: AI agents handle the repetitive, high-volume work - from credentialing through eligibility, coding, claims and denials - and your team stays in control of the exceptions.",
        ],
      },
    ],
    faq: [
      {
        q: "How long does provider credentialing take?",
        a: "Credentialing a new provider with a payer commonly takes 90 to 120 days, most of which is spent waiting on and following up with payers. Automating application submission and status follow-up shortens the wait by removing the delays that come from incomplete profiles and un-chased applications.",
      },
      {
        q: "Can provider credentialing be automated?",
        a: "The repetitive parts can. AI agents prepare and submit applications, keep CAQH and PECOS profiles current, track each application to approval, and monitor re-credentialing and expirable dates. Compliance judgment and unusual cases stay with credentialing specialists, with every automated action documented and auditable.",
      },
      {
        q: "What is the difference between credentialing and payer enrollment?",
        a: "Credentialing verifies a provider's qualifications - licensure, education, board certification and history. Payer enrollment registers that verified provider with a specific payer so their claims can be paid. A provider can be credentialed but not yet enrolled with a given plan, which is a common reason claims are denied or paid out of network.",
      },
      {
        q: "What is CAQH and why does it matter for credentialing?",
        a: "CAQH is a widely used database where providers maintain a single credentialing profile that payers draw from. If the CAQH profile is incomplete or the periodic re-attestation is missed, payer applications stall. Keeping it current is one of the highest-leverage things a credentialing agent does.",
      },
      {
        q: "Does AI replace credentialing specialists?",
        a: "No. It removes the repetitive submission, follow-up and deadline-tracking work so specialists can focus on exceptions, judgment calls and payer relationships. The agent works continuously and never forgets a re-credentialing date; the specialist stays accountable for the outcome.",
      },
    ],
  },
  {
    slug: "reduce-claim-denials-small-practice",
    snippet: "To reduce claim denials in a small practice, measure your denial rate by reason code, verify eligibility and prior authorization before the visit, scrub coding for medical-necessity mismatches, and work denials fast while tracking root cause. Most denials come from a few fixable sources.",
    title: "How to Reduce Claim Denials in a Small Medical Practice",
    description:
      "A practical, step-by-step guide to lowering your claim denial rate - the top denial reasons, how to fix them at the source, and where automation helps.",
    date: "2025-07-15",
    category: "Denial Management",
    readMins: 7,
    keywords: ["reduce claim denials", "claim denial management", "denial rate", "medical billing denials"],
    related: { label: "See MedXFlow Denial Management", href: "/products/denial-management/" },
    intro:
      "Claim denials are one of the biggest silent drains on a practice's revenue. Industry benchmarks put the average denial rate between 5% and 10%, and roughly two-thirds of denied claims are never reworked. For a small practice, that lost revenue is often the difference between a good month and a bad one. The good news: most denials are preventable, and you don't need a big team to fix them.",
    sections: [
      {
        h: "1. Measure your denial rate first",
        p: [
          "You can't improve what you don't measure. Your denial rate is the number of claims denied divided by the number of claims submitted in a period. Pull this from your clearinghouse or practice management system monthly.",
          "Break it down by payer and by denial reason code (CARC/RARC). Most practices find that a handful of reasons - eligibility, missing prior authorization, and coding errors - account for the majority of denials. That concentration is good news: fixing three root causes moves the needle far more than chasing every claim.",
        ],
      },
      {
        h: "2. Fix eligibility at the front desk",
        p: [
          "The single most common denial reason is eligibility: the patient's coverage was inactive, the plan changed, or the service wasn't covered. These are caught before the visit, not after.",
          "Verify eligibility for every appointment - ideally at scheduling and again 24–48 hours before the visit, because coverage changes at month boundaries. Automating this check removes the manual portal work and catches problems while you can still act on them.",
        ],
      },
      {
        h: "3. Never skip prior authorization",
        p: [
          "Services that require prior authorization and don't have it are almost always denied - and these denials are hard to appeal after the fact. Build a payer-specific list of what needs auth, and confirm the authorization number is on the claim before it goes out.",
        ],
      },
      {
        h: "4. Clean up coding and documentation",
        p: [
          "Medical-necessity mismatches, missing modifiers, and documentation gaps drive a large share of denials. Front-load a scrubbing step that flags mismatched diagnosis/procedure codes before submission, and give coders a tight feedback loop so the same errors don't repeat.",
        ],
      },
      {
        h: "5. Work denials fast, and track root cause",
        p: [
          "When a denial does happen, speed matters - many payers have tight appeal windows. Triage denials daily, route them to the right person, and - critically - record the root cause so you can prevent the next one. A denial you fix once is a bug; a denial you keep getting is a broken process.",
          "This is exactly where automation earns its keep: AI agents can triage denials by reason, draft appeals, and surface the patterns that tell you which upstream step to fix.",
        ],
      },
    ],
    faq: [
      {
        q: "What is a good claim denial rate?",
        a: "Under 5% is generally considered healthy. Best-in-class practices run 2–4%. If you're above 10%, there's usually a concentrated, fixable root cause - most often eligibility or prior authorization.",
      },
      {
        q: "How much revenue do denials cost?",
        a: "Reworking a denied claim costs roughly $25–$118 in staff time, and around two-thirds of denials are never reworked at all - so the true cost is the lost reimbursement plus the labor on the ones you do chase.",
      },
    ],
  },

  {
    slug: "prior-authorization-automation-guide",
    snippet: "Prior authorization automation uses software to detect which services need auth, gather documentation, submit the request, track its status, and attach the approval to the claim. It removes the manual portal work while the payer still makes the decision, cutting turnaround time and auth-related denials.",
    title: "Prior Authorization Automation: A Practical Guide for Clinics",
    description:
      "What prior authorization automation actually does, where it fits in your workflow, and how to cut turnaround time and denials without adding staff.",
    date: "2025-08-15",
    category: "Prior Authorization",
    readMins: 6,
    keywords: ["prior authorization automation", "prior auth software", "automate prior authorization", "prior auth turnaround"],
    related: { label: "See MedXFlow Eligibility & Prior Auth", href: "/products/eligibility-verification/" },
    intro:
      "Prior authorization is one of the most manual, time-consuming tasks in the revenue cycle - and one of the most expensive to get wrong. Staff spend hours on payer portals and phone calls, patients wait for care, and a missed auth almost always becomes a denial. Automation doesn't remove the payer requirement, but it removes most of the manual work around it.",
    sections: [
      {
        h: "What 'prior authorization automation' really means",
        p: [
          "It's not a single button. In practice it's a set of steps that software can handle for you: determining whether a service needs authorization, gathering the required clinical documentation, submitting the request to the right payer, checking status until a decision comes back, and attaching the approval to the claim.",
          "Each of those steps is rules-based and repetitive - exactly the kind of work AI agents and automation do well, with staff stepping in only on exceptions.",
        ],
      },
      {
        h: "Step 1: Automated requirement lookup",
        p: [
          "The first win is simply knowing what needs auth. Payer rules change constantly. An automated requirement lookup checks the specific payer and plan against the CPT/HCPCS code so nothing slips through - the leading cause of 'we didn't know it needed auth' denials.",
        ],
      },
      {
        h: "Step 2: Submission and status tracking",
        p: [
          "Once a request is needed, the system assembles the documentation and submits it through the payer's channel, then polls for status automatically instead of a staffer logging in repeatedly. Turnaround drops from days of intermittent checking to a tracked, hands-off process.",
        ],
      },
      {
        h: "Step 3: Close the loop to the claim",
        p: [
          "The authorization number has to land on the claim. Automation carries the approval straight through so the claim goes out clean - closing the gap where manual handoffs lose auth numbers and create denials.",
        ],
      },
      {
        h: "What to expect",
        p: [
          "Practices that automate prior auth typically see faster turnaround, fewer auth-related denials, and hours of staff time returned each week. The goal isn't to replace your team - it's to take the portal grind off their plate so they handle the judgment calls, not the busywork.",
        ],
      },
    ],
    faq: [
      {
        q: "Can prior authorization be fully automated?",
        a: "The manual work around it can be largely automated - requirement lookup, submission, status checks, and attaching the approval to the claim. The payer still makes the decision, and complex clinical cases route to staff, but the repetitive portal work is handled for you.",
      },
      {
        q: "Does automation work with my EHR?",
        a: "Good automation works alongside the systems you already run rather than replacing them, writing authorizations back so your existing workflow stays intact.",
      },
    ],
  },

  {
    slug: "what-is-dnfb-clear-coding-backlog",
    snippet: "DNFB (discharged not final billed) is the value of completed encounters that have not been coded and billed yet. To clear the backlog, measure DNFB days, automate straightforward charts so coders focus on complex cases, and keep a daily coding cadence so it does not rebuild.",
    title: "What Is DNFB - and How to Clear a Coding Backlog",
    description:
      "DNFB explained in plain terms: what 'discharged not final billed' means, why the backlog grows, and how to clear it and keep it low with automation.",
    date: "2025-09-15",
    category: "Coding & Charge Capture",
    readMins: 6,
    keywords: ["what is DNFB", "DNFB backlog", "discharged not final billed", "coding backlog"],
    related: { label: "See MedXFlow Medical Coding", href: "/products/charge-capture-coding/" },
    intro:
      "DNFB - 'discharged not final billed' - is one of the clearest signals of trapped cash in a revenue cycle. When charts pile up waiting to be coded, the care has been delivered but the bill hasn't gone out, so revenue sits idle. A rising DNFB number almost always points to a coding bottleneck. Here's what it means and how to bring it down.",
    sections: [
      {
        h: "DNFB in plain terms",
        p: [
          "DNFB is the dollar value (or day count) of encounters that are complete and discharged but haven't been finalized and billed - usually because they're waiting to be coded. It's often expressed as 'days in DNFB': total DNFB dollars divided by average daily revenue.",
          "Every day a chart sits in DNFB is a day that revenue isn't in your bank account. For cash flow, DNFB days are as important as A/R days - and more controllable.",
        ],
      },
      {
        h: "Why the backlog grows",
        p: [
          "The usual culprits: coder shortages and turnover, volume spikes, complex documentation that needs clarification, and repetitive charts that eat coder time without needing their expertise. The backlog compounds - a few slow days turn into a week, then revenue targets slip.",
        ],
      },
      {
        h: "How to clear it",
        p: [
          "First, measure DNFB days weekly and set a target (many organizations aim for under 5 days). Then attack the repetitive volume: let automation handle straightforward charts and code assignment so your coders spend their time on the complex, high-value cases that actually need judgment.",
          "AI coding assistance can draft codes from documentation, flag medical-necessity mismatches before the claim goes out, and route only the exceptions to staff - which is what keeps the backlog from rebuilding after you clear it.",
        ],
      },
      {
        h: "Keep it low",
        p: [
          "Clearing the backlog once is easy; keeping it clear is the real win. Build a daily coding cadence, a feedback loop for recurring documentation gaps, and automation that absorbs volume spikes so a busy week doesn't become a billing backlog.",
        ],
      },
    ],
    faq: [
      {
        q: "What is a good DNFB days number?",
        a: "Many organizations target under 5 days in DNFB. The right number depends on your specialty and volume, but the trend matters most - a rising DNFB means cash is getting trapped.",
      },
      {
        q: "How does automation reduce DNFB?",
        a: "By coding straightforward charts automatically and routing only complex cases to staff, automation absorbs the repetitive volume that causes backlogs - so charts get finalized and billed faster.",
      },
    ],
  },
  {
    slug: "ai-agents-vs-rpa-healthcare-rcm",
    snippet: "RPA follows a fixed script and breaks when a payer portal changes; an AI agent works from the goal, adapts to what it sees, and escalates exceptions to staff. For the constantly changing payer workflows in RCM, AI agents survive change that breaks RPA.",
    title: "AI Agents vs. RPA in Healthcare RCM: What's the Difference?",
    description:
      "AI agents and RPA both automate revenue-cycle work, but they fail - and scale - very differently. Here's how they compare for healthcare RCM, in plain terms.",
    date: "2025-10-15",
    category: "AI & Automation",
    readMins: 6,
    keywords: ["AI agents vs RPA", "RPA healthcare RCM", "AI agents revenue cycle", "RCM automation"],
    related: { label: "See MedXFlow AI Agents for RCM", href: "/ai-agents-rcm/" },
    intro:
      "\"Automation\" in healthcare RCM usually means one of two things: traditional RPA (robotic process automation) or newer AI agents. They sound similar and often get lumped together, but they behave very differently when a payer portal changes or a claim doesn't fit the script. Understanding the difference helps you pick the right tool - and set the right expectations.",
    sections: [
      {
        h: "What RPA does",
        p: [
          "RPA follows a recorded script: click here, copy this field, paste it there. It's fast and reliable for stable, high-volume tasks that never change. But RPA is brittle - when a payer redesigns a portal or an unexpected screen appears, the script breaks and someone has to re-record it. RPA doesn't understand the task; it repeats keystrokes.",
        ],
      },
      {
        h: "What AI agents do",
        p: [
          "An AI agent works from the goal, not a fixed script. It reads the screen or document, decides the next step, extracts and validates data, and adapts when something is different. When it isn't sure, it escalates to a person instead of failing silently. That adaptability is what lets agents handle the messy variety of real payer workflows.",
        ],
      },
      {
        h: "Where each fits in the revenue cycle",
        p: [
          "RPA suits narrow, unchanging steps. AI agents suit end-to-end workflows that span systems and vary by payer - eligibility, prior authorization, claims follow-up and denials. MedXFlow uses AI agents so automation survives the constant change in payer rules and portals, with humans handling the exceptions.",
        ],
      },
      {
        h: "The practical test",
        p: [
          "Ask a simple question of any \"automation\": what happens when the payer changes something? If the answer is \"it breaks until we rebuild the script,\" that's RPA. If it's \"it adapts and flags anything unusual to staff,\" that's an AI agent. For a revenue cycle that changes weekly, the second behavior is what keeps cash moving.",
        ],
      },
    ],
    faq: [
      { q: "Is RPA still useful in RCM?", a: "Yes, for narrow, stable, high-volume steps that rarely change. The limitation is brittleness - RPA breaks when portals or rules change, which happens constantly in healthcare." },
      { q: "Do AI agents remove the need for staff?", a: "No. They handle repetitive volume and escalate exceptions to staff, who focus on judgment calls. Every action stays tracked and auditable." },
    ],
  },

  {
    slug: "how-ai-automates-eligibility-verification",
    snippet: "AI automates eligibility verification by taking patient and insurance details, looking up the payer, requesting eligibility, reading back active coverage, co-pays and deductibles, validating it against the visit, and writing the result into your system, flagging only ambiguous cases for staff.",
    title: "How AI Automates Insurance Eligibility Verification",
    description:
      "A step-by-step look at how AI automates insurance eligibility verification - from patient data to a verified benefits result written back to your system.",
    date: "2025-11-15",
    category: "Eligibility",
    readMins: 6,
    keywords: ["AI eligibility verification", "automated eligibility verification", "AI insurance verification", "eligibility automation"],
    related: { label: "See MedXFlow Eligibility Verification", href: "/products/eligibility-verification/" },
    intro:
      "Eligibility is the first place claims go wrong - and the cheapest place to fix them. Verifying coverage before the visit stops denials that would otherwise surface weeks later. AI automates that check so it happens for every appointment, not just the ones staff have time for.",
    sections: [
      {
        h: "The workflow, step by step",
        p: [
          "Automated eligibility verification runs the same path a staffer would, without the manual portal work: take the patient and insurance details, look up the payer, request eligibility, read back active coverage, co-pays, deductibles and plan limits, validate it against the visit, document the result, and write it into your system. Anything ambiguous is flagged for a person.",
        ],
      },
      {
        h: "Why timing matters",
        p: [
          "Coverage changes - especially at month boundaries. Checking once at scheduling and again shortly before the visit catches plan changes while you can still act on them, rather than discovering them on a denied claim. Automation makes that double-check practical because it costs no extra staff time.",
        ],
      },
      {
        h: "What it prevents",
        p: [
          "Eligibility is consistently one of the top denial reasons. Verifying every patient up front removes that whole category of denials at the source, so fewer claims bounce and less staff time goes to rework and appeals.",
        ],
      },
    ],
    faq: [
      { q: "Can eligibility really be checked for every patient?", a: "Yes - that's the point of automating it. Because the check runs without manual portal work, it can cover every appointment instead of a sample, including a re-check close to the visit." },
      { q: "Does it work with our practice management system?", a: "Verified coverage is written back into the systems you already run, so front-desk and billing staff see results in their normal workflow." },
    ],
  },

  {
    slug: "ai-ar-follow-up-healthcare",
    snippet: "AI-powered AR follow-up automates payer follow-up, denial triage and patient balance outreach: it checks claim status instead of staff logging into portals, drafts appeals, and runs balance reminders, so claims get worked inside payer windows and AR days fall.",
    title: "AI-Powered AR Follow-Up in Healthcare",
    description:
      "How AI keeps accounts receivable moving - automating payer follow-up, denial triage and patient balance outreach so cash doesn't stall in aging AR.",
    date: "2025-12-15",
    category: "Accounts Receivable",
    readMins: 6,
    keywords: ["AI AR follow-up", "accounts receivable automation healthcare", "AI payer follow-up", "reduce AR days"],
    related: { label: "See MedXFlow Denial Management", href: "/products/denial-management/" },
    intro:
      "Accounts receivable is where revenue goes to wait. Claims that aren't followed up on age, and aging claims get paid slower - or not at all. AR follow-up is high-volume, repetitive, and easy to fall behind on, which makes it a natural fit for automation.",
    sections: [
      {
        h: "Why AR days climb",
        p: [
          "Follow-up is manual and endless: checking claim status on payer portals, re-working denials, chasing patient balances. When staff fall behind, claims cross timely-filing and appeal windows, and AR days rise. The problem isn't effort - it's that there's more repetitive follow-up than any team can keep up with.",
        ],
      },
      {
        h: "What AI automates",
        p: [
          "AI agents check claim status automatically instead of staff logging into portals, triage denials by reason and draft appeals, and run patient balance follow-up with clear statements and reminders. Staff step in on the exceptions - the complex payer disputes that actually need a person.",
        ],
      },
      {
        h: "The result: lower AR days",
        p: [
          "When follow-up never stalls, claims get worked inside payer windows and cash arrives faster. Combined with fewer denials up front, automated follow-up is one of the most direct levers on AR days and cash flow.",
        ],
      },
    ],
    faq: [
      { q: "What is a good AR days number?", a: "It varies by specialty, but lower and trending-down is the goal. The biggest driver of high AR days is follow-up that falls behind - which is exactly what automation prevents." },
      { q: "Does AI handle patient balances too?", a: "Yes - automated patient statements and gentle follow-up cover the patient side of AR, alongside payer follow-up and denial work." },
    ],
  },

  {
    slug: "how-ai-automates-claims-management",
    snippet: "AI automates claims management by scrubbing claims against payer rules before submission, submitting compliant claims, tracking status automatically, and routing denials for correction and appeal, which raises first-pass acceptance and speeds up payment.",
    title: "How AI Automates Healthcare Claims Management",
    description:
      "From clean claim creation to submission and status follow-up - how AI automates healthcare claims management to reduce rejections and speed up payment.",
    date: "2026-01-15",
    category: "Claims",
    readMins: 6,
    keywords: ["AI claims management", "healthcare claims automation", "claims processing automation", "clean claims"],
    related: { label: "See MedXFlow Claims Submission", href: "/products/claims-submission/" },
    intro:
      "A clean claim gets paid the first time; a dirty one comes back as a denial or rejection and has to be reworked. Claims management is really about getting more claims right before they leave - and following up on the rest so nothing stalls. AI automates both sides.",
    sections: [
      {
        h: "Clean claims before submission",
        p: [
          "Automation scrubs claims against payer rules and flags problems - missing modifiers, medical-necessity mismatches, incomplete data - before the claim is submitted. Catching errors here, rather than after a denial, is the single biggest lever on first-pass acceptance.",
        ],
      },
      {
        h: "Submission and tracking",
        p: [
          "AI generates and submits compliant claims to every payer and clearinghouse, then tracks status automatically instead of staff checking portals. When a payer needs something, it surfaces the exception rather than letting the claim sit.",
        ],
      },
      {
        h: "Closing the loop with denials",
        p: [
          "Claims that do come back are triaged by reason and routed for correction and appeal, with the root-cause pattern fed back upstream. Over time that loop raises first-pass acceptance and shrinks the rework pile.",
        ],
      },
    ],
    faq: [
      { q: "What is first-pass acceptance?", a: "The share of claims a payer accepts on the first submission, without a rejection or denial. Higher first-pass acceptance means faster payment and less rework - which claim scrubbing before submission directly improves." },
      { q: "Does AI submit to all payers?", a: "MedXFlow generates and submits compliant claims to every major payer and clearinghouse, and follows up on status automatically." },
    ],
  },
  {
    slug: "ai-denial-management-classification-to-appeal",
    snippet: "AI works a denial end to end: it classifies the denial by reason and priority, identifies the root cause, corrects or appeals it within the payer window, and feeds the pattern back upstream so the same denial stops recurring.",
    title: "AI Denial Management: From Classification to Appeal",
    description:
      "How AI works a denial end to end - classifying it, finding the root cause, correcting and appealing, and feeding the pattern back upstream to prevent the next one.",
    date: "2026-02-15",
    category: "Denial Management",
    readMins: 6,
    keywords: ["AI denial management", "denial classification", "automated denial appeals", "healthcare denial workflow"],
    related: { label: "See MedXFlow Denial Management", href: "/products/denial-management/" },
    intro:
      "A denial isn't the end of a claim - it's a workflow. The practices that recover the most revenue treat every denial as two jobs: work this one, and prevent the next one. AI makes both practical at volume, where manual teams usually only manage the first.",
    sections: [
      {
        h: "Step 1 - Classify and prioritize",
        p: [
          "Denials arrive with reason codes (CARC/RARC), but the codes alone don't tell you what to do. AI classifies each denial by type and prioritizes by recoverable value and appeal deadline, so the work queue reflects what actually matters instead of arrival order.",
        ],
      },
      {
        h: "Step 2 - Find the root cause",
        p: [
          "The reason code says what the payer flagged; the root cause is why it happened - a missing modifier, an eligibility miss, a documentation gap. Identifying root cause is what turns a one-off fix into a prevention. AI surfaces the pattern across many denials, not just the single claim.",
        ],
      },
      {
        h: "Step 3 - Correct and appeal",
        p: [
          "For correctable denials, the fix is applied and the claim resubmitted; for the rest, AI drafts the appeal with the right documentation and submits it inside the payer's window. Speed matters here - many appeals are lost simply to missed deadlines.",
        ],
      },
      {
        h: "Step 4 - Feed it back upstream",
        p: [
          "The most valuable output of denial management isn't the recovered claim - it's the signal telling you which upstream step to fix. When root-cause patterns flow back to eligibility, coding or authorization, the same denial stops recurring and your first-pass rate climbs.",
        ],
      },
    ],
    faq: [
      { q: "Why treat denials as a workflow, not one-off fixes?", a: "Because the same root causes recur. Working a denial recovers one claim; fixing its root cause prevents dozens. AI makes the prevention loop practical by surfacing patterns across all denials." },
      { q: "Can AI write appeals?", a: "AI drafts appeals with the appropriate documentation and submits them within payer deadlines, escalating complex disputes to staff." },
    ],
  },

  {
    slug: "healthcare-revenue-cycle-management-with-ai",
    snippet: "AI in the revenue cycle automates the repetitive, rules-based work across eligibility, prior authorization, coding, claims, payment posting, denials and collections, while staff handle exceptions. The main change is capacity: the same team handles more volume with more consistent quality.",
    title: "Healthcare Revenue Cycle Management with AI: A Practical Overview",
    description:
      "A practical overview of using AI across healthcare revenue cycle management - which stages it automates, where humans stay in the loop, and what changes for your team.",
    date: "2026-03-15",
    category: "Healthcare RCM",
    readMins: 7,
    keywords: ["healthcare revenue cycle management with AI", "AI in RCM", "AI revenue cycle management", "RCM AI"],
    related: { label: "See MedXFlow AI Agents for RCM", href: "/ai-agents-rcm/" },
    intro:
      "AI in the revenue cycle isn't one feature - it's automation applied across a chain of tasks that were previously manual. This overview walks through where AI fits, stage by stage, and what actually changes for the people doing the work.",
    sections: [
      {
        h: "The revenue cycle, briefly",
        p: [
          "The revenue cycle runs from the first appointment to the final payment: patient access and scheduling, eligibility and prior authorization, charge capture and coding, claims submission, payment posting, denial management, and patient collections. Each stage hands off to the next, and each handoff is a place work can stall.",
        ],
      },
      {
        h: "Where AI automates",
        list: [
          "Eligibility and benefits verification before the visit.",
          "Prior authorization detection, submission and tracking.",
          "Charge capture and coding with medical-necessity checks.",
          "Claim scrubbing, submission and status follow-up.",
          "Payment posting and reconciliation.",
          "Denial classification, appeals and root-cause analysis.",
          "Patient statements and balance follow-up.",
        ],
      },
      {
        h: "Where humans stay in the loop",
        p: [
          "AI handles the repetitive volume and escalates anything uncertain - complex payer disputes, unusual cases, judgment calls. Nothing runs unattended, and every action is documented, assigned and auditable. The shift for staff is away from portal busywork and toward the exceptions that need their expertise.",
        ],
      },
      {
        h: "What changes for your team",
        p: [
          "The headline change is capacity: the same team handles more volume because the repetitive work is automated. The secondary change is consistency - rules get applied the same way every time, so quality doesn't swing with staffing. The goal isn't fewer people; it's people focused on higher-value work.",
        ],
      },
    ],
    faq: [
      { q: "Is AI in RCM proven, or experimental?", a: "The tasks AI automates in RCM - eligibility, authorization, coding, claims follow-up, denials - are well-defined, rules-based workflows. That's what makes them a good fit for automation, with humans handling exceptions." },
      { q: "Do we have to replace our systems?", a: "No. AI works alongside the practice management and EHR systems you already run, writing data back so your existing workflow stays intact." },
    ],
  },
  {
    slug: "medical-coding-automation-how-ai-assists-coders",
    snippet: "Medical coding automation uses AI to draft CPT and ICD codes from documentation, flag medical-necessity mismatches before the claim goes out, and clear routine charts, so certified coders focus on complex cases. Coders still review and own the final coding.",
    title: "Medical Coding Automation: How AI Assists Coders",
    description:
      "How AI assists medical coders - drafting codes from documentation, flagging medical-necessity mismatches, and clearing routine charts so coders focus on complex cases.",
    date: "2026-04-15",
    category: "Coding & Charge Capture",
    readMins: 6,
    keywords: ["medical coding automation", "AI medical coding", "computer-assisted coding", "coding automation"],
    related: { label: "See MedXFlow Charge Capture & Coding", href: "/products/charge-capture-coding/" },
    intro:
      "Coding is where clinical work becomes a billable claim - and where a surprising amount of revenue leaks. Automation doesn't replace certified coders; it removes the repetitive volume and catches errors early, so coders spend their expertise where it counts.",
    sections: [
      {
        h: "Drafting codes from documentation",
        p: [
          "AI reads clinical documentation and drafts the likely CPT/ICD codes, giving coders a starting point instead of a blank chart. For routine, well-documented encounters this clears the queue quickly; for anything ambiguous, the coder reviews and decides.",
        ],
      },
      {
        h: "Catching medical-necessity mismatches",
        p: [
          "A large share of denials come from diagnosis/procedure mismatches that a scrub should have caught. AI flags medical-necessity mismatches before the claim goes out - turning a future denial into a quick pre-submission fix.",
        ],
      },
      {
        h: "Clearing the backlog",
        p: [
          "When routine charts are handled automatically, coders aren't buried in volume, and DNFB (discharged-not-final-billed) days fall. The expensive, high-judgment cases get the attention they need instead of waiting behind a pile of straightforward ones.",
        ],
      },
    ],
    faq: [
      { q: "Does automation replace certified coders?", a: "No. It drafts codes and flags issues, but coders review and own the final coding - especially for complex cases. Automation removes repetitive volume, not judgment." },
      { q: "How does coding automation reduce denials?", a: "By flagging medical-necessity mismatches and incomplete coding before submission, so those errors are fixed rather than denied and reworked." },
    ],
  },

  {
    slug: "automate-patient-billing-and-collections",
    snippet: "Automating patient billing and collections means clear automated statements, easy digital payment, and gentle automated follow-up. It collects more of the growing patient balance without adding staff, and escalates only the accounts that need a personal conversation.",
    title: "How to Automate Patient Billing and Collections",
    description:
      "How AI automates patient billing and collections - clear statements, digital payment options and gentle automated follow-up that collects more without straining staff.",
    date: "2026-05-15",
    category: "Patient Collections",
    readMins: 5,
    keywords: ["patient billing automation", "automated patient collections", "patient statements", "healthcare patient payments"],
    related: { label: "See MedXFlow Patient Statements & Collections", href: "/products/patient-collections/" },
    intro:
      "As patients cover more of the bill, patient collections have become a bigger slice of practice revenue - and one of the hardest to chase. Automation makes patient billing consistent and less awkward, so you collect more without adding collections staff.",
    sections: [
      {
        h: "Clear statements patients understand",
        p: [
          "Confusing bills don't get paid. Automated statements present balances clearly and consistently, which removes a major reason patients delay payment or call the office for an explanation.",
        ],
      },
      {
        h: "Easy digital payment",
        p: [
          "The fewer steps to pay, the more people pay. Digital payment options let patients settle a balance in a tap, rather than mailing a check or calling in card details - which lifts collection rates and cuts inbound calls.",
        ],
      },
      {
        h: "Gentle, automated follow-up",
        p: [
          "Most unpaid balances just need a reminder. Automated, respectful follow-up keeps balances moving without staff manually working a call list - and escalates only the accounts that genuinely need a human touch.",
        ],
      },
    ],
    faq: [
      { q: "Does automating collections feel impersonal to patients?", a: "Done well, it's the opposite - clearer statements and easy payment reduce friction and confused calls. Follow-up stays gentle, and staff step in on the accounts that need a personal conversation." },
      { q: "Does it handle payment reconciliation?", a: "Patient payments post and reconcile alongside payer remittances, so balances stay accurate across the revenue cycle." },
    ],
  },
  {
    slug: "ai-agents-revenue-cycle-management-buyers-guide",
    snippet: "When buying AI agents for RCM, evaluate which workflows an agent completes end to end (not just assists with), how it handles exceptions, whether it writes back into your EHR, its auditability and security, and time to go live. Automate eligibility, prior auth, claims and denials first.",
    title: "AI Agents for Revenue Cycle Management: A Buyer's Guide",
    description:
      "A practical buyer's guide to AI agents for revenue cycle management - what they automate, how to evaluate vendors, the questions to ask, and how to decide build vs. buy.",
    date: "2026-06-15",
    category: "Buyer's Guide",
    readMins: 9,
    keywords: ["AI agents for revenue cycle management", "AI RCM vendor", "choose AI RCM software", "AI revenue cycle buyer's guide"],
    related: { label: "See MedXFlow AI Agents for RCM", href: "/ai-agents-rcm/" },
    intro:
      "\"AI agents for revenue cycle management\" is a crowded, fast-moving category, and the marketing sounds identical from vendor to vendor. This guide cuts through it: what these systems actually do, which workflows to automate first, how to evaluate a vendor honestly, and the specific questions that separate real capability from a demo. It's written to help you choose well - including whether MedXFlow is the right fit or not.",
    sections: [
      {
        h: "What 'AI agents for RCM' actually means",
        p: [
          "An AI agent is software that completes a revenue-cycle task end to end - navigating payer portals and your systems, extracting and validating data, applying your rules, and escalating exceptions to staff. That's different from a dashboard (which shows you work) or RPA (which repeats a fixed script). The useful question isn't \"do you use AI?\" - every vendor says yes - but \"which specific tasks does an agent complete without a human, and what happens when it's unsure?\"",
        ],
      },
      {
        h: "Which workflows to automate first",
        p: [
          "You don't buy all of RCM at once. The highest-ROI starting points are the repetitive, high-volume, rules-based steps where errors are expensive: eligibility and benefits verification, prior authorization, claim scrubbing and follow-up, and denial triage. Automating these first removes the biggest denial drivers and frees the most staff time. Coding, payment posting and patient collections follow.",
        ],
      },
      {
        h: "How to evaluate a vendor (the criteria that matter)",
        list: [
          "Scope: which exact workflows an agent completes end to end - not just \"assists with.\"",
          "Exception handling: what the agent does when it's unsure, and how those escalations reach your team.",
          "Integrations: does it write back into your actual PMS/EHR (Epic, athenahealth, eClinicalWorks…), or just read?",
          "Auditability: is every automated action logged, assigned and reversible?",
          "Security: HIPAA handling, a signed BAA, encryption, US data residency, access controls.",
          "Time-to-live: how long from contract to working on real claims.",
          "Human fallback: is there a managed-services option if you'd rather hand more over?",
        ],
      },
      {
        h: "Questions to ask any vendor",
        list: [
          "\"Show me an agent completing an eligibility check and a denial from start to finish on a real case.\"",
          "\"What percentage of this workflow runs without a human, and how is the rest escalated?\"",
          "\"Which of my systems do you write back into, and how?\"",
          "\"What happens when a payer changes their portal?\"",
          "\"Will you sign a BAA, and where is PHI stored?\"",
          "\"What does month one look like - supervised pilot or straight to production?\"",
        ],
      },
      {
        h: "Build vs. buy vs. outsource",
        p: [
          "Building AI agents in-house is rarely worth it for a practice or billing company - payer workflows change constantly, and maintaining that is a full-time engineering job. Buying an agent platform makes sense when you want to keep your team and give them leverage. Outsourcing to a human-led managed team makes sense when you'd rather hand the whole cycle over. The strongest option is often hybrid: agents handle the volume, and a managed team is there for overflow and complex work.",
        ],
      },
      {
        h: "Where MedXFlow fits",
        p: [
          "MedXFlow is an agent platform: AI agents run eligibility, prior authorization, coding, claims, denials, payment posting and patient collections, writing back into the systems you already use, with humans handling exceptions - and a human-led Managed Billing team available if you'd rather outsource entirely. Whether or not it's your pick, use the criteria above on every vendor you shortlist.",
        ],
      },
    ],
    faq: [
      { q: "How much does AI RCM automation cost?", a: "Pricing varies by vendor and scope (per-workflow, per-claim, or managed-services models). More useful than the sticker price is the net effect: fewer denials, lower AR days, and staff time returned. Ask each vendor to model that against your volume." },
      { q: "How is this different from our current RCM software?", a: "Most RCM software helps people do the work faster; AI agents complete specific tasks without a person and escalate exceptions. The line to test is how much runs with no human involved." },
      { q: "Do we have to replace our systems?", a: "You shouldn't have to. Good AI RCM works alongside your existing PMS/EHR, writing data back rather than requiring a rip-and-replace." },
    ],
  },

  {
    slug: "ai-agents-vs-traditional-rcm-software",
    snippet: "Traditional RCM software organizes the work and surfaces worklists, but a person does each step. AI agents do the step: they run the task, read the result, and escalate exceptions. The test in a demo is whether a task runs with no human clicking through it.",
    title: "AI Agents vs. Traditional RCM Software: What's Different?",
    description:
      "Traditional RCM software helps your team work faster; AI agents complete the work. Here's how they differ, where each fits, and how to tell them apart in a demo.",
    date: "2026-07-15",
    category: "AI & Automation",
    readMins: 6,
    keywords: ["AI agents vs RCM software", "traditional RCM software", "AI revenue cycle software", "RCM automation software"],
    related: { label: "See MedXFlow AI Agents for RCM", href: "/ai-agents-rcm/" },
    intro:
      "Traditional RCM software and AI agents get marketed with the same words, but they do fundamentally different jobs. Understanding the difference tells you what you're actually buying - and what to look for in a demo.",
    sections: [
      {
        h: "What traditional RCM software does",
        p: [
          "Classic RCM software organizes the work: it stores claims, surfaces worklists, flags issues, and reports on KPIs. It makes your team faster and more informed - but a person still does each step. The software is the workspace; the humans are the workers.",
        ],
      },
      {
        h: "What AI agents add",
        p: [
          "AI agents do the step, not just surface it. Instead of putting an eligibility check on a worklist, an agent runs the check, reads the result, validates it, and writes it back - escalating only what's ambiguous. The shift is from \"software that helps people work\" to \"software that does the work, supervised by people.\"",
        ],
      },
      {
        h: "Side by side",
        list: [
          "Worklists: traditional software surfaces them; agents work them down.",
          "Payer portals: staff log in with traditional software; agents navigate them directly.",
          "Denials: traditional software categorizes; agents triage, draft appeals and flag root cause.",
          "Scaling volume: traditional software needs more staff; agents absorb volume and escalate exceptions.",
        ],
      },
      {
        h: "Where each fits",
        p: [
          "They're not mutually exclusive - most practices need a system of record and a way to see the work. AI agents sit on top of that, taking the repetitive volume off the team. The best setups combine both: clear visibility plus agents doing the grind. MedXFlow provides the agents and writes back into the systems you already run.",
        ],
      },
    ],
    faq: [
      { q: "Do AI agents replace our RCM software?", a: "Not necessarily - you still need a system of record and visibility. Agents work on top of that, doing the repetitive tasks your team otherwise does by hand." },
      { q: "How do I tell them apart in a demo?", a: "Ask the vendor to show a task running with no human clicking through it. If a person is doing every step and the software is just displaying it, that's traditional software, not an agent." },
    ],
  },

  {
    slug: "in-house-vs-outsourced-vs-ai-rcm",
    snippet: "In-house RCM gives control but carries staffing cost; outsourcing removes the staffing burden but trades visibility; AI agents keep work in-house while automating the repetitive volume. Many practices blend them: agents handle volume, staff handle judgment, a managed team covers overflow.",
    title: "In-House vs. Outsourced vs. AI-Agent RCM: How to Decide",
    description:
      "Three ways to run your revenue cycle - an in-house team, an outsourced billing company, or AI agents. Here's the trade-off in cost, control and scale, and how to choose.",
    date: "2026-08-15",
    category: "Healthcare RCM",
    readMins: 7,
    keywords: ["in-house vs outsourced billing", "outsourced medical billing", "AI RCM vs outsourcing", "revenue cycle staffing"],
    related: { label: "See MedXFlow Managed Billing", href: "/products/managed-billing/" },
    intro:
      "Every practice runs its revenue cycle one of three ways: an in-house team, an outsourced billing company, or automation - and increasingly, a mix. Each trades cost, control and scalability differently. Here's how to think about which fits you.",
    sections: [
      {
        h: "In-house team",
        p: [
          "Maximum control and institutional knowledge, but you carry the cost, hiring, training and turnover. Small teams fall behind during volume spikes, and losing an experienced biller can set you back for months. Works well when volume is steady and you value tight control.",
        ],
      },
      {
        h: "Outsourced billing company",
        p: [
          "Someone else runs the cycle for a percentage of collections. It removes the staffing headache and adds specialist expertise, but you trade some visibility and control, and quality varies by vendor. Works well when you'd rather not run billing at all.",
        ],
      },
      {
        h: "AI agents",
        p: [
          "Automation keeps the work in-house but takes the repetitive volume off your team - eligibility, authorization, claims follow-up, denials - with staff handling exceptions. You keep control and visibility while scaling capacity without hiring. Works well when you want leverage for the team you already have.",
        ],
      },
      {
        h: "The hybrid most practices land on",
        p: [
          "In practice the strongest setup blends them: AI agents handle the high-volume, repetitive work; your team owns the judgment calls; and a managed billing team is available for overflow or the parts you'd rather hand off. MedXFlow supports this directly - agents plus an optional human-led Managed Billing team - so you can shift the balance as you grow.",
        ],
      },
    ],
    faq: [
      { q: "Is outsourcing cheaper than AI automation?", a: "It depends on volume and model. Outsourcing is usually a percentage of collections; automation is typically a platform cost. The better comparison is net revenue and control, not just the fee - model both against your numbers." },
      { q: "Can we combine AI agents with a billing team?", a: "Yes, and many practices do. Agents handle repetitive volume while a managed team covers overflow and complex work - you decide where the line sits." },
    ],
  },
  {
    slug: "what-is-an-837-claim-file",
    title: "What Is an 837 Claim File? EDI 837P vs 837I Explained",
    description: "The 837 is the standard EDI file used to submit healthcare claims. Here is what it contains, how 837P, 837I and 837D differ, and how it travels to payers.",
    date: "2026-08-16", category: "Technical / EDI", readMins: 6,
    keywords: ["837 claim file", "EDI 837", "837P vs 837I", "healthcare claim format", "X12 837"],
    related: { label: "See MedXFlow Claims Submission", href: "/products/claims-submission/" },
    snippet: "An 837 is the standard EDI (X12) electronic file format used to submit healthcare claims to payers. The 837P is for professional (physician) claims, the 837I for institutional (hospital) claims, and the 837D for dental. It carries patient, provider, diagnosis, procedure and charge data.",
    intro: "Behind every electronic claim is an 837 file. It is the format that carries a claim from your billing system, through a clearinghouse, to the payer. Understanding what is in it (and which variant you are sending) makes claim rejections much easier to diagnose.",
    sections: [
      { h: "What is an 837 file?", p: ["The 837 is an X12 EDI transaction set for submitting healthcare claims electronically. It is the digital replacement for paper claim forms, structured into segments and loops that carry every data element a payer needs to adjudicate the claim."] },
      { h: "837P vs 837I vs 837D", p: ["There are three variants: the 837P (professional) for physician and outpatient services, historically tied to the CMS-1500 form; the 837I (institutional) for hospital and facility claims, tied to the UB-04; and the 837D for dental. Using the wrong variant for the service is a common rejection cause."] },
      { h: "What an 837 contains", p: ["An 837 includes the billing and rendering provider (with NPIs), the subscriber and patient, the payer, diagnosis codes (ICD-10), service lines with procedure codes (CPT/HCPCS) and modifiers, charges, units, dates of service, and any prior authorization or referral numbers. Missing or invalid values here cause CO-16 and MA130 rejections."] },
      { h: "How it travels: clearinghouse and acknowledgments", p: ["The 837 goes to a clearinghouse, which runs edits and forwards it to the payer. You get back acknowledgments: a 999 confirms the file was syntactically accepted, and a 277CA reports whether each claim was accepted or rejected before adjudication. A rejection at this stage is different from a payer denial and is fixed by correcting and resubmitting."] },
    ],
    faq: [
      { q: "What is the difference between 837P and 837I?", a: "837P is the professional claim (physician/outpatient services, based on the CMS-1500). 837I is the institutional claim (hospital/facility services, based on the UB-04). Dental uses 837D." },
      { q: "What is the 277CA?", a: "The 277CA is a claim acknowledgment from the payer or clearinghouse that reports whether each claim in your 837 was accepted or rejected before adjudication. Rejections here are corrected and resubmitted, not appealed." },
    ],
  },

  {
    slug: "270-271-eligibility-transaction-explained",
    title: "The 270/271 Eligibility Transaction Explained",
    description: "The 270/271 is how electronic eligibility verification works. Here is what the 270 inquiry and 271 response contain and how real-time eligibility checks run.",
    date: "2026-08-16", category: "Technical / EDI", readMins: 5,
    keywords: ["270 271 transaction", "eligibility EDI", "real-time eligibility", "270 eligibility inquiry", "271 response"],
    related: { label: "See MedXFlow Eligibility Verification", href: "/products/eligibility-verification/" },
    snippet: "The 270 is an EDI eligibility and benefit inquiry sent to a payer; the 271 is the payer's response confirming coverage, plan details, co-pays, deductibles and benefits. Together they are how eligibility verification happens electronically, often in real time.",
    intro: "When software verifies a patient's insurance in seconds, it is usually running a 270/271 transaction. It is the EDI standard behind real-time eligibility, and knowing what it returns explains why some benefit details are precise and others are not.",
    sections: [
      { h: "The 270 inquiry", p: ["The 270 is a request sent to a payer asking whether a patient is covered and what their benefits are. It identifies the provider, the payer, the subscriber/patient, and the specific benefits or service types being asked about."] },
      { h: "The 271 response", p: ["The 271 comes back with the answer: active or inactive coverage, plan and group details, co-pay, deductible and coinsurance amounts, and coverage for the requested service types. The level of detail depends on what the payer supports in their 271."] },
      { h: "Real-time vs batch", p: ["270/271 can run in real time (a single patient, answer in seconds) or in batch (many patients at once, response returned later). Real-time is what powers point-of-service eligibility checks at scheduling and check-in."] },
      { h: "Why automation matters here", p: ["Because 270/271 is a standard electronic exchange, it can be automated end to end: software sends the 270, reads the 271, validates coverage against the visit, and writes the result back, so every appointment gets checked instead of a sample."] },
    ],
    faq: [
      { q: "Is 270/271 real time?", a: "It can be. Real-time 270/271 returns a single patient's eligibility in seconds, which is what enables eligibility checks at scheduling and check-in. Batch mode handles many patients with a delayed response." },
      { q: "What does the 271 tell you?", a: "Active or inactive coverage, plan and group information, co-pay, deductible and coinsurance amounts, and benefits for the requested service types, to the level of detail the payer supports." },
    ],
  },

  {
    slug: "835-era-explained",
    title: "835 ERA Explained: How Electronic Remittance Advice Works",
    description: "The 835 (ERA) is how payers tell you electronically how a claim was paid. Here is what it contains, how it differs from an EOB, and how auto-posting works.",
    date: "2026-08-17", category: "Technical / EDI", readMins: 5,
    keywords: ["835 ERA", "electronic remittance advice", "835 file", "ERA vs EOB", "auto posting"],
    related: { label: "See MedXFlow Payment Posting", href: "/products/payment-posting/" },
    snippet: "The 835 is the EDI electronic remittance advice (ERA) a payer sends to explain how a claim was adjudicated: payments, adjustments, and denial codes (CARC/RARC). It lets payments post automatically with line-level reconciliation, far faster than manual EOB entry.",
    intro: "The 835 is the payment side of EDI. Where the 837 sends a claim out, the 835 comes back telling you exactly how each claim and line was paid, adjusted, or denied, and it is what makes automated payment posting possible.",
    sections: [
      { h: "What is an 835?", p: ["The 835 is the X12 electronic remittance advice. It carries the payer's adjudication decision for each claim: the paid amount, contractual adjustments, patient responsibility, and any adjustment reason codes (CARC) and remark codes (RARC)."] },
      { h: "835 vs EOB", p: ["The 835 is the machine-readable version; the EOB (explanation of benefits) is the human-readable version of the same information. Posting from an 835 can be automated line by line, while posting from paper EOBs is manual and slower."] },
      { h: "How auto-posting works", p: ["Posting software reads the 835, matches each payment to the right claim and service line, posts the paid amount and contractual adjustment, and routes denials (by their CARC/RARC) into the denial workflow. This reconciliation is where underpayments and denials surface."] },
      { h: "Why the codes matter", p: ["The CARC and RARC codes on the 835 drive everything downstream: they tell you why a line was adjusted or denied, which is the starting point for denial management and for spotting underpayments against the fee schedule."] },
    ],
    faq: [
      { q: "What is the difference between an 835 and an EOB?", a: "They contain the same adjudication information. The 835 is the electronic, machine-readable remittance used for automated posting; the EOB is the human-readable version." },
      { q: "How does the 835 help denials?", a: "It carries the CARC and RARC codes that explain each adjustment or denial, which is the starting point for triaging and working denials and for detecting underpayments." },
    ],
  },

  {
    slug: "eob-to-era-conversion",
    title: "EOB to ERA Conversion: Turning Paper Remittances into Auto-Postable 835 Files",
    description:
      "How paper and PDF EOBs are converted into an X12 835 ERA so payments post automatically - the conversion pipeline, how adjustments and CARC/RARC codes are mapped, the edge cases that break it, and how it is validated.",
    date: "2026-08-19", category: "Technical / EDI", readMins: 8,
    keywords: ["EOB to ERA conversion", "EOB to 835", "paper EOB conversion", "electronic remittance advice", "ERA conversion", "auto posting"],
    related: { label: "See MedXFlow Payment Posting", href: "/products/payment-posting/" },
    snippet: "EOB to ERA conversion turns a paper or PDF explanation of benefits into an X12 835 electronic remittance advice so payments can post automatically. The workflow captures the EOB, extracts each claim, service line, payment, adjustment and CARC/RARC code, maps them into the 835 structure, validates that the file balances, and hands it to the posting engine.",
    intro:
      "Electronic remittance is widespread, but paper is not gone. A meaningful share of remittance dollars still arrives as paper EOBs or PDFs, from smaller commercial payers, secondary and tertiary payers, workers' compensation, auto and liability carriers, and correspondence. Those cannot auto-post, so someone keys them by hand. EOB to ERA conversion closes that gap by turning the paper remittance into a valid 835 that posts like any other ERA. Here is how that conversion actually works, segment for segment.",
    sections: [
      {
        h: "Why paper EOBs still exist",
        p: [
          "Most large commercial and government payers send electronic remittance (the 835), but not all do, and not for every situation. Secondary payers after coordination of benefits, workers' compensation and auto/liability carriers, small self-administered plans, and one-off correspondence and refund requests frequently still arrive as paper or a PDF image.",
          "The result is a split posting process: most dollars auto-post from 835s, and a stubborn remainder gets manually keyed from paper, which is slow, error-prone and the first thing to fall behind when staff are stretched. Conversion removes that manual island.",
        ],
      },
      {
        h: "What conversion produces: a valid, balanced 835",
        p: [
          "The goal of conversion is not a spreadsheet or a scanned image in a folder. It is a syntactically valid X12 835 file that the posting engine treats exactly like a payer-sent ERA: same loops, same segments, same reconciliation. If the output is a real 835, everything downstream - auto-posting, denial routing, underpayment detection - works unchanged.",
          "That sets a high bar. A converted 835 has to carry the same structured data an electronic one does, and it has to balance to the penny, or the posting engine will reject it or mis-post.",
        ],
      },
      {
        h: "The conversion pipeline, step by step",
        p: [
          "Capture: the paper EOB is scanned, or the PDF/image is ingested directly. Mailed remittances are digitized first.",
          "Extraction: optical character recognition and data extraction pull the structured fields off the document - payer and payee, check or EFT number and date, each patient and claim, each service line, billed and allowed and paid amounts, patient responsibility, and every adjustment with its reason.",
          "Mapping: the extracted fields are mapped into the 835's structure - the financial header (BPR), the reassociation trace (TRN), payer and payee loops (N1), the claim payment loop (CLP), service lines (SVC), and the adjustment segments (CAS) carrying the CARC and RARC codes.",
          "Validation and balancing: the assembled 835 is checked for X12 syntax and, critically, for arithmetic - each claim's charges must equal payments plus adjustments, and the file total (BPR) must equal the sum of claim payments net of provider-level adjustments.",
          "Delivery: the validated 835 is handed to the posting engine, and the payment posts and reconciles like any other ERA.",
        ],
      },
      {
        h: "Mapping the hard part: adjustments and codes",
        p: [
          "The payment amount is the easy field. The difficulty is the money that was not paid, because that is what drives posting and denials. Every reduction on the EOB has to become a CAS segment with the correct adjustment group code - CO for contractual obligations, PR for patient responsibility, OA for other adjustments, PI for payer-initiated reductions - plus the specific CARC that explains it, and any RARC remark codes.",
          "A paper EOB rarely prints these codes as cleanly as an 835 encodes them. A column labeled 'not covered' or 'plan discount' has to be translated into the right group code and CARC, or the posted adjustment will be wrong and the denial will route incorrectly. This mapping is where conversion accuracy is won or lost.",
        ],
      },
      {
        h: "Edge cases that break naive conversion",
        p: [
          "Multiple claims on one check: a single remittance often pays many claims, so the converter has to split them into separate CLP loops that each balance on their own.",
          "Secondary and COB remittances: when a secondary payer remits, the prior payer's payment and adjustments have to be represented correctly, or the balance will not tie out.",
          "Offsets and recoupments: takebacks, prior overpayment recovery, interest, and capitation are provider-level adjustments (PLB) that are not tied to a single claim - miss them and the file will not balance.",
          "Non-standard layouts: every payer's paper EOB looks different, so a converter built on rigid templates breaks the moment a payer changes its format or a new payer appears.",
        ],
      },
      {
        h: "Balancing is the proof it is correct",
        p: [
          "An 835 has to balance at three levels: each service line, each claim (billed equals paid plus all adjustments plus patient responsibility), and the whole transaction (the BPR payment amount equals the sum of claim payments minus provider-level adjustments). Balancing is not a nice-to-have - it is how you know the conversion did not silently drop or misread a number.",
          "A converted file that does not balance should never be posted blindly. It should be held and flagged, because posting an unbalanced remittance corrupts your A/R.",
        ],
      },
      {
        h: "Where AI agents change the economics",
        p: [
          "Template-based OCR struggles with the variety of paper EOB layouts. An AI approach combines OCR with a model that understands remittance semantics: it reads varied layouts, maps amounts to the correct adjustment group and CARC/RARC codes, assembles a valid 835, and checks that it balances - escalating any page it is not confident about to a human rather than guessing.",
          "That turns conversion from a manual keying task into an exception-only workflow: the agent converts and balances the routine remittances, and staff only touch the ones that genuinely need judgment. It is the same pattern MedXFlow uses across the revenue cycle, applied to the paper that would otherwise never auto-post. For the electronic side of this, our 835 ERA explainer covers what a native remittance contains, and payment posting is where the reconciled 835 lands.",
        ],
      },
    ],
    faq: [
      { q: "What is EOB to ERA conversion?", a: "It is the process of turning a paper or PDF explanation of benefits (EOB) into an X12 835 electronic remittance advice (ERA), so the payment can post automatically instead of being keyed by hand. The output is a valid, balanced 835 that the posting engine treats like any payer-sent ERA." },
      { q: "Why not just post from the paper EOB manually?", a: "You can, but it is slow, error-prone and the first thing to fall behind when staff are busy. Manual EOB posting also means underpayments and denials surface later than they would from an auto-posted 835. Conversion removes that manual bottleneck." },
      { q: "Does a converted 835 post like a real ERA?", a: "Yes, if it is done correctly. A properly converted 835 carries the same loops, segments and CARC/RARC codes as a payer-sent ERA and balances arithmetically, so auto-posting, denial routing and underpayment detection all work unchanged." },
      { q: "What makes EOB to ERA conversion error-prone?", a: "The hardest parts are mapping each reduction to the correct adjustment group code (CO, PR, OA, PI) and CARC, handling multiple claims per check, secondary/COB remittances, and provider-level offsets (PLB), and getting the file to balance to the penny. Rigid template-based tools also break when a payer's layout changes." },
      { q: "Can EOB to ERA conversion be automated accurately?", a: "The routine volume can. Combining OCR with a model that understands remittance semantics can read varied layouts, map codes correctly, build a valid 835 and confirm it balances, while low-confidence pages are escalated to a person. That makes it an exception-only workflow rather than full manual keying." },
    ],
  },

  {
    slug: "how-to-read-an-835-file",
    title: "How to Read an 835 File: Segments, Loops and Balancing",
    description:
      "A segment-level walkthrough of the X12 835 remittance file - ISA/GS/ST envelope, BPR and TRN, N1 payer/payee loops, the CLP claim loop, CAS adjustments and group codes, SVC lines, CARC/RARC, PLB, and how the file balances.",
    date: "2026-08-20", category: "Technical / EDI", readMins: 9,
    keywords: ["how to read an 835", "835 segments", "835 CLP CAS SVC", "835 loops", "PLB segment", "835 balancing"],
    related: { label: "See MedXFlow Payment Posting", href: "/products/payment-posting/" },
    snippet: "An 835 is an X12 file organized as an envelope (ISA/GS/ST), a financial header (BPR) and reassociation trace (TRN), payer and payee loops (N1), then a claim payment loop (CLP) with service lines (SVC) and adjustments (CAS) carrying CARC/RARC codes, and finally provider-level adjustments (PLB). Reading it means following that hierarchy and confirming it balances.",
    intro:
      "If you have ever opened a raw 835 and seen a wall of segments separated by tildes, this is the map. The 835 is hierarchical: an envelope wraps a financial header, which wraps payer and payee identification, which wraps a loop per claim, which wraps a loop per service line. Knowing the key segments tells you exactly how each claim was paid and why, and lets you verify the file balances before it posts.",
    sections: [
      { h: "The envelope: ISA, GS, ST", p: ["Every X12 file opens with an interchange header (ISA) and functional group header (GS), and each transaction set inside starts with ST (with ST01 = 835). These carry sender and receiver IDs, control numbers and dates. You rarely need them for posting, but they are how the file is routed and acknowledged."] },
      { h: "BPR and TRN: the money and the trace", p: ["BPR is the financial information segment: the total payment amount, the payment method (ACH, check, or non-payment for a zero-dollar remit), and the EFT effective date and banking details. TRN is the reassociation trace number - the value that ties this remittance to the actual EFT deposit or check, so you can match the 835 to the money that landed in the bank. Reassociation failures are a common posting headache, and TRN is how you solve them."] },
      { h: "N1 loops: payer and payee", p: ["Two N1 loops identify the parties: the payer (loop 1000A) and the payee (loop 1000B), each with names and identifiers such as the payer ID and the provider's NPI or TIN. This is how the posting engine knows which payer's remittance it is working and which provider it belongs to."] },
      { h: "CLP: the claim payment loop", p: ["The CLP segment opens the loop for one claim. Its key elements are the patient control number (CLP01, which matches the claim number you sent on your 837), the claim status code (CLP02), the total submitted charge (CLP03), the amount paid (CLP04), the patient responsibility (CLP05), and the payer's own claim control number (CLP07). That payer claim control number is what you cite on a corrected claim or an appeal, so it matters."] },
      { h: "CAS: adjustments and group codes", p: ["CAS is where the money that was not paid is explained. Each CAS carries an adjustment group code, then up to six triplets of reason code, amount and quantity. The group codes are the first thing to read: CO (contractual obligations, the write-off you accept), PR (patient responsibility, what moves to the patient), OA (other adjustment), and PI (payer-initiated reductions). The reason code in each triplet is the CARC that says specifically why."] },
      { h: "SVC: the service line loop", p: ["Under each claim, SVC segments carry the line-level detail: the procedure code, the line charge and the line paid amount, and units. Service lines can have their own CAS adjustments, so a claim can be partly paid and partly denied at the line level. Matching SVC lines back to the service lines on your original claim is what makes line-level posting accurate."] },
      { h: "CARC and RARC: reason and remark", p: ["The CARC (claim adjustment reason code) in the CAS triplets tells you why an amount was adjusted or denied. RARC (remittance advice remark codes), carried in LQ segments and the MOA/MIA segments, add supplementary explanation. Together they are the starting point for denial management and for spotting underpayments against your fee schedule."] },
      { h: "PLB: provider-level adjustments", p: ["PLB is the segment that trips people up. It carries adjustments that are not tied to a single claim: prior-period overpayment recoupments and offsets, interest, capitation payments, and forwarding balances. Because a PLB can move money independently of the claims listed, you cannot balance an 835 to the bank deposit without accounting for it."] },
      { h: "Balancing an 835", p: ["A correct 835 balances at three levels. Each service line: line charge equals line paid plus line adjustments. Each claim: CLP charge equals paid plus all CAS adjustments plus patient responsibility. And the whole transaction: the BPR payment amount equals the sum of claim payments minus (or plus) the PLB provider-level adjustments. If any level does not tie out, the file has a problem and should be held rather than posted."] },
    ],
    faq: [
      { q: "What are the main segments in an 835?", a: "The envelope (ISA/GS/ST), the financial header (BPR) and reassociation trace (TRN), payer and payee loops (N1), a claim payment loop (CLP) per claim, service lines (SVC) with adjustments (CAS) carrying CARC/RARC codes, and provider-level adjustments (PLB)." },
      { q: "What is the TRN segment used for?", a: "TRN carries the reassociation trace number that links the 835 remittance to the actual EFT deposit or check. It is how you match the remittance to the money that arrived in the bank, which is essential for reconciliation." },
      { q: "What is the difference between CARC and RARC?", a: "CARC (claim adjustment reason codes) explain why an amount was adjusted or denied and appear in the CAS segments. RARC (remittance advice remark codes) add supplementary explanation and appear in LQ and MOA/MIA segments. CARC drives the adjustment; RARC clarifies it." },
      { q: "What do the CAS group codes CO, PR, OA and PI mean?", a: "CO is contractual obligations (the write-off you accept), PR is patient responsibility (what moves to the patient), OA is other adjustment, and PI is payer-initiated reductions. The group code tells you where the unpaid amount goes; the CARC says why." },
      { q: "What is a PLB adjustment on an 835?", a: "PLB (provider-level balance) carries adjustments not tied to a single claim, such as overpayment recoupments, offsets, interest and capitation. You have to account for PLB to reconcile the 835 total to the actual deposit." },
    ],
  },

  {
    slug: "hl7-vs-fhir-healthcare-data",
    title: "HL7 vs FHIR: What They Mean for Healthcare Data",
    description: "HL7 and FHIR are healthcare data standards, but they work very differently. Here is what each is, how they compare, and why FHIR is driving newer interoperability.",
    date: "2026-08-17", category: "Technical / Interoperability", readMins: 6,
    keywords: ["HL7 vs FHIR", "FHIR healthcare", "HL7 v2", "healthcare interoperability", "FHIR API"],
    related: { label: "See AI Agents for RCM", href: "/ai-agents-rcm/" },
    snippet: "HL7 v2 is a long-standing messaging standard for exchanging clinical and administrative data between healthcare systems; FHIR is HL7's modern, web-API-based standard using REST and JSON. FHIR is easier to build on and is driving newer interoperability, including prior authorization.",
    intro: "If you work near healthcare integrations, you hear HL7 and FHIR constantly. They are related but very different, and the shift toward FHIR is changing how systems (including RCM automation) connect to EHRs and payers.",
    sections: [
      { h: "HL7 v2: the workhorse", p: ["HL7 version 2 is a decades-old messaging standard that most hospitals still run for things like admissions, orders, and results. It uses pipe-and-hat delimited messages that are efficient but not easy for modern developers to work with, and implementations vary between systems."] },
      { h: "FHIR: the modern API standard", p: ["FHIR (Fast Healthcare Interoperability Resources) is HL7's newer standard, built on modern web technology: RESTful APIs, JSON, and discrete resources like Patient, Coverage, and Claim. It is far easier to build on, which is why regulators and vendors are pushing it."] },
      { h: "How they compare", p: ["HL7 v2 is messaging (a system pushes a message when an event happens); FHIR is API-based (a system requests exactly the resource it needs). FHIR is more granular, developer-friendly, and web-native, while HL7 v2 remains deeply embedded in existing hospital workflows."] },
      { h: "Why it matters for RCM", p: ["FHIR is enabling newer revenue-cycle interoperability, including electronic prior authorization (the Da Vinci PAS work). As payers and EHRs expose FHIR APIs, RCM automation can read coverage, submit authorizations, and check status through standard interfaces rather than portal scraping."] },
    ],
    faq: [
      { q: "Is FHIR replacing HL7 v2?", a: "Not entirely, and not quickly. FHIR is the direction for new interoperability, but HL7 v2 is deeply embedded in existing hospital systems and will run alongside FHIR for years." },
      { q: "Why does FHIR matter for the revenue cycle?", a: "FHIR APIs let systems exchange coverage, claims and authorization data in a standard, developer-friendly way, which underpins newer electronic prior authorization and eligibility interoperability." },
    ],
  },

  {
    slug: "ncci-edits-explained",
    title: "NCCI Edits Explained: Why Claims Get Bundled",
    description: "NCCI edits are CMS rules that cause bundling and unit denials. Here is what PTP edits and MUEs are, why they exist, and how to handle them correctly.",
    date: "2026-08-18", category: "Technical / Coding", readMins: 5,
    keywords: ["NCCI edits", "PTP edits", "MUE", "bundling denials", "correct coding initiative"],
    related: { label: "See Charge Capture & Coding", href: "/products/charge-capture-coding/" },
    snippet: "NCCI (National Correct Coding Initiative) edits are CMS rules that prevent improper code pairings and excessive units. PTP (procedure-to-procedure) edits stop two codes that should not be billed together, and MUEs cap the units allowed per code. They are a common source of bundling denials.",
    intro: "When a line comes back denied as not separately payable or bundled, an NCCI edit is often the reason. These are CMS coding rules, and knowing how they work tells you whether a modifier is appropriate or whether the denial should stand.",
    sections: [
      { h: "What are NCCI edits?", p: ["The National Correct Coding Initiative is a set of CMS rules that promote correct coding and prevent improper payment. Payers apply them (and their own edits) during adjudication, which is why some code combinations get bundled or reduced."] },
      { h: "PTP edits", p: ["Procedure-to-procedure (PTP) edits identify pairs of codes that should not normally be billed together for the same patient on the same day. When both are billed, the secondary code is denied unless an appropriate modifier indicates the services were genuinely separate and distinct."] },
      { h: "MUEs", p: ["Medically Unlikely Edits (MUEs) cap the number of units of a code that are payable for one patient on one day. Billing above the MUE causes a units denial, which is why frequency and units must match documentation."] },
      { h: "Modifiers and appeals", p: ["Some PTP edits allow a modifier (such as 59 or an X modifier) when the services really were distinct and the documentation supports it. Using these modifiers without support is a compliance risk, so the fix is either a supported modifier or accepting the edit."] },
    ],
    faq: [
      { q: "What is a PTP edit?", a: "A procedure-to-procedure edit flags two codes that should not normally be billed together for the same patient on the same day. The secondary code denies unless a supported modifier shows the services were distinct." },
      { q: "What is an MUE?", a: "A Medically Unlikely Edit caps the units of a code payable for one patient per day. Billing more units than the MUE allows causes a denial, so units must match documentation." },
    ],
  },

  {
    slug: "how-ai-agents-work-healthcare-rcm-technical",
    title: "How AI Agents Work in Healthcare RCM (Under the Hood)",
    description: "A technical look at how AI agents actually run revenue-cycle tasks: the model, the tools, the control loop, and where human review fits.",
    date: "2026-08-18", category: "Technical / AI", readMins: 6,
    keywords: ["how AI agents work", "AI agent architecture", "AI agents RCM technical", "LLM agents healthcare"],
    related: { label: "See AI Agents for RCM", href: "/ai-agents-rcm/" },
    snippet: "An AI agent in RCM combines a language model that reasons about a task, tools that let it act (read documents, call payer systems, query your PMS/EHR), and a control loop that plans, executes, checks results, and escalates exceptions to staff. It is goal-driven, not script-driven.",
    intro: "AI agent is used loosely, so here is a concrete, technical picture of what one actually is and how it runs a revenue-cycle task, versus older rule-based automation.",
    sections: [
      { h: "The three parts of an agent", p: ["An AI agent has three parts: a reasoning model (a language model that interprets the task and decides the next step), a set of tools (functions that let it act, such as reading a document, submitting to a payer portal or API, or querying your PMS/EHR), and a control loop that plans, calls tools, checks the results, and decides what to do next."] },
      { h: "Goal-driven, not script-driven", p: ["Where RPA follows a fixed recorded script, an agent works from a goal. Given verify this patient's eligibility, it decides which lookups to run, reads the response, validates it, and handles variation. That is why it survives payer portal changes that break brittle scripts."] },
      { h: "Grounding and validation", p: ["A well-built RCM agent is grounded in your rules and payer data, and it validates its own outputs (for example, checking that a diagnosis supports a procedure before submitting). Actions are logged so every step is auditable."] },
      { h: "Human-in-the-loop", p: ["Agents are designed to escalate. When confidence is low or a case is unusual (a complex denial, an ambiguous document), the agent routes it to a staff member rather than guessing. Humans handle the exceptions; the agent handles the repetitive volume."] },
      { h: "Why this fits RCM", p: ["The revenue cycle is full of well-defined, high-volume, rules-based tasks that also vary by payer, which is exactly where goal-driven agents outperform both manual work and rigid scripts."] },
    ],
    faq: [
      { q: "How is an AI agent different from RPA?", a: "RPA follows a fixed recorded script and breaks when a screen changes. An AI agent works from a goal, reasons about each step, adapts to variation, and escalates exceptions, so it handles the messy reality of payer workflows." },
      { q: "Do AI agents make decisions on their own?", a: "They handle routine, rules-based work and validate their outputs, but they escalate low-confidence or unusual cases to staff. Every action is logged and auditable, and humans stay in control of exceptions." },
    ],
  },

  {
    slug: "276-277-claim-status-explained",
    title: "The 276/277 Claim Status Transaction Explained",
    description: "The 276/277 is how you check claim status electronically without payer portals. Here is what the 276 request and 277 response contain and why it powers AR follow-up.",
    date: "2026-08-18", category: "Technical / EDI", readMins: 5,
    keywords: ["276 277 transaction", "claim status EDI", "claim status inquiry", "automated claim status", "AR follow-up EDI"],
    related: { label: "See MedXFlow Denial Management", href: "/products/denial-management/" },
    snippet: "The 276 is an EDI claim status request sent to a payer to ask where a claim stands; the 277 is the payer's response. Automating 276/277 lets you track claim status without logging into payer portals, which is central to efficient AR follow-up.",
    intro: "Chasing claim status by logging into payer portals is one of the biggest time sinks in AR follow-up. The 276/277 transaction is the electronic alternative, and automating it is how follow-up stops falling behind.",
    sections: [
      { h: "The 276 request", p: ["The 276 is an inquiry sent to a payer asking for the status of one or more claims. It identifies the provider, payer, patient, and the specific claim(s) in question."] },
      { h: "The 277 response", p: ["The 277 returns the claim's status: received, pending, paid, denied, or in review, along with relevant dates and identifiers. It is the electronic equivalent of checking the payer portal, but returned as structured data."] },
      { h: "Why automate it", p: ["Because 276/277 is a standard exchange, software can poll claim status automatically instead of staff logging into portals one claim at a time. That keeps follow-up current and catches problems (like a claim that stalled) before they cross timely-filing windows."] },
      { h: "How it fits AR follow-up", p: ["Automated 276/277 is the backbone of scalable AR follow-up: it surfaces which claims need action, so staff and AI agents can focus on working denials and appeals rather than hunting for status."] },
    ],
    faq: [
      { q: "What is the 277 response?", a: "The 277 is the payer's answer to a 276 claim status request. It reports whether a claim is received, pending, paid, denied, or in review, with dates and identifiers, as structured data." },
      { q: "How does 276/277 help AR?", a: "It lets you check claim status electronically instead of logging into payer portals, so follow-up can be automated and kept current, catching stalled claims before they cross filing windows." },
    ],
  },

  {
    slug: "is-ai-rcm-hipaa-compliant",
    title: "Is AI in Healthcare RCM HIPAA Compliant?",
    description: "Can AI handle revenue cycle work under HIPAA? Here is what HIPAA requires of RCM automation, the role of the BAA, and what to check before trusting a vendor.",
    date: "2026-08-19", category: "Compliance & Security", readMins: 6,
    keywords: ["AI RCM HIPAA compliant", "HIPAA AI healthcare", "is AI HIPAA compliant", "RCM automation HIPAA"],
    related: { label: "See MedXFlow Trust & Security", href: "/trust/" },
    snippet: "AI in healthcare RCM can be HIPAA compliant, but the compliance depends on the vendor, not the technology. The vendor must handle PHI to HIPAA standards, sign a Business Associate Agreement (BAA), encrypt data, restrict access, and log every action. Always confirm these before sharing PHI.",
    intro: "AI agents that run the revenue cycle necessarily touch protected health information, so HIPAA applies. The question is not whether AI can be compliant, but whether a given vendor operates compliantly. Here is what to verify.",
    sections: [
      { h: "HIPAA applies to the vendor, not the technology", p: ["HIPAA compliance is about how PHI is handled, stored and accessed, not about whether the tool uses AI. Any vendor that processes PHI on your behalf is a business associate and must meet HIPAA's requirements. AI does not change that obligation; it just means the vendor is doing more of the work."] },
      { h: "The BAA is non-negotiable", p: ["Before any PHI is exchanged, the vendor must sign a Business Associate Agreement (BAA). The BAA legally binds them to protect PHI and defines what they can and cannot do with it. No BAA means you should not share PHI, full stop."] },
      { h: "What compliant AI RCM looks like", p: ["Data encrypted in transit and at rest, least-privilege access so people and agents only reach what they need, US data residency where required, complete audit logging of every action, and a clear policy that PHI is never sold or used to train public models."] },
      { h: "Questions to ask any AI RCM vendor", p: ["Will you sign a BAA? Where is PHI stored and is it encrypted? Who and what can access it? Is every AI action logged and auditable? Do you use our data to train shared models? Honest vendors answer these clearly."] },
    ],
    faq: [
      { q: "Can AI be HIPAA compliant?", a: "Yes, when the vendor handling PHI meets HIPAA requirements: a signed BAA, encryption, least-privilege access, audit logging, and a policy against selling or training public models on PHI. Compliance depends on the vendor's practices, not on the use of AI." },
      { q: "Does an AI RCM vendor need a BAA?", a: "Yes. Any vendor that processes PHI on your behalf is a business associate and must sign a Business Associate Agreement before PHI is exchanged." },
    ],
  },

  {
    slug: "what-is-a-baa-business-associate-agreement",
    title: "What Is a BAA (Business Associate Agreement)?",
    description: "A BAA is the HIPAA contract every healthcare vendor that touches PHI must sign. Here is what it is, what it covers, and why it matters for RCM software.",
    date: "2026-08-19", category: "Compliance & Security", readMins: 5,
    keywords: ["what is a BAA", "business associate agreement", "HIPAA BAA", "BAA RCM vendor"],
    related: { label: "See MedXFlow Trust & Security", href: "/trust/" },
    snippet: "A Business Associate Agreement (BAA) is a HIPAA-required contract between a healthcare provider and a vendor that handles protected health information (PHI) on its behalf. It legally binds the vendor to safeguard PHI, defines permitted uses, and sets breach-notification duties.",
    intro: "If a vendor touches your patients' data, HIPAA requires a BAA before any PHI changes hands. It is one of the first things to confirm when evaluating any RCM or healthcare software.",
    sections: [
      { h: "What a BAA is", p: ["A Business Associate Agreement is a contract that HIPAA requires between a covered entity (like a practice) and a business associate (a vendor that handles PHI on its behalf). It makes the vendor legally responsible for protecting that PHI."] },
      { h: "What it covers", p: ["A BAA defines the permitted uses and disclosures of PHI, requires appropriate safeguards, obligates the vendor to report security incidents and breaches, and addresses what happens to PHI when the relationship ends. It turns HIPAA obligations into an enforceable agreement."] },
      { h: "Why it matters for RCM software", p: ["RCM vendors process eligibility, claims, remittances and patient data, all of which contain PHI. Without a signed BAA, sharing that data is a HIPAA violation. A vendor that readily offers a BAA is signaling that it takes compliance seriously."] },
    ],
    faq: [
      { q: "Who needs a BAA?", a: "Any vendor (business associate) that creates, receives, maintains or transmits PHI on behalf of a covered entity needs a signed BAA before PHI is exchanged." },
      { q: "What happens without a BAA?", a: "Sharing PHI with a vendor that has not signed a BAA is a HIPAA violation for both parties. Always secure the BAA first." },
    ],
  },

  {
    slug: "soc-2-for-healthcare-vendors",
    title: "SOC 2 for Healthcare Vendors: What It Means",
    description: "SOC 2 is a security standard you will see from healthcare software vendors. Here is what SOC 2 Type II covers, how it differs from HIPAA, and why both matter.",
    date: "2026-08-19", category: "Compliance & Security", readMins: 5,
    keywords: ["SOC 2 healthcare", "SOC 2 Type II", "SOC 2 vs HIPAA", "SOC 2 vendor"],
    related: { label: "See MedXFlow Trust & Security", href: "/trust/" },
    snippet: "SOC 2 is an independent audit standard that evaluates how a vendor manages data security. SOC 2 Type II tests whether controls operate effectively over a period of time, across trust criteria like security, availability and confidentiality. It complements HIPAA rather than replacing it.",
    intro: "SOC 2 and HIPAA both come up when vetting healthcare software, and they are related but different. Understanding each tells you what a vendor's security claims actually mean.",
    sections: [
      { h: "What SOC 2 is", p: ["SOC 2 is a security and controls framework from the AICPA. A SOC 2 report evaluates a vendor against trust services criteria: security, availability, processing integrity, confidentiality and privacy. It is a widely recognized signal that a vendor has real security controls."] },
      { h: "Type I vs Type II", p: ["A SOC 2 Type I report describes controls at a point in time. A Type II report tests whether those controls actually operated effectively over a period (often several months to a year), which is a stronger assurance."] },
      { h: "SOC 2 vs HIPAA", p: ["HIPAA is a healthcare-specific legal requirement for protecting PHI; SOC 2 is a broader, voluntary security standard. A vendor can be aligned to SOC 2 and HIPAA-compliant at the same time, and healthcare buyers often expect both."] },
      { h: "What to ask", p: ["Ask whether a vendor is SOC 2 aligned or has a completed SOC 2 Type II report, and which trust criteria it covers. Combined with a HIPAA BAA, it gives a fuller picture of the vendor's security posture."] },
    ],
    faq: [
      { q: "Is SOC 2 the same as HIPAA?", a: "No. HIPAA is a healthcare-specific legal requirement for protecting PHI; SOC 2 is a broader voluntary security audit standard. Healthcare vendors often address both." },
      { q: "What is SOC 2 Type II?", a: "A SOC 2 Type II report tests whether a vendor's security controls operated effectively over a period of time, which is a stronger assurance than a point-in-time Type I report." },
    ],
  },

  {
    slug: "how-phi-is-protected-in-rcm-automation",
    title: "How PHI Is Protected in RCM Automation",
    description: "When automation and AI agents handle claims and eligibility, they handle PHI. Here are the safeguards that keep protected health information secure in RCM automation.",
    date: "2026-08-19", category: "Compliance & Security", readMins: 5,
    keywords: ["PHI protection", "PHI security RCM", "protected health information automation", "healthcare data security"],
    related: { label: "See MedXFlow Trust & Security", href: "/trust/" },
    snippet: "PHI in RCM automation is protected through encryption in transit and at rest, least-privilege access controls, US data residency where required, complete audit logging of every action, and policies that prevent selling PHI or using it to train public models.",
    intro: "Automating the revenue cycle means software and AI agents work with protected health information. The safeguards below are what keep that data secure, and what to expect from any vendor that processes it.",
    sections: [
      { h: "Encryption in transit and at rest", p: ["PHI should be encrypted whenever it moves across a network and whenever it is stored, using industry-standard encryption. This protects data even if it is intercepted or a storage system is compromised."] },
      { h: "Least-privilege access", p: ["People and automated agents should only be able to access the specific data they need for a task, and nothing more. Least-privilege access limits exposure and reduces the impact if any single account or agent is compromised."] },
      { h: "Audit logging", p: ["Every action, whether taken by a person or an AI agent, should be logged with who or what did it, when, and to which record. A complete audit trail is essential both for security and for accountability over automated actions."] },
      { h: "Data residency and use limits", p: ["Storing data in US data centers meets residency expectations for US healthcare, and a clear policy that PHI is never sold or used to train public models ensures the data is used only to run your revenue cycle."] },
    ],
    faq: [
      { q: "How is PHI kept secure in AI RCM?", a: "Through encryption in transit and at rest, least-privilege access, US data residency where required, complete audit logging of every action, and policies that prevent selling PHI or using it to train shared models." },
      { q: "Are AI agent actions on PHI logged?", a: "They should be. Every action an agent takes on PHI should be documented and attributable, giving a complete, reviewable audit trail." },
    ],
  },

  {
    slug: "security-questions-to-ask-rcm-vendor",
    title: "Data Security Questions to Ask Any RCM Vendor",
    description: "A practical checklist of the security and compliance questions to ask before trusting a revenue cycle vendor with your patients' data.",
    date: "2026-08-19", category: "Compliance & Security", readMins: 5,
    keywords: ["RCM vendor security questions", "healthcare vendor security checklist", "vendor due diligence PHI", "RCM security"],
    related: { label: "See MedXFlow Trust & Security", href: "/trust/" },
    snippet: "Before trusting an RCM vendor with PHI, confirm: they will sign a BAA, data is encrypted in transit and at rest, access is least-privilege, every action is logged, data is stored in the US, they do not sell or train public models on your data, and they can describe their breach-notification process.",
    intro: "Choosing an RCM vendor means handing over patient data, so security due diligence matters. Here is a practical checklist to run through with any vendor before you sign.",
    sections: [
      { h: "Compliance basics", p: ["Will you sign a Business Associate Agreement (BAA)? Are you HIPAA compliant, and are your controls aligned to SOC 2 Type II? These are table stakes for handling PHI."] },
      { h: "Data handling", p: ["Where is PHI stored, and is it in the US? Is it encrypted in transit and at rest? Who and what can access it, and is access least-privilege? Do you sell data or use it to train public models (the answer should be no)?"] },
      { h: "Accountability and incidents", p: ["Is every action, including AI agent actions, logged and auditable? What is your breach-notification process and timeline? How do you handle our data if we stop working together?"] },
      { h: "For AI vendors specifically", p: ["How do AI agents access PHI, and are their actions supervised and escalated to humans on exceptions? A good AI RCM vendor can explain exactly how the agents stay within HIPAA-standard handling."] },
    ],
    faq: [
      { q: "What security questions should I ask an RCM vendor?", a: "Ask whether they will sign a BAA, whether data is encrypted and stored in the US, who can access PHI, whether every action is logged, whether they sell or train models on your data, and what their breach-notification process is." },
      { q: "What is the most important security question?", a: "Whether the vendor will sign a Business Associate Agreement (BAA). Without one, sharing PHI is a HIPAA violation, regardless of their other assurances." },
    ],
  },

];

export const post = (slug) => POSTS.find((p) => p.slug === slug);

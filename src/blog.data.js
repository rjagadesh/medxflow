// Blog / resources content. Each post is targeted at a specific long-tail RCM
// search a new domain can realistically rank for, and links internally to the
// relevant product page. Rendered by Blog.jsx and prerendered (Article + FAQ
// JSON-LD) by scripts/prerender.mjs.

export const POSTS = [
  {
    slug: "reduce-claim-denials-small-practice",
    title: "How to Reduce Claim Denials in a Small Medical Practice",
    description:
      "A practical, step-by-step guide to lowering your claim denial rate — the top denial reasons, how to fix them at the source, and where automation helps.",
    date: "2026-08-12",
    category: "Denial Management",
    readMins: 7,
    keywords: ["reduce claim denials", "claim denial management", "denial rate", "medical billing denials"],
    related: { label: "See MedXFlow Denial Management", href: "/products/denial-management" },
    intro:
      "Claim denials are one of the biggest silent drains on a practice's revenue. Industry benchmarks put the average denial rate between 5% and 10%, and roughly two-thirds of denied claims are never reworked. For a small practice, that lost revenue is often the difference between a good month and a bad one. The good news: most denials are preventable, and you don't need a big team to fix them.",
    sections: [
      {
        h: "1. Measure your denial rate first",
        p: [
          "You can't improve what you don't measure. Your denial rate is the number of claims denied divided by the number of claims submitted in a period. Pull this from your clearinghouse or practice management system monthly.",
          "Break it down by payer and by denial reason code (CARC/RARC). Most practices find that a handful of reasons — eligibility, missing prior authorization, and coding errors — account for the majority of denials. That concentration is good news: fixing three root causes moves the needle far more than chasing every claim.",
        ],
      },
      {
        h: "2. Fix eligibility at the front desk",
        p: [
          "The single most common denial reason is eligibility: the patient's coverage was inactive, the plan changed, or the service wasn't covered. These are caught before the visit, not after.",
          "Verify eligibility for every appointment — ideally at scheduling and again 24–48 hours before the visit, because coverage changes at month boundaries. Automating this check removes the manual portal work and catches problems while you can still act on them.",
        ],
      },
      {
        h: "3. Never skip prior authorization",
        p: [
          "Services that require prior authorization and don't have it are almost always denied — and these denials are hard to appeal after the fact. Build a payer-specific list of what needs auth, and confirm the authorization number is on the claim before it goes out.",
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
          "When a denial does happen, speed matters — many payers have tight appeal windows. Triage denials daily, route them to the right person, and — critically — record the root cause so you can prevent the next one. A denial you fix once is a bug; a denial you keep getting is a broken process.",
          "This is exactly where automation earns its keep: AI agents can triage denials by reason, draft appeals, and surface the patterns that tell you which upstream step to fix.",
        ],
      },
    ],
    faq: [
      {
        q: "What is a good claim denial rate?",
        a: "Under 5% is generally considered healthy. Best-in-class practices run 2–4%. If you're above 10%, there's usually a concentrated, fixable root cause — most often eligibility or prior authorization.",
      },
      {
        q: "How much revenue do denials cost?",
        a: "Reworking a denied claim costs roughly $25–$118 in staff time, and around two-thirds of denials are never reworked at all — so the true cost is the lost reimbursement plus the labor on the ones you do chase.",
      },
    ],
  },

  {
    slug: "prior-authorization-automation-guide",
    title: "Prior Authorization Automation: A Practical Guide for Clinics",
    description:
      "What prior authorization automation actually does, where it fits in your workflow, and how to cut turnaround time and denials without adding staff.",
    date: "2026-08-13",
    category: "Prior Authorization",
    readMins: 6,
    keywords: ["prior authorization automation", "prior auth software", "automate prior authorization", "prior auth turnaround"],
    related: { label: "See MedXFlow Eligibility & Prior Auth", href: "/products/eligibility-verification" },
    intro:
      "Prior authorization is one of the most manual, time-consuming tasks in the revenue cycle — and one of the most expensive to get wrong. Staff spend hours on payer portals and phone calls, patients wait for care, and a missed auth almost always becomes a denial. Automation doesn't remove the payer requirement, but it removes most of the manual work around it.",
    sections: [
      {
        h: "What 'prior authorization automation' really means",
        p: [
          "It's not a single button. In practice it's a set of steps that software can handle for you: determining whether a service needs authorization, gathering the required clinical documentation, submitting the request to the right payer, checking status until a decision comes back, and attaching the approval to the claim.",
          "Each of those steps is rules-based and repetitive — exactly the kind of work AI agents and automation do well, with staff stepping in only on exceptions.",
        ],
      },
      {
        h: "Step 1: Automated requirement lookup",
        p: [
          "The first win is simply knowing what needs auth. Payer rules change constantly. An automated requirement lookup checks the specific payer and plan against the CPT/HCPCS code so nothing slips through — the leading cause of 'we didn't know it needed auth' denials.",
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
          "The authorization number has to land on the claim. Automation carries the approval straight through so the claim goes out clean — closing the gap where manual handoffs lose auth numbers and create denials.",
        ],
      },
      {
        h: "What to expect",
        p: [
          "Practices that automate prior auth typically see faster turnaround, fewer auth-related denials, and hours of staff time returned each week. The goal isn't to replace your team — it's to take the portal grind off their plate so they handle the judgment calls, not the busywork.",
        ],
      },
    ],
    faq: [
      {
        q: "Can prior authorization be fully automated?",
        a: "The manual work around it can be largely automated — requirement lookup, submission, status checks, and attaching the approval to the claim. The payer still makes the decision, and complex clinical cases route to staff, but the repetitive portal work is handled for you.",
      },
      {
        q: "Does automation work with my EHR?",
        a: "Good automation works alongside the systems you already run rather than replacing them, writing authorizations back so your existing workflow stays intact.",
      },
    ],
  },

  {
    slug: "what-is-dnfb-clear-coding-backlog",
    title: "What Is DNFB — and How to Clear a Coding Backlog",
    description:
      "DNFB explained in plain terms: what 'discharged not final billed' means, why the backlog grows, and how to clear it and keep it low with automation.",
    date: "2026-08-14",
    category: "Coding & Charge Capture",
    readMins: 6,
    keywords: ["what is DNFB", "DNFB backlog", "discharged not final billed", "coding backlog"],
    related: { label: "See MedXFlow Medical Coding", href: "/products/charge-capture-coding" },
    intro:
      "DNFB — 'discharged not final billed' — is one of the clearest signals of trapped cash in a revenue cycle. When charts pile up waiting to be coded, the care has been delivered but the bill hasn't gone out, so revenue sits idle. A rising DNFB number almost always points to a coding bottleneck. Here's what it means and how to bring it down.",
    sections: [
      {
        h: "DNFB in plain terms",
        p: [
          "DNFB is the dollar value (or day count) of encounters that are complete and discharged but haven't been finalized and billed — usually because they're waiting to be coded. It's often expressed as 'days in DNFB': total DNFB dollars divided by average daily revenue.",
          "Every day a chart sits in DNFB is a day that revenue isn't in your bank account. For cash flow, DNFB days are as important as A/R days — and more controllable.",
        ],
      },
      {
        h: "Why the backlog grows",
        p: [
          "The usual culprits: coder shortages and turnover, volume spikes, complex documentation that needs clarification, and repetitive charts that eat coder time without needing their expertise. The backlog compounds — a few slow days turn into a week, then revenue targets slip.",
        ],
      },
      {
        h: "How to clear it",
        p: [
          "First, measure DNFB days weekly and set a target (many organizations aim for under 5 days). Then attack the repetitive volume: let automation handle straightforward charts and code assignment so your coders spend their time on the complex, high-value cases that actually need judgment.",
          "AI coding assistance can draft codes from documentation, flag medical-necessity mismatches before the claim goes out, and route only the exceptions to staff — which is what keeps the backlog from rebuilding after you clear it.",
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
        a: "Many organizations target under 5 days in DNFB. The right number depends on your specialty and volume, but the trend matters most — a rising DNFB means cash is getting trapped.",
      },
      {
        q: "How does automation reduce DNFB?",
        a: "By coding straightforward charts automatically and routing only complex cases to staff, automation absorbs the repetitive volume that causes backlogs — so charts get finalized and billed faster.",
      },
    ],
  },
  {
    slug: "ai-agents-vs-rpa-healthcare-rcm",
    title: "AI Agents vs. RPA in Healthcare RCM: What's the Difference?",
    description:
      "AI agents and RPA both automate revenue-cycle work, but they fail — and scale — very differently. Here's how they compare for healthcare RCM, in plain terms.",
    date: "2026-08-15",
    category: "AI & Automation",
    readMins: 6,
    keywords: ["AI agents vs RPA", "RPA healthcare RCM", "AI agents revenue cycle", "RCM automation"],
    related: { label: "See MedXFlow AI Agents for RCM", href: "/ai-agents-rcm" },
    intro:
      "\"Automation\" in healthcare RCM usually means one of two things: traditional RPA (robotic process automation) or newer AI agents. They sound similar and often get lumped together, but they behave very differently when a payer portal changes or a claim doesn't fit the script. Understanding the difference helps you pick the right tool — and set the right expectations.",
    sections: [
      {
        h: "What RPA does",
        p: [
          "RPA follows a recorded script: click here, copy this field, paste it there. It's fast and reliable for stable, high-volume tasks that never change. But RPA is brittle — when a payer redesigns a portal or an unexpected screen appears, the script breaks and someone has to re-record it. RPA doesn't understand the task; it repeats keystrokes.",
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
          "RPA suits narrow, unchanging steps. AI agents suit end-to-end workflows that span systems and vary by payer — eligibility, prior authorization, claims follow-up and denials. MedXFlow uses AI agents so automation survives the constant change in payer rules and portals, with humans handling the exceptions.",
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
      { q: "Is RPA still useful in RCM?", a: "Yes, for narrow, stable, high-volume steps that rarely change. The limitation is brittleness — RPA breaks when portals or rules change, which happens constantly in healthcare." },
      { q: "Do AI agents remove the need for staff?", a: "No. They handle repetitive volume and escalate exceptions to staff, who focus on judgment calls. Every action stays tracked and auditable." },
    ],
  },

  {
    slug: "how-ai-automates-eligibility-verification",
    title: "How AI Automates Insurance Eligibility Verification",
    description:
      "A step-by-step look at how AI automates insurance eligibility verification — from patient data to a verified benefits result written back to your system.",
    date: "2026-08-15",
    category: "Eligibility",
    readMins: 6,
    keywords: ["AI eligibility verification", "automated eligibility verification", "AI insurance verification", "eligibility automation"],
    related: { label: "See MedXFlow Eligibility Verification", href: "/products/eligibility-verification" },
    intro:
      "Eligibility is the first place claims go wrong — and the cheapest place to fix them. Verifying coverage before the visit stops denials that would otherwise surface weeks later. AI automates that check so it happens for every appointment, not just the ones staff have time for.",
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
          "Coverage changes — especially at month boundaries. Checking once at scheduling and again shortly before the visit catches plan changes while you can still act on them, rather than discovering them on a denied claim. Automation makes that double-check practical because it costs no extra staff time.",
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
      { q: "Can eligibility really be checked for every patient?", a: "Yes — that's the point of automating it. Because the check runs without manual portal work, it can cover every appointment instead of a sample, including a re-check close to the visit." },
      { q: "Does it work with our practice management system?", a: "Verified coverage is written back into the systems you already run, so front-desk and billing staff see results in their normal workflow." },
    ],
  },

  {
    slug: "ai-ar-follow-up-healthcare",
    title: "AI-Powered AR Follow-Up in Healthcare",
    description:
      "How AI keeps accounts receivable moving — automating payer follow-up, denial triage and patient balance outreach so cash doesn't stall in aging AR.",
    date: "2026-08-16",
    category: "Accounts Receivable",
    readMins: 6,
    keywords: ["AI AR follow-up", "accounts receivable automation healthcare", "AI payer follow-up", "reduce AR days"],
    related: { label: "See MedXFlow Denial Management", href: "/products/denial-management" },
    intro:
      "Accounts receivable is where revenue goes to wait. Claims that aren't followed up on age, and aging claims get paid slower — or not at all. AR follow-up is high-volume, repetitive, and easy to fall behind on, which makes it a natural fit for automation.",
    sections: [
      {
        h: "Why AR days climb",
        p: [
          "Follow-up is manual and endless: checking claim status on payer portals, re-working denials, chasing patient balances. When staff fall behind, claims cross timely-filing and appeal windows, and AR days rise. The problem isn't effort — it's that there's more repetitive follow-up than any team can keep up with.",
        ],
      },
      {
        h: "What AI automates",
        p: [
          "AI agents check claim status automatically instead of staff logging into portals, triage denials by reason and draft appeals, and run patient balance follow-up with clear statements and reminders. Staff step in on the exceptions — the complex payer disputes that actually need a person.",
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
      { q: "What is a good AR days number?", a: "It varies by specialty, but lower and trending-down is the goal. The biggest driver of high AR days is follow-up that falls behind — which is exactly what automation prevents." },
      { q: "Does AI handle patient balances too?", a: "Yes — automated patient statements and gentle follow-up cover the patient side of AR, alongside payer follow-up and denial work." },
    ],
  },

  {
    slug: "how-ai-automates-claims-management",
    title: "How AI Automates Healthcare Claims Management",
    description:
      "From clean claim creation to submission and status follow-up — how AI automates healthcare claims management to reduce rejections and speed up payment.",
    date: "2026-08-16",
    category: "Claims",
    readMins: 6,
    keywords: ["AI claims management", "healthcare claims automation", "claims processing automation", "clean claims"],
    related: { label: "See MedXFlow Claims Submission", href: "/products/claims-submission" },
    intro:
      "A clean claim gets paid the first time; a dirty one comes back as a denial or rejection and has to be reworked. Claims management is really about getting more claims right before they leave — and following up on the rest so nothing stalls. AI automates both sides.",
    sections: [
      {
        h: "Clean claims before submission",
        p: [
          "Automation scrubs claims against payer rules and flags problems — missing modifiers, medical-necessity mismatches, incomplete data — before the claim is submitted. Catching errors here, rather than after a denial, is the single biggest lever on first-pass acceptance.",
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
      { q: "What is first-pass acceptance?", a: "The share of claims a payer accepts on the first submission, without a rejection or denial. Higher first-pass acceptance means faster payment and less rework — which claim scrubbing before submission directly improves." },
      { q: "Does AI submit to all payers?", a: "MedXFlow generates and submits compliant claims to every major payer and clearinghouse, and follows up on status automatically." },
    ],
  },
];

export const post = (slug) => POSTS.find((p) => p.slug === slug);

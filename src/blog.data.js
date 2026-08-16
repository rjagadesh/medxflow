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
];

export const post = (slug) => POSTS.find((p) => p.slug === slug);

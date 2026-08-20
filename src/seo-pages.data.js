// Data-driven SEO landing pages (pillar + audience). Plain JS (no JSX) so both
// the React renderer (SeoPage.jsx) and the Node prerender script can import it.
// Content is grounded in MedXFlow's real capabilities (see products.data.js) - 
// no fabricated features, customers, stats or integrations.

export const SEO_PAGES = [
  {
    slug: "healthcare-rcm-automation",
    kind: "pillar",
    title: "Healthcare RCM Automation | MedXFlow",
    h1: "Healthcare Revenue Cycle Management Automation",
    eyebrow: "Revenue Cycle · Automation",
    description:
      "Healthcare RCM automation with AI agents - automate eligibility, prior authorization, coding, claims, denials, payment posting and patient collections across the revenue cycle. Book a free MedXFlow demo.",
    intro:
      "Healthcare revenue cycle management is a chain of repetitive, payer-facing tasks - and every manual handoff is a place where cash slows down or leaks out. MedXFlow automates that chain with AI agents, so each stage of the revenue cycle runs continuously with your team handling only the exceptions.",
    sections: [
      {
        h: "What is healthcare RCM automation?",
        p: [
          "RCM automation is the use of software to carry out revenue-cycle tasks that people otherwise do by hand - verifying eligibility, submitting authorizations, coding charges, scrubbing and submitting claims, posting payments, and working denials. Done well, automation doesn't replace your team; it removes the repetitive volume so staff focus on judgment calls and patients.",
          "MedXFlow connects these stages into one automated flow, from the first appointment to the final payment, and writes back into the systems you already run.",
        ],
      },
      {
        h: "Where automation fits across the revenue cycle",
        list: [
          "Patient access - pre-registration, scheduling and check-in with demographics and coverage captured up front.",
          "Eligibility & benefits verification - real-time checks that confirm active coverage before the visit.",
          "Prior authorization - detect what needs auth, submit it, and track status to approval.",
          "Charge capture & medical coding - accurate CPT/ICD coding with medical-necessity checks before the claim.",
          "Claims submission - clean, scrubbed 837 claims to every payer and clearinghouse.",
          "Payment posting - automated 835/ERA and EOB posting with line-level reconciliation.",
          "Denial management - categorize, prioritize and work denials by root cause, with appeals.",
          "Patient statements & collections - clear statements and gentle automated follow-up.",
        ],
      },
      {
        h: "Automation vs. traditional RPA",
        p: [
          "Older automation (RPA) follows brittle, hard-coded scripts that break when a portal changes. MedXFlow's AI agents adapt to the task - reading documentation, navigating payer systems, extracting and validating data, and escalating anything uncertain to staff. The result is automation that survives the messy reality of payer workflows.",
        ],
      },
      {
        h: "Human-in-the-loop by design",
        p: [
          "Every agent runs a reliable loop - receive, understand, process, validate, escalate, track - and hands exceptions to your team. Nothing is left unattended, and every action is documented, assigned and auditable.",
        ],
      },
    ],
    related: [
      { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm/" },
      { label: "Eligibility Verification", href: "/products/eligibility-verification/" },
      { label: "Prior Authorization", href: "/products/pre-authorization/" },
      { label: "Denial Management", href: "/products/denial-management/" },
      { label: "Claims Submission", href: "/products/claims-submission/" },
    ],
    faq: [
      { q: "What does healthcare RCM automation include?", a: "It spans the whole revenue cycle: eligibility and benefits verification, prior authorization, charge capture and coding, claims submission, payment posting, denial management, and patient statements and collections. MedXFlow automates these stages and connects them into one flow." },
      { q: "Will automation replace our billing staff?", a: "No. Automation absorbs the repetitive, high-volume work and routes exceptions to your team. Staff spend their time on judgment calls, not portal busywork, and every automated action is tracked and auditable." },
      { q: "Does it work with our existing systems?", a: "Yes - MedXFlow works alongside the practice management and EHR systems you already run, writing data back so your workflow stays intact rather than requiring a rip-and-replace." },
    ],
  },

  {
    slug: "ai-for-medical-billing-companies",
    kind: "audience",
    title: "AI Automation for Medical Billing Companies | MedXFlow",
    h1: "AI Automation for Medical Billing Companies",
    eyebrow: "For Medical Billing Companies",
    description:
      "MedXFlow gives medical billing companies AI agents that automate eligibility, prior authorization, coding, claims and denials across every client - scale volume without scaling headcount.",
    intro:
      "Medical billing companies live and die on throughput per employee. MedXFlow's AI agents take the repetitive, per-claim work off your team so you can take on more clients and more volume without hiring in lockstep.",
    sections: [
      {
        h: "Scale volume without scaling headcount",
        p: [
          "The repetitive work - eligibility checks, authorization submissions, claim scrubbing, denial triage - is exactly what AI agents do well. Automating it lets a billing company handle more accounts per biller and keep margins healthy as it grows.",
        ],
      },
      {
        h: "Consistent quality across every client",
        p: [
          "Agents apply the same rules every time, so quality doesn't swing with staffing or training. Medical-necessity checks and claim scrubbing catch errors before submission, and every action is documented for client-ready audit trails.",
        ],
      },
      {
        h: "Work denials at scale",
        p: [
          "Denials are where billing companies lose margin. MedXFlow triages denials by root cause, drafts appeals, and surfaces the upstream patterns so you can fix the source - across all your clients at once.",
        ],
      },
    ],
    related: [
      { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm/" },
      { label: "Healthcare RCM Automation", href: "/healthcare-rcm-automation" },
      { label: "Denial Management", href: "/products/denial-management/" },
      { label: "Managed Billing Services", href: "/products/managed-billing/" },
    ],
    faq: [
      { q: "Can MedXFlow work across multiple clients?", a: "Yes - the agents apply each client's rules and payers, so a billing company can automate the same workflows consistently across many accounts." },
      { q: "Does it replace our billers?", a: "No. It removes the repetitive per-claim work so your billers handle more accounts and focus on exceptions and client relationships." },
    ],
  },

  {
    slug: "ai-for-rcm-companies",
    kind: "audience",
    title: "AI Agents for RCM Companies | MedXFlow",
    h1: "AI Agents for RCM Companies",
    eyebrow: "For RCM Companies & MSOs",
    description:
      "MedXFlow gives RCM companies and MSOs AI agents that automate the revenue cycle end to end across every practice they manage - more throughput, fewer denials, cleaner audit trails.",
    intro:
      "RCM companies and MSOs manage the revenue cycle for many practices at once. MedXFlow's AI agents automate the repetitive work across all of them, so your team scales throughput and standardizes quality without adding headcount for every new account.",
    sections: [
      {
        h: "One automation layer across every practice",
        p: [
          "Instead of standing up manual processes per client, deploy AI agents that handle eligibility, authorization, coding, claims and denials across your book of business - each running with that practice's payers and rules.",
        ],
      },
      {
        h: "Standardized quality and audit trails",
        p: [
          "Agents apply rules consistently and document every action, so quality doesn't depend on which staffer touched the account, and you always have an audit trail for clients.",
        ],
      },
      {
        h: "Lower cost to serve",
        p: [
          "By absorbing repetitive volume, automation lowers your cost to serve each practice and frees your specialists for the complex, high-value work that keeps clients happy.",
        ],
      },
    ],
    related: [
      { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm/" },
      { label: "Healthcare RCM Automation", href: "/healthcare-rcm-automation" },
      { label: "Reporting & Analytics", href: "/products/reporting-analytics/" },
      { label: "Denial Management", href: "/products/denial-management/" },
    ],
    faq: [
      { q: "How does MedXFlow help an RCM company or MSO?", a: "It provides one AI automation layer across every practice you manage - automating eligibility, authorization, coding, claims and denials, with consistent quality and audit trails, so you scale throughput without scaling headcount." },
      { q: "Can each practice keep its own payers and rules?", a: "Yes. The agents run with each practice's specific payers, plans and business rules." },
    ],
  },

  {
    slug: "ai-for-physician-practices",
    kind: "audience",
    title: "AI Revenue Cycle Automation for Physician Practices | MedXFlow",
    h1: "AI Revenue Cycle Automation for Physician Practices",
    eyebrow: "For Physician Practices",
    description:
      "MedXFlow gives physician practices AI agents that automate eligibility, prior authorization, coding, claims and denials - so a small billing team keeps the revenue cycle moving without falling behind.",
    intro:
      "Physician practices rarely have a big billing department - often it's a handful of people doing everything from the front desk to denials. MedXFlow's AI agents take the repetitive revenue-cycle work off that small team, so the practice gets paid faster without needing to hire.",
    sections: [
      {
        h: "Built for lean billing teams",
        p: [
          "When one or two people run the revenue cycle, the repetitive work - eligibility checks, authorizations, claim follow-up, denials - is what eats the day and causes backlogs. Automating it lets a small team stay current and focus on the cases that actually need a person.",
        ],
      },
      {
        h: "Fewer denials, faster payment",
        p: [
          "Catching eligibility and coding issues before the claim goes out means fewer denials and less rework - which matters most when there's no one to spare for chasing claims. Cleaner claims and automated follow-up shorten the time from visit to payment.",
        ],
      },
      {
        h: "Works with the systems you already run",
        p: [
          "MedXFlow writes back into your existing practice management and EHR systems, so there's no rip-and-replace and no new workflow for staff to learn - the agents simply handle the volume in the background.",
        ],
      },
    ],
    related: [
      { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm/" },
      { label: "Healthcare RCM Automation", href: "/healthcare-rcm-automation" },
      { label: "Eligibility Verification", href: "/products/eligibility-verification/" },
      { label: "Managed Billing Services", href: "/products/managed-billing/" },
    ],
    faq: [
      { q: "Is MedXFlow only for large groups?", a: "No - it's designed to help lean billing teams at small and mid-size physician practices keep the revenue cycle current without adding headcount." },
      { q: "Do we need to replace our EHR?", a: "No. MedXFlow works alongside your existing EHR and practice management system, writing data back into them." },
    ],
  },
];

export const seoPage = (slug) => SEO_PAGES.find((p) => p.slug === slug);

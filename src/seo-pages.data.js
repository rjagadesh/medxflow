// Data-driven SEO landing pages (pillar + audience). Plain JS (no JSX) so both
// the React renderer (SeoPage.jsx) and the Node prerender script can import it.
// Content is grounded in MedXFlow's real capabilities (see products.data.js) - 
// no fabricated features, customers, stats or integrations.

export const SEO_PAGES = [
  {
    slug: "medical-billing-services-usa",
    kind: "pillar",
    title: "Medical Billing & RCM Services Across the US | MedXFlow",
    h1: "Medical Billing and RCM Services Across the United States",
    eyebrow: "Serving the United States",
    description: "AI-driven medical billing and revenue cycle management for US practices in all 50 states - eligibility, prior auth, coding, claims and denials, remote-first.",
    intro: "MedXFlow is a remote-first RCM automation platform serving medical practices, billing companies and RCM teams across the United States. Because the work is done by AI agents that connect to your systems and payers, we serve practices in any state without a local office.",
    sections: [
      { h: "Nationwide, remote-first RCM", p: [
        "MedXFlow's AI agents run the revenue cycle end to end - eligibility, prior authorization, coding, claims, denials, payment posting and collections - and write back into the systems you already use. Nothing about that depends on geography, so a practice in California gets the same automation as one in New York or Texas." ] },
      { h: "What we automate", list: [
        "Eligibility and benefits verification before every visit.",
        "Prior authorization detection, submission and tracking.",
        "Charge capture, coding support and claim scrubbing.",
        "Claims submission to every payer and clearinghouse.",
        "Payment posting, denial management and patient collections." ] },
      { h: "States we serve", p: [
        "We work with practices in all 50 states. A few of our focus markets have their own pages: Texas, California, Florida and New York. Wherever you are, the platform adapts to your payer mix and state Medicaid rules." ] },
    ],
    related: [
      { label: "RCM services in Texas", href: "/medical-billing-services-texas/" },
      { label: "RCM services in California", href: "/medical-billing-services-california/" },
      { label: "RCM services in Florida", href: "/medical-billing-services-florida/" },
      { label: "RCM services in New York", href: "/medical-billing-services-new-york/" },
      { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm/" },
    ],
    faq: [
      { q: "Does MedXFlow serve practices nationwide?", a: "Yes. MedXFlow is remote-first and serves medical practices, billing companies and RCM teams in all 50 states, automating the revenue cycle and writing back into your existing systems, with no local office required." },
      { q: "Do you handle state Medicaid rules?", a: "Yes. The platform adapts to your payer mix, including state Medicaid and managed-care plans, and the workflows are tuned to the payers you actually bill." },
    ],
  },
  {
    slug: "medical-billing-services-california",
    kind: "audience",
    title: "Medical Billing & RCM Services in California | MedXFlow",
    h1: "Medical Billing and RCM Services for California Practices",
    eyebrow: "Serving California",
    description: "AI medical billing and revenue cycle automation for California practices - Medi-Cal and managed care, eligibility, prior auth, coding, claims and denials, remote-first.",
    intro: "MedXFlow brings AI revenue cycle automation to California medical practices, tuned to the state's Medi-Cal and managed-care landscape, so eligibility, authorization, claims and denials run automatically.",
    sections: [
      { h: "Built for California's payer mix", p: [
        "California practices juggle Medi-Cal and its managed-care plans alongside a dense commercial market. MedXFlow verifies eligibility across those payers, detects and submits prior authorizations, and scrubs claims to each plan's rules before they go out." ] },
      { h: "Why California practices automate", p: [
        "California's high labor costs make manual RCM expensive, so automating the repetitive payer-facing work delivers an especially strong return. Your team stays on exceptions while the agents handle the volume." ] },
    ],
    related: [
      { label: "RCM services across the US", href: "/medical-billing-services-usa/" },
      { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm/" },
      { label: "ROI calculator", href: "/roi-calculator/" },
    ],
    faq: [
      { q: "Does MedXFlow work with Medi-Cal?", a: "Yes. MedXFlow verifies eligibility and bills across California payers including Medi-Cal and its managed-care plans, with workflows tuned to each plan's requirements." },
    ],
  },
  {
    slug: "medical-billing-services-florida",
    kind: "audience",
    title: "Medical Billing & RCM Services in Florida | MedXFlow",
    h1: "Medical Billing and RCM Services for Florida Practices",
    eyebrow: "Serving Florida",
    description: "AI medical billing and revenue cycle automation for Florida practices - Medicaid managed care and Medicare Advantage, eligibility, prior auth, claims and denials.",
    intro: "MedXFlow brings AI revenue cycle automation to Florida medical practices, tuned to the state's Medicaid managed-care and large Medicare Advantage population, so the payer-facing work runs automatically.",
    sections: [
      { h: "Built for Florida's payer mix", p: [
        "Florida practices see heavy Medicaid managed-care and one of the country's largest Medicare Advantage populations. MedXFlow verifies eligibility across those plans, secures prior authorizations, and works denials by root cause so senior-heavy panels get billed cleanly." ] },
      { h: "Handling seasonal volume", p: [
        "Seasonal patient swings strain front-desk and billing capacity. Because MedXFlow's agents scale with volume automatically, peaks are absorbed without adding staff." ] },
    ],
    related: [
      { label: "RCM services across the US", href: "/medical-billing-services-usa/" },
      { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm/" },
      { label: "ROI calculator", href: "/roi-calculator/" },
    ],
    faq: [
      { q: "Does MedXFlow handle Medicare Advantage in Florida?", a: "Yes. MedXFlow verifies eligibility and bills across Florida payers including Medicaid managed-care and Medicare Advantage plans, with prior authorization and denial workflows tuned to them." },
    ],
  },
  {
    slug: "medical-billing-services-new-york",
    kind: "audience",
    title: "Medical Billing & RCM Services in New York | MedXFlow",
    h1: "Medical Billing and RCM Services for New York Practices",
    eyebrow: "Serving New York",
    description: "AI medical billing and revenue cycle automation for New York practices - NY Medicaid and a complex commercial payer mix, eligibility, prior auth, claims and denials.",
    intro: "MedXFlow brings AI revenue cycle automation to New York medical practices, tuned to New York Medicaid and the state's complex commercial payer mix, so eligibility, authorization, claims and denials run automatically.",
    sections: [
      { h: "Built for New York's payer mix", p: [
        "New York practices navigate NY Medicaid and its managed-care plans alongside a dense, complex commercial market. MedXFlow verifies eligibility across those payers, submits and tracks authorizations, and scrubs claims to each plan's rules before submission." ] },
      { h: "Why New York practices automate", p: [
        "With some of the highest labor costs in the country, New York practices get an outsized return from automating manual RCM. The agents carry the volume; your team handles the judgment calls." ] },
    ],
    related: [
      { label: "RCM services across the US", href: "/medical-billing-services-usa/" },
      { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm/" },
      { label: "ROI calculator", href: "/roi-calculator/" },
    ],
    faq: [
      { q: "Does MedXFlow work with New York Medicaid?", a: "Yes. MedXFlow verifies eligibility and bills across New York payers including NY Medicaid and its managed-care plans, with workflows tuned to each plan's requirements." },
    ],
  },
  {
    slug: "ai-rcm-vendors-comparison",
    kind: "pillar",
    title: "AI RCM Vendors Compared: Capabilities, Pricing & Fit | MedXFlow",
    h1: "AI RCM Vendors Compared: Capabilities, Pricing and Fit",
    eyebrow: "Comparison · AI RCM Vendors",
    description: "How to compare AI revenue cycle vendors in 2026 - the categories, the capabilities that matter, pricing models, and how to find the right fit for your practice or billing company.",
    intro: "The AI RCM market moves fast and the marketing sounds identical from vendor to vendor. This comparison gives you a durable framework - the categories of vendors and the capabilities that actually separate them - so you can evaluate any of them, MedXFlow included. Specific vendor offerings change often, so verify current details directly before you decide.",
    sections: [
      { h: "The categories to compare", list: [
        "Clearinghouse-based platforms (for example Waystar, Availity) - strongest at claims transport, eligibility and remittance.",
        "AI-native automation vendors (for example AKASA, MedXFlow) - agents that complete revenue-cycle tasks end to end.",
        "Prior-auth and point specialists (for example Infinx) - deep in one workflow, often blending AI with specialists.",
        "Outsourced billing companies - people-led, usually priced as a percentage of collections.",
      ] },
      { h: "Capabilities that actually differentiate", list: [
        "How much of each workflow runs autonomously versus assists a human.",
        "Whether the vendor writes back into your EHR/PMS or only reads.",
        "How exceptions are surfaced and escalated to your team.",
        "Security and governance: HIPAA, a signed BAA, and a full audit trail.",
        "Pricing model: per outcome and flat fee are predictable; percentage of collections scales with revenue.",
      ] },
      { h: "Where MedXFlow fits", p: [
        "MedXFlow is AI-native: connected agents across eligibility, prior authorization, coding, claims, denials, posting and collections that write back into your systems and escalate exceptions, priced for finished work. It suits teams that want leverage without handing the revenue cycle to a black box or a percentage-of-collections contract.",
      ] },
    ],
    related: [
      { label: "Best RCM automation companies", href: "/best-rcm-automation-companies/" },
      { label: "How much does RCM automation cost", href: "/blog/how-much-does-rcm-automation-cost/" },
      { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm/" },
    ],
    faq: [
      { q: "How do I compare AI RCM vendors?", a: "Compare them on how much of each workflow runs autonomously, whether they write back into your EHR, how exceptions escalate, their security and BAA, and their pricing model. Normalize pricing to a cost per completed unit of work." },
    ],
  },
  {
    slug: "waystar-alternatives",
    kind: "pillar",
    title: "Waystar Alternatives: What to Evaluate in 2026 | MedXFlow",
    h1: "Waystar Alternatives: What to Evaluate in 2026",
    eyebrow: "Comparison · Alternatives",
    description: "Looking for a Waystar alternative? How to evaluate revenue cycle platforms in 2026, what AI-native automation adds beyond a clearinghouse, and where MedXFlow fits. Verify current offerings before deciding.",
    intro: "Waystar is a large, established revenue cycle technology platform known for claims, payments and denials at scale. Teams look for alternatives for reasons like pricing, the level of autonomous automation, or fit with a specific workflow. Here is how to evaluate the options - competitor details reflect general positioning and should be confirmed against each vendor's current offering.",
    sections: [
      { h: "Why teams evaluate alternatives", list: [
        "They want more autonomous, end-to-end task completion, not just claim transport.",
        "They want write-back into their EHR/PMS rather than a separate workflow.",
        "They want predictable, outcome-based pricing.",
        "They want a lighter footprint suited to a smaller practice or billing company.",
      ] },
      { h: "What to look for in an alternative", p: [
        "Judge any alternative on the same criteria: which workflows an agent completes end to end, how exceptions are handled, whether it writes back into your systems, its security and BAA, and how it is priced. A clearinghouse-strong platform and an AI-native automation vendor solve different problems, so match the tool to where your revenue actually leaks.",
      ] },
      { h: "How MedXFlow compares", p: [
        "MedXFlow is AI-native: connected agents that run eligibility, prior authorization, coding, claims, denials, posting and collections end to end, write back into your systems, escalate exceptions, and are priced for finished work rather than a percentage of collections. It is a fit when you want autonomous workflow completion with your team on exceptions.",
      ] },
    ],
    related: [
      { label: "AI RCM vendors compared", href: "/ai-rcm-vendors-comparison/" },
      { label: "Best RCM automation companies", href: "/best-rcm-automation-companies/" },
      { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm/" },
    ],
    faq: [
      { q: "What is a good alternative to Waystar?", a: "It depends on your need. If you want autonomous, end-to-end task completion with EHR write-back and outcome-based pricing, an AI-native vendor like MedXFlow fits. If you mainly need claims and remittance transport, other clearinghouse platforms compete more directly. Evaluate on scope, integration, security and pricing." },
    ],
  },
  {
    slug: "akasa-alternatives",
    kind: "pillar",
    title: "AKASA Alternatives for AI-Driven Revenue Cycle | MedXFlow",
    h1: "AKASA Alternatives for AI-Driven Revenue Cycle",
    eyebrow: "Comparison · Alternatives",
    description: "Comparing AKASA alternatives for AI-driven revenue cycle automation - what to evaluate, how AI-native vendors differ, and where MedXFlow fits. Verify current offerings before deciding.",
    intro: "AKASA is known for applying generative AI to healthcare revenue cycle operations, often with larger health systems. Teams comparing alternatives usually want a fit for their size, systems or budget. Here is how to evaluate them - vendor details reflect general positioning and should be confirmed directly.",
    sections: [
      { h: "What to evaluate", list: [
        "Which revenue-cycle workflows the AI completes end to end.",
        "Fit for your organization size - practice and billing company versus large health system.",
        "EHR/PMS write-back and integration effort.",
        "Security, BAA and auditability.",
        "Pricing model and time to go live.",
      ] },
      { h: "How MedXFlow compares", p: [
        "MedXFlow is an AI-native vendor built for practices, billing companies and RCM teams: connected agents across the full cycle that write back into your systems, escalate exceptions, and are priced for finished work. If you want AI-driven RCM without a heavyweight enterprise rollout, that is the fit.",
      ] },
    ],
    related: [
      { label: "AI RCM vendors compared", href: "/ai-rcm-vendors-comparison/" },
      { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm/" },
      { label: "How much does RCM automation cost", href: "/blog/how-much-does-rcm-automation-cost/" },
    ],
    faq: [
      { q: "What is an alternative to AKASA?", a: "MedXFlow is an AI-native alternative built for practices, billing companies and RCM teams, with connected agents across the revenue cycle, EHR write-back and outcome-based pricing. Evaluate any alternative on workflow scope, fit for your size, integration, security and pricing." },
    ],
  },
  {
    slug: "infinx-alternatives",
    kind: "pillar",
    title: "Infinx Alternatives: Prior Auth & RCM Automation | MedXFlow",
    h1: "Infinx Alternatives: Comparing Prior Auth and RCM Automation",
    eyebrow: "Comparison · Alternatives",
    description: "Comparing Infinx alternatives for prior authorization and revenue cycle automation - what to evaluate and where MedXFlow's end-to-end agents fit. Verify current offerings before deciding.",
    intro: "Infinx is known for prior authorization and revenue cycle solutions that combine automation with specialists. Teams comparing alternatives often want broader end-to-end automation or a different pricing fit. Here is how to evaluate them - details reflect general positioning and should be confirmed directly.",
    sections: [
      { h: "What to evaluate", list: [
        "Whether the vendor covers only prior auth or the full revenue cycle end to end.",
        "How much runs autonomously versus specialist-assisted.",
        "EHR/PMS write-back and payer-portal coverage where no EDI exists.",
        "Security, BAA and audit trail.",
        "Pricing model and go-live time.",
      ] },
      { h: "How MedXFlow compares", p: [
        "MedXFlow automates prior authorization as part of a connected set of agents across the whole revenue cycle - detecting what needs auth, submitting with documentation, working payer portals where there is no 278, and tracking to a decision - then running claims, posting and denials behind it, priced for finished work.",
      ] },
    ],
    related: [
      { label: "Pre-Authorization", href: "/products/pre-authorization/" },
      { label: "X12 278 explained", href: "/blog/x12-278-prior-authorization-explained/" },
      { label: "AI RCM vendors compared", href: "/ai-rcm-vendors-comparison/" },
    ],
    faq: [
      { q: "What is an alternative to Infinx for prior authorization?", a: "MedXFlow automates prior authorization as part of end-to-end revenue cycle agents, combining the X12 278 where payers support it with payer-portal automation where they do not, and covering claims, posting and denials too. Evaluate scope, autonomy, integration, security and pricing." },
    ],
  },
  {
    slug: "availity-alternatives",
    kind: "pillar",
    title: "Availity Alternatives for Eligibility & Prior Auth | MedXFlow",
    h1: "Availity Alternatives for Eligibility and Prior Auth",
    eyebrow: "Comparison · Alternatives",
    description: "Comparing Availity alternatives for eligibility, claims and prior authorization - what a health information network does, where automation adds value, and how MedXFlow fits. Verify current offerings.",
    intro: "Availity is one of the largest health information networks, widely used for eligibility, claims and authorization service reviews. An \"alternative\" often is not another network but automation layered on top of connectivity. Here is how to think about it - details reflect general positioning and should be confirmed directly.",
    sections: [
      { h: "Network versus automation", p: [
        "A network like Availity provides connectivity to payers. Automation decides what to check, submits it, reads the response and acts on it. Many teams do not need to replace their network so much as automate the work on top of it - and to cover the payer portals a network does not reach.",
      ] },
      { h: "How MedXFlow compares", p: [
        "MedXFlow uses network connectivity where it exists and AI agents to handle the rest: verifying eligibility, submitting and tracking authorizations, and working payer portals where there is no transaction - then carrying the results through claims, posting and denials, with write-back into your systems.",
      ] },
    ],
    related: [
      { label: "Availity API integration guide", href: "/availity-api-integration-guide/" },
      { label: "Eligibility Verification", href: "/products/eligibility-verification/" },
      { label: "Pre-Authorization", href: "/products/pre-authorization/" },
    ],
    faq: [
      { q: "What is an alternative to Availity?", a: "Availity is a connectivity network; the more useful comparison is automation layered on top of it. MedXFlow uses network connections plus AI agents to verify eligibility, submit and track authorizations, and cover payer portals where no transaction exists, then run claims and denials." },
    ],
  },
  {
    slug: "healthcare-automation-uae",
    kind: "audience",
    title: "Healthcare Automation for UAE Providers | MedXFlow",
    h1: "Healthcare RCM Automation for UAE Providers",
    eyebrow: "For UAE Providers",
    description: "AI revenue cycle automation for UAE healthcare providers - eligibility with UAE payers and TPAs, prior authorization service reviews, and claim submission via Shafafiya (DOH) and eClaimLink (DHA).",
    intro: "MedXFlow brings AI revenue cycle automation to UAE healthcare providers, built for the region's payers, TPAs and claim platforms - so eligibility, authorization and claims run automatically against Shafafiya, eClaimLink and the major TPAs.",
    sections: [
      { h: "Built for the UAE claims landscape", list: [
        "Eligibility and benefits with UAE payers and TPAs such as Daman, NAS, Sukoon, Mednet, Nextcare and Neuron.",
        "Prior authorization and service reviews aligned to payer requirements.",
        "Claim submission and resubmission via Shafafiya (DOH, Abu Dhabi) and eClaimLink (DHA, Dubai).",
        "Remittance reconciliation and denial management for UAE payers.",
      ] },
      { h: "The same agents, tuned to the region", p: [
        "MedXFlow's AI agents run the revenue cycle end to end and escalate exceptions to your team. For UAE providers, the workflows and payer rules are tuned to the Emirates' regulatory and TPA landscape rather than US payers.",
      ] },
    ],
    related: [
      { label: "Insurance eligibility verification for UAE payers", href: "/insurance-eligibility-verification-uae/" },
      { label: "Shafafiya and DOH claim submission automation", href: "/shafafiya-claim-submission-automation/" },
      { label: "Medical billing software for Dubai clinics", href: "/medical-billing-software-dubai/" },
    ],
    faq: [
      { q: "Does MedXFlow support UAE healthcare providers?", a: "MedXFlow's automation is built to work with the UAE claims landscape - eligibility with UAE payers and TPAs, authorization service reviews, and claim submission via Shafafiya (DOH) and eClaimLink (DHA). Contact us to scope your setup." },
    ],
  },
  {
    slug: "medical-billing-software-dubai",
    kind: "audience",
    title: "Medical Billing & RCM Software for Dubai Clinics | MedXFlow",
    h1: "Medical Billing and RCM Software for Dubai Clinics",
    eyebrow: "For Dubai Clinics",
    description: "AI-driven medical billing and RCM for Dubai clinics - eligibility with UAE TPAs, DHA prior authorization, and eClaimLink claim submission and resubmission, automated end to end.",
    intro: "MedXFlow provides AI-driven medical billing and revenue cycle automation for Dubai clinics, aligned to DHA requirements and the eClaimLink platform, so claims go out clean and denials are worked automatically.",
    sections: [
      { h: "For the DHA and eClaimLink workflow", list: [
        "Eligibility with UAE TPAs and payers before the visit.",
        "DHA prior authorization and service reviews.",
        "eClaimLink (DHPO) claim submission, remittance and resubmission handling.",
        "Denial management and reconciliation tuned to Dubai payers.",
      ] },
      { h: "Automation with a human in the loop", p: [
        "MedXFlow's agents carry the repetitive payer-facing work and escalate exceptions to your team, with every action documented and auditable - the same model, tuned to Dubai's regulatory environment.",
      ] },
    ],
    related: [
      { label: "Healthcare automation for UAE providers", href: "/healthcare-automation-uae/" },
      { label: "Insurance eligibility verification for UAE payers", href: "/insurance-eligibility-verification-uae/" },
      { label: "Shafafiya and DOH claim submission automation", href: "/shafafiya-claim-submission-automation/" },
    ],
    faq: [
      { q: "Does MedXFlow work with DHA and eClaimLink?", a: "MedXFlow's automation is built to align with the DHA workflow and the eClaimLink (DHPO) platform for claim submission, remittance and resubmission, alongside eligibility with UAE TPAs. Contact us to scope your clinic's setup." },
    ],
  },
  {
    slug: "insurance-eligibility-verification-uae",
    kind: "audience",
    title: "Insurance Eligibility Verification for UAE Payers | MedXFlow",
    h1: "Insurance Eligibility Verification for UAE Payers",
    eyebrow: "For UAE Providers",
    description: "Automated insurance eligibility verification for UAE payers and TPAs - Daman, NAS, Sukoon, Mednet, Nextcare and more - so coverage and benefits are confirmed before every visit.",
    intro: "MedXFlow automates insurance eligibility verification for UAE providers across the major payers and TPAs, so coverage, benefits and patient responsibility are confirmed before care rather than discovered at the claim.",
    sections: [
      { h: "Across UAE payers and TPAs", p: [
        "MedXFlow verifies eligibility and benefits with UAE payers and third-party administrators such as Daman, NAS, Sukoon, Mednet, Nextcare and Neuron, surfacing active coverage, co-payments and any authorization requirements ahead of the visit.",
      ] },
      { h: "Why front-end verification matters", p: [
        "As in any market, most claim problems start with coverage. Verifying eligibility up front for UAE payers prevents rejected and resubmitted claims later, and feeds the authorization and claims steps automatically.",
      ] },
    ],
    related: [
      { label: "Healthcare automation for UAE providers", href: "/healthcare-automation-uae/" },
      { label: "Shafafiya and DOH claim submission automation", href: "/shafafiya-claim-submission-automation/" },
      { label: "Eligibility Verification", href: "/products/eligibility-verification/" },
    ],
    faq: [
      { q: "Which UAE payers does eligibility verification cover?", a: "MedXFlow verifies eligibility with the major UAE payers and TPAs, including Daman, NAS, Sukoon, Mednet, Nextcare and Neuron, confirming coverage, co-payment and authorization requirements before the visit." },
    ],
  },
  {
    slug: "shafafiya-claim-submission-automation",
    kind: "audience",
    title: "Shafafiya & DOH Claim Submission Automation | MedXFlow",
    h1: "Shafafiya and DOH Claim Submission Automation",
    eyebrow: "For Abu Dhabi Providers",
    description: "Automate claim submission for Abu Dhabi providers - Shafafiya (DOH) eClaims submission, remittance and resubmission, with eligibility and authorization handled end to end by AI agents.",
    intro: "MedXFlow automates claim submission for Abu Dhabi healthcare providers on the Shafafiya (DOH) platform, carrying claims, remittances and resubmissions through the cycle with eligibility and authorization handled up front.",
    sections: [
      { h: "For the Shafafiya (DOH) workflow", list: [
        "eClaims submission to Shafafiya (Department of Health, Abu Dhabi).",
        "Remittance advice reconciliation and posting.",
        "Denial and resubmission handling within DOH timelines.",
        "Eligibility with UAE TPAs and prior authorization ahead of submission.",
      ] },
      { h: "End to end, with exceptions to your team", p: [
        "MedXFlow's agents run the Abu Dhabi revenue cycle end to end - verify, authorize, submit, reconcile and rework - and escalate anything uncertain to your staff, with a full audit trail.",
      ] },
    ],
    related: [
      { label: "Healthcare automation for UAE providers", href: "/healthcare-automation-uae/" },
      { label: "Insurance eligibility verification for UAE payers", href: "/insurance-eligibility-verification-uae/" },
      { label: "Medical billing software for Dubai clinics", href: "/medical-billing-software-dubai/" },
    ],
    faq: [
      { q: "Does MedXFlow automate Shafafiya claim submission?", a: "MedXFlow's automation is built to submit eClaims to Shafafiya (DOH, Abu Dhabi), reconcile remittances and handle resubmissions, with eligibility and authorization handled up front. Contact us to scope your setup." },
    ],
  },
  {
    slug: "athenahealth-billing-api-integration",
    kind: "pillar",
    title: "athenahealth Billing Integration Guide | MedXFlow",
    h1: "athenahealth Billing API Integration for Automated RCM",
    eyebrow: "Integrations · athenahealth",
    description: "How MedXFlow integrates with athenahealth to automate the revenue cycle - reading appointments and coverage, and writing charges, claims and payments back so your athenahealth workflow stays intact.",
    intro: "MedXFlow works alongside athenahealth rather than replacing it. AI agents read what they need and write results back into athenahealth, so eligibility, prior auth, claims and posting run automatically without your team changing how they work.",
    sections: [
      { h: "What MedXFlow reads and writes", list: [
        "Reads scheduled appointments and patient coverage to trigger eligibility and prior auth before the visit.",
        "Writes verified benefits, authorization numbers and clean charges back into athenahealth.",
        "Posts payments and adjustments with line-level reconciliation.",
        "Routes denials and exceptions to your staff with the context attached.",
      ] },
      { h: "Why write-back matters", p: [
        "Automation that only reads data leaves your team re-keying results. MedXFlow writes back into athenahealth so the record stays the single source of truth and staff never copy between screens. Where a direct connection is not available, a fallback mode keeps the work moving until formal integration is in place.",
      ] },
      { h: "What you get", p: [
        "Fewer eligibility and authorization denials, faster clean-claim submission, and reconciled posting, all inside the athenahealth environment your team already knows. No rip-and-replace, and every automated action is documented and auditable.",
      ] },
    ],
    related: [
      { label: "Eligibility Verification", href: "/products/eligibility-verification/" },
      { label: "Claims Submission", href: "/products/claims-submission/" },
      { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm/" },
    ],
    faq: [
      { q: "Does MedXFlow integrate with athenahealth?", a: "Yes. MedXFlow reads appointments and coverage from athenahealth and writes verified benefits, authorizations, clean charges and posted payments back into it, so your existing workflow stays intact." },
      { q: "Do we have to replace athenahealth?", a: "No. MedXFlow works alongside athenahealth and writes data back, rather than replacing it. There is a fallback mode that works even before a formal integration is complete." },
    ],
  },
  {
    slug: "eclinicalworks-billing-integration",
    kind: "pillar",
    title: "eClinicalWorks Billing Integration | MedXFlow",
    h1: "eClinicalWorks Billing Integration for Automated RCM",
    eyebrow: "Integrations · eClinicalWorks",
    description: "Automate the revenue cycle on eClinicalWorks with MedXFlow - eligibility, prior authorization, claims and payment posting, written back into eCW so your team keeps one source of truth.",
    intro: "MedXFlow automates the revenue cycle for practices running eClinicalWorks, reading the data it needs and writing charges, claims and payments back into eCW so nothing has to be re-keyed.",
    sections: [
      { h: "How the integration works", list: [
        "Triggers eligibility and prior authorization from scheduled eCW appointments.",
        "Writes verified coverage, authorization numbers and scrubbed charges back into eClinicalWorks.",
        "Submits clean claims and posts 835/ERA remittances with reconciliation.",
        "Escalates denials and exceptions to staff inside their normal queue.",
      ] },
      { h: "Built to fit your workflow", p: [
        "Your team keeps working in eClinicalWorks. MedXFlow removes the repetitive payer-facing work behind the scenes and writes results back, so the record stays accurate and staff focus on exceptions and patients.",
      ] },
    ],
    related: [
      { label: "Eligibility Verification", href: "/products/eligibility-verification/" },
      { label: "Denial Management", href: "/products/denial-management/" },
      { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm/" },
    ],
    faq: [
      { q: "Does MedXFlow work with eClinicalWorks?", a: "Yes. MedXFlow automates eligibility, prior authorization, claims and payment posting for eClinicalWorks practices and writes results back into eCW so your workflow stays intact." },
    ],
  },
  {
    slug: "epic-rcm-automation-integration",
    kind: "pillar",
    title: "Epic RCM Automation Integration | MedXFlow",
    h1: "Integrating RCM Automation with Epic",
    eyebrow: "Integrations · Epic",
    description: "Bring AI-driven revenue cycle automation to Epic - eligibility, prior authorization, claims and posting that write back into Epic, so large groups automate the volume without leaving their system of record.",
    intro: "For organizations on Epic, MedXFlow adds AI automation across the revenue cycle while keeping Epic as the source of truth. Agents read the data they need and write results back, so the volume gets automated without a parallel system.",
    sections: [
      { h: "Where automation fits with Epic", list: [
        "Eligibility and benefits verification triggered from Epic scheduling.",
        "Prior authorization detection, submission and status tracking.",
        "Claim scrubbing and submission, with results written back to Epic.",
        "Payment posting and denial routing with full audit trails.",
      ] },
      { h: "Enterprise-ready by design", p: [
        "Large groups need automation that respects governance. MedXFlow keeps a human in the loop for exceptions, documents every action, and writes back into Epic so your workflows, security and reporting stay consistent.",
      ] },
    ],
    related: [
      { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm/" },
      { label: "Denial Management", href: "/products/denial-management/" },
      { label: "Trust & Security", href: "/trust/" },
    ],
    faq: [
      { q: "Can MedXFlow automate RCM on Epic?", a: "Yes. MedXFlow layers AI automation across eligibility, prior authorization, claims and posting while keeping Epic as the system of record, writing results back and keeping a human in the loop for exceptions." },
    ],
  },
  {
    slug: "clearinghouse-api-integration",
    kind: "pillar",
    title: "Clearinghouse API Integration for RCM | MedXFlow",
    h1: "Clearinghouse API Integration: Choosing and Connecting",
    eyebrow: "Integrations · Clearinghouse",
    description: "How clearinghouse API integration works in an automated revenue cycle - claim submission (837), remittance (835), eligibility (270/271) and status (276/277) across payers and clearinghouses.",
    intro: "A clearinghouse is the hub between your practice and payers. MedXFlow connects to clearinghouses to submit claims, pull remittances and check status automatically, across your full payer mix.",
    sections: [
      { h: "What the clearinghouse connection carries", list: [
        "837 claim submission to every payer and clearinghouse, with paper fallback where required.",
        "835/ERA remittance retrieval for automated payment posting.",
        "270/271 eligibility checks and 276/277 claim-status polling.",
        "999 and 277CA acknowledgement reconciliation so no claim silently disappears.",
      ] },
      { h: "Choosing and connecting", p: [
        "The right clearinghouse depends on your payer mix, EDI support and reporting needs. MedXFlow works across major clearinghouses and reconciles acknowledgements so front-end rejections are caught and corrected automatically rather than discovered weeks later.",
      ] },
    ],
    related: [
      { label: "Claims Submission", href: "/products/claims-submission/" },
      { label: "Payment Posting", href: "/products/payment-posting/" },
      { label: "How to read an 835 file", href: "/blog/how-to-read-an-835-file/" },
    ],
    faq: [
      { q: "What does a clearinghouse API do in RCM?", a: "It carries the EDI transactions between your practice and payers: 837 claims out, 835 remittances back, 270/271 eligibility and 276/277 status. MedXFlow connects to clearinghouses to run these automatically and reconcile acknowledgements." },
    ],
  },
  {
    slug: "availity-api-integration-guide",
    kind: "pillar",
    title: "Availity API Integration Guide | MedXFlow",
    h1: "Availity API Integration: Eligibility, Service Reviews and Auth",
    eyebrow: "Integrations · Availity",
    description: "A practical guide to integrating with Availity for automated eligibility, coverage and prior-authorization service reviews - and how MedXFlow uses it inside end-to-end RCM automation.",
    intro: "Availity is one of the largest health information networks, widely used for eligibility, coverage and authorization service reviews. MedXFlow uses connections like Availity to automate the front end of the revenue cycle.",
    sections: [
      { h: "What it powers", list: [
        "Real-time eligibility and benefits (270/271) across many payers from one connection.",
        "Coverage and service reviews used for prior authorization workflows.",
        "Claim status checks to keep follow-up moving.",
      ] },
      { h: "Where it fits, and where it does not", p: [
        "Network connections like Availity cover a lot of payers, but not every payer or every service supports every transaction, and some authorizations still route through payer portals. MedXFlow uses the network where it works and AI agents to handle the payer-portal exceptions where it does not, so coverage is complete.",
      ] },
    ],
    related: [
      { label: "Eligibility Verification", href: "/products/eligibility-verification/" },
      { label: "Pre-Authorization", href: "/products/pre-authorization/" },
      { label: "X12 278 explained", href: "/blog/x12-278-prior-authorization-explained/" },
    ],
    faq: [
      { q: "What is Availity used for in RCM?", a: "Availity is a health information network used for real-time eligibility and benefits, coverage and authorization service reviews, and claim status across many payers. MedXFlow uses connections like it to automate the front end of the revenue cycle." },
    ],
  },
  {
    slug: "fhir-revenue-cycle",
    kind: "pillar",
    title: "FHIR in the Revenue Cycle | MedXFlow",
    h1: "Using FHIR APIs in the Revenue Cycle: Where It Helps Today",
    eyebrow: "Integrations · FHIR",
    description: "Where FHIR APIs help the revenue cycle today - coverage, claims and prior authorization - and where older EDI and payer portals still do the work. A practical, forward-looking view.",
    intro: "FHIR is the modern, web-API standard for healthcare data, and it is starting to touch the revenue cycle through coverage, claim and prior-authorization resources. Here is where it helps today and where EDI and portals still rule.",
    sections: [
      { h: "What FHIR brings to RCM", p: [
        "FHIR exposes discrete resources - Patient, Coverage, Claim, and prior-authorization resources under the Da Vinci work - through clean REST APIs. That makes it far easier for automation to read coverage and submit authorizations than screen-scraping a portal.",
      ] },
      { h: "Where EDI and portals still win", p: [
        "In practice, 270/271 eligibility and 837/835 claims run on X12 EDI everywhere, and many authorizations still route through payer portals. FHIR adoption is growing, driven by regulation, but it coexists with EDI rather than replacing it. Reliable RCM automation uses whichever channel a given payer actually supports.",
      ] },
    ],
    related: [
      { label: "HL7 vs FHIR explained", href: "/blog/hl7-vs-fhir-healthcare-data/" },
      { label: "X12 278 explained", href: "/blog/x12-278-prior-authorization-explained/" },
      { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm/" },
    ],
    faq: [
      { q: "Is FHIR used in the revenue cycle yet?", a: "Increasingly, through coverage, claim and prior-authorization resources (including the Da Vinci work). But X12 EDI still carries most eligibility and claims traffic, and many authorizations still use payer portals, so FHIR coexists with them today." },
    ],
  },
  {
    slug: "best-rcm-automation-companies",
    kind: "pillar",
    title: "Best RCM Automation Companies in 2026 | Buyer's Guide",
    h1: "How to Choose an RCM Automation Company in 2026",
    eyebrow: "Buyer's Guide · RCM Automation",
    description: "A practical buyer's guide to choosing an RCM automation company in 2026 - the categories of vendors, the criteria that matter, and the questions that separate real capability from a demo.",
    intro: "\"Best\" depends entirely on your payer mix, systems and where your revenue leaks. Rather than a ranked list that is out of date the moment it is published, this guide gives you the categories of vendors and the criteria to judge any of them - MedXFlow included.",
    sections: [
      { h: "The categories of vendors", list: [
        "Clearinghouse-based platforms - strong at claims and remittance, lighter on autonomous work.",
        "AI-native automation vendors - agents that complete tasks end to end (this is MedXFlow's category).",
        "Point solutions - one workflow done well (eligibility only, prior auth only).",
        "Outsourced billing companies - people-led, often priced as a percentage of collections.",
      ] },
      { h: "The criteria that actually matter", list: [
        "Scope: which exact workflows an agent completes end to end, not just \"assists with.\"",
        "Exception handling: what happens when the agent is unsure, and how it escalates.",
        "Integration: does it write back into your EHR/PMS, or only read?",
        "Auditability and security: HIPAA, a signed BAA, and a log of every action.",
        "Pricing model: per-outcome and flat-fee are predictable; percentage-of-collections scales with revenue.",
        "Time to live: supervised pilot to production in weeks, not quarters.",
      ] },
      { h: "Where MedXFlow fits", p: [
        "MedXFlow is an AI-native vendor: connected agents that run eligibility, prior authorization, coding, claims, denials, payment posting and collections end to end, write back into your systems, escalate exceptions to your team, and are priced for finished work. If you want to keep your team and give them leverage, that is the fit. If you would rather hand the whole cycle to people, a managed billing team is the alternative.",
      ] },
    ],
    related: [
      { label: "AI agents for RCM buyer's guide", href: "/blog/ai-agents-revenue-cycle-management-buyers-guide/" },
      { label: "How much does RCM automation cost", href: "/blog/how-much-does-rcm-automation-cost/" },
      { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm/" },
    ],
    faq: [
      { q: "What is the best RCM automation company?", a: "There is no single best; it depends on your payer mix, systems and where revenue leaks. Judge vendors on scope of end-to-end automation, exception handling, EHR write-back, auditability, pricing model and time to go live." },
      { q: "How is AI-native RCM different from a clearinghouse platform?", a: "A clearinghouse platform excels at claims and remittance transport. AI-native automation completes multi-step tasks end to end - like working an eligibility check or a denial - and escalates only the exceptions." },
    ],
  },
  {
    slug: "best-ai-medical-billing-companies",
    kind: "pillar",
    title: "Best AI Medical Billing Companies: 2026 Buyer's Guide | MedXFlow",
    h1: "Choosing an AI Medical Billing Company in 2026",
    eyebrow: "Buyer's Guide · AI Medical Billing",
    description: "What to look for in an AI medical billing company in 2026 - how AI billing differs from traditional outsourcing, the criteria that matter, and the questions to ask before you sign.",
    intro: "AI medical billing promises the throughput of outsourcing without handing your revenue cycle to a black box. This guide explains how to tell real AI billing from repackaged outsourcing, and how to choose.",
    sections: [
      { h: "AI billing vs traditional outsourcing", p: [
        "Traditional billing companies add people and charge a percentage of collections. AI billing adds software that completes the repetitive work and keeps your team in control of exceptions, usually at a more predictable price. Some \"AI\" billing is really outsourcing with a chatbot; the test is whether an agent completes tasks end to end without a human.",
      ] },
      { h: "What to evaluate", list: [
        "Which billing tasks the AI completes autonomously versus assists with.",
        "Whether it writes back into your PMS/EHR and clearinghouse.",
        "How denials and exceptions are surfaced and worked.",
        "Security: HIPAA handling, a signed BAA, and full audit logging.",
        "Pricing: per-outcome or flat-fee versus percentage of collections.",
      ] },
    ],
    related: [
      { label: "AI Agents for Medical Billing", href: "/ai-agents-rcm/" },
      { label: "In-house vs outsourced vs AI RCM", href: "/blog/in-house-vs-outsourced-vs-ai-rcm/" },
      { label: "Managed Billing Services", href: "/products/managed-billing/" },
    ],
    faq: [
      { q: "How is an AI medical billing company different from a billing service?", a: "A traditional billing service adds people and usually charges a percentage of collections. An AI medical billing company uses software agents to complete the repetitive work end to end, keeping your team on exceptions, typically at more predictable pricing." },
    ],
  },
  {
    slug: "rcm-software-pricing-comparison",
    kind: "pillar",
    title: "RCM Software Pricing Compared | MedXFlow",
    h1: "RCM Software Pricing Compared: Per-Claim vs Percentage vs Flat Fee",
    eyebrow: "Pricing · Comparison",
    description: "The three ways RCM software and services are priced - per claim or outcome, percentage of collections, and flat fee - with the trade-offs of each and how to compare them fairly.",
    intro: "RCM pricing looks confusing because vendors use different models. There are really only three, and once you normalize to one you can compare any two vendors honestly.",
    sections: [
      { h: "The three pricing models", list: [
        "Per claim or per completed outcome - transparent, scales with volume, easy to forecast.",
        "Percentage of collections - commonly 4 to 9 percent; aligns incentives but rises as revenue grows.",
        "Flat monthly fee - predictable, but check what seats, integrations and overage are included.",
      ] },
      { h: "How to compare fairly", p: [
        "Convert every quote to a cost per completed unit of work, then compare that against the fully-loaded cost of doing it in-house or offshore today. The model that lands clearly below your current labor cost, with predictable scaling, is the right one.",
      ] },
    ],
    related: [
      { label: "How much does RCM automation cost", href: "/blog/how-much-does-rcm-automation-cost/" },
      { label: "ROI Calculator", href: "/roi-calculator/" },
      { label: "Medical billing company pricing", href: "/medical-billing-company-pricing/" },
    ],
    faq: [
      { q: "Is per-claim or percentage-of-collections pricing better?", a: "Per-claim and flat-fee pricing are more predictable and do not increase your cost as revenue grows. Percentage of collections aligns incentives but becomes expensive at scale. Compare each against your current loaded labor cost." },
    ],
  },
  {
    slug: "medical-billing-company-pricing",
    kind: "pillar",
    title: "Medical Billing Company Pricing: What to Expect | MedXFlow",
    h1: "Medical Billing Company Pricing: What You Should Expect to Pay",
    eyebrow: "Pricing · Medical Billing",
    description: "What medical billing companies charge in 2026 - percentage of collections, per-claim and flat-fee models, typical ranges, and how automation changes the math.",
    intro: "Most medical billing companies charge a percentage of collections, but per-claim and flat-fee models exist, and automation is changing what you should expect to pay. Here are the ranges and the trade-offs.",
    sections: [
      { h: "Typical pricing", list: [
        "Percentage of collections: commonly 4 to 9 percent for small and mid-size practices; larger volumes negotiate lower.",
        "Per claim: a flat amount per claim, useful for high, predictable volume.",
        "Flat monthly fee: a fixed subscription, sometimes tiered by provider count.",
      ] },
      { h: "How automation changes the math", p: [
        "When software carries the repetitive work, the cost should track finished output rather than a slice of your revenue. That is why automation-first vendors tend to price per outcome or flat, and why the honest benchmark is whether the total sits below your current loaded cost of doing the same work.",
      ] },
    ],
    related: [
      { label: "How much does RCM automation cost", href: "/blog/how-much-does-rcm-automation-cost/" },
      { label: "RCM software pricing compared", href: "/rcm-software-pricing-comparison/" },
      { label: "ROI Calculator", href: "/roi-calculator/" },
    ],
    faq: [
      { q: "How much do medical billing companies charge?", a: "Most charge a percentage of collections, commonly 4 to 9 percent for small and mid-size practices, with larger volumes negotiating lower. Per-claim and flat-fee models are also used." },
    ],
  },
  {
    slug: "revenue-cycle-management-dallas-fort-worth",
    kind: "audience",
    title: "Revenue Cycle Management for Dallas-Fort Worth Practices | MedXFlow",
    h1: "Revenue Cycle Management for Dallas-Fort Worth Practices",
    eyebrow: "Serving Dallas-Fort Worth, TX",
    description: "AI-driven revenue cycle management for Dallas-Fort Worth medical practices - eligibility, prior authorization, coding, claims and denials automated, with a human-led billing option.",
    intro: "MedXFlow brings AI revenue cycle automation to medical practices across Dallas-Fort Worth, running the repetitive payer-facing work so local teams get paid faster with less manual effort.",
    sections: [
      { h: "What MedXFlow does for DFW practices", p: [
        "From eligibility and prior authorization through coding, claims, denials, posting and patient collections, MedXFlow's AI agents automate the revenue cycle and write back into the systems your practice already runs, with your staff handling only the exceptions.",
      ] },
      { h: "Automation or a managed team", p: [
        "Keep your billing team and give them leverage with AI agents, or hand the whole cycle to a human-led managed billing team backed by the same automation. Either way, every action is tracked, assigned and auditable.",
      ] },
    ],
    related: [
      { label: "Medical billing services in Texas", href: "/medical-billing-services-texas/" },
      { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm/" },
      { label: "Book a demo", href: "/#cta" },
    ],
    faq: [
      { q: "Does MedXFlow serve Dallas-Fort Worth practices?", a: "Yes. MedXFlow is remote-first and works with medical practices across Dallas-Fort Worth and Texas, automating the revenue cycle and writing back into your existing systems." },
    ],
  },
  {
    slug: "medical-billing-company-frisco-tx",
    kind: "audience",
    title: "Medical Billing and RCM Company in Frisco, TX | MedXFlow",
    h1: "Medical Billing and RCM Company in Frisco, TX",
    eyebrow: "Serving Frisco, TX",
    description: "AI-powered medical billing and revenue cycle management for Frisco, TX practices - automated eligibility, prior auth, claims and denials, with transparent, outcome-based pricing.",
    intro: "MedXFlow provides AI-powered medical billing and revenue cycle management for practices in Frisco and the wider Dallas-Fort Worth area, automating the repetitive work and keeping your team on exceptions.",
    sections: [
      { h: "Billing built on automation", p: [
        "MedXFlow automates eligibility, prior authorization, coding, claims, denials, payment posting and patient collections, and writes results back into your practice management system. You keep visibility and control while the volume runs itself.",
      ] },
    ],
    related: [
      { label: "RCM for Dallas-Fort Worth", href: "/revenue-cycle-management-dallas-fort-worth/" },
      { label: "Medical billing services in Texas", href: "/medical-billing-services-texas/" },
      { label: "Book a demo", href: "/#cta" },
    ],
    faq: [
      { q: "Do you offer medical billing in Frisco, TX?", a: "Yes. MedXFlow serves Frisco and the Dallas-Fort Worth area with AI-powered medical billing and revenue cycle automation, remote-first, integrated with the systems you already run." },
    ],
  },
  {
    slug: "medical-billing-services-texas",
    kind: "audience",
    title: "Medical Billing Services for Texas Practices | MedXFlow",
    h1: "Medical Billing Services for Texas Practices",
    eyebrow: "Serving Texas",
    description: "AI-driven medical billing and RCM services for Texas medical practices - eligibility, prior authorization, coding, claims, denials and collections, automated and integrated with your EHR.",
    intro: "MedXFlow provides AI-driven medical billing and revenue cycle services to practices across Texas, automating the payer-facing work and writing results back into the systems you already run.",
    sections: [
      { h: "Statewide, remote-first RCM", p: [
        "Whether you are in Dallas-Fort Worth, Houston, Austin or San Antonio, MedXFlow automates the revenue cycle end to end and offers a human-led managed billing option, all remote-first and integrated with Epic, athenahealth and eClinicalWorks.",
      ] },
    ],
    related: [
      { label: "RCM for Dallas-Fort Worth", href: "/revenue-cycle-management-dallas-fort-worth/" },
      { label: "Medical billing in Frisco, TX", href: "/medical-billing-company-frisco-tx/" },
      { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm/" },
    ],
    faq: [
      { q: "Does MedXFlow offer medical billing services in Texas?", a: "Yes. MedXFlow serves medical practices across Texas with AI-driven billing and revenue cycle automation, plus a human-led managed billing option, integrated with your existing EHR." },
    ],
  },
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

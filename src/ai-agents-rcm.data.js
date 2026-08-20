// Plain-JS data for the /ai-agents-rcm pillar page, shared by the React page
// (AiAgentsRcm.jsx) and the Node prerender script (no JSX, so both can import).

export const AI_AGENTS_INTRO =
  "MedXFlow runs your entire revenue cycle with AI agents - eligibility, prior authorization, coding, claims, denials, payment posting and patient collections. The repetitive RCM work, automated; your team freed for the calls that need judgment.";

export const AI_AGENTS = [
  { h: "Credentialing & provider enrollment", href: "/products/credentialing/", p: "Prepares and submits payer enrollment and credentialing applications, chases payers for status, and tracks re-credentialing and expirables - so providers go live faster and nothing bills under a lapsed number." },
  { h: "Eligibility & benefits verification", href: "/products/eligibility-verification/", p: "An AI agent checks coverage before every visit and re-verifies at month boundaries, so claims don't bounce for inactive or changed plans." },
  { h: "Prior authorization", href: "/products/pre-authorization/", p: "Determines what needs auth, submits the request, tracks status, and attaches the approval to the claim - the manual portal work, handled." },
  { h: "Medical coding & charge capture", href: "/products/charge-capture-coding/", p: "Drafts codes from documentation, flags medical-necessity mismatches, and clears repetitive charts so coders focus on complex cases." },
  { h: "Claims submission & follow-up", href: "/products/claims-submission/", p: "Scrubs and submits claims, then follows up on status automatically instead of staff logging into payer portals." },
  { h: "Denial management", href: "/products/denial-management/", p: "Triages denials by reason, drafts appeals, and surfaces the root-cause patterns so the same denial doesn't keep coming back." },
  { h: "Payment posting & patient collections", href: "/products/payment-posting/", p: "Posts ERAs/EOBs, reconciles payments, and runs patient balance follow-up - closing the loop from claim to cash." },
];

export const AI_AGENTS_FAQ = [
  { q: "What is an AI agent for healthcare RCM?", a: "An AI agent for revenue cycle management is software that carries out a specific RCM task end to end - like eligibility, prior authorization, coding, claims follow-up or denials - navigating your systems and payer portals, applying your rules, and escalating exceptions to staff. Unlike a simple bot, an agent handles multi-step work and works continuously." },
  { q: "Do AI RCM agents replace my billing team?", a: "No - they take the repetitive, high-volume work off your team's plate and hand anything uncertain to staff. It's AI backed by humans, never left unattended. Every action is tracked, assigned and auditable." },
  { q: "Which RCM tasks can AI agents automate?", a: "Provider credentialing and payer enrollment, eligibility and benefits verification, prior authorization, medical coding and charge capture, claims submission and follow-up, denial management, payment posting and patient collections - the connected stages from getting a provider enrolled to the final payment." },
  { q: "Can AI agents help with provider credentialing?", a: "Yes. A credentialing agent prepares and submits payer enrollment and credentialing applications, keeps CAQH and PECOS profiles current, tracks each application to approval, and monitors re-credentialing and expirable dates like licenses and board certifications - so new providers become billable sooner and nothing is billed under a lapsed credential." },
  { q: "Do the agents work with my EHR?", a: "Yes. MedXFlow's agents work alongside the systems you already run - Epic, athenahealth, eClinicalWorks and more - writing data back so your existing workflow stays intact. No rip-and-replace." },
  { q: "Is it HIPAA compliant?", a: "Yes. MedXFlow handles PHI to HIPAA standards with a Business Associate Agreement (BAA), controls aligned to SOC 2 Type II, US data centers, and encryption in transit and at rest." },
];

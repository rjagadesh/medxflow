// ─────────────────────────────────────────────────────────────────────────
//  English source-of-truth strings for the MedXFlow marketing page.
//  This is the ONLY file you edit for copy. Translations (Spanish) are
//  AI-drafted from here into i18n.es.json by `npm run translate`
//  - run that when copy changes, then commit the generated files. Translation
//  happens at build time, never on page load.
//
//  Do NOT put brand/product names, prices, emails or phone numbers here - they
//  stay the same across languages and live directly in the components.
// ─────────────────────────────────────────────────────────────────────────

export const en = {
  nav: {
    products: "Products",
    contact: "Contact us",
    pricing: "Pricing",
    faq: "FAQ",
    tour: "Tour",
    book: "Book a demo",
    p_kiosk: "AI Front Desk Kiosk",
    p_voice: "Voice AI",
    p_handoff: "AI backed by Human",
    p_telehealth: "Telehealth",
    p_agents: "AI Agents",
    p_integrators: "System Integrators",
    p_custom: "Customized AI Agents",
  },

  hero: {
    s1_eyebrow: "Product · MedXFlow Revenue Cycle AI",
    s1_h1a: "Your revenue cycle,",
    s1_h1b: "now on autopilot.",
    s1_lead:
      "One AI agent runs the whole cycle - scheduling, eligibility, coding, claims, payments and collections - writing straight into Epic and athenahealth. No busywork, nothing dropped.",
    s1_cta1: "See how it works",
    s1_cta2: "Book a demo",
    s1_note: "Integrated with your EHR · Live in a week",
    s2_eyebrow: "Product · MedXFlow Voice",
    s2_h2a: "Every call answered.",
    s2_h2b: "All of them, at once.",
    s2_lead:
      "When the 8am rush hits, MedXFlow Voice picks up every line simultaneously - booking, rescheduling and confirming by text, straight into your appointment book. No busy signal. No voicemail. Ever.",
    s2_cta1: "Hear it work",
    s2_cta2: "Book a demo",
    s2_note: "Unlimited simultaneous calls · 24/7",
    s3_eyebrow: "Product · MedXFlow Telehealth",
    s3_h2a: "See patients anywhere,",
    s3_h2b: "in one tap.",
    s3_lead:
      "MedXFlow Telehealth turns any appointment into a secure video visit - no apps, no downloads. The patient taps a link, joins in their browser, and every note writes back into Epic and athenahealth.",
    s3_cta1: "See telehealth",
    s3_cta2: "Book a demo",
    s3_note: "No downloads · US-hosted · Integrated with your EHR",
    playSound: "Play sound",
    mute: "Mute",
  },

  stats: {
    s1: "of morning calls go unanswered in a busy practice",
    s2: "of front-desk time freed per week",
    s3: "visit copay collected at the kiosk, not chased later",
    s4: "calls answered - evenings, weekends, holidays",
  },

  problem: {
    eyebrow: "The 8am problem",
    h2a: "Your phone is the busiest",
    h2b: "member of staff you have",
    c1_h: "The morning storm",
    c1_p: "Twenty patients call at 8:01. One front-desk staffer, two hands. Busy signals mean patients give up - or book with the practice down the road.",
    c2_h: "The desk line",
    c2_p: "While the phone rings, a line forms at the front desk. Someone's paying, someone's lost, someone just needs a form. Everyone waits.",
    c3_h: "Stale details",
    c3_p: "Phone numbers change. ZIP codes are missing. Every incorrect record is a failed text reminder - and another no-show.",
    caption: "For many patients, the busy signal is the front door of the practice.",
  },

  voice: {
    eyebrow: "MedXFlow Voice · AI receptionist",
    h2a: "Answers like your best",
    h2b: "receptionist. Never busy.",
    lead: "MedXFlow Voice answers every call on the first ring - in a warm, natural-sounding voice - and books directly into your appointment book.",
    t1: "Books, moves and cancels appointments in Epic & athenahealth",
    t2: "Handles prescription refill requests into a queue for the provider",
    t3: "Recognizes urgent symptoms and warm-transfers to staff instantly",
    t4: "Confirms every booking by text - fewer no-shows",
    t5: "English and Spanish · unlimited simultaneous calls",
  },

  checkin: {
    eyebrow: "MedXFlow Check-in · kiosk",
    h2a: "Walk in. Touch the screen.",
    h2b: "Take a seat.",
    f1_h: "Arrival to EHR",
    f1_d: "Patient taps in - their arrival status appears in Epic/athenahealth instantly. No line at the desk.",
    f2_h: "Copay collected on the spot",
    f2_d: "Card payment at check-in. The copay is settled before the patient sits down - not chased after.",
    f3_h: "Details refreshed",
    f3_d: "Phone number and ZIP code confirmed at every visit. Your text reminders actually arrive.",
    f4_h: "New patient forms",
    f4_d: "Registration and consent captured on screen - typed, legible, structured. No clipboards.",
    f5_h: "Welcome · English & Spanish",
    f5_d: "A warm bilingual welcome, larger type for older patients, full accessibility mode.",
    f6_h: "Hardware included",
    f6_d: "Floor-standing unit in white or black, shipped pre-configured. Plug in, connect Wi-Fi, done.",
  },

  handoff: {
    eyebrow: "AI backed by Human",
    h2a: "AI never guesses.",
    h2b: "It hands you the call.",
    lead: "Every AI touchpoint - Voice, the kiosk and web chat - has a human backstop. The moment the AI is unsure, hits an error, or a patient asks for a person, it stops and passes a complete record to your team. Nothing is dropped, nothing is faked.",
    step1_h: "AI reaches its limit",
    step1_d: "Low confidence, a system error, a clinical question it shouldn't answer, or a patient who simply asks for a human.",
    step2_h: "It escalates instantly",
    step2_d: "A handoff record is raised with the full transcript, the patient's details and the reason - the AI tells the patient a person is taking over.",
    step3_h: "Your team takes it from here",
    step3_d: "Staff pick it up from the MedXFlow dashboard, resolve it, and close it out. Every escalation is tracked, assigned and auditable.",
    t1: "Triggers on error, low confidence or a request for a human",
    t2: "Full AI transcript and patient record attached - no re-asking",
    t3: "Claim, assign and resolve from one shared inbox",
    t4: "Every handoff logged and auditable for clinical safety",
    stat_h: "of interactions handled without a human - the rest reach one in seconds",
    cta: "See the handoff in a demo",
  },

  compliance: {
    eyebrow: "Security & Compliance",
    h2a: "Built for healthcare's",
    h2b: "highest bar.",
    lead: "Patient data is protected end to end - encrypted, access-controlled and fully audited - and handled under the frameworks your compliance team expects.",
    b1_h: "HIPAA",
    b1_d: "PHI handled to HIPAA standards, with Business Associate Agreements (BAAs) available.",
    b2_h: "SOC 2",
    b2_d: "Security controls aligned to SOC 2 Type II, independently reviewed.",
    b3_h: "Encryption",
    b3_d: "Encrypted in transit (TLS 1.2+) and at rest (AES-256). We never sell data.",
    b4_h: "Access & Audit",
    b4_d: "Least-privilege, role-based access with a full audit trail on every record.",
    b5_h: "US data centers",
    b5_d: "All patient data stored and processed in US-based data centers.",
    foot: "HIPAA compliant · SOC 2 aligned · Business Associate Agreements available · encrypted in transit and at rest",
  },

  integrations: {
    eyebrow: "Integrations",
    h2a: "Built for the software",
    h2b: "you already run",
    body: "MedXFlow writes bookings, arrivals and payments directly into the EHR and practice management systems used across US healthcare - with a fallback mode that works even before formal integration.",
    caption: "Your appointment book, always current - no retyping, no sticky notes.",
  },

  roi: {
    eyebrow: "What the busy signal costs",
    h2: "Run your own numbers",
    missed: "Missed calls per day",
    elsewhere: "% who book elsewhere",
    fee: "Average visit revenue",
    revenueOut: "Revenue walking out the door",
    product: "MedXFlow Front Desk",
    recovered: "Recovered every month",
    footnote: "22 working days/month. Excludes front-desk hours freed and fewer no-shows from text confirmations.",
  },

  pricing: {
    eyebrow: "Pricing",
    h2: "Simple. Monthly. No lock-in.",
    tag: "Most practices choose this",
    voice_per: "/month + $0.10/min",
    voice_cta: "Start with Voice",
    voice_f1: "AI receptionist, 24/7",
    voice_f2: "Unlimited simultaneous calls",
    voice_f3: "Bookings into Epic/athenahealth",
    voice_f4: "Prescription refill queue",
    voice_f5: "Urgent-call warm transfer",
    voice_f6: "Text confirmations",
    fd_per: "/month + call minutes",
    fd_cta: "Get Front Desk",
    fd_f1: "Everything in Voice + Check-in",
    fd_f2: "One dashboard for the practice",
    fd_f3: "Priority support",
    fd_f4: "Founding practices: pricing locked 24 months",
    fd_f5: "Free setup + 60-day trial",
    ci_per: "/month, hardware included",
    ci_cta: "Start with Check-in",
    ci_f1: "Floor-standing kiosk (white/black)",
    ci_f2: "Arrival status to your EHR",
    ci_f3: "Copay collected at check-in",
    ci_f4: "Details refresh + new patient forms",
    ci_f5: "English & Spanish",
  },

  about: {
    eyebrow: "About MedXFlow",
    h2a: "Built by people who've run",
    h2b: "the front desk.",
    body: "MedXFlow Health is a US company on a simple mission: give every practice a front desk that never misses a call. We pair deep healthcare-operations experience with modern voice AI - built for Epic, athenahealth, and the realities of US clinics.",
    role1: "Co-founder & CEO",
    bio1: "Two decades in US healthcare operations - built and scaled front-desk teams across multi-site physician groups.",
    role2: "Co-founder & CTO",
    bio2: "Health-tech engineer who led voice-AI and EHR integration platforms used across hundreds of clinics.",
    role3: "Clinical Advisor",
    bio3: "Practicing physician focused on patient access and front-desk workflow, keeping MedXFlow clinically grounded.",
  },

  faq: {
    eyebrow: "FAQ",
    h2: "Questions, answered.",
    q1: "Is patient data secure and HIPAA compliant?",
    a1: "Yes. MedXFlow handles PHI to HIPAA standards and offers a Business Associate Agreement (BAA), with security controls aligned to SOC 2 Type II. Everything is stored in US data centers, encrypted in transit and at rest, with least-privilege access and full audit logging. We never sell data or use patient information to train public models.",
    q2: "How long does setup take?",
    a2: "Most practices are live within a week. We connect to your EHR (Epic or athenahealth), configure your call flows and appointment types, and run a supervised pilot before MedXFlow answers live calls.",
    q3: "What are the contract terms?",
    a3: "Practices get a 60-day trial and free setup, with no long lock-in - cancel with 30 days' notice.",
    q4: "What happens when the AI can't handle a call?",
    a4: "MedXFlow knows its limits. Anything clinical, urgent, or out of scope is warm-transferred to your team or flagged for callback, with a full transcript. It augments your front desk - it never overrides clinical judgment.",
    q5: "Does it work with our phone system and EHR?",
    a5: "Yes. MedXFlow sits alongside your existing phone number and writes bookings, arrivals, and payments straight into Epic and athenahealth. No rip-and-replace.",
    q6: "Which languages does it support?",
    a6: "English and Spanish today, with a warm, natural-sounding voice and accessibility options (larger type, slower pace) for older patients.",
  },

  cta: {
    h2a: "The revenue-cycle AI",
    h2b: "practices run on.",
    lead: "MedXFlow already keeps the phones answered, patients checked in, and claims paid for practices across the country. See what it does on your own numbers - book a 15-minute demo and we'll go live within a week.",
    formTitle: "Request your demo",
  },

  lead: {
    name: "Name",
    email: "Work email",
    clinic: "Clinic / practice",
    phone: "Phone",
    bestTime: "Best time to call",
    message: "Anything specific?",
    messagePlaceholder: "What would you like MedXFlow to help with?",
    submit: "Request my demo",
    sending: "Sending…",
    fine: "No spam. We'll only use this to arrange your demo.",
    doneTitle: "Thanks",
    doneMsg: "We've got your request - the MedXFlow team will be in touch within one business day to arrange your demo.",
    invalid: "Please enter your name and a valid email.",
  },

  bookdemo: {
    eyebrow: "Book a demo",
    title: "See MedXFlow on your own calls",
    sub: "A free 15-minute walkthrough. Tell us where to reach you and we'll set it up.",
  },

  footer: {
    legal: "HIPAA compliant · SOC 2 aligned · BAAs available · US data centers · © 2026 MedXFlow Health",
  },

  // Telehealth product page (/telehealth)
  telehealth: {
    hero_eyebrow: "Product · MedXFlow Telehealth",
    hero_h1a: "See patients anywhere,",
    hero_h1b: "in one tap.",
    hero_lead: "MedXFlow Telehealth turns any appointment into a secure video visit - no apps, no downloads. Patients join in the browser; notes write back to your EHR.",
    hero_cta1: "Book a demo",
    hero_cta2: "See pricing",
    hero_note: "No downloads · US-hosted · Integrated with your EHR",

    intro_eyebrow: "Why MedXFlow Telehealth",
    intro_h2a: "Video visits that feel like",
    intro_h2b: "part of the practice.",
    intro_body: "Telehealth shouldn't mean a second system your team has to babysit. MedXFlow books, sends, and documents video visits inside the workflow you already run - so a virtual visit is just another slot in the day.",

    feat_eyebrow: "What's included",
    feat_h2: "Everything a virtual visit needs",
    f1_h: "One-tap join",
    f1_d: "The patient gets a text link and joins in their browser - no app, no account, no PIN. Works on any phone.",
    f2_h: "Books into your EHR",
    f2_d: "Video slots sit in the same schedule as in-person visits, written straight into Epic and athenahealth.",
    f3_h: "Smart waiting room",
    f3_d: "Patients wait in a branded virtual lobby; your team sees who's ready and admits them when it suits.",
    f4_h: "Notes & scripts",
    f4_d: "Visit notes and prescriptions flow back to the record and out to the pharmacy - nothing re-typed.",
    f5_h: "Copay up front",
    f5_d: "Collect the visit copay by card before the call connects, just like the check-in kiosk.",
    f6_h: "Private by design",
    f6_d: "End-to-end encrypted, US-hosted and HIPAA-compliant. No recordings are stored unless you ask for them.",

    how_eyebrow: "How it works",
    how_h2: "From booking to follow-up",
    step1_h: "Book",
    step1_d: "Reception or MedXFlow Voice books a video slot - the patient picks a time like any appointment.",
    step2_h: "Tap to join",
    step2_d: "A text link arrives. The patient taps it and lands in the waiting room, in their browser.",
    step3_h: "Consult",
    step3_d: "The clinician admits them and consults - sharing screens, images or documents as needed.",
    step4_h: "Follow-up",
    step4_d: "Notes, scripts and next steps write back automatically. The patient gets a text summary.",

    cta_h2: "Add telehealth to your practice",
    cta_lead: "See how virtual visits slot into your day - book a free 15-minute demo with the MedXFlow team.",
    back: "← All products",
  },

  // Spoken narration for the guided tour (read aloud by the browser).
  tour: {
    exit: "Exit tour",
    replay: "Replay",
    intro: "Welcome to MedXFlow. Here's a quick tour of how it gives your practice a front desk that never misses a call.",
    problem: "It starts with the phone. When twenty patients call at eight in the morning, one front-desk staffer can't answer them all - and every busy signal is a patient who books elsewhere.",
    voice: "MedXFlow Voice answers every call at once, day or night, in a warm natural voice - booking, rescheduling and confirming by text, straight into Epic or athenahealth.",
    checkin: "At the door, the MedXFlow Check-in kiosk greets patients, collects the copay, refreshes their details, and marks them arrived - with no line at the desk.",
    integrations: "Everything writes directly into the practice software you already run - Epic, athenahealth and more - with no rip and replace.",
    roi: "Try your own numbers. Every missed call has a cost, and MedXFlow recovers most of it every single month.",
    pricing: "Pricing is simple and monthly, with no lock-in - start with Voice, Check-in, or the full Front Desk.",
    about: "MedXFlow is built by a US team who have run the front desk themselves.",
    faq: "Common questions - data security, setup time, and how the AI hands over to your staff - are all answered here.",
    cta: "Ready to see it on your own calls? Book a free fifteen-minute demo, and we'll have MedXFlow answering within a week.",
  },
};

// Flatten { a: { b: "x" } } -> { "a.b": "x" }
export function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

export const flatEn = flatten(en);

// ─────────────────────────────────────────────────────────────────────────
//  MedXFlow product catalogue - the Revenue Cycle Management (RCM) suite plus
//  the human-led Managed Billing service. Each entry drives one page rendered
//  by ProductPage.jsx at /products/<slug>. Copy is English source-of-truth;
//  keep brand/product names and prices here (they don't get translated).
// ─────────────────────────────────────────────────────────────────────────

export const CATEGORIES = {
  platform: "Platforms",
  rcm: "Revenue Cycle Management",
  engagement: "Patient Access & Engagement",
  services: "Managed Services",
};

export const PRODUCTS = [
  {
    slug: "credentialing",
    category: "rcm",
    step: 0,
    icon: "🪪",
    eyebrow: "RCM · Foundation · Provider credentialing & enrollment",
    name: "Credentialing & Provider Enrollment",
    h1a: "Get providers enrolled,",
    h1b: "so every claim can be paid.",
    tagline:
      "Enroll and credential providers with every payer, drive each application to approval, and monitor re-credentialing so nothing bills under a lapsed number.",
    overview:
      "You cannot collect for a provider a payer has not enrolled. MedXFlow credentialing manages the whole lifecycle: initial payer enrollment, CAQH and PECOS profile upkeep, primary-source verification - including validating each provider's NPI against the CMS NPPES registry - and the re-credentialing and expirable deadlines that quietly stop payments when they are missed. The AI agent prepares and submits applications, chases payers for status, and flags anything at risk - so providers go live faster and stay billable.",
    features: [
      ["📇", "Payer enrollment", "Prepare and submit enrollment applications across your full payer mix - commercial, Medicare and Medicaid - from one place."],
      ["🗂", "CAQH & profile upkeep", "Keep CAQH, PECOS and payer profiles complete and attested, so applications aren't held up by stale or missing data."],
      ["📡", "Status tracking & follow-up", "Every application is tracked to approval, with the agent chasing payers for status instead of your staff sitting on hold."],
      ["⏰", "Re-credentialing & expirables", "Licenses, DEA, board certifications and re-credentialing dates are monitored and surfaced well before they lapse."],
    ],
    steps: [
      ["Provider & documents intake", "Collect each provider's licenses, education, work history and identifiers once, into a single reusable profile."],
      ["Applications submitted & tracked", "Enrollment and credentialing applications go to each payer and are tracked all the way to approval."],
      ["Live and monitored", "Approved enrollments post to the record, and re-credentialing and expirable dates are watched from then on."],
    ],
    benefits: [
      "New providers start billing sooner, with less revenue lost at onboarding",
      "No claims denied or delayed for enrollment or a lapsed credential",
      "CAQH, PECOS and payer profiles kept current automatically",
      "Every license, certification and re-credentialing date tracked and auditable",
    ],
    stat: { n: 90, suffix: " days", label: "typical wait for a new provider to be payer-ready - cut down by automated submission and follow-up" },
    faq: [
      { q: "What is provider credentialing?", a: "Credentialing verifies a provider's qualifications - licensure, education, board certification and history - and enrolls them with payers so their claims can be paid. Until it is done, claims for that provider can be delayed, denied or paid out of network." },
      { q: "How long does provider credentialing take?", a: "Credentialing a new provider with a payer commonly takes 90 to 120 days, most of it spent waiting on and chasing payers. Automating submission and follow-up shortens the wait." },
      { q: "What is the difference between credentialing and enrollment?", a: "Credentialing verifies the provider's qualifications; payer enrollment registers that verified provider with a specific payer so claims can be submitted. A provider can be credentialed but not yet enrolled with a given plan." },
      { q: "What is CAQH and why does it matter?", a: "CAQH is a widely used database where providers maintain a single credentialing profile that payers draw from. If it is incomplete or the re-attestation is missed, payer applications stall, so keeping it current is high-leverage." },
      { q: "Can credentialing be automated?", a: "The repetitive parts can. AI agents prepare and submit applications, validate NPIs against NPPES, keep CAQH and PECOS current, and track re-credentialing and expirables, while specialists handle judgment calls." },
    ],
  },
  {
    slug: "pre-registration-scheduling",
    category: "rcm",
    step: 1,
    icon: "🗓",
    eyebrow: "RCM · Step 1 · Pre-registration & scheduling",
    name: "Pre-registration & Scheduling",
    h1a: "The clean claim starts",
    h1b: "before the visit does.",
    tagline:
      "Capture demographics, insurance and consent up front, and book the right visit in the right slot - so nothing downstream has to be fixed later.",
    overview:
      "Most denials are born at the front door. MedXFlow pre-registration collects and validates patient demographics, guarantor and insurance details before the patient ever arrives, then books them into the correct visit type with the right provider, location and duration. Every field that a claim will later depend on is verified at the point it's cheapest to fix.",
    features: [
      ["📇", "Digital pre-registration", "Patients complete demographics, guarantor and insurance on their phone before the visit - no clipboard, no re-keying."],
      ["🧠", "Smart scheduling", "Rules-based booking picks the correct visit type, provider and slot length, and prevents double-books and impossible combinations."],
      ["🔔", "Reminders & prep", "Automated SMS/email reminders with prep instructions cut no-shows and keep the schedule full."],
      ["✅", "Front-end data validation", "Names, dates of birth, member IDs and addresses are format-checked and normalised so claims don't reject on typos."],
    ],
    steps: [
      ["Patient books or is scheduled", "Online self-scheduling or staff booking, both governed by the same visit-type rules."],
      ["Details captured up front", "A secure pre-registration link collects demographics, insurance and consent ahead of time."],
      ["Validated and slotted", "Data is normalised and the appointment lands in the right slot - ready for eligibility to run automatically."],
    ],
    benefits: [
      "Fewer denials caused by bad demographic or insurance data",
      "Shorter check-in - most of it is already done",
      "Lower no-show rate from automated reminders",
      "A schedule that reflects real provider capacity",
    ],
    stat: { n: 40, suffix: "%", label: "of denials trace back to registration - caught here, before they happen" },
    faq: [
      { q: "What is patient access in the revenue cycle?", a: "Patient access is the front end of the revenue cycle: scheduling, pre-registration, insurance capture and check-in. Getting it right prevents most downstream denials, because so many denials start with bad registration or coverage data." },
      { q: "What is pre-registration in medical billing?", a: "Pre-registration collects and validates a patient's demographics, guarantor and insurance before the visit, so eligibility can be verified and the claim has clean data from the start." },
      { q: "How do you reduce patient no-shows?", a: "Automated text, email and voice reminders with easy confirm and reschedule, plus waitlist backfill for freed slots. Reminders on the channel each patient uses materially cut no-shows." },
      { q: "Why do so many denials start at registration?", a: "Because the fields a claim depends on - member ID, name, date of birth, coverage - are captured at the front desk. An error there becomes a denial later, which is why validating data up front is the cheapest place to fix it." },
    ],
  },
  {
    slug: "eligibility-verification",
    category: "rcm",
    step: 2,
    icon: "🛡",
    eyebrow: "RCM · Step 2 · Eligibility verification",
    name: "Eligibility Verification",
    h1a: "Know exactly what's covered",
    h1b: "before you deliver care.",
    tagline:
      "Real-time eligibility checks confirm active coverage, co-pays, deductibles and prior-auth needs - so you bill the right payer, the first time.",
    overview:
      "MedXFlow runs automated 270/271 eligibility checks against payers the moment an appointment is booked, and re-checks on the day of service. Staff see active coverage, plan details, co-pay, deductible-remaining and whether a prior authorisation is required - surfaced directly in the worklist, with exceptions flagged for a human to resolve.",
    features: [
      ["⚡", "Real-time payer checks", "Automated 270/271 transactions confirm active coverage and benefits in seconds, not phone calls."],
      ["💳", "Co-pay & deductible surfaced", "Patient responsibility is known before the visit, so front desk can collect at the point of care."],
      ["🔐", "Prior-auth detection", "Services that need authorisation are flagged early, with a task raised so nothing is delivered un-authorised."],
      ["🔁", "Batch & day-of re-checks", "Coverage is re-verified before service to catch plan changes and lapses since booking."],
    ],
    steps: [
      ["Appointment triggers a check", "Eligibility runs automatically as soon as the visit is booked."],
      ["Benefits parsed and displayed", "Coverage, co-pay, deductible and auth requirements appear in the worklist."],
      ["Exceptions escalated", "Inactive coverage or missing auth is flagged for staff to fix before the visit."],
    ],
    benefits: [
      "Bill the correct, active payer every time",
      "Collect patient responsibility up front",
      "Catch prior-auth requirements before service",
      "Eliminate rework from coverage-related denials",
    ],
    stat: { n: 75, suffix: "%", label: "of eligibility-related denials are preventable with automated verification" },
    faq: [
      { q: "What is eligibility verification in medical billing?", a: "Eligibility verification confirms a patient's active insurance coverage and benefits before care, so you bill the right payer and know the patient's copay, deductible and any prior-auth requirement up front." },
      { q: "How do you check patient insurance eligibility?", a: "Run an electronic 270/271 transaction against the payer, or check the payer portal. MedXFlow automates 270/271 checks the moment an appointment is booked and re-checks before the visit." },
      { q: "How often should you verify insurance eligibility?", a: "For every visit, and again 24 to 48 hours before the appointment, because coverage changes at month boundaries. Verifying once at scheduling is not enough." },
      { q: "What is a 270/271 transaction?", a: "The 270 is the EDI eligibility inquiry sent to a payer; the 271 is the response with coverage and benefits. It is how real-time eligibility verification works electronically." },
    ],
  },
  {
    slug: "registration-check-in",
    category: "rcm",
    step: 4,
    icon: "🏥",
    eyebrow: "RCM · Step 4 · Registration & check-in",
    name: "Registration & Check-in",
    h1a: "Check in the patient,",
    h1b: "not the paperwork.",
    tagline:
      "A fast, accurate arrival: confirm identity and coverage, capture consents, collect what's owed, and mark the patient arrived - straight into your EHR.",
    overview:
      "MedXFlow check-in turns arrival into a two-minute, error-free step. Patients confirm their details, sign consents and financial-responsibility forms on screen, and pay their co-pay or balance at the kiosk or front desk. Everything writes back to the practice management system instantly, so the encounter is clean before the clinician even opens the chart.",
    features: [
      ["🪪", "Identity & insurance confirm", "Photo ID and insurance card capture, with details reconciled against what was pre-registered."],
      ["✍️", "On-screen consents", "Consent and financial-responsibility forms signed digitally - legible, dated, stored, auditable."],
      ["💵", "Point-of-service collection", "Co-pays and outstanding balances collected by card at check-in, before the patient sits down."],
      ["↔️", "Real-time EHR write-back", "Arrival status and updated details flow straight into Epic, athenahealth and more."],
    ],
    steps: [
      ["Patient arrives", "Kiosk or front-desk check-in, with pre-registration already done."],
      ["Confirm, sign, pay", "Details verified, consents signed, patient responsibility collected on the spot."],
      ["Marked arrived in the PMS", "The clinical team sees an arrived, financially-cleared patient - no desk queue."],
    ],
    benefits: [
      "Point-of-service collections instead of chasing later",
      "Signed, stored consents with a clear audit trail",
      "No re-keying - details reconcile automatically",
      "A shorter, calmer waiting room",
    ],
    stat: { n: 2, suffix: " min", label: "average check-in - most of it completed before the patient walks in" },
    faq: [
      { q: "What happens at patient check-in?", a: "Check-in confirms the patient's identity and coverage, captures consents and financial-responsibility forms, collects any copay or balance, and marks the patient arrived in the practice management system." },
      { q: "How do you speed up patient check-in?", a: "Do most of it before arrival: pre-register demographics, insurance and consents, so check-in is a quick confirm-and-pay. MedXFlow gets it to about two minutes with most of the work done up front." },
      { q: "What is point-of-service collection?", a: "Collecting the patient's copay or outstanding balance at check-in, before the visit, rather than billing and chasing it later. Amounts collected at the point of service are collected at a far higher rate." },
    ],
  },
  {
    slug: "charge-capture-coding",
    category: "rcm",
    step: 5,
    icon: "🧾",
    eyebrow: "RCM · Step 5 · Charge capture & coding",
    name: "Charge Capture & Coding",
    h1a: "Every service rendered",
    h1b: "is a service billed.",
    tagline:
      "Capture charges at the point of care and code them accurately with CPT/ICD support and automated scrubbing - so nothing leaks and nothing goes out wrong.",
    overview:
      "Revenue leaks when charges are missed or mis-coded. MedXFlow reconciles the day's encounters against the schedule to surface missing charges, assists coders with CPT, ICD-10 and modifier suggestions, and runs a rules engine that checks medical necessity, bundling and payer-specific edits before a claim is ever created.",
    features: [
      ["🔍", "Missing-charge reconciliation", "Encounters are matched to the schedule so no rendered service goes uncharged."],
      ["🏷", "Coding assistance", "CPT, ICD-10 and modifier suggestions with medical-necessity and LCD/NCD checks."],
      ["🧹", "Automated charge scrubbing", "A rules engine catches bundling, mutually-exclusive and payer-specific edits pre-submission."],
      ["👩‍⚕️", "Coder review queue", "Ambiguous or high-risk charges route to a certified coder before release."],
    ],
    steps: [
      ["Charges captured at care", "Rendered services are recorded against the encounter, not reconstructed later."],
      ["Coded and scrubbed", "Codes are assigned and validated against clinical and payer rules."],
      ["Clean charge released", "Only compliant, complete charges pass through to claim creation."],
    ],
    benefits: [
      "Recover revenue from missed and under-coded charges",
      "Fewer coding-related denials and takebacks",
      "Compliance with payer and medical-necessity rules",
      "Faster coder throughput with assistive suggestions",
    ],
    stat: { n: 1, suffix: "%", label: "of net revenue is typically lost to charge capture leakage - closed here" },
    faq: [
      { q: "What is charge capture in medical billing?", a: "Charge capture is the process of recording every billable service a provider delivers so it makes it onto a claim. Services that are missed at the point of care are revenue that never gets billed." },
      { q: "What is charge capture leakage?", a: "Charge capture leakage is revenue lost when rendered services are not captured or are under-coded. Reconciling the day's encounters against the schedule surfaces the missing charges before they are lost." },
      { q: "What is the difference between upcoding and downcoding?", a: "Upcoding bills a higher-level code than the documentation supports (a compliance risk); downcoding bills a lower level than warranted (lost revenue). Accurate, documentation-supported coding avoids both." },
      { q: "How does AI assist medical coding?", a: "AI drafts codes from documentation, flags NCCI/MUE and medical-necessity edits before submission, and clears routine charts so certified coders focus on complex cases. MedXFlow keeps a coder on the exceptions." },
    ],
  },
  {
    slug: "claims-submission",
    category: "rcm",
    step: 6,
    icon: "📤",
    eyebrow: "RCM · Step 6 · Claims submission",
    name: "Claims Submission",
    h1a: "Clean claims out the door,",
    h1b: "first pass, every day.",
    tagline:
      "Generate, scrub and submit compliant 837 claims to every payer and clearinghouse - with acknowledgements tracked and rejections worked automatically.",
    overview:
      "MedXFlow builds compliant electronic claims, runs them through a multi-layer scrubber, and submits them to payers and clearinghouses. Every 999/277CA acknowledgement is tracked, front-end rejections are auto-triaged and corrected, and clean-claim and first-pass rates are measured so you can see - and improve - how much goes right the first time.",
    features: [
      ["🧼", "Multi-layer claim scrubbing", "Format, payer-edit and clinical checks run before submission to maximise first-pass acceptance."],
      ["🔌", "Any payer, any clearinghouse", "Electronic 837 submission across your full payer mix, with paper fallback where required."],
      ["📨", "Acknowledgement tracking", "999 and 277CA responses are reconciled so no claim silently disappears."],
      ["♻️", "Auto-rejection handling", "Front-end rejections are triaged, corrected and resubmitted without manual hunting."],
    ],
    steps: [
      ["Claim assembled", "A compliant 837 is generated from the coded, scrubbed charge."],
      ["Scrubbed and submitted", "Multi-layer edits run, then the claim is transmitted electronically."],
      ["Acknowledged and tracked", "Payer acknowledgements are reconciled; rejections loop back for correction."],
    ],
    benefits: [
      "Higher first-pass and clean-claim rates",
      "No claims lost between practice and payer",
      "Faster time-to-submission, faster cash",
      "Rejections worked automatically, not weeks later",
    ],
    stat: { n: 98, suffix: "%", label: "first-pass acceptance is achievable with disciplined scrubbing and tracking" },
    faq: [
      { q: "How do you submit a claim to insurance?", a: "Generate a compliant electronic 837 claim from the coded encounter, scrub it against payer edits, and transmit it to the payer or clearinghouse, then reconcile the 999/277CA acknowledgement. MedXFlow does this automatically for every payer." },
      { q: "What is claim scrubbing?", a: "Claim scrubbing runs format, payer-edit and clinical checks on a claim before submission to catch errors that would cause a rejection or denial, maximizing first-pass acceptance." },
      { q: "What is the difference between a claim rejection and a denial?", a: "A rejection happens before adjudication (a data or formatting error at the clearinghouse or payer front end) and can be corrected and resubmitted. A denial happens after adjudication, when the payer declines to pay." },
      { q: "What is a good clean claim rate?", a: "A clean claim rate of 95 percent or higher is healthy; disciplined scrubbing and acknowledgement tracking can push first-pass acceptance toward 98 percent." },
    ],
  },
  {
    slug: "payment-posting",
    category: "rcm",
    step: 7,
    icon: "💰",
    eyebrow: "RCM · Step 7 · Payment posting & remittance",
    name: "Payment Posting & Remittance",
    h1a: "Every dollar posted,",
    h1b: "reconciled and explained.",
    tagline:
      "Automated 835/ERA and manual EOB posting with line-level reconciliation - so cash is accurate, variances are visible, and underpayments never slip through.",
    overview:
      "MedXFlow ingests electronic remittance (835/ERA) and posts payments, adjustments and patient responsibility at the line level, reconciled against what was billed. Contractual variances and underpayments are flagged, denials are automatically routed to the denial-management workflow, and daily cash is balanced against deposits so the books always tie out.",
    features: [
      ["🤖", "Auto ERA/835 posting", "Electronic remittances post automatically at line level, with manual EOB entry where needed."],
      ["⚖️", "Underpayment detection", "Payments are compared to contracted rates so short-pays are caught, not accepted."],
      ["🔀", "Denial routing", "Denied and adjusted lines flow straight into denial management with the reason code attached."],
      ["📊", "Daily cash reconciliation", "Posted payments are balanced against bank deposits so cash always ties out."],
    ],
    steps: [
      ["Remittance received", "835/ERA files and paper EOBs are ingested."],
      ["Posted line by line", "Payments, adjustments and patient balances post against the original charges."],
      ["Variances flagged", "Underpayments and denials are surfaced and routed for action."],
    ],
    benefits: [
      "Accurate cash and a balanced daily close",
      "Underpayments recovered, not written off",
      "Denials actioned the moment they post",
      "Clear patient balances ready for statements",
    ],
    stat: { n: 7, suffix: "%", label: "of payer payments are underpaid on average - surfaced here for recovery" },
    faq: [
      { q: "What is payment posting in medical billing?", a: "Payment posting records payer and patient payments and adjustments against the original charges, reconciled at the line level, so cash is accurate and denials and underpayments are surfaced immediately." },
      { q: "What is an ERA (835)?", a: "The 835 (electronic remittance advice, or ERA) is the payer's machine-readable explanation of how a claim was paid, adjusted or denied. It is what lets payments auto-post instead of being keyed from paper EOBs." },
      { q: "What is the difference between the allowed amount and the billed amount?", a: "The billed amount is what the provider charges; the allowed amount is what the payer's contract permits. The difference is the contractual adjustment; anything paid below the allowed amount is an underpayment worth recovering." },
      { q: "What is auto-posting?", a: "Auto-posting reads the 835/ERA and posts payments, adjustments and patient responsibility automatically at the line level, routing denials into the denial workflow. MedXFlow also flags underpayments against contracted rates." },
    ],
  },
  {
    slug: "denial-management",
    category: "rcm",
    step: 8,
    icon: "🔧",
    eyebrow: "RCM · Step 8 · Denial management",
    name: "Denial Management",
    h1a: "Turn denials into",
    h1b: "recovered revenue.",
    tagline:
      "Categorise, prioritise and work denials by root cause - with appeals, resubmissions and prevention analytics that stop the same denial happening twice.",
    overview:
        "MedXFlow captures every denial with its CARC/RARC reason code, categorises it by root cause and dollar value, and drives a prioritised work queue so the highest-yield denials are worked first. Appeals and corrected claims are generated with the right documentation, timely-filing clocks are tracked, and root-cause analytics feed prevention back upstream.",
    features: [
      ["🗂", "Root-cause categorisation", "Every denial is coded by CARC/RARC and grouped by cause, payer and dollar impact."],
      ["🎯", "Prioritised work queues", "Denials are ranked by recoverable value and timely-filing urgency, not just date."],
      ["📝", "Appeals & resubmission", "Appeal letters and corrected claims are generated with supporting documentation."],
      ["🛑", "Prevention analytics", "Recurring denial patterns feed fixes back into registration, coding and eligibility."],
    ],
    steps: [
      ["Denial captured", "The denied line arrives from payment posting with its reason code."],
      ["Categorised and queued", "Root cause and recoverable value determine priority."],
      ["Worked and prevented", "Appeal or resubmit - and push the fix upstream so it doesn't recur."],
    ],
    benefits: [
      "Recover revenue that would otherwise be written off",
      "Work the highest-value denials before the filing deadline",
      "Stop repeat denials at their source",
      "A clear, auditable trail on every appeal",
    ],
    stat: { n: 65, suffix: "%", label: "of denials are never reworked industry-wide - this workflow reclaims them" },
    faq: [
      { q: "What is denial management?", a: "Denial management is the process of capturing, categorizing, appealing and preventing denied claims. It means working denials by root cause and recoverable value, not just reworking them one by one, so revenue is recovered and the same denial stops recurring." },
      { q: "How do you reduce claim denials?", a: "Measure denials by CARC/RARC reason code, fix the top causes at the front end (eligibility, prior authorization, coding), scrub claims before submission, and work denials fast while tracking root cause. Most denials are preventable." },
      { q: "What is the difference between a denial and a rejection?", a: "A rejection happens at the clearinghouse or payer front end before adjudication, usually a data or formatting error you can correct and resubmit. A denial happens after adjudication, when the payer declines to pay, and generally needs an appeal." },
      { q: "How do you write a claim appeal letter?", a: "State the claim details, the denial reason code, and the specific grounds for appeal with supporting documentation (medical necessity, authorization, corrected coding), submitted within the payer's deadline. MedXFlow's agents draft appeals with the right documentation attached." },
    ],
  },
  {
    slug: "patient-collections",
    category: "rcm",
    step: 9,
    icon: "📬",
    eyebrow: "RCM · Step 9 · Patient statements & collections",
    name: "Patient Statements & Collections",
    h1a: "Clear balances,",
    h1b: "kindly and quickly.",
    tagline:
      "Accurate statements, digital payment options and gentle automated follow-up - so patients understand what they owe and paying is effortless.",
    overview:
      "Patient responsibility is a growing share of revenue and the hardest to collect. MedXFlow issues clear, itemised statements across print, email and SMS, offers online and text-to-pay with payment plans, and runs a compassionate reminder cadence. Balances that remain are aged, segmented and routed appropriately - with a full record kept for every touch.",
    features: [
      ["🧾", "Clear itemised statements", "Plain-language statements delivered by the channel each patient prefers."],
      ["📱", "Digital & text-to-pay", "Online payment, text-to-pay and card-on-file remove friction from paying."],
      ["📆", "Payment plans", "Automated instalment plans for larger balances, tracked to completion."],
      ["💬", "Compassionate follow-up", "A configurable, respectful reminder cadence - not a barrage."],
    ],
    steps: [
      ["Balance finalised", "After insurance posts, the patient's true responsibility is set."],
      ["Statement delivered", "Clear statements go out on the patient's preferred channel with easy payment links."],
      ["Followed up & resolved", "Reminders, plans and segmentation move balances to paid."],
    ],
    benefits: [
      "Higher patient collection rates, collected sooner",
      "Fewer billing questions from clearer statements",
      "A better patient financial experience",
      "Aged balances segmented for the right next step",
    ],
    stat: { n: 3, suffix: "×", label: "faster patient payment when digital and text-to-pay options are offered" },
    faq: [
      { q: "How do you improve patient collections?", a: "Give patients an accurate estimate up front, collect at or before the point of service, send clear itemized statements, and offer digital and text-to-pay options with payment plans. Amounts collected early are collected at a far higher rate than balances chased later." },
      { q: "How do you collect patient balances?", a: "Send clear statements on the patient's preferred channel with easy payment links, keep a card on file where possible, offer instalment plans for larger balances, and run a respectful reminder cadence, with aged balances segmented for the right next step." },
      { q: "What is the difference between gross and net collection rate?", a: "Gross collection rate is total payments divided by total charges; net collection rate is payments divided by the allowed amount (what you could actually collect). Net collection rate is the truer measure of how well you collect." },
      { q: "How do you reduce A/R days on patient balances?", a: "Collect up front, deliver statements quickly, and automate follow-up so nothing stalls. Faster, clearer billing and digital payment options are what move patient A/R down." },
    ],
  },
  {
    slug: "reporting-analytics",
    category: "rcm",
    step: 10,
    icon: "📈",
    eyebrow: "RCM · Step 10 · Reporting & analytics",
    name: "Reporting & Analytics",
    h1a: "See the whole revenue cycle",
    h1b: "on one screen.",
    tagline:
      "KPIs, denial trends, payer performance and cash forecasting in real time - so you can find the leaks and act before they cost you a month.",
    overview:
      "MedXFlow turns the entire revenue cycle into a live dashboard: days in A/R, clean-claim and first-pass rates, net collection rate, denial rate by cause and payer, and cash forecasting. Drill from a headline KPI to the individual claim, benchmark providers and locations, and get scheduled reports in the inbox of whoever needs them.",
    features: [
      ["📊", "Live KPI dashboards", "Days in A/R, clean-claim rate, net collection rate and more, updated in real time."],
      ["🔎", "Drill-down to the claim", "Move from a headline metric to the exact claims driving it in two clicks."],
      ["🏦", "Payer & provider benchmarking", "Compare performance across payers, providers and locations to find outliers."],
      ["📤", "Scheduled & ad-hoc reports", "Automated report delivery plus a flexible builder for one-off questions."],
    ],
    steps: [
      ["Data flows in", "Every stage of the cycle feeds the analytics layer automatically."],
      ["KPIs surfaced", "Dashboards highlight what's healthy and what's slipping."],
      ["Act on the leak", "Drill in, assign the fix, and watch the metric move."],
    ],
    benefits: [
      "One source of truth for revenue-cycle health",
      "Find and fix leaks before they compound",
      "Benchmark and hold performance accountable",
      "Board-ready reporting without the spreadsheet night",
    ],
    stat: { n: 360, suffix: "°", label: "visibility across every stage - from scheduling to final payment" },
    faq: [
      { q: "What RCM KPIs should a practice track?", a: "The core ones are days in accounts receivable, clean-claim and first-pass rates, net collection rate, denial rate by cause and payer, and DNFB days. Track the trend monthly, not just the number." },
      { q: "What is a good days in A/R?", a: "Under 40 days is generally healthy, and best-in-class practices run 30 to 35 days. Above 50 usually signals a follow-up or denial problem." },
      { q: "What is net collection rate?", a: "Net collection rate is payments divided by the allowed amount - what you actually collected versus what you were contractually entitled to collect. It is the truest measure of collection performance." },
    ],
  },
  {
    slug: "voip",
    category: "platform",
    step: 0,
    icon: "📞",
    eyebrow: "Platform · Cloud VoIP for healthcare",
    name: "VoIP Services",
    h1a: "Your clinic phone system,",
    h1b: "reinvented in the cloud.",
    tagline:
      "Enterprise-grade cloud VoIP for healthcare - crystal-clear calls, smart routing, and native integration with MedXFlow Voice AI and your EHR.",
    overview:
      "Legacy phone systems weren't built for a modern practice - or for AI. MedXFlow VoIP replaces your on-prem PBX with a HIPAA-ready cloud phone system: port your existing numbers, route calls intelligently across locations, and let MedXFlow Voice AI answer overflow and after-hours automatically. Softphones for the desk, apps for the road, and call analytics that actually tie back to bookings.",
    features: [
      ["☎️", "Cloud PBX & SIP", "A full hosted phone system - extensions, hunt groups, voicemail-to-email - with no devices to rack or maintain."],
      ["🔀", "Smart call routing", "Time-of-day, skills- and location-based IVR routing, with overflow and after-hours handled by MedXFlow Voice AI."],
      ["🔁", "Number porting", "Keep every number your patients already know. We port them over with zero downtime."],
      ["🤖", "Native Voice AI hand-off", "Calls flow seamlessly between your team and the AI receptionist - one system, one call log."],
      ["📊", "Call analytics", "Volumes, wait times, missed-call recovery and outcomes, tied back to bookings and revenue."],
      ["📱", "Softphone & mobile", "Take clinic calls from a browser or phone app - secure, recorded where required, always on your caller ID."],
    ],
    steps: [
      ["Port your numbers", "We move your existing lines to the cloud with no interruption to patients."],
      ["Configure call flows", "Set routing, IVR, hours and overflow - with Voice AI as the always-on backstop."],
      ["Go live", "Your team answers from softphones or apps; analytics and EHR write-back start day one."],
    ],
    benefits: [
      "No on-prem PBX to buy, rack or maintain",
      "Lower per-minute and line costs, one predictable bill",
      "Scales instantly across new providers and locations",
      "One phone platform that already speaks to your AI and EHR",
    ],
    stat: { n: 99.99, suffix: "%", label: "uptime SLA - carrier-grade cloud voice your practice can rely on" },
  },
  {
    slug: "appointment-reminders",
    category: "engagement",
    step: 0,
    icon: "🔔",
    eyebrow: "Patient Engagement · Reminders",
    name: "Appointment Reminders",
    h1a: "Fewer no-shows,",
    h1b: "on autopilot.",
    tagline:
      "Automated text, email and voice reminders with one-tap confirm and reschedule - cutting no-shows and filling gaps, synced to your EHR schedule.",
    overview:
      "No-shows quietly drain a practice's schedule and revenue. MedXFlow reminders reach every patient on the channel they actually use - text, email or voice - with a cadence you control. Patients confirm, cancel or reschedule in one tap, and every response writes back to your EHR in real time so the front desk always sees an accurate day.",
    features: [
      ["💬", "Multi-channel reminders", "Text, email and automated voice - sent on the channel each patient prefers, in English or Spanish."],
      ["👍", "One-tap confirm & reschedule", "Patients confirm or move their appointment from the message; changes sync straight to the EHR."],
      ["⏱", "Configurable cadence", "Reminder timing and follow-ups you set per visit type - a week out, the day before, the morning of."],
      ["📥", "Waitlist backfill", "When a slot frees up, the next waitlisted patient is offered it automatically - no empty chairs."],
    ],
    steps: [
      ["Schedule syncs", "Appointments flow in from Epic and athenahealth automatically."],
      ["Reminders go out", "Patients get timed reminders and confirm or reschedule in one tap."],
      ["The book stays full", "Responses write back live, and freed slots are offered to the waitlist."],
    ],
    benefits: [
      "Materially fewer no-shows and late cancellations",
      "A fuller schedule with automatic waitlist backfill",
      "Less phone time for the front desk",
      "Accurate, real-time schedule in your EHR",
    ],
    stat: { n: 30, suffix: "%", label: "typical drop in no-shows once automated reminders are running" },
  },
  {
    slug: "recall-campaigns",
    category: "engagement",
    step: 0,
    icon: "🔁",
    eyebrow: "Patient Engagement · Recall",
    name: "Recall Campaigns",
    h1a: "Bring patients back",
    h1b: "for the care they're due.",
    tagline:
      "Reach patients overdue for visits, screenings and follow-ups - recall lists built from your EHR, delivered by text and email, and booked in a tap.",
    overview:
      "Every practice has patients who've fallen through the cracks - a screening not booked, a follow-up never scheduled, an annual visit long overdue. MedXFlow builds recall lists straight from your EHR, reaches those patients automatically with a friendly nudge, and lets them self-book in one tap. It's found revenue and better continuity of care, without the front desk making a single call.",
    features: [
      ["🗂", "EHR-built recall lists", "Automatically surface patients overdue for visits, screenings, labs or chronic-care follow-up."],
      ["📣", "Automated outreach", "Personalized text and email campaigns on a schedule, in English or Spanish - no manual list work."],
      ["📆", "One-tap self-booking", "Patients book straight from the message into an open slot, written back to your EHR."],
      ["🎯", "Segmentation & tracking", "Target by condition, provider or last-visit date, and track who booked, came in and paid."],
    ],
    steps: [
      ["Find the gaps", "Recall lists are generated from your EHR by overdue rule."],
      ["Reach out automatically", "Patients get a personalized nudge with a booking link."],
      ["They book, you measure", "Self-booked visits write back, and campaign results are tracked end to end."],
    ],
    benefits: [
      "Reactivate lapsed and overdue patients at scale",
      "Recovered revenue with no extra front-desk effort",
      "Better continuity of care and preventive follow-up",
      "Clear ROI - bookings and revenue per campaign",
    ],
    stat: { n: 20, suffix: "%", label: "of overdue patients typically re-book from an automated recall campaign" },
  },
  {
    slug: "pre-authorization",
    category: "rcm",
    step: 3,
    icon: "🔐",
    eyebrow: "RCM · Step 3 · Prior authorization",
    name: "Pre-Authorization",
    h1a: "Prior auths, cleared",
    h1b: "before they hold you up.",
    tagline:
      "Detect what needs prior authorization, submit and track it automatically, and clear approvals before the visit - so care isn't delayed or denied.",
    overview:
      "Prior authorization is one of the biggest sources of delayed care and denied claims. MedXFlow flags services that need authorization the moment they're ordered or scheduled, submits the request to the payer with the right documentation, and tracks it to approval - surfacing anything at risk so staff act before the visit, not after the denial.",
    features: [
      ["🔎", "Auto-detect requirements", "Payer- and plan-specific rules flag which orders and visits need authorization, up front."],
      ["📤", "Submit with documentation", "Requests go to the payer with the clinical documentation attached - no chasing forms."],
      ["📡", "Live status tracking", "Every auth is tracked to approval, with at-risk and expiring authorizations surfaced early."],
      ["🛑", "Denial prevention", "Nothing is delivered un-authorized, so auth-related denials and write-offs drop sharply."],
    ],
    steps: [
      ["Requirement detected", "The moment a service is ordered or booked, auth rules flag whether it's needed."],
      ["Request submitted & tracked", "MedXFlow files it with documentation and tracks it to a decision."],
      ["Cleared before the visit", "Approved authorizations post to the record; at-risk cases are escalated to staff."],
    ],
    benefits: [
      "Care delivered on time, not delayed by paperwork",
      "Far fewer authorization-related denials and write-offs",
      "Staff hours saved on portals and payer phone calls",
      "Every authorization tracked, documented and auditable",
    ],
    stat: { n: 25, suffix: "%", label: "of denials are auth-related industry-wide - prevented before the visit" },
    faq: [
      { q: "What is prior authorization?", a: "Prior authorization (also called pre-authorization or precertification) is a payer's approval that a service is covered before it is delivered. Without it, the claim is usually denied, and those denials are hard to appeal after the fact." },
      { q: "How long does prior authorization take?", a: "It varies widely by payer and service, from same-day to one or two weeks. Automating detection, submission and follow-up shortens the wait by removing the delays that come from incomplete requests and un-chased status." },
      { q: "What is the difference between prior authorization and precertification?", a: "The terms are largely used interchangeably. Both refer to getting a payer's approval before a service; some payers use precertification for inpatient or specific services and prior authorization more broadly." },
      { q: "How do you speed up prior authorization?", a: "Detect what needs an auth the moment it is ordered, submit with the right clinical documentation, and track every request to a decision. MedXFlow's AI agents do this end to end, using the X12 278 where payers support it and payer portals where they do not." },
      { q: "How do you appeal a prior authorization denial?", a: "Submit the payer's appeal with additional clinical documentation supporting medical necessity, within the payer's deadline. Tracking auth requirements up front prevents most of these denials in the first place." },
    ],
  },
  {
    slug: "managed-billing",
    category: "services",
    step: 0,
    icon: "👥",
    eyebrow: "Managed service · Human-led medical billing",
    name: "Managed Billing Services",
    h1a: "A dedicated billing team,",
    h1b: "without the overhead.",
    tagline:
      "Prefer people over software? Certified billers and coders run your entire revenue cycle for you - a full-service billing partnership, backed by MedXFlow.",
    overview:
      "Not every practice wants to run the software themselves. Managed Billing Services is our human-led, full-service offering: a dedicated team of certified medical billers, coders and A/R specialists who own your revenue cycle end to end - from eligibility to final payment - and report to you against clear performance targets. It's the classic outsourced-billing relationship, with MedXFlow's automation working quietly behind your team.",
    features: [
      ["🧑‍💼", "Dedicated account team", "Named certified billers and coders who know your practice, your payers and your specialty."],
      ["🔄", "Full-cycle ownership", "We handle eligibility, coding, claims, posting, denials and patient collections - end to end."],
      ["📞", "You keep a human on the phone", "A real account manager you can call, with regular reviews and transparent reporting."],
      ["📑", "Compliance & credentialing", "Certified coding, payer enrolment and credentialing support, with audit-ready documentation."],
    ],
    steps: [
      ["We learn your practice", "Onboarding maps your payers, fee schedule, specialty and existing backlog."],
      ["We run the cycle", "Our team works your claims and denials daily, using MedXFlow to move faster."],
      ["You get paid & reported to", "Cash lands, and you get clear monthly performance reviews against agreed KPIs."],
    ],
    benefits: [
      "No billing staff to hire, train or cover",
      "Certified coders across your specialty",
      "Transparent, KPI-based monthly reporting",
      "Percentage-of-collections pricing - we win when you do",
    ],
    stat: { n: 100, suffix: "%", label: "of your revenue cycle handled by a dedicated human team" },
  },
];

export const bySlug = (slug) => PRODUCTS.find((p) => p.slug === slug) || null;
export const platformProducts = PRODUCTS.filter((p) => p.category === "platform");
export const rcmProducts = PRODUCTS.filter((p) => p.category === "rcm").sort((a, b) => a.step - b.step);
export const engagementProducts = PRODUCTS.filter((p) => p.category === "engagement");
export const serviceProducts = PRODUCTS.filter((p) => p.category === "services");

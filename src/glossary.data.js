// RCM glossary. Each term is a small page targeting a "what is X" search, with
// internal links to the relevant product/pillar. Plain JS (no JSX) so both the
// React renderer and the Node prerender can import it. Definitions are factual
// RCM domain knowledge — no fabricated MedXFlow claims.

export const TERMS = [
  { slug: "revenue-cycle-management", term: "Revenue Cycle Management (RCM)", def: "The end-to-end financial process a healthcare practice uses to capture, manage and collect revenue for the care it delivers.",
    body: ["RCM spans everything from scheduling and eligibility, through coding and claims, to payment posting, denials and patient collections. A healthy revenue cycle gets clean claims out quickly and collects what's owed with minimal rework.", "Because it's a chain, a problem in one stage (like a missed eligibility check) usually shows up as lost revenue in a later stage (a denial)."],
    related: { label: "AI Agents for Healthcare RCM", href: "/ai-agents-rcm" }, see: ["dnfb", "clean-claim", "days-in-ar"] },

  { slug: "dnfb", term: "DNFB (Discharged Not Final Billed)", def: "The dollar value of completed encounters that have been discharged but not yet finalized and billed — usually because they're waiting to be coded.",
    body: ["Every day a chart sits in DNFB is a day revenue isn't in the bank. It's often expressed as 'DNFB days' (DNFB dollars ÷ average daily revenue). A rising DNFB almost always signals a coding bottleneck.", "Many organizations target under 5 DNFB days."],
    related: { label: "Medical Coding", href: "/products/charge-capture-coding" }, see: ["charge-capture", "clean-claim", "days-in-ar"] },

  { slug: "eligibility-verification", term: "Eligibility Verification", def: "Confirming a patient's active insurance coverage and benefits before a visit, so claims don't bounce for inactive or changed coverage.",
    body: ["Eligibility is consistently one of the top denial reasons, and it's the cheapest to fix — before the visit rather than after a denial. Best practice is to verify at scheduling and again shortly before the visit, since coverage changes at month boundaries.", "Automating the check makes it practical to cover every appointment instead of a sample."],
    related: { label: "Eligibility Verification", href: "/products/eligibility-verification" }, see: ["coordination-of-benefits", "prior-authorization", "denial-management"] },

  { slug: "prior-authorization", term: "Prior Authorization", def: "A payer's requirement that a service be approved in advance before it's performed, or the claim will be denied.",
    body: ["Prior auth is one of the most manual RCM tasks — staff determine whether a service needs auth, gather documentation, submit the request, and track it to a decision. A missed auth almost always becomes a hard-to-appeal denial.", "The authorization number must land on the final claim for it to pay."],
    related: { label: "Prior Authorization", href: "/products/pre-authorization" }, see: ["eligibility-verification", "medical-necessity", "denial-management"] },

  { slug: "denial-management", term: "Denial Management", def: "The process of categorizing, working and preventing insurance claim denials to recover revenue.",
    body: ["Good denial management treats every denial as two jobs: work this one (correct or appeal it), and prevent the next one (fix the root cause). Around two-thirds of denials are never reworked, so speed and prioritization matter.", "Tracking denials by reason code (CARC/RARC) reveals which upstream step to fix."],
    related: { label: "Denial Management", href: "/products/denial-management" }, see: ["carc", "rarc", "appeal", "first-pass-resolution-rate"] },

  { slug: "carc", term: "CARC (Claim Adjustment Reason Code)", def: "A standardized code on a remittance that explains why a payer adjusted or denied a claim line.",
    body: ["CARCs tell you what the payer flagged — for example, a coverage or medical-necessity issue. They're the starting point for denial triage, but the code alone doesn't give the root cause; that requires looking at the claim.", "CARCs are paired with RARCs for more detail."],
    related: { label: "Denial Management", href: "/products/denial-management" }, see: ["rarc", "denial-management", "eob"] },

  { slug: "rarc", term: "RARC (Remittance Advice Remark Code)", def: "A supplemental code on a remittance that adds detail to a CARC, further explaining a payment or denial.",
    body: ["Where a CARC says what was adjusted, the RARC often explains why in more specific terms. Together they guide how to correct or appeal a denied claim.", "They appear on the ERA/835 and the EOB."],
    related: { label: "Denial Management", href: "/products/denial-management" }, see: ["carc", "era", "eob"] },

  { slug: "charge-capture", term: "Charge Capture", def: "Recording the billable services a provider performed so they can be coded and billed.",
    body: ["Charges missed at the point of care are revenue that never gets billed — 'charge capture leakage.' Capturing charges accurately and promptly keeps claims moving and reduces DNFB.", "It feeds directly into coding and claim creation."],
    related: { label: "Charge Capture & Coding", href: "/products/charge-capture-coding" }, see: ["dnfb", "cpt-code", "clean-claim"] },

  { slug: "clean-claim", term: "Clean Claim", def: "A claim that's complete and accurate enough to be accepted and paid by the payer on the first submission, without a rejection or denial.",
    body: ["Clean claims are the goal of everything upstream — correct eligibility, coding and documentation. The share of claims paid first time is your first-pass resolution rate, and it's the single biggest lever on cash flow and rework.", "Claim scrubbing catches errors before submission."],
    related: { label: "Claims Submission", href: "/products/claims-submission" }, see: ["claim-scrubbing", "first-pass-resolution-rate", "837"] },

  { slug: "first-pass-resolution-rate", term: "First-Pass Resolution Rate (FPRR)", def: "The percentage of claims a payer accepts and pays on the first submission, without rework.",
    body: ["A higher first-pass rate means faster payment and less staff time on rework. It's driven by clean data upstream — eligibility, coding and scrubbing. Low FPRR usually points to a fixable, concentrated root cause.", "Also called first-pass acceptance."],
    related: { label: "Claims Submission", href: "/products/claims-submission" }, see: ["clean-claim", "claim-scrubbing", "denial-management"] },

  { slug: "days-in-ar", term: "Days in A/R", def: "The average number of days it takes to collect payment after a service is billed.",
    body: ["Days in A/R (accounts receivable) measures how fast cash comes in. Rising A/R days usually means follow-up is falling behind or denials are piling up. Lower and trending-down is the goal.", "It's a core cash-flow KPI alongside DNFB days."],
    related: { label: "Reporting & Analytics", href: "/products/reporting-analytics" }, see: ["ar-aging", "denial-management", "dnfb"] },

  { slug: "ar-aging", term: "A/R Aging", def: "A breakdown of outstanding receivables by how long they've been unpaid (e.g., 0–30, 31–60, 61–90, 90+ days).",
    body: ["The older a claim gets, the less likely it is to be paid — and it can cross timely-filing or appeal windows. A/R aging shows where follow-up needs to focus.", "Aged, small-balance A/R is a common place revenue quietly leaks."],
    related: { label: "Reporting & Analytics", href: "/products/reporting-analytics" }, see: ["days-in-ar", "timely-filing", "bad-debt"] },

  { slug: "clearinghouse", term: "Clearinghouse", def: "An intermediary that receives claims from providers, checks and formats them, and routes them to the correct payers.",
    body: ["Clearinghouses run a first layer of edits (rejections) before claims reach the payer, and return status and remittances back to the provider. They're the pipes between your billing system and hundreds of payers.", "A rejection at the clearinghouse is different from a payer denial."],
    related: { label: "Claims Submission", href: "/products/claims-submission" }, see: ["837", "era", "clean-claim"] },

  { slug: "eob", term: "EOB (Explanation of Benefits)", def: "A statement from a payer explaining what was covered, paid, adjusted or denied on a claim.",
    body: ["The EOB is the human-readable counterpart to the electronic ERA/835. It shows allowed amounts, payments, patient responsibility and any denial reasons. Posting from paper EOBs is slower and more error-prone than automated ERA posting.", "Patients also receive their own EOBs."],
    related: { label: "Payment Posting", href: "/products/payment-posting" }, see: ["era", "payment-posting", "patient-responsibility"] },

  { slug: "era", term: "ERA / 835 (Electronic Remittance Advice)", def: "The electronic file a payer sends that details how a claim was adjudicated — payments, adjustments and denial codes.",
    body: ["The ERA (in the 835 format) lets payments post automatically with line-level reconciliation, far faster than manual EOB entry. It carries the CARC/RARC codes that drive denial work.", "Automated 835 posting is a big time-saver in the back office."],
    related: { label: "Payment Posting", href: "/products/payment-posting" }, see: ["eob", "payment-posting", "carc"] },

  { slug: "837", term: "837 (Electronic Claim)", def: "The standard electronic format used to submit healthcare claims to payers.",
    body: ["The 837 is how claims travel from your billing system through a clearinghouse to payers (837P for professional, 837I for institutional). A well-formed, scrubbed 837 is what makes a clean claim.", "Its counterpart on the payment side is the 835/ERA."],
    related: { label: "Claims Submission", href: "/products/claims-submission" }, see: ["clean-claim", "clearinghouse", "era"] },

  { slug: "cpt-code", term: "CPT Code", def: "A standardized code that identifies the medical procedures and services a provider performed, for billing.",
    body: ["CPT (Current Procedural Terminology) codes describe what was done; they're paired with ICD-10 diagnosis codes that describe why. A mismatch between the two is a common cause of medical-necessity denials.", "Accurate CPT coding is central to correct reimbursement."],
    related: { label: "Charge Capture & Coding", href: "/products/charge-capture-coding" }, see: ["icd-10", "hcpcs", "modifier", "medical-necessity"] },

  { slug: "icd-10", term: "ICD-10 Code", def: "A standardized diagnosis code that describes a patient's condition — the 'why' behind a billed service.",
    body: ["ICD-10 diagnosis codes must support the procedures (CPT) billed; together they establish medical necessity. Incorrect or non-specific ICD-10 coding drives denials and underpayments.", "There are tens of thousands of ICD-10 codes."],
    related: { label: "Charge Capture & Coding", href: "/products/charge-capture-coding" }, see: ["cpt-code", "medical-necessity", "hcpcs"] },

  { slug: "hcpcs", term: "HCPCS Code", def: "A code set used mainly for products, supplies and services not covered by CPT — such as drugs, durable medical equipment and some procedures.",
    body: ["HCPCS Level II codes complement CPT, especially for Medicare and Medicaid billing. Using the right HCPCS code (and any required modifier) is essential for these items to pay.", "Often needed alongside CPT on the same claim."],
    related: { label: "Charge Capture & Coding", href: "/products/charge-capture-coding" }, see: ["cpt-code", "modifier", "medical-necessity"] },

  { slug: "modifier", term: "Modifier", def: "A two-character code appended to a CPT/HCPCS code to add detail — such as that a service was distinct, bilateral, or reduced.",
    body: ["Missing or incorrect modifiers are a frequent, avoidable denial reason. The right modifier tells the payer exactly how a service should be interpreted and paid.", "Modifier rules vary by payer and change over time."],
    related: { label: "Charge Capture & Coding", href: "/products/charge-capture-coding" }, see: ["cpt-code", "hcpcs", "denial-management"] },

  { slug: "medical-necessity", term: "Medical Necessity", def: "The requirement that a billed service be appropriate and necessary for the patient's diagnosis, per payer rules.",
    body: ["When the diagnosis (ICD-10) doesn't support the procedure (CPT), payers deny for lack of medical necessity. Catching these mismatches before submission — rather than after a denial — is a major lever on first-pass rates.", "Payer medical-necessity policies (LCDs/NCDs) define what's covered."],
    related: { label: "Charge Capture & Coding", href: "/products/charge-capture-coding" }, see: ["cpt-code", "icd-10", "denial-management"] },

  { slug: "coordination-of-benefits", term: "Coordination of Benefits (COB)", def: "The rules that determine which insurance pays first when a patient has more than one plan.",
    body: ["Getting COB order wrong — billing the secondary before the primary, for instance — leads to denials and delays. Verifying COB during eligibility prevents a whole category of rework.", "Common with patients who have both commercial and Medicare/Medicaid coverage."],
    related: { label: "Eligibility Verification", href: "/products/eligibility-verification" }, see: ["eligibility-verification", "patient-responsibility", "denial-management"] },

  { slug: "patient-responsibility", term: "Patient Responsibility", def: "The portion of a bill the patient owes — copays, deductibles and coinsurance — after insurance pays its share.",
    body: ["As plans shift more cost to patients, patient responsibility is a growing share of practice revenue and one of the hardest to collect. Clear estimates up front and easy payment options improve collection rates.", "Made up of copay, deductible and coinsurance."],
    related: { label: "Patient Statements & Collections", href: "/products/patient-collections" }, see: ["copay-deductible-coinsurance", "point-of-service-collections", "eob"] },

  { slug: "copay-deductible-coinsurance", term: "Copay, Deductible & Coinsurance", def: "The three forms of patient cost-sharing: a flat fee per visit (copay), an amount paid before coverage kicks in (deductible), and a percentage of costs after that (coinsurance).",
    body: ["These determine what the patient owes and are confirmed during eligibility verification. Collecting them accurately — ideally at the point of service — reduces the balances you have to chase later.", "Together they make up patient responsibility."],
    related: { label: "Eligibility Verification", href: "/products/eligibility-verification" }, see: ["patient-responsibility", "eligibility-verification", "point-of-service-collections"] },

  { slug: "point-of-service-collections", term: "Point-of-Service (POS) Collections", def: "Collecting the patient's expected responsibility at or before the visit, rather than billing them afterward.",
    body: ["Money is far easier to collect at the point of service than after the patient leaves. Accurate estimates from eligibility make POS collections practical and reduce downstream statements and bad debt.", "A key lever on patient-side revenue."],
    related: { label: "Patient Statements & Collections", href: "/products/patient-collections" }, see: ["patient-responsibility", "copay-deductible-coinsurance", "bad-debt"] },

  { slug: "underpayment", term: "Underpayment", def: "When a payer reimburses less than the contracted rate for a service.",
    body: ["Underpayments are silent revenue leakage — the claim 'paid,' so it's easy to miss without comparing to the contracted fee schedule. Identifying and appealing them recovers money you're owed.", "Detecting them requires loading payer fee schedules."],
    related: { label: "Reporting & Analytics", href: "/products/reporting-analytics" }, see: ["fee-schedule", "appeal", "net-collection-rate"] },

  { slug: "fee-schedule", term: "Fee Schedule", def: "The list of contracted rates a payer agrees to pay a provider for each service.",
    body: ["The fee schedule is the benchmark for what a claim should pay. Comparing actual payments to it surfaces underpayments and denials that would otherwise go unnoticed.", "Different payers and plans have different fee schedules."],
    related: { label: "Reporting & Analytics", href: "/products/reporting-analytics" }, see: ["underpayment", "net-collection-rate", "write-off"] },

  { slug: "write-off", term: "Write-Off", def: "An amount a provider removes from a patient's balance because it won't be collected — either contractually agreed or deemed uncollectible.",
    body: ["Contractual write-offs are the expected difference between billed charges and the contracted rate. Non-contractual write-offs (like bad debt) represent lost revenue and should be minimized.", "High avoidable write-offs signal RCM problems upstream."],
    related: { label: "Reporting & Analytics", href: "/products/reporting-analytics" }, see: ["bad-debt", "net-collection-rate", "fee-schedule"] },

  { slug: "timely-filing", term: "Timely Filing", def: "The deadline by which a claim must be submitted to a payer to be eligible for payment.",
    body: ["Miss the timely-filing window and the claim is denied with little recourse. Windows vary widely by payer, which is why fast, reliable claim submission and follow-up matter.", "Appeals also have their own deadlines."],
    related: { label: "Claims Submission", href: "/products/claims-submission" }, see: ["appeal", "ar-aging", "denial-management"] },

  { slug: "appeal", term: "Appeal", def: "A formal request asking a payer to reconsider a denied or underpaid claim.",
    body: ["Appeals must be filed within the payer's window and backed by the right documentation. Many recoverable denials are lost simply to missed deadlines, so speed and organization are decisive.", "Root-cause tracking reduces how many appeals you need to file."],
    related: { label: "Denial Management", href: "/products/denial-management" }, see: ["denial-management", "timely-filing", "underpayment"] },

  { slug: "payment-posting", term: "Payment Posting", def: "Recording payer and patient payments against claims and reconciling them line by line.",
    body: ["Accurate posting is what makes A/R trustworthy — it reveals underpayments, denials and patient balances. Automated ERA/835 posting is far faster and less error-prone than manual EOB entry.", "Posting feeds denial work and patient statements."],
    related: { label: "Payment Posting", href: "/products/payment-posting" }, see: ["era", "eob", "underpayment"] },

  { slug: "claim-scrubbing", term: "Claim Scrubbing", def: "Automatically checking a claim against payer and coding rules to catch errors before it's submitted.",
    body: ["Scrubbing is where you turn a dirty claim into a clean one — flagging missing modifiers, medical-necessity mismatches and incomplete data pre-submission. It's the single biggest lever on first-pass acceptance.", "Catching an error here is far cheaper than a denial later."],
    related: { label: "Claims Submission", href: "/products/claims-submission" }, see: ["clean-claim", "first-pass-resolution-rate", "modifier"] },

  { slug: "net-collection-rate", term: "Net Collection Rate", def: "The percentage of collectible revenue a practice actually collects, after contractual adjustments.",
    body: ["Net collection rate measures how well you collect what you're truly owed (excluding contractual write-offs). A rate below the mid-90s usually points to denials, underpayments or write-offs worth investigating.", "A core measure of RCM effectiveness."],
    related: { label: "Reporting & Analytics", href: "/products/reporting-analytics" }, see: ["gross-collection-rate", "underpayment", "write-off"] },

  { slug: "gross-collection-rate", term: "Gross Collection Rate", def: "Total payments divided by total charges — a rough measure heavily influenced by how charges are set.",
    body: ["Because billed charges are often much higher than contracted rates, gross collection rate is less meaningful than net collection rate for judging performance. It's still tracked for trend.", "Use it alongside, not instead of, net collection rate."],
    related: { label: "Reporting & Analytics", href: "/products/reporting-analytics" }, see: ["net-collection-rate", "fee-schedule", "write-off"] },

  { slug: "bad-debt", term: "Bad Debt", def: "Patient balances a practice ultimately can't collect and writes off as a loss.",
    body: ["Rising patient responsibility makes bad debt a growing risk. Clear estimates, point-of-service collection and easy digital payment reduce how much becomes uncollectible.", "Distinct from contractual write-offs, which are expected."],
    related: { label: "Patient Statements & Collections", href: "/products/patient-collections" }, see: ["patient-responsibility", "point-of-service-collections", "write-off"] },

  { slug: "credentialing", term: "Credentialing", def: "Verifying a provider's qualifications so they can be approved to deliver and bill for care.",
    body: ["Credentialing must be complete before a provider can be enrolled with payers. Lapses stall billing entirely — claims for an uncredentialed or unenrolled provider are denied.", "Closely tied to payer enrollment."],
    related: { label: "Managed Billing Services", href: "/products/managed-billing" }, see: ["enrollment", "npi", "denial-management"] },

  { slug: "enrollment", term: "Payer Enrollment", def: "Registering a credentialed provider with a payer so their claims can be processed and paid.",
    body: ["Enrollment gaps or lapses cause immediate denials — the payer simply won't recognize the provider. Keeping enrollment current across payers is essential to uninterrupted cash flow.", "Follows credentialing."],
    related: { label: "Managed Billing Services", href: "/products/managed-billing" }, see: ["credentialing", "npi", "denial-management"] },

  { slug: "npi", term: "NPI (National Provider Identifier)", def: "A unique 10-digit number that identifies a healthcare provider on claims and transactions.",
    body: ["Every billing provider and organization needs an NPI; it appears on claims and ties to credentialing and enrollment records. Wrong or missing NPIs cause rejections and denials.", "There are individual (Type 1) and organizational (Type 2) NPIs."],
    related: { label: "Managed Billing Services", href: "/products/managed-billing" }, see: ["credentialing", "enrollment", "clean-claim"] },
];

export const term = (slug) => TERMS.find((t) => t.slug === slug);

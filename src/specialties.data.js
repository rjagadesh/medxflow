// ─────────────────────────────────────────────────────────────────────────
//  MedXFlow specialties - vertical pages describing which processes AI agents
//  automate for each practice type, and the benefits. Each entry drives one
//  page rendered by SpecialtyPage.jsx at /specialties/<slug>.
//  A "group" is a workflow area; each process is [emoji, name, description].
//  Groups are ordered pain-first: the biggest revenue leak leads the page,
//  front-office / voice sits lower (except MedSpa, where it IS the top win).
//  Every specialty carries 20+ automatable processes end-to-end.
// ─────────────────────────────────────────────────────────────────────────

export const SPECIALTIES = [
  {
    slug: "podiatry",
    icon: "🦶",
    name: "Podiatry",
    eyebrow: "Specialty · Podiatry",
    h1a: "Routine foot care rules,",
    h1b: "handled before the claim.",
    tagline: "Podiatry revenue leaks in routine foot care coverage and at-risk documentation - Q modifiers, LCD limits and debridement frequency. AI agents get it right before the claim goes out.",
    overview: "Podiatry lives or dies on medical necessity and coverage rules: routine foot care is only covered for at-risk patients, nail and callus debridement has frequency limits, and Q7 to Q9 class-findings modifiers must match the documentation. MedXFlow supports coding, verifies coverage against Medicare LCDs, and runs claims, posting and denials end to end.",
    stat: { n: "Q7-Q9", suffix: "", label: "Class-findings modifiers matched to documentation so at-risk foot care gets paid" },
    groups: [
      { title: "Coding & documentation", note: "Where podiatry leaks.", processes: [
        ["🏷️", "Routine foot care & Q modifiers", "Applies Q7 to Q9 class-findings modifiers with documentation that supports at-risk status."],
        ["🎯", "Debridement frequency checks", "Flags nail and callus debridement against payer frequency limits before submission."],
        ["📝", "Medical-necessity prompts", "Prompts for the LOPS and vascular findings payers require."],
      ] },
      { title: "Eligibility & coverage", processes: [
        ["🛡️", "LCD coverage verification", "Verifies coverage against Medicare LCDs and routine-foot-care limits before care."],
        ["💳", "Benefit & copay surfacing", "Surfaces patient responsibility ahead of the visit."],
      ] },
      { title: "Prior authorization", processes: [
        ["📦", "Orthotics & surgery auth", "Submits authorizations for orthotics, DME and surgical procedures with documentation."],
        ["📡", "Auth status tracking", "Tracks authorizations to approval and flags expiring ones."],
      ] },
      { title: "Claims, posting & denials", processes: [
        ["🧼", "Claim scrubbing", "Scrubs claims for modifier and medical-necessity edits before submission."],
        ["🔧", "Denial management", "Works routine-foot-care and frequency denials by root cause."],
      ] },
    ],
    benefits: ["Fewer routine-foot-care and frequency denials", "Class-findings modifiers matched to documentation", "Coverage confirmed against LCDs before care", "Faster, cleaner claims"],
    faq: [
      { q: "When is routine foot care covered?", a: "Routine foot care is generally covered only for at-risk patients, such as those with diabetes and loss of protective sensation or vascular disease, and the documentation must support the Q7 to Q9 class-findings modifier billed. MedXFlow checks this before the claim goes out." },
      { q: "What are Q7, Q8 and Q9 modifiers in podiatry?", a: "They are class-findings modifiers indicating the severity of a patient's foot condition (one class-A finding, two class-B findings, or class-B plus class-C findings), which support medical necessity for otherwise-routine foot care." },
      { q: "Why are podiatry claims denied?", a: "The most common reasons are routine foot care billed without documented at-risk status, debridement exceeding payer frequency limits, and missing or mismatched class-findings modifiers. Verifying coverage and documentation up front prevents them." },
    ],
  },
  {
    slug: "speech-therapy",
    icon: "🗣️",
    name: "Speech Therapy",
    eyebrow: "Specialty · Speech-Language Pathology",
    h1a: "Therapy thresholds,",
    h1b: "documented and paid.",
    tagline: "Speech therapy revenue leaks in therapy thresholds and plan-of-care rules - the KX modifier, timed codes and visit limits. AI agents track them so covered therapy gets paid.",
    overview: "Speech-language pathology billing turns on therapy thresholds, the KX modifier once the threshold is passed, a compliant plan of care, and correct timed-versus-untimed coding. MedXFlow supports coding, tracks thresholds and authorizations, and runs claims, posting and denials end to end.",
    stat: { n: "KX", suffix: " modifier", label: "Applied at the therapy threshold with documentation so therapy keeps getting paid" },
    groups: [
      { title: "Coding & documentation", note: "Where SLP leaks.", processes: [
        ["🏷️", "SLP coding & KX modifier", "Supports evaluation and treatment coding and applies the KX modifier at the therapy threshold."],
        ["📝", "Plan-of-care tracking", "Tracks plan-of-care certification and recertification dates so claims stay compliant."],
      ] },
      { title: "Eligibility & benefits", processes: [
        ["🛡️", "Therapy benefit verification", "Verifies therapy coverage and remaining visit limits before care."],
        ["💳", "Copay & responsibility", "Surfaces patient responsibility ahead of the visit."],
      ] },
      { title: "Prior authorization", processes: [
        ["📦", "Therapy authorization", "Submits and tracks authorizations for continued therapy with documentation."],
        ["📡", "Auth & threshold alerts", "Flags approaching thresholds and expiring authorizations."],
      ] },
      { title: "Claims, posting & denials", processes: [
        ["🧼", "Claim scrubbing", "Scrubs claims for modifier and medical-necessity edits before submission."],
        ["🔧", "Denial management", "Works threshold and plan-of-care denials by root cause."],
      ] },
    ],
    benefits: ["Fewer threshold and plan-of-care denials", "KX modifier applied correctly with documentation", "Visit limits verified before care", "Faster cash on therapy claims"],
    faq: [
      { q: "What is the KX modifier in speech therapy?", a: "The KX modifier signals that therapy above the annual threshold is medically necessary and supported by documentation. Applying it correctly, with a compliant plan of care, is what keeps therapy above the threshold getting paid." },
      { q: "Why are speech therapy claims denied?", a: "Common reasons are missing the KX modifier above the threshold, an expired plan-of-care certification, and exceeding visit limits without authorization. Tracking thresholds and plan-of-care dates prevents them." },
    ],
  },
  {
    slug: "oncology",
    icon: "🎗️",
    name: "Oncology",
    eyebrow: "Specialty · Oncology",
    h1a: "High-dollar drug claims,",
    h1b: "nothing left on the table.",
    tagline: "Oncology revenue is high-dollar and authorization-heavy - chemotherapy J-codes, NDC units, drug wastage and prior auth. AI agents capture every unit and clear every auth before treatment.",
    overview: "Oncology carries some of the highest-dollar, most complex claims in medicine: chemotherapy and biologic J-codes billed by NDC units, JW drug-wastage capture, infusion time coding, and heavy prior authorization. A single missed unit or auth is expensive. MedXFlow supports drug and infusion coding, secures authorizations, and protects every dollar through posting and denials.",
    stat: { n: "JW", suffix: " modifier", label: "Drug wastage captured and NDC units billed correctly on high-dollar therapy" },
    groups: [
      { title: "Drug & infusion billing", note: "Where oncology leaks.", processes: [
        ["💊", "J-code & NDC unit billing", "Bills chemotherapy and biologic J-codes with correct NDC units so nothing is under-billed."],
        ["🧪", "Drug wastage (JW) capture", "Captures discarded drug with the JW modifier so wastage is reimbursed."],
        ["⏱️", "Infusion time coding", "Codes infusion and hydration time correctly, including sequential and concurrent rules."],
      ] },
      { title: "Prior authorization", processes: [
        ["📦", "Regimen authorization", "Submits chemotherapy and specialty-drug authorizations with clinical documentation."],
        ["📡", "Auth-to-treatment matching", "Confirms the authorization matches the regimen before treatment and tracks it to approval."],
      ] },
      { title: "Eligibility & benefits", processes: [
        ["🛡️", "Specialty-drug benefit checks", "Verifies medical and pharmacy benefit coverage for high-cost therapy."],
      ] },
      { title: "Claims, posting & denials", processes: [
        ["⚖️", "Underpayment detection", "Flags underpayments against contracted rates on high-dollar claims."],
        ["🔧", "Denial management", "Works authorization and unit denials fast, given the dollar stakes."],
      ] },
    ],
    benefits: ["Every drug unit and wastage captured", "Authorizations matched to the regimen", "Underpayments detected on high-dollar claims", "Fewer costly authorization denials"],
    faq: [
      { q: "How is chemotherapy billed?", a: "Chemotherapy and biologic drugs are billed with HCPCS J-codes by NDC units, alongside infusion administration codes for the time and complexity of delivery. Discarded drug is captured with the JW modifier. Accurate unit and wastage capture is essential because the dollars are large." },
      { q: "Why are oncology claims denied?", a: "Common reasons are missing or mismatched prior authorization for the regimen, incorrect NDC units, un-captured drug wastage, and infusion time-coding errors. Securing auth and capturing units correctly prevents most of them." },
    ],
  },
  {
    slug: "occupational-therapy",
    icon: "🖐️",
    name: "Occupational Therapy",
    eyebrow: "Specialty · Occupational Therapy",
    h1a: "Therapy thresholds,",
    h1b: "documented and paid.",
    tagline: "Occupational therapy revenue leaks in therapy thresholds and timed-code rules - the KX modifier, the 8-minute rule and plan-of-care compliance. AI agents keep covered therapy paid.",
    overview: "Occupational therapy billing turns on therapy thresholds and the KX modifier, correct timed-code units under the 8-minute rule, and a compliant plan of care. MedXFlow supports coding, tracks thresholds and authorizations, and runs claims, posting and denials end to end.",
    stat: { n: "8-min", suffix: " rule", label: "Timed therapy units calculated correctly so every billable unit is captured" },
    groups: [
      { title: "Coding & documentation", note: "Where OT leaks.", processes: [
        ["🏷️", "Timed-code units & KX", "Calculates timed-code units under the 8-minute rule and applies the KX modifier at the threshold."],
        ["📝", "Plan-of-care tracking", "Tracks plan-of-care certification and recertification so claims stay compliant."],
      ] },
      { title: "Eligibility & benefits", processes: [
        ["🛡️", "Therapy benefit verification", "Verifies therapy coverage and remaining visit limits before care."],
        ["💳", "Copay & responsibility", "Surfaces patient responsibility ahead of the visit."],
      ] },
      { title: "Prior authorization", processes: [
        ["📦", "Therapy authorization", "Submits and tracks authorizations for continued therapy with documentation."],
      ] },
      { title: "Claims, posting & denials", processes: [
        ["🧼", "Claim scrubbing", "Scrubs claims for modifier, unit and medical-necessity edits before submission."],
        ["🔧", "Denial management", "Works threshold, unit and plan-of-care denials by root cause."],
      ] },
    ],
    benefits: ["Timed units captured correctly under the 8-minute rule", "KX modifier applied with documentation", "Visit limits verified before care", "Fewer therapy denials"],
    faq: [
      { q: "What is the 8-minute rule in occupational therapy?", a: "The 8-minute rule determines how many timed treatment units you can bill based on total minutes of direct one-on-one therapy. Calculating units correctly is essential because errors either lose revenue or trigger denials." },
      { q: "Why are occupational therapy claims denied?", a: "Common reasons are incorrect timed-code units, missing the KX modifier above the therapy threshold, and expired plan-of-care certification. Automating unit calculation and threshold tracking prevents them." },
    ],
  },
  {
    slug: "pathology",
    icon: "🔬",
    name: "Pathology",
    eyebrow: "Specialty · Pathology",
    h1a: "High volume,",
    h1b: "every component billed.",
    tagline: "Pathology revenue leaks in component splits and volume - the technical and professional components, specimen-level coding and payer edits. AI agents bill every component correctly at scale.",
    overview: "Pathology bills high-volume, component-split claims: the technical component (TC) and professional component (26) must be billed correctly, specimens coded to the right CPT level, and claims scrubbed against payer edits. MedXFlow supports coding, verifies coverage, and runs claims, posting and denials at pathology volume.",
    stat: { n: "TC/26", suffix: "", label: "Technical and professional components split and billed correctly, every claim" },
    groups: [
      { title: "Coding & documentation", note: "Where pathology leaks.", processes: [
        ["🏷️", "Specimen CPT coding", "Codes specimens to the correct CPT level so nothing is under-coded."],
        ["🔀", "TC / professional split", "Applies TC and 26 modifiers so technical and professional components bill correctly."],
      ] },
      { title: "Eligibility & coverage", processes: [
        ["🛡️", "Coverage & medical necessity", "Verifies coverage and medical-necessity requirements for testing before billing."],
      ] },
      { title: "Claims & submission", processes: [
        ["🧼", "High-volume claim scrubbing", "Scrubs claims against payer and bundling edits at pathology volume."],
        ["🔄", "Claim status follow-up", "Polls status and chases stuck claims automatically."],
      ] },
      { title: "Posting & denials", processes: [
        ["💰", "Payment posting", "Auto-posts ERAs with line-level reconciliation."],
        ["🔧", "Denial management", "Works component-split and medical-necessity denials by root cause."],
      ] },
    ],
    benefits: ["Technical and professional components billed correctly", "Specimens coded to the right level", "Clean claims at high volume", "Fewer component and medical-necessity denials"],
    faq: [
      { q: "What is the technical vs professional component in pathology?", a: "The technical component (TC) covers the equipment, supplies and technician work; the professional component (modifier 26) covers the pathologist's interpretation. Billing them correctly, whether globally or split, is essential to getting paid for both." },
      { q: "Why are pathology claims denied?", a: "Common reasons are incorrect technical/professional component billing, specimen under-coding, and medical-necessity mismatches. Correct component coding and up-front coverage checks prevent them." },
    ],
  },
  {
    slug: "infusion",
    icon: "💉",
    name: "Infusion Therapy",
    eyebrow: "Specialty · Infusion Therapy",
    h1a: "High-cost drugs,",
    h1b: "every unit captured.",
    tagline: "Infusion revenue is high-dollar and authorization-heavy - J-codes by NDC units, infusion time coding, drug wastage and site-of-care auth. AI agents capture every unit and clear every auth.",
    overview: "Infusion therapy bills high-cost drugs by NDC units, time-based infusion and hydration codes with sequential and concurrent rules, JW drug-wastage capture, and site-of-care prior authorization. MedXFlow supports drug and infusion coding, secures authorizations, and protects every dollar through posting and denials.",
    stat: { n: "NDC", suffix: " units", label: "High-cost drug units and wastage captured so nothing is under-billed" },
    groups: [
      { title: "Drug & infusion billing", note: "Where infusion leaks.", processes: [
        ["💊", "J-code & NDC unit billing", "Bills infused drugs with correct J-codes and NDC units so nothing is under-billed."],
        ["⏱️", "Infusion & hydration time coding", "Codes initial, sequential and concurrent infusion and hydration time correctly."],
        ["🧪", "Drug wastage (JW) capture", "Captures discarded drug with the JW modifier so wastage is reimbursed."],
      ] },
      { title: "Prior authorization", processes: [
        ["📦", "Specialty-drug & site-of-care auth", "Submits specialty-drug and site-of-care authorizations with documentation and tracks them."],
      ] },
      { title: "Eligibility & benefits", processes: [
        ["🛡️", "Medical & pharmacy benefit checks", "Verifies whether the drug bills under the medical or pharmacy benefit before treatment."],
      ] },
      { title: "Claims, posting & denials", processes: [
        ["⚖️", "Underpayment detection", "Flags underpayments against contracted rates on high-dollar drug claims."],
        ["🔧", "Denial management", "Works authorization, unit and wastage denials by root cause."],
      ] },
    ],
    benefits: ["Every drug unit and wastage captured", "Infusion time coded correctly", "Site-of-care authorizations cleared", "Underpayments detected on high-dollar claims"],
    faq: [
      { q: "How is infusion therapy billed?", a: "Infused drugs are billed with HCPCS J-codes by NDC units, plus time-based infusion and hydration administration codes that follow initial, sequential and concurrent rules. Discarded drug is captured with the JW modifier. Accurate unit and time capture is critical because the drugs are expensive." },
      { q: "Why are infusion claims denied?", a: "Common reasons are missing site-of-care or specialty-drug authorization, incorrect NDC units, infusion time-coding errors, and un-captured wastage. Securing auth and capturing units correctly prevents most of them." },
    ],
  },
  {
    slug: "skilled-nursing",
    icon: "🛏️",
    name: "Skilled Nursing (SNF)",
    eyebrow: "Specialty · Skilled Nursing Facility",
    h1a: "PDPM and MDS,",
    h1b: "billed accurately.",
    tagline: "Skilled nursing revenue hinges on PDPM case-mix, MDS accuracy and consolidated billing. AI agents keep the MDS, benefit periods and claims aligned so payment matches the care delivered.",
    overview: "Skilled nursing facility billing is uniquely complex: PDPM case-mix driven by the MDS assessment, Medicare Part A benefit periods, consolidated billing rules, and Part B therapy. MedXFlow verifies eligibility and benefit periods, keeps MDS-linked billing aligned, and runs claims, posting and denials end to end.",
    stat: { n: "PDPM", suffix: "", label: "Case-mix and MDS-linked billing kept aligned so payment matches the care" },
    groups: [
      { title: "PDPM & MDS", note: "Where SNF leaks.", processes: [
        ["📊", "PDPM case-mix billing", "Aligns billing to the PDPM case-mix components driven by the MDS assessment."],
        ["📝", "MDS-linked documentation", "Flags where MDS timing and documentation must support the billed case-mix."],
      ] },
      { title: "Consolidated billing & benefits", processes: [
        ["🧾", "Consolidated billing rules", "Applies SNF consolidated-billing rules across Part A and Part B services."],
        ["📅", "Benefit-period tracking", "Tracks Medicare benefit periods and day counts so claims bill correctly."],
      ] },
      { title: "Eligibility & authorization", processes: [
        ["🛡️", "Coverage verification", "Verifies Medicare, Medicare Advantage and secondary coverage before and during the stay."],
      ] },
      { title: "Claims, posting & denials", processes: [
        ["💰", "Payment posting", "Auto-posts ERAs and reconciles by stay and period."],
        ["🔧", "Denial management", "Works case-mix, benefit-period and documentation denials by root cause."],
      ] },
    ],
    benefits: ["PDPM case-mix and MDS billing kept aligned", "Consolidated-billing rules applied correctly", "Benefit periods and day counts tracked", "Fewer documentation-driven denials"],
    faq: [
      { q: "What is PDPM in skilled nursing billing?", a: "PDPM (Patient-Driven Payment Model) is the Medicare payment model that sets SNF reimbursement based on patient characteristics captured in the MDS assessment, rather than therapy volume. Accurate MDS coding and aligned billing are essential to correct payment." },
      { q: "Why are skilled nursing claims denied?", a: "Common reasons are MDS timing or documentation that does not support the billed case-mix, consolidated-billing errors, and benefit-period or coverage issues. Keeping the MDS, benefit periods and claims aligned prevents them." },
    ],
  },
  {
    slug: "pediatrics",
    icon: "🧒",
    name: "Pediatrics",
    eyebrow: "Specialty · Pediatrics",
    h1a: "High volume, low margin,",
    h1b: "nothing left uncoded.",
    tagline: "Pediatric revenue leaks in vaccines and well-child visits - VFC reporting, EPSDT rules, immunization admin codes and Medicaid billing. AI agents capture every code across high volume.",
    overview: "Pediatrics runs on high volume and thin margins, which is exactly where revenue slips: Vaccines for Children (VFC) reporting, well-child and EPSDT visits, immunization product and administration codes, and heavy Medicaid and CHIP billing. MedXFlow supports coding, verifies coverage, and runs claims, posting and denials end to end.",
    stat: { n: "VFC", suffix: "", label: "Vaccine product and administration codes captured so no immunization is dropped" },
    groups: [
      { title: "Coding & documentation", note: "Where pediatrics leaks.", processes: [
        ["💉", "Vaccine & admin code capture", "Captures vaccine product and administration codes, including VFC reporting, so none are dropped."],
        ["📋", "Well-child & EPSDT coding", "Supports well-child and EPSDT visit coding with the correct age and screening components."],
        ["🏷️", "Sick-plus-well visit coding", "Codes same-day preventive-plus-problem visits with modifier 25 so both get paid."],
      ] },
      { title: "Eligibility & benefits", processes: [
        ["🛡️", "Medicaid & CHIP verification", "Verifies Medicaid, CHIP and commercial coverage at scale before visits."],
      ] },
      { title: "Claims & submission", processes: [
        ["🧼", "High-volume claim scrubbing", "Scrubs claims against payer and bundling edits at pediatric volume."],
      ] },
      { title: "Posting & denials", processes: [
        ["💰", "Payment posting", "Auto-posts ERAs with line-level reconciliation."],
        ["🔧", "Denial management", "Works immunization and EPSDT denials by root cause."],
      ] },
    ],
    benefits: ["Every vaccine and admin code captured", "Well-child and EPSDT coded correctly", "Coverage verified across Medicaid and CHIP", "Clean claims at pediatric volume"],
    faq: [
      { q: "How are pediatric vaccines billed?", a: "Each vaccine has a product code and a separate administration code, and Vaccines for Children (VFC) doses require specific reporting. Capturing both the product and administration codes for every immunization is where pediatric practices most often lose revenue." },
      { q: "What is EPSDT in pediatric billing?", a: "EPSDT (Early and Periodic Screening, Diagnostic and Treatment) is the Medicaid benefit for children's preventive and screening care. Coding well-child and EPSDT visits with the correct components is essential for full payment." },
    ],
  },
  {
    slug: "emergency-medicine",
    icon: "🚑",
    name: "Emergency Medicine",
    eyebrow: "Specialty · Emergency Medicine",
    h1a: "High acuity, high volume,",
    h1b: "coverage found and billed.",
    tagline: "Emergency medicine revenue leaks in E/M leveling and self-pay - ED level coding, critical care, and patients with no insurance on file. AI agents level correctly and find coverage.",
    overview: "Emergency medicine sees high acuity and high volume with a large share of self-pay and unknown-coverage patients. Revenue turns on correct ED E/M leveling (99281 to 99285), critical-care coding, and finding coverage for patients who present without insurance. MedXFlow supports coding, runs coverage discovery, and works claims, posting and denials end to end.",
    stat: { n: "99281-99285", suffix: "", label: "ED E/M levels coded to the documentation so acuity is billed correctly" },
    groups: [
      { title: "Coding & documentation", note: "Where the ED leaks.", processes: [
        ["🏷️", "ED E/M leveling", "Supports ED E/M level selection (99281 to 99285) matched to acuity and documentation."],
        ["⏱️", "Critical care & procedures", "Codes critical-care time and same-visit procedures with the correct modifiers."],
      ] },
      { title: "Eligibility & coverage discovery", processes: [
        ["🔎", "Coverage discovery", "Finds active coverage for patients who present as self-pay or with no insurance on file."],
        ["🛡️", "Eligibility verification", "Verifies coverage and benefits for identified payers."],
      ] },
      { title: "Claims & submission", processes: [
        ["🧼", "High-volume claim scrubbing", "Scrubs claims against payer and bundling edits at ED volume."],
      ] },
      { title: "Posting & denials", processes: [
        ["💰", "Payment posting", "Auto-posts ERAs with line-level reconciliation."],
        ["🔧", "Denial management", "Works level-of-service and coverage denials by root cause."],
      ] },
    ],
    benefits: ["ED levels coded to the documentation", "Coverage found for self-pay patients", "Clean claims at ED volume", "Fewer level-of-service and coverage denials"],
    faq: [
      { q: "How is emergency department E/M leveled?", a: "ED visits are coded 99281 to 99285 based on the complexity of the presenting problem, data reviewed, and risk, matched to the documentation. Correct leveling is essential because under-leveling loses revenue and over-leveling is a compliance risk." },
      { q: "How do you bill emergency visits for uninsured patients?", a: "Coverage discovery searches for active insurance the patient did not present, so self-pay and unknown-coverage visits can be billed to the right payer instead of written off. MedXFlow runs this automatically." },
    ],
  },
  {
    slug: "hospice",
    icon: "🕊️",
    name: "Hospice",
    eyebrow: "Specialty · Hospice",
    h1a: "Notices on time,",
    h1b: "per-diem billed right.",
    tagline: "Hospice revenue hinges on timely notices and levels of care - the NOE deadline, per-diem levels and benefit periods. AI agents keep notices, elections and claims on time.",
    overview: "Hospice billing runs on the Medicare hospice benefit: a Notice of Election filed within strict deadlines, per-diem billing by level of care, benefit-period tracking, and Notice of Termination/Revocation when care ends. A late NOE alone can forfeit days of payment. MedXFlow tracks notices and benefit periods and runs claims, posting and denials end to end.",
    stat: { n: "NOE", suffix: "", label: "Notice of Election filed within the deadline so no covered days are forfeited" },
    groups: [
      { title: "Election & notices", note: "Where hospice leaks.", processes: [
        ["📅", "NOE timely filing", "Tracks and files the Notice of Election within the deadline so days are not forfeited."],
        ["🧾", "NOTR & revocation handling", "Files Notice of Termination/Revocation accurately when care ends or changes."],
      ] },
      { title: "Levels of care & per-diem", processes: [
        ["🏷️", "Level-of-care per-diem billing", "Bills routine, continuous, respite and general inpatient care at the correct per-diem."],
        ["📝", "Documentation prompts", "Prompts for the documentation each level of care requires."],
      ] },
      { title: "Eligibility & benefits", processes: [
        ["🛡️", "Benefit-period verification", "Verifies hospice election and benefit periods before and during care."],
      ] },
      { title: "Claims, posting & denials", processes: [
        ["💰", "Payment posting", "Auto-posts ERAs and reconciles by period and level of care."],
        ["🔧", "Denial management", "Works NOE-timeliness and level-of-care denials by root cause."],
      ] },
    ],
    benefits: ["Notices filed within deadline so no days are forfeited", "Levels of care billed at the correct per-diem", "Benefit periods tracked accurately", "Fewer timeliness and documentation denials"],
    faq: [
      { q: "What is the Notice of Election (NOE) in hospice billing?", a: "The NOE tells Medicare a patient has elected hospice, and it must be filed within five calendar days of the start of care. A late NOE makes the hospice liable for the days before it was filed, so timely filing directly protects revenue." },
      { q: "How is hospice care billed?", a: "Hospice is paid per diem by level of care (routine home care, continuous home care, inpatient respite, and general inpatient), with documentation supporting the level billed. MedXFlow tracks notices, benefit periods and levels so claims are accurate and on time." },
    ],
  },
  {
    slug: "chiropractic",
    icon: "🦴",
    name: "Chiropractic",
    eyebrow: "Specialty · Chiropractic",
    h1a: "High visit volume,",
    h1b: "documentation that holds up.",
    tagline: "Chiropractic revenue leaks in medical necessity and coverage limits - visit caps, maintenance-care denials and modifier errors. AI agents catch it before the claim goes out and work the whole cycle behind it.",
    overview: "Chiropractic runs on high visit volume against tight payer rules: medical-necessity documentation, active-treatment vs maintenance-care distinctions, visit caps, and the AT modifier. MedXFlow supports coding and documentation, verifies benefits and visit limits before care, and runs claims, posting and denials end to end.",
    stat: { n: "AT", suffix: " modifier", label: "Active-treatment vs maintenance care flagged so covered visits get paid" },
    groups: [
      { title: "Coding & documentation", note: "Where chiropractic leaks.", processes: [
        ["🏷️", "CMT & modifier support", "Supports 98940 to 98943 spinal manipulation coding with the correct AT modifier."],
        ["📝", "Medical-necessity prompts", "Prompts for the documentation payers require to support active treatment."],
        ["🎯", "Maintenance-care flagging", "Flags visits at risk of maintenance-care denial before submission."],
      ] },
      { title: "Eligibility & benefits", processes: [
        ["🛡️", "Visit-limit verification", "Verifies coverage and remaining chiropractic visit limits before care."],
        ["💳", "Copay & cash-plan handling", "Surfaces patient responsibility and supports cash/wellness plans."],
      ] },
      { title: "Prior authorization", processes: [
        ["📦", "Extended-care authorization", "Submits authorizations for extended treatment plans with documentation."],
        ["📡", "Auth status tracking", "Tracks authorizations to approval and flags expiring ones."],
      ] },
      { title: "Claims, posting & denials", processes: [
        ["🧼", "Claim scrubbing", "Scrubs claims for modifier and medical-necessity edits before submission."],
        ["💰", "Payment posting & reconciliation", "Auto-posts ERAs and reconciles at line level."],
        ["🔧", "Denial management", "Works visit-limit and medical-necessity denials by root cause."],
      ] },
    ],
    benefits: ["Fewer maintenance-care and visit-limit denials", "Documentation that supports medical necessity", "Faster, cleaner high-volume claims", "Less front-desk time on benefits and caps"],
  },
  {
    slug: "urgent-care",
    icon: "⛑️",
    name: "Urgent Care",
    eyebrow: "Specialty · Urgent Care",
    h1a: "High volume,",
    h1b: "clean claims at speed.",
    tagline: "Urgent care lives on throughput - walk-ins, self-pay and fast eligibility. AI agents verify coverage in seconds, code the visit correctly, and keep clean claims flowing at volume.",
    overview: "Urgent care wins on speed and volume, which is exactly where revenue slips: unverified coverage on walk-ins, self-pay that had active insurance, S-codes and global-period rules, and E/M plus procedure coding. MedXFlow verifies eligibility instantly, supports coding, and runs claims, posting and denials end to end.",
    stat: { n: "S9083", suffix: "", label: "Global vs itemized urgent-care billing handled to each payer's rule" },
    groups: [
      { title: "Eligibility at speed", note: "Where urgent care leaks.", processes: [
        ["⚡", "Instant walk-in verification", "Verifies eligibility in seconds for walk-in patients before they are seen."],
        ["🔎", "Self-pay coverage discovery", "Finds active coverage for patients presenting as self-pay."],
        ["💳", "Point-of-service collection", "Surfaces copay and patient responsibility for collection at the desk."],
      ] },
      { title: "Coding & documentation", processes: [
        ["🏷️", "E/M plus procedure coding", "Supports E/M level selection with same-visit procedure coding and modifiers."],
        ["📋", "S-code & global billing", "Applies S9083/S9088 or itemized billing per each payer's requirement."],
      ] },
      { title: "Claims & submission", processes: [
        ["🧼", "High-volume claim scrubbing", "Scrubs claims against payer and bundling edits at urgent-care volume."],
        ["🔄", "Claim status follow-up", "Polls 276/277 status and chases stuck claims automatically."],
      ] },
      { title: "Posting & denials", processes: [
        ["💰", "Automated payment posting", "Auto-posts ERAs with line-level reconciliation."],
        ["🔧", "Denial management", "Works eligibility and coding denials fast, before filing deadlines."],
      ] },
    ],
    benefits: ["Coverage verified before care, even on walk-ins", "Fewer self-pay write-offs", "Clean claims at high throughput", "Faster cash with automated follow-up"],
  },
  {
    slug: "dme",
    icon: "🦽",
    name: "DME (Durable Medical Equipment)",
    eyebrow: "Specialty · DME",
    h1a: "Authorization-heavy,",
    h1b: "documentation that clears.",
    tagline: "DME revenue lives or dies on documentation and authorization - CMNs, medical necessity, and recurring rental billing. AI agents assemble the paperwork, track auths, and keep rentals billing on time.",
    overview: "DME is one of the most documentation- and authorization-intensive corners of billing: certificates of medical necessity, detailed written orders, prior authorization, and recurring rental cycles. MedXFlow verifies coverage, assembles and tracks authorizations, supports HCPCS coding, and keeps recurring claims and denials handled end to end.",
    stat: { n: "CMN", suffix: "", label: "Certificates of medical necessity assembled and tracked to approval" },
    groups: [
      { title: "Authorization & documentation", note: "Where DME leaks.", processes: [
        ["📦", "Prior authorization assembly", "Assembles and submits DME authorizations with the required documentation."],
        ["📝", "CMN & order tracking", "Tracks certificates of medical necessity and detailed written orders to completion."],
        ["📡", "Auth & expirable tracking", "Tracks authorizations and re-authorization dates so nothing lapses."],
      ] },
      { title: "Eligibility & benefits", processes: [
        ["🛡️", "Coverage & benefit checks", "Verifies DME coverage, rental-vs-purchase rules and patient responsibility."],
        ["🔗", "Medicare & secondary handling", "Handles Medicare DME rules and secondary coordination."],
      ] },
      { title: "Coding & claims", processes: [
        ["🏷️", "HCPCS & modifier support", "Supports HCPCS coding with rental (RR), purchase and other modifiers."],
        ["🔁", "Recurring rental billing", "Bills recurring rental cycles on time, every cycle."],
      ] },
      { title: "Posting & denials", processes: [
        ["💰", "Payment posting", "Auto-posts ERAs and reconciles rental and purchase payments."],
        ["🔧", "Denial management", "Works documentation and medical-necessity denials by root cause."],
      ] },
    ],
    benefits: ["Fewer documentation and medical-necessity denials", "Authorizations and CMNs tracked to approval", "Recurring rentals billed on time", "Less manual paperwork per order"],
  },
  {
    slug: "home-health",
    icon: "🏠",
    name: "Home Health",
    eyebrow: "Specialty · Home Health",
    h1a: "OASIS, PDGM,",
    h1b: "and cash that keeps moving.",
    tagline: "Home health revenue hinges on OASIS accuracy, PDGM periods and authorizations. AI agents verify coverage, track auths and periods, and keep claims and RAPs/final claims flowing end to end.",
    overview: "Home health billing is uniquely complex: OASIS-driven PDGM periods, LUPA thresholds, authorizations, and the RAP-to-final-claim cycle. MedXFlow verifies eligibility, tracks authorizations and 30-day periods, supports coding, and runs claims, posting and denials so cash does not stall between periods.",
    stat: { n: "PDGM", suffix: "", label: "30-day periods and LUPA thresholds tracked so claims bill correctly" },
    groups: [
      { title: "Periods & authorization", note: "Where home health leaks.", processes: [
        ["📅", "PDGM period tracking", "Tracks 30-day PDGM periods and LUPA visit thresholds to avoid underpayment."],
        ["📦", "Authorization management", "Submits and tracks payer authorizations across the episode."],
        ["📝", "OASIS-linked documentation prompts", "Prompts for the documentation that supports the billed period."],
      ] },
      { title: "Eligibility & benefits", processes: [
        ["🛡️", "Coverage & benefit verification", "Verifies home-health coverage and benefit periods before care."],
        ["🔗", "Medicare & MA plan handling", "Handles Medicare and Medicare Advantage home-health rules."],
      ] },
      { title: "Claims cycle", processes: [
        ["🧾", "RAP & final claim handling", "Manages the notice-of-admission and final-claim cycle on time."],
        ["🔄", "Claim status follow-up", "Polls status and chases stuck claims automatically."],
      ] },
      { title: "Posting & denials", processes: [
        ["💰", "Payment posting", "Auto-posts ERAs and reconciles by period."],
        ["🔧", "Denial management", "Works authorization and documentation denials by root cause."],
      ] },
    ],
    benefits: ["PDGM periods and LUPA thresholds handled correctly", "Authorizations tracked across the episode", "RAP and final claims filed on time", "Fewer documentation-driven denials"],
  },
  {
    slug: "radiology",
    icon: "🩻",
    name: "Radiology",
    eyebrow: "Specialty · Radiology",
    h1a: "Prior auth heavy,",
    h1b: "denials caught upstream.",
    tagline: "Radiology's biggest leak is prior authorization - imaging that needs it and does not have it is denied. AI agents detect, submit and track auths, split technical and professional components, and work the cycle end to end.",
    overview: "Radiology carries some of the highest prior-authorization burden in medicine, plus technical/professional component splits and modifier complexity. MedXFlow detects auth requirements, submits and tracks them, supports TC/26 and imaging coding, and runs claims, posting and denials so imaging revenue is not lost to paperwork.",
    stat: { n: "TC/26", suffix: "", label: "Technical and professional components split and billed correctly" },
    groups: [
      { title: "Prior authorization", note: "Where radiology leaks.", processes: [
        ["🔎", "Auto-detect auth requirements", "Flags which imaging orders need authorization the moment they are ordered."],
        ["📤", "Submit with documentation", "Submits imaging authorizations with clinical justification."],
        ["📡", "Status tracking", "Tracks authorizations to approval and surfaces at-risk cases before the scan."],
      ] },
      { title: "Coding & documentation", processes: [
        ["🏷️", "TC / professional component split", "Applies TC and 26 modifiers so technical and professional components bill correctly."],
        ["📋", "Imaging coding support", "Supports CPT imaging coding with contrast and laterality modifiers."],
      ] },
      { title: "Eligibility & claims", processes: [
        ["🛡️", "Eligibility verification", "Verifies coverage and imaging benefits before service."],
        ["🧼", "Claim scrubbing", "Scrubs claims against payer and bundling edits before submission."],
      ] },
      { title: "Posting & denials", processes: [
        ["💰", "Payment posting", "Auto-posts ERAs with line-level reconciliation."],
        ["🔧", "Denial management", "Works authorization and medical-necessity denials by root cause."],
      ] },
    ],
    benefits: ["Fewer authorization-related imaging denials", "Technical and professional components billed correctly", "Authorizations cleared before the scan", "Faster cash with automated follow-up"],
  },
  {
    slug: "ambulatory-surgery-center",
    icon: "🏥",
    name: "Ambulatory Surgery Center (ASC)",
    eyebrow: "Specialty · ASC",
    h1a: "High-dollar claims,",
    h1b: "nothing left on the table.",
    tagline: "ASC claims are high-dollar and complex - implants, multiple procedures, and authorization. AI agents secure auths, code implants and multiple procedures correctly, and protect every dollar through posting and denials.",
    overview: "Ambulatory surgery centers bill high-dollar, high-complexity claims: implant and device coding, multiple-procedure discounting and modifiers, and prior authorization. A single missed auth or implant line is expensive. MedXFlow secures authorizations, supports implant and procedure coding, verifies benefits, and runs claims, posting and denials end to end.",
    stat: { n: "51", suffix: " modifier", label: "Multiple-procedure discounting and implant lines coded correctly" },
    groups: [
      { title: "Authorization", note: "Where ASC revenue leaks.", processes: [
        ["📦", "Surgical prior authorization", "Detects and submits authorizations for scheduled procedures with documentation."],
        ["📡", "Auth-to-schedule matching", "Confirms the authorization matches the exact procedure and provider before surgery."],
        ["📅", "Status tracking", "Tracks authorizations to approval and escalates at-risk cases pre-op."],
      ] },
      { title: "Coding & documentation", processes: [
        ["🏷️", "Implant & device coding", "Supports implant and device HCPCS coding so high-dollar lines are captured."],
        ["🔢", "Multiple-procedure modifiers", "Applies modifier 51 and multiple-procedure discounting correctly."],
      ] },
      { title: "Eligibility & claims", processes: [
        ["🛡️", "Benefit verification", "Verifies surgical benefits and patient responsibility before the procedure."],
        ["🧼", "Claim scrubbing", "Scrubs high-dollar claims against payer and bundling edits."],
      ] },
      { title: "Posting & denials", processes: [
        ["💰", "Payment posting & underpayment detection", "Auto-posts ERAs and flags underpayments against contracted rates."],
        ["🔧", "Denial management", "Works authorization and coding denials fast, given the dollar stakes."],
      ] },
    ],
    benefits: ["Authorizations matched to the exact procedure", "Implant and high-dollar lines captured", "Underpayments detected against contracts", "Fewer costly authorization denials"],
  },
  {
    slug: "primary-care",
    icon: "🩺",
    name: "Primary Care",
    eyebrow: "Specialty · Primary Care",
    h1a: "High volume,",
    h1b: "nothing left on the table.",
    tagline:
      "At primary-care volume, the money leaks in coding - E/M levels, preventive-plus-problem, AWV/CCM/RPM and risk-adjustment gaps. AI agents catch it before the claim goes out, across the whole cycle.",
    overview:
      "Primary care wins on volume, prevention and chronic-care management - which is exactly where revenue slips away. AI agents support E/M and preventive-plus-problem coding, capture AWV, CCM and RPM, and flag open HCC and risk-adjustment gaps before the visit closes - then run eligibility, claims, posting, denials and collections behind it.",
    stat: { n: "25", suffix: " modifier", label: "Preventive-plus-problem visits split correctly so both get paid, automatically" },
    groups: [
      {
        title: "Coding & documentation",
        note: "Where the volume leaks.",
        processes: [
          ["🏷️", "E/M & preventive-plus-problem coding", "Supports E/M level selection and preventive-plus-problem visits with modifier 25."],
          ["📋", "AWV, CCM & RPM capture", "Captures annual-wellness, chronic-care-management and remote-monitoring codes you're leaving behind."],
          ["🎯", "HCC / risk-adjustment gap flagging", "Flags open HCC and risk-adjustment gaps before the visit closes."],
          ["📝", "ICD-10 specificity prompts", "Prompts for the specific diagnosis codes chronic conditions require."],
          ["🔁", "Transitional Care Management capture", "Catches billable TCM after a hospital discharge."],
          ["💉", "Immunization & admin code capture", "Captures vaccine product and administration codes so none are dropped."],
        ],
      },
      {
        title: "Eligibility & benefits",
        processes: [
          ["🛡️", "Real-time verification at scale", "Verifies eligibility for every visit and distinguishes preventive vs. problem coverage."],
          ["🔎", "Coverage discovery for self-pay", "Finds active coverage for patients who present as self-pay."],
          ["🔗", "Secondary coverage / COB detection", "Detects secondary and tertiary plans and coordinates benefits."],
        ],
      },
      {
        title: "Prior authorization & referrals",
        processes: [
          ["📦", "Medication prior authorization", "Assembles and submits medication PAs with clinical justification."],
          ["↪️", "Imaging & specialist referral auth", "Requests referral authorizations and routes them to the right specialist."],
          ["🔄", "Referral loop tracking", "Tracks outbound referrals to close the loop and recapture the patient."],
        ],
      },
      {
        title: "Claims & submission",
        processes: [
          ["🧼", "Claim scrubbing & NCCI edits", "Scrubs claims against payer and bundling edits before submission."],
          ["🔄", "Claim status follow-up", "Polls 276/277 status and chases stuck claims."],
        ],
      },
      {
        title: "Payments, denials & AR",
        processes: [
          ["🏦", "ERA auto-posting", "Posts 835 remittances and contractual adjustments automatically."],
          ["🔎", "Denial classification & auto-appeals", "Classifies denials and drafts appeals for preventive-vs-problem and medical-necessity."],
          ["🗂️", "AR worklist prioritization", "Prioritizes the AR worklist by recoverable dollars and timely-filing risk."],
        ],
      },
      {
        title: "Patient engagement & collections",
        processes: [
          ["🔔", "Preventive & chronic recall", "Drives annual-wellness and chronic-care recall automatically."],
          ["🧮", "Point-of-service estimates & collection", "Estimates patient responsibility and collects at the desk."],
          ["💳", "Statements & payment plans", "Sends statements, reminders and self-service payment plans."],
        ],
      },
      {
        title: "Front office",
        processes: [
          ["📞", "High-volume call answering & booking", "Absorbs call volume and books preventive and chronic-care visits."],
          ["📇", "Digital intake & insurance-card capture", "Collects demographics and captures/reads the insurance card up front."],
        ],
      },
      {
        title: "Analytics",
        processes: [
          ["📊", "Panel & quality-gap dashboards", "Surfaces open care gaps and value-based quality measures."],
        ],
      },
    ],
    benefits: [
      "Split preventive-plus-problem visits so both get paid",
      "Capture AWV, CCM and RPM revenue you're leaving behind",
      "Close HCC and risk-adjustment gaps before the visit ends",
      "Verify eligibility for every visit, at scale",
      "Automate medication and referral prior auths",
      "Recover preventive-vs-problem denials",
    ],
  },

  {
    slug: "medspa",
    icon: "💆",
    name: "MedSpa & Aesthetics",
    eyebrow: "Specialty · MedSpa & Aesthetics",
    h1a: "Every lead answered.",
    h1b: "Every unit accounted for.",
    tagline:
      "Medspas run on speed, recurring visits and a tricky cosmetic-vs-medical billing line. MedXFlow's AI agents cover the whole journey - from the missed inbound call to retreatment reminders - while keeping you audit-safe on the services that touch insurance.",
    overview:
      "Most medspa revenue leaks happen at two points: the phone that rings during a treatment, and the cosmetic-vs-medical boundary that gets documented wrong. MedXFlow's agents answer every lead in seconds, keep the book full, reconcile every tox unit and payment, and turn retreatment timing into predictable recurring revenue.",
    stat: { n: "60", suffix: "s", label: "From a web form or Instagram DM to an AI call-back - before the lead goes cold" },
    groups: [
      {
        title: "Front-office & lead-to-booking",
        note: "Highest volume, biggest immediate win.",
        processes: [
          ["📞", "Voice AI for inbound calls", "Medspas lose a large share of leads to unanswered phones during treatments. A 24/7 agent answers every call, explains services and books directly into Boulevard or Zenoti."],
          ["⚡", "Outbound speed-to-lead", "A web form or Instagram DM triggers an AI call within 60 seconds - conversion drops sharply after five minutes."],
          ["🔁", "No-show & cancellation recovery", "Automated waitlist backfill instantly offers a freed slot to the next patient, keeping the book full."],
          ["💬", "Consultation-to-treatment follow-up", "Timed nurture sequences close the classic drop-off between the consult and the booked treatment."],
        ],
      },
      {
        title: "Coding & documentation compliance",
        note: "The real audit-risk area.",
        processes: [
          ["⚖️", "Cosmetic-vs-medical flagging", "Reviews chart notes to flag cosmetic services documented as medically necessary - the single largest audit exposure in this vertical."],
          ["💉", "Unit reconciliation", "Reconciles tox units drawn vs. documented vs. billed, with JW/JZ wastage-modifier validation."],
          ["🏷️", "CPT/ICD suggestion with a hard gate", "Auto-suggests codes from the treatment note, with a hard gate on the cosmetic/medical boundary."],
        ],
      },
      {
        title: "Revenue operations",
        note: "Applies even to 100% cash-pay medspas.",
        processes: [
          ["📦", "Package & membership deferred revenue", "Tracks sold vs. rendered vs. expired across packages and memberships."],
          ["💳", "Payment reconciliation", "Matches Square, Stripe, CareCredit and Cherry against the PM system."],
          ["🎁", "Loyalty credit application", "Applies Allē and Aspire credits - today almost always manual."],
          ["📊", "Injector commission calculation", "Calculates commissions tiered by service line and product cost."],
        ],
      },
      {
        title: "Prior authorization (the medical slice)",
        processes: [
          ["📦", "PA packet assembly", "For therapeutic Botox (migraine, hyperhidrosis) and vein procedures, the agent assembles conservative-therapy documentation, duplex findings and prior-treatment history."],
          ["🧾", "Payer-specific policy matching", "Auto-checks the encounter against the payer's LCD/policy criteria before submission."],
          ["⏱", "PA status polling & expiry", "Polls authorization status by voice agent or portal RPA, and tracks expiry."],
        ],
      },
      {
        title: "Eligibility & benefits",
        processes: [
          ["🛡️", "Real-time 270/271", "Verifies coverage for covered services plus deductible/out-of-pocket status, so the front desk quotes accurately."],
          ["🔍", "Cosmetic vs. covered at booking", "Flags which services are cosmetic vs. potentially covered at booking time - preventing the patient-collections mess later."],
        ],
      },
      {
        title: "Inventory & cost control",
        processes: [
          ["📈", "Predictive ordering", "Forecasts tox and filler orders by each injector's consumption pattern."],
          ["⏳", "Expiry tracking & waste attribution", "Tracks expiry on high-cost vials and attributes waste by provider."],
          ["💰", "Margin-per-service analytics", "Shows which services actually make money - most medspas genuinely don't know."],
        ],
      },
      {
        title: "Denials & AR",
        note: "Small volume, high per-claim value.",
        processes: [
          ["🧾", "Denial classification & auto-appeals", "Classifies denials and generates appeal letters for the recurring reasons: medical necessity, missing PA, cosmetic exclusion."],
          ["🔎", "Underpayment detection", "Flags payments that fall below contracted rates."],
        ],
      },
      {
        title: "Patient communications & retention",
        processes: [
          ["🔔", "Retreatment reminders", "Product-duration reminders (tox ~3-4 months, filler by type) drive the recurring-revenue engine - usually run off a spreadsheet today."],
          ["📋", "Pre/post-treatment instructions", "Delivers modality-timed prep and aftercare automatically."],
          ["⭐", "Review solicitation", "Times review requests to each patient's peak-result window."],
        ],
      },
      {
        title: "Marketing intelligence",
        processes: [
          ["🎯", "Revenue attribution", "Attributes ad spend all the way through to treatment revenue, not just bookings."],
          ["📉", "Churn prediction", "Predicts membership churn before it happens."],
        ],
      },
    ],
    benefits: [
      "Stop losing leads to unanswered phones - every call answered 24/7",
      "Reach new leads in under 60 seconds, while intent is hottest",
      "Stay audit-safe on the cosmetic-vs-medical boundary",
      "Reconcile every tox unit and wastage modifier",
      "See true margin per service and per injector",
      "Turn retreatment timing into predictable recurring revenue",
      "Reconcile Square, Stripe, CareCredit, Cherry and loyalty credits automatically",
      "Keep the book full with automatic waitlist backfill",
    ],
  },

  {
    slug: "dental",
    icon: "🦷",
    name: "Dental",
    eyebrow: "Specialty · Dental",
    h1a: "Verify the plan.",
    h1b: "Attach the proof.",
    tagline:
      "Dental revenue leaks at verification and attachments - plans with maximums, frequencies and downgrades, and claims that reject without X-rays and narratives. AI agents get the whole cycle right before the claim leaves.",
    overview:
      "Dental practices juggle complex plan structures, frequent eligibility changes and attachment-hungry claims. AI agents verify benefits down to frequencies and downgrades, auto-attach the right documentation, code and appeal - and keep the hygiene schedule full.",
    stat: { n: "1", suffix: " min", label: "Full benefit breakdown - maximums, frequencies, downgrades - before the patient sits down" },
    groups: [
      {
        title: "Insurance verification & benefits",
        note: "The number-one dental leak.",
        processes: [
          ["🛡️", "Real-time eligibility & plan breakdown", "Pulls annual maximums, frequencies, downgrades and waiting periods before the visit."],
          ["📄", "Patient-responsibility estimation", "Computes what the patient owes so the front desk quotes accurately."],
          ["🔗", "Coordination of benefits", "Detects dual coverage and orders primary/secondary correctly."],
          ["🗓", "Frequency & history check", "Confirms last cleaning, exam and X-ray dates against plan frequencies."],
        ],
      },
      {
        title: "Claims & documentation",
        processes: [
          ["📎", "Attachment automation", "Auto-attaches X-rays, perio charts and narratives so claims don't reject."],
          ["🏷️", "CDT coding assistance", "Suggests CDT codes from the clinical note and flags likely downgrades (e.g., composite to amalgam)."],
          ["✍️", "Narrative generation", "Drafts medical-necessity narratives for scaling, crowns and extractions."],
          ["🔁", "Medical-dental cross-coding", "Cross-codes eligible procedures to CPT for medical billing (e.g., surgical extractions, appliances)."],
          ["🧾", "Predetermination submission & tracking", "Submits and tracks predeterminations for major work."],
        ],
      },
      {
        title: "Prior authorization",
        processes: [
          ["📦", "Pre-treatment estimates for major work", "Requests PAs/estimates for crowns, implants and perio."],
          ["😬", "Ortho authorization & lifetime-max tracking", "Handles ortho authorizations and tracks the orthodontic lifetime maximum."],
        ],
      },
      {
        title: "Payments, denials & AR",
        processes: [
          ["🏦", "ERA/EOB auto-posting", "Posts electronic remittances and write-offs automatically."],
          ["🔎", "Denial & downgrade appeals", "Auto-generates appeals for common dental denials and downgrades."],
          ["📉", "Underpayment vs. fee-schedule detection", "Flags payments below the contracted fee schedule."],
          ["🗂️", "AR follow-up worklist", "Prioritizes aged claims by recoverable value and filing deadline."],
        ],
      },
      {
        title: "Patient billing & collections",
        processes: [
          ["💳", "Statements & reminders", "Sends statements and balance reminders by text and email."],
          ["📅", "Payment & membership-plan billing", "Runs payment plans and in-house membership-plan billing."],
          ["🧮", "Treatment-plan financial presentation", "Turns the treatment plan into a clear patient-cost breakdown at the desk."],
        ],
      },
      {
        title: "Front office & scheduling",
        processes: [
          ["🔁", "Recall & hygiene reactivation", "Automated 6-month recall and reactivation of lapsed patients."],
          ["🪑", "No-show & waitlist backfill", "Fills cancellations from the waitlist automatically."],
          ["📞", "24/7 call answering & booking", "Answers overflow calls and books into Dentrix, Eaglesoft or Open Dental."],
          ["📇", "New-patient digital forms & insurance capture", "Collects forms and captures the insurance card before arrival."],
        ],
      },
      {
        title: "Analytics",
        processes: [
          ["📊", "Production & unscheduled-treatment dashboards", "Tracks production, collections and unscheduled treatment to recover."],
        ],
      },
    ],
    benefits: [
      "Verify every plan's maximums, frequencies and downgrades before the chair",
      "Cut claim rejections with automatic X-ray and narrative attachments",
      "Quote accurate patient responsibility up front",
      "Appeal downgrades and denials in a click",
      "Reactivate lapsed recall patients without manual chasing",
      "Fill cancelled slots from the waitlist automatically",
    ],
  },

  {
    slug: "dermatology",
    icon: "🧴",
    name: "Dermatology",
    eyebrow: "Specialty · Dermatology",
    h1a: "Medical and cosmetic,",
    h1b: "billed cleanly.",
    tagline:
      "Two businesses under one roof - the cosmetic-vs-medical coding line is the biggest audit risk, and biologics are the biggest PA burden. AI agents keep both clean across the whole cycle.",
    overview:
      "Dermatology mixes medical and cosmetic work with procedure-heavy coding and expensive biologics. AI agents keep the cosmetic-vs-medical line clean, get modifiers right on lesion removals and Mohs, assemble biologic authorizations, and run claims, posting and denials behind it.",
    stat: { n: "25", suffix: " & 59", label: "Modifiers validated automatically on same-day procedures and lesion removals" },
    groups: [
      {
        title: "Coding & compliance",
        note: "The biggest audit risk.",
        processes: [
          ["⚖️", "Cosmetic-vs-medical flagging", "Flags cosmetic services documented as medically necessary and holds the boundary."],
          ["🏷️", "Procedure coding & path correlation", "Codes biopsies, excisions and Mohs, correlating with pathology results."],
          ["🎯", "Modifier accuracy", "Validates modifiers 25 and 59 on same-day services."],
          ["🔢", "Lesion & specimen reconciliation", "Reconciles lesion count and size with specimens submitted and billed."],
          ["📝", "E/M + procedure same-day coding", "Supports a significant, separate E/M billed with a same-day procedure."],
        ],
      },
      {
        title: "Prior authorization (biologics)",
        note: "The biggest PA burden.",
        processes: [
          ["📦", "Biologic PA assembly & renewal", "Assembles step-therapy documentation and prior-treatment history for biologics (e.g., Dupixent), and tracks renewals."],
          ["🧾", "Payer-policy matching", "Checks the encounter against payer criteria before submission."],
          ["💊", "Specialty-pharmacy coordination", "Runs the benefit investigation and coordinates the specialty pharmacy."],
          ["🎟️", "Copay-assistance / PAP enrollment", "Enrolls eligible patients in copay-assistance and patient-assistance programs."],
        ],
      },
      {
        title: "Eligibility & the cosmetic/medical split",
        processes: [
          ["🛡️", "Eligibility & benefits", "Verifies coverage and out-of-pocket for medical services."],
          ["🔍", "Cosmetic vs. medical at booking", "Flags cosmetic vs. medical at booking time to prevent collections issues later."],
          ["🧮", "Cosmetic cost estimate", "Produces a self-pay estimate for cosmetic services up front."],
        ],
      },
      {
        title: "Claims & submission",
        processes: [
          ["🧼", "Claim scrubbing & NCCI edits", "Scrubs claims against bundling and payer edits."],
          ["🔬", "Pathology claim reconciliation", "Reconciles professional and technical pathology components."],
          ["🔄", "Claim status follow-up", "Polls status and chases stuck claims."],
        ],
      },
      {
        title: "Payments, denials & AR",
        processes: [
          ["🏦", "ERA auto-posting", "Posts remittances and adjustments automatically."],
          ["🔎", "Medical-necessity & lesion-removal appeals", "Auto-drafts appeals for lesion-removal and medical-necessity denials."],
          ["📉", "Underpayment detection", "Flags payments below contracted rates."],
        ],
      },
      {
        title: "Patient collections",
        processes: [
          ["💳", "Cosmetic pre-payment & self-pay collection", "Collects cosmetic payment before service."],
          ["📅", "Statements & payment plans", "Sends statements and offers self-service payment plans."],
        ],
      },
      {
        title: "Front office",
        processes: [
          ["🔁", "Recall & skin-check reminders", "Drives annual skin-check recall and reactivation."],
          ["📞", "Call answering & booking", "Answers calls and books into EMA/ModMed or Nextech."],
        ],
      },
      {
        title: "Analytics",
        processes: [
          ["📊", "Cosmetic vs. medical revenue mix", "Dashboards the cosmetic/medical revenue split and denial trends."],
        ],
      },
    ],
    benefits: [
      "Keep the cosmetic-vs-medical line clean and audit-safe",
      "Get modifiers 25 and 59 right, every time",
      "Correlate coding with pathology automatically",
      "Speed biologic prior auths with auto-assembled step-therapy docs",
      "Verify coverage before medical procedures",
      "Recover lesion-removal denials fast",
    ],
  },

  {
    slug: "eye-care",
    icon: "👁️",
    name: "Eye Care",
    eyebrow: "Specialty · Ophthalmology & Optometry",
    h1a: "Every dose authorized,",
    h1b: "billed and reconciled.",
    tagline:
      "Eye-care revenue concentrates in expensive injectables and the medical-vs-vision split. AI agents assemble anti-VEGF authorizations, reconcile buy-and-bill down to the wasted unit, route every claim to the right payer, and work the rest of the cycle.",
    overview:
      "The money in eye care rides on high-cost injectable drugs and a benefit split that trips up the front desk. Anti-VEGF PAs, J-code units and drug wastage are unforgiving, and sending a claim to the wrong plan means a write-off. MedXFlow's agents handle the parts that leak the most - and everything downstream.",
    stat: { n: "JW/JZ", suffix: "", label: "Drug wastage documented on every single-use anti-VEGF vial, automatically" },
    groups: [
      {
        title: "Injectable drug authorization & buy-and-bill",
        note: "Biggest dollars, biggest pain.",
        processes: [
          ["📦", "Anti-VEGF prior authorization", "Assembles PA packets for Eylea, Lucentis, Avastin and Vabysmo - diagnosis, prior therapy and imaging - and tracks renewals."],
          ["💉", "J-code units & wastage", "Reconciles drug units drawn vs. documented vs. billed, with JW/JZ wastage-modifier validation on single-use vials."],
          ["💳", "Buy-and-bill reconciliation", "Matches drug purchases to administered doses and payments, so nothing bought goes unbilled."],
          ["📦", "Drug inventory & lot/expiry tracking", "Tracks vials by lot and expiry to prevent waste and stockouts."],
          ["🎟️", "Copay-assistance enrollment", "Enrolls patients in manufacturer copay and assistance programs."],
        ],
      },
      {
        title: "Medical vs. vision benefit determination",
        note: "The routing that decides who pays.",
        processes: [
          ["🔀", "Route to the right plan", "Determines medical vs. routine-vision coverage before the visit and sends the claim to the correct payer."],
          ["🛡️", "Dual-benefit verification", "Verifies both medical and vision benefits, copays and frequency limits."],
          ["👓", "Vision-plan eligibility & authorization", "Checks VSP/EyeMed eligibility and materials authorizations."],
        ],
      },
      {
        title: "Coding & compliance",
        processes: [
          ["🏷️", "Retina & imaging coding", "Codes OCT, fundus photography and visual fields, respecting payer frequency limits."],
          ["⚖️", "Eye codes vs. E/M", "Chooses correctly between Eye codes (920xx) and E/M (992xx)."],
          ["↔️", "Bilateral & modifier accuracy", "Applies RT/LT/50 and other modifiers correctly."],
          ["🗓", "Post-cataract global tracking", "Tracks the surgical global period so post-op visits bill correctly."],
        ],
      },
      {
        title: "Prior authorization (procedures)",
        processes: [
          ["📦", "Cataract, YAG, laser & oculoplastics PA", "Assembles authorizations and medical-necessity documentation for procedures."],
          ["🧾", "Medical-necessity matching", "Matches the encounter to payer coverage criteria."],
        ],
      },
      {
        title: "Claims & submission",
        processes: [
          ["🧼", "Claim scrubbing & NCCI edits", "Scrubs claims against bundling and payer edits."],
          ["🔄", "Claim status follow-up", "Polls status and chases stuck claims."],
        ],
      },
      {
        title: "Payments, denials & AR",
        processes: [
          ["🏦", "ERA auto-posting", "Posts remittances and adjustments automatically."],
          ["🔎", "Drug & imaging denial recovery", "Auto-appeals anti-VEGF and imaging-frequency denials."],
          ["📉", "Underpayment detection", "Flags J-code payments below contracted or ASP-based rates."],
        ],
      },
      {
        title: "Patient collections",
        processes: [
          ["💳", "Refraction & non-covered collection", "Collects refraction and other non-covered fees at the desk."],
          ["📅", "Statements & payment plans", "Sends statements and offers payment plans."],
        ],
      },
      {
        title: "Front office & scheduling",
        processes: [
          ["🔁", "Recall for chronic care", "Recalls glaucoma, diabetic-eye and injection-series patients on schedule."],
          ["📞", "Call answering & scheduling", "Answers calls and schedules clinic visits, imaging and injections."],
        ],
      },
      {
        title: "Analytics",
        processes: [
          ["📊", "Drug-margin & denial dashboards", "Dashboards drug margin, wastage and denial trends."],
        ],
      },
    ],
    benefits: [
      "Never leave a bought anti-VEGF dose unbilled",
      "Document drug wastage (JW/JZ) on every single-use vial",
      "Send each claim to the right payer - medical or vision",
      "Respect imaging frequency limits to avoid denials",
      "Choose Eye codes vs. E/M correctly",
      "Recover anti-VEGF and imaging denials fast",
    ],
  },

  {
    slug: "behavioral-health",
    icon: "🧠",
    name: "Mental & Behavioral Health",
    eyebrow: "Specialty · Mental & Behavioral Health",
    h1a: "Never lose a session",
    h1b: "to an expired auth.",
    tagline:
      "Authorization-heavy, session-based billing done right - expired auths and exceeded units are the top leaks. AI agents renew authorizations before units run out and run the recurring cycle end to end.",
    overview:
      "Behavioral health lives and dies on authorizations and recurring session billing. Missed auths, exceeded units and telehealth modifier errors are the top revenue leaks. AI agents renew auths before units run out, bill telehealth correctly, scrub recurring claims, and work denials and collections.",
    stat: { n: "0", suffix: "", label: "Sessions billed against an expired or exhausted authorization" },
    groups: [
      {
        title: "Prior authorization & units",
        note: "The number-one leak.",
        processes: [
          ["📦", "Auth request & renewal", "Assembles medical-necessity documentation and submits or renews authorizations before units run out."],
          ["⏱", "Unit & visit tracking", "Tracks authorized vs. used sessions and alerts before expiry."],
          ["🔁", "Concurrent / continued-stay review", "Prepares continued-stay documentation for IOP/PHP levels of care."],
          ["🚨", "Auth-expiry alerts", "Warns clinicians before an authorization lapses mid-treatment."],
        ],
      },
      {
        title: "Coding & claims",
        processes: [
          ["🏷️", "Session coding & modifiers", "Validates time-based CPT (90837 vs. 90834), telehealth POS/modifiers (95, GT) and add-on codes."],
          ["➕", "Add-on & crisis-code capture", "Captures interactive-complexity and crisis codes when documented."],
          ["🔄", "Recurring claim scrubbing", "Scrubs and submits recurring session claims automatically."],
          ["📝", "Time / documentation match check", "Confirms documented time supports the code billed."],
        ],
      },
      {
        title: "Eligibility & benefits",
        processes: [
          ["🛡️", "Behavioral-health eligibility", "Verifies coverage, copays and visit limits - often carved out to a separate payer."],
          ["🔗", "Carve-out & secondary detection", "Detects behavioral carve-outs and secondary coverage."],
          ["🤝", "EAP session verification", "Confirms EAP session authorizations and remaining visits."],
        ],
      },
      {
        title: "Claims & submission",
        processes: [
          ["📤", "Claim submission & edits", "Submits claims through the clearinghouse with payer edits applied."],
          ["🔄", "Claim status follow-up", "Polls 276/277 status and chases stuck claims."],
        ],
      },
      {
        title: "Payments, denials & AR",
        processes: [
          ["🏦", "ERA auto-posting", "Posts remittances and adjustments automatically."],
          ["🔎", "Auth & modifier denial recovery", "Auto-appeals the recurring denials: no auth, exceeded units, wrong modifier."],
          ["🗂️", "AR worklist prioritization", "Prioritizes AR by recoverable value and timely-filing risk."],
        ],
      },
      {
        title: "Patient collections",
        processes: [
          ["🧾", "Superbill generation", "Generates out-of-network superbills for patient reimbursement."],
          ["📅", "Sliding-scale & payment plans", "Runs sliding-scale billing, statements and payment plans."],
        ],
      },
      {
        title: "Intake & scheduling",
        processes: [
          ["🔁", "Recurring appointment & no-show management", "Holds recurring slots, reminds patients and backfills cancellations."],
          ["📞", "Intake call answering & booking", "Answers inbound, screens and books into the EHR (SimplePractice, TherapyNotes, Kareo)."],
          ["📇", "Digital intake & consent forms", "Collects intake, consent and insurance details before the first session."],
        ],
      },
      {
        title: "Analytics",
        processes: [
          ["📊", "Utilization & no-show dashboards", "Tracks authorization utilization and no-show patterns."],
        ],
      },
    ],
    benefits: [
      "Never lose revenue to an expired authorization again",
      "Track authorized vs. used units in real time",
      "Bill telehealth sessions with the correct POS and modifiers",
      "Automate recurring session claims",
      "Verify carved-out behavioral benefits before intake",
      "Recover auth- and modifier-driven denials",
    ],
  },

  {
    slug: "physical-therapy",
    icon: "🏃",
    name: "Physical Therapy",
    eyebrow: "Specialty · Physical Therapy",
    h1a: "Watch the visit cap.",
    h1b: "Bill the units right.",
    tagline:
      "Visit caps, plan-of-care recerts and the 8-minute rule are where PT revenue leaks. AI agents track every authorized visit, validate every timed unit, and run claims and collections behind it.",
    overview:
      "Physical therapy is recurring, authorization-limited and easy to under- or over-bill. AI agents track authorized visits, validate timed-code units and threshold modifiers, remind on plan-of-care recertification, and keep the schedule and the cash flowing.",
    stat: { n: "8", suffix: "-min rule", label: "Timed-code units validated on every visit, automatically" },
    groups: [
      {
        title: "Authorization & visit tracking",
        note: "The number-one leak.",
        processes: [
          ["📦", "Auth request & renewal", "Requests and renews authorizations before visits run out."],
          ["⏱", "Visit & recert tracking", "Tracks authorized vs. used visits and reminds on plan-of-care recertification."],
          ["✍️", "Plan-of-care signature tracking", "Chases physician signatures on the plan of care before they cost a claim."],
          ["🔁", "Continued-authorization requests", "Prepares continued-auth requests as visit counts run down."],
        ],
      },
      {
        title: "Coding & claims",
        processes: [
          ["🏷️", "Timed-unit & modifier validation", "Validates units under the 8-minute rule and checks modifiers (GP, KX, 59)."],
          ["🧩", "CCI edit check", "Checks timed vs. untimed code pairs against CCI edits."],
          ["📝", "Evaluation-complexity coding", "Supports the correct evaluation-complexity level from the note."],
          ["🔄", "Recurring claim scrubbing", "Scrubs and submits recurring visit claims automatically."],
        ],
      },
      {
        title: "Eligibility & therapy caps",
        processes: [
          ["🛡️", "Benefits & cap tracking", "Verifies PT benefits and visit limits, and tracks the KX-modifier threshold."],
          ["🔗", "Secondary coverage detection", "Detects secondary plans and coordinates benefits."],
        ],
      },
      {
        title: "Claims & submission",
        processes: [
          ["📤", "Claim submission", "Submits scrubbed claims through the clearinghouse."],
          ["🔄", "Claim status follow-up", "Polls status and chases stuck claims."],
        ],
      },
      {
        title: "Payments, denials & AR",
        processes: [
          ["🏦", "ERA auto-posting", "Posts remittances and adjustments automatically."],
          ["🔎", "Cap & auth denial recovery", "Auto-appeals therapy-cap and authorization denials."],
          ["📉", "Underpayment detection", "Flags payments below contracted rates."],
        ],
      },
      {
        title: "Patient collections",
        processes: [
          ["💳", "Point-of-service copay collection", "Collects copays and coinsurance at each visit."],
          ["📅", "Statements & payment plans", "Sends statements and offers payment plans."],
        ],
      },
      {
        title: "Scheduling & plan of care",
        processes: [
          ["🪑", "No-show & waitlist backfill", "Reminds patients and backfills cancellations."],
          ["📞", "Booking & recurring series", "Answers calls and sets up recurring visit series in the EMR."],
          ["📇", "Digital intake & insurance capture", "Collects intake and captures the insurance card up front."],
        ],
      },
      {
        title: "Analytics",
        processes: [
          ["📊", "Visits-per-case & cancellation dashboards", "Tracks utilization, cancellations and cap risk."],
        ],
      },
    ],
    benefits: [
      "Never bill past an authorized visit count",
      "Get the 8-minute rule right on every timed code",
      "Track the KX-modifier threshold automatically",
      "Stay ahead of plan-of-care recertification dates",
      "Automate recurring visit claims",
      "Recover cap and authorization denials",
    ],
  },

  {
    slug: "physical-rehabilitation",
    icon: "🩼",
    name: "Physical Rehabilitation",
    eyebrow: "Specialty · Physical Rehabilitation (PT · OT · Speech)",
    h1a: "Every authorized visit,",
    h1b: "every discipline, tracked.",
    tagline:
      "Multi-discipline rehab lives on authorizations, visit limits and recert deadlines - multiplied across PT, OT and speech. AI agents track each discipline separately and run the full billing cycle behind it.",
    overview:
      "Rehabilitation revenue leaks through lapsed authorizations, missed plan-of-care recertifications and timed-unit coding errors - each multiplied across PT, OT and speech. MedXFlow's agents track every discipline's authorized visits, flag recerts before they expire, validate every timed unit, and work claims, posting and denials.",
    stat: { n: "3", suffix: " disciplines", label: "PT, OT and speech authorizations tracked separately, so none lapses" },
    groups: [
      {
        title: "Authorization & visit-limit tracking",
        note: "The number-one leak.",
        processes: [
          ["📦", "Auth request & renewal by discipline", "Requests and renews authorizations for PT, OT and speech, each tracked separately."],
          ["⏱", "Visit-limit tracking", "Tracks authorized vs. used visits per discipline and alerts before the cap."],
          ["🔁", "Concurrent review", "Prepares concurrent-review documentation for inpatient and SNF settings."],
          ["🔗", "Cross-discipline cap coordination", "Coordinates shared caps across disciplines so nothing double-counts."],
        ],
      },
      {
        title: "Plan of care & recertification",
        processes: [
          ["🗓", "Recert deadline tracking", "Flags plan-of-care recertification dates and missing physician signatures."],
          ["📈", "Progress reporting", "Prompts required progress notes and functional reporting at the right intervals."],
          ["🏁", "Discharge planning documentation", "Assembles discharge documentation and outcomes."],
        ],
      },
      {
        title: "Coding & compliance",
        processes: [
          ["🏷️", "Timed-unit & modifier validation", "Validates units under the 8-minute rule and discipline modifiers (GP, GO, GN)."],
          ["👥", "Co-treatment & group rules", "Applies co-treatment and group-vs-individual billing rules."],
          ["🎯", "KX threshold tracking", "Tracks the therapy-threshold amount and applies the KX modifier when appropriate."],
          ["📋", "Functional-outcome coding", "Captures Section GG / functional-outcome data in facility settings."],
        ],
      },
      {
        title: "Eligibility & benefits",
        processes: [
          ["🛡️", "Benefits & cap verification", "Verifies therapy benefits and visit limits across disciplines."],
          ["🔗", "Secondary coverage detection", "Detects secondary plans and coordinates benefits."],
        ],
      },
      {
        title: "Claims, payments & AR",
        processes: [
          ["🧼", "Claim submission & scrubbing", "Scrubs and submits claims through the clearinghouse."],
          ["🏦", "ERA auto-posting", "Posts remittances and adjustments automatically."],
          ["🔎", "Cap, auth & recert denial recovery", "Auto-appeals the recurring denials: exceeded cap, no auth, expired recert."],
        ],
      },
      {
        title: "Patient collections",
        processes: [
          ["💳", "Point-of-service collection", "Collects copays and coinsurance at each visit."],
          ["📅", "Statements & payment plans", "Sends statements and offers payment plans."],
        ],
      },
      {
        title: "Scheduling",
        processes: [
          ["📞", "Booking & recurring series", "Sets up recurring visit series across disciplines."],
          ["🪑", "No-show & waitlist backfill", "Reminds patients and backfills cancellations."],
        ],
      },
      {
        title: "Analytics",
        processes: [
          ["📊", "Discipline utilization & denial dashboards", "Tracks utilization and denials by discipline."],
        ],
      },
    ],
    benefits: [
      "Track PT, OT and speech authorizations separately",
      "Never bill past an authorized visit count",
      "Stay ahead of every plan-of-care recert deadline",
      "Get the 8-minute rule and discipline modifiers right",
      "Apply the KX modifier at the threshold",
      "Recover cap, auth and recert denials",
    ],
  },

  {
    slug: "cardiology",
    icon: "🫀",
    name: "Cardiology",
    eyebrow: "Specialty · Cardiology",
    h1a: "High-value procedures,",
    h1b: "authorized and coded right.",
    tagline:
      "Advanced imaging and device procedures carry heavy prior-auth and complex coding - that's where cardiology revenue is won or lost. AI agents match clinical criteria, split professional vs. technical, and run the whole cycle.",
    overview:
      "Cardiology's revenue is concentrated in high-value imaging and procedures that are PA-heavy and easy to miscode. AI agents assemble authorization packets that match payer criteria, code cath, EP and echo correctly, and detect underpayments - then run claims, posting, denials and collections.",
    stat: { n: "26", suffix: " / TC", label: "Professional vs. technical split handled automatically on every study" },
    groups: [
      {
        title: "Prior authorization",
        note: "The number-one leak.",
        processes: [
          ["📦", "Advanced-imaging & device PA", "Assembles PAs for nuclear studies, CT/MR angiography and device procedures, matching clinical criteria."],
          ["⏱", "PA status polling & expiry", "Polls status and tracks authorization expiry."],
          ["✅", "Appropriate-use (AUC) matching", "Checks studies against appropriate-use criteria before ordering."],
          ["🤝", "Peer-to-peer scheduling", "Books and preps peer-to-peer reviews when a PA is challenged."],
        ],
      },
      {
        title: "Coding & compliance",
        processes: [
          ["🏷️", "Cath, EP & echo coding", "Codes catheterization, EP and echo studies from the report."],
          ["⚖️", "Professional/technical split", "Applies modifiers 26 and TC correctly by setting."],
          ["🧩", "Bundling / NCCI check", "Checks device and procedure combinations against bundling edits."],
          ["📝", "Diagnostic vs. interventional coding", "Distinguishes diagnostic from interventional services in the same session."],
        ],
      },
      {
        title: "Eligibility & benefits",
        processes: [
          ["🛡️", "Coverage & OOP for high-cost procedures", "Verifies coverage and out-of-pocket before expensive studies and procedures."],
          ["🔗", "Secondary coverage detection", "Detects secondary plans and coordinates benefits."],
          ["🧮", "Good Faith Estimate", "Produces a self-pay Good Faith Estimate where required."],
        ],
      },
      {
        title: "Claims & submission",
        processes: [
          ["🧼", "Claim scrubbing", "Scrubs claims against payer and bundling edits."],
          ["📎", "Report attachment automation", "Attaches procedure and imaging reports to claims."],
          ["🔄", "Claim status follow-up", "Polls status and chases stuck claims."],
        ],
      },
      {
        title: "Payments, denials & AR",
        processes: [
          ["🏦", "ERA auto-posting", "Posts remittances and adjustments automatically."],
          ["🔎", "Imaging-PA denial recovery", "Auto-appeals imaging authorization denials."],
          ["📉", "Underpayment detection", "Flags procedure payments below contracted rates."],
        ],
      },
      {
        title: "Patient collections",
        processes: [
          ["💳", "Point-of-service estimate & collection", "Estimates and collects patient responsibility before the procedure."],
          ["📅", "Statements & payment plans", "Sends statements and offers payment plans."],
        ],
      },
      {
        title: "Front office",
        processes: [
          ["📞", "Call answering & test scheduling", "Answers calls and schedules tests and procedures."],
          ["↪️", "Referral intake & tracking", "Captures inbound referrals and tracks them to a booked visit."],
        ],
      },
      {
        title: "Analytics",
        processes: [
          ["📊", "Procedure-margin & denial dashboards", "Dashboards procedure margin and denial trends."],
        ],
      },
    ],
    benefits: [
      "Match payer criteria on every advanced-imaging PA",
      "Split professional vs. technical automatically",
      "Code cath, EP and echo studies from the report",
      "Verify out-of-pocket before high-cost procedures",
      "Catch underpayments on contracted procedure rates",
      "Recover imaging authorization denials",
    ],
  },

  {
    slug: "orthopedics",
    icon: "🦴",
    name: "Orthopedics",
    eyebrow: "Specialty · Orthopedics",
    h1a: "Surgery, imaging, DME -",
    h1b: "authorized and tracked.",
    tagline:
      "Surgery-heavy and DME-heavy, orthopedics needs tight prior auth and global-period discipline - the biggest sources of lost revenue. AI agents assemble PAs, keep modifiers and globals straight, and run the full cycle.",
    overview:
      "Orthopedics combines surgery, advanced imaging, injections and durable medical equipment - each with its own authorization and coding rules. AI agents assemble PAs, track global periods, get surgical modifiers and DME HCPCS right, and work claims, posting, denials and collections.",
    stat: { n: "90", suffix: "-day globals", label: "Global periods tracked so post-op visits are billed correctly" },
    groups: [
      {
        title: "Prior authorization",
        note: "The number-one leak.",
        processes: [
          ["📦", "MRI, injection, surgery & DME PA", "Assembles authorizations for imaging, injections, surgery and durable medical equipment (braces)."],
          ["⏱", "PA status & expiry tracking", "Polls status and tracks expiry."],
          ["🧾", "Conservative-therapy documentation", "Assembles the conservative-treatment history payers require before surgery."],
          ["🤝", "Peer-to-peer scheduling", "Books and preps peer-to-peer reviews when a PA is challenged."],
        ],
      },
      {
        title: "Coding & compliance",
        processes: [
          ["🏷️", "Surgical coding & global periods", "Codes procedures and tracks 10/90-day global periods."],
          ["⚖️", "Modifier accuracy", "Validates modifiers 24, 25, 58, 78 and 79."],
          ["🦿", "DME HCPCS coding", "Codes braces and equipment with the correct HCPCS and modifiers."],
          ["🧩", "Bundling & assistant-surgeon check", "Checks NCCI bundling and assistant-surgeon eligibility."],
        ],
      },
      {
        title: "Eligibility & benefits",
        processes: [
          ["🛡️", "Surgical & DME coverage", "Verifies coverage and produces out-of-pocket estimates for surgery and DME."],
          ["🔗", "Secondary coverage detection", "Detects secondary plans and coordinates benefits."],
        ],
      },
      {
        title: "Claims & submission",
        processes: [
          ["📎", "Operative-note attachment", "Attaches operative notes and imaging to surgical claims."],
          ["🧼", "Claim scrubbing", "Scrubs claims against payer and bundling edits."],
          ["🔄", "Claim status follow-up", "Polls status and chases stuck claims."],
        ],
      },
      {
        title: "Payments, denials & AR",
        processes: [
          ["🏦", "ERA auto-posting", "Posts remittances and adjustments automatically."],
          ["🔎", "Surgical & DME denial recovery", "Auto-appeals surgical and DME denials."],
          ["📉", "Underpayment detection", "Flags payments below contracted surgical rates."],
        ],
      },
      {
        title: "Patient collections",
        processes: [
          ["💳", "Surgery pre-payment & collection", "Collects the estimated patient portion before surgery."],
          ["📅", "Statements & payment plans", "Sends statements and offers payment plans."],
        ],
      },
      {
        title: "Front office",
        processes: [
          ["📞", "Call answering & surgical scheduling", "Answers calls and coordinates surgical and clinic scheduling."],
          ["↪️", "Referral intake & tracking", "Captures inbound referrals and tracks them to a booked visit."],
        ],
      },
      {
        title: "Analytics",
        processes: [
          ["📊", "Surgical-yield & denial dashboards", "Dashboards surgical conversion and denial trends."],
        ],
      },
    ],
    benefits: [
      "Assemble PAs for imaging, injections, surgery and DME",
      "Track 10- and 90-day global periods automatically",
      "Get surgical modifiers (24, 25, 58, 78, 79) right",
      "Produce accurate surgical and DME out-of-pocket estimates",
      "Recover surgical and DME denials",
      "Catch underpayments on contracted rates",
    ],
  },
];

export const bySpecialtySlug = (slug) => SPECIALTIES.find((s) => s.slug === slug) || null;

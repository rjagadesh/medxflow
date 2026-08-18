// Denial code database. Each entry is a common CARC (Claim Adjustment Reason
// Code) or RARC (Remittance Advice Remark Code) that medical billers search by
// exact code. Descriptions follow the official X12 standard wording; the
// meaning / cause / fix are plain-English guidance. Plain JS (no JSX) so both
// the React renderer and the Node prerender can import it.
//
// Group prefixes: CO = Contractual Obligation (provider write-off, do not bill
// the patient) · PR = Patient Responsibility (bill the patient) · OA = Other
// Adjustment · PI = Payer-Initiated reduction.

export const CODES = [
  { code: "CO-45", slug: "co-45", cat: "Contractual", official: "Charge exceeds fee schedule/maximum allowable or contracted/legislated fee arrangement.",
    meaning: "The amount billed is higher than the payer's contracted (allowed) rate. The difference is a contractual write-off, not a patient balance.",
    cause: "Standard on nearly every paid claim - it is the gap between your charge and the payer's fee schedule. It is only a problem if the allowed amount itself looks wrong (a possible underpayment).",
    fix: "Usually no action - post the contractual adjustment. If the allowed amount is below your contracted rate, it is an underpayment worth appealing against the fee schedule." },

  { code: "CO-16", slug: "co-16", cat: "Missing Info", official: "Claim/service lacks information or has submission/billing error(s).",
    meaning: "The claim is missing required information or has an error. It is almost always paired with a RARC that names the specific missing field.",
    cause: "Missing or invalid data - provider identifiers, diagnosis, modifiers, or other required fields.",
    fix: "Read the accompanying RARC (for example N290, MA130) to find the exact missing field, correct it, and resubmit." },

  { code: "CO-97", slug: "co-97", cat: "Bundling", official: "The benefit for this service is included in the payment/allowance for another service/procedure that has already been adjudicated.",
    meaning: "This service is bundled into another service that was already paid, so it is not paid separately.",
    cause: "Global surgical packages, incidental procedures, or NCCI bundling edits.",
    fix: "Check whether an unbundling modifier (such as 59 or an X modifier) is appropriate and supported by documentation. If bundling is correct, write it off." },

  { code: "CO-18", slug: "co-18", cat: "Duplicate", official: "Exact duplicate claim/service.",
    meaning: "The payer received this exact claim/service already.",
    cause: "The claim was submitted twice, or a resubmission was read as a duplicate rather than a corrected claim.",
    fix: "Confirm the original claim's status. If a correction is needed, submit a corrected claim (frequency code 7), not a fresh duplicate." },

  { code: "CO-22", slug: "co-22", cat: "COB", official: "This care may be covered by another payer per coordination of benefits.",
    meaning: "Another insurer should be billed first under coordination of benefits.",
    cause: "Wrong primary/secondary order, or the patient has other coverage the payer knows about.",
    fix: "Verify COB order during eligibility, bill the correct primary payer first, then submit to this payer with the primary's remittance." },

  { code: "CO-29", slug: "co-29", cat: "Timely Filing", official: "The time limit for filing has expired.",
    meaning: "The claim was submitted after the payer's filing deadline.",
    cause: "The claim sat too long before submission, or a denial was not reworked inside the window.",
    fix: "If you have proof of timely submission (clearinghouse reports), appeal with it. Otherwise this is usually a write-off. Prevent it with fast, tracked submission and follow-up." },

  { code: "CO-50", slug: "co-50", cat: "Medical Necessity", official: "These are non-covered services because this is not deemed a 'medical necessity' by the payer.",
    meaning: "The payer decided the service was not medically necessary as billed.",
    cause: "The diagnosis (ICD-10) does not support the procedure (CPT) under the payer's medical-necessity policy (LCD/NCD).",
    fix: "Review the payer's medical-necessity policy, confirm the diagnosis supports the service, correct coding if warranted, and appeal with documentation." },

  { code: "CO-96", slug: "co-96", cat: "Coverage", official: "Non-covered charge(s).",
    meaning: "The service is not covered under the plan. Often paired with a RARC explaining why.",
    cause: "The service is excluded from the plan, or coverage/benefit details were not verified.",
    fix: "Check the RARC for specifics, verify benefits, and determine whether the patient is responsible (with a valid ABN/waiver where required) or whether to appeal." },

  { code: "CO-97-N290", slug: "co-97-n290", cat: "Missing Info", official: "RARC N290: Missing/incomplete/invalid rendering provider primary identifier.",
    meaning: "The rendering provider's NPI is missing, incomplete, or invalid on the claim.",
    cause: "Wrong or missing NPI, or a provider not properly linked/enrolled with the payer.",
    fix: "Correct the rendering provider NPI, confirm enrollment with the payer, and resubmit." },

  { code: "CO-109", slug: "co-109", cat: "Wrong Payer", official: "Claim/service not covered by this payer/contractor. You must send the claim/service to the correct payer/contractor.",
    meaning: "This is the wrong payer for the claim.",
    cause: "Incorrect insurance on file, a plan change, or the member belongs to a different plan/contractor.",
    fix: "Re-verify eligibility, identify the correct payer, and resubmit there." },

  { code: "CO-197", slug: "co-197", cat: "Prior Auth", official: "Precertification/authorization/notification/pre-treatment absent.",
    meaning: "A required prior authorization, precertification, or notification was not obtained.",
    cause: "The service needed prior auth and it was missing, expired, or not attached to the claim.",
    fix: "Locate the authorization number and appeal, or request a retro-authorization if the payer allows. Prevent it by checking auth requirements before the service." },

  { code: "CO-204", slug: "co-204", cat: "Coverage", official: "This service/equipment/drug is not covered under the patient's current benefit plan.",
    meaning: "The item or service is not a covered benefit under this plan.",
    cause: "Plan exclusion, or benefits not verified before the service.",
    fix: "Verify benefits, determine patient responsibility (with an ABN where applicable), or appeal if you believe it should be covered." },

  { code: "PR-1", slug: "pr-1", cat: "Patient Responsibility", official: "Deductible amount.",
    meaning: "This amount is applied to the patient's deductible and is the patient's responsibility.",
    cause: "The patient has not yet met their plan deductible.",
    fix: "Bill the patient for the deductible amount. Verify deductible status at eligibility so you can collect up front." },

  { code: "PR-2", slug: "pr-2", cat: "Patient Responsibility", official: "Coinsurance amount.",
    meaning: "This amount is the patient's coinsurance and is their responsibility.",
    cause: "The plan requires the patient to pay a percentage of the allowed amount.",
    fix: "Bill the patient for the coinsurance. Confirm coinsurance at eligibility to estimate patient cost in advance." },

  { code: "PR-3", slug: "pr-3", cat: "Patient Responsibility", official: "Co-payment amount.",
    meaning: "This amount is the patient's copay and is their responsibility.",
    cause: "The plan requires a fixed copay for the visit or service.",
    fix: "Collect the copay, ideally at the point of service. Verify it at eligibility." },

  { code: "CO-11", slug: "co-11", cat: "Coding", official: "The diagnosis is inconsistent with the procedure.",
    meaning: "The diagnosis code does not match or support the procedure billed.",
    cause: "Coding error, non-specific diagnosis, or a diagnosis that does not establish medical necessity for the CPT.",
    fix: "Review documentation, correct the diagnosis or procedure coding, and resubmit or appeal." },

  { code: "CO-4", slug: "co-4", cat: "Coding", official: "The procedure code is inconsistent with the modifier used, or a required modifier is missing.",
    meaning: "A modifier is missing or wrong for the procedure billed.",
    cause: "A required modifier was omitted, or an incorrect modifier was appended.",
    fix: "Add or correct the modifier per payer and CPT rules, then resubmit." },

  { code: "CO-27", slug: "co-27", cat: "Eligibility", official: "Expenses incurred after coverage terminated.",
    meaning: "The patient's coverage had ended before the date of service.",
    cause: "Coverage lapsed or terminated and eligibility was not re-verified close to the visit.",
    fix: "Verify the correct active coverage for the date of service, bill the right payer, or bill the patient if no coverage applies." },

  { code: "CO-31", slug: "co-31", cat: "Eligibility", official: "Patient cannot be identified as our insured.",
    meaning: "The payer cannot match the patient to a member record.",
    cause: "Wrong member ID, name, or date of birth, or the patient is not covered by this payer.",
    fix: "Correct the member ID and demographics against the card, re-verify eligibility, and resubmit." },

  { code: "CO-B7", slug: "co-b7", cat: "Credentialing", official: "This provider was not certified/eligible to be paid for this procedure/service on this date of service.",
    meaning: "The provider was not credentialed or enrolled with the payer for that date/service.",
    cause: "Credentialing or payer enrollment was incomplete or lapsed.",
    fix: "Confirm the provider's enrollment and effective dates with the payer, complete enrollment, then appeal or rebill for eligible dates." },

  { code: "CO-151", slug: "co-151", cat: "Frequency", official: "Payment adjusted because the payer deems the information submitted does not support this many/frequency of services.",
    meaning: "The billed frequency or quantity exceeds what the payer allows or the documentation supports.",
    cause: "Units/frequency billed exceed payer limits or documentation.",
    fix: "Verify units against documentation and payer frequency limits, correct if needed, and appeal with records if the frequency was justified." },

  { code: "CO-119", slug: "co-119", cat: "Coverage", official: "Benefit maximum for this time period or occurrence has been reached.",
    meaning: "The patient has hit a benefit maximum (visits, dollars, or occurrences) for the period.",
    cause: "The plan's benefit cap for the service was already used.",
    fix: "Confirm the benefit maximum at eligibility. If reached, the balance is typically patient responsibility." },

  { code: "CO-24", slug: "co-24", cat: "COB", official: "Charges are covered under a capitation agreement/managed care plan.",
    meaning: "The service is covered under a capitation or managed-care arrangement, not fee-for-service.",
    cause: "The patient is in a capitated plan; the service should not be billed fee-for-service to this payer.",
    fix: "Route the claim per the capitation/managed-care agreement rather than billing it as fee-for-service." },

  { code: "CO-234", slug: "co-234", cat: "Bundling", official: "This procedure is not paid separately.",
    meaning: "The procedure is not separately payable; its value is included in another service.",
    cause: "Bundling rules make this line non-separately-payable.",
    fix: "Check for an appropriate modifier if the service was distinct; otherwise write it off." },

  { code: "CO-146", slug: "co-146", cat: "Coding", official: "Diagnosis was invalid for the date(s) of service reported.",
    meaning: "The diagnosis code was not valid for that date of service.",
    cause: "An outdated or deleted ICD-10 code, or a code not effective on the service date.",
    fix: "Use a valid ICD-10 code effective for the date of service and resubmit." },

  { code: "CO-140", slug: "co-140", cat: "Eligibility", official: "Patient/Insured health identification number and name do not match.",
    meaning: "The member ID and patient name on the claim do not match the payer's records.",
    cause: "Typo in the member ID or name, or mismatched subscriber information.",
    fix: "Correct the member ID and name exactly as on the insurance card, then resubmit." },

  { code: "CO-170", slug: "co-170", cat: "Provider Type", official: "Payment is denied when performed/billed by this type of provider.",
    meaning: "This provider type is not allowed to bill this service to the payer.",
    cause: "Scope-of-practice or provider-type restrictions for the service.",
    fix: "Confirm which provider type may bill the service and rebill under the correct provider if appropriate." },

  { code: "CO-252", slug: "co-252", cat: "Missing Info", official: "An attachment/other documentation is required to adjudicate this claim/service.",
    meaning: "The payer needs supporting documentation before it can process the claim.",
    cause: "Required records (notes, reports, itemized bill) were not submitted.",
    fix: "Submit the requested documentation via the payer's preferred method and resubmit or respond to the request." },

  { code: "PR-49", slug: "pr-49", cat: "Coverage", official: "This is a non-covered service because it is a routine/preventive exam or a diagnostic/screening procedure done in conjunction with a routine exam.",
    meaning: "A routine or preventive service is not covered (or was billed with a routine exam), and it is patient responsibility.",
    cause: "The plan does not cover the routine/preventive service as billed.",
    fix: "Confirm preventive benefits, bill the patient where appropriate, or correct coding if the service was actually diagnostic." },

  { code: "CO-6", slug: "co-6", cat: "Coding", official: "The procedure/revenue code is inconsistent with the patient's age.",
    meaning: "The procedure billed does not fit the patient's age per payer edits.",
    cause: "An age-restricted code, or an incorrect procedure/patient record.",
    fix: "Verify the procedure code and patient date of birth, correct the error, and resubmit." },

  { code: "CO-183", slug: "co-183", cat: "Referral", official: "The referring provider is not eligible to refer the service billed.",
    meaning: "The referring provider on the claim is not eligible to make the referral.",
    cause: "Wrong referring provider, or one not enrolled/eligible with the payer.",
    fix: "Correct the referring provider information and confirm their eligibility, then resubmit." },

  { code: "MA130", slug: "ma130", cat: "Missing Info", official: "RARC MA130: Your claim contains incomplete and/or invalid information, and no appeal rights are afforded because the claim is unprocessable.",
    meaning: "The claim is unprocessable due to incomplete/invalid information, so it was not adjudicated (and has no appeal rights until corrected).",
    cause: "One or more required fields are missing or invalid.",
    fix: "Correct the invalid/missing information and submit a new, complete claim (this is a correction, not an appeal)." },

  { code: "N130", slug: "n130", cat: "Coverage", official: "RARC N130: Consult plan benefit documents/guidelines for information about restrictions for this service.",
    meaning: "The service is subject to plan restrictions; check the benefit documents.",
    cause: "Coverage limits, prerequisites, or restrictions in the plan.",
    fix: "Review the plan's benefit guidelines for the restriction, then correct billing or advise the patient accordingly." },

  { code: "M76", slug: "m76", cat: "Coding", official: "RARC M76: Missing/incomplete/invalid diagnosis or condition.",
    meaning: "The diagnosis is missing, incomplete, or invalid on the claim.",
    cause: "No diagnosis, a truncated code, or an invalid ICD-10 code.",
    fix: "Add a complete, valid ICD-10 diagnosis that supports the service and resubmit." },
];

export const denialCode = (slug) => CODES.find((c) => c.slug === slug);

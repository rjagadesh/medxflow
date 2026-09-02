// Stedi test-mode mock patients for eligibility (270/271) verification.
//
// These are Stedi's own published mock subscribers - they only work against a
// TEST API key and return realistic mock 271 benefits. They are fictional test
// records, not PHI. Sourced from Stedi's eligibility mock-request docs:
// https://www.stedi.com/docs/healthcare/api-reference/mock-requests-eligibility-checks
//
// The UHCAAA* / *INACTIVE members deliberately return AAA rejection codes, which
// is what makes them useful for exercising the error paths.

export const STEDI_TEST_NPI = "1999999984";

export const SAMPLE_PATIENTS = [
  { payerName: "Aetna", payerId: "60054", firstName: "Jane", lastName: "Doe", memberId: "AETNA12345", dateOfBirth: "20040404" },
  { payerName: "Ameritas", payerId: "AMTAS00425", firstName: "Falcon", lastName: "Dent", memberId: "007007007", dateOfBirth: "19850607" },
  { payerName: "Anthem Blue Cross Blue Shield of California", payerId: "84103", firstName: "Aardvark", lastName: "Dent", memberId: "AFK987654321", dateOfBirth: "19701212" },
  { payerName: "CMS", payerId: "CMS", firstName: "Jane", lastName: "Doe", memberId: "1AA2CC3DD45", dateOfBirth: "19550505" },
  { payerName: "Centene (Medical)", payerId: "68069", firstName: "John", lastName: "Doe", memberId: "AMBETTER123", dateOfBirth: "19940404" },
  { payerName: "Cigna", payerId: "62308", firstName: "James", lastName: "Jones", memberId: "23456789100", dateOfBirth: "19910202" },
  { payerName: "Cigna", payerId: "62308", firstName: "Rolando", lastName: "Arrojo", memberId: "5643296", dateOfBirth: "19710102" },
  { payerName: "Cigna", payerId: "62308", firstName: "Rod", lastName: "Beck", memberId: "R5TJR4HR4H", dateOfBirth: "19720203" },
  { payerName: "Cigna", payerId: "62308", firstName: "David", lastName: "Cone", memberId: "5642296", dateOfBirth: "19730304" },
  { payerName: "Cigna", payerId: "62308", firstName: "Frank", lastName: "Castillo", memberId: "FTRJRG3254", dateOfBirth: "19750405" },
  { payerName: "Cigna", payerId: "62308", firstName: "Casey", lastName: "Fossum", memberId: "5641296", dateOfBirth: "19760506" },
  { payerName: "Cigna", payerId: "62308", firstName: "Rich", lastName: "Garces", memberId: "DHW5445", dateOfBirth: "19770607" },
  { payerName: "Cigna", payerId: "62308", firstName: "Jaguar", lastName: "Dent", memberId: "U3141592653", dateOfBirth: "19960505" },
  { payerName: "Cigna", payerId: "62308", firstName: "James", lastName: "Doe", memberId: "U9876543210", dateOfBirth: "19010101" },
  { payerName: "Humana", payerId: "61101", firstName: "Jane", lastName: "Doe", memberId: "HUMANA123", dateOfBirth: "19750505" },
  { payerName: "Kaiser Foundation Health Plan Northern California", payerId: "KSRCN", firstName: "Jane", lastName: "Doe", memberId: "KAISER123456", dateOfBirth: "20020202" },
  { payerName: "MetLife Dental Family", payerId: "10134", firstName: "Elephant", lastName: "Dent", memberId: "88877788", dateOfBirth: "19840229" },
  { payerName: "UnitedHealthcare", payerId: "87726", firstName: "Jane", lastName: "Doe", memberId: "UHC123456", dateOfBirth: "19710101" },
  { payerName: "UnitedHealthcare Dental", payerId: "52133", firstName: "Beaver", lastName: "Dent", memberId: "404404404", dateOfBirth: "19690628" },
  { payerName: "CMS MBI Lookup", payerId: "MBILU", firstName: "Jane", lastName: "Doe", memberId: "UHCINACTIVE", dateOfBirth: "19710101" },
  { payerName: "UnitedHealthcare", payerId: "87726", firstName: "Jane", lastName: "Doe", memberId: "UHCAAA42", dateOfBirth: "20010101" },
  { payerName: "UnitedHealthcare", payerId: "87726", firstName: "Jane", lastName: "Doe", memberId: "UHCAAA43", dateOfBirth: "19700101" },
  { payerName: "UnitedHealthcare", payerId: "87726", firstName: "John", lastName: "Doe", memberId: "UHCAAA72", dateOfBirth: "19900101" },
  { payerName: "UnitedHealthcare", payerId: "87726", firstName: "John", lastName: "Doe", memberId: "UHCAAA73", dateOfBirth: "19900101" },
  { payerName: "UnitedHealthcare", payerId: "87726", firstName: "Jane", lastName: "Doe", memberId: "UHCAAA75", dateOfBirth: "19900101" },
  { payerName: "UnitedHealthcare", payerId: "87726", firstName: "John", lastName: "Doe", memberId: "UHCAAA79", dateOfBirth: "19700101" },
];

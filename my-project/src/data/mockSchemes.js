import schemeMaster from '../../myScheme_164_Schemes_Master.json';

// Legacy demo data retained only as a fallback reference.

export const demoSchemes = [
  {
    id: 1,
    name: "Demo Higher Education Scholarship",
    description: "Scholarship for meritorious students pursuing higher education",
    category: "Education",
    ministry: "Ministry of Education (Demo)",
    state: "All India",
    lifeEvents: ["Starting education"],
    benefit: {
      amount: 15000,
      frequency: "annual",
      currency: "INR"
    },
    eligibilityRules: [
      { field: "age", operator: ">=", value: 18 },
      { field: "age", operator: "<=", value: 30 },
      { field: "income", operator: "<=", value: 300000 },
      { field: "student", operator: "==", value: true }
    ],
    documents: [
      "Income Certificate",
      "Student ID",
      "Proof of Address",
      "Bank Account Details"
    ],
    applicationSteps: [
      "Check eligibility",
      "Prepare documents",
      "Register on official portal",
      "Fill application form",
      "Submit documents",
      "Track application"
    ],
    officialUrl: "https://example.gov.in/education/scholarship",
    lastVerified: "2026-01-15",
    source: "Demo Data - Not Real",
    applicationMode: "Online",
    deadline: "2026-12-31"
  },
  {
    id: 2,
    name: "Demo Employment Support Scheme",
    description: "Assistance for job seekers and skill development",
    category: "Employment",
    ministry: "Ministry of Labour (Demo)",
    state: "All India",
    lifeEvents: ["Looking for work"],
    benefit: {
      amount: 25000,
      frequency: "one-time",
      currency: "INR"
    },
    eligibilityRules: [
      { field: "age", operator: ">=", value: 18 },
      { field: "age", operator: "<=", value: 35 },
      { field: "employmentStatus", operator: "==", value: "unemployed" }
    ],
    documents: [
      "Aadhaar",
      "Educational Certificate",
      "Resume",
      "Bank Account Details"
    ],
    applicationSteps: [
      "Register on portal",
      "Complete profile",
      "Verify documents",
      "Attend interview",
      "Receive placement assistance"
    ],
    officialUrl: "https://example.gov.in/employment/support",
    lastVerified: "2026-01-10",
    source: "Demo Data - Not Real",
    applicationMode: "Online + Offline",
    deadline: "2026-12-31"
  },
  {
    id: 3,
    name: "Demo Agricultural Support Fund",
    description: "Financial assistance for farmers",
    category: "Agriculture",
    ministry: "Ministry of Agriculture (Demo)",
    state: "All India",
    lifeEvents: ["Farming / crop issue"],
    benefit: {
      amount: 50000,
      frequency: "annual",
      currency: "INR"
    },
    eligibilityRules: [
      { field: "occupation", operator: "==", value: "farmer" },
      { field: "ownLand", operator: "==", value: true },
      { field: "landholding", operator: ">=", value: 0.5 }
    ],
    documents: [
      "Land Certificate",
      "ID Proof",
      "Bank Account Details",
      "Agricultural License"
    ],
    applicationSteps: [
      "Visit agricultural office",
      "Submit land documents",
      "Verify eligibility",
      "Receive fund transfer"
    ],
    officialUrl: "https://example.gov.in/agriculture/support",
    lastVerified: "2026-01-20",
    source: "Demo Data - Not Real",
    applicationMode: "Offline",
    deadline: "2026-12-31"
  },
  {
    id: 4,
    name: "Demo Maternity Benefit Scheme",
    description: "Support for pregnant women and new mothers",
    category: "Healthcare",
    ministry: "Ministry of Women & Child (Demo)",
    state: "All India",
    lifeEvents: ["New child"],
    benefit: {
      amount: 12000,
      frequency: "one-time",
      currency: "INR"
    },
    eligibilityRules: [
      { field: "gender", operator: "==", value: "female" },
      { field: "income", operator: "<=", value: 400000 }
    ],
    documents: [
      "Medical Certificate",
      "Proof of Pregnancy",
      "ID Proof",
      "Bank Account Details"
    ],
    applicationSteps: [
      "Register at hospital/clinic",
      "Submit medical certificate",
      "Verify details",
      "Receive benefit"
    ],
    officialUrl: "https://example.gov.in/women/maternity",
    lastVerified: "2026-01-15",
    source: "Demo Data - Not Real",
    applicationMode: "Online + Offline",
    deadline: "2026-12-31"
  },
  {
    id: 5,
    name: "Demo Housing for All Scheme",
    description: "Affordable housing assistance",
    category: "Housing",
    ministry: "Ministry of Housing (Demo)",
    state: "All India",
    lifeEvents: ["Housing need"],
    benefit: {
      amount: 200000,
      frequency: "one-time",
      currency: "INR"
    },
    eligibilityRules: [
      { field: "income", operator: "<=", value: 600000 },
      { field: "ownHouse", operator: "==", value: false }
    ],
    documents: [
      "Income Certificate",
      "ID Proof",
      "Address Proof",
      "Bank Account Details",
      "Land Document"
    ],
    applicationSteps: [
      "Check eligibility",
      "Submit application",
      "Property verification",
      "Loan approval",
      "Construction/Purchase assistance"
    ],
    officialUrl: "https://example.gov.in/housing/scheme",
    lastVerified: "2026-01-18",
    source: "Demo Data - Not Real",
    applicationMode: "Online",
    deadline: "2026-12-31"
  },
  {
    id: 6,
    name: "Demo Entrepreneurship Loan Scheme",
    description: "Loans and support for starting businesses",
    category: "Business",
    ministry: "Ministry of MSME (Demo)",
    state: "All India",
    lifeEvents: ["Starting a business"],
    benefit: {
      amount: 500000,
      frequency: "one-time",
      currency: "INR"
    },
    eligibilityRules: [
      { field: "age", operator: ">=", value: 18 },
      { field: "age", operator: "<=", value: 50 },
      { field: "income", operator: "<=", value: 400000 }
    ],
    documents: [
      "Business Plan",
      "ID Proof",
      "Address Proof",
      "Bank Account Details",
      "Educational Certificate"
    ],
    applicationSteps: [
      "Prepare business plan",
      "Submit application",
      "Bank verification",
      "Loan sanction",
      "Disbursement"
    ],
    officialUrl: "https://example.gov.in/msme/entrepreneur",
    lastVerified: "2026-01-15",
    source: "Demo Data - Not Real",
    applicationMode: "Online",
    deadline: "2026-12-31"
  },
  {
    id: 7,
    name: "Demo Senior Citizen Pension",
    description: "Monthly pension for senior citizens",
    category: "Social Security",
    ministry: "Ministry of Social Justice (Demo)",
    state: "All India",
    lifeEvents: ["Senior citizen"],
    benefit: {
      amount: 500,
      frequency: "monthly",
      currency: "INR"
    },
    eligibilityRules: [
      { field: "age", operator: ">=", value: 60 },
      { field: "income", operator: "<=", value: 200000 }
    ],
    documents: [
      "Age Proof",
      "ID Proof",
      "Address Proof",
      "Bank Account Details"
    ],
    applicationSteps: [
      "Apply online or offline",
      "Verify age proof",
      "Income verification",
      "Pension approval",
      "Monthly transfer"
    ],
    officialUrl: "https://example.gov.in/social/pension",
    lastVerified: "2026-01-15",
    source: "Demo Data - Not Real",
    applicationMode: "Online + Offline",
    deadline: "2026-12-31"
  },
  {
    id: 8,
    name: "Demo Disability Support Scheme",
    description: "Support and allowance for persons with disabilities",
    category: "Disability",
    ministry: "Ministry of Social Justice (Demo)",
    state: "All India",
    lifeEvents: ["Disability support"],
    benefit: {
      amount: 500,
      frequency: "monthly",
      currency: "INR"
    },
    eligibilityRules: [
      { field: "disability", operator: "==", value: true },
      { field: "disabilityPercentage", operator: ">=", value: 40 }
    ],
    documents: [
      "Disability Certificate",
      "ID Proof",
      "Address Proof",
      "Bank Account Details"
    ],
    applicationSteps: [
      "Get disability certificate",
      "Submit application",
      "Verification",
      "Approval",
      "Monthly allowance"
    ],
    officialUrl: "https://example.gov.in/social/disability",
    lastVerified: "2026-01-15",
    source: "Demo Data - Not Real",
    applicationMode: "Online + Offline",
    deadline: "2026-12-31"
  }
];

// Normalize the myScheme master file into the shape consumed by the UI.
export const mockSchemes = schemeMaster.schemes.map((scheme) => ({
  id: scheme.scheme_id,
  name: scheme.scheme_name,
  description: scheme.description?.overview || scheme.description?.benefits || 'Details are available on the official portal.',
  category: scheme.category,
  ministry: scheme.jurisdiction?.ministry || 'Government of India',
  state: scheme.jurisdiction?.state_ut || 'All India',
  lifeEvents: [],
  benefit: { amount: null, frequency: 'one-time', currency: 'INR' },
  eligibilityRules: [],
  eligibilityCriteria: scheme.eligibility?.criteria || [],
  documents: scheme.requirements?.documents || [],
  applicationSteps: [scheme.application?.mode ? `Apply ${scheme.application.mode.toLowerCase()}` : 'Check the official portal for application steps'],
  officialUrl: scheme.application?.official_portal || scheme.application?.myscheme_portal || '',
  lastVerified: null,
  source: scheme.application?.myscheme_portal || 'myScheme Portal',
  applicationMode: scheme.application?.mode || 'See official portal',
  deadline: null
}));

export const mockDocuments = [
  { id: 1, name: "Aadhaar", required: false, ready: false },
  { id: 2, name: "Income Certificate", required: false, ready: false },
  { id: 3, name: "Caste Certificate", required: false, ready: false },
  { id: 4, name: "Bank Account Proof", required: false, ready: false },
  { id: 5, name: "Land Record", required: false, ready: false },
  { id: 6, name: "Student ID", required: false, ready: false },
  { id: 7, name: "Address Proof", required: false, ready: false },
  { id: 8, name: "Disability Certificate", required: false, ready: false },
  { id: 9, name: "Educational Certificate", required: false, ready: false },
  { id: 10, name: "Medical Certificate", required: false, ready: false }
];

export const lifeEvents = [
  { id: 1, icon: "GraduationCap", label: "Starting education", description: "School, college or skill development" },
  { id: 2, icon: "Briefcase", label: "Looking for work", description: "Employment, training or job support" },
  { id: 3, icon: "Wheat", label: "Farming / crop issue", description: "Agriculture, crop loss or livelihood" },
  { id: 4, icon: "Baby", label: "New child", description: "Pregnancy, childbirth or child support" },
  { id: 5, icon: "House", label: "Housing need", description: "Housing and basic services" },
  { id: 6, icon: "Rocket", label: "Starting a business", description: "Entrepreneurship and financial support" },
  { id: 7, icon: "Users", label: "Senior citizen", description: "Pension and social security" },
  { id: 8, icon: "Accessibility", label: "Disability support", description: "Assistance and accessibility" }
];

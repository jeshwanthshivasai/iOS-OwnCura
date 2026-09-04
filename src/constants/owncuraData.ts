// OwnCura iOS — practices across Texas and California, plus the illustrative valuation model.
// Public-data baseline: panel size × blended revenue per patient × specialty margin norm,
// multiplied by a payer-mix and metro-adjusted multiple.

export interface Metro {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
}

export interface Clinic {
  id: string;
  name: string;
  city: string;
  state: string;
  metro: string;
  zip: string;
  lat: number;
  lng: number;
  specialty: string;
  providers: number;
  panel: number;
  revPerPatient: number;
  marginPub: number;
  commercial: number;
  metroAdj: number;
  status: 'mine' | 'unlisted' | 'portfolio' | 'listed';
  note: string;
  sources: string[];
  ownerInputs?: {
    ebitda?: string;
    providers?: string;
    panel?: string;
    commercial?: string;
    visits?: string;
  };
}

export interface ValuationInputs {
  ebitda: string;
  providers: string;
  panel: string;
  commercial: string | number;
  visits: string | number;
}

export interface ValuationFactor {
  label: string;
  value: string;
  effect: number;
  note: string;
}

export interface ValuationResult {
  revenue: number;
  ebitda: number;
  mult: number;
  mid: number;
  low: number;
  high: number;
  spread: number;
  confidence: number;
  filled: number;
  factors?: ValuationFactor[];
}

export const OC_METROS: Metro[] = [
  { id: "houston", name: "Houston", state: "TX", lat: 29.76, lng: -95.37 },
  { id: "dallas", name: "Dallas–Fort Worth", state: "TX", lat: 32.78, lng: -96.80 },
  { id: "austin", name: "Austin", state: "TX", lat: 30.27, lng: -97.74 },
  { id: "la", name: "Los Angeles", state: "CA", lat: 34.05, lng: -118.24 },
  { id: "bay", name: "Bay Area", state: "CA", lat: 37.77, lng: -122.42 },
  { id: "sandiego", name: "San Diego", state: "CA", lat: 32.72, lng: -117.16 }
];

export const OC_CLINICS: Clinic[] = [
  {
    id: "bellaire",
    name: "Bellaire Pediatric Associates",
    city: "Bellaire",
    state: "TX",
    metro: "houston",
    zip: "77401",
    lat: 29.7058,
    lng: -95.4588,
    specialty: "Pediatrics",
    providers: 4,
    panel: 5200,
    revPerPatient: 362,
    marginPub: 0.205,
    commercial: 0.62,
    metroAdj: 0.30,
    status: "mine",
    note: "Your practice. Estimate refined with your own figures.",
    sources: ["Medicare PUF 2024", "NPPES", "Owner-supplied"]
  },
  {
    id: "heights",
    name: "Heights Family Practice",
    city: "Houston Heights",
    state: "TX",
    metro: "houston",
    zip: "77008",
    lat: 29.7905,
    lng: -95.3988,
    specialty: "Family Practice",
    providers: 3,
    panel: 4100,
    revPerPatient: 341,
    marginPub: 0.178,
    commercial: 0.54,
    metroAdj: 0.22,
    status: "unlisted",
    note: "Not listed for sale. Estimate is ours, not the owner's.",
    sources: ["Medicare PUF 2024", "NPPES"]
  },
  {
    id: "katy",
    name: "Katy Kids Clinic",
    city: "Katy",
    state: "TX",
    metro: "houston",
    zip: "77494",
    lat: 29.7858,
    lng: -95.8245,
    specialty: "Pediatrics",
    providers: 5,
    panel: 6400,
    revPerPatient: 355,
    marginPub: 0.192,
    commercial: 0.68,
    metroAdj: 0.34,
    status: "portfolio",
    note: "Roots Health portfolio. Agent stack deploys Nov 15.",
    sources: ["Internal ledger", "Medicare PUF 2024"]
  },
  {
    id: "memorial",
    name: "Memorial Pediatric Partners",
    city: "Memorial",
    state: "TX",
    metro: "houston",
    zip: "77024",
    lat: 29.7645,
    lng: -95.5560,
    specialty: "Pediatrics",
    providers: 6,
    panel: 7100,
    revPerPatient: 371,
    marginPub: 0.214,
    commercial: 0.71,
    metroAdj: 0.36,
    status: "listed",
    note: "Two partners exiting. Listed for sale.",
    sources: ["Medicare PUF 2024", "NPPES", "TX DSHS licensure"],
    ownerInputs: { ebitda: "884000", providers: "6", panel: "7300", commercial: "74", visits: "61" }
  },
  {
    id: "woodlands",
    name: "The Woodlands Pediatrics",
    city: "The Woodlands",
    state: "TX",
    metro: "houston",
    zip: "77380",
    lat: 30.1658,
    lng: -95.4613,
    specialty: "Pediatrics",
    providers: 5,
    panel: 6100,
    revPerPatient: 368,
    marginPub: 0.209,
    commercial: 0.73,
    metroAdj: 0.38,
    status: "portfolio",
    note: "Roots Health portfolio. Acquired Nov 2025.",
    sources: ["Internal ledger", "Medicare PUF 2024"]
  },
  {
    id: "plano",
    name: "Plano Family Medicine",
    city: "Plano",
    state: "TX",
    metro: "dallas",
    zip: "75024",
    lat: 33.0577,
    lng: -96.7460,
    specialty: "Family Practice",
    providers: 4,
    panel: 4900,
    revPerPatient: 352,
    marginPub: 0.191,
    commercial: 0.66,
    metroAdj: 0.31,
    status: "listed",
    note: "Owner retiring in 2027. Listed for sale.",
    sources: ["Medicare PUF 2024", "NPPES", "TX DSHS licensure"],
    ownerInputs: { ebitda: "498000", providers: "4", panel: "5050", commercial: "69", visits: "48" }
  },
  {
    id: "arlington",
    name: "Arlington Children's Health",
    city: "Arlington",
    state: "TX",
    metro: "dallas",
    zip: "76013",
    lat: 32.7357,
    lng: -97.1081,
    specialty: "Pediatrics",
    providers: 3,
    panel: 3800,
    revPerPatient: 318,
    marginPub: 0.162,
    commercial: 0.42,
    metroAdj: 0.14,
    status: "portfolio",
    note: "Roots Health portfolio. Acquired Jun 2026.",
    sources: ["Internal ledger", "Medicare PUF 2024"]
  },
  {
    id: "frisco",
    name: "Frisco Pediatric Group",
    city: "Frisco",
    state: "TX",
    metro: "dallas",
    zip: "75034",
    lat: 33.1507,
    lng: -96.8236,
    specialty: "Pediatrics",
    providers: 5,
    panel: 6600,
    revPerPatient: 374,
    marginPub: 0.216,
    commercial: 0.76,
    metroAdj: 0.35,
    status: "unlisted",
    note: "Not listed for sale. In acquisition conversation.",
    sources: ["Medicare PUF 2024", "NPPES"]
  },
  {
    id: "southaustin",
    name: "South Austin Family Care",
    city: "Austin",
    state: "TX",
    metro: "austin",
    zip: "78704",
    lat: 30.2450,
    lng: -97.7594,
    specialty: "Family Practice",
    providers: 3,
    panel: 4200,
    revPerPatient: 346,
    marginPub: 0.183,
    commercial: 0.63,
    metroAdj: 0.28,
    status: "unlisted",
    note: "Not listed for sale. Estimate is ours, not the owner's.",
    sources: ["Medicare PUF 2024", "NPPES"]
  },
  {
    id: "cedarpark",
    name: "Cedar Park Pediatrics",
    city: "Cedar Park",
    state: "TX",
    metro: "austin",
    zip: "78613",
    lat: 30.5052,
    lng: -97.8203,
    specialty: "Pediatrics",
    providers: 4,
    panel: 5100,
    revPerPatient: 359,
    marginPub: 0.201,
    commercial: 0.70,
    metroAdj: 0.32,
    status: "portfolio",
    note: "Roots Health portfolio. Acquired Feb 2026.",
    sources: ["Internal ledger", "Medicare PUF 2024"]
  },
  {
    id: "pasadena",
    name: "Pasadena Pediatric Medicine",
    city: "Pasadena",
    state: "CA",
    metro: "la",
    zip: "91106",
    lat: 34.1478,
    lng: -118.1445,
    specialty: "Pediatrics",
    providers: 5,
    panel: 6300,
    revPerPatient: 401,
    marginPub: 0.198,
    commercial: 0.69,
    metroAdj: 0.41,
    status: "listed",
    note: "Solo owner relocating. Listed for sale.",
    sources: ["Medicare PUF 2024", "NPPES", "CA DCA licensure"],
    ownerInputs: { ebitda: "742000", providers: "5", panel: "6450", commercial: "72", visits: "56" }
  },
  {
    id: "longbeach",
    name: "Long Beach Family Health",
    city: "Long Beach",
    state: "CA",
    metro: "la",
    zip: "90802",
    lat: 33.7701,
    lng: -118.1937,
    specialty: "Family Practice",
    providers: 3,
    panel: 4400,
    revPerPatient: 378,
    marginPub: 0.171,
    commercial: 0.48,
    metroAdj: 0.24,
    status: "unlisted",
    note: "Not listed for sale. Estimate is ours, not the owner's.",
    sources: ["Medicare PUF 2024", "NPPES"]
  },
  {
    id: "glendale",
    name: "Glendale Children's Clinic",
    city: "Glendale",
    state: "CA",
    metro: "la",
    zip: "91206",
    lat: 34.1425,
    lng: -118.2551,
    specialty: "Pediatrics",
    providers: 4,
    panel: 5000,
    revPerPatient: 392,
    marginPub: 0.189,
    commercial: 0.58,
    metroAdj: 0.33,
    status: "portfolio",
    note: "Roots Health portfolio. Acquired Aug 2026.",
    sources: ["Internal ledger", "Medicare PUF 2024"]
  },
  {
    id: "oakland",
    name: "Oakland Pediatric Associates",
    city: "Oakland",
    state: "CA",
    metro: "bay",
    zip: "94609",
    lat: 37.8272,
    lng: -122.2604,
    specialty: "Pediatrics",
    providers: 4,
    panel: 5300,
    revPerPatient: 428,
    marginPub: 0.194,
    commercial: 0.61,
    metroAdj: 0.44,
    status: "unlisted",
    note: "Not listed for sale. Estimate is ours, not the owner's.",
    sources: ["Medicare PUF 2024", "NPPES"]
  },
  {
    id: "sanmateo",
    name: "San Mateo Family Practice",
    city: "San Mateo",
    state: "CA",
    metro: "bay",
    zip: "94401",
    lat: 37.5630,
    lng: -122.3255,
    specialty: "Family Practice",
    providers: 4,
    panel: 4700,
    revPerPatient: 441,
    marginPub: 0.207,
    commercial: 0.78,
    metroAdj: 0.47,
    status: "listed",
    note: "Owner joining a health system. Listed for sale.",
    sources: ["Medicare PUF 2024", "NPPES", "CA DCA licensure"],
    ownerInputs: { ebitda: "812000", providers: "4", panel: "4850", commercial: "80", visits: "44" }
  },
  {
    id: "fremont",
    name: "Fremont Kids Health",
    city: "Fremont",
    state: "CA",
    metro: "bay",
    zip: "94538",
    lat: 37.5485,
    lng: -121.9886,
    specialty: "Pediatrics",
    providers: 3,
    panel: 4100,
    revPerPatient: 412,
    marginPub: 0.186,
    commercial: 0.64,
    metroAdj: 0.39,
    status: "portfolio",
    note: "Roots Health portfolio. Agent stack deploys Nov 15.",
    sources: ["Internal ledger", "Medicare PUF 2024"]
  },
  {
    id: "lajolla",
    name: "La Jolla Pediatrics",
    city: "La Jolla",
    state: "CA",
    metro: "sandiego",
    zip: "92037",
    lat: 32.8328,
    lng: -117.2713,
    specialty: "Pediatrics",
    providers: 4,
    panel: 5400,
    revPerPatient: 419,
    marginPub: 0.211,
    commercial: 0.77,
    metroAdj: 0.42,
    status: "unlisted",
    note: "Not listed for sale. In acquisition conversation.",
    sources: ["Medicare PUF 2024", "NPPES"]
  },
  {
    id: "chulavista",
    name: "Chula Vista Family Medicine",
    city: "Chula Vista",
    state: "CA",
    metro: "sandiego",
    zip: "91910",
    lat: 32.6401,
    lng: -117.0842,
    specialty: "Family Practice",
    providers: 3,
    panel: 4000,
    revPerPatient: 366,
    marginPub: 0.168,
    commercial: 0.45,
    metroAdj: 0.21,
    status: "unlisted",
    note: "Not listed for sale. Estimate is ours, not the owner's.",
    sources: ["Medicare PUF 2024", "NPPES"]
  }
];

const BENCH_REV_PER_FTE = 392000;
const BENCH_VISITS = 42;

function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}

export function money(n: number): string {
  if (isNaN(n)) return "$0";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(n / 1e6 < 10 ? 2 : 1) + "M";
  if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
  return "$" + Math.round(n);
}

export function baselineValuation(c: Clinic): ValuationResult {
  const revenue = c.panel * c.revPerPatient;
  const ebitda = revenue * c.marginPub;
  const mult = 4.1 + (c.commercial - 0.45) * 2.2 + (c.specialty === "Pediatrics" ? 0.25 : 0.10) + c.metroAdj;
  const mid = ebitda * mult;
  return {
    revenue,
    ebitda,
    mult,
    mid,
    low: mid * 0.78,
    high: mid * 1.22,
    spread: 0.22,
    confidence: 42,
    filled: 0
  };
}

export function refinedValuation(c: Clinic, i: Partial<ValuationInputs> = {}): ValuationResult {
  const base = baselineValuation(c);
  const has = (k: keyof ValuationInputs) => i[k] !== "" && i[k] !== null && i[k] !== undefined && !isNaN(parseFloat(String(i[k])));
  const filled = (["ebitda", "providers", "panel", "commercial", "visits"] as (keyof ValuationInputs)[]).filter(has).length;

  const panel = has("panel") ? parseFloat(String(i.panel)) : c.panel;
  const providers = has("providers") ? parseFloat(String(i.providers)) : c.providers;
  const commercial = has("commercial") ? parseFloat(String(i.commercial)) / 100 : c.commercial;
  const visits = has("visits") ? parseFloat(String(i.visits)) : BENCH_VISITS;
  const revenue = panel * c.revPerPatient;
  const ebitda = has("ebitda") ? parseFloat(String(i.ebitda)) : revenue * c.marginPub;

  const payerAdj = (commercial - 0.45) * 2.2;
  const revPerFte = providers > 0 ? revenue / providers : BENCH_REV_PER_FTE;
  const effAdj = (has("providers") || has("panel"))
    ? clamp((revPerFte - BENCH_REV_PER_FTE) / BENCH_REV_PER_FTE * 1.2, -0.45, 0.45) : 0;
  const throughputAdj = has("visits") ? clamp((visits - BENCH_VISITS) / BENCH_VISITS * 0.9, -0.30, 0.30) : 0;
  const mult = 4.1 + payerAdj + (c.specialty === "Pediatrics" ? 0.25 : 0.10) + c.metroAdj + effAdj + throughputAdj;
  const mid = ebitda * mult;
  const spread = Math.max(0.07, 0.22 - 0.03 * filled);

  return {
    revenue,
    ebitda,
    mult,
    mid,
    low: mid * (1 - spread),
    high: mid * (1 + spread),
    spread,
    confidence: Math.min(93, 42 + 10 * filled),
    filled,
    factors: [
      {
        label: "Reported EBITDA",
        value: has("ebitda") ? money(ebitda) : "not supplied",
        effect: ebitda - base.ebitda,
        note: has("ebitda") ? "Owner-supplied. Replaces the margin norm we assumed." : "Estimated from public margin norm."
      },
      {
        label: "Payer mix",
        value: Math.round(commercial * 100) + "% commercial",
        effect: (payerAdj - (c.commercial - 0.45) * 2.2) * ebitda,
        note: "Commercial share above 45% lifts the multiple."
      },
      {
        label: "Provider efficiency",
        value: (has("providers") || has("panel")) ? money(revPerFte) + " per provider" : "not supplied",
        effect: effAdj * ebitda,
        note: "Benchmarked against $392K revenue per provider."
      },
      {
        label: "Throughput",
        value: has("visits") ? Math.round(visits) + " visits/day" : "not supplied",
        effect: throughputAdj * ebitda,
        note: "Benchmarked against 42 visits per day."
      }
    ]
  };
}

export function clinicValuation(c: Clinic): ValuationResult {
  return c.ownerInputs ? refinedValuation(c, c.ownerInputs) : baselineValuation(c);
}

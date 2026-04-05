export type NormStatus =
  | "sharia_compliant"
  | "not_sharia_compliant"
  | "under_review";

export type NormResult = {
  name: string;
  status: NormStatus;
};

export type FinalStatus =
  | "Sharia-compliant"
  | "Not Sharia-compliant"
  | "Under review";

export type CompanySeed = {
  ticker: string;
  name: string;
  sector: string;
  market: string;
};

export type CompanyScreeningData = {
  name: string;
  ticker: string;
  sector: string;
  market: string;
  note: string;
  description: string;
  reasoning: string;
  norms: NormResult[];
};

const companySeeds: CompanySeed[] = [
  {
    ticker: "AFM",
    name: "AFMA SA",
    sector: "Insurance",
    market: "Main Market",
  },
  {
    ticker: "AFI",
    name: "AFRIC INDUSTRIES SA",
    sector: "Construction & Building Materials",
    market: "Main Market",
  },
  {
    ticker: "GAZ",
    name: "AFRIQUIA GAZ",
    sector: "Oil & Gas",
    market: "Main Market",
  },
  {
    ticker: "AGM",
    name: "AGMA",
    sector: "Insurance",
    market: "Alternative Market",
  },
  {
    ticker: "AKT",
    name: "AKDITAL",
    sector: "Health",
    market: "Main Market",
  },
  {
    ticker: "ADI",
    name: "ALLIANCES DEVELOPPEMENT IMMOBILIER",
    sector: "Real Estate Development",
    market: "Main Market",
  },
  {
    ticker: "ALM",
    name: "ALUMINIUM DU MAROC",
    sector: "Construction & Building Materials",
    market: "Main Market",
  },
  {
    ticker: "ARD",
    name: "ARADEI CAPITAL",
    sector: "Real Estate Investment",
    market: "Main Market",
  },
  {
    ticker: "ATL",
    name: "ATLANTASANAD",
    sector: "Insurance",
    market: "Main Market",
  },
  {
    ticker: "ATW",
    name: "ATTIJARIWAFA BANK",
    sector: "Banks",
    market: "Main Market",
  },
  {
    ticker: "ATH",
    name: "AUTO HALL",
    sector: "Distributors",
    market: "Main Market",
  },
  {
    ticker: "NEJ",
    name: "AUTO NEJMA",
    sector: "Distributors",
    market: "Main Market",
  },
  {
    ticker: "BAL",
    name: "BALIMA",
    sector: "Real Estate Investment",
    market: "Main Market",
  },
  {
    ticker: "BCI",
    name: "BANQUE MAROCAINE POUR LE COMMERCE ET L'INDUSTRIE",
    sector: "Banks",
    market: "Main Market",
  },
  {
    ticker: "BCP",
    name: "BANQUE CENTRALE POPULAIRE",
    sector: "Banks",
    market: "Main Market",
  },
  {
    ticker: "BOA",
    name: "BANK OF AFRICA",
    sector: "Banks",
    market: "Main Market",
  },
  {
    ticker: "CAP",
    name: "CASH PLUS S.A",
    sector: "Financial Services",
    market: "Main Market",
  },
  {
    ticker: "CRS",
    name: "CARTIER SAADA",
    sector: "Food Production",
    market: "Main Market",
  },
  {
    ticker: "CFG",
    name: "CFG BANK",
    sector: "Banks",
    market: "Main Market",
  },
  {
    ticker: "CIH",
    name: "CREDIT IMMOBILIER ET HOTELIER",
    sector: "Banks",
    market: "Main Market",
  },
  {
    ticker: "CDM",
    name: "CREDIT DU MAROC",
    sector: "Banks",
    market: "Main Market",
  },
  {
    ticker: "CMG",
    name: "CMGP GROUP",
    sector: "Agricultural Industry",
    market: "Main Market",
  },
  {
    ticker: "CMA",
    name: "CIMENTS DU MAROC",
    sector: "Construction & Building Materials",
    market: "Main Market",
  },
  {
    ticker: "CMT",
    name: "COMPAGNIE MINIERE DE TOUISSIT",
    sector: "Mining",
    market: "Main Market",
  },
  {
    ticker: "CTM",
    name: "COMPAGNIE DE TRANSPORT AU MAROC",
    sector: "Transport Services",
    market: "Main Market",
  },
  {
    ticker: "CSR",
    name: "COSUMAR",
    sector: "Food Production",
    market: "Main Market",
  },
  {
    ticker: "COL",
    name: "COLORADO",
    sector: "Chemicals",
    market: "Alternative Market",
  },
  {
    ticker: "DRI",
    name: "DARI COUSPATE",
    sector: "Food Production",
    market: "Main Market",
  },
  {
    ticker: "DIS",
    name: "DIAC SALAF",
    sector: "Financial Services",
    market: "Main Market",
  },
  {
    ticker: "DHO",
    name: "DELTA HOLDING",
    sector: "Industrial Services",
    market: "Main Market",
  },
  {
    ticker: "DLM",
    name: "DELATTRE LEVIVIER MAROC",
    sector: "Industrial Services",
    market: "Main Market",
  },
  {
    ticker: "DWY",
    name: "DISWAY",
    sector: "Technology",
    market: "Main Market",
  },
  {
    ticker: "DYT",
    name: "DISTY TECHNOLOGIES",
    sector: "Technology",
    market: "Alternative Market",
  },
  {
    ticker: "ADH",
    name: "DOUJA PROMOTION GROUPE ADDOHA",
    sector: "Real Estate Development",
    market: "Main Market",
  },
  {
    ticker: "EQD",
    name: "EQDOM",
    sector: "Financial Services",
    market: "Main Market",
  },
  {
    ticker: "FBR",
    name: "FENIE BROSSETTE",
    sector: "Distributors",
    market: "Main Market",
  },
  {
    ticker: "GTM",
    name: "SGTM S.A",
    sector: "Construction & Building Materials",
    market: "Main Market",
  },
  {
    ticker: "HPS",
    name: "HIGHTECH PAYMENT SYSTEMS",
    sector: "Technology",
    market: "Main Market",
  },
  {
    ticker: "IAM",
    name: "ITISSALAT AL-MAGHRIB",
    sector: "Telecommunications",
    market: "Main Market",
  },
  {
    ticker: "IBC",
    name: "IB MAROC.COM",
    sector: "Technology",
    market: "Main Market",
  },
  {
    ticker: "IMO",
    name: "IMMORENTE INVEST",
    sector: "Real Estate Investment",
    market: "Main Market",
  },
  {
    ticker: "INV",
    name: "INVOLYS",
    sector: "Technology",
    market: "Alternative Market",
  },
  {
    ticker: "JET",
    name: "JET CONTRACTORS",
    sector: "Construction & Building Materials",
    market: "Main Market",
  },
  {
    ticker: "LBV",
    name: "LABEL VIE",
    sector: "Retail",
    market: "Main Market",
  },
  {
    ticker: "LHM",
    name: "LAFARGEHOLCIM MAROC",
    sector: "Construction & Building Materials",
    market: "Main Market",
  },
  {
    ticker: "LES",
    name: "LESIEUR CRISTAL",
    sector: "Food Production",
    market: "Main Market",
  },
  {
    ticker: "M2M",
    name: "M2M GROUP",
    sector: "Technology",
    market: "Main Market",
  },
  {
    ticker: "MOX",
    name: "MAGHREB OXYGENE",
    sector: "Chemicals",
    market: "Main Market",
  },
  {
    ticker: "MAB",
    name: "MAGHREBAIL",
    sector: "Financial Services",
    market: "Main Market",
  },
  {
    ticker: "MNG",
    name: "MANAGEM",
    sector: "Mining",
    market: "Main Market",
  },
  {
    ticker: "MLE",
    name: "MAROC LEASING",
    sector: "Financial Services",
    market: "Main Market",
  },
  {
    ticker: "MDP",
    name: "MED PAPER",
    sector: "Forestry & Paper",
    market: "Main Market",
  },
  {
    ticker: "MIC",
    name: "MICRODATA",
    sector: "Technology",
    market: "Alternative Market",
  },
  {
    ticker: "MUT",
    name: "MUTANDIS SCA",
    sector: "Food Production",
    market: "Main Market",
  },
  {
    ticker: "OUL",
    name: "OULMES",
    sector: "Beverages",
    market: "Main Market",
  },
  {
    ticker: "PRO",
    name: "PROMOPHARM S.A.",
    sector: "Pharmaceuticals",
    market: "Main Market",
  },
  {
    ticker: "SRM",
    name: "REALISATIONS MECANIQUES",
    sector: "Distributors",
    market: "Main Market",
  },
  {
    ticker: "REB",
    name: "REBAB COMPANY",
    sector: "Mining",
    market: "Main Market",
  },
  {
    ticker: "RDS",
    name: "RESIDENCES DAR SAADA",
    sector: "Real Estate Development",
    market: "Main Market",
  },
  {
    ticker: "RIS",
    name: "RISMA",
    sector: "Hospitality",
    market: "Main Market",
  },
  {
    ticker: "S2M",
    name: "S.M MONETIQUE",
    sector: "Technology",
    market: "Main Market",
  },
  {
    ticker: "SLF",
    name: "SALAFIN",
    sector: "Financial Services",
    market: "Main Market",
  },
  {
    ticker: "SAM",
    name: "SAMIR",
    sector: "Oil & Gas",
    market: "Suspended / Special",
  },
  {
    ticker: "SAH",
    name: "SANLAM MAROC",
    sector: "Insurance",
    market: "Main Market",
  },
  {
    ticker: "SMI",
    name: "SMI",
    sector: "Mining",
    market: "Main Market",
  },
  {
    ticker: "SNP",
    name: "SNEP",
    sector: "Chemicals",
    market: "Main Market",
  },
  {
    ticker: "SBM",
    name: "SOCIETE DES BOISSONS DU MAROC",
    sector: "Beverages",
    market: "Main Market",
  },
  {
    ticker: "MSA",
    name: "SODEP-Marsa Maroc",
    sector: "Transport Services",
    market: "Main Market",
  },
  {
    ticker: "SID",
    name: "SONASID",
    sector: "Construction & Building Materials",
    market: "Main Market",
  },
  {
    ticker: "SOT",
    name: "SOTHEMA",
    sector: "Pharmaceuticals",
    market: "Main Market",
  },
  {
    ticker: "SNA",
    name: "STOKVIS NORD AFRIQUE",
    sector: "Distributors",
    market: "Main Market",
  },
  {
    ticker: "STR",
    name: "STROC INDUSTRIE",
    sector: "Industrial Services",
    market: "Main Market",
  },
  {
    ticker: "TQM",
    name: "TAQA MOROCCO",
    sector: "Electricity",
    market: "Main Market",
  },
  {
    ticker: "TGC",
    name: "TGCC S.A",
    sector: "Construction & Building Materials",
    market: "Main Market",
  },
  {
    ticker: "TMA",
    name: "TOTALENERGIES MARKETING MAROC",
    sector: "Oil & Gas",
    market: "Main Market",
  },
  {
    ticker: "UMR",
    name: "UNIMER",
    sector: "Food Production",
    market: "Main Market",
  },
  {
    ticker: "VCN",
    name: "VICENNE",
    sector: "Health",
    market: "Main Market",
  },
  {
    ticker: "WAA",
    name: "WAFA ASSURANCE",
    sector: "Insurance",
    market: "Main Market",
  },
  {
    ticker: "ZDJ",
    name: "ZELLIDJA S.A",
    sector: "Holdings",
    market: "Main Market",
  },
];

const normPresets: NormResult[][] = [
  [
    { name: "AAOIFI", status: "sharia_compliant" },
    { name: "Norm 2", status: "sharia_compliant" },
    { name: "Norm 3", status: "sharia_compliant" },
    { name: "Norm 4", status: "not_sharia_compliant" },
  ],
  [
    { name: "AAOIFI", status: "not_sharia_compliant" },
    { name: "Norm 2", status: "not_sharia_compliant" },
    { name: "Norm 3", status: "not_sharia_compliant" },
    { name: "Norm 4", status: "sharia_compliant" },
  ],
  [
    { name: "AAOIFI", status: "sharia_compliant" },
    { name: "Norm 2", status: "not_sharia_compliant" },
    { name: "Norm 3", status: "under_review" },
    { name: "Norm 4", status: "under_review" },
  ],
  [
    { name: "AAOIFI", status: "under_review" },
    { name: "Norm 2", status: "under_review" },
    { name: "Norm 3", status: "under_review" },
    { name: "Norm 4", status: "under_review" },
  ],
];

function buildNorms(index: number) {
  return normPresets[index % normPresets.length].map((norm) => ({ ...norm }));
}

function buildCompany(seed: CompanySeed, index: number): CompanyScreeningData {
  return {
    ...seed,
    note: `${seed.name} is included in the current EinveX MVP screener for the Casablanca Stock Exchange universe.`,
    description: `${seed.name} is presented as a locally listed ${seed.sector.toLowerCase()} company in the current EinveX screening experience.`,
    reasoning: `This demo view applies a temporary scholar-consensus screening model across AAOIFI, Norm 2, Norm 3, and Norm 4 for ${seed.name}.`,
    norms: buildNorms(index),
  };
}

export const companies = companySeeds
  .map((seed, index) => buildCompany(seed, index))
  .sort((left, right) => left.name.localeCompare(right.name));

export const companyScreeningData: Record<string, CompanyScreeningData> =
  Object.fromEntries(companies.map((company) => [company.ticker, company]));

export function formatNormStatus(status: NormStatus): FinalStatus {
  if (status === "sharia_compliant") {
    return "Sharia-compliant";
  }

  if (status === "not_sharia_compliant") {
    return "Not Sharia-compliant";
  }

  return "Under review";
}

export function getFinalStatus(norms: NormResult[]): FinalStatus {
  const shariaCompliantCount = norms.filter(
    (norm) => norm.status === "sharia_compliant"
  ).length;
  const notShariaCompliantCount = norms.filter(
    (norm) => norm.status === "not_sharia_compliant"
  ).length;

  if (shariaCompliantCount > notShariaCompliantCount) {
    return "Sharia-compliant";
  }

  if (notShariaCompliantCount > shariaCompliantCount) {
    return "Not Sharia-compliant";
  }

  return "Under review";
}

export function getConsensusScore(norms: NormResult[]) {
  const availableResults = norms.filter((norm) => norm.status !== "under_review");
  const shariaCompliantCount = availableResults.filter(
    (norm) => norm.status === "sharia_compliant"
  ).length;

  if (availableResults.length === 0) {
    return 0;
  }

  return Math.round((shariaCompliantCount / availableResults.length) * 100);
}

export function getHelperText(norms: NormResult[]) {
  const availableResults = norms.filter((norm) => norm.status !== "under_review");
  const shariaCompliantCount = availableResults.filter(
    (norm) => norm.status === "sharia_compliant"
  ).length;
  const finalStatus = getFinalStatus(norms);

  if (availableResults.length === 0) {
    return "All available scholar norms are still under review for this company.";
  }

  if (finalStatus === "Under review") {
    return `${shariaCompliantCount} of ${availableResults.length} available scholar norms currently classify this company as Sharia-compliant.`;
  }

  return `${shariaCompliantCount} of ${availableResults.length} scholar norms classify this company as Sharia-compliant.`;
}

export function getStatusStyle(status: FinalStatus) {
  if (status === "Sharia-compliant") {
    return "border border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  if (status === "Not Sharia-compliant") {
    return "border border-red-200 bg-red-50 text-red-700";
  }

  return "border border-slate-200 bg-slate-100 text-slate-700";
}

export function getConsensusCircleColor(status: FinalStatus) {
  if (status === "Sharia-compliant") {
    return {
      stroke: "#059669",
      text: "text-emerald-700",
      track: "rgba(5, 150, 105, 0.14)",
    };
  }

  if (status === "Not Sharia-compliant") {
    return {
      stroke: "#dc2626",
      text: "text-red-700",
      track: "rgba(220, 38, 38, 0.14)",
    };
  }

  return {
    stroke: "#64748b",
    text: "text-slate-600",
    track: "rgba(100, 116, 139, 0.16)",
  };
}

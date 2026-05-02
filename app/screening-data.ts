export type ScreeningStatus =
  | "sharia_compliant"
  | "not_sharia_compliant"
  | "under_review";

export type FinalStatus =
  | "Sharia-compliant"
  | "Not Sharia-compliant"
  | "Under review";

export type ActivityClassification = "Compliant" | "Mixed" | "Not compliant";

export type ScreeningRatioStatus = "PASS" | "FAIL" | "N/A" | "SUSPENDED";

export type AaoifiScreening = {
  status: ScreeningStatus;
  comment: string;
  activityClassification: ActivityClassification | null;
  debtRatio: number | null;
  debtStatus: ScreeningRatioStatus | null;
  depositsRatio: number | null;
  depositsStatus: ScreeningRatioStatus | null;
  nonCompliantRevenueRatio: number | null;
  revenueStatus: ScreeningRatioStatus | null;
};

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
  aaoifi: AaoifiScreening;
};

type AaoifiDatasetRow = {
  ticker: string;
  shariaStatus: "Sharia-compliant" | "Not Sharia-compliant";
  activityClassification: ActivityClassification;
  debtRatio: number | null;
  debtStatus: ScreeningRatioStatus;
  depositsRatio: number | null;
  depositsStatus: ScreeningRatioStatus;
  nonCompliantRevenueRatio: number | null;
  revenueStatus: ScreeningRatioStatus;
  screeningComment: string;
};

const companySeeds: CompanySeed[] = [
  { ticker: "AFM", name: "AFMA SA", sector: "Insurance", market: "Main Market" },
  { ticker: "AFI", name: "AFRIC INDUSTRIES SA", sector: "Construction & Building Materials", market: "Main Market" },
  { ticker: "GAZ", name: "AFRIQUIA GAZ", sector: "Oil & Gas", market: "Main Market" },
  { ticker: "AGM", name: "AGMA", sector: "Insurance", market: "Alternative Market" },
  { ticker: "AKT", name: "AKDITAL", sector: "Health", market: "Main Market" },
  { ticker: "ADI", name: "ALLIANCES DEVELOPPEMENT IMMOBILIER", sector: "Real Estate Development", market: "Main Market" },
  { ticker: "ALM", name: "ALUMINIUM DU MAROC", sector: "Construction & Building Materials", market: "Main Market" },
  { ticker: "ARD", name: "ARADEI CAPITAL", sector: "Real Estate Investment", market: "Main Market" },
  { ticker: "ATL", name: "ATLANTASANAD", sector: "Insurance", market: "Main Market" },
  { ticker: "ATW", name: "ATTIJARIWAFA BANK", sector: "Banks", market: "Main Market" },
  { ticker: "ATH", name: "AUTO HALL", sector: "Distributors", market: "Main Market" },
  { ticker: "NEJ", name: "AUTO NEJMA", sector: "Distributors", market: "Main Market" },
  { ticker: "BAL", name: "BALIMA", sector: "Real Estate Investment", market: "Main Market" },
  { ticker: "BCI", name: "BANQUE MAROCAINE POUR LE COMMERCE ET L'INDUSTRIE", sector: "Banks", market: "Main Market" },
  { ticker: "BCP", name: "BANQUE CENTRALE POPULAIRE", sector: "Banks", market: "Main Market" },
  { ticker: "BOA", name: "BANK OF AFRICA", sector: "Banks", market: "Main Market" },
  { ticker: "CAP", name: "CASH PLUS S.A", sector: "Financial Services", market: "Main Market" },
  { ticker: "CRS", name: "CARTIER SAADA", sector: "Food Production", market: "Main Market" },
  { ticker: "CFG", name: "CFG BANK", sector: "Banks", market: "Main Market" },
  { ticker: "CIH", name: "CREDIT IMMOBILIER ET HOTELIER", sector: "Banks", market: "Main Market" },
  { ticker: "CDM", name: "CREDIT DU MAROC", sector: "Banks", market: "Main Market" },
  { ticker: "CMG", name: "CMGP GROUP", sector: "Agricultural Industry", market: "Main Market" },
  { ticker: "CMA", name: "CIMENTS DU MAROC", sector: "Construction & Building Materials", market: "Main Market" },
  { ticker: "CMT", name: "COMPAGNIE MINIERE DE TOUISSIT", sector: "Mining", market: "Main Market" },
  { ticker: "CTM", name: "COMPAGNIE DE TRANSPORT AU MAROC", sector: "Transport Services", market: "Main Market" },
  { ticker: "CSR", name: "COSUMAR", sector: "Food Production", market: "Main Market" },
  { ticker: "COL", name: "COLORADO", sector: "Chemicals", market: "Alternative Market" },
  { ticker: "DRI", name: "DARI COUSPATE", sector: "Food Production", market: "Main Market" },
  { ticker: "DIS", name: "DIAC SALAF", sector: "Financial Services", market: "Main Market" },
  { ticker: "DHO", name: "DELTA HOLDING", sector: "Industrial Services", market: "Main Market" },
  { ticker: "DLM", name: "DELATTRE LEVIVIER MAROC", sector: "Industrial Services", market: "Main Market" },
  { ticker: "DWY", name: "DISWAY", sector: "Technology", market: "Main Market" },
  { ticker: "DYT", name: "DISTY TECHNOLOGIES", sector: "Technology", market: "Alternative Market" },
  { ticker: "ADH", name: "DOUJA PROMOTION GROUPE ADDOHA", sector: "Real Estate Development", market: "Main Market" },
  { ticker: "EQD", name: "EQDOM", sector: "Financial Services", market: "Main Market" },
  { ticker: "FBR", name: "FENIE BROSSETTE", sector: "Distributors", market: "Main Market" },
  { ticker: "GTM", name: "SGTM S.A", sector: "Construction & Building Materials", market: "Main Market" },
  { ticker: "HPS", name: "HIGHTECH PAYMENT SYSTEMS", sector: "Technology", market: "Main Market" },
  { ticker: "IAM", name: "ITISSALAT AL-MAGHRIB", sector: "Telecommunications", market: "Main Market" },
  { ticker: "IBC", name: "IB MAROC.COM", sector: "Technology", market: "Main Market" },
  { ticker: "IMO", name: "IMMORENTE INVEST", sector: "Real Estate Investment", market: "Main Market" },
  { ticker: "INV", name: "INVOLYS", sector: "Technology", market: "Alternative Market" },
  { ticker: "JET", name: "JET CONTRACTORS", sector: "Construction & Building Materials", market: "Main Market" },
  { ticker: "LBV", name: "LABEL VIE", sector: "Retail", market: "Main Market" },
  { ticker: "LHM", name: "LAFARGEHOLCIM MAROC", sector: "Construction & Building Materials", market: "Main Market" },
  { ticker: "LES", name: "LESIEUR CRISTAL", sector: "Food Production", market: "Main Market" },
  { ticker: "M2M", name: "M2M GROUP", sector: "Technology", market: "Main Market" },
  { ticker: "MOX", name: "MAGHREB OXYGENE", sector: "Chemicals", market: "Main Market" },
  { ticker: "MAB", name: "MAGHREBAIL", sector: "Financial Services", market: "Main Market" },
  { ticker: "MNG", name: "MANAGEM", sector: "Mining", market: "Main Market" },
  { ticker: "MLE", name: "MAROC LEASING", sector: "Financial Services", market: "Main Market" },
  { ticker: "MDP", name: "MED PAPER", sector: "Forestry & Paper", market: "Main Market" },
  { ticker: "MIC", name: "MICRODATA", sector: "Technology", market: "Alternative Market" },
  { ticker: "MUT", name: "MUTANDIS SCA", sector: "Food Production", market: "Main Market" },
  { ticker: "NKL", name: "ENNAKL AUTOMOBILES SA", sector: "Distributors", market: "Main Market" },
  { ticker: "OUL", name: "OULMES", sector: "Beverages", market: "Main Market" },
  { ticker: "PRO", name: "PROMOPHARM S.A.", sector: "Pharmaceuticals", market: "Main Market" },
  { ticker: "SRM", name: "REALISATIONS MECANIQUES", sector: "Distributors", market: "Main Market" },
  { ticker: "REB", name: "REBAB COMPANY", sector: "Mining", market: "Main Market" },
  { ticker: "RDS", name: "RESIDENCES DAR SAADA", sector: "Real Estate Development", market: "Main Market" },
  { ticker: "RIS", name: "RISMA", sector: "Hospitality", market: "Main Market" },
  { ticker: "S2M", name: "S.M MONETIQUE", sector: "Technology", market: "Main Market" },
  { ticker: "SLF", name: "SALAFIN", sector: "Financial Services", market: "Main Market" },
  { ticker: "SAM", name: "SAMIR", sector: "Oil & Gas", market: "Suspended / Special" },
  { ticker: "SAH", name: "SANLAM MAROC", sector: "Insurance", market: "Main Market" },
  { ticker: "SMI", name: "SMI", sector: "Mining", market: "Main Market" },
  { ticker: "SNP", name: "SNEP", sector: "Chemicals", market: "Main Market" },
  { ticker: "SBM", name: "SOCIETE DES BOISSONS DU MAROC", sector: "Beverages", market: "Main Market" },
  { ticker: "MSA", name: "SODEP-Marsa Maroc", sector: "Transport Services", market: "Main Market" },
  { ticker: "SID", name: "SONASID", sector: "Construction & Building Materials", market: "Main Market" },
  { ticker: "SOT", name: "SOTHEMA", sector: "Pharmaceuticals", market: "Main Market" },
  { ticker: "SNA", name: "STOKVIS NORD AFRIQUE", sector: "Distributors", market: "Main Market" },
  { ticker: "STR", name: "STROC INDUSTRIE", sector: "Industrial Services", market: "Main Market" },
  { ticker: "TQM", name: "TAQA MOROCCO", sector: "Electricity", market: "Main Market" },
  { ticker: "TGC", name: "TGCC S.A", sector: "Construction & Building Materials", market: "Main Market" },
  { ticker: "TMA", name: "TOTALENERGIES MARKETING MAROC", sector: "Oil & Gas", market: "Main Market" },
  { ticker: "UMR", name: "UNIMER", sector: "Food Production", market: "Main Market" },
  { ticker: "VCN", name: "VICENNE", sector: "Health", market: "Main Market" },
  { ticker: "WAA", name: "WAFA ASSURANCE", sector: "Insurance", market: "Main Market" },
  { ticker: "ZDJ", name: "ZELLIDJA S.A", sector: "Holdings", market: "Main Market" },
];

const aaoifiPendingComment = "AAOIFI screening pending";

const aaoifiDatasetRows: AaoifiDatasetRow[] = [
  { ticker: "ADH", shariaStatus: "Not Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.3312359630419332, debtStatus: "FAIL", depositsRatio: 0.03716986496090974, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Not Sharia-compliant. Although the core business activity is generally permissible, the company fails the financial screen because interest-bearing debt is 33.1%, above the 30.0% threshold." },
  { ticker: "ADI", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.15386807653575027, debtStatus: "PASS", depositsRatio: 0.06558509566968782, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.001103472957456644, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because the core business activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 15.4% / 30.0%, interest-bearing deposits/cash: 6.6% / 30.0%, non-compliant revenue: 0.1% / 5.0%." },
  { ticker: "AFI", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.0015810276679841897, debtStatus: "PASS", depositsRatio: 0.01798418972332016, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because industrial and construction-related activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 0.2% / 30.0%, interest-bearing deposits/cash: 1.8% / 30.0%, non-compliant revenue: 0.0% / 5.0%." },
  { ticker: "AFM", shariaStatus: "Not Sharia-compliant", activityClassification: "Not compliant", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company fails the activity screen because conventional insurance is non-compliant under AAOIFI due to gharar and riba exposure; only takaful would be acceptable. Financial ratios are not decisive when the core activity is non-compliant." },
  { ticker: "AGM", shariaStatus: "Not Sharia-compliant", activityClassification: "Not compliant", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company fails the activity screen because conventional insurance is non-compliant under AAOIFI due to gharar and riba exposure; only takaful would be acceptable. Financial ratios are not decisive when the core activity is non-compliant." },
  { ticker: "AKT", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.10629887005649717, debtStatus: "PASS", depositsRatio: 0.006244632768361582, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.006630552131999578, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because healthcare activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 10.6% / 30.0%, interest-bearing deposits/cash: 0.6% / 30.0%, non-compliant revenue: 0.7% / 5.0%." },
  { ticker: "ALM", shariaStatus: "Not Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.5158296174606899, debtStatus: "FAIL", depositsRatio: 0.04396855198310255, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Not Sharia-compliant. Although industrial and construction-related activity is generally permissible, the company fails the financial screen because interest-bearing debt is 51.6%, above the 30.0% threshold." },
  { ticker: "ARD", shariaStatus: "Not Sharia-compliant", activityClassification: "Mixed", debtRatio: 0.6707206007340555, debtStatus: "FAIL", depositsRatio: 0.15984974261716042, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.11159881878662815, revenueStatus: "FAIL", screeningComment: "AAOIFI status: Not Sharia-compliant. Although real estate is generally permissible, but debt structure, tenants, and non-compliant rental exposure must be reviewed, the company fails the financial screen because interest-bearing debt is 67.1%, above the 30.0% threshold; non-compliant revenue is 11.2%, above the 5.0% threshold." },
  { ticker: "ATH", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0, debtStatus: "PASS", depositsRatio: 0.10551724137931034, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.016213418316341804, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because distribution activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 0.0% / 30.0%, interest-bearing deposits/cash: 10.6% / 30.0%, non-compliant revenue: 1.6% / 5.0%." },
  { ticker: "ATL", shariaStatus: "Not Sharia-compliant", activityClassification: "Not compliant", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company fails the activity screen because conventional insurance is non-compliant under AAOIFI due to gharar and riba exposure; only takaful would be acceptable. Financial ratios are not decisive when the core activity is non-compliant." },
  { ticker: "ATW", shariaStatus: "Not Sharia-compliant", activityClassification: "Not compliant", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company fails the activity screen because core banking activity is non-compliant under AAOIFI due to interest-based financial intermediation. Financial ratios are not decisive when the core activity is non-compliant." },
  { ticker: "BAL", shariaStatus: "Sharia-compliant", activityClassification: "Mixed", debtRatio: 0.016902672516952533, debtStatus: "PASS", depositsRatio: 0.030763861188671717, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.011829525198509156, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company is acceptable after qualitative review because real estate is generally permissible, but debt structure, tenants, and non-compliant rental exposure must be reviewed; its financial ratios remain within AAOIFI thresholds. Debt: 1.7% / 30.0%, interest-bearing deposits/cash: 3.1% / 30.0%, non-compliant revenue: 1.2% / 5.0%." },
  { ticker: "BCI", shariaStatus: "Not Sharia-compliant", activityClassification: "Not compliant", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company fails the activity screen because core banking activity is non-compliant under AAOIFI due to interest-based financial intermediation. Financial ratios are not decisive when the core activity is non-compliant." },
  { ticker: "BCP", shariaStatus: "Not Sharia-compliant", activityClassification: "Not compliant", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company fails the activity screen because core banking activity is non-compliant under AAOIFI due to interest-based financial intermediation. Financial ratios are not decisive when the core activity is non-compliant." },
  { ticker: "BOA", shariaStatus: "Not Sharia-compliant", activityClassification: "Not compliant", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company fails the activity screen because core banking activity is non-compliant under AAOIFI due to interest-based financial intermediation. Financial ratios are not decisive when the core activity is non-compliant." },
  { ticker: "CAP", shariaStatus: "Not Sharia-compliant", activityClassification: "Not compliant", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company fails the activity screen because conventional financing/leasing activity is non-compliant under AAOIFI due to interest-based lending or leasing exposure. Financial ratios are not decisive when the core activity is non-compliant." },
  { ticker: "CDM", shariaStatus: "Not Sharia-compliant", activityClassification: "Not compliant", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company fails the activity screen because core banking activity is non-compliant under AAOIFI due to interest-based financial intermediation. Financial ratios are not decisive when the core activity is non-compliant." },
  { ticker: "CFG", shariaStatus: "Not Sharia-compliant", activityClassification: "Not compliant", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company fails the activity screen because core banking activity is non-compliant under AAOIFI due to interest-based financial intermediation. Financial ratios are not decisive when the core activity is non-compliant." },
  { ticker: "CIH", shariaStatus: "Not Sharia-compliant", activityClassification: "Not compliant", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company fails the activity screen because core banking activity is non-compliant under AAOIFI due to interest-based financial intermediation. Financial ratios are not decisive when the core activity is non-compliant." },
  { ticker: "CMA", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.007601874490627547, debtStatus: "PASS", depositsRatio: 0.035033007334963326, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.0007672367220378534, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because industrial and construction-related activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 0.8% / 30.0%, interest-bearing deposits/cash: 3.5% / 30.0%, non-compliant revenue: 0.1% / 5.0%." },
  { ticker: "CMG", shariaStatus: "Not Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.30743300653594774, debtStatus: "FAIL", depositsRatio: 0.01806045751633987, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.9799271308799826, revenueStatus: "FAIL", screeningComment: "AAOIFI status: Not Sharia-compliant. Although the core business activity is generally permissible, the company fails the financial screen because interest-bearing debt is 30.7%, above the 30.0% threshold; non-compliant revenue is 98.0%, above the 5.0% threshold." },
  { ticker: "CMT", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0, debtStatus: "PASS", depositsRatio: 0.014056152927120669, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because mining activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 0.0% / 30.0%, interest-bearing deposits/cash: 1.4% / 30.0%, non-compliant revenue: 0.0% / 5.0%." },
  { ticker: "COL", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.01325, debtStatus: "PASS", depositsRatio: 0.10367424242424242, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.004288711055862015, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because industrial and construction-related activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 1.3% / 30.0%, interest-bearing deposits/cash: 10.4% / 30.0%, non-compliant revenue: 0.4% / 5.0%." },
  { ticker: "CRS", shariaStatus: "Sharia-compliant", activityClassification: "Mixed", debtRatio: 0.16878759100981325, debtStatus: "PASS", depositsRatio: 0.00937005381449826, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company is acceptable after qualitative review because food production is generally permissible, but product mix should exclude alcohol, pork, and non-halal ingredients; its financial ratios remain within AAOIFI thresholds. Debt: 16.9% / 30.0%, interest-bearing deposits/cash: 0.9% / 30.0%, non-compliant revenue: 0.0% / 5.0%." },
  { ticker: "CSR", shariaStatus: "Sharia-compliant", activityClassification: "Mixed", debtRatio: 0.05556311507905366, debtStatus: "PASS", depositsRatio: 0.021122803272116433, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company is acceptable after qualitative review because food production is generally permissible, but product mix should exclude alcohol, pork, and non-halal ingredients; its financial ratios remain within AAOIFI thresholds. Debt: 5.6% / 30.0%, interest-bearing deposits/cash: 2.1% / 30.0%, non-compliant revenue: 0.0% / 5.0%." },
  { ticker: "CTM", shariaStatus: "Not Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.32360714285714287, debtStatus: "FAIL", depositsRatio: 0.04513392857142857, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.008160413425791654, revenueStatus: "PASS", screeningComment: "AAOIFI status: Not Sharia-compliant. Although transport and logistics activity is generally permissible, the company fails the financial screen because interest-bearing debt is 32.4%, above the 30.0% threshold." },
  { ticker: "DHO", shariaStatus: "Sharia-compliant", activityClassification: "Mixed", debtRatio: 0.0006086142322097378, debtStatus: "PASS", depositsRatio: 0.0010599250936329588, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.004772099981943405, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company is acceptable after qualitative review because the activity requires look-through analysis of subsidiaries and revenue sources; its financial ratios remain within AAOIFI thresholds. Debt: 0.1% / 30.0%, interest-bearing deposits/cash: 0.1% / 30.0%, non-compliant revenue: 0.5% / 5.0%." },
  { ticker: "DIS", shariaStatus: "Not Sharia-compliant", activityClassification: "Not compliant", debtRatio: null, debtStatus: "SUSPENDED", depositsRatio: null, depositsStatus: "SUSPENDED", nonCompliantRevenueRatio: null, revenueStatus: "SUSPENDED", screeningComment: "AAOIFI status: Not Sharia-compliant. The company fails the activity screen because conventional financing/leasing activity is non-compliant under AAOIFI due to interest-based lending or leasing exposure. Financial ratios are not decisive when the core activity is non-compliant." },
  { ticker: "DLM", shariaStatus: "Not Sharia-compliant", activityClassification: "Compliant", debtRatio: null, debtStatus: "SUSPENDED", depositsRatio: null, depositsStatus: "SUSPENDED", nonCompliantRevenueRatio: null, revenueStatus: "SUSPENDED", screeningComment: "AAOIFI status: Not Sharia-compliant. The stock is suspended or lacks reliable current screening inputs, so it should not be treated as eligible until updated data is available." },
  { ticker: "DRI", shariaStatus: "Sharia-compliant", activityClassification: "Mixed", debtRatio: 0, debtStatus: "PASS", depositsRatio: 0, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.0020772238514173997, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company is acceptable after qualitative review because food production is generally permissible, but product mix should exclude alcohol, pork, and non-halal ingredients; its financial ratios remain within AAOIFI thresholds. Debt: 0.0% / 30.0%, interest-bearing deposits/cash: 0.0% / 30.0%, non-compliant revenue: 0.2% / 5.0%." },
  { ticker: "DWY", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.22198684210526318, debtStatus: "PASS", depositsRatio: 0.08476315789473685, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because technology activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 22.2% / 30.0%, interest-bearing deposits/cash: 8.5% / 30.0%, non-compliant revenue: 0.0% / 5.0%." },
  { ticker: "DYT", shariaStatus: "Not Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.35477317005288056, debtStatus: "FAIL", depositsRatio: 0.11427776231561369, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Not Sharia-compliant. Although technology activity is generally permissible, the company fails the financial screen because interest-bearing debt is 35.5%, above the 30.0% threshold." },
  { ticker: "EQD", shariaStatus: "Not Sharia-compliant", activityClassification: "Not compliant", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company fails the activity screen because conventional financing/leasing activity is non-compliant under AAOIFI due to interest-based lending or leasing exposure. Financial ratios are not decisive when the core activity is non-compliant." },
  { ticker: "FBR", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.2415170082400169, debtStatus: "PASS", depositsRatio: 0.03281216987111768, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because distribution activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 24.2% / 30.0%, interest-bearing deposits/cash: 3.3% / 30.0%, non-compliant revenue: 0.0% / 5.0%." },
  { ticker: "GAZ", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.11442533229085222, debtStatus: "PASS", depositsRatio: 0.0812384675527756, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.0008213256484149856, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because energy marketing or extractive activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 11.4% / 30.0%, interest-bearing deposits/cash: 8.1% / 30.0%, non-compliant revenue: 0.1% / 5.0%." },
  { ticker: "GTM", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.03389671361502347, debtStatus: "PASS", depositsRatio: 0.003427230046948357, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because industrial and construction-related activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 3.4% / 30.0%, interest-bearing deposits/cash: 0.3% / 30.0%, non-compliant revenue: 0.0% / 5.0%." },
  { ticker: "HPS", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.13861323155216285, debtStatus: "PASS", depositsRatio: 0.06277862595419847, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because technology activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 13.9% / 30.0%, interest-bearing deposits/cash: 6.3% / 30.0%, non-compliant revenue: 0.0% / 5.0%." },
  { ticker: "IAM", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.18028656126482212, debtStatus: "PASS", depositsRatio: 0.026729249011857706, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.0017720345683051172, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because telecommunications activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 18.0% / 30.0%, interest-bearing deposits/cash: 2.7% / 30.0%, non-compliant revenue: 0.2% / 5.0%." },
  { ticker: "IBC", shariaStatus: "Not Sharia-compliant", activityClassification: "Compliant", debtRatio: 2.397213727488957, debtStatus: "FAIL", depositsRatio: 0, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. Although technology activity is generally permissible, the company fails the financial screen because interest-bearing debt is 239.7%, above the 30.0% threshold." },
  { ticker: "IMO", shariaStatus: "Not Sharia-compliant", activityClassification: "Mixed", debtRatio: 0.4118640740090309, debtStatus: "FAIL", depositsRatio: 0.04392241818992595, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.004303599374021909, revenueStatus: "PASS", screeningComment: "AAOIFI status: Not Sharia-compliant. Although real estate is generally permissible, but debt structure, tenants, and non-compliant rental exposure must be reviewed, the company fails the financial screen because interest-bearing debt is 41.2%, above the 30.0% threshold." },
  { ticker: "INV", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.2413615265600825, debtStatus: "PASS", depositsRatio: 0.0032662884648444216, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.01583011583011583, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because technology activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 24.1% / 30.0%, interest-bearing deposits/cash: 0.3% / 30.0%, non-compliant revenue: 1.6% / 5.0%." },
  { ticker: "JET", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.23548033707865168, debtStatus: "PASS", depositsRatio: 0.0407064606741573, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because industrial and construction-related activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 23.5% / 30.0%, interest-bearing deposits/cash: 4.1% / 30.0%, non-compliant revenue: 0.0% / 5.0%." },
  { ticker: "LBV", shariaStatus: "Not Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.5917117647058824, debtStatus: "FAIL", depositsRatio: 0.20468907563025213, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Not Sharia-compliant. Although distribution activity is generally permissible, the company fails the financial screen because interest-bearing debt is 59.2%, above the 30.0% threshold." },
  { ticker: "LES", shariaStatus: "Sharia-compliant", activityClassification: "Mixed", debtRatio: 0.021462488129154796, debtStatus: "PASS", depositsRatio: 0.05641025641025641, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.003895184135977337, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company is acceptable after qualitative review because food production is generally permissible, but product mix should exclude alcohol, pork, and non-halal ingredients; its financial ratios remain within AAOIFI thresholds. Debt: 2.1% / 30.0%, interest-bearing deposits/cash: 5.6% / 30.0%, non-compliant revenue: 0.4% / 5.0%." },
  { ticker: "LHM", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.26978546540567444, debtStatus: "PASS", depositsRatio: 0.010037829766052763, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.002523654663978692, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because industrial and construction-related activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 27.0% / 30.0%, interest-bearing deposits/cash: 1.0% / 30.0%, non-compliant revenue: 0.3% / 5.0%." },
  { ticker: "M2M", shariaStatus: "Not Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.0019559902200489, debtStatus: "PASS", depositsRatio: 0.677296542088718, depositsStatus: "FAIL", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Not Sharia-compliant. Although technology activity is generally permissible, the company fails the financial screen because interest-bearing deposits/cash are 67.7%, above the 30.0% threshold." },
  { ticker: "MAB", shariaStatus: "Not Sharia-compliant", activityClassification: "Not compliant", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company fails the activity screen because conventional financing/leasing activity is non-compliant under AAOIFI due to interest-based lending or leasing exposure. Financial ratios are not decisive when the core activity is non-compliant." },
  { ticker: "MDP", shariaStatus: "Not Sharia-compliant", activityClassification: "Compliant", debtRatio: 1.0120816326530613, debtStatus: "FAIL", depositsRatio: 0.002775510204081633, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.00023573785950023574, revenueStatus: "PASS", screeningComment: "AAOIFI status: Not Sharia-compliant. Although the core business activity is generally permissible, the company fails the financial screen because interest-bearing debt is 101.2%, above the 30.0% threshold." },
  { ticker: "MIC", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.112, debtStatus: "PASS", depositsRatio: 0.09412000000000001, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.00037688691408961975, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because technology activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 11.2% / 30.0%, interest-bearing deposits/cash: 9.4% / 30.0%, non-compliant revenue: 0.0% / 5.0%." },
  { ticker: "MLE", shariaStatus: "Not Sharia-compliant", activityClassification: "Not compliant", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company fails the activity screen because conventional financing/leasing activity is non-compliant under AAOIFI due to interest-based lending or leasing exposure. Financial ratios are not decisive when the core activity is non-compliant." },
  { ticker: "MNG", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.06715501263689976, debtStatus: "PASS", depositsRatio: 0.02181213142375737, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.006637018308237578, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because mining activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 6.7% / 30.0%, interest-bearing deposits/cash: 2.2% / 30.0%, non-compliant revenue: 0.7% / 5.0%." },
  { ticker: "MOX", shariaStatus: "Not Sharia-compliant", activityClassification: "Compliant", debtRatio: 1.4569547060713137, debtStatus: "FAIL", depositsRatio: 1.0523289431416638, depositsStatus: "FAIL", nonCompliantRevenueRatio: 0.04540363834488604, revenueStatus: "PASS", screeningComment: "AAOIFI status: Not Sharia-compliant. Although the core business activity is generally permissible, the company fails the financial screen because interest-bearing debt is 145.7%, above the 30.0% threshold; interest-bearing deposits/cash are 105.2%, above the 30.0% threshold." },
  { ticker: "MSA", shariaStatus: "Not Sharia-compliant", activityClassification: "Compliant", debtRatio: 3.481448274043406, debtStatus: "FAIL", depositsRatio: 42.01155032831412, depositsStatus: "FAIL", nonCompliantRevenueRatio: 0.000025957688966983818, revenueStatus: "PASS", screeningComment: "AAOIFI status: Not Sharia-compliant. Although transport and logistics activity is generally permissible, the company fails the financial screen because interest-bearing debt is 348.1%, above the 30.0% threshold; interest-bearing deposits/cash are 4201.2%, above the 30.0% threshold." },
  { ticker: "MUT", shariaStatus: "Not Sharia-compliant", activityClassification: "Mixed", debtRatio: 0.454212389380531, debtStatus: "FAIL", depositsRatio: 0.11492477876106195, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Not Sharia-compliant. Although food production is generally permissible, but product mix should exclude alcohol, pork, and non-halal ingredients, the company fails the financial screen because interest-bearing debt is 45.4%, above the 30.0% threshold." },
  { ticker: "NEJ", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0, debtStatus: "PASS", depositsRatio: 0.1032562358276644, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.0063434537267493775, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because distribution activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 0.0% / 30.0%, interest-bearing deposits/cash: 10.3% / 30.0%, non-compliant revenue: 0.6% / 5.0%." },
  { ticker: "NKL", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.0002787878787878788, debtStatus: "PASS", depositsRatio: 0.020563636363636364, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.0145713648279324, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because distribution activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 0.0% / 30.0%, interest-bearing deposits/cash: 2.1% / 30.0%, non-compliant revenue: 1.5% / 5.0%." },
  { ticker: "OUL", shariaStatus: "Not Sharia-compliant", activityClassification: "Mixed", debtRatio: 0.49874999999999997, debtStatus: "FAIL", depositsRatio: 0.07848728813559322, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Not Sharia-compliant. Although beverage activity is permissible only when alcohol exposure is absent or immaterial, the company fails the financial screen because interest-bearing debt is 49.9%, above the 30.0% threshold." },
  { ticker: "PRO", shariaStatus: "Sharia-compliant", activityClassification: "Mixed", debtRatio: 0.1492482269503546, debtStatus: "PASS", depositsRatio: 0.10700709219858155, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.00005382131324004306, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company is acceptable after qualitative review because pharmaceutical activity is generally permissible, but ingredients and alcohol-based revenue should be monitored; its financial ratios remain within AAOIFI thresholds. Debt: 14.9% / 30.0%, interest-bearing deposits/cash: 10.7% / 30.0%, non-compliant revenue: 0.0% / 5.0%." },
  { ticker: "RDS", shariaStatus: "Not Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.3730913242009133, debtStatus: "FAIL", depositsRatio: 0.058819634703196344, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Not Sharia-compliant. Although the core business activity is generally permissible, the company fails the financial screen because interest-bearing debt is 37.3%, above the 30.0% threshold." },
  { ticker: "REB", shariaStatus: "Not Sharia-compliant", activityClassification: "Compliant", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company requires further look-through/activity evidence before it can be considered eligible under AAOIFI screening." },
  { ticker: "RIS", shariaStatus: "Sharia-compliant", activityClassification: "Mixed", debtRatio: 0.26666666666666666, debtStatus: "PASS", depositsRatio: 0.07864583333333333, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company is acceptable after qualitative review because the business activity is mixed and requires qualitative review; its financial ratios remain within AAOIFI thresholds. Debt: 26.7% / 30.0%, interest-bearing deposits/cash: 7.9% / 30.0%, non-compliant revenue: 0.0% / 5.0%." },
  { ticker: "S2M", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0, debtStatus: "PASS", depositsRatio: 0.13391970198675496, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.04560447049202671, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because technology activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 0.0% / 30.0%, interest-bearing deposits/cash: 13.4% / 30.0%, non-compliant revenue: 4.6% / 5.0%." },
  { ticker: "SAH", shariaStatus: "Not Sharia-compliant", activityClassification: "Not compliant", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company fails the activity screen because conventional insurance is non-compliant under AAOIFI due to gharar and riba exposure; only takaful would be acceptable. Financial ratios are not decisive when the core activity is non-compliant." },
  { ticker: "SAM", shariaStatus: "Not Sharia-compliant", activityClassification: "Compliant", debtRatio: null, debtStatus: "SUSPENDED", depositsRatio: null, depositsStatus: "SUSPENDED", nonCompliantRevenueRatio: null, revenueStatus: "SUSPENDED", screeningComment: "AAOIFI status: Not Sharia-compliant. The stock is suspended or lacks reliable current screening inputs, so it should not be treated as eligible until updated data is available." },
  { ticker: "SBM", shariaStatus: "Sharia-compliant", activityClassification: "Mixed", debtRatio: 0.012856502242152467, debtStatus: "PASS", depositsRatio: 0.10149925261584454, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.00011687400981741682, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company is acceptable after qualitative review because beverage activity is permissible only when alcohol exposure is absent or immaterial; its financial ratios remain within AAOIFI thresholds. Debt: 1.3% / 30.0%, interest-bearing deposits/cash: 10.1% / 30.0%, non-compliant revenue: 0.0% / 5.0%." },
  { ticker: "SID", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.011178528347406513, debtStatus: "PASS", depositsRatio: 0.057782870928829916, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.0003667357570637564, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because industrial and construction-related activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 1.1% / 30.0%, interest-bearing deposits/cash: 5.8% / 30.0%, non-compliant revenue: 0.0% / 5.0%." },
  { ticker: "SLF", shariaStatus: "Not Sharia-compliant", activityClassification: "Not compliant", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company fails the activity screen because conventional financing/leasing activity is non-compliant under AAOIFI due to interest-based lending or leasing exposure. Financial ratios are not decisive when the core activity is non-compliant." },
  { ticker: "SMI", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.002995108315863033, debtStatus: "PASS", depositsRatio: 0.0011684136967155835, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.010518396547808312, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because mining activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 0.3% / 30.0%, interest-bearing deposits/cash: 0.1% / 30.0%, non-compliant revenue: 1.1% / 5.0%." },
  { ticker: "SNA", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.1821548387096774, debtStatus: "PASS", depositsRatio: 0.008, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because distribution activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 18.2% / 30.0%, interest-bearing deposits/cash: 0.8% / 30.0%, non-compliant revenue: 0.0% / 5.0%." },
  { ticker: "SNP", shariaStatus: "Not Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.9200939807563213, debtStatus: "FAIL", depositsRatio: 0.0021705079436115464, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Not Sharia-compliant. Although the core business activity is generally permissible, the company fails the financial screen because interest-bearing debt is 92.0%, above the 30.0% threshold." },
  { ticker: "SOT", shariaStatus: "Sharia-compliant", activityClassification: "Mixed", debtRatio: 0.03344047619047619, debtStatus: "PASS", depositsRatio: 0.000020833333333333336, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.00009219624629568655, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company is acceptable after qualitative review because pharmaceutical activity is generally permissible, but ingredients and alcohol-based revenue should be monitored; its financial ratios remain within AAOIFI thresholds. Debt: 3.3% / 30.0%, interest-bearing deposits/cash: 0.0% / 30.0%, non-compliant revenue: 0.0% / 5.0%." },
  { ticker: "SRM", shariaStatus: "Not Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.5390986601705238, debtStatus: "FAIL", depositsRatio: 0.05133982947624848, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.005975257384913175, revenueStatus: "PASS", screeningComment: "AAOIFI status: Not Sharia-compliant. Although distribution activity is generally permissible, the company fails the financial screen because interest-bearing debt is 53.9%, above the 30.0% threshold." },
  { ticker: "STR", shariaStatus: "Not Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.8677679600461006, debtStatus: "FAIL", depositsRatio: 0.00583941605839416, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Not Sharia-compliant. Although the core business activity is generally permissible, the company fails the financial screen because interest-bearing debt is 86.8%, above the 30.0% threshold." },
  { ticker: "TGC", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.031226903749516817, debtStatus: "PASS", depositsRatio: 0.028707769617317355, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because industrial and construction-related activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 3.1% / 30.0%, interest-bearing deposits/cash: 2.9% / 30.0%, non-compliant revenue: 0.0% / 5.0%." },
  { ticker: "TMA", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.032615384615384616, debtStatus: "PASS", depositsRatio: 0.14142960812772135, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.00005504587155963303, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because energy marketing or extractive activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 3.3% / 30.0%, interest-bearing deposits/cash: 14.1% / 30.0%, non-compliant revenue: 0.0% / 5.0%." },
  { ticker: "TQM", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.22796423318104564, debtStatus: "PASS", depositsRatio: 0.04269476350942853, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.015280981845362196, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because the core business activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 22.8% / 30.0%, interest-bearing deposits/cash: 4.3% / 30.0%, non-compliant revenue: 1.5% / 5.0%." },
  { ticker: "UMR", shariaStatus: "Not Sharia-compliant", activityClassification: "Mixed", debtRatio: 0.5086439790575916, debtStatus: "FAIL", depositsRatio: 0.11179581151832461, depositsStatus: "PASS", nonCompliantRevenueRatio: 0, revenueStatus: "PASS", screeningComment: "AAOIFI status: Not Sharia-compliant. Although food production is generally permissible, but product mix should exclude alcohol, pork, and non-halal ingredients, the company fails the financial screen because interest-bearing debt is 50.9%, above the 30.0% threshold." },
  { ticker: "VCN", shariaStatus: "Sharia-compliant", activityClassification: "Compliant", debtRatio: 0.010174778761061947, debtStatus: "PASS", depositsRatio: 0.001829646017699115, depositsStatus: "PASS", nonCompliantRevenueRatio: 0.0035513643659711076, revenueStatus: "PASS", screeningComment: "AAOIFI status: Sharia-compliant. The company passes the activity screen because healthcare activity is generally permissible, and its financial ratios remain within AAOIFI thresholds. Debt: 1.0% / 30.0%, interest-bearing deposits/cash: 0.2% / 30.0%, non-compliant revenue: 0.4% / 5.0%." },
  { ticker: "WAA", shariaStatus: "Not Sharia-compliant", activityClassification: "Not compliant", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company fails the activity screen because conventional insurance is non-compliant under AAOIFI due to gharar and riba exposure; only takaful would be acceptable. Financial ratios are not decisive when the core activity is non-compliant." },
  { ticker: "ZDJ", shariaStatus: "Not Sharia-compliant", activityClassification: "Mixed", debtRatio: 0, debtStatus: "N/A", depositsRatio: 0, depositsStatus: "N/A", nonCompliantRevenueRatio: 0, revenueStatus: "N/A", screeningComment: "AAOIFI status: Not Sharia-compliant. The company requires further look-through/activity evidence before it can be considered eligible under AAOIFI screening." },
];

function normalizeTicker(value: string) {
  return value.trim().toUpperCase();
}

function normalizeAaoifiStatus(
  status: AaoifiDatasetRow["shariaStatus"]
): ScreeningStatus {
  if (status === "Sharia-compliant") {
    return "sharia_compliant";
  }

  return "not_sharia_compliant";
}

const aaoifiByTicker = Object.fromEntries(
  aaoifiDatasetRows.map((row) => [normalizeTicker(row.ticker), row])
) as Record<string, AaoifiDatasetRow>;

function buildAaoifiScreening(seed: CompanySeed): AaoifiScreening {
  const match = aaoifiByTicker[normalizeTicker(seed.ticker)];

  if (match) {
    return {
      status: normalizeAaoifiStatus(match.shariaStatus),
      comment: match.screeningComment.trim(),
      activityClassification: match.activityClassification,
      debtRatio: match.debtRatio,
      debtStatus: match.debtStatus,
      depositsRatio: match.depositsRatio,
      depositsStatus: match.depositsStatus,
      nonCompliantRevenueRatio: match.nonCompliantRevenueRatio,
      revenueStatus: match.revenueStatus,
    };
  }

  return {
    status: "under_review",
    comment: aaoifiPendingComment,
    activityClassification: null,
    debtRatio: null,
    debtStatus: null,
    depositsRatio: null,
    depositsStatus: null,
    nonCompliantRevenueRatio: null,
    revenueStatus: null,
  };
}

function buildCompany(seed: CompanySeed): CompanyScreeningData {
  return {
    ...seed,
    ticker: normalizeTicker(seed.ticker),
    note: `${seed.name} is included in the current EinveX screener for the Casablanca Stock Exchange universe.`,
    description: `${seed.name} is presented as a locally listed ${seed.sector.toLowerCase()} company in the current EinveX screening experience.`,
    reasoning: `This AAOIFI-based view reflects the current EinveX screening status for ${seed.name}.`,
    aaoifi: buildAaoifiScreening(seed),
  };
}

export const companies = companySeeds
  .map((seed) => buildCompany(seed))
  .sort((left, right) => left.name.localeCompare(right.name));

export const companyScreeningData: Record<string, CompanyScreeningData> =
  Object.fromEntries(companies.map((company) => [company.ticker, company]));

export function formatScreeningStatus(status: ScreeningStatus): FinalStatus {
  if (status === "sharia_compliant") {
    return "Sharia-compliant";
  }

  if (status === "not_sharia_compliant") {
    return "Not Sharia-compliant";
  }

  return "Under review";
}

export function getFinalStatus(screening: AaoifiScreening): FinalStatus {
  return formatScreeningStatus(screening.status);
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

export interface CBCReport {
  id: string;
  testDate: string;
  wbcCount: number | null;
  rbcCount: number | null;
  hemoglobin: number | null;
  hematocrit: number | null;
  plateletCount: number | null;
  neutrophils: number | null;
  lymphocytes: number | null;
  monocytes: number | null;
  eosinophils: number | null;
  basophils: number | null;
  mcv: number | null;
  mch: number | null;
  mchc: number | null;
  notes: string;
}

export interface AnalysisResult {
  id: string;
  reportId: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  riskScore: number;
  detectedAbnormalities: Abnormality[];
  cancerIndicators: CancerIndicator[];
  recommendations: string;
  confidenceScore: number;
  analyzedAt: string;
}

export interface Abnormality {
  parameter: string;
  value: number;
  normalRange: string;
  deviation: string;
}

export interface CancerIndicator {
  type: string;
  description: string;
  severity: 'low' | 'moderate' | 'high';
}

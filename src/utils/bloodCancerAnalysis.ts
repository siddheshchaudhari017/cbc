import { CBCReport, AnalysisResult, Abnormality, CancerIndicator } from '../types';

const NORMAL_RANGES = {
  wbcCount: { min: 4.5, max: 11.0, unit: '10³/μL' },
  rbcCount: { min: 4.5, max: 5.9, unit: '10⁶/μL' },
  hemoglobin: { min: 13.5, max: 17.5, unit: 'g/dL' },
  hematocrit: { min: 38.3, max: 48.6, unit: '%' },
  plateletCount: { min: 150, max: 400, unit: '10³/μL' },
  neutrophils: { min: 40, max: 70, unit: '%' },
  lymphocytes: { min: 20, max: 40, unit: '%' },
  monocytes: { min: 2, max: 8, unit: '%' },
  eosinophils: { min: 1, max: 4, unit: '%' },
  basophils: { min: 0.5, max: 1, unit: '%' },
  mcv: { min: 80, max: 100, unit: 'fL' },
  mch: { min: 27, max: 31, unit: 'pg' },
  mchc: { min: 32, max: 36, unit: 'g/dL' },
};

export function analyzeCBCReport(report: CBCReport): AnalysisResult {
  const abnormalities: Abnormality[] = [];
  const cancerIndicators: CancerIndicator[] = [];
  let riskScore = 0;

  Object.keys(NORMAL_RANGES).forEach((key) => {
    const value = report[key as keyof CBCReport] as number | null;
    if (value !== null && typeof value === 'number') {
      const range = NORMAL_RANGES[key as keyof typeof NORMAL_RANGES];

      if (value < range.min || value > range.max) {
        const deviation = value < range.min ?
          `${((range.min - value) / range.min * 100).toFixed(1)}% below normal` :
          `${((value - range.max) / range.max * 100).toFixed(1)}% above normal`;

        abnormalities.push({
          parameter: key.replace(/([A-Z])/g, ' $1').trim().toUpperCase(),
          value,
          normalRange: `${range.min}-${range.max} ${range.unit}`,
          deviation,
        });

        const deviationPercent = value < range.min ?
          (range.min - value) / range.min * 100 :
          (value - range.max) / range.max * 100;

        riskScore += Math.min(deviationPercent * 0.5, 15);
      }
    }
  });

  if (report.wbcCount !== null) {
    if (report.wbcCount > 30) {
      cancerIndicators.push({
        type: 'Leukemia',
        description: 'Extremely elevated WBC count suggests possible acute or chronic leukemia',
        severity: 'high',
      });
      riskScore += 25;
    } else if (report.wbcCount > 20) {
      cancerIndicators.push({
        type: 'Leukocytosis',
        description: 'Significantly elevated WBC count may indicate leukemia or lymphoma',
        severity: 'moderate',
      });
      riskScore += 15;
    }
  }

  if (report.lymphocytes !== null && report.lymphocytes > 50) {
    cancerIndicators.push({
      type: 'Lymphocytic Leukemia',
      description: 'Elevated lymphocyte percentage suggests possible chronic lymphocytic leukemia (CLL)',
      severity: 'high',
    });
    riskScore += 20;
  }

  if (report.plateletCount !== null && report.plateletCount < 50) {
    cancerIndicators.push({
      type: 'Thrombocytopenia',
      description: 'Severe low platelet count may indicate bone marrow disorders or leukemia',
      severity: 'high',
    });
    riskScore += 18;
  } else if (report.plateletCount !== null && report.plateletCount > 600) {
    cancerIndicators.push({
      type: 'Thrombocytosis',
      description: 'Elevated platelet count could indicate myeloproliferative disorders',
      severity: 'moderate',
    });
    riskScore += 12;
  }

  if (report.hemoglobin !== null && report.hemoglobin < 10) {
    cancerIndicators.push({
      type: 'Severe Anemia',
      description: 'Low hemoglobin may be associated with blood cancers affecting red blood cell production',
      severity: 'moderate',
    });
    riskScore += 12;
  }

  if (report.neutrophils !== null && report.neutrophils < 30) {
    cancerIndicators.push({
      type: 'Neutropenia',
      description: 'Low neutrophil count may indicate bone marrow suppression from leukemia',
      severity: 'moderate',
    });
    riskScore += 10;
  }

  const multipleAbnormalities = abnormalities.length >= 5;
  if (multipleAbnormalities) {
    riskScore += 15;
  }

  riskScore = Math.min(riskScore, 100);

  let riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  if (riskScore < 25) riskLevel = 'low';
  else if (riskScore < 50) riskLevel = 'moderate';
  else if (riskScore < 75) riskLevel = 'high';
  else riskLevel = 'critical';

  const recommendations = generateRecommendations(riskLevel, cancerIndicators, abnormalities);
  const confidenceScore = calculateConfidence(report, abnormalities.length);

  return {
    id: crypto.randomUUID(),
    reportId: report.id,
    riskLevel,
    riskScore: Math.round(riskScore * 100) / 100,
    detectedAbnormalities: abnormalities,
    cancerIndicators,
    recommendations,
    confidenceScore: Math.round(confidenceScore * 100) / 100,
    analyzedAt: new Date().toISOString(),
  };
}

function generateRecommendations(
  riskLevel: string,
  cancerIndicators: CancerIndicator[],
  abnormalities: Abnormality[]
): string {
  let recommendations = '';

  if (riskLevel === 'critical') {
    recommendations = 'URGENT: Immediate consultation with a hematologist/oncologist is strongly recommended. ';
    recommendations += 'Additional diagnostic tests including bone marrow biopsy, flow cytometry, and comprehensive metabolic panel should be conducted as soon as possible. ';
  } else if (riskLevel === 'high') {
    recommendations = 'High Priority: Schedule an appointment with a hematologist within 1-2 weeks. ';
    recommendations += 'Further testing including peripheral blood smear, bone marrow aspiration, and molecular studies may be necessary. ';
  } else if (riskLevel === 'moderate') {
    recommendations = 'Follow-up recommended: Consult with your primary care physician or hematologist within 2-4 weeks. ';
    recommendations += 'Repeat CBC test and additional blood work may be needed to monitor trends. ';
  } else {
    recommendations = 'Low risk detected. Continue routine health monitoring. ';
    recommendations += 'Maintain regular check-ups and repeat CBC annually or as recommended by your physician. ';
  }

  if (cancerIndicators.length > 0) {
    recommendations += '\n\nSpecific concerns identified: ';
    cancerIndicators.forEach(indicator => {
      recommendations += `${indicator.type} - ${indicator.description}. `;
    });
  }

  if (abnormalities.length > 3) {
    recommendations += '\n\nMultiple abnormal parameters detected. Comprehensive evaluation is important to determine the underlying cause.';
  }

  recommendations += '\n\nNote: This AI-based analysis is a screening tool and should not replace professional medical diagnosis. Always consult with qualified healthcare professionals for proper evaluation and treatment.';

  return recommendations;
}

function calculateConfidence(report: CBCReport, abnormalitiesCount: number): number {
  let confidence = 70;

  const providedParams = Object.keys(report).filter(key => {
    const value = report[key as keyof CBCReport];
    return value !== null && value !== '' && key !== 'id' && key !== 'testDate' && key !== 'notes';
  }).length;

  const totalParams = 13;
  const completeness = (providedParams / totalParams) * 100;

  confidence += (completeness / 100) * 20;

  if (abnormalitiesCount === 0) {
    confidence += 10;
  } else if (abnormalitiesCount > 5) {
    confidence += 5;
  }

  return Math.min(confidence, 99);
}

import { AlertTriangle, CheckCircle, TrendingUp, Activity, FileText } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
}

export default function ResultsDashboard({ result, onNewAnalysis }: ResultsDashboardProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-700 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="w-8 h-8" />;
      case 'moderate': return <TrendingUp className="w-8 h-8" />;
      case 'high': return <AlertTriangle className="w-8 h-8" />;
      case 'critical': return <AlertTriangle className="w-8 h-8" />;
      default: return <Activity className="w-8 h-8" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border-2 p-8 ${getRiskColor(result.riskLevel)}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              {getRiskIcon(result.riskLevel)}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2 uppercase">{result.riskLevel} Risk</h2>
              <p className="text-lg font-medium">Risk Score: {result.riskScore}/100</p>
              <p className="text-sm mt-1">AI Confidence: {result.confidenceScore}%</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-75">Analyzed</p>
            <p className="text-sm font-medium">
              {new Date(result.analyzedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {result.cancerIndicators.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-bold text-gray-900">Cancer Indicators Detected</h3>
          </div>
          <div className="space-y-3">
            {result.cancerIndicators.map((indicator, index) => (
              <div key={index} className="border-l-4 border-red-400 pl-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900">{indicator.type}</h4>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getSeverityColor(indicator.severity)}`}>
                    {indicator.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{indicator.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.detectedAbnormalities.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Abnormal Parameters ({result.detectedAbnormalities.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Parameter</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Your Value</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Normal Range</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Deviation</th>
                </tr>
              </thead>
              <tbody>
                {result.detectedAbnormalities.map((abnormality, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{abnormality.parameter}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{abnormality.value}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{abnormality.normalRange}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {abnormality.deviation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">Recommendations</h3>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{result.recommendations}</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 mb-2">Important Disclaimer</h4>
        <p className="text-sm text-blue-800">
          This AI-based screening tool is designed to assist with early detection but should not be used as the sole basis for diagnosis.
          Always consult with qualified healthcare professionals for comprehensive evaluation, proper diagnosis, and treatment planning.
        </p>
      </div>

      <button
        onClick={onNewAnalysis}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm"
      >
        Analyze New Report
      </button>
    </div>
  );
}

import { useState } from 'react';
import { Droplets, Sparkles, BarChart3 } from 'lucide-react';
import CBCInputForm from './components/CBCInputForm';
import ResultsDashboard from './components/ResultsDashboard';
import { CBCReport, AnalysisResult } from './types';
import { analyzeCBCReport } from './utils/bloodCancerAnalysis';

function App() {
  const [currentView, setCurrentView] = useState<'input' | 'results'>('input');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [reports, setReports] = useState<CBCReport[]>([]);

  const handleReportSubmit = (report: CBCReport) => {
    const result = analyzeCBCReport(report);
    setReports(prev => [...prev, report]);
    setAnalysisResult(result);
    setCurrentView('results');
  };

  const handleNewAnalysis = () => {
    setCurrentView('input');
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">HemoAI</h1>
                <p className="text-sm text-gray-500">AI-Powered Blood Cancer Detection</p>
              </div>
            </div>
            {reports.length > 0 && (
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {reports.length} Report{reports.length !== 1 ? 's' : ''} Analyzed
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Early Detection Saves Lives
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            {currentView === 'input' ? 'CBC Report Analysis' : 'Analysis Results'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {currentView === 'input'
              ? 'Enter your Complete Blood Count parameters for AI-powered blood cancer screening'
              : 'Review your analysis results and recommendations'}
          </p>
        </div>

        {currentView === 'input' && <CBCInputForm onSubmit={handleReportSubmit} />}
        {currentView === 'results' && analysisResult && (
          <ResultsDashboard result={analysisResult} onNewAnalysis={handleNewAnalysis} />
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">AI-Powered Analysis</h3>
            <p className="text-sm text-gray-600">
              Advanced algorithms analyze CBC parameters to detect early signs of blood cancer
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Comprehensive Reports</h3>
            <p className="text-sm text-gray-600">
              Detailed risk assessment with specific cancer indicators and abnormality tracking
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Droplets className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Affordable Screening</h3>
            <p className="text-sm text-gray-600">
              Cost-effective early detection tool accessible to everyone, enabling faster intervention
            </p>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-3">About Blood Cancer Detection</h3>
          <p className="text-blue-50 leading-relaxed mb-4">
            Blood cancers such as leukemia, lymphoma, and myeloma affect the production and function of blood cells.
            Early detection through CBC analysis can significantly improve treatment outcomes and survival rates.
            Our AI system analyzes multiple blood parameters to identify patterns associated with various blood cancers,
            providing an affordable and accessible screening tool.
          </p>
          <p className="text-sm text-blue-100 font-medium">
            Remember: This tool supports medical decision-making but does not replace professional diagnosis.
          </p>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-500">
            HemoAI - AI-Based Blood Cancer Detection System | Developed for early screening and affordable healthcare access
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

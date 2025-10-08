import { useState } from 'react';
import { Activity } from 'lucide-react';
import { CBCReport } from '../types';

interface CBCInputFormProps {
  onSubmit: (report: CBCReport) => void;
}

export default function CBCInputForm({ onSubmit }: CBCInputFormProps) {
  const [formData, setFormData] = useState<Partial<CBCReport>>({
    testDate: new Date().toISOString().split('T')[0],
    wbcCount: null,
    rbcCount: null,
    hemoglobin: null,
    hematocrit: null,
    plateletCount: null,
    neutrophils: null,
    lymphocytes: null,
    monocytes: null,
    eosinophils: null,
    basophils: null,
    mcv: null,
    mch: null,
    mchc: null,
    notes: '',
  });

  const handleChange = (field: keyof CBCReport, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'notes' || field === 'testDate' ? value : value === '' ? null : parseFloat(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const report: CBCReport = {
      id: crypto.randomUUID(),
      ...formData,
      testDate: formData.testDate || new Date().toISOString().split('T')[0],
      notes: formData.notes || '',
    } as CBCReport;
    onSubmit(report);
  };

  const inputFields = [
    { name: 'wbcCount', label: 'WBC Count', unit: '10³/μL', range: '4.5-11.0' },
    { name: 'rbcCount', label: 'RBC Count', unit: '10⁶/μL', range: '4.5-5.9' },
    { name: 'hemoglobin', label: 'Hemoglobin', unit: 'g/dL', range: '13.5-17.5' },
    { name: 'hematocrit', label: 'Hematocrit', unit: '%', range: '38.3-48.6' },
    { name: 'plateletCount', label: 'Platelet Count', unit: '10³/μL', range: '150-400' },
    { name: 'neutrophils', label: 'Neutrophils', unit: '%', range: '40-70' },
    { name: 'lymphocytes', label: 'Lymphocytes', unit: '%', range: '20-40' },
    { name: 'monocytes', label: 'Monocytes', unit: '%', range: '2-8' },
    { name: 'eosinophils', label: 'Eosinophils', unit: '%', range: '1-4' },
    { name: 'basophils', label: 'Basophils', unit: '%', range: '0.5-1' },
    { name: 'mcv', label: 'MCV', unit: 'fL', range: '80-100' },
    { name: 'mch', label: 'MCH', unit: 'pg', range: '27-31' },
    { name: 'mchc', label: 'MCHC', unit: 'g/dL', range: '32-36' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Activity className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enter CBC Report Data</h2>
          <p className="text-sm text-gray-500 mt-1">Complete Blood Count parameters for analysis</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Date
          </label>
          <input
            type="date"
            value={formData.testDate}
            onChange={(e) => handleChange('testDate', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inputFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                <span className="text-xs text-gray-500 ml-2">({field.unit})</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData[field.name as keyof CBCReport] ?? ''}
                onChange={(e) => handleChange(field.name as keyof CBCReport, e.target.value)}
                placeholder={`Normal: ${field.range}`}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            placeholder="Any additional observations or symptoms..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm"
        >
          Analyze Report
        </button>
      </form>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Upload, AlertCircle, Loader2 } from 'lucide-react';

const MELBOURNE_COUNCILS = [
  'Banyule City Council',
  'Bayside City Council',
  'Boroondara City Council',
  'Brimbank City Council',
  'Cardinia Shire Council',
  'Casey City Council',
  'Darebin City Council',
  'Frankston City Council',
  'Glen Eira City Council',
  'Greater Dandenong City Council',
  'Hobsons Bay City Council',
  'Hume City Council',
  'Kingston City Council',
  'Knox City Council',
  'Manningham City Council',
  'Maribyrnong City Council',
  'Maroondah City Council',
  'Melbourne City Council',
  'Melton City Council',
  'Monash City Council',
  'Moonee Valley City Council',
  'Moreland City Council',
  'Mornington Peninsula Shire Council',
  'Nillumbik Shire Council',
  'Port Phillip City Council',
  'Stonnington City Council',
  'Whitehorse City Council',
  'Whittlesea City Council',
  'Wyndham City Council',
  'Yarra City Council',
  'Yarra Ranges Shire Council',
];

const PLANNING_ZONES = [
  'Residential Growth Zone (RGZ)',
  'General Residential Zone (GRZ)',
  'Neighbourhood Residential Zone (NRZ)',
  'Mixed Use Zone (MUZ)',
  'Township Zone (TZ)',
  'Low Density Residential Zone (LDRZ)',
];

export default function NewProject() {
  const { data: session } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    projectNumber: '',
    projectName: '',
    northOrientation: 0,
    localCouncil: '',
    planningZone: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'dwg' && fileExtension !== 'rvt') {
      setError('Please upload a .dwg or .rvt file');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please upload a file');
      return;
    }

    if (!formData.projectNumber || !formData.projectName || !formData.localCouncil || !formData.planningZone) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Create form data
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('projectNumber', formData.projectNumber);
      uploadData.append('projectName', formData.projectName);
      uploadData.append('northOrientation', formData.northOrientation.toString());
      uploadData.append('localCouncil', formData.localCouncil);
      uploadData.append('planningZone', formData.planningZone);

      // Submit to API
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create project');
        setLoading(false);
        return;
      }

      // Redirect to project page
      router.push(`/dashboard/projects/${data.projectId}`);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Generate New Plans</h1>
          <p className="text-gray-600 mt-2">
            Upload your CAD file and provide project details
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              CAD File (.dwg or .rvt) <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition">
              <input
                type="file"
                accept=".dwg,.rvt"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                {file ? (
                  <p className="text-sm text-gray-900 font-medium">{file.name}</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      DWG or RVT files only
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Project Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.projectNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, projectNumber: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 2025-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.projectName}
                  onChange={(e) =>
                    setFormData({ ...formData, projectName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Smith Residence"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                North Orientation (degrees) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={formData.northOrientation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      northOrientation: parseInt(e.target.value),
                    })
                  }
                  className="flex-1"
                />
                <span className="text-lg font-semibold text-gray-900 w-16">
                  {formData.northOrientation}°
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Local Council <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.localCouncil}
                onChange={(e) =>
                  setFormData({ ...formData, localCouncil: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a council</option>
                {MELBOURNE_COUNCILS.map((council) => (
                  <option key={council} value={council}>
                    {council}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planning Zone <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.planningZone}
                onChange={(e) =>
                  setFormData({ ...formData, planningZone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a planning zone</option>
                {PLANNING_ZONES.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Plans...
              </>
            ) : (
              'Generate Plans'
            )}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

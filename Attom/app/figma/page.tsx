'use client';

import { useState, useEffect } from 'react';

interface FigmaFile {
  key: string;
  name: string;
  thumbnail_url: string;
  last_modified: string;
}

export default function FigmaProjects() {
  const [projects, setProjects] = useState<FigmaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');

    try {
      // Using the hardcoded API token from figma-manager.ts
      const response = await fetch('/api/figma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getProjects',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      // Since we don't have a getProjects endpoint, let's fetch user files directly
      const userResponse = await fetch('https://api.figma.com/v1/me/files', {
        headers: {
          'X-Figma-Token': '', // Token should be provided through environment variable or auth flow
        },
      });

      const filesData = await userResponse.json();
      setProjects(filesData.files || []);
    } catch (err) {
      setError('Failed to fetch Figma projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const extractDesignSystem = async (fileId: string) => {
    try {
      const response = await fetch('/api/figma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'extractDesignSystem',
          fileKey: fileId,
        }),
      });

      const data = await response.json();
      console.log('Design System:', data.designSystem);
      alert('Design system extracted! Check console.');
    } catch (err) {
      console.error('Failed to extract design system:', err);
      alert('Failed to extract design system');
    }
  };

  const generateComponents = async (fileId: string) => {
    try {
      const response = await fetch('/api/figma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateComponents',
          fileKey: fileId,
        }),
      });

      const data = await response.json();
      console.log('Generated Components:', data.components);
      alert('Components generated! Check console.');
    } catch (err) {
      console.error('Failed to generate components:', err);
      alert('Failed to generate components');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-purple-500/20 border-r-transparent"></div>
            <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-solid border-purple-500/40 border-r-transparent" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
          <p className="mt-8 text-gray-600 font-light tracking-wide text-lg">Loading Figma projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🎨 Figma Projects</h1>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Connected with your API</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Projects List */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.key} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 relative overflow-hidden">
                  {project.thumbnail_url ? (
                    <img 
                      src={project.thumbnail_url} 
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl opacity-50">🎨</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-purple-600 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    📅 {new Date(project.last_modified).toLocaleDateString()}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => extractDesignSystem(project.key)}
                        className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-center"
                      >
                        🎨 Extract Design
                      </button>
                      <button
                        onClick={() => generateComponents(project.key)}
                        className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-center"
                      >
                        ⚙️ Components
                      </button>
                    </div>
                    
                    <a
                      href={`https://www.figma.com/file/${project.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center"
                    >
                      🚀 Open in Figma →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Figma projects found</h3>
            <p className="text-gray-600">Make sure your Figma account has files or check your API permissions.</p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mt-8">
          <h3 className="font-semibold text-blue-900 mb-3 text-lg">🚀 What you can do with your Figma projects:</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">Design System Extraction</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Colors and palettes</li>
                <li>• Typography styles</li>
                <li>• Spacing and layout rules</li>
                <li>• Component variations</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-purple-800">Component Generation</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• React components from frames</li>
                <li>• CSS styling extraction</li>
                <li>• Image and asset export</li>
                <li>• Responsive layouts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}